# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json, bun.lockb, and other necessary files
COPY package.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your code
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# for deploting the build version

# RUN bun next build
# and
# RUN bun next start

RUN bun run dev

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js application in development mode
CMD ["bun", "run", "dev"]
