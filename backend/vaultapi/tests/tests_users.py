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

        self.payload = {
            "username": "testUser1",
            "first_name": "testFirstName1",
            "last_name": "testLastName1",
            "email": "testEmail1@example.com",
            "password": "testPassword123",
        }

    def test_user_creation(self):
        url = reverse('RegisterViewDemo')
        request = self.client.post(url, self.payload, format='json')

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")

    def test_user_creation_existing(self):
        url = reverse('RegisterViewDemo')
        payload = {
            "username": "testUser",
            "first_name": "testFirstName",
            "last_name": "testLastName",
            "email": "testEmail@example.com",
            "password": "testPassword123",
        }
        request = self.client.post(url, payload, format='json')

        self.assertEqual(request.status_code, 400,
                         "POST request failed to return status 400")

    def test_user_creation_invalid_email(self):
        url = reverse('RegisterViewDemo')
        payload = {
            "username": "testUser1",
            "first_name": "testFirstName1",
            "last_name": "testLastName1",
            "email": "testEmail1@.com",
            "password": "testPassword123",
        }
        request = self.client.post(url, payload)

        self.assertEqual(request.status_code, 400,
                         "POST request failed to return status 400")

    def test_email_verification(self):
        url = reverse('RegisterViewDemo')
        request = self.client.post(url, self.payload, format='json')
        url1 = reverse('EmailVerifyView',
                       kwargs={
                           'uidb64': request.data['uid'],
                           'token': request.data['token']})
        request1 = self.client.get(url1)

        self.assertEqual(request1.status_code, 200,
                         "GET request failed to return status 200")

    def test_email_verification_invalid_token(self):
        url = reverse('RegisterViewDemo')
        request = self.client.post(url, self.payload, format='json')
        url1 = reverse('EmailVerifyView',
                       kwargs={
                           'uidb64': request.data['uid'],
                           'token': 'wrong_token'})
        request1 = self.client.get(url1)

        self.assertEqual(request1.status_code, 400,
                         "GET request failed to return status 400")

    def test_retrieve_user_name(self):
        url = reverse('NameChange')
        request = self.client.get(url, **self.auth_headers)

        self.assertEqual(request.status_code, 200,
                         "GET request failed to return status 200")

    def test_retrieve_user_name_bad_token(self):
        url = reverse('NameChange')
        request = self.client.get(url,
                            **{'HTTP_AUTHORIZATION': f'Bearer {'bad_token'}'})

        self.assertEqual(request.status_code, 401,
                         "GET request failed to return status 401")

    def test_user_name_change(self):
        url = reverse('NameChange')
        payload = {"first_name": "newName", "last_name": "newname"}
        request = self.client.post(url, payload, format='json',
                                   **self.auth_headers)

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")

    def test_user_name_change_bad_token(self):
        url = reverse('NameChange')
        payload = {"first_name": "newName", "last_name": "newname"}
        request = self.client.post(url, payload, format='json',
                            **{'HTTP_AUTHORIZATION': f'Bearer {'bad_token'}'})

        self.assertEqual(request.status_code, 401,
                         "POST request failed to return status 401")
