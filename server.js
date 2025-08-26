const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

// Routes
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // <-- Yahan maine 3000 kar diya hai
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes (Middleware se pehle)
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Socket.IO event handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));