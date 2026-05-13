# Mini-CRM - Lead Manager

A Lead Management System built as part of a MERN Stack Intern assignment.

## Live Demo
[minicrm-beige.vercel.app](https://minicrm-beige.vercel.app)

## Tech Stack
- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (frontend) + Railway (backend)

## Features
- User Authentication (Register/Login with JWT)
- Protected routes
- Add and manage leads
- Track lead status (New / Contacted / Converted)
- Assign leads to team members
- Search and filter leads by status
- Pagination on lead table
- Update lead status via dropdown
- Delete leads
- Basic analytics dashboard

## Lead Model
- Name, Email, Phone
- Status: new | contacted | converted
- Assigned To
- Created At

## Setup & Installation

### Clone the repo
git clone https://github.com/abuzarshk16/Mini-CRM.git
cd Mini-CRM

### Install dependencies
npm install
cd server && npm install

### Environment Variables
Create a `.env` file in the root:
APP_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string

Create a `.env` in the server folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### Run locally
# Frontend
npm run dev

# Backend
cd server && node index.js
