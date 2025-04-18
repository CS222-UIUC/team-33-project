
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

function addDataPoint() {
    fetch('http://localhost:3000/api/temperature')
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
    if (simulationInterval) {
        // Stop simulation
        clearInterval(simulationInterval);
        simulationInterval = null;
        this.textContent = "Simulate Data";
        this.style.backgroundColor = "#006A71";
    } else {
        // Start simulation
        startTime = new Date();
        simulationInterval = setInterval(addDataPoint, 1000); // Update every 1 second
        this.textContent = "Stop Simulation";
        this.style.backgroundColor = "#9ACBD0";
    }
});

// Event listener for predict button
document.getElementById("predict-btn").addEventListener("click", function(){
    alert("Starting Prediction!")
});

// Event listener for collect button
document.getElementById("collect-btn").addEventListener("click", function(){
    alert("Starting Data Collection!")
});

  