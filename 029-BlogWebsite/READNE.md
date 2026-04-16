#karthik Blog


A responsive, interactive personal blog website built with vanilla HTML5, CSS3, and JavaScript (ES6+). 
Focused on technology and programming content with modern UX features.

KEY FEATURES

1. Dynamic Blog System
   - Posts generated via JavaScript from data array
   - "Load More" pagination to add posts without page reload
   - Live search filters by title and content

2. User Experience
   - Dark/Light mode toggle with localStorage persistence
   - Font size increase/decrease controls (A+ / A-) 
   - Responsive hamburger menu for mobile devices
   - Smooth scroll and hover animations

3. Engagement Tools
   - Contact form with async submission
   - Newsletter signup form with API integration
   - Push notification opt-in using Notifications API
   - Social media sharing links

4. SEO & Social Ready
   - Complete meta tags: description, keywords
   - Open Graph tags for Facebook/LinkedIn
   - Twitter Card tags
   - Semantic HTML structure

TECH STACK

Frontend: HTML5, CSS3 (Grid, Flexbox, CSS Variables), JavaScript ES6+
Libraries: Font Awesome 6.5.0 for icons, Google Fonts (Montserrat, Open Sans)
APIs: Fetch API, Web Notifications API, localStorage
Design: Mobile-first responsive, CSS dark mode, accessibility (ARIA labels)

FILE STRUCTURE

/project-root
├── index.html       - Main HTML structure + meta tags
├── styles.css       - All styling, responsive breakpoints, dark mode
├── script.js        - Blog logic, search, forms, theme, notifications
├── favicon.ico      - Site icon
├── author.jpg       - About section image
└── README.md        - Documentation
