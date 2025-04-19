// backend.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Allow JSON in POST if needed later


const collectedData = [];
// Route to simulate temperature data
app.get('/api/simulate', (req, res) => {
    const temperature = 10 + Math.random() * 20; // Simulated 10–30 °C
    const time = new Date().toLocaleTimeString();



    collectedData.push({ time, temp: temperature });

    res.json({ time, temp: temperature });
});

app.get('/api/collect', (req, res) => {                         //REPLACE WITH COLLECTION CODE
    
    const temperature = 20; // Simulated 15–30 °C range for collection
    const time = new Date().toLocaleTimeString();

    // Just an example of how data might change during collection
    res.json({ time, temp: temperature });
});

app.post('/api/predict', (req, res) => {
    if (collectedData.length < 2) {
        return res.status(400).json({ error: "Not enough data to predict." });
    }

    // Convert time to seconds since start
    const startTime = new Date(`1970-01-01T${collectedData[0].time}Z`);
    const data = collectedData.map(point => {
        const t = new Date(`1970-01-01T${point.time}Z`);
        const x = (t - startTime) / 1000; // x in seconds
        const y = point.temp;
        return { x, y };
    });

    // Linear regression formula
    const n = data.length;
    const sumX = data.reduce((acc, p) => acc + p.x, 0);
    const sumY = data.reduce((acc, p) => acc + p.y, 0);
    const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    res.json({ slope, intercept, message: "Prediction model ready!" });
});



// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
