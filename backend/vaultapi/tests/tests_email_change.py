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
            'new_email': "newTestEmail@example.com"
        }

    def test_email_change_request(self):
        url = reverse('EmailChangeRequest')
        request = self.client.post(url, self.payload, **self.auth_headers)

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")

    def test_email_change_request_bad_token(self):
        url = reverse('EmailChangeRequest')
        request = self.client.post(url, self.payload,
                            **{'HTTP_AUTHORIZATION': 'Bearer bad_token'})

        self.assertEqual(request.status_code, 401,
                         "POST request failed to return status 401")

    def test_email_change_request_missing_email(self):
        url = reverse('EmailChangeRequest')
        request = self.client.post(url, **self.auth_headers)

        self.assertEqual(request.status_code, 400,
                         "POST request failed to return status 400")

    def test_email_change_confirm(self):
        url = reverse('EmailChangeRequest')
        request = self.client.post(url, self.payload, **self.auth_headers)
        url1 = reverse('EmailChangeConfirm',
                       kwargs={
                           'uidb64': request.data['uid'],
                           'token': request.data['token']})
        request1 = self.client.post(url1)

        self.assertEqual(request1.status_code, 200,
                         "POST request failed to return status 200")

    def test_email_change_confirm_invalid_token(self):
        url = reverse('EmailChangeRequest')
        request = self.client.post(url, self.payload, **self.auth_headers)
        url1 = reverse('EmailChangeConfirm',
                       kwargs={
                           'uidb64': request.data['uid'],
                           'token': 'wrong_token'})
        payload = {'new_password': 'new_password'}
        request1 = self.client.post(url1, payload)

        self.assertEqual(request1.status_code, 400,
                         "GET request failed to return status 400")
