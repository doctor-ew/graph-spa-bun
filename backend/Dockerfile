# Use the official Bun image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb (if you have one)
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of your application code
COPY . .

# Specify the command to run when the container starts
CMD ["bun", "run", "start"]

# Expose the port your app runs on
EXPOSE 4000
