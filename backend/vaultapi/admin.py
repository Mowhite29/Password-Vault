from django.contrib import admin
from .models import VaultEntry, UserKeys

# Register your models here.
admin.site.register(VaultEntry)
admin.site.register(UserKeys)
