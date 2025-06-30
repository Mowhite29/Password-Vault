from django.contrib import admin
from .models import VaultEntry, UserKeys, EmailChange

# Register your models here.
admin.site.register(VaultEntry)
admin.site.register(UserKeys)
admin.site.register(EmailChange)
