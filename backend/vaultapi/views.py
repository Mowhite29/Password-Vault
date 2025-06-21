from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
import boto3
from botocore.exceptions import ClientError
from .models import VaultEntry
from .serializers import (
    VaultSerializer, RegisterSerializer,
    PasswordChangeSerializer
)


class RegisterView(APIView):
    throttle_classes = [AnonRateThrottle]
    def post(self, request):
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
                            'Data': email_subject,
                        },
                    },
                    Source=settings.DEFAULT_FROM_EMAIL,
                )

            except ClientError as e:
                print(f"An error occurred: {e.response['Error']['Message']}")
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                print(activation_link)
                print(f"Email sent! Message ID: {response['MessageId']}")
                return Response({"detail":
                                ("A confirmation email has been sent "
                                        "to your email address.")},
                status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyView(APIView):
    throttle_classes = [AnonRateThrottle]
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid activation link"},
                            status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token"},
                            status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()
        return Response({"message":
                        "Email verified successfully. You can now log in."},
                        status=status.HTTP_200_OK)


class VaultView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

    def get(self, request):
        # Retrieve password list
        vaults = VaultEntry.objects.filter(user=request.user)
        serializer = VaultSerializer(vaults, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create new entry
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
                return Response({"message": "Password saved"},
                                status=status.HTTP_200_OK)
            else:
                return Response({"error": "Password already exists for this username"},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=400)

    def put(self, request):
        # Update entry
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
                return Response({"error": "Entry not found"},
                                status=status.HTTP_404_NOT_FOUND)
            entry.encrypted_password = validated_data.get('encrypted_password')
            entry.salt = validated_data.get('salt')
            entry.nonce = validated_data.get('nonce')
            entry.notes = validated_data.get('notes', '')
            entry.updated_at = timezone.now
            entry.save()
            return Response({"message": "Entry Updated"},
                            status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Delete entry
        serializer = VaultSerializer(data=request.data,
                                     context={'request': request})
        if serializer.is_valid():
            validated_data = serializer.validated_data
            label = validated_data.get('label')
            username = validated_data.get('username')
            encrypted_password = validated_data.get('encrypted_password')
            try:
                entry = VaultEntry.objects.get(user=request.user, label=label,
                                        username=username,
                                        encrypted_password=encrypted_password)
            except VaultEntry.DoesNotExist:
                return Response({"error": "Entry not found"},
                                status=status.HTTP_404_NOT_FOUND)
            entry.delete()
            return Response({"message": "Password deleted"},
                            status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChange(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            password_change_url = (
                f"{settings.FRONTEND_URL}/confirm-password-change/{uid}/{token}")

            email_subject = "Confirm Your Password Change"
            email_message = render_to_string(
                            "email/password_change_confirmation.html",
                            {
                                'user': user,
                                'password_change_url': password_change_url
                            })
            client = boto3.client('ses', region_name=settings.AWS_REGION_NAME)
            try:
                response = client.send_email(
                    Destination={
                        'ToAddresses': [user.email],
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
                            'Data': email_subject,
                        },
                    },
                    Source=settings.DEFAULT_FROM_EMAIL,
                )

            except ClientError as e:
                print(f"An error occurred: {e.response['Error']['Message']}")
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                print(f"Email sent! Message ID: {response['MessageId']}")
                return Response({"detail":
                    "A confirmation email has been sent to your email address."},
                    status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordReset(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            username = request.data.get('username')
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"detail": "User not found"},
                                status=status.HTTP_404_NOT_FOUND)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            password_change_url = (
                f"{settings.FRONTEND_URL}/confirm-password-change/{uid}/{token}")

            email_subject = "Confirm Your Password Change"
            email_message = render_to_string(
                "email/password_change_confirmation.html",
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
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                print(f"Email sent! Message ID: {response['MessageId']}")
                return Response({"detail":
                                ("A confirmation email has been "
                                    "sent to your email address.")},
                                    status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeConfirm(APIView):
    throttle_classes = [AnonRateThrottle]
    
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid user"},
                            status=status.HTTP_404_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid token"},
                            status=status.HTTP_404_BAD_REQUEST)

        new_password = request.data.get('new_password')
        if not new_password:
            return Response({"detail": "New password is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "password updated"},
                        status=status.HTTP_200_OK)
