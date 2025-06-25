from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from django.urls import reverse


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
        # Get auth token
        token_response = self.client.post(
            '/api/token/',
            {
                'username': self.username,
                'password': self.password
            },
            format='json'
        )
        self.assertEqual(token_response.status_code, 200)
        self.token = token_response.data['access']
        self.refresh = token_response.data['refresh']
        self.auth_headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'
        }

    def test_auth(self):
        url = reverse('token_obtain_pair')
        payload = {
            'username': self.username,
            'password': self.password
        }
        request = self.client.post(url, payload)

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")

    def test_auth_invalid_credentials(self):
        url = reverse('token_obtain_pair')
        payload = {
            'username': self.username,
            'password': 'wrongPassword'
        }
        request = self.client.post(url, payload)

        self.assertEqual(request.status_code, 401,
                         "POST request failed to return status 401")

    def test_token_refresh(self):
        url = reverse('token_refresh')
        request = self.client.post(url, {'refresh': self.refresh})

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")

    def test_token_refresh_invalid_token(self):
        url = reverse('token_refresh')
        request = self.client.post(url, {'refresh': 'wrongToken'})

        self.assertEqual(request.status_code, 401,
                         "POST request failed to return status 401")
