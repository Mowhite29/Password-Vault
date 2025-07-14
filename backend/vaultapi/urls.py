from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    VaultView, RegisterViewDemo, PasswordChangeDemo, PasswordChangeConfirm,
    EmailVerifyView, PasswordResetDemo, UserKeysView, ping_view, NameChange,
    MobileLogin, MobileRefresh, Login, Authenticate, RegisterView, PasswordChange,
    PasswordReset, trigger_user_cleanup
)

urlpatterns = [
    path('amdin/cleanup-users/', trigger_user_cleanup, name='CleanUp'),
    path('ping/', ping_view, name='ping'),
    path('login/', Login.as_view(), name='Login'),
    path('authenticate/', Authenticate.as_view(), name='Authenticate'),
    path('api/token/',
         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/',
         TokenRefreshView.as_view(), name='token_refresh'),
    path('api/mobile/', MobileLogin.as_view(), name='TokenObtainMobile'),
    path('api/mobile/refresh/',
         MobileRefresh.as_view(), name='TokenRefreshMobile'),
    path('vault/', VaultView.as_view(), name='VaultView'),
    path('user/demo/', RegisterViewDemo.as_view(), name='RegisterViewDemo'),
    path('user/', RegisterView.as_view(), name='RegisterView'),
    path('user/key/', UserKeysView.as_view(), name='UserKeys'),
    path('user/change/', NameChange.as_view(), name='NameChange'),
    path('verify-email/<uidb64>/<token>/',
         EmailVerifyView.as_view(), name='EmailVerifyView'),
    path('password-change-request/demo/',
         PasswordChangeDemo.as_view(), name='PasswordChangeDemo'),
    path('password-change-request/',
         PasswordChange.as_view(), name='PasswordChange'),
    path('password-reset-request/demo/',
         PasswordResetDemo.as_view(), name='PasswordResetDemo'),
    path('password-reset-request/',
         PasswordReset.as_view(), name='PasswordReset'),
    path('password-change-confirm/<uidb64>/<token>/',
         PasswordChangeConfirm.as_view(), name='PasswordChangeConfirm'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
