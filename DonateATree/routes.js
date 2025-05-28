const express = require('express');
const router = express.Router();

// Project details page
router.get('/projects/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send('Project not found');
  res.render('project-details', { project });
});

// User profile page
router.get('/users/:id', authenticate, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.render('user-profile', { user });
});

// Donation history page
router.get('/donations/history', authenticate, async (req, res) => {
  const donations = await Donation.find({ userId: req.user.userId });
  res.render('donation-history', { donations });
});

// Project creation page
router.get('/projects/create', authenticate, (req, res) => {
  res.render('project-create');
});

// About us page
router.get('/about', (req, res) => {
  res.render('about');
});

// Contact us page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// FAQ page
router.get('/faq', (req, res) => {
  res.render('faq');
});

module.exports = router;