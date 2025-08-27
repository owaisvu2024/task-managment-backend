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

// NOTE: Frontend ka URL humne environment variable mein rakha hai
// Isko aap Vercel par bhi set karenge, taake aapki app dono platforms par theek chale
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, 
    methods: ["GET", "POST"]
  }
});

// Express CORS middleware
app.use(cors({
  origin: FRONTEND_URL
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes (Middleware se pehle)
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.get('/',(req,res )=>{
  res.send({
    activestatus:true,
    error:false,
  })
})

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