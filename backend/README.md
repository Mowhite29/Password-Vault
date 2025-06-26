# Password Vault - Backend

This is the backend API for the Password Vault project, built with Django REST Framework. It handles user authentication and password data storage.

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

## Getting Started

### Prerequisites

- Python 3.9 or higher
- PostgreSQL database
- Virtual environment tool (venv, pipenv, etc.)

### Installation

1. Clone the repository and navigate to the backend directory:

```bash
git clone https://github.com/Mowhite29/Password-Vault.git
cd password-vault/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate     # Windows
```

3. Install dependencies:

```bash
pip install -r requirements-dev.txt
```

4. Create a `.env` file with required environment variables (example in `.env.example`):

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/passwordvault
SECRET_KEY=your-django-secret-key
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
python manage.py test
```
