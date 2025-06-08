FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./api /app/api
COPY ./models /app/models
COPY ./training /app/training

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["python", "api/model_server.py"]