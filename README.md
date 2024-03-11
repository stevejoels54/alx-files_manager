# 0x04. Files manager

## Overview

This project serves as a culmination of the back-end trimester focusing on authentication, NodeJS, MongoDB, Redis, pagination, and background processing. The objective is to develop a simple platform for uploading and viewing files with features like user authentication, file listing, upload, permission management, file viewing, and thumbnail generation for images. While guided step by step, developers have the freedom to implement the solution, structure files, and utilize helper functions, with the "utils" folder serving as a handy resource.

## Getting Started

To begin, ensure you have the necessary resources installed and configured:

- Node.js: Install and set up Node.js, preferably version 12.x.x.
- MongoDB: Set up MongoDB for data storage.
- Redis: Configure Redis for temporary data storage.
- Required npm packages: Install dependencies listed in the `package.json` file using `$ npm install`.

## Usage

1. **User Authentication**: Authentication is implemented via tokens to ensure secure access to the platform.
2. **File Operations**:
    - **List All Files**: Retrieve a list of all uploaded files.
    - **Upload a New File**: Add a new file to the platform.
    - **Change Permission of a File**: Modify file permissions for secure access.
    - **View a File**: Access and view files.
3. **Thumbnail Generation**: Automatically generate thumbnails for image files for enhanced user experience.

## Resources

Before diving into the project, it's recommended to familiarize yourself with the following resources:

- Node.js Getting Started Guide
- Process API Documentation
- Express.js Getting Started Guide
- Mocha Documentation for testing
- Nodemon Documentation for automatic restarts
- MongoDB for data storage
- Bull for background processing
- Image Thumbnail for thumbnail generation
- Mime-Types for file type detection
- Redis for temporary data storage

## Learning Objectives

By the end of this project, you should be able to:

- Create an API using Express.js
- Implement user authentication
- Store and manage data in MongoDB
- Utilize Redis for temporary data storage
- Set up and manage background workers for processing tasks

## Requirements

- **Editors**: You may use vi, vim, emacs, or Visual Studio Code for development.
- **Operating System**: All files will be interpreted/compiled on Ubuntu 18.04 LTS.
- **File Extensions**: Ensure all files use the `.js` extension.
- **Linting**: Your code will be verified against ESLint for code quality.

## Provided Files

In addition to the project requirements, the following files are provided:

- `package.json`: Contains dependencies for the project.
- `.eslintrc.js`: Configuration file for ESLint.
- `babel.config.js`: Configuration file for Babel.

## Get Started

To begin development:

1. Clone this repository.
2. Install dependencies using `$ npm install`.
3. Follow the project instructions and enjoy building your file management platform!

Remember to refer to the provided resources and keep track of your learning objectives. Happy coding! 🚀
