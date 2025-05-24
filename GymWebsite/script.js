
// Register user
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('User registered successfully');
            } else {
                alert('Registration failed');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Login user
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                alert('User logged in successfully');
            } else {
                alert('Invalid email or password');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Book a class
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        try {
            const response = await fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    date,
                    time
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Class booked successfully');
            } else {
                alert('Booking failed');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Subscribe to newsletter
const subscribeForm = document.getElementById('subscribe-form');

if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('subscribe-email').value;

        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Subscribed successfully');
            } else {
                alert('Subscription failed');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

