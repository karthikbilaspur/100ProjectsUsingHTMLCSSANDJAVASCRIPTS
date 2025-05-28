const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const paypal = require('paypal-rest-sdk');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/greenfunder', { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  twoFactorAuth: Boolean
});

// Project model
const Project = mongoose.model('Project', {
  title: String,
  description: String,
  goal: Number,
  raised: Number,
  category: String,
  updates: [{ type: String }]
});

// Donation model
const Donation = mongoose.model('Donation', {
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  recurring: Boolean
});

// Payment gateway integration (PayPal)
paypal.configure({
  'mode': 'sandbox',
  'client_id': 'YOUR_CLIENT_ID',
  'client_secret': 'YOUR_CLIENT_SECRET'
});

// Create project
app.post('/projects', authenticate, async (req, res) => {
  const project = new Project({ 
    title: req.body.title, 
    description: req.body.description, 
    goal: req.body.goal, 
    category: req.body.category 
  });
  await project.save();
  res.send('Project created successfully');
});

// Donate to project
app.post('/donate/:projectId', authenticate, async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).send('Project not found');
  const donation = new Donation({ 
    projectId: project._id, 
    userId: req.user.userId, 
    amount: req.body.amount, 
    recurring: req.body.recurring 
  });
  await donation.save();
  project.raised += req.body.amount;
  await project.save();

  // Process payment using PayPal
  const payment = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "transactions": [{
      "amount": {
        "total": req.body.amount,
        "currency": "USD"
      }
    }]
  };
  paypal.payment.create(payment, (error, payment) => {
    if (error) {
      res.status(500).send('Payment failed');
    } else {
      res.send('Donation successful');
    }
  });
});

// Authenticate middleware
function authenticate(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied');
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
}

app.listen(3000, () => console.log('Server listening on port 3000'));