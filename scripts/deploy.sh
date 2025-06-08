#!/bin/bash

# Deploy script for the SkillSync project

# Exit on error
set -e

# Build the frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build the backend
echo "Building backend..."
cd backend
npm install
cd ..

# Build the AI models
echo "Building AI models..."
cd ai-models
pip install -r requirements.txt
cd ..

# Start the services using Docker Compose
echo "Starting services..."
docker-compose up -d

echo "Deployment completed successfully!"