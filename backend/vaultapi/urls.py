from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    VaultView, RegisterViewDemo,
    PasswordChangeDemo, PasswordChangeConfirm,
    EmailVerifyView, PasswordResetDemo, UserKeysView
)

urlpatterns = [
    path('api/token/',
         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/',
         TokenRefreshView.as_view(), name='token_refresh'),
    path('vault/', VaultView.as_view(), name='VaultView'),
    path('user/', RegisterViewDemo.as_view(), name='RegisterView'),
    path('user/key/', UserKeysView.as_view(), name='UserKeys'),
    path('verify-email/<uidb64>/<token>/',
         EmailVerifyView.as_view(), name='EmailVerifyView'),
    path('password-change-request/',
         PasswordChangeDemo.as_view(), name='PasswordChange'),
    path('password-reset-request/',
         PasswordResetDemo.as_view(), name='PasswordReset'),
    path('password-change-confirm/<uidb64>/<token>/',
         PasswordChangeConfirm.as_view(), name='PasswordChangeConfirm'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
