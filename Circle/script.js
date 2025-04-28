// Circle animation code
const circleContainer = document.querySelector('.circle-container');
const cards = [];
const directions = [];
let angle = 0;
let speed = 0.05;
let isSoundOn = false;
let is3DOn = false;
let isPhysicsOn = false;
let gravity = 0.01;
let particles = [];

// Create cards
for (let i = 0; i < 12; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    card.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.background = `hsl(${i * 30}, 100%, 50%)`;
    card.appendChild(circle);
    circleContainer.appendChild(card);
    cards.push(card);
    directions.push(i < 6 ? 1 : -1);
}

// Create particles
for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * window.innerWidth}px`;
    particle.style.top = `${Math.random() * window.innerHeight}px`;
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    circleContainer.appendChild(particle);
    particles.push(particle);
}

// Animate cards
function animateCards() {
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) / 3 + (i % 6) * 20;

        const newX = centerX + Math.cos(angle * directions[i]) * radius;
        const newY = centerY + Math.sin(angle * directions[i]) * radius;

        card.style.left = `${newX - card.offsetWidth / 2}px`;
        card.style.top = `${newY - card.offsetHeight / 2}px`;

        // Add a pulse effect
        card.style.transform = `scale(${1 + Math.sin(angle * 2) * 0.1})`;

        if (is3DOn) {
            card.style.transform += ` rotateX(${angle * 10}deg) rotateY(${angle * 10}deg)`;
        }
    }

    // Animate particles
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const velocityX = Math.random() * 2 - 1;
        const velocityY = Math.random() * 2 - 1;

        particle.style.left = `${parseFloat(particle.style.left) + velocityX}px`;
        particle.style.top = `${parseFloat(particle.style.top) + velocityY + gravity}px`;

        if (parseFloat(particle.style.top) > window.innerHeight) {
            particle.style.top = `0px`;
            particle.style.left = `${Math.random() * window.innerWidth}px`;
        }
    }

    angle += speed;
    requestAnimationFrame(animateCards);
}

animateCards();

// Add event listener for mouse move
document.addEventListener('mousemove', (e) => {
    // Change the speed based on mouse position
    speed = 0.01 + (e.clientX / window.innerWidth) * 0.1;
});

// Add event listener for touch move
document.addEventListener('touchmove', (e) => {
    // Change the speed based on touch position
    speed = 0.01 + (e.touches[0].clientX / window.innerWidth) * 0.1;
});

// Control panel event listeners
document.getElementById('speed').addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
});

document.getElementById('direction').addEventListener('change', (e) => {
    for (let i = 0; i < directions.length; i++) {
        directions[i] = e.target.value === 'clockwise' ? 1 : -1;
    }
});

document.getElementById('toggle-sound').addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        // Play sound
        const audio = new Audio('sound.mp3');
        audio.play();
    }
});

document.getElementById('toggle-3d').addEventListener('click', () => {
        document.getElementById('toggle-3d').addEventListener('click', () => {
            is3DOn = !is3DOn;
        });
        
        document.getElementById('toggle-physics').addEventListener('click', () => {
            isPhysicsOn = !isPhysicsOn;
            if (isPhysicsOn) {
                gravity = 0.1;
            } else {
                gravity = 0.01;
            }
        });
    });
    
    // Add event listener for window resize
    window.addEventListener('resize', () => {
        // Update card positions
        animateCards();
    });