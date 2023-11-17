# Graph SPA Bun - Rick and Morty Application
## Overview
This is a Next.js project, bootstrapped with create-next-app, showcasing a rich, interactive experience with the characters from the Rick and Morty series. The project uses modern web technologies to deliver a fast and responsive Progressive Web App (PWA).

### Visit the live application: [Rick and Morty PWA](https://pwag.doctorew.com/rick-and-morty)

### Architecture
#### Frontend
* Technology: Next.js
* Deployment: AWS Amplify
* Custom Domain: Hosted with a custom subdomain for a seamless user experience.
* Features: Utilizes next/font for font optimization and loading custom Google Fonts.

#### Backend
* Technology: Node.js (planned to refactor to Golang)
* Deployment: AWS Lambda@Edge via serverless framework
* Custom Domain: Integrated with a custom subdomain.
* Data Store: Currently using in-memory storage, with plans to move to Redis/ElastiCache on AWS Fargate.


### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### File Structure
* app/page.tsx: The main page file which can be edited and will auto-update as you develop.

### Upcoming Features
#### Frontend (FE)
* Landing Page: An engaging and informative first point of contact for users.
* Infinite Scroll: Implementing infinite scrolling for a seamless browsing experience.
* Graph Pagination: Enhancements in data fetching to support pagination at the GraphQL level.

#### Backend (BE)
* Golang Refactoring: Transitioning the backend service from Node.js to Golang for improved performance.
* Redis/ElastiCache Integration: Migrating to AWS ElastiCache for scalable and efficient caching, hosted on AWS Fargate.

### Learn More
* [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
Contributions

### Contributions
Feel free to check out the Next.js GitHub repository and contribute. Your feedback and contributions are highly appreciated!

### Deployment
Deploying with AWS Amplify
This application is deployed using AWS Amplify, which provides a CI/CD pipeline and hosting for Next.js applications. For more information, check out [Next.js on AWS Amplify](https://docs.amplify.aws/start/q/integration/next).
