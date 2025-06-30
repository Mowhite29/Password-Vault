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
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
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

    def test_create_duplicate_vault_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                                        **self.auth_headers)
        response = self.client.post(url, self.entry_payload, format='json',
                                        **self.auth_headers)
        self.assertEqual(response.status_code, 400,
                         "POST request failed to return status 400")

    def test_create_vault_entry_missing_fields(self):
        url = reverse('VaultView')
        entry_payload = {
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'notes': 'Example Notes'
        }
        response1 = self.client.post(url, entry_payload, format='json',
                                        **self.auth_headers)
        entry_payload = {
            'label': 'Example Site',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'notes': 'Example Notes'
        }
        response2 = self.client.post(url, entry_payload, format='json',
                                        **self.auth_headers)
        entry_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'notes': 'Example Notes'
        }
        response3 = self.client.post(url, entry_payload, format='json',
                                        **self.auth_headers)

        self.assertEqual(response1.status_code, 400,
                         "POST request with missing label field "
                         "failed to return status 400")
        self.assertEqual(response2.status_code, 400,
                         "POST request with missing username field "
                         "failed to return status 400")
        self.assertEqual(response3.status_code, 400,
                         "POST request with missing encrypted_password "
                         "field failed to return status 400")

    def test_get_vault_entries(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "GET request failed to return status 200")

    def test_get_empty_vault_entries(self):
        url = reverse('VaultView')
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "GET request failed to return status 200")

    def test_get_vault_entries_bad_token(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        response = self.client.get(url,
                            {'HTTP_AUTHORIZATION': f'Bearer {'bad_token'}'})
        self.assertEqual(response.status_code, 401,
                         "GET request failed to return status 401")

    def test_update_vault_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        updated_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBuZXcgc2FtcGxlIHRlc3QgZGF0YSE=',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
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
                            'U29tZSBuZXcgc2FtcGxlIHRlc3QgZGF0YSE=',
                            "GET request failed to return updated entry")

    def test_update_vault_invalid_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        updated_payload = {
            'label': 'Example Site',
            'username': 'Incorrect Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'notes': 'New Notes'
        }
        response1 = self.client.put(url, updated_payload, format='json',
                                    **self.auth_headers)
        updated_payload = {
            'label': 'Incorrect Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'notes': 'New Notes'
        }
        response2 = self.client.put(url, updated_payload, format='json',
                                    **self.auth_headers)
        self.assertEqual(response1.status_code, 404,
                         "PUT request with incorrect username "
                         "field failed to return status 404")
        self.assertEqual(response2.status_code, 404,
                         "PUT request with incorrect label field "
                         "failed to return status 404")

    def test_update_vault_entry_bad_token(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        updated_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'notes': 'New Notes'
        }
        response1 = self.client.put(url, updated_payload, format='json',
                            **{'HTTP_AUTHORIZATION': f'Bearer {'bad_token'}'})
        self.assertEqual(response1.status_code, 401,
                         "PUT request failed to return status 401")

    def test_delete_vault_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        search_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ=='
        }
        response = self.client.delete(url, search_payload,
                                       **self.auth_headers)
        self.assertEqual(response.status_code, 200,
                         "DELETE request failed to return status 200")
        self.assertEqual(response.data, {"message": "Password deleted"},
            "DELETE request failed to return {'message': 'Password deleted'}")

    def test_delete_non_existant_vault_entry(self):
        url = reverse('VaultView')
        search_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
        }
        response = self.client.delete(url, search_payload,
                                       **self.auth_headers)
        self.assertEqual(response.status_code, 404,
                         "GET request failed to return status 404")

    def test_delete_invalid_vault_entry(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        search_payload = {
            'label': 'Wrong Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
            'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
        }
        response = self.client.delete(url, search_payload,
                                       **self.auth_headers)
        self.assertEqual(response.status_code, 404,
                         "DELETE request failed to return status 404")

    def test_delete_vault_entry_bad_token(self):
        url = reverse('VaultView')
        self.client.post(url, self.entry_payload, format='json',
                            **self.auth_headers)
        search_payload = {
            'label': 'Example Site',
            'username': 'Example Username',
            'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ=='
        }
        response = self.client.delete(url, search_payload,
                            **{'HTTP_AUTHORIZATION': f'Bearer {'bad_token'}'})
        self.assertEqual(response.status_code, 401,
                         "DELETE request failed to return status 401")
