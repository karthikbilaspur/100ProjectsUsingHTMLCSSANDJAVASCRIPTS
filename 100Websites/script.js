// Get elements
const searchInput = document.getElementById('search-input');
const websitesGrid = document.getElementById('websites-grid');
const categoryFilter = document.getElementById('category-filter');
const sortOptions = document.getElementById('sort-options');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const projectModal = document.getElementById('project-modal');

// Define projects data
const projects = [
    { title: 'Vertical Navigation', link: 'https://codepen.io/kaibilaspur/pen/ZYYyKGm', description: 'Vertical navigation menus are a common design pattern for websites, providing a clear and organized way to navigate through different sections.' },
    { title: 'Mood Calendar', link: 'https://codepen.io/kaibilaspur/pen/emmGeZa', description: 'A mood calendar is a simple yet effective way to track your emotions over time. It can help you identify patterns and triggers in your mood, leading to better self-awareness and emotional regulation.' },
    { title: 'Job Application Form', link: 'https://codepen.io/kaibilaspur/pen/oggJJMG', description: 'A job application form is a crucial part of the hiring process. It allows employers to gather essential information about candidates and assess their qualifications for a position.' },
    { title: 'Karthik Agency Website', link: 'https://codepen.io/kaibilaspur/pen/GggPrwv', description: 'A website for Karthik Agency, showcasing their services and portfolio. It features a clean design and easy navigation for users to explore the agency\'s offerings.' },
    { title: 'Multi Language Speed Typing Game', link: 'https://codepen.io/kaibilaspur/pen/LEEXNYg', description: 'A multi-language speed typing game that challenges users to type words quickly and accurately in different languages. It helps improve typing skills and language proficiency.' },
    { title: 'Contact Form', link: 'https://codepen.io/kaibilaspur/pen/azzRZLN', description: 'A contact form is an essential part of any website, allowing users to get in touch with the site owner or support team. It typically includes fields for name, email, subject, and message.' },
    { title: 'Vote For Best Project', link: 'https://codepen.io/kaibilaspur/pen/emmPOzK', description: 'A voting system for users to select their favorite project from a list. It can be used for competitions, surveys, or feedback collection.' },
    { title: 'Password Generator', link: 'https://codepen.io/kaibilaspur/pen/PwwBZRz', description: 'A password generator is a tool that creates strong, random passwords for users. It helps enhance security by encouraging the use of complex passwords that are difficult to guess.' },
    { title: 'Pokedox', link: 'https://codepen.io/kaibilaspur/pen/raaKMYq', description: 'Pokedox is a fun and interactive website that allows users to explore the world of Pokémon. It features a database of Pokémon, their types, abilities, and stats.' },
    { title: 'Login Form', link: 'https://codepen.io/kaibilaspur/pen/MYYGyLe', description: 'A login form is a common feature on websites, allowing users to securely access their accounts. It typically includes fields for username/email and password, along with a "Remember Me" option.' },
    { title: 'Catch The Insect', link: 'https://codepen.io/kaibilaspur/pen/RNNMMBN', description: 'A fun and interactive game where users try to catch insects on the screen. It can be used for entertainment or educational purposes, teaching users about different insect species.' },
    { title: 'Check Out Form', link: 'https://codepen.io/kaibilaspur/pen/bNNLyrX', description: 'A checkout form is an essential part of e-commerce websites, allowing users to complete their purchases. It typically includes fields for shipping information, payment details, and order summary.' },
    { title: 'Pop Up Registration Form', link: 'https://codepen.io/kaibilaspur/pen/PwwQgvB', description: 'A pop-up registration form is a convenient way for users to sign up for newsletters, accounts, or events without leaving the current page. It typically includes fields for name, email, and password.' },
    { title: 'Advance Meal Generator', link: 'https://codepen.io/kaibilaspur/pen/xbbPgeO', description: 'An advanced meal generator is a tool that helps users plan their meals based on dietary preferences, restrictions, and nutritional goals. It can suggest recipes, portion sizes, and shopping lists.' },
    { title: 'Responsive Navigation Menu', link: 'https://codepen.io/kaibilaspur/pen/raaGpNL', description: 'A responsive navigation menu is a design pattern that adapts to different screen sizes, ensuring a seamless user experience on mobile and desktop devices. It typically includes a hamburger icon for mobile views.' },
];

// Function to generate project cards
function generateProjectCards(projects) {
    let html = '';
    projects.forEach((project) => {
        html += `
            <div class="col-md-4 mb-4">
                <div class="website-card h-100">
                    <h2>${project.title}</h2>
                    <a href="${project.link}" target="_blank" rel="noopener" title="View ${project.title} Project">View Project</a>
                    <p>${project.description}</p>
                    <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#project-modal" onclick="showProjectDetails(${project.id})">View Details</button>
                </div>
            </div>
        `;
    });
    websitesGrid.innerHTML = html;
}

// Function to show project details
function showProjectDetails(projectId) {
    const project = projects.find((project) => project.id === projectId);
    const modalBody = projectModal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank" rel="noopener" title="View ${project.title} Project">View Project</a>
    `;
}

// Generate project cards initially
generateProjectCards(projects);

// Add event listeners
searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchQuery));
    generateProjectCards(filteredProjects);
});

categoryFilter.addEventListener('change', () => {
    const category = categoryFilter.value;
    const filteredProjects = projects.filter((project) => project.category === category);
    generateProjectCards(filteredProjects);
});

sortOptions.addEventListener('change', () => {
    const sortOption = sortOptions.value;
    const sortedProjects = projects.sort((a, b) => {
        if (sortOption === 'title') {
            return a.title.localeCompare(b.title);
        } else if (sortOption === 'date') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortOption === 'popularity') {
            return b.popularity - a.popularity;
        }
    });
    generateProjectCards(sortedProjects);
});

let currentPage = 1;
const projectsPerPage = 6;
const totalPages = Math.ceil(projects.length / projectsPerPage);

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        paginateProjects();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        paginateProjects();
    }
});

function paginateProjects() {
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const paginatedProjects = projects.slice(start, end);
    generateProjectCards(paginatedProjects);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}