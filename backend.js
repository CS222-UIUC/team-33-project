// backend.js

const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs   = require('fs/promises');
const path = require('path');
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

/**
 * Overwrite backend/readings.txt so it contains just "0\n"
 */
async function resetReadingsTxt() {
  const filePath = path.join(__dirname, 'backend', 'readings.txt');
  await fs.writeFile(filePath, '0\n', 'utf8');
}

/**
 * Check that the microcontroller is actually updating readings.txt:
 * 1) reset readings.txt to zero
 * 2) run read_serial.py inside backend/ for 3s
 * 3) kill it and inspect the first line—
 *    if it's still zero, throw an error
 */
async function checkMicrocontroller() {
  // 1) reset the file
  await resetReadingsTxt();

  // 2) spawn the Python reading script
  const backendDir = path.join(__dirname, 'backend');
  const proc = spawn('python3', ['read_serial.py'], {
    cwd: backendDir,
    stdio: 'ignore'
  });

  // 3) wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  // stop the script
  proc.kill();

  // read back the first value
  const filePath = path.join(backendDir, 'readings.txt');
  const raw      = await fs.readFile(filePath, 'utf8');
  const first    = raw.split(/\r?\n/)[0].trim();
  const val      = parseFloat(first);

  if (isNaN(val) || val === 0) {
    throw new Error('Microcontroller is not plugged in');
  }
}

app.get('/api/collect', async (req, res, next) => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });

  try {
    // FIRST: make sure the microcontroller actually updated readings.txt
    await checkMicrocontroller(); // TODO: Let the user know by displaying the error message.

    
    // Resolve an absolute path like “…/backend/readings.txt”
    const filePath = path.join(__dirname, 'backend', 'readings.txt');

    // Read the whole file
    const raw = await fs.readFile(filePath, 'utf8');

    // split → trim → drop empties
    const lines = raw
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      throw new Error('readings.txt contains no data');
    }

    const value = parseFloat(lines[0]);
    if (Number.isNaN(value)) {
      throw new Error(`Invalid number in readings.txt: "${lines[0]}"`);
    }

    // Everything succeeded — store & respond
    collectedData.push({ time, temp: value });
    res.json({ time, temp: value });

  } catch (err) {
    // If the microcontroller check failed, send that error to the client
    if (err.message === 'Microcontroller is not plugged in') {
      return res.status(400).json({ error: err.message });
    }
    next(err); // let your global handler format other errors
  }
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
  const sumX  = data.reduce((acc, p) => acc + p.x, 0);
  const sumY  = data.reduce((acc, p) => acc + p.y, 0);
  const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);

  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

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

// global JSON error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
