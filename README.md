# Pulse

A fitness and wellness platform that helps users track workouts, monitor progress, and improve overall health.

## Overview

Pulse is a full-stack web application focused on practical fitness tracking and wellness workflows.  
It combines workout management, nutrition logging, progress monitoring, and user profile insights in one platform, with AI-assisted coaching support.

## Live link 

checkout the live version of project here: https://pulse-oxys.onrender.com

---

## Project Structure

```text
Pulse/
├── client/   # Frontend (React / Vite)
└── server/   # Backend (Node.js / Express)
```

## Features

- User authentication (register, login, logout, session restore)
- Dashboard with personalized user stats
- Progress tracking (streaks, sessions, calories, weight logs)
- Exercise/workout management and library-style browsing
- AI chatbot support for fitness and wellness guidance
- Responsive UI for desktop and mobile

## Tech Stack

### Frontend

- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT-based auth + cookie/session handling

## Installation and Setup

### 1) Clone the repository

```bash
git clone <repo-url>
cd Pulse
```

### 2) Setup the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000
GROQ_API_KEY=<your-groq-api-key>

ACCESS_TOKEN_SECRET=<your-access-token-secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=10d
```

Run backend:

```bash
npm run dev
```

### 3) Setup the frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` (configured in Vite scripts).

## Environment Variables

### Backend (`server/.env`)

- `MONGODB_URI`: MongoDB connection string
- `PORT`: server port (default: `5000`)
- `GROQ_API_KEY`: AI provider key used by chatbot endpoints
- `ACCESS_TOKEN_SECRET`: JWT access token secret
- `ACCESS_TOKEN_EXPIRY`: Access token lifetime
- `REFRESH_TOKEN_SECRET`: JWT refresh token secret
- `REFRESH_TOKEN_EXPIRY`: Refresh token lifetime

### Frontend (`client/.env`)

- `VITE_BACKEND_URL`: Backend base URL (for API requests)

## API Overview (Basic)

Base URL: `http://localhost:5000/api`

### Authentication and User

- `POST /users/register` (auth register, equivalent of `/auth/register`)
- `POST /users/login` (auth login, equivalent of `/auth/login`)
- `POST /users/logout`
- `POST /users/refresh-token`
- `GET /users/profile`
- `GET /users/me`
- `PATCH /users/profile`
- `PATCH /users/password`

### Workouts and Progress

- `GET /workouts`
- `POST /workouts`
- `GET /progress/dashboard`
- `GET /progress/stats`
- `GET /progress/sessions`
- `GET /progress/weight`
- `POST /progress/weight`

## Future Improvements

- Real-time analytics and richer visual insights
- Improved AI recommendation quality and personalization
- Social/community features (friends, challenges, shared plans)
- Expanded test coverage and CI workflows

## Contribution

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes
4. Push the branch
5. Open a pull request with a clear description

## License

This project is currently not licensed.  


