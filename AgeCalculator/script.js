let currentStep = 1;
let picsArray = [];
let userProfile = {}; // Store user's own profile data
let currentDisplayedProfile = null; // Store the profile currently shown on the card
let chatName = '';
let chatLog = [];

// Elements
const form = document.getElementById('multi-level-form');
const progressBarFill = document.getElementById('progress-bar-fill');
const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
];
const nextStep1Btn = document.getElementById('next-step-1');
const prevStep1Btn = document.getElementById('prev-step-1');
const nextStep2Btn = document.getElementById('next-step-2');
const prevStep2Btn = document.getElementById('prev-step-2');
const submitFormBtn = document.getElementById('submit-form');
const birthdateInput = document.getElementById('birthdate');
const ageInput = document.getElementById('age');

const cardContainer = document.querySelector('.card-container');
const formContainer = document.querySelector('.form-container');
const chatContainer = document.querySelector('.chat-container');
const matchesContainer = document.querySelector('.matches-container');

// Sample Profiles for swiping (In a real app, these would come from a backend)
const sampleProfiles = [
    {
        id: 1,
        name: "Alice",
        age: 28,
        gender: "female",
        bio: "Adventure seeker who loves hiking and trying new cuisines. Looking for someone to explore the world with!",
        interests: ["hiking", "cooking", "traveling", "photography"],
        likes: "Dogs, Sunny days, Deep conversations",
        dislikes: "Olives, Reality TV",
        lookingFor: "long-term",
        picsArray: [
            "https://picsum.photos/id/10/300/300",
            "https://picsum.photos/id/100/300/300",
            "https://picsum.photos/id/1000/300/300"
        ]
    },
    {
        id: 2,
        name: "Bob",
        age: 32,
        gender: "male",
        bio: "Software engineer by day, amateur musician by night. Passionate about coding and playing guitar. Looking for a partner in crime.",
        interests: ["gaming", "music", "coding", "movies"],
        likes: "Concerts, Sci-fi, Pizza",
        dislikes: "Traffic, Mornings",
        lookingFor: "short-term",
        picsArray: [
            "https://picsum.photos/id/1011/300/300",
            "https://picsum.photos/id/1012/300/300",
            "https://picsum.photos/id/1013/300/300"
        ]
    },
    {
        id: 3,
        name: "Charlie",
        age: 25,
        gender: "other",
        bio: "Artist and cat lover. I spend my weekends at art galleries or volunteering at animal shelters. Hoping to find a genuine connection.",
        interests: ["art", "pets", "reading", "cooking"],
        likes: "Quiet evenings, Coffee, Vintage shops",
        dislikes: "Loud bars, Impatience",
        lookingFor: "long-term",
        picsArray: [
            "https://picsum.photos/id/1025/300/300",
            "https://picsum.photos/id/1027/300/300",
            "https://picsum.photos/id/1032/300/300"
        ]
    }
];
let currentProfileIndex = 0;
let userMatches = []; // List of names the user has matched with

// --- UI Utility Functions ---

// Update progress bar
function updateProgressBar() {
    const progress = (currentStep / steps.length) * 100;
    progressBarFill.style.width = `${progress}%`;
}

// Show specific step
function showStep(stepNumber) {
    steps.forEach((step, index) => {
        step.style.display = (index + 1 === stepNumber) ? 'block' : 'none';
    });
    currentStep = stepNumber;
    updateProgressBar();
}

// --- Event Listeners ---

// Age Calculation
birthdateInput.addEventListener('change', () => {
    const birthdate = new Date(birthdateInput.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    ageInput.value = age >= 0 ? age : ''; // Only show age if valid birthdate
});

// Form Navigation event listeners
nextStep1Btn.addEventListener('click', () => {
    // Validate only specific fields for step 1
    const name = document.getElementById('name');
    const birthdate = document.getElementById('birthdate');
    const gender = document.getElementById('gender');

    if (!name.value || !birthdate.value || !gender.value) {
        alert('Please fill in Name, Birthdate, and Gender.');
        return;
    }
    if (ageInput.value < 18) {
        alert('You must be at least 18 years old to use this app.');
        return;
    }
    showStep(2);
});

prevStep1Btn.addEventListener('click', () => {
    showStep(1);
});

nextStep2Btn.addEventListener('click', () => {
    const lookingFor = document.getElementById('looking-for');
    if (!lookingFor.value) {
        alert('Please select what you are looking for.');
        return;
    }
    showStep(3);
});

prevStep2Btn.addEventListener('click', () => {
    showStep(2);
});

submitFormBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Re-validate critical fields for completeness
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const lookingFor = document.getElementById('looking-for').value;

    if (!name || !age || !gender || !lookingFor) {
        alert('Please complete all required fields in the form.');
        return;
    }

    const bio = document.getElementById('bio').value;
    const interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);
    const likes = document.getElementById('likes').value;
    const dislikes = document.getElementById('dislikes').value;
    const pics = document.getElementById('pics').files;

    if (pics.length > 10) {
        alert('Please select a maximum of 10 pictures');
        return;
    }

    picsArray = []; // Clear previous images
    const filePromises = Array.from(pics).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    });

    try {
        const results = await Promise.all(filePromises);
        picsArray = results;
        userProfile = { name, age, gender, bio, interests, likes, dislikes, lookingFor, picsArray };
        console.log("User Profile Created:", userProfile);
        displayNextProfile(); // Start displaying sample profiles after user creates theirs
    } catch (error) {
        console.error("Error reading files:", error);
        alert("There was an error processing your pictures.");
    }

    if (pics.length === 0) {
        userProfile = { name, age, gender, bio, interests, likes, dislikes, lookingFor, picsArray: [] };
        console.log("User Profile Created (No Pics):", userProfile);
        displayNextProfile();
    }
});

// --- Profile Card Display and Swiping Logic ---

function displayProfile(profile) {
    formContainer.style.display = 'none';
    chatContainer.style.display = 'none';
    matchesContainer.style.display = 'none';
    cardContainer.style.display = 'block';

    currentDisplayedProfile = profile; // Set the current profile

    document.getElementById('card-name').innerText = profile.name;
    document.getElementById('card-age').innerText = `${profile.age} years old`;
    document.getElementById('card-gender').innerText = profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1);
    document.getElementById('card-bio').innerText = profile.bio || 'No bio provided.';

    const interestsList = document.getElementById('card-interests');
    interestsList.innerHTML = '';
    if (profile.interests && profile.interests.length > 0) {
        profile.interests.forEach(interest => {
            const li = document.createElement('li');
            li.innerText = interest;
            interestsList.appendChild(li);
        });
    } else {
        interestsList.innerHTML = '<li>No interests listed.</li>';
    }

    document.getElementById('card-likes').innerHTML = `<strong>Likes:</strong> ${profile.likes || 'N/A'}`;
    document.getElementById('card-dislikes').innerHTML = `<strong>Dislikes:</strong> ${profile.dislikes || 'N/A'}`;
    document.getElementById('card-looking-for').innerHTML = `<strong>Looking For:</strong> ${profile.lookingFor ? profile.lookingFor.replace('-', ' ') : 'N/A'}`;

    const profilePicElement = document.getElementById('card-profile-pic');
    const picsGallery = document.getElementById('pics-container');
    picsGallery.innerHTML = ''; // Clear previous images

    if (profile.picsArray && profile.picsArray.length > 0) {
        profilePicElement.src = profile.picsArray[0]; // First pic as profile pic
        profile.picsArray.forEach((pic, index) => {
            const img = document.createElement('img');
            img.src = pic;
            img.alt = `${profile.name}'s picture ${index + 1}`;
            picsGallery.appendChild(img);
        });
    } else {
        profilePicElement.src = "https://via.placeholder.com/150/f0f2f5/a0a0a0?text=No+Photo"; // Placeholder
        picsGallery.innerHTML = '<p>No additional pictures uploaded.</p>';
    }
}

function displayNextProfile() {
    if (currentProfileIndex < sampleProfiles.length) {
        displayProfile(sampleProfiles[currentProfileIndex]);
    } else {
        cardContainer.innerHTML = '<div class="card"><p>That\'s all for now! Check back later for more profiles.</p></div>';
        cardContainer.style.display = 'block';
    }
}

// Card action event listeners
document.getElementById('swipe-left-btn').addEventListener('click', () => {
    if (currentDisplayedProfile) {
        alert(`You swiped left on ${currentDisplayedProfile.name}!`);
        currentProfileIndex++;
        displayNextProfile();
    }
});

document.getElementById('swipe-right-btn').addEventListener('click', () => {
    if (currentDisplayedProfile) {
        alert(`You swiped right on ${currentDisplayedProfile.name}! It's a match!`);
        userMatches.push(currentDisplayedProfile); // Add to user's matches
        updateMatchesList();
        currentProfileIndex++;
        displayNextProfile();
    }
});

document.getElementById('favorite-btn').addEventListener('click', () => {
    if (currentDisplayedProfile) {
        alert(`You favorited ${currentDisplayedProfile.name}!`);
        // In a real app, this would add to a favorites list
    }
});

document.getElementById('message-btn').addEventListener('click', () => {
    if (currentDisplayedProfile) {
        chatName = currentDisplayedProfile.name;
        cardContainer.style.display = 'none';
        chatContainer.style.display = 'block';
        document.getElementById('chat-name').innerText = chatName;
        document.getElementById('chat-log').innerHTML = ''; // Clear previous chat log
        chatLog = []; // Clear chat history
        addChatMessage('system', `You started a chat with ${chatName}. Say hello!`);
    } else {
        alert('No profile currently displayed to message.');
    }
});

document.getElementById('view-matches-btn').addEventListener('click', () => {
    cardContainer.style.display = 'none';
    chatContainer.style.display = 'none';
    matchesContainer.style.display = 'block';
});

// --- Matches List Functionality ---

function updateMatchesList() {
    const matchesListDiv = document.getElementById('matches-list');
    if (userMatches.length === 0) {
        matchesListDiv.innerHTML = '<p>No matches yet. Keep swiping!</p>';
    } else {
        matchesListDiv.innerHTML = '<ul>' + userMatches.map(m =>
            `<li><span>${m.name} (${m.age})</span> <button class="btn btn-primary start-chat-from-match" data-name="${m.name}"><i class="fas fa-comment-dots"></i> Chat</button></li>`
        ).join('') + '</ul>';

        // Add event listeners for new chat buttons inside the matches list
        document.querySelectorAll('.start-chat-from-match').forEach(button => {
            button.addEventListener('click', (e) => {
                const nameToChat = e.target.dataset.name;
                cardContainer.style.display = 'none';
                matchesContainer.style.display = 'none';
                chatContainer.style.display = 'block';
                document.getElementById('chat-name').innerText = nameToChat;
                document.getElementById('chat-log').innerHTML = '';
                chatLog = [];
                addChatMessage('system', `You started a chat with ${nameToChat}.`);
            });
        });
    }
}

// --- Chat Functionality ---

function addChatMessage(sender, message) {
    const chatLogDiv = document.getElementById('chat-log');
    const p = document.createElement('p');
    p.classList.add(sender); // Add a class for styling (e.g., 'user', 'other', 'system')
    p.innerHTML = `${message}`;
    chatLogDiv.appendChild(p);
    chatLogDiv.scrollTop = chatLogDiv.scrollHeight; // Auto-scroll to bottom
    chatLog.push({ sender, message }); // Store in log
}

document.getElementById('send-msg-btn').addEventListener('click', () => {
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();
    if (message) {
        addChatMessage('user', message);
        messageInput.value = '';
        // Simulate a reply (in a real app, this would be an API call)
        setTimeout(() => {
            addChatMessage('other', `That's interesting, ${userProfile.name}! Tell me more about "${message}".`);
        }, 1000);
    }
});

// Allow sending message by pressing Enter key
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('send-msg-btn').click();
    }
});

// --- Back Button Functionality ---
document.getElementById('back-to-card-from-chat').addEventListener('click', () => {
    chatContainer.style.display = 'none';
    cardContainer.style.display = 'block';
});

document.getElementById('back-to-card-from-matches').addEventListener('click', () => {
    matchesContainer.style.display = 'none';
    cardContainer.style.display = 'block';
});

// --- Initial Setup ---
showStep(1); // Start at the first step
updateProgressBar(); // Initialize progress bar
updateMatchesList(); // Initialize matches list