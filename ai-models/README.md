# AI Models Documentation

This directory contains the implementation and resources for the AI models used in the SkillSync project. The AI models are designed to analyze career paths, match skills, predict salaries, and recommend jobs based on user profiles and preferences.

## Directory Structure

- **training/**: Contains resources for training the AI models.
  - **datasets/**: Includes datasets used for training the models.
  - **notebooks/**: Jupyter notebooks for exploratory data analysis and model development.
  - **scripts/**: Python scripts for data preprocessing, model training, evaluation, and data collection.

- **models/**: Contains the trained machine learning models in serialized format.

- **api/**: Provides the API for serving the AI models.
  - **model_server.py**: Main server file for handling model inference requests.
  - **endpoints.py**: Defines the API endpoints for model interactions.
  - **preprocessing.py**: Functions for preprocessing input data before inference.
  - **inference.py**: Functions for running inference on the models.

- **requirements.txt**: Lists the Python dependencies required for the AI models.

- **Dockerfile**: Docker configuration for containerizing the AI models.

## Usage

To use the AI models, ensure that the required dependencies are installed as specified in `requirements.txt`. You can run the model server using the provided scripts in the `api/` directory.

## Training

For training the models, navigate to the `training/scripts/` directory and run the appropriate Python scripts. The datasets required for training can be found in the `datasets/` directory.

## Contributing

Contributions to the AI models are welcome! Please follow the guidelines outlined in the main project documentation for contributing to the SkillSync project.