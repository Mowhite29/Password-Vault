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

    def test_mobile_auth(self):
        url = reverse('TokenObtainMobile')
        payload = {
            'username': self.username,
            'password': self.password,
            'device_id': '1234567890'
        }
        request = self.client.post(url, payload)

        self.assertEqual(request.status_code, 200,
                         "POST request failed to return status 200")
