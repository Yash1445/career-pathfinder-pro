#!/bin/bash

# This script is used for running tests in the project.

# Exit immediately if a command exits with a non-zero status.
set -e

# Run frontend tests
echo "Running frontend tests..."
cd frontend
npm test

# Run backend tests
echo "Running backend tests..."
cd ../backend
npm test

# Run AI models tests
echo "Running AI models tests..."
cd ../ai-models
python -m unittest discover -s tests

# Run mobile tests
echo "Running mobile tests..."
cd ../mobile
npm test

# Run admin dashboard tests
echo "Running admin dashboard tests..."
cd ../admin-dashboard
npm test

echo "All tests completed successfully!"