class SupportForm {
    constructor(formElement) {
        this.formElement = formElement;
        this.issueCategorySelect = document.getElementById('issue-category');
        this.priorityLevelSelect = document.getElementById('priority-level');
        this.captchaResponse = null;

        this.initEventListeners();
        this.initCaptcha();
    }

    initEventListeners() {
        this.issueCategorySelect.addEventListener('change', (e) => {
            this.populatePriorityLevels(e.target.value);
        });

        this.formElement.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });
    }

    initCaptcha() {
        grecaptcha.ready(() => {
            grecaptcha.execute('YOUR_SITE_KEY', { action: 'submit' }).then((token) => {
                this.captchaResponse = token;
            });
        });
    }

    populatePriorityLevels(issueCategory) {
        this.priorityLevelSelect.innerHTML = '';

        switch (issueCategory) {
            case 'technical':
                this.priorityLevelSelect.innerHTML = `
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                `;
                break;
            case 'billing':
                this.priorityLevelSelect.innerHTML = `
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                `;
                break;
            default:
                this.priorityLevelSelect.innerHTML = `
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                `;
                break;
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.formElement);
        formData.append('captchaResponse', this.captchaResponse);

        const validationErrors = this.validateForm(formData);

        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
                const errorSpan = document.getElementById(`${error.field}-error`);
                errorSpan.textContent = error.message;
            });
        } else {
            // Submit the form data to the server
            fetch('/submit-support-form', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-Token': 'YOUR_CSRF_TOKEN'
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                document.getElementById('success-message').style.display = 'block';
            })
            .catch((error) => {
                console.error(error);
                document.getElementById('error-message').style.display = 'block';
            });
        }
    }

    validateForm(formData) {
        const validationErrors = [];

        if (!formData.get('name')) {
            validationErrors.push({ field: 'name', message: 'Name is required' });
        }

        if (!formData.get('email') || !this.validateEmail(formData.get('email'))) {
            validationErrors.push({ field: 'email', message: 'Invalid email address' });
        }

        if (!formData.get('issue-category')) {
            validationErrors.push({ field: 'issue-category', message: 'Issue category is required' });
        }

        if (!formData.get('priority-level')) {
            validationErrors.push({ field: 'priority-level', message: 'Priority level is required' });
        }

        if (!formData.get('description')) {
            validationErrors.push({ field: 'description', message: 'Description is required' });
        }

        if (!formData.get('attachment')) {
            validationErrors.push({ field: 'attachment', message: 'Attachment is required' });
        }

        return validationErrors;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
}

const supportFormElement = document.getElementById('support-form');
const supportForm = new SupportForm(supportFormElement);