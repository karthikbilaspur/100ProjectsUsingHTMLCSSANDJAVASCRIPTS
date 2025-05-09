const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const csrf = require('csurf');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const csrfProtection = csrf({ cookie: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrfProtection);

app.post('/submit-support-form', upload.single('attachment'), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const issueCategory = req.body.issueCategory;
    const priorityLevel = req.body.priorityLevel;
    const description = req.body.description;
    const attachment = req.file;
    const captchaResponse = req.body.captchaResponse;

    // Verify the CAPTCHA response
    const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=YOUR_SECRET_KEY&response=${captchaResponse}`;
    fetch(captchaVerificationUrl)
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            // Save the form data to the database
            // ...

            res.json({ message: 'Form submitted successfully!' });
        } else {
            res.status(400).json({ message: 'Invalid CAPTCHA response' });
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Error submitting form' });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});