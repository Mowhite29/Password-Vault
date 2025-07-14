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
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTGMfUz7kL_Tr0EolQOhE0zATeuJlumqe_UqshrRQUki1k?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQRxBGn9Va3dToPTPizQAaK7AVL0e6Z2-34C99QZA0oBwB0?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQi-osFCaXiR6nz4fc8GuvdAU8yD50s63eGRh6f_Tc3RVM?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQT6H8ncfyWPR5TCcb_uP3d-ASCwZ-RAAVT-5_EzrOGE2TQ?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTRbJZoB494ToK_tdEVMSbXAXM-cSR1aPaGDc1oUvImIFU?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQ1PMOi-xmFSITHqSCNxMrgAeR2mlNl3__MeBeuYPF-yYc?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQSkcKKz0UCaTJZKvbbhWlk7AWEr6iBuBn_tqMqCGpViML4?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQi7U1epBnJS68OOgvd1r-JAfNkU-BfW8aiVQWsi4rfCAw?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTbUrsXUyMfTbecZeCE2PmTAVGAqSocOVlHhnohjWsS4LU?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQ_tDW3CKyMRoeAHyklmi41Af5-9feTgKgFqTGWLJDQ8fg?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQSHKuvmrY2GQJsQy9HmV-cSAcKjxu1M3v4BOmfZHRKR1ew?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQT_NXNIh9KXQI-6Vh-BynuaAVmQpy1D9TIxcRcV5AWvJtk?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQQv1oFFyJa4QZCjx15aaqrlAcmW3Vj06_0Hcxi3Z142EIs?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTf4hoyjS_8T6yZmehShmVNAcvO2Z4X1ZLafSJDMDbsDWU?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQRmOovvFyEkSotCLDWw-KhmARD8WH2amTkGYS-z60kPIq8?height=660" width=300>
</p>
<p float="left">
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQSTjlO197SKRZGYBhODEwznARxInzSjj9nTVhjBL4-uAAQ?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQTTG4JjoT9BRY6Fjjd-KXlcAe8B_gmQT7Mdhb8rEgD5VE8?height=660" width=300>
  <img src="https://1drv.ms/i/c/b04739826e84fd08/IQRbQw1rjB1ISaYw6Mk_JFlvAbXohyvZ53dU95S62nx-GUg?height=660" width=300>
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
