# Testing

As part of my CI pipeline, I will configure Github Action workflows to automatically carry out testing upon each push. </br>

For this I will configure a CI-pipeline workflow for Backend, React.js Frontend and React Native Frontend.


## Backend

### Backend libraries

- **Bandit** - Security-focused static code analysis for Python
- **Flake8** - Lightweight linting and formatting

## Frontend

### Frontend libraries

- **ESLint** - Linting, code quality, style
- **ESLint Security Plugin** - Adds security rules
- **Prettier** - Code formatting
- **nmp audit** - Dependancy vulnerability scanning
- **Retire.js** - JS library vulnerability detection
- **Semgrep** - Security-focused static code analysis

Due to its filesize, Semgrep is only suitable for local testing currently.