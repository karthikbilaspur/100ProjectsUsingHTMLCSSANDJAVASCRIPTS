
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/gym', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: Date,
    time: String
});

const subscriptionSchema = new mongoose.Schema({
    email: String
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Register user
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.send({ success: true, message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Registration failed' });
    }
});

// Login user
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.send({ success: true, token });
    } catch (err) {
        res.status(500).send({ message: 'Login failed' });
    }
});

// Book a class
app.post('/book', async (req, res) => {
    try {
        const booking = new Booking({
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            time: req.body.time
        });
        await booking.save();
        res.send({ success: true, message: 'Class booked successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Booking failed' });
    }
});

// Subscribe to newsletter
app.post('/subscribe', async (req, res) => {
    try {
        const subscription = new Subscription({
            email: req.body.email
        });
        await subscription.save();
        res.send({ success: true, message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Subscription failed' });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});