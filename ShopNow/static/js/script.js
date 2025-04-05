// Add event listener to the buy now button
document.querySelectorAll('.btn button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Product added to cart!');
    });
});