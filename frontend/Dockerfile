# /frontend/Dockerfile

# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb (if you have one)
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of your code
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Build the application for production
#RUN bun run build

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["bun", "run", "dev"]
