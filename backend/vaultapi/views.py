from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from botocore.exceptions import ClientError
import logging
import jwt
import pyotp
import resend
from .models import VaultEntry, UserKeys, UserProfile
from .serializers import (
    VaultSerializer, RegisterSerializer,
    UserKeySerializer, UserSerializer, CustomTokenRefreshSerializer
)

logger = logging.getLogger(__name__)

resend.api_key = settings.RESEND_KEY


@api_view(['POST'])
@csrf_exempt
def trigger_user_cleanup(request):
    logger.info("User cleanup accessed")
    token = request.headers.get('X_ADMIN_TOKEN')
    print(request.headers)
    if token != settings.ADMIN_CLEANUP_TOKEN:
        logger.error("Unauthorised access attempt to user cleanup")
        return Response({"error": "Unauthorized"},
                        status=status.HTTP_403_FORBIDDEN)

    count = User.objects.filter(is_staff=False).delete()
    logger.info(f"{count} users deleted")
    return Response({"deleted_users": count}, status=status.HTTP_200_OK)


def ping_view(request):
    return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def generate_totp_secret(user):
    totp_secret = pyotp.random_base32()[:16]
    totp = pyotp.TOTP(totp_secret).provisioning_uri(name=user.username,
                                                issuer_name='Password Vault')
    profile, create = UserProfile.objects.get_or_create(user=user)
    profile.totp_secret = totp_secret
    profile.save()
    return totp


def verify_totp(user, token):
    try:
        profile = UserProfile.objects.get(user=user)
        totp = pyotp.TOTP(profile.totp_secret)
        return totp.verify(token)
    except UserProfile.DoesNotExist:
        logger.info(f"TOTP not set up for user {user.username}")
        return False


class MobileRefresh(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer


class MobileLogin(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        logger.info("Mobile login accessed")
        username = request.data.get("username")
        password = request.data.get("password")
        device_id = request.data.get("device_id")

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                refresh['device_id'] = device_id
                logger.info(f'Mobile user {user.username} logged in')
                return Response(
                    {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    },
                    status=status.HTTP_200_OK
                )
            else:
                logger.error(f'Mobile user {user.username} '
                             'provided invalid credentials')
                return Response({"detail": "Invalid credentials."},
                                status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            logger.error("Mobile user provided invalid nonexistant "
                         "credentials")
            return Response({"detail": "Invalid credentials."},
                            status=status.HTTP_401_UNAUTHORIZED)


class DeviceAuthentication(BaseAuthentication):
    throttle_classes = [AnonRateThrottle]

    def authenticate(self, request):
        logger.info("Mobile authentication accessed")
        auth = request.headers.get('Authorization')
        if not auth:
            logger.error("Mobile user attempted authentication with missing "
                         "auth header")
            raise AuthenticationFailed('Authorization header missing')

        parts = auth.split()
        if len(parts) != 2:
            logger.error("Mobile user attempted authentication with "
                         "incorrectly formatted auth header")
            raise AuthenticationFailed('Authorization header format is '
                                       'Bearer <token>')

        token = parts[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY,
                                 algorithms=["HS256"])
            device_id_from_token = payload.get('device_id')
            device_id_from_request = request.data.get('device_id')
            if device_id_from_token != device_id_from_request:
                logger.error("Mobile user attempted authentication with "
                             "mismatched token and device ID")
                raise AuthenticationFailed('Device mismatch, access denied')

            user = User.objects.get(id=payload['user_id'])
            logger.info(f'Mobile user {user.username} authenticated '
                        'successfully')
            return (user, token)
        except jwt.ExpiredSignatureError:
            logger.error("Mobile user attempted authentication with "
                         "expired token")
            raise AuthenticationFailed('Token expired')
        except jwt.DecodeError:
            logger.error("Mobile user attempted authentication with "
                         "invalid token")
            raise AuthenticationFailed('Invalid token')


class Login(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        logger.info("User login accessed")
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            logger.info(f"Invalid credentials provided for {username} at {get_client_ip(request)}")
            return Response({"message": "Invalid credentials"},
                                    status=status.HTTP_403_FORBIDDEN)
        try:
            UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            logger.info(f"TOTP not set up for user {user.username}")
            token_secret = generate_totp_secret(user)
            return Response({"message": "TOTP unset",
                                "token_secret": token_secret},
                                status=status.HTTP_200_OK)
        logger.info(f"Credentials verified for {username} at {get_client_ip(request)}")
        return Response({"message": "Credentials verified"},
                        status=status.HTTP_200_OK)


class Authenticate(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        logger.info("User login accessed")
        username = request.data.get('username')
        totp_token = request.data.get('totp_token')

        user = User.objects.get(username=username)
        if not verify_totp(user, totp_token):
            logger.info(f"Invalid TOTP token provided for {user.username} at {get_client_ip(request)}")
            return Response({"message": "Invalid TOTP token"},
                            status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        logger.info(f"Successful authentication for {user.username} at {get_client_ip(request)}")
        return Response({"access": str(access_token), "refresh": str(refresh)},
                                    status=status.HTTP_200_OK)


class RegisterView(APIView):
    throttle_classes = [AnonRateThrottle]

    # Register new user
    def post(self, request):
        logger.info("Register endpoint accessed.")
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            activation_link = (
                f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"
            )

            email_message_html = render_to_string("email/verify_email.html",
                                        {
                                            'user': user,
                                            'activation_link': activation_link
                                        })
            email_message_txt = render_to_string("email/verify_email.txt",
                                        {
                                            'user': user,
                                            'activation_link': activation_link
                                        })

            params: resend.Emails.SendParams = {
                "from": f'Password Vault <verify-email{settings.DEFAULT_FROM_EMAIL}>',
                "to": [user.email],
                "subject": "Verify your email",
                "html": email_message_html,
                "text": email_message_txt
            }

            try:
                response = resend.Emails.send(params)

            except ClientError as e:
                print(f"An error occurred: {e.response['Error']['Message']}")
                logger.error(f'{user.username} {e.response['Error']['Message']}')
                return Response({"error": {e.response['Error']['Message']}},
                                status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                error_message = f"Unexpected error: {str(e)}"
                logger.error(error_message)
                return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                logger.info(f'Confirmation email sent to {user.username} by {get_client_ip(request)}. Message ID: {response['id']}')
                return Response({"message":
                                ("A confirmation email has been sent "
                                    "to your email address.")},
                status=status.HTTP_200_OK)

        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class RegisterViewDemo(APIView):
    throttle_classes = [AnonRateThrottle]

    # Register new user
    def post(self, request):
        logger.info("Register endpoint accessed.")
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            logger.info(f'Confirmation email sent to {user.username}')
            return Response({'uid': uid, 'token': token,
                            'user': user.username, 'email': user.email},
                            status=status.HTTP_200_OK)

        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyView(APIView):
    throttle_classes = [AnonRateThrottle]

    # User email verification
    def get(self, request, uidb64, token):
        logger.info("Email verification accessed.")
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            logger.error("Invalid activation link.")
            return Response({"error": "Invalid activation link"},
                            status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            logger.error(f'Invalid verification token for {user.username}')
            return Response({"error": "Invalid or expired token"},
                            status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()
        logger.info(f'{user.username} verified successfully.')
        return Response({"message":
                        "Email verified successfully. You can now log in."},
                        status=status.HTTP_200_OK)


class UserKeysView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

    # Retrieve user key information
    def get(self, request):
        logger.info("Get user key accessed.")
        try:
            userKeys = UserKeys.objects.get(user=request.user)
            serializer = UserKeySerializer(userKeys)
            logger.info(f'User key accessed by {userKeys.user.username} at {get_client_ip(request)}')
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserKeys.DoesNotExist:
            logger.error(f'User {request.user.username} attempted to access user key prior to it being set from {get_client_ip(request)}')
            return Response({"error": "Entry not found"},
                                status=status.HTTP_204_NO_CONTENT)

    # Save user key information
    def post(self, request):
        logger.info("Set user key accessed.")
        serializer = UserKeySerializer(data=request.data,
                                       context={'request': request})
        if serializer.is_valid():
            try:
                UserKeys.objects.get(user=request.user)
                logger.error(f'User {request.user.username} '
                                'attempted to set new user key.')
                return Response({'error': 'Key already exists for this user'},
                                status=status.HTTP_405_METHOD_NOT_ALLOWED)
            except UserKeys.DoesNotExist:
                logger.info(f'User {request.user.username} set new user key.')
                serializer.save()
                return Response({"message": "User key set"},
                                status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class VaultView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

    # Retrieve password list
    def get(self, request):
        logger.info("Get vault accessed")
        vaults = VaultEntry.objects.filter(user=request.user)
        serializer = VaultSerializer(vaults, many=True)
        logger.info(f'User {request.user.username} retrieved vault at {get_client_ip(request)}')
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create new entry
    def post(self, request):
        logger.info("Vault entry creation accessed.")
        serializer = VaultSerializer(data=request.data,
                                     context={'request': request})
        if serializer.is_valid():
            validated_data = serializer.validated_data
            label = validated_data.get('label')
            username = validated_data.get('username')
            try:
                VaultEntry.objects.get(user=request.user, label=label,
                                        username=username)
            except VaultEntry.DoesNotExist:
                serializer.save()
                logger.info(f'User {request.user.username} created new entry at {get_client_ip(request)}.')
                return Response({"message": "Password saved"},
                                status=status.HTTP_200_OK)
            else:
                logger.error(f'User {request.user.username} attempted '
                              'to create new entry using existing username.')
                return Response({
                    "error": "Password already exists for this username"},
                                status=status.HTTP_400_BAD_REQUEST)
        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

    # Update entry
    def put(self, request):
        logger.info("Update vault entry accessed.")
        serializer = VaultSerializer(data=request.data,
                                    context={'request': request})
        if serializer.is_valid():
            validated_data = serializer.validated_data
            label = validated_data.get('label')
            username = validated_data.get('username')
            try:
                entry = VaultEntry.objects.get(user=request.user,
                                               label=label, username=username)
            except VaultEntry.DoesNotExist:
                logger.error(f'User {request.user.username} attempted '
                             'to update a nonexistant entry')
                return Response({"error": "Entry not found"},
                                status=status.HTTP_404_NOT_FOUND)
            entry.encrypted_password = validated_data.get('encrypted_password')
            entry.salt = validated_data.get('salt')
            entry.nonce = validated_data.get('nonce')
            entry.notes = validated_data.get('notes', '')
            entry.tag = validated_data.get('tag', '')
            entry.updated_at = timezone.now
            entry.save()
            logger.info(f'User {request.user.username} updated entry for {label} {username} at {get_client_ip(request)}')
            return Response({"message": "Entry Updated"},
                            status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

    # Delete entry
    def delete(self, request):
        logger.info("Delete vault entry accessed.")
        serializer = VaultSerializer(data=request.data,
                                     context={'request': request})
        if serializer.is_valid():
            validated_data = serializer.validated_data
            label = validated_data.get('label')
            username = validated_data.get('username')
            try:
                entry = VaultEntry.objects.get(user=request.user, label=label,
                                        username=username)
            except VaultEntry.DoesNotExist:
                logger.error(f'User {request.user.username} attempted to delete a nonexistant entry at {get_client_ip(request)}.')
                return Response({"error": "Entry not found"},
                                status=status.HTTP_404_NOT_FOUND)
            entry.delete()
            logger.info(f'User {request.user.username} deleted entry for {label} {username} at {get_client_ip(request)}')
            return Response({"message": "Password deleted"},
                            status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class PasswordChange(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    # Password change request from authenticated user
    def post(self, request):
        logger.info("Password change request accessed.")
        user = request.user

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        password_change_url = (
            f"{settings.FRONTEND_URL}/confirm-password-change/{uid}/{token}")

        email_message_html = render_to_string("email/password_change.html",
                                        {
                                            'user': user,
                                            'password_change_url': password_change_url
                                        })
        email_message_txt = render_to_string("email/password_change.txt",
                                        {
                                            'user': user,
                                            'password_change_url': password_change_url
                                        })

        params: resend.Emails.SendParams = {
                "from": f'Password Vault <change-password{settings.DEFAULT_FROM_EMAIL}>',
                "to": [user.email],
                "subject": "Confirm your password change",
                "html": email_message_html,
                "text": email_message_txt
            }

        try:
            response = resend.Emails.send(params)

        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            logger.error(e.response['Error']['Message'])
            return Response({"error": e.response['Error']['Message']},
                            status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            logger.error(error_message)
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            logger.info(f'User {user.username} requested password change at {get_client_ip(request)}. Message ID: {response['id']}')
            return Response({"message":
                                "A confirmation email has been "
                                "sent to your email address."},
                                status=status.HTTP_200_OK)


class PasswordChangeDemo(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    # Password change request from authenticated user
    def post(self, request):
        logger.info("Password change request accessed.")
        user = request.user
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        logger.info(f'User {user.username} requested password change at {get_client_ip(request)}.')
        return Response({'uid': uid, 'token': token,
                            'user': user.username, 'email': user.email},
                            status=status.HTTP_200_OK)


class PasswordReset(APIView):
    throttle_classes = [AnonRateThrottle]

    # Password change request from unauthenticated user
    def post(self, request):
        logger.info("Password reset request accessed.")
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        password_change_url = (
            f'{settings.FRONTEND_URL}/confirm-password-change/{uid}/{token}')

        email_message_html = render_to_string("email/password_change.html",
                                        {
                                            'user': user,
                                            'password_change_url': password_change_url
                                        })
        email_message_txt = render_to_string("email/password_change.txt",
                                        {
                                            'user': user,
                                            'password_change_url': password_change_url
                                        })

        params: resend.Emails.SendParams = {
                "from": f'Password Vault <change-password{settings.DEFAULT_FROM_EMAIL}>',
                "to": [user.email],
                "subject": "Confirm your password change",
                "html": email_message_html,
                "text": email_message_txt
            }

        try:
            response = resend.Emails.send(params)

        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            logger.error(e.response['Error']['Message'])
            return Response({"error": e.response['Error']['Message']},
                            status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            logger.error(error_message)
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            print(f"Email sent! Message ID: {response['MessageId']}")
            logger.info(f'User {username} requested password change at {get_client_ip(request)}.')
            return Response({"message":
                            "A confirmation email has been "
                                "sent to your email address."},
                                status=status.HTTP_200_OK)


class PasswordResetDemo(APIView):
    throttle_classes = [AnonRateThrottle]

    # Password change request from unauthenticated user
    def post(self, request):
        logger.info("Password reset request accessed.")
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        logger.info(f'User {username} requested password change at {get_client_ip(request)}.')
        return Response({'uid': uid, 'token': token,
                            'user': user.first_name, 'email': user.email},
                            status=status.HTTP_200_OK)


class PasswordChangeConfirm(APIView):
    throttle_classes = [AnonRateThrottle]

    # Password change confirmation
    def post(self, request, uidb64, token):
        logger.info("Password change confirm accessed.")
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            logger.error("Password reset requested for invalid user.")
            return Response({"error": "Invalid user"},
                            status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            logger.error(f'User {user.username} provided invalid password '
                         'change token.')
            return Response({"error": "Invalid token"},
                            status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get('new_password')
        if not new_password:
            logger.error(f'User {user.username} did not enter new password.')
            return Response({"error": "New password is required"},
                                status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        logger.info(f'User {user.username} changed password at {get_client_ip(request)}')
        return Response({"message": "password updated"},
                            status=status.HTTP_200_OK)


class NameChange(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get(self, request):
        logger.info(f"Name request accessed by {request.user} at {get_client_ip(request)}")
        user = request.user
        return Response({"first_name": user.first_name, "last_name": user.last_name}, status=status.HTTP_200_OK)

    def post(self, request):
        logger.info("Name change accessed")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = request.user
            try:
                user.first_name = validated_data.get('first_name')
                user.last_name = validated_data.get('last_name')
                user.save()
            except ():
                return Response({"error": "Missing field/s"},
                        status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "name updated"},
                            status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)
