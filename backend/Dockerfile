# /backend/Dockerfile

FROM node:20
# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files (if you have one)
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of your application code
COPY . .

# Specify the command to run when the container starts
CMD ["yarn", "start"]

# Expose the port your app runs on
EXPOSE 4000
