// script.js

// API Endpoints
const apiUrl = "https://jsonplaceholder.typicode.com";
const usersEndpoint = "/users";
const postsEndpoint = "/posts"; // Using posts as products for demonstration

// Initialize users and products variables
let users = [];
let products = [];
let userChartInstance = null; // To store the Chart.js instance

// Helper function to show Toastr notifications
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

// Fetch users data from API
async function fetchUsers() {
    try {
        const response = await fetch(`${apiUrl}${usersEndpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Limit to 10 users for cleaner chart and table display
        return data.slice(0, 10).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        toastr.error("Failed to fetch users data.");
        return [];
    }
}

// Fetch posts data from API (used as products for demonstration purposes)
async function fetchProducts() {
    try {
        const response = await fetch(`${apiUrl}${postsEndpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Limit to 10 products for cleaner table display
        return data.slice(0, 10).map(post => ({
            id: post.id,
            name: post.title, // Using title as product name
            price: (Math.random() * 100 + 10).toFixed(2) // Generate random price
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        toastr.error("Failed to fetch products data.");
        return [];
    }
}

// Initialize dashboard data and UI
async function init() {
    // Set current year in footer
    document.getElementById("current-year").textContent = new Date().getFullYear();

    toastr.info("Loading dashboard data...");
    [users, products] = await Promise.all([fetchUsers(), fetchProducts()]);
    toastr.success("Data loaded successfully!");
    showContent("dashboard-content"); // Default to dashboard content
    updateDashboardStats();
    createUsersChart();
}

// Function to handle content switching
function showContent(contentId) {
    const pages = document.querySelectorAll('.dashboard-page');
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === contentId) {
            page.classList.add('active');
        }
    });

    // Update active state in sidebar
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.content === contentId) {
            link.classList.add('active');
        }
    });

    // Specific actions for each content type
    if (contentId === "dashboard-content") {
        updateDashboardStats();
        createUsersChart();
    } else if (contentId === "users-content") {
        updateUsersTable();
    } else if (contentId === "products-content") {
        updateProductsTable();
    }
}

// Event Listeners for sidebar navigation
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showContent(this.dataset.content);
        // Close sidebar on mobile after navigation
        if (document.body.classList.contains('sidebar-toggled')) {
            document.body.classList.remove('sidebar-toggled');
        }
    });
});

// Event Listeners for dropdown menu items
document.querySelectorAll('.dropdown-menu a[data-content]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showContent(this.dataset.content);
    });
});

// Sidebar toggle for desktop
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
});

// Sidebar toggle for mobile
document.getElementById('mobile-sidebar-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-toggled');
});

// Add user button click event
document.getElementById("add-user-btn").addEventListener("click", () => {
    $('#add-user-form').trigger('reset'); // Clear form
    $("#add-user-modal").modal("show");
});

// Add product button click event
document.getElementById("add-product-btn").addEventListener("click", () => {
    $('#add-product-form').trigger('reset'); // Clear form
    $("#add-product-modal").modal("show");
});

// Add user form submit event
document.getElementById("add-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();

    if (!name || !email) {
        toastr.error("Please fill in all fields for the new user.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${usersEndpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });
        const newUser = await response.json();
        newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1; // Assign a unique ID
        users.unshift(newUser); // Add to the beginning
        updateUsersTable();
        updateDashboardStats();
        createUsersChart(); // Update chart with new user
        toastr.success("User added successfully!");
        $("#add-user-modal").modal("hide");
    } catch (error) {
        console.error("Error adding user:", error);
        toastr.error("Failed to add user.");
    }
});

// Add product form submit event
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("product-name").value.trim();
    const price = document.getElementById("product-price").value.trim();

    if (!name || !price) {
        toastr.error("Please fill in all fields for the new product.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${postsEndpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: name, body: `Price: $${price}` }) // Using 'title' for name, 'body' for price
        });
        const newProduct = await response.json();
        newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1; // Assign a unique ID
        newProduct.name = name;
        newProduct.price = price;
        products.unshift(newProduct); // Add to the beginning
        updateProductsTable();
        updateDashboardStats();
        toastr.success("Product added successfully!");
        $("#add-product-modal").modal("hide");
    } catch (error) {
        console.error("Error adding product:", error);
        toastr.error("Failed to add product.");
    }
});

// Settings form submit event
document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    const siteTitle = document.getElementById("site-title").value;
    const adminEmail = document.getElementById("admin-email").value;
    console.log("Settings saved:", { siteTitle, adminEmail });
    toastr.success("Settings saved successfully!");
});

// Update dashboard stats
function updateDashboardStats() {
    document.getElementById("users-count").innerText = users.length;
    document.getElementById("products-count").innerText = products.length;
}

// Update users table
function updateUsersTable() {
    const usersTableBody = document.getElementById("users-table-body");
    usersTableBody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-sm btn-info edit-user-btn" data-id="${user.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}"><i class="fas fa-trash-alt"></i> Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.dataset.id);
            const userToEdit = users.find(u => u.id === userId);
            if (userToEdit) {
                document.getElementById('edit-user-id').value = userToEdit.id;
                document.getElementById('edit-user-name').value = userToEdit.name;
                document.getElementById('edit-user-email').value = userToEdit.email;
                $("#edit-user-modal").modal("show");
            }
        });
    });

    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.dataset.id);
            if (confirm("Are you sure you want to delete this user?")) {
                deleteUser(userId);
            }
        });
    });
}

// Handle user edit form submission
document.getElementById("edit-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = parseInt(document.getElementById('edit-user-id').value);
    const name = document.getElementById('edit-user-name').value.trim();
    const email = document.getElementById('edit-user-email').value.trim();

    if (!name || !email) {
        toastr.error("Please fill in all fields for user details.");
        return;
    }

    try {
        // In a real app, this would be a PUT request to the API
        // For this demo, we'll just update the local array
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], name, email };
            updateUsersTable();
            createUsersChart();
            toastr.success("User updated successfully!");
            $("#edit-user-modal").modal("hide");
        } else {
            toastr.error("User not found.");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        toastr.error("Failed to update user.");
    }
});

// Delete user function
function deleteUser(userId) {
    // In a real app, this would be a DELETE request to the API
    // For this demo, we'll just update the local array
    users = users.filter(user => user.id !== userId);
    updateUsersTable();
    updateDashboardStats();
    createUsersChart();
    toastr.success("User deleted successfully!");
}

// Update products table
function updateProductsTable() {
    const productsTableBody = document.getElementById("products-table-body");
    productsTableBody.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-info edit-product-btn" data-id="${product.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-sm btn-danger delete-product-btn" data-id="${product.id}"><i class="fas fa-trash-alt"></i> Delete</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const productToEdit = products.find(p => p.id === productId);
            if (productToEdit) {
                document.getElementById('edit-product-id').value = productToEdit.id;
                document.getElementById('edit-product-name').value = productToEdit.name;
                document.getElementById('edit-product-price').value = productToEdit.price;
                $("#edit-product-modal").modal("show");
            }
        });
    });

    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            if (confirm("Are you sure you want to delete this product?")) {
                deleteProduct(productId);
            }
        });
    });
}

// Handle product edit form submission
document.getElementById("edit-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const productId = parseInt(document.getElementById('edit-product-id').value);
    const name = document.getElementById('edit-product-name').value.trim();
    const price = document.getElementById('edit-product-price').value.trim();

    if (!name || !price) {
        toastr.error("Please fill in all fields for product details.");
        return;
    }

    try {
        // For this demo, we'll just update the local array
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], name, price };
            updateProductsTable();
            toastr.success("Product updated successfully!");
            $("#edit-product-modal").modal("hide");
        } else {
            toastr.error("Product not found.");
        }
    } catch (error) {
        console.error("Error updating product:", error);
        toastr.error("Failed to update product.");
    }
});

// Delete product function
function deleteProduct(productId) {
    // For this demo, we'll just update the local array
    products = products.filter(product => product.id !== productId);
    updateProductsTable();
    updateDashboardStats();
    toastr.success("Product deleted successfully!");
}

// Create or update users chart
function createUsersChart() {
    if (userChartInstance) {
        userChartInstance.destroy(); // Destroy previous chart instance
    }

    const ctx = document.getElementById("usersChart");
    if (!ctx) return; // Ensure canvas exists

    userChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: users.map(user => user.name),
            datasets: [{
                label: "Users by ID (Dummy Data)",
                data: users.map(user => user.id), // Using ID as dummy data for bar height
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue with transparency
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow canvas to resize freely
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        precision: 0 // No decimal points for IDs
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'User ID'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'User Name'
                    }
                }]
            },
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Registered Users (First 10 from API)'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        }
    });
}

// Initialize dashboard on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);

// Social sharing functionality (basic placeholders)
document.querySelector('.facebook-share').addEventListener('click', function(e) {
    e.preventDefault();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
});

document.querySelector('.twitter-share').addEventListener('click', function(e) {
    e.preventDefault();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this awesome Admin Dashboard!")}`, '_blank', 'width=600,height=400');
});

document.querySelector('.linkedin-share').addEventListener('click', function(e) {
    e.preventDefault();
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent("Admin Dashboard")}&summary=${encodeURIComponent("A modern and responsive admin dashboard template.")}`, '_blank', 'width=600,height=400');
});