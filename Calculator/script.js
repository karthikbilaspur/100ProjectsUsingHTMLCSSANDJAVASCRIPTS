// Ensure math.js is loaded before this script
// <script src="https://cdn.jsdelivr.net/npm/mathjs@11.3.3/dist/math.min.js"></script>

let display = document.getElementById('display');
let memory = 0;
let calculationHistory = [];

function appendToDisplay(value) {
    // Prevent multiple leading zeros or decimal points at the beginning
    if (display.value === '0' && value !== '.' && !isNaN(value)) {
        display.value = value;
    } else if (display.value === '' && value === '.') {
        display.value = '0.'; // Start with 0. if '.' is first
    } else {
        display.value += value;
    }
}

function calculate() {
    try {
        let result = math.evaluate(display.value);
        calculationHistory.push(`${display.value} = ${result}`);
        updateHistoryList();
        display.value = result;
    } catch (error) {
        display.value = 'Error'; // More robust error handling can be added here
        console.error("Calculation Error:", error);
    }
}

function clearDisplay() {
    display.value = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function memoryAdd() {
    try {
        memory += math.evaluate(display.value);
        display.value = memory; // Show current memory value
    } catch (error) {
        display.value = 'Error';
    }
}

function memorySubtract() {
    try {
        memory -= math.evaluate(display.value);
        display.value = memory; // Show current memory value
    } catch (error) {
        display.value = 'Error';
    }
}

function memoryRecall() {
    display.value = memory;
}

function memoryClear() {
    memory = 0;
    // Optionally update display to show memory cleared or current value
}

function insertConstant(constant) {
    if (constant === 'pi') {
        appendToDisplay(math.pi.toString());
    } else if (constant === 'e') {
        appendToDisplay(math.e.toString());
    }
}

// Unit conversion functionality (enhanced)
// Original helper functions (assuming input is in the base unit of the category)
function convertLength(value, unitTo) {
    // Input 'value' is assumed to be in meters
    switch (unitTo) {
        case 'meter': return value;
        case 'kilometer': return value / 1000;
        case 'centimeter': return value * 100;
        case 'millimeter': return value * 1000;
        case 'mile': return value * 0.000621371;
        case 'yard': return value * 1.09361;
        case 'foot': return value * 3.28084;
        case 'inch': return value * 39.3701;
        default: return undefined;
    }
}

function convertMass(value, unitTo) {
    // Input 'value' is assumed to be in kilograms
    switch (unitTo) {
        case 'kilogram': return value;
        case 'gram': return value * 1000;
        case 'milligram': return value * 1000000;
        case 'ton': return value / 1000;
        case 'pound': return value * 2.20462;
        case 'ounce': return value * 35.274;
        default: return undefined;
    }
}

function convertTime(value, unitTo) {
    // Input 'value' is assumed to be in seconds
    switch (unitTo) {
        case 'second': return value;
        case 'millisecond': return value * 1000;
        case 'minute': return value / 60;
        case 'hour': return value / 3600;
        case 'day': return value / 86400;
        default: return undefined;
    }
}

// NEW Unit Conversion Functions
function convertTemperature(value, unitTo) {
    // Input 'value' is assumed to be in Celsius for calculation base
    let celsius = value; // Default if 'unit-from' category is 'temperature'

    switch (unitTo) {
        case 'celsius': return celsius;
        case 'fahrenheit': return (celsius * 9/5) + 32;
        case 'kelvin': return celsius + 273.15;
        default: return undefined;
    }
}

function convertVolume(value, unitTo) {
    // Input 'value' is assumed to be in Liters for calculation base
    let liters = value;

    switch (unitTo) {
        case 'liter': return liters;
        case 'milliliter': return liters * 1000;
        case 'gallon': return liters * 0.264172; // US Gallon
        case 'quart': return liters * 1.05669; // US Liquid Quart
        case 'pint': return liters * 2.11338; // US Liquid Pint
        case 'cup': return liters * 4.22675; // US Cup
        case 'fluid_ounce': return liters * 33.814; // US Fluid Ounce
        case 'cubic_meter': return liters / 1000;
        case 'cubic_foot': return liters * 0.0353147;
        case 'cubic_inch': return liters * 61.0237;
        default: return undefined;
    }
}

function convertSpeed(value, unitTo) {
    // Input 'value' is assumed to be in Meters/Second for calculation base
    let metersPerSecond = value;

    switch (unitTo) {
        case 'meters_per_second': return metersPerSecond;
        case 'kilometers_per_hour': return metersPerSecond * 3.6;
        case 'miles_per_hour': return metersPerSecond * 2.23694;
        case 'feet_per_second': return metersPerSecond * 3.28084;
        case 'knots': return metersPerSecond * 1.94384;
        default: return undefined;
    }
}

// Main unit conversion dispatcher
function convertUnits() {
    const unitFromCategory = document.getElementById('unit-from').value;
    const unitValue = parseFloat(document.getElementById('unit-value').value);
    const unitTo = document.getElementById('unit-to').value;

    if (isNaN(unitValue)) {
        display.value = 'Invalid value';
        return;
    }

    let result;
    switch (unitFromCategory) {
        case 'length':
            result = convertLength(unitValue, unitTo);
            break;
        case 'mass':
            result = convertMass(unitValue, unitTo);
            break;
        case 'time':
            result = convertTime(unitValue, unitTo);
            break;
        case 'temperature':
            result = convertTemperature(unitValue, unitTo);
            break;
        case 'volume':
            result = convertVolume(unitValue, unitTo);
            break;
        case 'speed':
            result = convertSpeed(unitValue, unitTo);
            break;
        default:
            result = 'Invalid unit category';
    }

    display.value = result !== undefined && typeof result === 'number' ? result.toFixed(8) : 'Conversion Error';
}

// Matrix calculations functionality
function createMatrix() {
    let sizeInput = document.getElementById('matrix-size').value;
    let size = parseInt(sizeInput);

    if (isNaN(size) || size <= 0 || size > 5) { // Limit size for usability
        alert("Please enter a valid matrix size (1-5).");
        return;
    }

    let matrixContainer = document.getElementById('matrix-container');
    matrixContainer.innerHTML = ''; // Clear previous matrix

    for (let i = 0; i < size; i++) {
        let row = document.createElement('div');
        row.className = 'matrix-row'; // Add class for styling
        for (let j = 0; j < size; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.value = 0; // Default value
            input.id = `matrix-cell-${i}-${j}`; // Unique ID for each cell
            row.appendChild(input);
        }
        matrixContainer.appendChild(row);
    }
}

function getMatrixFromInputs() {
    let matrixContainer = document.getElementById('matrix-container');
    let rows = matrixContainer.getElementsByClassName('matrix-row');
    let matrix = [];
    let size = rows.length;

    if (size === 0) {
        alert("Please create a matrix first.");
        return null;
    }

    for (let i = 0; i < size; i++) {
        let rowInputs = rows[i].getElementsByTagName('input');
        let currentRow = [];
        for (let j = 0; j < size; j++) {
            currentRow.push(parseFloat(rowInputs[j].value));
        }
        matrix.push(currentRow);
    }
    return matrix;
}

function displayMatrixResult(resultMatrix) {
    let matrixResultDiv = document.getElementById('matrix-result');
    if (!resultMatrix) {
        matrixResultDiv.innerHTML = "Error in matrix operation or no result.";
        return;
    }

    let html = '<table>';
    for (let i = 0; i < resultMatrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < resultMatrix[i].length; j++) {
            html += `<td>${resultMatrix[i][j].toFixed(4)}</td>`; // Format to 4 decimal places
        }
        html += '</tr>';
    }
    html += '</table>';
    matrixResultDiv.innerHTML = html;
}

function calculateDeterminant() {
    let matrix = getMatrixFromInputs();
    if (!matrix) return;

    try {
        let determinant = math.det(matrix);
        document.getElementById('matrix-result').innerHTML = `Determinant: ${determinant.toFixed(6)}`;
    } catch (error) {
        document.getElementById('matrix-result').innerHTML = `Error calculating determinant: ${error.message}`;
        console.error("Determinant Error:", error);
    }
}

function calculateInverse() {
    let matrix = getMatrixFromInputs();
    if (!matrix) return;

    try {
        let inverse = math.inv(matrix);
        displayMatrixResult(inverse);
    } catch (error) {
        document.getElementById('matrix-result').innerHTML = `Error calculating inverse: ${error.message}`;
        console.error("Inverse Error:", error);
    }
}

// Statistical analysis functionality
function calculateStats() {
    let input = document.getElementById('stats-input').value;
    let numbers = input.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length === 0) {
        document.getElementById('stats-result').innerHTML = "Please enter valid numbers separated by commas.";
        return;
    }

    try {
        let mean = math.mean(numbers);
        let median = math.median(numbers);
        let stdDev = math.std(numbers); // Sample standard deviation by default in math.js

        document.getElementById('stats-result').innerHTML = `
            Mean: ${mean.toFixed(4)}<br>
            Median: ${median.toFixed(4)}<br>
            Standard Deviation: ${stdDev.toFixed(4)}
        `;
    } catch (error) {
        document.getElementById('stats-result').innerHTML = `Error calculating stats: ${error.message}`;
        console.error("Stats Error:", error);
    }
}

// Graphing functionality (enhanced with Plotly.js for multiple functions and interactivity)
function plotGraph() {
    let input = document.getElementById('graph-input').value;
    // Allow multiple functions separated by semicolon
    let functions = input.split(';').map(f => f.trim()).filter(f => f.length > 0);

    let traces = [];
    const xValues = [];
    // Define x range and step for plotting
    for (let x = -10; x <= 10; x += 0.1) {
        xValues.push(x);
    }

    functions.forEach((funcStr, index) => {
        try {
            // Use math.js compile to evaluate the function
            let func = math.compile(funcStr);
            const yValues = xValues.map(x => func.evaluate({x: x}));

            traces.push({
                x: xValues,
                y: yValues,
                mode: 'lines',
                name: funcStr, // Label for the legend
                line: {
                    // Generate different colors for each function
                    color: `hsl(${index * 137 % 360}, 70%, 50%)`,
                    width: 2
                }
            });
        } catch (error) {
            console.error(`Error plotting function '${funcStr}':`, error);
            // Provide user feedback directly on the display or a dedicated message area
            display.value = `Graph Error: ${funcStr.substring(0, 15)}...`; // Truncate long error
            alert(`Error in function "${funcStr}": ${error.message}`);
        }
    });

    let graphContainer = document.getElementById('graph-container');
    // Plotly.js will render the graph into this div.
    // Ensure the div exists and has a defined width/height in CSS or inline style.
    // If there were errors compiling all functions, Plotly.newPlot might still work with valid traces.
    if (traces.length > 0) {
        const layout = {
            title: 'Function Plot',
            xaxis: { title: 'x', range: [-10, 10], zeroline: true, zerolinecolor: '#999', zerolinewidth: 1 }, // Set initial x-axis range
            yaxis: { title: 'f(x)', zeroline: true, zerolinecolor: '#999', zerolinewidth: 1 },
            hovermode: 'closest', // Enable hovering to see point info
            responsive: true, // Make the plot responsive
            margin: { t: 50, b: 50, l: 50, r: 20 }, // Adjust margins
            showlegend: true, // Show legend for multiple functions
            legend: { x: 1, xanchor: 'right', y: 1 }
        };

        // Plotly automatically adds zoom and pan controls
        Plotly.newPlot('graph-container', traces, layout, {
            scrollZoom: true, // Enable scroll to zoom with mouse wheel
            displayModeBar: true, // Show the modebar with zoom/pan tools, etc.
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian'], // Customize buttons
            displaylogo: false // Hide Plotly logo
        });
    } else {
        graphContainer.innerHTML = '<p style="text-align: center; color: #555;">No valid functions to plot.</p>';
    }
}

// Update calculation history list
function updateHistoryList() {
    let historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    // Show only the last 10-15 calculations for brevity
    const recentHistory = calculationHistory.slice(-15);
    recentHistory.forEach(calculation => {
        let listItem = document.createElement('li');
        listItem.textContent = calculation;
        historyList.appendChild(listItem);
    });
    // Scroll to the bottom of the history list
    historyList.scrollTop = historyList.scrollHeight;
}

// Initial tab display (optional, based on your CSS for showing/hiding tabs)
document.addEventListener('DOMContentLoaded', () => {
    // Basic tab switching logic (if not handled by CSS :target or a framework)
    const navLinks = document.querySelectorAll('nav ul li a');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        document.querySelector(tabId).style.display = 'block';

        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`nav ul li a[href="${tabId}"]`).classList.add('active');
    }

    // Set initial tab
    const initialTab = window.location.hash || '#calculator-tab';
    showTab(initialTab);

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor jump
            const tabId = event.target.getAttribute('href');
            showTab(tabId);
            history.pushState(null, '', tabId); // Update URL hash without page reload
        });
    });
});