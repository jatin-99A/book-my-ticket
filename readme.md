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

```text
book-my-ticket/
├── client/   # Frontend (React)
└── server/   # Backend (Node.js / Express)
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd book-my-ticket
```

---

## 🖥️ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Runs at:
```
http://localhost:5173
```

---

## 🛠️ Backend Setup

### Start database (Docker)

```bash
cd server
docker compose up -d
```

### Install dependencies

```bash
npm install
```

### Run migrations (Drizzle)

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Start server

```bash
npm run dev
```

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
