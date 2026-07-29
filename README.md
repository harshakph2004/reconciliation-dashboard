# AI-Powered Reconciliation Dashboard

A full-stack web application for reconciling order and payment records with secure authentication, CSV uploads, automated discrepancy detection, and AI-powered explanations.

## Live Demo
Frontend: https://reconciliation-dashboard-two.vercel.app/

Backend: https://reconciliation-dashboard.onrender.com/

For Order CSV and Payment CSV Refer these files :


## Features
- JWT Authentication
- CSV Upload
- Automated Reconciliation
- AI-Powered Discrepancy Explanations
- Dashboard Statistics
- Search & Filter

## Tech Stack
- React.js
- Node.js
- Express.js
- PostgreSQL (Neon)
- Prisma ORM
- Groq API
- Bootstrap
- Vercel
- Render

## Local Setup

```bash
git clone https://github.com/harshakph2004/reconciliation-dashboard.git
cd reconciliation-dashboard

cd server
npm install

cd ../client
npm install
```

### AI configuration

Copy `server/.env.example` to `server/.env` and set `GROQ_API_KEY` to a key from your Groq project. For the deployed Render service, add the same `GROQ_API_KEY` environment variable in the Render dashboard, then redeploy the backend. The application uses `openai/gpt-oss-20b` by default; change `GROQ_MODEL` only if you need another Groq model.

For local frontend development, copy `client/.env.example` to `client/.env` so requests are sent to your local API instead of the deployed server.

## Architecture

```
React → Express → Prisma → PostgreSQL
```

## AI Usage

AI coding assistants were used for development support, debugging, and documentation. All implementation and application logic were reviewed and understood before submission.
