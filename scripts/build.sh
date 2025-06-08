#!/bin/bash

# Build the frontend application
cd frontend
npm install
npm run build

# Build the backend application
cd ../backend
npm install

# Build the AI models
cd ../ai-models
pip install -r requirements.txt

# Build the mobile application
cd ../mobile
npm install

# Build the admin dashboard
cd ../admin-dashboard
npm install

# Return to the root directory
cd ..

echo "Build process completed successfully!"