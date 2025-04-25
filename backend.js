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

app.get('/api/collect', (req, res) => {
    const temperature = 15 + Math.random() * 15; // Generates 15–30 °C
    const time = new Date().toLocaleTimeString();

    collectedData.push({ time, temp: temperature }); // Store collected data

    res.json({ time, temp: temperature });
});


app.post('/api/predict', (req, res) => {
    if (collectedData.length < 2) {
        return res.status(400).json({ 
            error: "Not enough data points for prediction (need at least 2)",
            slope: null,
            intercept: null
        });
    }

    const data = collectedData.map((point, index) => ({
        x: index,
        y: point.temp
    }));

    // Linear regression calculation
    const n = data.length;
    const sumX = data.reduce((acc, p) => acc + p.x, 0);
    const sumY = data.reduce((acc, p) => acc + p.y, 0);
    const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = data.reduce((acc, p) => acc + Math.pow(p.x, 2), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - Math.pow(sumX, 2));
    const intercept = (sumY - slope * sumX) / n;

    // Validate results
    if (isNaN(slope) || isNaN(intercept)) {
        return res.status(400).json({
            error: "Invalid calculation result (possibly constant values)",
            slope: null,
            intercept: null
        });
    }

    res.json({ 
        slope: parseFloat(slope.toFixed(4)), 
        intercept: parseFloat(intercept.toFixed(4)),
        message: "Prediction successful" 
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
