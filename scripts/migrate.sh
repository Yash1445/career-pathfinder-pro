#!/bin/bash

# This script is used to run database migrations.

# Load environment variables
source .env

# Run migrations
echo "Running database migrations..."
# Assuming you are using a SQL migration tool like Flyway or Sequelize
# Replace the following command with the appropriate migration command for your setup
npx sequelize-cli db:migrate

echo "Database migrations completed."