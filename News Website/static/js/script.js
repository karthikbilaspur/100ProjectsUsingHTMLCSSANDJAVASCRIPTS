document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const cards = document.querySelectorAll('.card');
    const footer = document.querySelector('.footer');

    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        navbar.classList.add('bg-dark');
        navbar.classList.remove('bg-light');
        cards.forEach(card => card.classList.add('bg-secondary', 'text-white'));
        footer.classList.add('bg-dark', 'text-white');
        localStorage.setItem('darkMode', 'enabled');
    };

    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        navbar.classList.add('bg-light');
        navbar.classList.remove('bg-dark');
        cards.forEach(card => card.classList.remove('bg-secondary', 'text-white'));
        footer.classList.remove('bg-dark', 'text-white');
        localStorage.setItem('darkMode', 'disabled');
    };

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Image Lazy Loading (browser native)
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.onload = () => {
            img.classList.add('loaded'); // Optional: Add a class when loaded
        };
    });

    // Infinite Scrolling (Basic Example - needs backend API endpoint for more pages)
    const articleList = document.querySelector('.article-list');
    let loading = false;
    let nextPageUrl = null; // You'd need to implement backend logic to provide the next page URL

    function loadMoreArticles() {
        if (loading || !nextPageUrl) {
            return;
        }
        loading = true;
        fetch(nextPageUrl)
            .then(response => response.json())
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    data.articles.forEach(article => {
                        const articleHTML = `
                            <div class="card mb-4">
                                <img src="${article.image || '/static/images/default.jpg'}" alt="${article.title}" class="card-img-top" loading="lazy">
                                <div class="card-body">
                                    <h5 class="card-title"><a href="/article/${article.slug}">${article.title}</a></h5>
                                    <p class="card-text">${article.description}</p>
                                    <p class="card-text"><small class="text-muted">Published on: ${new Date(article.published_at).toLocaleDateString()}</small></p>
                                    <a href="/article/${article.slug}" class="btn btn-primary btn-sm">Read More</a>
                                </div>
                            </div>
                        `;
                        articleList.insertAdjacentHTML('beforeend', articleHTML);
                    });
                    nextPageUrl = data.next_page; // Update for the next batch
                } else {
                    // Optionally display "No more articles" message
                }
            })
            .catch(error => console.error('Error loading more articles:', error))
            .finally(() => loading = false);
    }

    // Commenting out basic infinite scroll as backend pagination is implemented
    // window.addEventListener('scroll', () => {
    //     if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200) {
    //         // Trigger loadMoreArticles if nextPageUrl is available
    //         // In this enhanced version, backend pagination handles this via page links
    //     }
    // });

    // Real-time updates (Example - you'd need a backend event source like WebSockets for true real-time)
    // setInterval(() => {
    //     fetch('/api/news')
    //         .then(response => response.json())
    //         .then(data => {
    //             // Update DOM elements with new data
    //             console.log('News updated:', data);
    //         })
    //         .catch(error => console.error('Error fetching real-time news:', error));
    // }, 300000); // 5 minutes

    // CSRF Token Handling for AJAX requests
    function getCsrfToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.content : null;
    }

    // Example of an AJAX request with CSRF token
    async function submitBookmark(articleId, action) {
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            console.error('CSRF token not found.');
            return;
        }
        try {
            const response = await fetch(`/${action}/${articleId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
            });
            if (response.ok) {
                window.location.reload(); // Simple reload for bookmark updates
            } else {
                console.error(`Failed to ${action} bookmark.`);
            }
        } catch (error) {
            console.error(`Error ${action}ing bookmark:`, error);
        }
    }

    const bookmarkButtons = document.querySelectorAll('.btn-outline-secondary[form]');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const form = this.closest('form');
            const articleId = form.action.split('/').pop();
            const action = form.action.includes('unbookmark') ? 'unbookmark' : 'bookmark';
            submitBookmark(articleId, action);
        });
    });
});