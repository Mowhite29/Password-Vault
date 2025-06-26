from .settings import *

REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = []

LOGGING = {
        'version': 1,
        'disable_existing_loggers': True,
    }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DATABASE_USER'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST', 'postgres'),
        'PORT': os.environ.get('DATABASE_PORT', '5432'),
     }
}