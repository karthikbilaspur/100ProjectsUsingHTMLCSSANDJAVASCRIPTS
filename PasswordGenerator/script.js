// Get elements
const passwordForm = document.getElementById('password-form');
const passwordLengthInput = document.getElementById('password-length');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const specialCheckbox = document.getElementById('special');
const specialCharactersInput = document.getElementById('special-characters');
const excludeSimilarCheckbox = document.getElementById('exclude-similar');
const generatePasswordButton = document.getElementById('generate-password');
const copyPasswordButton = document.getElementById('copy-password');
const generateMultipleButton = document.getElementById('generate-multiple');
const passwordCountInput = document.getElementById('password-count');
const passwordHistoryTextarea = document.getElementById('password-history');
const passwordOutput = document.getElementById('password-output');
const passwordStrengthProgress = document.getElementById('password-strength');
const passwordStrengthText = document.getElementById('password-strength-text');
const passwordEntropySpan = document.getElementById('password-entropy');

// Initialize password history
let passwordHistory = [];

// Add event listeners
passwordForm.addEventListener('submit', generatePassword);
copyPasswordButton.addEventListener('click', copyPassword);
generateMultipleButton.addEventListener('click', generateMultiplePasswords);
passwordLengthInput.addEventListener('input', validatePasswordLength);
passwordCountInput.addEventListener('input', validatePasswordCount);

// Generate password function
function generatePassword(e) {
    e.preventDefault();
    const passwordLength = parseInt(passwordLengthInput.value);
    const characterTypes = [];

    if (uppercaseCheckbox.checked) characterTypes.push('uppercase');
    if (lowercaseCheckbox.checked) characterTypes.push('lowercase');
    if (numbersCheckbox.checked) characterTypes.push('numbers');
    if (specialCheckbox.checked) characterTypes.push('special');

    if (characterTypes.length === 0) {
        showError('Please select at least one character type.');
        return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const characterType = characterTypes[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * characterTypes.length)];
        switch (characterType) {
            case 'uppercase':
                password += getRandomUppercaseLetter(excludeSimilarCheckbox.checked);
                break;
            case 'lowercase':
                password += getRandomLowercaseLetter(excludeSimilarCheckbox.checked);
                break;
            case 'numbers':
                password += getRandomNumber(excludeSimilarCheckbox.checked);
                break;
            case 'special':
                password += getRandomSpecialCharacter(specialCharactersInput.value);
                break;
        }
    }

    passwordOutput.textContent = password;
    updatePasswordStrength(password);
    updatePasswordEntropy(password);
    passwordHistory.push(password);
    updatePasswordHistory();
}

// Copy password function
function copyPassword() {
    const password = passwordOutput.textContent;
    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    });
}

// Generate multiple passwords function
function generateMultiplePasswords() {
    const passwordCount = parseInt(passwordCountInput.value);
    for (let i = 0; i < passwordCount; i++) {
        generatePassword(new Event('submit'));
    }
}

// Validate password length function
function validatePasswordLength() {
    const passwordLength = parseInt(passwordLengthInput.value);
    if (isNaN(passwordLength) || passwordLength < 8 || passwordLength > 128) {
        showError('Password length must be between 8 and 128 characters.', 'password-length-error');
        return false;
    } else {
        hideError('password-length-error');
        return true;
    }
}

// Validate password count function
function validatePasswordCount() {
    const passwordCount = parseInt(passwordCountInput.value);
    if (isNaN(passwordCount) || passwordCount < 1 || passwordCount > 10) {
        showError('Password count must be between 1 and 10.', 'password-count-error');
        return false;
    } else {
        hideError('password-count-error');
        return true;
    }
}

// Show error function
function showError(message, errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        alert(message);
    }
}

// Hide error function
function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Get random uppercase letter function
function getRandomUppercaseLetter(excludeSimilar) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (excludeSimilar) {
        return letters[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * letters.replace('I', '').replace('O', '').length)];
    } else {
        return letters[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * letters.length)];
    }
}

// Get random lowercase letter function
function getRandomLowercaseLetter(excludeSimilar) {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    if (excludeSimilar) {
        return letters[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * letters.replace('l', '').replace('o', '').length)];
    } else {
        return letters[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * letters.length)];
    }
}

// Get random number function
function getRandomNumber(excludeSimilar) {
    const numbers = '0123456789';
    if (excludeSimilar) {
        return numbers[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * numbers.replace('1', '').replace('0', '').length)];
    } else {
        return numbers[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * numbers.length)];
    }
}

// Get random special character function
function getRandomSpecialCharacter(specialCharacters) {
    return specialCharacters[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32 - 1) * specialCharacters.length)];
}

// Update password strength function
function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    passwordStrengthProgress.value = strength;
    if (strength < 30) {
        passwordStrengthText.textContent = 'Weak';
        passwordStrengthText.style.color = 'red';
    } else if (strength < 60) {
        passwordStrengthText.textContent = 'Medium';
        passwordStrengthText.style.color = 'orange';
    } else {
        passwordStrengthText.textContent = 'Strong';
        passwordStrengthText.style.color = 'green';
    }
}

// Calculate password strength function
function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    if (/([A-Z])\1{2,}/.test(password) || /([a-z])\1{2,}/.test(password) || /([0-9])\1{2,}/.test(password)) strength -= 20;
    return Math.max(0, Math.min(strength, 100));
}

// Update password entropy function
function updatePasswordEntropy(password) {
    const entropy = calculatePasswordEntropy(password);
    passwordEntropySpan.textContent = `Entropy: ${entropy} bits`;
}

// Calculate password entropy function
function calculatePasswordEntropy(password) {
    const characterSet = getCharacterSet(password);
    const entropy = password.length * Math.log2(characterSet.length);
    return Math.round(entropy * 100) / 100;
}

// Get character set function
function getCharacterSet(password) {
    let characterSet = '';
    if (/[A-Z]/.test(password)) characterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (/[a-z]/.test(password)) characterSet += 'abcdefghijklmnopqrstuvwxyz';
    if (/[0-9]/.test(password)) characterSet += '0123456789';
    if (/[^A-Za-z0-9]/.test(password)) characterSet += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    return characterSet;
}

// Update password history function
function updatePasswordHistory() {
    passwordHistoryTextarea.value = passwordHistory.join('\n');
}