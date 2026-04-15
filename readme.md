# 🎟️ Book My Ticket

A full-stack ticket booking system with authentication, backend APIs, and frontend UI.

---

## 🚀 Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Drizzle ORM
- Auth: JWT (Access & Refresh Tokens)
- Infra: Docker

---

## 📁 Project Structure

book-my-ticket/
├── client   (Frontend)
└── server   (Backend)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

git clone <repo-url>
cd book-my-ticket

---

## 🖥️ Frontend Setup

cd client
npm install
npm run dev

Runs at:
http://localhost:5173

---

## 🛠️ Backend Setup

### Start database (Docker)

cd server
docker compose up -d

### Install dependencies

npm install

### Run migrations (Drizzle)

npx drizzle-kit generate
npx drizzle-kit migrate

### Start server

npm run dev

---

## 🔐 Features

- JWT authentication (Access + Refresh tokens)
- Signup / Signin UI
- Backend auth module
- Dockerized PostgreSQL
- Drizzle ORM migrations

---

## 👨‍💻 Author

Built by Jatin