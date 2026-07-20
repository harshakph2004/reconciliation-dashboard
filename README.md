# Reconciliation Dashboard

## Live Demo
Frontend: https://reconciliation-dashboard-two.vercel.app/login

Backend: https://reconciliation-dashboard.onrender.com

## GitHub
https://github.com/harshakph2004/reconciliation-dashboard

## Features
- User Signup & Login
- JWT Authentication
- CSV Upload (Orders & Payments)
- Data Reconciliation
- Dashboard Statistics
- Search & Filter Results
- PostgreSQL Database

## Tech Stack
- React.js
- Node.js
- Express.js
- PostgreSQL (Neon)
- Prisma ORM
- Render
- Vercel

## Local Setup

```bash
git clone https://github.com/harshakph2004/reconciliation-dashboard.git

cd server
npm install

cd ../client
npm install
```



## Architecture

React Frontend → Express Backend → Prisma ORM → PostgreSQL

## Reconciliation Logic

- Matches records using Order ID / Order Reference.
- Identifies:
  - Matched Records
  - Missing Payments
  - Amount Mismatches
- The reconciliation process is deterministic and produces consistent results for the same input.

## Dashboard

- Total Orders
- Total Payments
- Reconciled Records
- Search & Filter Table

## Future Improvements

- LLM-based discrepancy explanations
- Export reports
- Advanced analytics
- Better visualizations

## AI Usage

AI coding assistants were used to assist with development, debugging, and documentation. The application logic and implementation were reviewed and understood before submission.
