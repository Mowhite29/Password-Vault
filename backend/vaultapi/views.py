from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
import boto3
from botocore.exceptions import ClientError
import logging
from .models import VaultEntry, UserKeys
from .serializers import (
    VaultSerializer, RegisterSerializer,
    UserKeySerializer, UserSerializer
)

logger = logging.getLogger(__name__)


def ping_view(request):
    return JsonResponse({"status": "ok"}, status=200)


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

            email_subject = "Verify your email"
            email_message = render_to_string("email/verify_email.html",
                                        {
                                            'user': user,
                                            'activation_link': activation_link
                                        })

            client = boto3.client('ses', region_name=settings.AWS_REGION_NAME)

            try:
                response = client.send_email(
                    Destination={'ToAddresses': [user.email]},
                    Message={
                        'Body': {
                            'Html': {'Charset': 'UTF-8', 'Data': email_message}
                        },
                        'Subject': {'Charset': 'UTF-8', 'Data': email_subject},
                    },
                    Source=settings.DEFAULT_FROM_EMAIL,
                )

            except ClientError as e:
                print(f"An error occurred: {e.response['Error']['Message']}")
                logger.error(f'{user.username} {e.response['Error']['Message']}')
                return Response({"error": serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                print(activation_link)
                print(f"Email sent! Message ID: {response['MessageId']}")
                logger.info(f'Confirmation email sent to {user.username}')
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
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

    # Retrieve user key information
    def get(self, request):
        logger.info("Get user key accessed.")
        try:
            userKeys = UserKeys.objects.get(user=request.user)
            serializer = UserKeySerializer(userKeys)
            logger.info(f'User key accessed by {userKeys.user.username}')
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserKeys.DoesNotExist:
            logger.error(f'User {request.user.username} '
                        'attempted to access user key prior to it being set.')
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
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

    # Retrieve password list
    def get(self, request):
        logger.info("Get vault accessed.")
        vaults = VaultEntry.objects.filter(user=request.user)
        serializer = VaultSerializer(vaults, many=True)
        logger.info(f'User {request.user.username} retrieved vault.')
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
                logger.info(f'User {request.user.username} created '
                                    'new entry.')
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
            entry.updated_at = timezone.now
            entry.save()
            logger.info(f'User {request.user.username} updated entry for {label} {username}')
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
                logger.error(f'User {request.user.username} attempted '
                            'to delete a nonexistant entry.')
                return Response({"error": "Entry not found"},
                                status=status.HTTP_404_NOT_FOUND)
            entry.delete()
            logger.info(f'User {request.user.username} deleted entry for {label} {username}')
            return Response({"message": "Password deleted"},
                            status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response({"error": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class PasswordChange(APIView):
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

        email_subject = "Confirm Your Password Change"
        email_message = render_to_string(
                        "email/password_change.html",
                        {
                            'user': user,
                            'password_change_url': password_change_url
                        })
        client = boto3.client('ses', region_name=settings.AWS_REGION_NAME)
        try:
            response = client.send_email(
                Destination={'ToAddresses': [user.email]},
                Message={
                    'Body': {
                        'Html': {
                            'Charset': 'UTF-8',
                            'Data': email_message
                        }
                    },
                    'Subject': {
                        'Charset': 'UTF-8',
                        'Data': email_subject,
                    },
                },
                Source=settings.DEFAULT_FROM_EMAIL,
            )
        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            logger.error(e.response['Error']['Message'])
            return Response({"error": e.response['Error']['Message']},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            print(f"Email sent! Message ID: {response['MessageId']}")
            logger.info(f'User {user.username} requested password change.')
            return Response({"message":
                                "A confirmation email has been "
                                "sent to your email address."},
                                status=status.HTTP_200_OK)


class PasswordChangeDemo(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    # Password change request from authenticated user
    def post(self, request):
        logger.info("Password change request accessed.")
        user = request.user
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        logger.info(f'User {user.username} requested password change.')
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

        email_subject = "Confirm Your Password Change"
        email_message = render_to_string(
            "email/password_change.html",
            {
                'user': user,
                'password_change_url': password_change_url
            })
        client = boto3.client('ses', region_name=settings.AWS_REGION_NAME)
        try:
            response = client.send_email(
                Destination={
                    'ToAddresses': [user.email]
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': 'UTF-8',
                            'Data': email_message
                        }
                    },
                    'Subject': {
                        'Charset': 'UTF-8',
                        'Data': email_subject
                    },
                },
                Source=settings.DEFAULT_FROM_EMAIL
            )

        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            logger.error(e.response['Error']['Message'])
            return Response({"error": e.response['Error']['Message']},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            print(f"Email sent! Message ID: {response['MessageId']}")
            logger.info(f'User {username} requested password change.')
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
        logger.info(f'User {username} requested password change.')
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
        logger.info(f'User {user.username} changed password')
        return Response({"message": "password updated"},
                            status=status.HTTP_200_OK)


class EmailChangeRequest(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    # Email change request from authenticated user
    def post(self, request):
        logger.info("Email change request accessed.")
        user = request.user
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        email_change_url = (
            f"{settings.FRONTEND_URL}/email-change-confirm/{uid}/{token}")

        email_subject = "Confirm Your Email Address Change"
        email_message = render_to_string(
                            "email/email_change.html",
                            {
                                'user': user,
                                'email_change_url': email_change_url
                            })
        client = boto3.client('ses', region_name=settings.AWS_REGION_NAME)
        try:
            response = client.send_email(
                Destination={'ToAddresses': [user.email]},
                Message={
                    'Body': {
                        'Html': {'Charset': 'UTF-8', 'Data': email_message}
                    },
                    'Subject': {'Charset': 'UTF-8', 'Data': email_subject},
                },
                Source=settings.DEFAULT_FROM_EMAIL,
            )
        except ClientError as e:
            print(f"An error occurred: {e.response['Error']['Message']}")
            logger.error(e.response['Error']['Message'])
            return Response({"error": e.response['Error']['Message']},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            print(f"Email sent! Message ID: {response['MessageId']}")
            logger.info(f'User {user.username} requested email change.')
            return Response({"message":
                                "A confirmation email has been "
                                "sent to your email address."},
                                status=status.HTTP_200_OK)


class EmailChangeRequestDemo(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    # Email change request from authenticated user
    def post(self, request):
        logger.info("Email change request accessed.")
        user = request.user
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        logger.info(f'User {user.username} requested email change.')
        return Response({'uid': uid, 'token': token,
                            'user': user.first_name, 'email': user.email},
                            status=status.HTTP_200_OK)


class EmailChangeConfirm(APIView):
    throttle_classes = [AnonRateThrottle]

    # Email change confirmation
    def post(self, request, uidb64, token):
        logger.info("Email change confirm accessed.")
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            logger.error("Email reset requested for invalid user.")
            return Response({"error": "Invalid user"},
                            status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, token):
            logger.error(f'User {user.username} provided invalid email '
                         'change token.')
            return Response({"error": "Invalid token"},
                            status=status.HTTP_400_BAD_REQUEST)
        new_email = request.data.get('new_email')
        if not new_email:
            logger.info(f'User {request.user.username} did not enter new email.')
            return Response({"error": "New email is required"},
                                status=status.HTTP_400_BAD_REQUEST)
        try:
            check = User.objects.get(username=new_email)
            logger.info(f'User {request.user.username} entered existing email.')
            return Response({"error": "Account already exists for this email"},
                                status=status.HTTP_400_BAD_REQUEST)
        except (check.DoesNotExist):
            user.username = new_email
            user.email = new_email
            user.save()
            logger.info(f'User {user.username} changed email')
            return Response({"message": "email updated"},
                                status=status.HTTP_200_OK)


class NameChange(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get(self, request):
        logger.info("nName request accessed")
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
