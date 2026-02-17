# Use a specific Node.js version for reproducibility (e.g., Node.js 18)
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# This leverages Docker's layer caching. These layers are only rebuilt if package files change.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the extension. This will create a .foxe file in the 'dist' directory.
# The 'build' script is typically defined in your package.json
RUN npm run build