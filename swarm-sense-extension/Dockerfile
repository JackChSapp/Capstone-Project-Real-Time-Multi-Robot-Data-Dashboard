# Node version (node -v)
FROM node:24-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first, improves caching
COPY package*.json ./

# Install dependencies node
RUN npm install

# Copy the rest of the application source code
COPY . .