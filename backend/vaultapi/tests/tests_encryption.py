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
        self.auth_headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'
        }

        # Example vault entry payload
        self.entry_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'Example Encrypted Password',
            'salt': 'Example Salt',
            'nonce': 'Example Nonce',
            'notes': 'Example Notes'
        }

    def test_user_key_set(self):
        url = reverse('UserKeys')
        payload = {
            "encrypted_string": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt1": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt2": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "nonce": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ=="}
        response = self.client.post(url, payload, format='json',
                                        **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "POST request failed to return status 200")

    def test_user_key_set_existing(self):
        url = reverse('UserKeys')
        payload = {
            "encrypted_string": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt1": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt2": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "nonce": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ=="}
        self.client.post(url, payload, format='json',
                         **self.auth_headers)
        request = self.client.post(url, payload, format='json',
                                        **self.auth_headers)

        self.assertEqual(request.status_code, 405)

    def test_user_key_get(self):
        url = reverse('UserKeys')
        payload = {
            "encrypted_string": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt1": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt2": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "nonce": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ=="}
        self.client.post(url, payload, format='json',
                         **self.auth_headers)
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "GET request failed to return status 200")

    def test_user_key_get_invalid_token(self):
        url = reverse('UserKeys')
        payload = {
            "encrypted_string": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt1": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "salt2": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==",
            "nonce": "U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ=="}
        self.client.post(url, payload, format='json',
                         **self.auth_headers)
        response = self.client.get(url,
                        {'HTTP_AUTHORIZATION': f'Bearer {'invalid_token'}'})
        self.assertEqual(response.status_code, 403,
                         "GET request failed to return status 403")
