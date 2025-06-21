# 📍 Password Vault – Project Roadmap

This roadmap outlines planned features and enhancements for the Password Vault project. Items are grouped by development phase and may be adjusted based on feedback or new priorities.

---

## Phase 1: MVP Completion

- [x] User registration & login with JWT
- [x] Vault CRUD operations
- [ ] AES encryption for stored passwords
- [x] PostgreSQL integration
- [ ] Responsive React UI
- [ ] Basic password strength checker
- [ ] GitHub documentation and initial deployment

---

## Phase 2: Security & UX Enhancements

- [ ] Auto-logout on inactivity
- [ ] Add Two-Factor Authentication (2FA) using TOTP or email
- [ ] Add user activity logging (e.g., last login, IP address)
- [ ] Integrate password generator with customizable options
- [ ] Add "mask/reveal" toggle for vault items
- [ ] Improve form validation and user feedback on the frontend

---

## Phase 3: Mobile & Cross-Platform

- [ ] Build **React Native** version of the app for iOS and Android
- [ ] Add biometric login via Face ID / fingerprint (React Native only)
- [ ] Sync vaults between devices using encrypted cloud storage
- [ ] Offline vault support using encrypted local storage or SQLite
- [ ] QR code login from mobile to desktop vault

---

## Phase 4: Advanced Features

- [ ] Tagging and categorization (e.g., Work, Banking, Social)
- [ ] Advanced search and filtering by tag, keyword, or date
- [ ] Vault item history & versioning (audit trail)
- [ ] Admin dashboard for managing users and audit logs (optional)

---

## Phase 5: Infrastructure & DevOps

- [ ] Add CI/CD pipelines with GitHub Actions for automated testing and deployment
- [ ] Integrate unit and integration testing (Pytest + React Testing Library)
- [ ] Add database migrations tracking with Alembic or Django Migrations
- [ ] Optional: Add GraphQL API layer to complement REST

---

## Ideas Under Consideration (Skills Showcase)

### Browser Extension
- A lightweight Chrome/Firefox extension for quick vault access and autofill
- Technologies: JavaScript, browser storage, messaging API
- Skills: Frontend performance, secure data handling in browser contexts

### Biometric & Device-Based Authentication
- Add biometric login support (e.g., Touch ID, Face ID) for mobile devices
- Device-based trust system (register device fingerprint via user-agent/IP hash)
- Skills: React Native APIs, secure auth tokens, networking

### Dark Mode & Accessibility
- Add a theme toggle (light/dark) with system preference detection
- Implement full keyboard navigation and screen reader support (ARIA)
- Skills: UI/UX, accessibility standards, advanced CSS

### Geolocation + IP Security
- Log and display approximate location of each login
- Alert users when login is from a new country or device
- Skills: Networking (CCNA concepts), geolocation APIs, user trust modeling

### Rate Limiting & Threat Detection
- Implement request throttling and lockout on repeated login failures
- Add alerts or dashboard for suspicious activity
- Skills: Security+, CySA+, backend performance

### Machine Learning (Future Stretch Goal)
- Train a model to detect unusual password reuse or risky behavior
- Recommend stronger passwords based on user behavior
- Skills: Python, NumPy, intro machine learning, behavioral modeling

---

> This roadmap reflects planned development and is open to feedback, contribution, or discussion.
