// Get the popup and register button
const popup = document.getElementById('popup');
const registerBtn = document.getElementById('register-btn');
const closeBtn = document.getElementById('close-btn');
const registerForm = document.getElementById('register-form');
const passwordInput = document.getElementById('password');
const passwordStrength = document.querySelector('.password-strength');
const loadingAnimation = document.querySelector('.loading-animation');
const successMessage = document.querySelector('.success-message');

// Function to open the popup
function openPopup() {
  popup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
  popup.style.display = 'none';
}

// Add event listener to the register button
registerBtn.addEventListener('click', openPopup);

// Add event listener to the close button
closeBtn.addEventListener('click', closePopup);

// Add event listener to the form submission
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validate the form data
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Show the loading animation
  loadingAnimation.style.display = 'block';

  // Send the form data to the server
  // For demonstration purposes, we'll just log the data to the console
  setTimeout(() => {
    console.log({
      name,
      email,
      phone,
      password
    });

    // Hide the loading animation and show the success message
    loadingAnimation.style.display = 'none';
    successMessage.style.display = 'block';

    // Close the popup after 2 seconds
    setTimeout(closePopup, 2000);
  }, 2000);
});

// Add event listener to the password input
passwordInput.addEventListener('input', () => {
  const password = passwordInput.value;
  const strength = getPasswordStrength(password);

  if (strength === 'good') {
    passwordStrength.classList.add('good');
    passwordStrength.classList.remove('bad');
  } else {
    passwordStrength.classList.add('bad');
    passwordStrength.classList.remove('good');
  }
});

// Function to get the password strength
function getPasswordStrength(password) {
  if (password.length < 8) {
    return 'bad';
  }

  if (!/[a-z]/.test(password)) {
    return 'bad';
  }

  if (!/[A-Z]/.test(password)) {
    return 'bad';
  }

  if (!/[0-9]/.test(password)) {
    return 'bad';
  }

  return 'good';
}