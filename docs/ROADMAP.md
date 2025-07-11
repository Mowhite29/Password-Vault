# Password Vault – Project Roadmap

This roadmap outlines planned features and enhancements for the Password Vault project. Items are grouped by development phase and may be adjusted based on feedback or new priorities.

---

## Phase 1: Backend preparation

- [x] PostgreSQL integration
- [x] Vault model
- [x] User registration & login with JWT
- [x] Email verification
- [x] Vault CRUD operations
- [x] Password change
- [x] User master key hash storage and validation
- [x] Rate limiting for verified and anonymous requests
- [x] Integrate unit and integration testing
- [x] Gitbut actions CI/CD pipeline
- [x] GitHub documentation and initial deployment

---

## Phase 2: Frontend MVP

- [x] Wireframe build for mobile and desktop views
- [x] Cryptography utility for encryption/decryption
- [x] Auto-logout on inactivity
- [x] Add "mask/reveal" toggle for vault items
- [x] Basic password generator
- [x] Basic password strength checker
- [x] Integrate unit and integration testing
- [x] GitHub actions CI/CD pipeline
- [x] GitHub documentation and initial deployment

---

## Phase 3: Advanced Features

- [ ] Add Two-Factor Authentication (2FA) using TOTP or email
- [ ] Add user activity logging (e.g., last login, IP address)
- [ ] Integrate password generator with customizable options
- [ ] Improve form validation and user feedback on the frontend
- [ ] Tagging and categorization (e.g., Work, Banking, Social)
- [ ] Advanced search and filtering by tag, keyword, or date

---

## Phase 4: Frontend buildout

- [ ] Responsive design with a mobile-first approach
- [ ] Dark mode/Light mode
- [ ] Accessibility
- [ ] SEO
- [ ] Site performance optimisation

---

## Phase 5: Infrastructure & DevOps

- [x] Add CI/CD pipelines with GitHub Actions for automated testing and deployment
- [x] Integrate unit and integration testing (Pytest + React Testing Library)

---

## Ideas Under Consideration (Skills Showcase)

### Geolocation + IP Security

- Log and display approximate location of each login
- Alert users when login is from a new country or device

### Threat Detection

- Implement lockout on repeated login failures
- Add alerts or dashboard for suspicious activity

---

> This roadmap reflects planned development and is open to feedback, contribution, or discussion.
