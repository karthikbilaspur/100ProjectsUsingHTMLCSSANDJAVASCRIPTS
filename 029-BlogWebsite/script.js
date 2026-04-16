// ===== STATE & INIT =====
let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply saved preferences on load
document.addEventListener('DOMContentLoaded', () => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    updateFontSize();
    generateBlogPosts(blogPostsData);
    initEventListeners();
});

// ===== BLOG POSTS =====
const blogPostsContainer = document.getElementById('blog-posts');

function generateBlogPosts(blogPostsData) {
    blogPostsData.forEach((blogPost) => {
        const blogPostHTML = `
            <li class="blog-post" style="font-size: ${currentFontSize}px">
                <h2>${blogPost.title}</h2>
                <p class="meta">By ${blogPost.author} on ${formatDate(blogPost.date)}</p>
                <p>${blogPost.content}</p>
            </li>
        `;
        blogPostsContainer.insertAdjacentHTML('beforeend', blogPostHTML);
    });
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
}

const blogPostsData = [
    {
        title: 'My First Blog Post',
        content: 'This is my first blog post. I\'m excited to share my thoughts and ideas with you.',
        author: 'Karthik',
        date: '2025-02-20'
    },
    {
        title: 'How I Built This Blog with Vanilla JS',
        content: 'No frameworks needed. Here\'s how I used ES6+, CSS Grid, and the Fetch API to build a fast, lightweight blog.',
        author: 'Karthik',
        date: '2025-02-25'
    },
    {
        title: 'Dark Mode: More Than Just Colors',
        content: 'Implementing dark mode taught me about CSS variables, localStorage, and user preference media queries.',
        author: 'Karthik',
        date: '2025-03-01'
    }
];

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Hamburger menu
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('nav-menu').classList.toggle('active');
    });

    // Load more posts
    document.getElementById('load-more-btn').addEventListener('click', () => {
        const moreBlogPostsData = [
            {
                title: 'Understanding the Web Share API',
                content: 'Native sharing is here. Let me show you how to let users share your content to any app with one line of code.',
                author: 'Karthik',
                date: '2025-03-05'
            },
            {
                title: 'Why I Still Love Vanilla JavaScript',
                content: 'Frameworks are great, but knowing the fundamentals makes you a better developer. Here\'s why I start every project vanilla.',
                author: 'Karthik',
                date: '2025-03-10'
            }
        ];
        generateBlogPosts(moreBlogPostsData);
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchQuery = e.target.value.toLowerCase();
        document.querySelectorAll('.blog-post').forEach((blogPost) => {
            const title = blogPost.querySelector('h2').textContent.toLowerCase();
            const content = blogPost.querySelector('p:last-child').textContent.toLowerCase();
            blogPost.style.display = title.includes(searchQuery) || content.includes(searchQuery) ? 'block' : 'none';
        });
    });

    // Newsletter signup
    document.getElementById('newsletter-signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-signup-email').value;
        await subscribeToNewsletter(email);
        e.target.reset();
    });

    // Contact form
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        await submitForm(formData);
        e.target.reset();
    });

    // Dark mode toggle
    document.getElementById('dark-mode-toggle-btn').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        document.querySelector('#dark-mode-toggle-btn i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    });

    // Font size controls
    document.getElementById('font-size-increase-btn').addEventListener('click', () => {
        if (currentFontSize < 22) {
            currentFontSize += 2;
            updateFontSize();
        }
    });

    document.getElementById('font-size-decrease-btn').addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            updateFontSize();
        }
    });

    // Get started button scroll
    document.getElementById('get-started-btn').addEventListener('click', () => {
        document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
    });

    // Push notifications
    document.getElementById('push-notification-btn').addEventListener('click', () => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Thanks for enabling notifications!', {
                    body: 'You\'ll get updates when I post new articles.',
                    icon: 'favicon.ico'
                });
            }
        });
    });
}

function updateFontSize() {
    document.querySelectorAll('.blog-post').forEach(post => {
        post.style.fontSize = `${currentFontSize}px`;
    });
    localStorage.setItem('fontSize', currentFontSize);
}

// ===== API FUNCTIONS =====
async function subscribeToNewsletter(email) {
    try {
        const response = await fetch('https://example.com/newsletter-api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        alert(response.ok ? 'Thank you for subscribing!' : 'Failed to subscribe. Please try again.');
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

async function submitForm(formData) {
    try {
        const response = await fetch('https://example.com/form-submission-api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        alert(response.ok ? 'Thank you for contacting us!' : 'Failed to submit. Please try again.');
    } catch (error) {
        alert('Network error. Please try again.');
    }
}