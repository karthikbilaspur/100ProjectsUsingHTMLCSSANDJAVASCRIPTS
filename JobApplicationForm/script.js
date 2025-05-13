// Multi-step form logic
const steps = document.querySelectorAll('section');
let currentStep = 0;

// Dynamic fields for work experience and skills
const workExperienceContainer = document.getElementById('work-experience-container');
const skillsContainer = document.getElementById('skills-container');
let workExperienceCount = 0;
let skillCount = 0;

// Password strength meter
const passwordInput = document.getElementById('password');
const passwordStrengthMeter = document.getElementById('password-strength-meter');

// Payment gateway integration
const paymentMethodSelect = document.getElementById('payment-method');
const paymentFormContainer = document.getElementById('payment-form-container');

// Initialize form
initForm();

// Function to initialize form
function initForm() {
  // Add event listeners
  document.getElementById('next-step1').addEventListener('click', nextStep);
  document.getElementById('next-step2').addEventListener('click', nextStep);
  document.getElementById('next-step3').addEventListener('click', nextStep);
  document.getElementById('prev-step2').addEventListener('click', prevStep);
  document.getElementById('prev-step3').addEventListener('click', prevStep);
  document.getElementById('prev-step4').addEventListener('click', prevStep);
  document.getElementById('add-work-experience').addEventListener('click', addWorkExperience);
  document.getElementById('add-skill').addEventListener('click', addSkill);
  paymentMethodSelect.addEventListener('change', renderPaymentForm);
  document.getElementById('submit-form').addEventListener('click', submitForm);

  // Initialize password strength meter
  passwordInput.addEventListener('input', checkPasswordStrength);

  // Render payment form
  renderPaymentForm();
}

// Function to add work experience
function addWorkExperience() {
  workExperienceCount++;
  const workExperienceHtml = `
    <div>
      <label for="work-experience-${workExperienceCount}">Work Experience ${workExperienceCount}:</label>
      <input type="text" id="work-experience-${workExperienceCount}" name="work-experience-${workExperienceCount}">
    </div>
  `;
  workExperienceContainer.insertAdjacentHTML('beforeend', workExperienceHtml);
}

// Function to add skill
function addSkill() {
  skillCount++;
  const skillHtml = `
    <div>
      <label for="skill-${skillCount}">Skill ${skillCount}:</label>
      <input type="text" id="skill-${skillCount}" name="skill-${skillCount}">
    </div>
  `;
  skillsContainer.insertAdjacentHTML('beforeend', skillHtml);
}


// Function to check password strength
function checkPasswordStrength() {
  const password = passwordInput.value;
  const strength = getPasswordStrength(password);
  const errors = getPasswordStrengthErrors(password);

  passwordStrengthMeter.innerHTML = `
    <p>Password strength: ${strength}</p>
    ${errors.length > 0 ? '<ul>' + errors.map(error => `<li>${error}</li>`).join('') + '</ul>' : ''}
  `;
}

// Function to get password strength errors
function getPasswordStrengthErrors(password) {
  let errors = [];

  // Check password length
  if (password.length < 8) {
    errors.push('Password should be at least 8 characters long');
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password should contain at least one uppercase letter');
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password should contain at least one lowercase letter');
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push('Password should contain at least one number');
  }

  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password should contain at least one special character');
  }

  return errors;
}


// Function to render payment form
function renderPaymentForm() {
  const paymentMethod = paymentMethodSelect.value;
  if (paymentMethod === 'stripe') {
    // Render Stripe payment form
    const stripePaymentForm = `
      <label for="stripe-card-number">Card Number:</label>
      <input type="text" id="stripe-card-number" name="stripe-card-number">
      <label for="stripe-exp-month">Expiration Month:</label>
      <input type="text" id="stripe-exp-month" name="stripe-exp-month">
      <label for="stripe-exp-year">Expiration Year:</label>
      <input type="text" id="stripe-exp-year" name="stripe-exp-year">
      <label for="stripe-cvc">CVC:</label>
      <input type="text" id="stripe-cvc" name="stripe-cvc">
    `;
    paymentFormContainer.innerHTML = stripePaymentForm;
  } else if (paymentMethod === 'paypal') {
    // Render PayPal payment form
    const paypalPaymentForm = `
      <label for="paypal-email">Email:</label>
      <input type="email" id="paypal-email" name="paypal-email">
      <label for="paypal-password">Password:</label>
      <input type="password" id="paypal-password" name="paypal-password">
    `;
    paymentFormContainer.innerHTML = paypalPaymentForm;
  }
}

// Function to submit form
function submitForm(event) {
  event.preventDefault();

  // Get form data
  const formData = new FormData(document.getElementById('job-application-form'));

  // Validate form data
  if (validateFormData(formData)) {
    // Send form data to server
    fetch('/submit-job-application', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Display success message
          alert('Job application submitted successfully!');
          // Reset form
          document.getElementById('job-application-form').reset();
          // Hide all steps except the first one
          steps.forEach((step, index) => {
            if (index === 0) {
              step.style.display = 'block';
            } else {
              step.style.display = 'none';
            }
          });
          currentStep = 0;
        } else {
          // Display error message
          alert('Error submitting job application. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error submitting job application. Please try again.');
      });
  } else {
    // Display validation errors
    alert('Please fill out all required fields correctly.');
  }
}

// Function to validate form data
function validateFormData(formData) {
  // Check for required fields
  const requiredFields = ['name', 'email', 'location', 'job-title', 'password'];
  for (const field of requiredFields) {
    if (!formData.get(field)) {
      return false;
    }
  }

  // Check for valid email
  const email = formData.get('email');
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return false;
  }

  // Check for valid password
  const password = formData.get('password');
  if (password.length < 8) {
    return false;
  }

  return true;
}

// Function to go to next step
function nextStep() {
  steps[currentStep].style.display = 'none';
  currentStep++;
  steps[currentStep].style.display = 'block';
}

// Function to go to previous step
function prevStep() {
  steps[currentStep].style.display = 'none';
  currentStep--;
  steps[currentStep].style.display = 'block';
}