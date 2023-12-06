// Function to fetch global COVID-19 totals
async function fetchGlobalStats() {
    try {
        const response = await fetch('https://disease.sh/v3/covid-19/all');
        const data = await response.json();
        // Update the dashboard with the fetched data
        updateGlobalStats(data);
    } catch (error) {
        console.error('Error fetching global COVID-19 data:', error);
    }
}

// Function to update the dashboard with global COVID-19 data
function updateGlobalStats(data) {
    // Example: Update relevant HTML elements with data
    document.getElementById('totalCases').textContent = data.cases;
    document.getElementById('totalRecovered').textContent = data.recovered;
    document.getElementById('totalDeaths').textContent = data.deaths;
}

// Function to fetch global COVID-19 map data
async function fetchGlobalMapData() {
    try {
        const response = await fetch('https://disease.sh/v3/covid-19/countries');
        const data = await response.json();
        // Initialize Leaflet map
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        // Add markers to the map based on the fetched data
        addMarkersToMap(map, data);
    } catch (error) {
        console.error('Error fetching global COVID-19 map data:', error);
    }
}

// Function to add markers to the Leaflet map
function addMarkersToMap(map, data) {
    // Example: Loop through the data and add markers to the map
    data.forEach(country => {
        const { countryInfo, cases } = country;
        const marker = L.marker([countryInfo.lat, countryInfo.long])
            .bindPopup(`<strong>${country.country}</strong><br>Cases: ${cases}`)
            .addTo(map);
    });
}

// Fetch and display global COVID-19 totals on page load
fetchGlobalStats();

// Fetch and display global COVID-19 map data on page load
fetchGlobalMapData();

// Initialize Leaflet map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Function to search COVID-19 data
function searchData() {
    const searchInput = document.getElementById('searchInput').value;
    // Implement the logic to fetch and display data based on the search input
    // You can use the Johns Hopkins University API for this
    // Example: https://disease.sh/v3/covid-19/jhucsse/counties/{county}
}
