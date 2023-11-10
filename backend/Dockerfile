# /backend/Dockerfile

# Use the official Bun image
#FROM oven/bun:latest
FROM node:20
# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb (if you have one)
#COPY package.json ./

# Copy package.json and yarn.lock files (if you have one)
COPY package.json yarn.lock ./

# Install dependencies
#RUN bun install
# Install dependencies using yarn
# It's a good practice to install yarn explicitly as some base images might not have it pre-installed
RUN yarn install



# Copy the rest of your application code
COPY . .

# Specify the command to run when the container starts
#CMD ["bun", "run", "start"]
CMD ["yarn", "start"]

# Expose the port your app runs on
EXPOSE 4000
