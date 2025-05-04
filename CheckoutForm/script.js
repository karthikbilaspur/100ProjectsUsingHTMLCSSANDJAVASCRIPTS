const form = document.getElementById('checkout-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zip = document.getElementById('zip').value;
  const cardNumber = document.getElementById('card-number').value;
  const expirationDate = document.getElementById('expiration-date').value;
  const cvv = document.getElementById('cvv').value;

  // Validate the form data
  let isValid = true;

  if (name === '') {
    document.getElementById('name-error').innerHTML = 'Please enter your name';
    isValid = false;
  } else {
    document.getElementById('name-error').innerHTML = '';
  }

  if (email === '') {
    document.getElementById('email-error').innerHTML = 'Please enter your email';
    isValid = false;
  } else {
    document.getElementById('email-error').innerHTML = '';
  }

  // ... validate other fields ...

  if (isValid) {
    // Process the payment
    // For demonstration purposes, we'll just log the data to the console
    console.log({
      name,
      email,
      address,
      city,
      state,
      zip,
      cardNumber,
      expirationDate,
      cvv
    });

    // Display a success message
    document.querySelector('.success-message').style.display = 'block';
    document.querySelector('.loading-animation').style.display = 'none';
  } else {
    document.querySelector('.loading-animation').style.display = 'none';
  }
});