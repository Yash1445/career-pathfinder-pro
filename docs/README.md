# Skillsync Project Documentation

Welcome to the Skillsync project! This documentation provides an overview of the project structure, setup instructions, and key features.

## Project Overview

Skillsync is a comprehensive platform designed to assist users in managing their career paths, skills development, and job opportunities. The project consists of multiple components, including a frontend application, a backend API, AI models for analysis, a mobile application, and an admin dashboard.

## Directory Structure

The project is organized into several key directories:

- **frontend/**: Contains the React/Next.js application with reusable components, pages, hooks, and services.
- **backend/**: Houses the Node.js/Python backend API, including controllers, models, routes, and middleware.
- **ai-models/**: Contains machine learning models and scripts for training and serving AI functionalities.
- **mobile/**: A React Native mobile application that shares services with the backend.
- **admin-dashboard/**: An admin panel for managing users, careers, and analytics.
- **docs/**: Documentation for the project, including API references and deployment guides.
- **infrastructure/**: Contains DevOps configurations for Docker, Kubernetes, Terraform, and monitoring.
- **scripts/**: Utility scripts for setup, deployment, and maintenance tasks.
- **tests/**: End-to-end tests, load tests, and security tests for the application.
- **data/**: Static data files related to career paths, skills, jobs, and courses.

## Getting Started

To get started with the Skillsync project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd skillsync
   ```

2. **Install dependencies**:
   - For the frontend:
     ```
     cd frontend
     npm install
     ```
   - For the backend:
     ```
     cd backend
     npm install
     ```

3. **Set up environment variables**:
   - Copy the example environment files and update them with your configuration:
     ```
     cp .env.example .env
     cp backend/.env.example backend/.env
     ```

4. **Run the applications**:
   - Start the backend server:
     ```
     cd backend
     npm start
     ```
   - Start the frontend application:
     ```
     cd frontend
     npm start
     ```

5. **Access the applications**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

## Key Features

- **User Profiles**: Users can create and manage their profiles, including skills and career preferences.
- **Career Analysis**: AI-driven insights to help users understand their career paths and job opportunities.
- **Job Board**: A platform for users to explore job listings tailored to their skills and preferences.
- **Learning Resources**: Access to courses and certifications to enhance skills and career growth.
- **Admin Dashboard**: Tools for administrators to manage users, monitor analytics, and oversee the platform.

## Contribution

We welcome contributions to the Skillsync project! Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file for guidelines on how to contribute.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

## Acknowledgments

Thank you for your interest in Skillsync! We hope you find this project helpful in your career development journey.