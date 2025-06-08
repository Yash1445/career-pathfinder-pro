# Mobile Application for SkillSync

This directory contains the mobile application for the SkillSync project, built using React Native. The mobile app is designed to provide users with access to their career development tools and resources on the go.

## Directory Structure

- **src/**: Contains the source code for the mobile application.
  - **components/**: Reusable components used throughout the app.
  - **screens/**: Screen components representing different views in the app.
  - **navigation/**: Navigation setup for the app, including stack and tab navigators.
  - **services/**: Service files for handling API calls and other business logic.
  - **store/**: State management files for managing application state.
  - **utils/**: Utility functions and helpers used across the app.

- **android/**: Contains Android-specific files and configurations.

- **ios/**: Contains iOS-specific files and configurations.

## Getting Started

1. **Installation**: Make sure you have Node.js installed. Then, navigate to the mobile directory and run:
   ```
   npm install
   ```

2. **Running the App**: To run the app on an emulator or physical device, use:
   ```
   npm run android   # For Android
   npm run ios       # For iOS
   ```

3. **Development**: You can start the development server with:
   ```
   npm start
   ```

## Features

- User authentication and profile management.
- Career path exploration and skill development resources.
- Job matching and recommendations based on user profiles.
- Responsive design for both Android and iOS platforms.

## Contributing

Contributions are welcome! Please refer to the main project [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on how to contribute to the SkillSync project.

## License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.