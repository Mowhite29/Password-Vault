# Case Study: Password Vault

## Project Overview

Password vault is a full stack application designed to securely manage and store user credentials.
Developed as a potrfolio project, it showcases my skills in authentication, encryption, responsive design and frontend/backend integration.
The app is publicly available at [passwordvault.info](https://passwordvault.info).

## Problem

Many users rely on insecure methods to create and store their passwords. My goal was to build a secure, user friendly password manager that:

- Provides strong client-side encryption
- Enables users to create, store, retrieve and manage their credentials across all of their devices
- Demonstrates security focussed development practises for prospective employers

## Tech Stack

- Frontend: React, React Router, Redux Toolkit
- Backend: Django REST Framework
- Authentication: JWT auth with email verification and password reset
- Encryption: XSalsa20 encryption via TweetNaCl
- Hosting: Render (backend), Netlify (frontend), Neon (database)
- Database: PostgreSQL
- Email service: Resend

## Features

- Secure password storage using client-side encryption for zero-knowledge
- User authentication with email verification and password reset
- CRUD operations for password entries
- Mobile first responsive design
- User-friendly interface for viewing and managing entries
- Test suite for backend
- Rate limiting and throttling to prevent abuse

## Challenges

- Email verification: Original email service was AWS SES but encountered repeatedly refused requests to exit sandbox mode. To solve this Resend was implemented in the project
- Security: Required careful design of encryption/decryption logic to ensure zero-knowledge expectation was fulfilled and to minimise impact in event of security breach
- Mobile app limitations: React Native implementation was scrapped due to compatibility issues with Expo and required Node.js libraries
- Legal considerations: Release of the project to production could have lead to liability issues if there were a breach. Due to lack of funding for penetration testing the decision was made for the application to be released as a demonstration only. Fail safes have been implemented such as a waiver at the frontend and periodic data wipes at the backend

## Final result

The app is stable and secure, with a polished frontend and strong backend infrastructure. All major features are complete and the project demonstrates production ready design and implementation. The codebase is clean and well structured with future expansion in mind

## Takeaways

- Improved understanding of web bas crypto, secure auth flows and full stack design
- Gained experience handling service limitations (AWS SES) and platform compatibility issues
- Demonstrated ability to take a complex, security critical app from idea to deployment