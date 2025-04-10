// static/js/script.js

console.log('Hello, world!');

// Add event listener to form submission
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Get form data
    const formData = new FormData(e.target);
    // Send form data to server
    fetch('/contact/', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});