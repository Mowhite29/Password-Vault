# MVP Overview – Password Vault Project

## Purpose

This Minimum Viable Product (MVP) demonstrates the **core functionality** of a password vault application, built to showcase my backend and frontend development skills. It includes secure user authentication, password storage, encryption, and UI interactions to simulate a real-world product.

> **Disclaimer**:  
This application is a **portfolio project only** and should **not be used to store any sensitive or real data**. No liability is accepted for any misuse. See full legal disclaimer [here](./LEGAL.md).

---

## Core Features

| Feature                       | Included  | Description                                   |
|-------------------------------|:---------:|-----------------------------------------------|
| User registration             | [x]       | Email-based registration flow                 |
| Email verification simulation | [x]       | Mock email shown for demo                     |
| Token-based authentication    | [x]       | JWT token flow using DRF                      |
| Master key for encryption     | [x]       | User-supplied key for encryption/decryption   |
| Password vault (CRUD)         | [x]       | Add, update, list, delete entries             |
| Password generation (frontend)| [x]       | Demo-only passwords for simulation            |
| Encryption (frontend)         | [x]       | End-to-end encryption using [your library]    |
| Mobile-responsive design      | [ ]       | Planned for production build                  |
| React Native frontend         | [x]       | Shared crypto layer between web and mobile    |

---

## Tech Stack

- **Backend**: Django + Django REST Framework  
- **Frontend**: React + Sass, React Native/Expo (Mobile)  
- **Database**: PostgreSQL  
- **CI/CD**: GitHub Actions – tests, linters, vulnerability scans  
- **Security**: AES-GCM encryption, JWT authentication, strong validation  

---

## Security Notes

- Passwords are encrypted client-side with a user-supplied master key not stored on the server.
- All API endpoints are protected by token authentication.
- Mock password and email flows are used to avoid handling sensitive data.
- Users are warned not to enter any real data in all relevant areas.

---

## Screenshots

<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQR3oLLP0WIpRpmUOxn7iS5iAdJg1nlQj5QXUWtVQP3Xdv8?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQRa5gdI6r8hRLdd3N3VRdK0AUjKT_IJVxT8HosjZMViQSE?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQSGubPe7pnPSrfRVr9MvIAvATPBWSwi6xZz9whmjXZ2DIw?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTDB6eLOuF0S5keppWq0g6XATVtSIgeUaxLMNE0PfjLiS4?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTD1kebYP7VR7nHMuVvb4CYAd8kxOgrPuxJ0qnosFeQMSM?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQS0wcz1Ymx-T59AIYuYaQGcASwPErVJUwmvp7rWHzq2YwY?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTgzI4woo4HTpgkzFvhvZsvAV8vV0DVBXfwv5gwZrxMt5M?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQQEOFfgSsdT6Sj1P__mQ1IAdMUAQUeQlCDYYzhl4kOw2o?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQjIhS0kFnTTq87H3kqb_elAa1Qj6qHd-ttAtCrQEmNBJk?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQROGQrma4PHRYOy4M64XkRHAdBYsnlnATGGVcqF3dk8B-8?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQp_qPMFxCAT6eNAFVMzlg9Ab6nGkINMc_11GnamJj4Ax4?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTLu_DoBW0QRqvCU4YQmGs3AcVYAoE51kBVsE8mHvCsTMs?height=660" width=300>
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
| Mock email view          | `/demo/email-verification`          |
| Legal disclaimer         | [LEGAL.md](./LEGAL.md)              |

---

## Timeline

| Stage                | Status        | Notes                                |
|----------------------|---------------|---------------------------------------|
| Core backend logic   | [x] Completed  | Auth, encryption, CRUD                |
| Frontend MVP         | [x] Completed  | Web and mobile                        |
| Mobile demo deploy   | [ ] In Progress| Expo test build planned               |
| Production hardening | [ ] Planned    | UI polish, error handling, a11y       |
| Additional features  | [ ] Planned    | Folders, password strength checking   |

---

## Learning Goals Achieved

- Built a full-stack secure password manager MVP  
- Created and tested a RESTful API  
- Designed encrypted client-side storage  
- Integrated React and React Native with shared logic  
- Implemented continuous integration with quality controls  
