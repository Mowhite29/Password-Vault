from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .views import (
    VaultView, RegisterViewDemo,
    PasswordChangeDemo, PasswordChangeConfirm,
    EmailVerifyView, PasswordResetDemo, UserKeysView,
    ping_view, EmailChangeRequestDemo, EmailChangeConfirm,
    NameChange
)

urlpatterns = [
     path('ping/', ping_view, name='ping'),
     path('api/token/',
         TokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('api/token/refresh/',
         TokenRefreshView.as_view(), name='token_refresh'),
     path('vault/', VaultView.as_view(), name='VaultView'),
     path('user/', RegisterViewDemo.as_view(), name='RegisterView'),
     path('user/key/', UserKeysView.as_view(), name='UserKeys'),
     path('user/change/', NameChange.as_view(), name='NameChange'),
     path('verify-email/<uidb64>/<token>/',
         EmailVerifyView.as_view(), name='EmailVerifyView'),
     path('password-change-request/',
         PasswordChangeDemo.as_view(), name='PasswordChange'),
     path('password-reset-request/',
         PasswordResetDemo.as_view(), name='PasswordReset'),
     path('password-change-confirm/<uidb64>/<token>/',
         PasswordChangeConfirm.as_view(), name='PasswordChangeConfirm'),
     path('email-change-request/',
          EmailChangeRequestDemo.as_view(), name='EmailChangeRequest'),
     path('email-change-confirm/<uidb64>/<token>/',
          EmailChangeConfirm.as_view(), name='EmailChangeConfirm'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'),
         name='swagger-ui'),
]
