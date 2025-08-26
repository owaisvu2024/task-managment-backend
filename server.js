// Express, Mongoose, aur dusre zaruri modules ko import karte hain
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config(); // .env file se environment variables load karne ke liye

// Routes files ko import karte hain
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const { error } = require('console');

const app = express();
const server = http.createServer(app);

// Socket.IO server setup
const io = new Server(server, {
    cors: {
        // Yahan par hum batate hain ki kin websites ko hamare server se connect hone ki
        // ijazat hai. Ye Netlify ka link add karna bilkul sahi hai.
        origin: ["http://localhost:3000","https://task-mangment-system.netlify.app"],

        methods: ["GET", "POST"]
    }
});

// Middleware setup
// CORS middleware har incoming request ko allowed origins se aane deta hai
app.use(cors());
app.use(express.json()); // JSON data ko parse karne ke liye

// Database Connection
// Environment variable ka use karke MongoDB se connect karte hain
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Routes (Endpoints)
// '/api/tasks' jaise URLs ko unke corresponding route files se connect karte hain
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Root URL '/' ke liye ek simple GET request handler
// Ye check karne ke liye kaam aata hai ki server chal raha hai ya nahi
app.get('/',(req,res )=>{
    res.send({
        activestatus: true,
        error: false,
    });
});

// Socket.IO event handler
// Jab koi naya user connect hota hai to ye function chalta hai
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Jab user disconnect hota hai to ye function chalta hai
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Server ko shuru karna
// process.env.PORT se port number leta hai, ya agar nahi mila to 5000 use karta hai
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
