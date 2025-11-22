import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import driverRoutes from './routes/drivers.js';
import jobRoutes from './routes/jobs.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/los-pollos-tracker';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join room based on user role
  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.join(role); // Join 'admin' or 'driver' room
    socket.join(userId); // Join personal room
    console.log(`👤 User ${userId} joined as ${role}`);
  });

  // Handle vehicle position updates from drivers
  socket.on('vehicle:update', (data) => {
    // Broadcast to all admins
    socket.to('admin').emit('vehicle:updated', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Los Pollos Tracker API is running' });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});
