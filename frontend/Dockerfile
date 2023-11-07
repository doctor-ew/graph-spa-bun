# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json, bun.lockb, and other necessary files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your code
COPY . .

# Build the application (if you have a build script in your package.json)
RUN bun run build

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js application in development mode
CMD ["bun", "run", "dev"]
