from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import base64
import re
from .models import VaultEntry, UserKeys


class Base64BinaryField(serializers.Field):
    def to_representation(self, value):
        if value is None:
            return None
        if isinstance(value, str):
            match = re.match(r"^b('|\")(.*)('|\")$", value)
            if match:
                value = eval(value)
            else:
                raise TypeError(f"Expected bytes, got str: {value!r}")
        return base64.b64encode(value).decode('utf-8')

    def to_internal_value(self, data):
        try:
            return base64.b64decode(data)
        except Exception:
            raise serializers.ValidationError('Invalid base64-encoded data')


class VaultSerializer(serializers.ModelSerializer):
    encrypted_password = Base64BinaryField()
    salt = Base64BinaryField()
    nonce = Base64BinaryField()

    class Meta:
        model = VaultEntry
        fields = ['user', 'label', 'username', 'encrypted_password',
                  'salt', 'nonce', 'notes', 'tag', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return VaultEntry.objects.create(user=user, **validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        return user


class UserKeySerializer(serializers.ModelSerializer):
    encrypted_string = Base64BinaryField()
    salt1 = Base64BinaryField()
    salt2 = Base64BinaryField()
    nonce = Base64BinaryField()

    class Meta:
        model = UserKeys
        fields = ['user', 'encrypted_string', 'salt1', 'salt2', 'nonce']
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        return UserKeys.objects.create(user=user, **validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh_token = attrs['refresh']
        request = self.context['request']
        device_id = request.data.get('device_id')

        if not device_id:
            raise serializers.ValidationError('device_id is required')

        try:
            refresh = RefreshToken(refresh_token)
        except Exception:
            raise serializers.ValidationError('Invalid refresh token')

        device_id_from_token = refresh.get('device_id', None)
        if device_id_from_token != device_id:
            raise serializers.ValidationError('device_id mismatch')

        data = {'access': str(refresh.access_token)}
        return data
