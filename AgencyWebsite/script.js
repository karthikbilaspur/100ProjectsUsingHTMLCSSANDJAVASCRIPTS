document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Nav Bar Scroll Effect & Hamburger Menu Toggle ---
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.createElement('div'); // Create a div for the hamburger icon
    navToggle.classList.add('nav-toggle');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Font Awesome hamburger icon
    mainNav.prepend(navToggle); // Add it to the beginning of the nav

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Toggle 'active' class on nav-links
        navToggle.querySelector('i').classList.toggle('fa-bars');
        navToggle.querySelector('i').classList.toggle('fa-times'); // Change icon to 'X'
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- 2. Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const offset = mainNav.offsetHeight;

            if (targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Intersection Observer for Animate-on-Scroll Effects ---
    const sections = document.querySelectorAll('.section, .hero-content, .feature-box, .portfolio-item, .case-study-card, .team-member');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // Add a class for animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 4. Testimonial Carousel (Enhanced with auto-play) ---
    const testimonials = [
        {
            quote: "Our experience with this team was exceptional. They transformed our vision into a stunning reality, exceeding all our expectations. Truly professional and highly skilled!",
            author: "- Sarah Chen, CEO of InnovateCorp"
        },
        {
            quote: "Working with them was a breeze! They understood our needs perfectly and delivered a product that not only looks great but also performs flawlessly. Highly recommend!",
            author: "- Michael Rodriguez, Founder of GlobalConnect"
        },
        {
            quote: "The attention to detail and creative solutions provided were outstanding. Our project was complex, but they handled it with expertise and delivered beyond what we imagined.",
            author: "- Jessica Lee, Marketing Director at FutureSolutions"
        },
        {
            quote: "Absolutely thrilled with the results! The team's communication and dedication were top-notch. Our new website is a game-changer for our business.",
            author: "- Alex P., Director at InnovateLabs"
        }
    ];

    let currentTestimonialIndex = 0;
    const quoteText = document.getElementById('quoteText');
    const authorName = document.getElementById('authorName');
    const prevTestimonialBtn = document.getElementById('prevTestimonial');
    const nextTestimonialBtn = document.getElementById('nextTestimonial');
    const carouselDotsContainer = document.getElementById('carouselDots'); // Renamed for clarity
    let carouselInterval; // To hold the interval ID

    function updateTestimonial() {
        // Add a class for fade-out animation before changing content
        quoteText.classList.add('fade-out');
        authorName.classList.add('fade-out');

        setTimeout(() => {
            quoteText.textContent = testimonials[currentTestimonialIndex].quote;
            authorName.textContent = testimonials[currentTestimonialIndex].author;

            // Remove fade-out and add fade-in
            quoteText.classList.remove('fade-out');
            authorName.classList.remove('fade-out');
            quoteText.classList.add('fade-in-text'); // Use a specific class for text fade-in
            authorName.classList.add('fade-in-text');

            // Remove fade-in-text after animation to allow repeated animations
            setTimeout(() => {
                quoteText.classList.remove('fade-in-text');
                authorName.classList.remove('fade-in-text');
            }, 500); // Match animation duration
        }, 300); // Match fade-out duration

        updateDots();
    }

    function createDots() {
        carouselDotsContainer.innerHTML = ''; // Clear existing dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            carouselDotsContainer.appendChild(dot);
        });
        updateDots(); // Set initial active dot
    }

    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            if (index === currentTestimonialIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startCarousel() {
        carouselInterval = setInterval(() => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateTestimonial();
        }, 5000); // Change testimonial every 5 seconds
    }

    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        startCarousel();
    }

    prevTestimonialBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
        updateTestimonial();
        resetCarouselInterval(); // Reset timer on manual interaction
    });

    nextTestimonialBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial();
        resetCarouselInterval(); // Reset timer on manual interaction
    });

    carouselDotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            currentTestimonialIndex = parseInt(e.target.dataset.index);
            updateTestimonial();
            resetCarouselInterval(); // Reset timer on manual interaction
        }
    });

    // Initial setup for testimonials
    if (quoteText && authorName && prevTestimonialBtn && nextTestimonialBtn && carouselDotsContainer) {
        createDots();
        updateTestimonial(); // Show the first testimonial immediately
        startCarousel(); // Start auto-play
    }

    // --- 5. Back to Top Button ---
    const backToTopBtn = document.createElement('button');
    backToTopBtn.classList.add('back-to-top');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 6. Form Validation ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default submission initially

            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Simple validation example
            if (nameInput.value.trim() === '') {
                displayError(nameInput, 'Name cannot be empty.');
                isValid = false;
            } else {
                removeError(nameInput);
            }

            if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
                displayError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            if (subjectInput.value.trim() === '') {
                displayError(subjectInput, 'Subject cannot be empty.');
                isValid = false;
            } else {
                removeError(subjectInput);
            }

            if (messageInput.value.trim() === '') {
                displayError(messageInput, 'Message cannot be empty.');
                isValid = false;
            } else {
                removeError(messageInput);
            }

            if (isValid) {
                // If all good, you'd typically send data to a server here (e.g., using fetch API)
                alert('Thank you for your message! We will get back to you soon.');
                this.reset(); // Clear the form
            }
        });
    }

    function displayError(inputElement, message) {
        let errorElement = inputElement.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        errorElement.textContent = message;
        inputElement.classList.add('input-error');
    }

    function removeError(inputElement) {
        const errorElement = inputElement.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        inputElement.classList.remove('input-error');
    }

    function isValidEmail(email) {
        // Basic email regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

});