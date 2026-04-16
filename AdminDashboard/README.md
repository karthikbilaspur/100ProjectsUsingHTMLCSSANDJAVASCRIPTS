# Admin Dashboard

This project is a modern, responsive, and interactive Admin Dashboard template. It provides a clean interface for managing users, products, and general settings, with data visualization and dynamic content updates.

 Features

   Responsive Layout: Adapts seamlessly to different screen sizes, from mobile phones to desktop monitors, with a collapsible sidebar.
   Dynamic Navigation: Easy switching between Dashboard, Users, Products, Settings, and Profile sections without full page reloads.
   Dashboard Overview: Displays key statistics (Users, Products, Orders, Revenue) and a visual chart of user activity.
   User Management:
       View a list of users in a sortable and searchable table.
       Add new users via a modal form.
       Edit existing user details.
       Delete users from the system.
   Product Management:
       View a list of products (simulated as posts from an API).
       Add new products via a modal form.
       Edit existing product details.
       Delete products from the system.
   Settings Panel: A dedicated section for configuring general application settings.
   User Profile: A dedicated page for displaying and updating current user information.
   Interactive Charts: Utilizes Chart.js for data visualization on the dashboard.
   Toastr Notifications: Provides subtle, non-intrusive notifications for user actions (e.g., success messages, errors).
   Modern UI: Built with Bootstrap 4 for a clean, professional look and Font Awesome for icons.
   Social Sharing: Integrated social media share buttons in the footer.
   Dynamic Footer: Automatically updates the copyright year.

 Technologies Used

   HTML5: Structure of the dashboard.
   CSS3: Styling, including advanced responsive techniques and custom theming.
   JavaScript (ES6+): Powers all interactive elements, data fetching, and UI manipulation.
   Bootstrap 4: Frontend framework for responsive design, components (modals, tables, navigation), and overall styling.
   Font Awesome 5: Provides scalable vector icons.
   Chart.js 2.x: For creating dynamic and interactive data visualizations.
   Toastr.js: For elegant, non-blocking notification messages.
   jQuery 3.x: A dependency for Bootstrap's JavaScript components.
   JSONPlaceholder API: Used as a mock backend for fetching user and product data.

 Setup Instructions

To run this dashboard locally, you only need a web browser:

1.Save the files:
       Save the HTML code as `index.html`.
       Save the JavaScript code as `script.js`.
       Save the CSS code as `styles.css`.
       Ensure all three files are placed in the same folder.

2.Open in Browser:
       Navigate to the folder where you saved the files.
       Double-click on `index.html` to open it in your preferred web browser.

No complex server environment or additional dependencies (beyond the included CDN links) are required.

 Usage

Upon opening `index.html`, you will be presented with the dashboard:

   Sidebar Navigation: Click on the links in the left sidebar to navigate between different sections (Dashboard, Users, Products, Settings, Profile). On smaller screens, use the hamburger menu in the top-left to toggle the sidebar.
   Dashboard: View an overview of key statistics and a sample user chart.
   Users/Products:
       The tables display data fetched from a mock API.
       Use the "Add User" or "Add Product" buttons to open a modal and add new entries.
       Use the "Edit" and "Delete" buttons in the table rows to manage individual items.
   Settings: Update general site configuration (changes are not persistent in this demo).
   Profile: View and (optionally) update the current user's profile information.
   Notifications: Look for small pop-up messages (toasts) in the top-right corner indicating the success or failure of actions.

 Credits

Developed as a modern administration interface template.
