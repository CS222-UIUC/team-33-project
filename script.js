
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

function getFirstReading() {
    // 1. Open a synchronous XHR
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'backend/readings.txt', false /* false = synchronous */);
    xhr.send(null);

    // 2. Check for HTTP errors
    if (xhr.status < 200 || xhr.status >= 300) {
        throw new Error(`Failed to load readings.txt (status ${xhr.status})`);
    }

    // 3. Split into lines, trim & drop empties
    const lines = xhr.responseText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      throw new Error('readings.txt contains no data');
    }

    // 4. Parse the first non‑empty line
    const value = parseFloat(lines[0]);
    if (Number.isNaN(value)) {
        throw new Error("Invalid number in readings.txt: \"" + lines[0] + "\"");
    }

    return value;
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
document.getElementById("predict-btn").addEventListener("click", function(){
    predictBtn = this;
    alert("Starting Prediction!")
    predictBtn.disabled = true;
    predictBtn.style.backgroundColor = "#9ACBD0";




    fetch('http://localhost:3000/api/predict', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            // Extract slope and intercept from the response
            const slope = data.slope;
            const intercept = data.intercept;
    
            // Get x-values (labels) from the chart
            const xValues = myChart.data.labels;
    
            // Calculate the y-values for the line of best fit based on the slope and intercept
            const yFitValues = xValues.map(x => slope * x + intercept);
    
            // Add the line of best fit dataset to the chart
            myChart.data.datasets.push({
                label: 'Line of Best Fit',
                data: yFitValues,  // Predicted y-values based on slope and intercept
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0,  // Line will be straight
                fill: false  // No area under the line
            });
    
            // Re-render the chart to display the updated data
            myChart.update();
        }
    })
    .catch(err => {
        console.error("Prediction error:", err);
        alert("Prediction failed.");
    });
    
});

function resetChartAndUI() {
    
    myChart.data.labels = [];
    myChart.data.datasets = [myChart.data.datasets[0]]; 

    myChart.update();

    const simulateButton = document.getElementById("simulate-btn");
    const collectButton = document.getElementById("collect-btn");
    const predictButton = document.getElementById("predict-btn");

    simulateButton.disabled = false;
    collectButton.disabled = false;
    predictButton.disabled = true;

    simulateButton.textContent = "Simulate Data";
    collectButton.textContent = "Collect Data";
    predictButton.textContent = "Predict";

    simulateButton.style.backgroundColor = "#006A71";
    collectButton.style.backgroundColor = "#006A71";
    predictButton.style.backgroundColor = "#ccc";
}
