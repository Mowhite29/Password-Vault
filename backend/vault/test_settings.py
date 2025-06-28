from .settings import *

INSTALLED_APPS = INSTALLED_APPS

REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = []

LOGGING = {
        'version': 1,
        'disable_existing_loggers': True,
        'handlers': {
            'null': {
                'class': 'logging.NullHandler',
            },
        },
        'root': {
            'handlers': ['null'],
            'level': 'CRITICAL',
        },
    }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DATABASE_USER'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST', 'localhost'),
        'PORT': os.environ.get('DATABASE_PORT', '5432'),
     }
}

if os.getenv("GITHUB_WORKFLOW"):
    DISABLE_SERVER_SIDE_CURSORS = True
