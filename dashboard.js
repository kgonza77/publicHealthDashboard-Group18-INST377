// Function to fetch COVID-19 data based on search criteria
async function fetchCovidData(criteria, value) {
    try {
        let apiUrl = '';
        switch (criteria) {
            case 'country':
                apiUrl = `https://disease.sh/v3/covid-19/countries/${value}`;
                break;
            case 'state':
                apiUrl = `https://disease.sh/v3/covid-19/states/${value}`;
                break;
            default:
                console.error('Invalid search criteria');
                return;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Update HTML with search results
        updateSearchResults(data, criteria);
    } catch (error) {
        console.error('Error fetching search data:', error);
        const table = document.querySelector('.table-info');
        table.innerHTML = '<tr><td colspan="6">Retrieving information. Please wait!</td></tr>';
    }
}

// Helper function to generate column titles
function generateColumnTitles(searchCriteria) {
    if (searchCriteria === 'country') {
        return ['Flag', 'Country', 'Population', 'Total Cases', 'Deaths', 'Recoveries', 'Active Cases'];
    } else if (searchCriteria === 'state') {
        return ['State', 'Population', 'Total Cases', 'Deaths', 'Recoveries', 'Active Cases'];
    }
    return [];
}

// Helper function to add rows to the table
function addTableRow(tableBody, data, searchCriteria) {
    const row = document.createElement('tr');

    if (searchCriteria === 'country') {
        row.innerHTML = `
            <td>${data.country ? `<img src="${data.countryInfo.flag}" alt="${data.country}" width="30" height="20">` : '-'}</td>
            <td>${data.country || '-'}</td>
            <td>${data.population || '-'}</td>
            <td>${data.cases || '-'}</td>
            <td>${data.deaths || '-'}</td>
            <td>${data.recovered || '-'}</td>
            <td>${data.active || '-'}</td>
        `;
    } else if (searchCriteria === 'state') {
        row.innerHTML = `
            <td>-</td>
            <td>${data.state || '-'}</td>
            <td>${data.population || '-'}</td>
            <td>${data.cases || '-'}</td>
            <td>${data.deaths || '-'}</td>
            <td>${data.recovered || '-'}</td>
            <td>${data.active || '-'}</td>
        `;
    }

    tableBody.appendChild(row);
}

// Helper function to generate table body
function generateTableBody(data, searchCriteria) {
    const tableBody = document.createElement('tbody');

    if (data.countries) {
        // Handle contries data
        for (const country of data.countries) {
            addTableRow(tableBody, country, searchCriteria);
        }
    } else {
        // Handle country or state data
        addTableRow(tableBody, data, searchCriteria);
    }

    return tableBody;
}

// Function to update HTML with search results
function updateSearchResults(data, searchCriteria) {
    const tableContainer = document.querySelector('.table-info');
    tableContainer.innerHTML = ''; // Clear previous results

    if (!data || (data.countries && data.countries.length === 0)) {
        tableContainer.innerHTML = '<p>No data available</p>';
        return;
    }

    const columnTitles = generateColumnTitles(searchCriteria);
    const table = document.createElement('table');
    table.classList.add('infoTable');

    // Add column titles to the table
    const headerRow = table.createTHead().insertRow();
    columnTitles.forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        headerRow.appendChild(th);
    });

    // Add table body to the table
    const tableBody = generateTableBody(data, searchCriteria);
    table.appendChild(tableBody);

    // Append the table to the container
    tableContainer.appendChild(table);
}

// Function to fetch all countries data
async function fetchAllCountriesData() {
    try {
        const response = await fetch('https://disease.sh/v3/covid-19/countries');
        const data = await response.json();

        // Update HTML with all countries data
        updateAllCountriesData(data);
    } catch (error) {
        console.error('Error fetching all countries data:', error);
        const tableBody = document.querySelector('.table-info');
        tableBody.innerHTML = '<tr><td colspan="6">Retrieving information. Please wait!</td></tr>';
    }
}

// Helper function to add a row to the all countries table
function addAllCountriesTableRow(tableBody, data) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.country ? `<img src="${data.countryInfo.flag}" alt="${data.country}" width="30" height="20">` : '-'}</td>
        <td>${data.country || '-'}</td>
        <td>${data.population || '-'}</td>
        <td>${data.cases || '-'}</td>
        <td>${data.deaths || '-'}</td>
        <td>${data.recovered || '-'}</td>
        <td>${data.active || '-'}</td>
    `;
    tableBody.appendChild(row);
}

// Function to update HTML with all countries data
function updateAllCountriesData(data) {
    const tableContainer = document.querySelector('.table-info');
    tableContainer.innerHTML = ''; // Clear previous results

    if (!data || data.length === 0) {
        tableContainer.innerHTML = '<p>No data available</p>';
        return;
    }

    const columnTitles = generateColumnTitles('country');
    const table = document.createElement('table');
    table.classList.add('infoTable');

    // Add column titles to the table
    const headerRow = table.createTHead().insertRow();
    columnTitles.forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        headerRow.appendChild(th);
    });

    // Add table body to the table
    const tableBody = document.createElement('tbody');
    for (const country of data) {
        addAllCountriesTableRow(tableBody, country);
    }
    table.appendChild(tableBody);

    // Append the table to the container
    tableContainer.appendChild(table);
}

// Function to fetch global COVID-19 data
async function fetchGlobalData() {
    try {
        const response = await fetch('https://disease.sh/v3/covid-19/all');
        const data = await response.json();

        // Update HTML with global COVID-19 data
        document.getElementById('globalCases').textContent = data.cases.toLocaleString();
        document.getElementById('globalDeaths').textContent = data.deaths.toLocaleString();
        document.getElementById('globalRecoveries').textContent = data.recovered.toLocaleString();
        document.getElementById('globalActive').textContent = data.active.toLocaleString();
    } catch (error) {
        console.error('Error fetching global data:', error);
    }
}

// Function to initialize the map
function initMap() {
    const map = L.map('map').setView([0, 0], 2); // Set initial view to the center of the world

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Can keep adding markers or other map features here based on the data
    // we need
}

// Function to search COVID-19 data based on user input
function searchData(criteria) {
    const searchInput = document.getElementById('searchInput').value;
    const table = document.querySelector('.table-info');
    table.innerHTML = '<tr><td colspan="6">Retrieving information. Please wait!</td></tr>';
    fetchCovidData(criteria, searchInput);
}

// Run functions on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchGlobalData();
    initMap();
    fetchAllCountriesData();
});
