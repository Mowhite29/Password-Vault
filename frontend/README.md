# Password Vault - Frontend

This is the frontend React application for the Password Vault project. It provides a responsive and user-friendly interface for managing passwords securely.

## Features

- User authentication (login, registration)
- Password vault display and management
- Client-side encryption of sensitive data
- Responsive UI built with React and Sass
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
git clone https://github.com/Mowhite29/Password-Vault.git
cd password-vault/frontend
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
┣  components/       # UI components
┣  hooks/            # Custom React hooks
┣  services/         # API
┣  styles/           # Global styles and themes
┣  utils/            # Utility functions
```

## API Endpoints

The application communicates with the backend API to manage passwords. Here are the key endpoints:

- **GET** `/vault` – Fetch all passwords.
- **POST** `/vault` – Add a new password.
- **PUT** `/vault` – Update a password.
- **DELETE** `/vault` – Delete a password.

Authentication is handled via JWT tokens, which should be included in the headers of each request.
