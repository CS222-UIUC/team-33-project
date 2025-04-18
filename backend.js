// backend.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Allow JSON in POST if needed later

// Route to simulate temperature data
app.get('/api/temperature', (req, res) => {
    const temperature = 10 + Math.random() * 20; // Simulated 10–30 °C
    const time = new Date().toLocaleTimeString();

    res.json({ time, temp: temperature });
});

// Optional root route (just to see if it's working)
app.get('/', (req, res) => {
    res.send('Backend is running! 🚀');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
