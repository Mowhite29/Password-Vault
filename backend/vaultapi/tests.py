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

    def test_create_vault_entry(self):
        url = reverse('VaultView')
        response = self.client.post(url, self.entry_payload, format='json',
                                        **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "POST request failed to return status 200")
        self.assertEqual(response.data, {"message": "Password saved"},
                "POST request failed to return {'message': 'Password saved'}")

    def test_get_vault_entries(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "GET request failed to return status 200")

    def test_update_vault_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        updated_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'New Encrypted Password',
            'salt': 'Updated Salt',
            'nonce': 'Updated Nonce',
            'notes': 'New Notes'
        }

        response1 = self.client.put(url, updated_payload, format='json',
                                    **self.auth_headers)
        response2 = self.client.get(url, **self.auth_headers)
        self.assertEqual(response1.status_code, 200,
                         "PUT request failed to return status 200")
        self.assertEqual(response2.status_code, 200,
                         "GET request failed to return status 200")
        self.assertEqual(response1.data, {"message": "Entry Updated"},
                "PUT request failed to return {'message': 'Entry Updated'}")
        self.assertEqual(response2.json()[0]['encrypted_password'],
                            'New Encrypted Password',
                            "GET request failed to return updated entry")

    def test_delete_vault_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        search_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'Example Encrypted Password'
        }
        response1 = self.client.get(url, **self.auth_headers)
        response2 = self.client.delete(url, search_payload,
                                       **self.auth_headers)
        response3 = self.client.delete(url, search_payload,
                                       **self.auth_headers)
        self.assertEqual(response1.status_code, 200,
                         "GET request failed to return status 200")
        self.assertEqual(response2.status_code, 200,
                         "DELETE request failed to return status 200")
        self.assertEqual(response3.status_code, 404,
                         "GET request failed to return status 404")
        self.assertEqual(response2.data, {"message": "Password deleted"},
            "DELETE request failed to return {'message': 'Password deleted'}")
        self.assertEqual(response3.data, {"error": "Entry not found"},
                "GET request failed to return {'error': 'Entry not found'}")

    def test_user_key_set(self):
        url = reverse('UserKeys')
        payload = {
            "encrypted_string": "string", "salt1": "salt1",
            "salt2": "salt2", "nonce": "nonce"}
        response = self.client.post(url, payload, format='json',
                         **self.auth_headers)
        self.assertEqual(response.status_code, 200)

    def test_user_key_get(self):
        url = reverse('UserKeys')
        payload = {
            "encrypted_string": "string", "salt1": "salt1",
            "salt2": "salt2", "nonce": "nonce"}
        self.client.post(url, payload, format='json',
                         **self.auth_headers)
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
