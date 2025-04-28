// Navigation Toggle

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Smooth Scrolling

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    targetElement.scrollIntoView({
      behavior: 'smooth',
    });
    // Close navigation menu on mobile devices
    if (window.innerWidth < 900) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});

// Form Validation

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (nameInput.value.trim() === '') {
    e.preventDefault();
    alert('Please enter your name');
  } else if (emailInput.value.trim() === '') {
    e.preventDefault();
    alert('Please enter your email');
  } else if (!validateEmail(emailInput.value.trim())) {
    e.preventDefault();
    alert('Please enter a valid email address');
  } else if (messageInput.value.trim() === '') {
    e.preventDefault();
    alert('Please enter a message');
  }
});

// Email Validation Function

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Scroll to Top Button

const scrollToTopButton = document.createElement('button');
scrollToTopButton.textContent = 'Scroll to top';
scrollToTopButton.classList.add('scroll-to-top');

document.body.appendChild(scrollToTopButton);

scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

// Lazy Loading

const images = document.querySelectorAll('img');

images.forEach((image) => {
  image.loading = 'lazy';
});