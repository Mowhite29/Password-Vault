from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class VaultEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    label = models.CharField(max_length=100,
                        help_text="Label or name of the service")
    username = models.CharField(max_length=150,
                        help_text="username or email used for the service")
    encrypted_password = models.CharField(max_length=1024,
                        help_text="AES-encrypted password string")
    salt = models.BinaryField(blank=True, null=True,
                        help_text='Hash padding salt')
    nonce = models.BinaryField(blank=True, null=True,
                        help_text='Crypto nonce')
    notes = models.TextField(blank=True, help_text="Optional notes or hints")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.label} ({self.user.username})'


class UserKeys(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    encrypted_string = models.CharField(max_length=1024,
        help_text="Known string encrypted using users master key")
    salt1 = models.BinaryField(blank=True, null=True,
                        help_text='Known string padding salt')
    salt2 = models.BinaryField(blank=True, null=True,
                        help_text='Master key padding salt')
    nonce = models.BinaryField(blank=True, null=True, help_text='Crypto nonce')
