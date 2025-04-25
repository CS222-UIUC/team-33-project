
var ctx = document.getElementById("myChart").getContext("2d");
let simulationInterval = null;
let startTime = null;

// Initialize the chart
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function getRandomInRange(lower, upper) {
    return lower + (Math.random() * (upper - lower));
}

function addDataPoint(state) {

    let url = '';
    
    
    if (state === 'simulate') {
        url = 'http://localhost:3000/api/simulate'; // Simulate temperature
    } else if (state === 'collect') {
        url = 'http://localhost:3000/api/collect'; // Collect temperature
    }
    fetch(url)
        .then(res => res.json())
        .then(data => {
            myChart.data.labels.push(data.time);
            myChart.data.datasets[0].data.push(data.temp);

            if (myChart.data.labels.length > 20) {
                myChart.data.labels.shift();
                myChart.data.datasets[0].data.shift();
            }

            myChart.update('none');
        })
        .catch(err => console.error('Error fetching data:', err));
}

// Event listener for simulate button
document.getElementById("simulate-btn").addEventListener("click", function() {
    const simulateButton = this;
    const collectButton = document.getElementById("collect-btn");

    // Disable the other button and the current button
    simulateButton.disabled = true;
    collectButton.disabled = true;
    simulateButton.textContent = "Simulating...";
    simulateButton.style.backgroundColor = "#ccc"; // Greyed out
    collectButton.style.backgroundColor = "#ccc"; // Greyed out

    // Start simulation
    simulationInterval = setInterval(() => addDataPoint('simulate'), 1000);


    // Stop simulation after 20 seconds
    setTimeout(() => {
        clearInterval(simulationInterval);
        simulationInterval = null;

        simulateButton.textContent = "Simulation Complete";
        console.log("✅ Simulation finished after 20 seconds.");
        


        const predictBtn = document.getElementById("predict-btn");
        predictBtn.disabled = false;
        predictBtn.style.backgroundColor = "#006A71";
        // No need to re-enable the buttons
        // simulateButton.disabled = false;
        // collectButton.disabled = false;
        // simulateButton.style.backgroundColor = "#006A71"; // Reset color
        // collectButton.style.backgroundColor = "#006A71"; // Reset color
        // simulateButton.textContent = "Simulate Data"; // Reset text
        // collectButton.textContent = "Collect Data"; // Reset text
    }, 10000); // 20 seconds = 20000 ms
});

// Event listener for collect button
document.getElementById("collect-btn").addEventListener("click", function() {
    const collectButton = this;
    const simulateButton = document.getElementById("simulate-btn");

    // Disable the other button and the current button
    collectButton.disabled = true;
    simulateButton.disabled = true;
    collectButton.textContent = "Collecting...";
    collectButton.style.backgroundColor = "#ccc"; // Greyed out
    simulateButton.style.backgroundColor = "#ccc"; // Greyed out

    // Start collecting data (same as simulation)
    simulationInterval = setInterval(() => addDataPoint('collect'), 1000);

    // Stop collection after 20 seconds
    setTimeout(() => {
        clearInterval(simulationInterval);
        simulationInterval = null;

        collectButton.textContent = "Collection Complete";
        console.log("✅ Data collection finished after 20 seconds.");


        const predictBtn = document.getElementById("predict-btn");
        predictBtn.disabled = false;
        predictBtn.style.backgroundColor = "#006A71";
        // No need to re-enable the buttons
        // collectButton.disabled = false;
        // simulateButton.disabled = false;
        // collectButton.style.backgroundColor = "#006A71"; // Reset color
        // simulateButton.style.backgroundColor = "#006A71"; // Reset color
        // collectButton.textContent = "Collect Data"; // Reset text
        // simulateButton.textContent = "Simulate Data"; // Reset text
    }, 20000); // 20 seconds = 20000 ms
});

// Event listener for predict button
// Event listener for predict button
// Event listener for predict button
// Event listener for predict button
document.getElementById("predict-btn").addEventListener("click", function() {
    const predictBtn = this;
    predictBtn.disabled = true;
    predictBtn.textContent = "Predicting...";
    predictBtn.style.backgroundColor = "#ccc";

    try {
        // Get temperature data from chart
        const tempData = myChart.data.datasets[0].data;
        
        // Check minimum data points
        if (tempData.length < 2) {
            throw new Error("Need at least 2 data points");
        }

        // Create array of {x, y} points (x = index, y = temperature)
        const dataPoints = tempData.map((y, index) => ({ x: index, y }));

        // Calculate regression terms
        const n = tempData.length;
        const sumX = dataPoints.reduce((acc, p) => acc + p.x, 0);
        const sumY = dataPoints.reduce((acc, p) => acc + p.y, 0);
        const sumXY = dataPoints.reduce((acc, p) => acc + p.x * p.y, 0);
        const sumX2 = dataPoints.reduce((acc, p) => acc + p.x ** 2, 0);

        const denominator = n * sumX2 - sumX ** 2;
        
        let slope, intercept;
        if (denominator === 0) {
            // Handle horizontal line case
            slope = 0;
            intercept = sumY / n;
            updateChartWithFit(slope, intercept, "No trend (constant values)");
        } else {
            slope = (n * sumXY - sumX * sumY) / denominator;
            intercept = (sumY - slope * sumX) / n;
            updateChartWithFit(slope, intercept, "Success");
        }
    } catch (err) {
        console.error("Prediction error:", err);
        document.getElementById("equation-display").textContent = 
            "Prediction failed: " + err.message;
        document.getElementById("equation-display").style.color = "red";
    } finally {
        predictBtn.disabled = false;
        predictBtn.textContent = "Predict";
        predictBtn.style.backgroundColor = "#006A71";
    }
});

// Helper function to update chart with best fit line
function updateChartWithFit(slope, intercept, message) {
    // Generate fit line data
    const xValues = Array.from({ length: myChart.data.labels.length }, (_, i) => i);
    const yFitValues = xValues.map(x => slope * x + intercept);

    // Update or add dataset
    const fitDatasetIndex = myChart.data.datasets.findIndex(ds => ds.label === 'Line of Best Fit');
    if (fitDatasetIndex >= 0) {
        myChart.data.datasets[fitDatasetIndex].data = yFitValues;
    } else {
        myChart.data.datasets.push({
            label: 'Line of Best Fit',
            data: yFitValues,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0,
            pointRadius: 0,
            fill: false
        });
    }

    myChart.update();
    
    // Update equation display
    document.getElementById("equation-display").textContent = 
        `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)} (${message})`;
    document.getElementById("equation-display").style.color = "#000";
}