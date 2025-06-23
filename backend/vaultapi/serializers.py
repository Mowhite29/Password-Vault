from django.contrib.auth.models import User
from rest_framework import serializers
from .models import VaultEntry, PasswordChange, UserKeys


class VaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaultEntry
        fields = ['user', 'label', 'username', 'encrypted_password',
                  'salt', 'nonce', 'notes', 'created_at', 'updated_at']
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
        fields = ['username', 'email', 'password']


class PasswordChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordChange
        fields = ['username']
