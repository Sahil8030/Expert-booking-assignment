import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import expertRoutes from './routes/experts.js';
import bookingRoutes from './routes/bookings.js';
import { errorHandler } from './middleware/errorHandler.js';
import { registerSocketHandlers } from './socket/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  ...(process.env.CLIENT_URL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  'https://expert-booking-assignment.onrender.com',
  'https://expert-booking-assignment.vercel.app',
];
const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

const io = new Server(httpServer, {
  cors: {
    origin: uniqueAllowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

app.set('io', io);
registerSocketHandlers(io);

app.use(
  cors({
    origin: uniqueAllowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  process.stderr.write(
    'Missing MONGODB_URI. Add it to backend/.env (loaded from the backend folder).\n'
  );
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    httpServer.listen(PORT, () => {
      process.stdout.write(`API listening on http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  });
