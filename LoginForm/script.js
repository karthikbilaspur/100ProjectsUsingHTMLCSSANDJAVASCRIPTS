const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const passwordToggle = document.getElementById('password-toggle');
const passwordStrength = document.getElementById('password-strength');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const successMessage = document.getElementById('success-message');
const errorGlobal = document.getElementById('error-message-global');
const captchaContainer = document.getElementById('captcha-container');
const rememberMeCheckbox = document.getElementById('remember-me');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const forgotPasswordEmail = document.getElementById('forgot-password-email');
const forgotPasswordSubmit = document.getElementById('forgot-password-submit');
const forgotPasswordCancel = document.getElementById('forgot-password-cancel');

// Generate CAPTCHA
function generateCaptcha() {
    const captcha = Math.floor(100000 + Math.random() * 900000);
    captchaContainer.innerText = `CAPTCHA: ${captcha}`;
    return captcha;
}

let captchaCode = generateCaptcha();

// Password strength meter
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = getPasswordStrength(password);
    passwordStrength.innerText = `Password strength: ${strength}`;
});

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+={};':"|,<>.?]/.test(password)) strength++;
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
}

// Password toggle
passwordToggle.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.querySelector('i').classList.remove('fa-eye');
        passwordToggle.querySelector('i').classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordToggle.querySelector('i').classList.remove('fa-eye-slash');
        passwordToggle.querySelector('i').classList.add('fa-eye');
    }
});

// Forgot password modal
forgotPasswordLink.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'block';
});

forgotPasswordCancel.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'none';
});

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const userCaptcha = prompt('Enter CAPTCHA:');

    if (userCaptcha !== captchaCode.toString()) {
        errorGlobal.innerText = 'Invalid CAPTCHA';
        return;
    }

    if (!validateUsername(username)) {
        usernameError.innerText = 'Invalid username or email';
    } else {
        usernameError.innerText = '';
    }

    if (!validatePassword(password)) {
        passwordError.innerText = 'Password should be at least 8 characters long';
    } else {
        passwordError.innerText = '';
    }

    if (validateUsername(username) && validatePassword(password)) {
        loadingOverlay.style.display = 'flex';
        // Simulate form submission
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            successMessage.style.display = 'block';
            if (rememberMeCheckbox.checked) {
                // Store username and password in local storage
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
            }
            // Handle form submission response
        }, 2000);
    }
});

// Reset form
resetBtn.addEventListener('click', () => {
    usernameInput.value = '';
    passwordInput.value = '';
    usernameError.innerText = '';
    passwordError.innerText = '';
    captchaCode = generateCaptcha();
});

function validateUsername(username) {
    return username.length > 0;
}

function validatePassword(password) {
    return password.length >= 8;
}