# Password Vault - Backend

This is the backend API for the Password Vault project, built with Django REST Framework. It handles user authentication, password data storage, and encryption logic.

## Features

- User registration and authentication with JWT
- Secure storage of encrypted password entries
- RESTful API endpoints for frontend consumption
- Database migrations and schema management

## Tech Stack

- Python 3.9+
- Django REST Framework
- PostgreSQL database
- PyJWT for token handling
- Cryptography library for encryption
- Docker (optional)

## Getting Started

### Prerequisites

- Python 3.9 or higher
- PostgreSQL database
- Virtual environment tool (venv, pipenv, etc.)

### Installation

1. Clone the repository and navigate to the backend directory:

```bash
git clone https://github.com/Mowhite29/Password-Vault-Project.git
cd password-vault-project/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate     # Windows
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with required environment variables (example in `.env.example`):

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/passwordvault
SECRET_KEY=your-django-secret-key
JWT_SECRET=your-jwt-secret
```

### Database Setup

Run migrations to set up your database schema:

```bash
python manage.py migrate
```

### Running the Server

Start the development server:

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

## Testing

Run backend tests with:

```bash
python manage.py test tests
```

## API Endpoints

The mobile application communicates with the backend API to manage passwords. Here are the key endpoints:

- **POST** `/api/token` – Fetch authorisation token

```bash
requests.post(
    "http://localhost:8000/api/token/",
    json = {
        "username": username, 
        "password": password
    }
)

returns access and refresh tokens in form:
{"refresh": "token", "access": "token"}
```

- **POST** `/api/token/refresh/` - Request a new token

```bash
requests.post(
    "http://localhost:8000/api/token/refresh/",
    json = {
        "refresh": "token"
    }
)

returns access token in form:
{"access": "token"}
```

- **GET** `/vault/` - Fetch list of passwords

```bash
requests.get(
    "http://localhost:8000/vault/",
    headers = {
        "Authorization": "Bearer token", 
        "Content-Type": "application/json"
    }
)

returns status 200 with password list in form:
[{"user":user_id,"label":"label","username":"username","encrypted_password":"encrypted_password",
"salt":"salt","nonce":"nonce","notes":"notes",
"created_at":"yyyy-mm-ddThh:mm:ss.ssssssZ","updated_at":"yyyy-mm-ddThh:mm:ss.ssssssZ"}]
```

- **POST** `/vault/` – Add a new password.

```bash
requests.post(
    "http://localhost:8000/vault/",
    json = { 
        "label": "label", 
        "username": "username", 
        "encrypted_password": "encrypted_password",
        "salt": "salt",
        "nonce": "nonce",
        "notes": ""
    }, 
    headers = {
        "Authorization": "Bearer token", 
        "Content-Type": "application/json"
    }
)

returns status 200 with:
{"message":"Password saved"}

```

- **PUT** `/api/vault/` - Edit a saved password

```bash
requests.put(
    "http://localhost:8000/vault/",
    json = { 
        "label": "label", 
        "username": "username", 
        "encrypted_password": "new_encrypted_password",
        "salt": "new_salt",
        "nonce": "new_nonce",
        "notes": ""
    }, 
    headers = {
        "Authorization": "Bearer token", 
        "Content-Type": "application/json"
    }
)

returns status 200 with:
{"message":"Entry Updated"}

```

- **DELETE** `/vault/` – Delete a password

```bash
requests.delete(
    "http://localhost:8000/vault/",
    json = { 
        "label": "label", 
        "username": "username", 
        "encrypted_password": "encrypted_password",
    }, 
    headers = {
        "Authorization": "Bearer token", 
        "Content-Type": "application/json"
    }
)

returns status 200 with:
{"message":"Password deleted"}
```

- **POST** `/user/` - Create a new user vault

```bash
requests.post(
    "http://localhost:8000/user/", 
    json = {
        "username": "username", 
        "first_name": "first_name",
        "last_name": "last_name",  # Can be left blank
        "email": "email", 
        "password": "password"
    }
)
returns status 200 with:
{"message": "user created"}
```

- **GET** `/verify-email/` - Verify email address

```bash
requests.get(
    "http://localhost:8000/verify-email/uidb64/token/", 
)
returns status 200 with:
{"message": "Email verified successfully. You can now log in."}
```

- **POST** `/password-change-request` - Request a password change email

```bash
requests.post(
    "http://localhost:8000/password-change-request/", 
    json: {
        "username": "username"
    },
    headers = {
        "Authorization": "Bearer token", 
        "Content-Type": "application/json"
    }
)
returns status 200 with:
{"detail":"A confirmation email has been sent to your email address."}
```

- **POST** `/password-reset-request` - Request a password reset email

```bash
requests.post(
    "http://localhost:8000/password-reset-request/", 
    json: {
        "username": "username"
    },
    headers = {
        "Content-Type": "application/json"
    }
)
returns status 200 with:
{"detail":"A confirmation email has been sent to your email address."}
```

- **POST** `/password-change-confirm/` - Password change confirmation

```bash
requests.post(
    "http://localhost:8000/password-change-confirm/uidb64/token/", 
    json: {
        "new_password": "new_password"
    },
    headers = {
        "Content-Type": "application/json"
    }
)
returns status 200 with:
{"message":"password updated"}
```

Authentication is handled via JWT tokens, which should be included in the headers of each request
