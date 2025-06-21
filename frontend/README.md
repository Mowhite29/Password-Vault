# Password Vault - Frontend

This is the frontend React application for the Password Vault project. It provides a responsive and user-friendly interface for managing passwords securely.

## Features

- User authentication (login, registration)
- Password vault display and management
- Client-side encryption of sensitive data
- Responsive UI built with React and Tailwind CSS
- API integration with backend services

## Tech Stack

- React.js (with Hooks)
- Sass for styling
- React Router for navigation
- Axios for API calls
- Environment variables for configuration

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
git clone https://github.com/Mowhite29/Password-Vault-Project.git
cd password-vault-project/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` with your backend API URL:

```
REACT_APP_API_URL=https://api.passwordvault.com
```

### Running the Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

To build the app for production:

```bash
npm run build
# or
yarn build
```

The optimized build will be in the `build/` directory.

## Testing

Run frontend tests with:

```bash
npm test
# or
yarn test
```

## Folder Structure

```bash
src/
┣  assets/           # Static assets like images and fonts
┣  components/       # Reusable UI components
┣  hooks/            # Custom React hooks
┣  pages/            # Route-based pages
┣  services/         # API and encryption logic
┣  styles/           # Global styles and themes
┣  utils/            # Utility functions
```

## API Endpoints

The mobile application communicates with the backend API to manage passwords. Here are the key endpoints:

- **GET** `/api/passwords` – Fetch all passwords.
- **POST** `/api/passwords` – Add a new password.
- **GET** `/api/passwords/{id}` – Fetch a password by ID.
- **PUT** `/api/passwords/{id}` – Update a password by ID.
- **DELETE** `/api/passwords/{id}` – Delete a password by ID.

Authentication is handled via JWT tokens, which should be included in the headers of each request.
