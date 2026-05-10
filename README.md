# Expert-booking-assignment

Full-stack expert booking app: **Express + MongoDB + Socket.IO** backend and **React (Vite)** frontend.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A **MongoDB** instance and connection string (local or [Atlas](https://www.mongodb.com/cloud/atlas))

## 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (this folder is loaded automatically):

| Variable        | Description                                        |
|-----------------|----------------------------------------------------|
| `MONGODB_URI`   | MongoDB connection string (**required**)           |
| `CLIENT_URL`    | Frontend origin for CORS and Socket.IO (see below) |
| `PORT`          | API port (optional; default **5000**)            |

Example for local development:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/expert-booking
CLIENT_URL=http://localhost:5173
PORT=5000
```

Optional: seed sample data:

```bash
npm run seed
```

Start the API (with reload):

```bash
npm run dev
```

Production-style run (no reload):

```bash
npm start
```

The server listens on `http://localhost:5000` (or your `PORT`) until MongoDB connects successfully.

## 2. Frontend

In a **second** terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

| Variable            | Description                                      |
|---------------------|--------------------------------------------------|
| `VITE_API_URL`      | Axios base URL (must include `/api`)             |
| `VITE_SERVER_URL`   | Socket.IO server URL (backend origin, no path) |

Example matching the backend defaults:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**). It must match `CLIENT_URL` in `backend/.env`.

## 3. Run order

1. Start MongoDB (if you use a local database).
2. Start **backend** (`backend`: `npm run dev`).
3. Start **frontend** (`frontend`: `npm run dev`).

## Build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

## Deploy frontend on Vercel (without `VITE_API_URL`)

The app can call your API through **same-origin** `/api` so the browser does not need a public “backend URL” in the client.

1. Deploy the **frontend** folder (or set Vercel **Root Directory** to `frontend`).
2. In Vercel → **Settings → Environment Variables**, add **`BACKEND_URL`** only (mark as **Sensitive**). Use your Express server origin with **no** trailing slash, e.g. `https://your-api.onrender.com`.  
   This is used **only** by the serverless proxy in `frontend/api/[...path].js`. You do **not** need `VITE_API_URL` unless you want to override and talk to the API directly.
3. On your **backend**, set **`CLIENT_URL`** to your Vercel site, e.g. `https://your-app.vercel.app`.

### Socket.IO (live updates)

Production defaults connect to **`window.location.origin`** with path **`/socket.io/`**. Vercel must forward that traffic to your Express server. Add a **rewrite** (same backend host as `BACKEND_URL`) — duplicate URL is required because JSON cannot read env vars:

```json
{
  "rewrites": [
    { "handle": "filesystem" },
    {
      "source": "/socket.io/:path*",
      "destination": "https://YOUR-BACKEND-HOST/socket.io/:path*"
    },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Merge this with `frontend/vercel.json` so you keep **`handle: filesystem`** and the SPA fallback. Replace **`YOUR-BACKEND-HOST`** with the same host you use in `BACKEND_URL`.

Optional: set **`VITE_SERVER_URL`** on Vercel if you prefer pointing the socket client at the backend explicitly instead of same-origin + rewrite.

Local dev still uses **`frontend/.env`** with `VITE_API_URL` / `VITE_SERVER_URL` if you want; otherwise dev defaults to `http://localhost:5000`.
