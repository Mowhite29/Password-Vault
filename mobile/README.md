# Password Vault - Mobile Application

This is the frontend React Native/Expo application for the Password Vault Project. It provides a secure and user-friendly way to access and manage the password vault on the go.

## Features

- Biometric Authentication using fingerprint or face recognition
- Offline Access
- Cross-Platform Sync
- Secure Storage
- Modern UI/UX

## Tech Stack

- React Native
- Expo
- React Navigation
- Axios
- React Native Biometrics

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
git clone https://github.com/Mowhite29/Password-Vault-Project.git
cd password-vault-project/mobile
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
npm run start
# or
yarn start
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
npm run test
# or
yarn test
```

## Folder Structure

The mobile application follows a modular folder structure:

```bash
mobile/
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

