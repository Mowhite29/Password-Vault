from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from django.urls import reverse
import re
import pyotp


class APITests(APITestCase):

    def setUp(self):
        # Create test user
        self.username = 'testUser'
        self.first_name = 'testFirstName'
        self.Last_name = 'testLastName'
        self.email = 'testEmail@example.com'
        self.password = 'testpassword123'

        self.user = User.objects.create_user(
                                    username=self.username,
                                    first_name=self.first_name,
                                    last_name=self.Last_name,
                                    email=self.email,
                                    password=self.password,
                                    is_active=True)

    def test_login(self):
        url = reverse('Login')
        payload = {
            'username': self.username,
            'password': self.password
        }
        request = self.client.post(url, payload)

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")

    def test_login_invalid_credentials(self):
        url = reverse('Login')
        payload = {
            'username': self.username,
            'password': "invalidPassword"
        }
        request = self.client.post(url, payload)

        self.assertEqual(request.status_code, 403,
                         "POST request failed to return status 403")

    def test_auth_token(self):
        url = reverse('Login')
        payload = {
            'username': self.username,
            'password': self.password
        }
        request = self.client.post(url, payload)
        token_secret = request.data.get('token_secret')
        pattern = re.compile(r"secret=([A-Za-z0-9]+)")
        match = (pattern.search(token_secret))
        totp = pyotp.TOTP(match.group(1))
        token = totp.now()

        url1 = reverse('Authenticate')
        payload1 = {
            'username': self.username,
            'totp_token': token
        }
        request1 = self.client.post(url1, payload1)

        self.assertEqual(request1.status_code, 200,
                         "POST request failed to return status 200")

    def test_auth_bad_token(self):
        url = reverse('Login')
        payload = {
            'username': self.username,
            'password': self.password
        }
        self.client.post(url, payload)
        token = '123456'
        url1 = reverse('Authenticate')
        payload1 = {
            'username': self.username,
            'totp_token': token
        }
        request1 = self.client.post(url1, payload1)

        self.assertEqual(request1.status_code, 403,
                         "POST request failed to return status 403")
