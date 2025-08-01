# Password Vault

A full-stack, secure password management application built with React.js (frontend) and Django REST Framework (backend). This project is designed to showcase client-side encryption, RESTful API integration, authentication, and a clean, responsive UI.

[Live demo of project](https://passwordvault.info)

## Important Notice

This project is not intended for production use. It is provided as a demonstration of software development abilities only.

**Do not store real passwords or sensitive information in this system. No security guarantees are provided, and the author accepts no liability for misuse or data loss.**

## Features

- Secure user registration and login with JWT
- Create, read, update, and delete password entries
- Client-side encryption to keep passwords secure
- Responsive, modern UI using React and Sass
- PostgreSQL database and RESTful API
- Separation of frontend and backend concerns

## Tech Stack

**Frontend:**

- React.js
- Sass
- Axios
- React Router

Originally scoped to include a React Native/Expo app, but instead focussed efforts on delivering a fully responsive web app due to native module incompatibilities, time constraints and clearer product focus.

**Backend:**

- Django REST Framework
- PostgreSQL
- JWT (JSON Web Tokens)

## Repositories

- [Frontend Repo](https://github.com/Mowhite29/Password-Vault/tree/main/frontend)
- [Backend Repo](https://github.com/Mowhite29/Password-Vault/tree/main/backend)

## Getting Started

Each component (frontend and backend) has its own setup instructions in its respective `README.md`.

### 1. Clone Repositories

```bash
git clone https://github.com/Mowhite29/Password-Vault.git
```

### 2. Run Backend

Follow the backend README instructions to install dependencies, configure environment variables, run migrations, and start the server.

### 3. Run Frontend

Follow the frontend README instructions to install dependencies and start the development server.

## Folder Structure

```bash
password-vault/
├── frontend/          # React.js frontend
│   └── README.md
├── backend/           # Django backend
│   └── README.md
├── docs/              # Documentation (roadmap, skill mapping)
├── README.md          # Project overview (this file)
```

## Documentation

- [Skill Showcase](./docs/SKILLS.md)
- [Security Considerations](./docs/SECURITY_CONSIDERATIONS.md)
- [Testing](./docs/TESTING.md)
- [Original Project](./docs/ORIGINAL_PROJECT.md)
