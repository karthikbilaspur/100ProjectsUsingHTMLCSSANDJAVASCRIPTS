
// Form logic
const form = document.getElementById('contact-form');
const steps = document.querySelectorAll('.step');
const progressBarFill = document.getElementById('progress-bar-fill');
const captchaResponse = document.querySelector('.g-recaptcha-response');
const siteKey = 'YOUR_SITE_KEY'; // replace with your actual site key

if (siteKey !== 'YOUR_SITE_KEY') {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    document.head.appendChild(script);
  
    const captchaElement = document.querySelector('.g-recaptcha');
    captchaElement.dataset.sitekey = siteKey;
} else {
    const captchaElement = document.querySelector('.g-recaptcha');
    captchaElement.style.display = 'none'; // hide the reCAPTCHA widget if site key is invalid
}

const translations = {
    en: {
        invalidEmail: 'Invalid email address',
        pleaseFillOutAllFields: 'Please fill out all fields.',
        pleaseEnterMessage: 'Please enter a message.',
        invalidFileTypeOrSize: 'Invalid file type or size.',
        pleaseCompleteCaptcha: 'Please complete the CAPTCHA.',
    },
    es: {
        invalidEmail: 'Dirección de correo electrónico inválida',
        pleaseFillOutAllFields: 'Por favor, rellene todos los campos.',
        pleaseEnterMessage: 'Por favor, ingrese un mensaje.',
        invalidFileTypeOrSize: 'Tipo o tamaño de archivo inválido.',
        pleaseCompleteCaptcha: 'Por favor, complete el CAPTCHA.',
    },
    fr: {
        invalidEmail: 'Adresse e-mail invalide',
        pleaseFillOutAllFields: 'Veuillez remplir tous les champs.',
        pleaseEnterMessage: 'Veuillez entrer un message.',
        invalidFileTypeOrSize: 'Type ou taille de fichier invalide.',
        pleaseCompleteCaptcha: 'Veuillez compléter le CAPTCHA.',
    },
};

function getTranslation(language, key) {
    return translations[language][key];
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}


function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 1024 * 1024 * 5; // 5MB

    if (!allowedTypes.includes(file.type)) {
        return false;
    }

    if (file.size > maxSize) {
        return false;
    }

    return true;
}

function validateStep1() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const language = document.getElementById('language').value;

    if (name === '' || email === '' || subject === '') {
        alert(getTranslation(language, 'pleaseFillOutAllFields'));
        return false;
    }

        if (!validateEmail(email)) {
            document.getElementById('email-error').innerHTML = getTranslation(language, 'invalidEmail');
            return false;
        }
        return true; // Ensure the function returns true if validation passes
    }


function validateStep2() {
    const additionalField = document.getElementById('additional-field').value;
    const language = document.getElementById('language').value;

    if (additionalField === '') {
        document.getElementById('additional-field-error').innerHTML = getTranslation(language, 'pleaseFillOutAllFields');
        return false;
    }

    return true;
}

function validateStep3() {
    const message = document.getElementById('message').value;
    const file = document.getElementById('file-upload').files[0];
    const language = document.getElementById('language').value;

    if (message === '') {
        document.getElementById('message-error').innerHTML = getTranslation(language, 'pleaseEnterMessage');
        return false;
    }

    if (file && !validateFile(file)) {
        document.getElementById('file-error').innerHTML = getTranslation(language, 'invalidFileTypeOrSize');
        return false;
    }

    return true;
}

function validateCaptcha() {
    const language = document.getElementById('language').value;
    if (captchaResponse.value === '') {
        document.getElementById('captcha-error').innerHTML = getTranslation(language, 'pleaseCompleteCaptcha');
        return false;
    }
    return true;
}

// Step navigation
document.getElementById('next-step-1').addEventListener('click', () => {
    if (validateStep1()) {
        steps[0].style.display = 'none';
        steps[1].style.display = 'block';
        progressBarFill.style.width = '33.33%';
        addAdditionalFields();
    }
});

document.getElementById('prev-step-1').addEventListener('click', () => {
    steps[1].style.display = 'none';
    steps[0].style.display = 'block';
    progressBarFill.style.width = '0%';
});

document.getElementById('next-step-2').addEventListener('click', () => {
    if (validateStep2()) {
        steps[1].style.display = 'none';
        steps[2].style.display = 'block';
        progressBarFill.style.width = '66.66%';
    }
});

document.getElementById('prev-step-2').addEventListener('click', () => {
    steps[2].style.display = 'none';
    steps[1].style.display = 'block';
    progressBarFill.style.width = '33.33%';
});

// Form submission
document.getElementById('submit-form').addEventListener('click', (e) => {
    e.preventDefault();
    if (validateStep3() && validateCaptcha()) {
        const formData = new FormData(form);
        fetch('/submit-form', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                form.style.display = 'none';
                document.getElementById('thank-you-page').style.display = 'block';
            } else {
                console.error(data.error);
            }
        })
        .catch((error) => console.error(error));
    }
});

// Additional fields
function addAdditionalFields() {
    const additionalFields = document.getElementById('additional-fields');
    const fieldHtml = `
        <label for="additional-field">Additional Field:</label>
        <input type="text" id="additional-field" name="additional-field">
    `;
    additionalFields.innerHTML = fieldHtml;
}

// File upload preview
document.getElementById('file-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById('file-preview').innerHTML = `
            <img src="${reader.result}" alt="File Preview">
        `;
    };
    reader.readAsDataURL(file);
});