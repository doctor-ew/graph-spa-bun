# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install the application dependencies inside the container
RUN yarn install

# Copy the rest of the application to the container
COPY . .

# Specify the command to run when the container starts
CMD [ "yarn", "start" ]
