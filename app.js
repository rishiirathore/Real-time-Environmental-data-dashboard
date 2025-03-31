const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const { fetchData } = require('./dataFetcher');
const indexRouter = require('./routes');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send initial data to newly connected client
  fetchData()
    .then(data => {
      socket.emit('initialData', data);
    })
    .catch(err => {
      console.error('Error fetching initial data:', err);
    });
  
  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Set up interval for real-time data updates
const FETCH_INTERVAL = 15000; // 15 seconds
setInterval(async () => {
  try {
    const data = await fetchData();
    io.emit('dataUpdate', data); // Broadcast to all connected clients
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`Data updated at ${timestamp}`);
  } catch (error) {
    console.error('Error in data update interval:', error);
  }
}, FETCH_INTERVAL);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, io };