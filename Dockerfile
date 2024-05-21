# Use the official Node.js image as the base image
FROM node:20.10.0-alpine

ARG SA_KEY
ENV SA_KEY=$SA_KEY

RUN apk add --no-cache ffmpeg
RUN apk add --no-cache lame

# Set the working directory
WORKDIR /app

# Copy files from your computer into the image
COPY . .

RUN npm i -g @nestjs/cli

# Install the dependencies
RUN npm ci

# Specifies what command to run within the container
CMD ["sh", "-c", "npm start"]
