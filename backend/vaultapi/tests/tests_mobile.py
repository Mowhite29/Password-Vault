# from django.contrib.auth.models import User
# from rest_framework.test import APITestCase
# from django.urls import reverse


# class APITests(APITestCase):

#     def setUp(self):
#         # Create test user
#         self.username = 'testUser'
#         self.first_name = 'testFirstName'
#         self.Last_name = 'testLastName'
#         self.email = 'testEmail@example.com'
#         self.password = 'testpassword123'

#         self.user = User.objects.create_user(
#                                     username=self.username,
#                                     first_name=self.first_name,
#                                     last_name=self.Last_name,
#                                     email=self.email,
#                                     password=self.password,
#                                     is_active=True)

#         token_response = self.client.post(
#             '/api/mobile/',
#             {
#                 'username': self.username,
#                 'password': self.password,
#                 'device_id': '1234567890'
#             },
#             format='json'
#         )
#         self.assertEqual(token_response.status_code, 200)
#         self.token = token_response.data['access']
#         self.auth_headers = {
#             'HTTP_AUTHORIZATION': f'Bearer {self.token}'
#         }
#         self.refresh_token = token_response.data['refresh']
#         self.refresh = {
#             'device_id': '1234567890',
#             'refresh': self.refresh_token
#         }

#         self.payload = {
#             'username': self.username,
#             'password': self.password,
#             'device_id': '1234567890'
#         }

#     def test_mobile_auth(self):
#         url = reverse('TokenObtainMobile')
#         request = self.client.post(url, self.payload)

#         self.assertEqual(request.status_code, 200,
#                          "POST request failed to return status 200")

#     def test_mobile_auth_incorrect_credentials(self):
#         url = reverse('TokenObtainMobile')
#         self.payload = {
#             'username': self.username,
#             'password': 'wrong_password',
#             'device_id': '1234567890'
#         }
#         request = self.client.post(url, self.payload)

#         self.assertEqual(request.status_code, 401,
#                          "POST request failed to return status 401")

#     def test_mobile_refresh(self):
#         url = reverse('TokenRefreshMobile')
#         request = self.client.post(url, self.refresh)

#         self.assertEqual(request.status_code, 200,
#                          "POST request failed to return status 200")

#     def test_mobile_refresh_wrong_device(self):
#         url = reverse('TokenRefreshMobile')
#         request1 = self.client.post(url, {
#                                         'device_id': '12345678',
#                                         'refresh': self.refresh_token
#                                         })

#         self.assertEqual(request1.status_code, 400,
#                          "POST request failed to return status 400")

#     def test_mobile_create_vault_entry(self):
#         url = reverse('VaultView')
#         payload = {
#             'device_id': '1234567890',
#             'label': 'Example Site',
#             'username': 'Example Username',
#             'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
#             'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
#             'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
#             'notes': 'Example Notes'
#         }
#         response = self.client.post(url, payload, format='json',
#                                         **self.auth_headers)
#         self.assertEqual(response.status_code, 200,
#                          "POST request failed to return status 200")
#         self.assertEqual(response.data, {"message": "Password saved"},
#                 "POST request failed to return {'message': 'Password saved'}")

#     def test_mobile_create_vault_entry_wrong_device(self):
#         url = reverse('VaultView')
#         payload = {
#             'device_id': '12345678',
#             'label': 'Example Site',
#             'username': 'Example Username',
#             'encrypted_password': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
#             'salt': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
#             'nonce': 'U29tZSBzYW1wbGUgdGVzdCBkYXRhIQ==',
#             'notes': 'Example Notes'
#         }
#         response = self.client.post(url, payload, format='json',
#                                         **self.auth_headers)
#         self.assertEqual(response.status_code, 403,
#                          "POST request failed to return status 403")
