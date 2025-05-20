// Data for websites
const websites = []; // Add your website data here

// Function to create website cards
function createWebsiteCard(website) {
    const card = document.createElement('div');
    card.classList.add('website-card');

    const title = document.createElement('h2');
    title.textContent = website.title;

    const link = document.createElement('a');
    link.href = website.url;
    link.textContent = website.url;
    link.target = '_blank';

    const description = document.createElement('p');
    description.textContent = website.description;

    card.appendChild(title);
    card.appendChild(link);
    card.appendChild(description);

    return card;
}

// Function to render websites grid
function renderWebsitesGrid(websitesToRender) {
    const grid = document.getElementById('websites-grid');
    grid.innerHTML = ''; // Clear the grid

    websitesToRender.forEach((website) => {
        const card = createWebsiteCard(website);
        grid.appendChild(card);
    });
}

// Function to filter websites by search query
function filterWebsites(query) {
    const filteredWebsites = websites.filter((website) => {
        return website.title.toLowerCase().includes(query.toLowerCase()) || website.description.toLowerCase().includes(query.toLowerCase());
    });

    renderWebsitesGrid(filteredWebsites);
}

// Render websites grid on page load
document.addEventListener('DOMContentLoaded', () => {
    renderWebsitesGrid(websites);

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        filterWebsites(e.target.value);
    });
});