// Calculator functionality
let display = document.getElementById('display');
let memory = 0;
let calculationHistory = [];

function appendToDisplay(value) {
    display.value += value;
}

function calculate() {
    try {
        let result = math.evaluate(display.value);
        calculationHistory.push(`${display.value} = ${result}`);
        updateHistoryList();
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

function clearDisplay() {
    display.value = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function memoryAdd() {
    memory += math.evaluate(display.value);
}

function memorySubtract() {
    memory -= math.evaluate(display.value);
}

function memoryRecall() {
    display.value = memory;
}

function memoryClear() {
    memory = 0;
}

function insertConstant(constant) {
    if (constant === 'pi') {
        appendToDisplay(math.pi);
    } else if (constant === 'e') {
        appendToDisplay(math.e);
    }
}

// Unit conversion functionality
function convertUnits() {
    const unitFrom = document.getElementById('unit-from').value;
    const unitValue = parseFloat(document.getElementById('unit-value').value);
    const unitTo = document.getElementById('unit-to').value;

    let result;
    switch (unitFrom) {
        case 'length':
            result = convertLength(unitValue, unitTo);
            break;
        case 'mass':
            result = convertMass(unitValue, unitTo);
            break;
        case 'time':
            result = convertTime(unitValue, unitTo);
            break;
        default:
            result = 'Invalid unit';
    }

    display.value = result;
}

function convertLength(value, unitTo) {
    switch (unitTo) {
        case 'meter':
            return value; // assume input is in meters
        case 'kilometer':
            return value / 1000;
        case 'centimeter':
            return value * 100;
        case 'millimeter':
            return value * 1000;
        case 'mile':
            return value * 0.000621371;
        case 'yard':
            return value * 1.09361;
        case 'foot':
            return value * 3.28084;
        case 'inch':
            return value * 39.3701;
    }
}

function convertMass(value, unitTo) {
    switch (unitTo) {
        case 'kilogram':
            return value; // assume input is in kilograms
        case 'gram':
            return value * 1000;
        case 'milligram':
            return value * 1000000;
        case 'ton':
            return value / 1000;
        case 'pound':
            return value * 2.20462;
        case 'ounce':
            return value * 35.274;
    }
}

function convertTime(value, unitTo) {
    switch (unitTo) {
        case 'second':
            return value; // assume input is in seconds
        case 'millisecond':
            return value * 1000;
        case 'minute':
            return value / 60;
        case 'hour':
            return value / 3600;
        case 'day':
            return value / 86400;
    }
}

function performUnitConversion() {
    const unitFrom = document.getElementById('unit-from').value;
    const unitValue = parseFloat(document.getElementById('unit-value').value);
    const unitTo = document.getElementById('unit-to').value;

    let result;
    switch (unitFrom) {
        case 'length':
            if (unitTo === 'meter') {
                result = unitValue; // assume input is in meters
            } else if (unitTo === 'kilometer') {
                result = unitValue / 1000;
            } else if (unitTo === 'centimeter') {
                result = unitValue * 100;
            } else if (unitTo === 'millimeter') {
                result = unitValue * 1000;
            } else if (unitTo === 'mile') {
                result = unitValue * 0.000621371;
            } else if (unitTo === 'yard') {
                result = unitValue * 1.09361;
            } else if (unitTo === 'foot') {
                result = unitValue * 3.28084;
            } else if (unitTo === 'inch') {
                result = unitValue * 39.3701;
            }
            break;
        case 'mass':
            if (unitTo === 'kilogram') {
                result = unitValue; // assume input is in kilograms
            } else if (unitTo === 'gram') {
                result = unitValue * 1000;
            } else if (unitTo === 'milligram') {
                result = unitValue * 1000000;
            } else if (unitTo === 'ton') {
                result = unitValue / 1000;
            } else if (unitTo === 'pound') {
                result = unitValue * 2.20462;
            } else if (unitTo === 'ounce') {
                result = unitValue * 35.274;
            }
            break;
        case 'time':
            if (unitTo === 'second') {
                result = unitValue; // assume input is in seconds
            } else if (unitTo === 'millisecond') {
                result = unitValue * 1000;
            } else if (unitTo === 'minute') {
                result = unitValue / 60;
            } else if (unitTo === 'hour') {
                result = unitValue / 3600;
            } else if (unitTo === 'day') {
                result = unitValue / 86400;
            }
            break;
    }

    display.value = result;
}

// Matrix calculations functionality
function createMatrix() {
    let size = parseInt(document.getElementById('matrix-size').value);
    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            matrix[i][j] = parseFloat(prompt(`Enter element [${i+1}][${j+1}]`));
        }
    }
    let matrixContainer = document.getElementById('matrix-container');
    matrixContainer.innerHTML = '';
    for (let i = 0; i < size; i++) {
        let row = document.createElement('div');
        for (let j = 0; j < size; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.value = matrix[i][j];
            row.appendChild(input);
        }
        matrixContainer.appendChild(row);
    }
}

function calculateDeterminant() {
    let matrix = [];
    let inputs = document.querySelectorAll('#matrix-container input');
    for (let i = 0; i < inputs.length; i++) {
        matrix.push(parseFloat(inputs[i].value));
    }
    let size = Math.sqrt(matrix.length);
    let determinant = math.det(matrix, size);
    document.getElementById('matrix-result').innerHTML = `Determinant: ${determinant}`;
}

function calculateInverse() {
    let matrix = [];
    let inputs = document.querySelectorAll('#matrix-container input');
    for (let i = 0; i < inputs.length; i++) {
        matrix.push(parseFloat(inputs[i].value));
    }
    let size = Math.sqrt(matrix.length);
    let inverse = math.inv(matrix, size);
    document.getElementById('matrix-result').innerHTML = `Inverse: ${inverse}`;
}

// Statistical analysis functionality
function calculateStats() {
    let input = document.getElementById('stats-input').value;
    let numbers = input.split(',').map(Number);
    let mean = math.mean(numbers);
    let median = math.median(numbers);
    let stdDev = math.std(numbers);
    document.getElementById('stats-result').innerHTML = `Mean: ${mean}<br>Median: ${median}<br>Standard Deviation: ${stdDev}`;
}

// Graphing functionality
function plotGraph() {
    let input = document.getElementById('graph-input').value;
    let func = math.compile(input);
    let xValues = [];
    let yValues = [];
    for (let x = -10; x <= 10; x += 0.1) {
        xValues.push(x);
        yValues.push(func.evaluate({x: x}));
    }
    let graphContainer = document.getElementById('graph-container');
    graphContainer.innerHTML = '';
    let canvas = document.createElement('canvas');
    graphContainer.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < xValues.length; i++) {
        let x = xValues[i] * 20 + canvas.width / 2;
        let y = -yValues[i] * 20 + canvas.height / 2;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

// Update calculation history list
function updateHistoryList() {
    let historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    calculationHistory.forEach(calculation => {
        let listItem = document.createElement('li');
        listItem.textContent = calculation;
        historyList.appendChild(listItem);
    });
}