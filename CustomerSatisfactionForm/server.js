
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit', upload.array('files[]'), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const feedback = req.body.feedback;
    const files = req.files;

    console.log(name, email, phone, feedback, files);

    res.json({ message: 'Feedback submitted successfully!' });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});