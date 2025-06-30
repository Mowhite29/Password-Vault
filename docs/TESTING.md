# Testing

As part of my CI pipeline, I have configured Github Action workflows to automatically carry out testing upon each push. </br>

For this I have configured a CI-pipeline workflow for Backend, React.js Frontend and React Native Frontend.


## Backend

### Backend libraries

- **Bandit** - Security-focused static code analysis for Python
- **Flake8** - Lightweight linting and formatting
- **Safety** - Security vulnerability testing and firewall

### Tests

I have built the following tests for my api endpoints:

### User creation

- Successful user creation
- User creation attempt using an existing username
- User creation attempt using an invalid email address
- Successful email verification
- Email verification attempt with invalid verification token
- Successful name change
- Attempt to change name with missing name fields

### Authentication

- Successful user login
- User login attempt with invalid credentials
- Successful token refresh
- Token refresh attempt with invalid refresh token

### Encryption key

- Successfully set users master key check value
- Attempt to set existing master key check value
- Successfully retrieve users master key check value
- Attempt to retrieve user master key check value using invalid authentication token

### Email verification

- Successful email verification
- Email verification attempt using invalid token

### Vault use

- Vault entry creation
- Attempt duplicate vault entry creation
- Attempt vault entry creation with missing fields
- Retrieve vault entries
- Retrieve empty vault
- Attempt retrieve vault entries with invaid authentication token
- Update of vault entry
- Attempt update of invalid vault entry
- Attempt update of vault entry with invalid authentication token
- Delete vault entry
- Attempt delete of non-existant vault entry
- Attempt delete of invalid vault entry
- Attempt delete of vault entry with invalid authentication token

### Password Change

- Password change request
- Attempt password change request with invalid authentication token
- Password reset request
- Password change confirm
- Attempt password change confirm with invalid token

## Frontend

### Frontend libraries

- **ESLint** - Linting, code quality, style
- **ESLint Security Plugin** - Adds security rules
- **Prettier** - Code formatting
- **nmp audit** - Dependancy vulnerability scanning
- **Retire.js** - JS library vulnerability detection


