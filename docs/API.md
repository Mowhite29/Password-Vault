# API Documentation

This document outlines the endpoints available in the Password Vault backend API. Authentication is handled via JWT.

## Headers

All authenticated requests must include:

```json
{
    "Authorization": "Bearer <accessToken>"
}
```

Content-type must be:

```json
{
    "Content-Type": "application/json"
}
```

## Authentication

### **POST** `/api/token/`

Obtain access and refresh JWT tokens
**Request Body:**

```json
{
    "username": "user@example.com",
    "password": "userpassword"
}
```

**Response:**

```json
{
    "refresh": "refreshToken",
    "access": "accessToken"
}
```

### **POST** `/api/token/refresh/`

Refresh an access token using the refresh token
**Request Body:**

```json
{
    "refresh": "refreshToken"
}
```

**Response:**

```json
{
    "access": "accessToken"
}
```

## User Registration, Email Verification, Master Key Handling & Name Change

### **POST** `/user/`

Register a new user
**Request Body:**

```json
{
    "username": "example@email.com",
    "first_name": "userFirstName",
    "last_name": "userLastname",  //Optional
    "email": "example@email.com",
    "password": "userPassword"
}
```

**Response:**

```json
{
    "message": "A confirmation email has been sent to your email address."
}
```

### **POST** `/user/` **DEMO VERSION**

Register a new user
**Request Body:**

```json
{
    "username": "example@email.com",
    "first_name": "userFirstName",
    "last_name": "userLastname",  //Optional
    "email": "example@email.com",
    "password": "userPassword"
}
```

**Response:**

```json
{
    "uid": "uid", 
    "token": "token", "user": "userFirstName", "email": "userEmailAddress"
}
```

### **GET** `/verify-email/uid/token/`

Email verification

**Response:**

```json
{
    "message": "Email verified successfully. You can now log in."
}
```

### **POST** `/user/key/`

Set new user master key
**Request Body**

```json
{
    "encrypted_string": "string", 
    "salt1": "salt1", 
    "salt2": "salt2", 
    "nonce": "nonce"
}
```

**Response:**

```json
{
    "message": "User key set"
}
```

### **GET** `/user/key/`

Retrieve user master key checking details
**Response:**

```json
{
    "user": "user",
    "encrypted_string": "encryptedString",
    "salt1": "salt1",
    "salt2": "salt2",
    "nonce":"nonce"
}
```

### **POST** `/user/change/`

Change users name
**Request Body:**

```json
{
    "first_name": "first_name",
    "last_name": "last_name"
}
```

**Response:**

```json
{
    "message": "name updated"
}
```

## Vault Entry Operations

### **GET** `/vault/`

Retrieve all stored vault entries
**Response:**

```json
{
    "user": "userID",
    "label": "label",
    "username": "username",
    "encrypted_password": "encrypted_password",
    "salt": "salt",
    "nonce": "nonce",
    "notes": "notes",
    "created_at": "yyyy-mm-ddThh:mm:ss.ssssssZ",
    "updated_at": "yyyy-mm-ddThh:mm:ss.ssssssZ"
}
```

### **POST** `/vault/`

Create a new vault entry
**Request Body:**

```json
{
    "label": "label", 
    "username": "username", 
    "encrypted_password": "encrypted_password",
    "salt": "salt",
    "nonce": "nonce",
    "notes": ""
}
```

**Response:**

```json
{
    "message": "Password saved"
}
```

### **PUT** `/vault/`

Update an existing vault entry
**Request Body:**

```json
{
    "label": "label", 
    "username": "username", 
    "encrypted_password": "new_encrypted_password",
    "salt": "new_salt",
    "nonce": "new_nonce",
    "notes": ""
}
```

**Response:**

```json
{
    "message":"Entry Updated"
}
```

### **DELETE** `/vault/`

Delete a vault entry
**Request Body:**

```json
{
    "label": "label", 
    "username": "username", 
    "encrypted_password": "encrypted_password",
    "salt": "salt",
    "nonce": "nonce"
}
```

**Response:**

```json
{
    "message": "Password deleted"
}
```

## Password Change

### **POST** `/password-change-request`

Request a password change for a signed in user
**Request Body:**

```json
{
    "username": "username"
}
```

**Response:**

```json
{
    "message": "A confirmation email has been sent to your email address."
}
```

### **POST** `/password-change-request` **DEMO VERSION**

Request a password change for a signed in user
**Request Body:**

```json
{
    "username": "username"
}
```

**Response:**

```json
{
    "uid": "uid", 
    "token": "token",
    "user": "userFisrtName", 
    "email": "email@example.com"
}
```

### **POST** `/password-reset-request/`

Request a password reset for a user that is not signed in
**Request Body:**

```json
{
    "username": "username"
}
```

**Response:**

```json
{
    "message": "A confirmation email has been sent to your email address."
}
```

### **POST** `/password-reset-request/` **DEMO VERSION**

Request a password reset for a user that is not signed in
**Request Body:**

```json
{
    "username": "username"
}
```

**Response:**

```json
{
    "uid": "uid", 
    "token": "token",
    "user": "userFisrtName", 
    "email": "email@example.com"
}
```

### **POST** `/password-change-confirm/uid/token/`

Password change confirmation
**Request Body:**

```json
{
    "new_password": "new_password"
}
```

**Response:**

```json
{
    "message": "password updated"
}
```

## Email Change

### **POST** `/email-change-request/`

Request email address change
**Request Body:**

```json
{
    "new_email": "new_email"
}
```

**Response:**

```json
{
    "message": "A confirmation email has been sent to your email address."
}
```

### **POST** `/email-change-request/` **DEMO VERSION**

Request email address change
**Request Body:**

```json
{
    "new_email": "new_email"
}
```

**Response:**

```json
{
    "uid": "uid",
    "token": "token",
    "user":"testnew1@test.com",
    "email":"testnew1@test.com"
}
```

### **POST** `/email-change-confirm/uid/token/`

Confirm email address change
**Response:**

```json
{
    "message": "email updated"
}
```

## Testing & CI Integration

- All endpoints have automated test coverage (via `tests/`)
- CI runs tests, linting, static security checks and dependancy scans every PR
- Throttling:
  - Unauthenticated: 20 requests/day
  - Authenticated: 1000 requests/day

## Aditional Notes

- This API is part of a portfolio demo project- do not use with real passwords or sensitive data
- See [LEGAL.md](./LEGAL.md) for further context