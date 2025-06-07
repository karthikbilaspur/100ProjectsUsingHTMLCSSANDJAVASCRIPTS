// script.js

// API Endpoints
const apiUrl = "https://jsonplaceholder.typicode.com";
const usersEndpoint = "/users";
const postsEndpoint = "/posts";

// Fetch users data from API
async function fetchUsers() {
    try {
        const response = await fetch(`${apiUrl}${usersEndpoint}`);
        const users = await response.json();
        return users;
    } catch (error) {
        console.error(error);
        toastr.error("Failed to fetch users data");
    }
}

// Fetch posts data from API (used as products for demonstration purposes)
async function fetchProducts() {
    try {
        const response = await fetch(`${apiUrl}${postsEndpoint}`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error(error);
        toastr.error("Failed to fetch products data");
    }
}

// Initialize users and products variables
let users = [];
let products = [];

// Fetch data on page load
async function init() {
    users = await fetchUsers();
    products = await fetchProducts();
    showDashboardContent();
}

// Dashboard link click event
document.getElementById("dashboard-link").addEventListener("click", () => {
    showDashboardContent();
});

// Users link click event
document.getElementById("users-link").addEventListener("click", () => {
    showUsersContent();
});

// Products link click event
document.getElementById("products-link").addEventListener("click", () => {
    showProductsContent();
});

// Settings link click event
document.getElementById("settings-link").addEventListener("click", () => {
    showSettingsContent();
});

// Add user button click event
document.getElementById("add-user-btn").addEventListener("click", () => {
    $("#add-user-modal").modal("show");
});

// Add product button click event
document.getElementById("add-product-btn").addEventListener("click", () => {
    $("#add-product-modal").modal("show");
});

// Add user form submit event
document.getElementById("add-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let name = document.getElementById("user-name").value;
    let email = document.getElementById("user-email").value;
    try {
        const response = await fetch(`${apiUrl}${usersEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email
            })
        });
        const newUser = await response.json();
        users.push(newUser);
        updateUsersTable();
        toastr.success("User added successfully!");
        $("#add-user-modal").modal("hide");
    } catch (error) {
        console.error(error);
        toastr.error("Failed to add user");
    }
});

// Add product form submit event
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let title = document.getElementById("product-name").value;
    let body = document.getElementById("product-price").value;
    try {
        const response = await fetch(`${apiUrl}${postsEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                body
            })
        });
        const newProduct = await response.json();
        products.push(newProduct);
        updateProductsTable();
        toastr.success("Product added successfully!");
        $("#add-product-modal").modal("hide");
    } catch (error) {
        console.error(error);
        toastr.error("Failed to add product");
    }
});

// Show dashboard content
function showDashboardContent() {
    document.getElementById("dashboard-content").style.display = "block";
    document.getElementById("users-content").style.display = "none";
    document.getElementById("products-content").style.display = "none";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("dashboard-link").classList.add("active");
    document.getElementById("users-link").classList.remove("active");
    document.getElementById("products-link").classList.remove("active");
    document.getElementById("settings-link").classList.remove("active");
    updateDashboardStats();
    createUsersChart();
}

// Show users content
function showUsersContent() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("users-content").style.display = "block";
    document.getElementById("products-content").style.display = "none";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("dashboard-link").classList.remove("active");
    document.getElementById("users-link").classList.add("active");
    document.getElementById("products-link").classList.remove("active");
    document.getElementById("settings-link").classList.remove("active");
    updateUsersTable();
}

// Show products content
function showProductsContent() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("users-content").style.display = "none";
    document.getElementById("products-content").style.display = "block";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("dashboard-link").classList.remove("active");
    document.getElementById("users-link").classList.remove("active");
    document.getElementById("products-link").classList.add("active");
    document.getElementById("settings-link").classList.remove("active");
    updateProductsTable();
}

// Show settings content
function showSettingsContent() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("users-content").style.display = "none";
    document.getElementById("products-content").style.display = "none";
    document.getElementById("settings-content").style.display = "block";
    document.getElementById("dashboard-link").classList.remove("active");
    document.getElementById("users-link").classList.remove("active");
    document.getElementById("products-link").classList.remove("active");
    document.getElementById("settings-link").classList.add("active");
}

// Update dashboard stats
function updateDashboardStats() {
    document.getElementById("users-count").innerText = users.length;
    document.getElementById("products-count").innerText = products.length;
}

// Update users table
function updateUsersTable() {
    let usersTableBody = document.getElementById("users-table-body");
    usersTableBody.innerHTML = "";
    users.forEach(user => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-sm btn-primary">Edit</button>
                <button class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

// Update products table
function updateProductsTable() {
    let productsTableBody = document.getElementById("products-table-body");
    productsTableBody.innerHTML = "";
    products.forEach(product => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.body}</td>
            <td>
                <button class="btn btn-sm btn-primary">Edit</button>
                <button class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

// Create a users chart
function createUsersChart() {
    let ctx = document.getElementById("usersChart").getContext("2d");
    let chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: users.map(user => user.name),
            datasets: [{
                label: "Users",
                data: users.map(user => user.id),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Initialize dashboard
init();