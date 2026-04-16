# Advanced Calculator

This is a comprehensive web-based calculator application that goes beyond basic arithmetic, offering scientific functions, unit conversions, matrix operations, statistical analysis, and interactive graphing capabilities.

## Features

   Basic & Scientific Calculator: Perform standard arithmetic operations (+, -, \, /) along with scientific functions like sin, cos, tan, log, exp, and sqrt. Includes memory functions (M+, M-, MR, MC) and constants (π, e).
   Unit Conversion: Convert between various units across different categories:
       Length: Meter, Kilometer, Centimeter, Millimeter, Mile, Yard, Foot, Inch.
       Mass: Kilogram, Gram, Milligram, Ton, Pound, Ounce.
       Time: Second, Millisecond, Minute, Hour, Day.
       Temperature: Celsius, Fahrenheit, Kelvin.
       Volume: Liter, Milliliter, Gallon, Quart, Pint, Cup, Fluid Ounce, Cubic Meter, Cubic Foot, Cubic Inch.
       Speed: Meters/Second, Kilometers/Hour, Miles/Hour, Feet/Second, Knots.
   Matrix Calculations:
       Create square matrices of a specified size (up to 5x5).
       Calculate the determinant of a matrix.
       Calculate the inverse of a matrix.
   Statistical Analysis: Input a series of numbers and calculate key statistics such as:
       Mean
       Median
       Standard Deviation
   Interactive Graphing:
       Plot one or multiple functions of 'x' (e.g., `sin(x); x^2`). Separate multiple functions with a semicolon.
       The graph is interactive, allowing users to zoom and pan using mouse controls.
       Each plotted function is displayed with a unique color.
   Calculation History: Keeps a running list of your recent calculations.
   Responsive Design: The interface adapts to different screen sizes, from desktops to mobile devices, for an optimal user experience.

## Technologies Used

   HTML5: Structure of the web application.
   CSS3: Styling and layout, including responsive design with media queries.
   JavaScript (ES6+): Core logic for calculator functions, unit conversions, matrix operations, statistics, and graphing.
   Math.js: A powerful JavaScript math library for handling complex mathematical operations, parsing expressions, and providing matrix and statistical functions.
   Plotly.js: A robust charting library used for generating interactive and customizable graphs.

## How to Use

1. Open `index.html`: Simply open the `index.html` file in your web browser.
2.Navigate Tabs: Use the navigation links at the top to switch between Calculator, Matrix Calculations, Statistical Analysis, and Graphing tabs.

 Calculator Tab
   Click the number and operator buttons to input your expression.
   Use `C` to clear the display, `DEL` to backspace.
   `M+`, `M-`, `MR`, `MC` are for memory operations.
   `sin`, `cos`, `tan`, `log`, `exp`, `sqrt` provide scientific functions.
   `π` and `e` insert common mathematical constants.
   For unit conversion, select the `Convert from unit` category, enter a value, select the `Convert to unit`, and click `Convert`.

 Matrix Calculations Tab
   Enter the desired size for your square matrix and click `Create Matrix`.
   Fill in the values in the generated matrix input fields.
   Click `Calculate Determinant` or `Calculate Inverse` to see the results.

 Statistical Analysis Tab
   Enter a series of numbers separated by commas in the input field (e.g., `10, 20, 30, 40`).
   Click `Calculate Stats` to view the Mean, Median, and Standard Deviation.

 Graphing Tab
   Enter a function of `x` (e.g., `x^2`, `sin(x)`, `log(x)`).
   To plot multiple functions, separate them with a semicolon (e.g., `sin(x); cos(x)`).
   Click `Plot Graph`.
   The graph is interactive:
       Zoom: Use your mouse scroll wheel.
       Pan: Click and drag the graph.
       Hover: Move your mouse over the lines to see specific point values.

## Development

The project is structured with standard web development practices:
   `index.html`: Main HTML file.
   `styles.css`: CSS for styling the application.
   `script.js`: JavaScript for all interactive functionalities.

 Libraries Used (via CDN)
   [Math.js](https://mathjs.org/)
   [Plotly.js](https://plotly.com/javascript/)

## Developed by

KathikCodingSolutions
