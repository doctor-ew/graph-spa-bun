# graph-pwa/spa

## Overview
graph-spa-bun is a full-stack application showcasing a modern approach to querying and displaying data from the "Rick and Morty" API. The backend is powered by AWS Lambda and Serverless framework, enabling scalable cloud-based operations. The frontend, built with Next.js and leveraging Bun for an optimized runtime environment, provides a responsive and dynamic user experience.

## Features
- **Serverless Backend:** AWS Lambda-based backend for efficient API request handling.
- **Next.js with Bun Frontend:** Fast and efficient frontend with Next.js, utilizing Bun for superior performance.
- **Interactive UI:** Engaging interface for easy access to "Rick and Morty" character data.
- **Responsive Design:** Consistent and adaptive design across various devices.

## Getting Started
### Prerequisites
- Node.js (Version x.x.x or higher)
- Bun runtime environment
- AWS CLI (configured with credentials)
- Serverless Framework

### Installation
1. Clone the Repository
   ```sh
   git clone https://github.com/doctor-ew/graph-spa-bun.git
   cd graph-spa-bun
    ```
2. install Dependencies

```sh
bun install
```
3. Configure Environment 

* Create and set up your .env file with necessary variables.

4. Deploy the Backend

```sh
cd backend
serverless deploy
```

5. Start the Frontend

```sh
cd frontend
bun start
```

### Usage
Open http://localhost:3000 in your browser to interact with the application.

### Architecture

### License
This project is under the MIT License.

Note: This README was prepared by ReFactr Deployment Wizard, a tailored GPT model specialized in guiding users through deploying full-stack applications, focusing on Next.js frontends with Bun on AWS and backend deployments utilizing AWS services.
