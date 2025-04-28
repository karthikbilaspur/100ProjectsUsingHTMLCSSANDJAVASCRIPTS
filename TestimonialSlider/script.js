const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.custom-next',
        prevEl: '.custom-prev',
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    keyboard: {
        enabled: true,
        onlyInViewport: true,
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true,
    },
    speed: 1000,
    spaceBetween: 30,
    slidesPerView: 1,
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
    // Add custom animation effects
    on: {
        init: function () {
            const slides = this.slides;
            slides.forEach((slide) => {
                slide.style.opacity = 0;
            });
            this.slides[this.activeIndex].style.opacity = 1;
        },
        slideChange: function () {
            const slides = this.slides;
            slides.forEach((slide) => {
                slide.style.opacity = 0;
            });
            this.slides[this.activeIndex].style.opacity = 1;
        },
    },
});

// Allow users to customize autoplay settings
const autoplayDelayInput = document.getElementById('autoplay-delay');
const autoplayEnabledCheckbox = document.getElementById('autoplay-enabled');

autoplayDelayInput.addEventListener('input', (e) => {
    swiper.params.autoplay.delay = parseInt(e.target.value);
    swiper.autoplay.start();
});

autoplayEnabledCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        swiper.params.autoplay.enabled = true;
        swiper.autoplay.start();
    } else {
        swiper.params.autoplay.enabled = false;
        swiper.autoplay.stop();
    }
});

// Improve keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        swiper.slidePrev();
    } else if (e.key === 'ArrowRight') {
        swiper.slideNext();
    }
});

// Implement lazy loading
const lazyLoad = () => {
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((testimonial) => {
        const image = testimonial.querySelector('img');
        if (image) {
            image.loading = 'lazy';
            image.addEventListener('load', () => {
                image.style.opacity = 1;
            });
        }
    });
};
lazyLoad();

// Implement accessibility features
const accessibilityFeatures = () => {
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((testimonial) => {
        testimonial.setAttribute('role', 'region');
        testimonial.setAttribute('aria-label', 'Testimonial');
        testimonial.tabIndex = 0;
    });
};
accessibilityFeatures();

// Implement SEO optimization
const seoOptimization = () => {
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((testimonial) => {
        const text = testimonial.querySelector('p').textContent;
        testimonial.setAttribute('data-seo-text', text);
        const metaTag = document.createElement('meta');
        metaTag.name = 'description';
        metaTag.content = text;
        testimonial.appendChild(metaTag);
    });
};
seoOptimization();

// Implement caching
const caching = () => {
    const cacheName = 'testimonial-cache';
    const cacheFiles = [
        '/',
        '/testimonials',
    ];
    caches.open(cacheName).then((cache) => {
        cache.addAll(cacheFiles);
    });
};
caching();

// Implement social media integration
const socialMediaIntegration = () => {
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const testimonial = button.closest('.testimonial-card');
            const text = testimonial.querySelector('p').textContent;
            const url = window.location.href;
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
            window.open(shareUrl, '_blank');
        });
    });
};
socialMediaIntegration();

// Implement email marketing integration
const emailMarketingIntegration = () => {
    const emailButtons = document.querySelectorAll('.email-button');
    emailButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const testimonial = button.closest('.testimonial-card');
            const text = testimonial.querySelector('p').textContent;
            const subject = 'Testimonial from our website';
            
            const body = `Check out this testimonial: ${text}`;
            const mailto = `mailto:?subject=${subject}&body=${body}`;
            window.location.href = mailto;
        });
    });
};
emailMarketingIntegration();

// Implement CRM integration
const crmIntegration = () => {
    const testimonialForms = document.querySelectorAll('.testimonial-form');
    testimonialForms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('input[name="name"]').value;
            const email = form.querySelector('input[name="email"]').value;
            const testimonial = form.querySelector('textarea[name="testimonial"]').value;
            // Send data to CRM system
            fetch('/crm-api/submit-testimonial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    testimonial,
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));
        });
    });
};
crmIntegration();