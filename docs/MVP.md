# MVP Overview – Password Vault Project

## Purpose

This Minimum Viable Product (MVP) demonstrates the **core functionality** of a password vault application, built to showcase my backend and frontend development skills. It includes secure user authentication, password storage, encryption, and UI interactions to simulate a real-world product.

> **Disclaimer**:  
This application is a **portfolio project only** and should **not be used to store any sensitive or real data**. No liability is accepted for any misuse. See full legal disclaimer [here](./LEGAL.md).

---

## Core Features

| Feature                       | Included  |
|-------------------------------|:---------:|
| User registration             | [x]       |
| Email verification simulation | [x]       |
| Token-based authentication    | [x]       |
| Master key for encryption     | [x]       |
| Password vault (CRUD)         | [x]       |
| Password generation (frontend)| [x]       |
| Encryption (frontend)         | [x]       |
| React Native frontend         | [x]       |

---

## Tech Stack

- **Backend**: Django + Django REST Framework  
- **Frontend**: React + Sass
- **Database**: PostgreSQL  
- **CI/CD**: GitHub Actions – tests, linters, vulnerability scans  
- **Security**: XSalsa-20 encryption, JWT authentication, strong password validation  

---

## Security Notes

- Passwords are encrypted client-side with a user-supplied master key not stored on the server.
- All API endpoints are protected by token authentication.
- Users are warned not to enter any real data in all relevant areas.

---

## Screenshots

<p float="left">
  <img src="./images/1. MVP-Disclaimer.png" alt="Legal disclaimer">
  <img src="./images/2. MVP-Home.png" alt="Home screen">
  <img src="./images/3. MVP-Mobile menu.png"alt="Mobile menu">
</p>
<p float="left">
  <img src="./images/4. MVP-About.png" alt="About screen">
  <img src="./images/5. MVP-Legal.png" alt="Legal screen">
  <img src="./images/6. MVP-Signin.png" alt="Signin screen">
</p>
<p float="left">
  <img src="./images/7. MVP-Signin-invalid entry.png" alt="Invalid signin attempt">
  <img src="./images/8. MVP-Verification email.png" alt="Verification email">
  <img src="./images/9. MVP-Email verified.png" alt="Email verified">
</p>
<p float="left">
  <img src="./images/10. MVP-MFA setup.png" alt="MFA setup">
  <img src="./images/11. MVP-Masterkey set.png" alt="Master key setup">
  <img src="./images/12. MVP-Entry creation.png" alt="Entry creation">
</p>
<p float="left">
  <img src="./images/13. MVP-Entry creation- password generation.png" alt="Password generation">
  <img src="./images/14. MVP-Entry creation- invalid password.png" alt="Invalid password">
  <img src="./images/15. MVP-Vault view.png" alt="Vault view">
</p>
<p float="left">
  <img src="./images/16. MVP-Entry edit.png" alt="Entry edit">
  <img src="./images/17. MVP-Search.png" alt="Search">
  <img src="./images/18. MVP-Entry delete.png" alt="Entry deletion">
</p>

---

## Testing & CI

- Automated unit tests for all API endpoints  
- Static analysis using:
  - `flake8` (formatting and linting)
  - `bandit` (security)
  - `safety` (vulnerability scanning)  
- GitHub Actions pipeline runs on push and PRs

---

## Navigation

| Area                     | Location                            |
|--------------------------|-------------------------------------|
| Full project overview    | [README.md](./README.md)            |
| Legal disclaimer         | [LEGAL.md](./LEGAL.md)              |
