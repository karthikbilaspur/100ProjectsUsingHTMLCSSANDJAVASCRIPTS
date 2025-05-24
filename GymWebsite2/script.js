// User registration and login logic
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');

 registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            console.log('Registration successful');
            // Redirect to login page or dashboard
        } else {
            console.error('Registration failed:', data.error);
            // Display error message to user
        }
    })
    .catch((error) => console.error('Error registering user:', error));
});

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: loginUsername,
            password: loginPassword,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            console.log('Login successful');
            // Redirect to dashboard or home page
        } else {
            console.error('Login failed:', data.error);
            // Display error message to user
        }
    })
    .catch((error) => console.error('Error logging in:', error));
});

// Workout plan generator logic
const generateWorkoutPlanBtn = document.getElementById('generate-workout-plan-btn');
const workoutPlanOutput = document.getElementById('workout-plan-output');

generateWorkoutPlanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const fitnessGoals = document.getElementById('fitness-goals').value;
    const currentFitnessLevel = document.getElementById('current-fitness-level').value;
    const availableWorkoutTime = document.getElementById('available-workout-time').value;

    const workoutPlan = {
        goals: fitnessGoals,
        level: currentFitnessLevel,
        time: availableWorkoutTime,
        exercises: [
            // Generate exercises based on user input
        ],
    };

    workoutPlanOutput.innerHTML = `
        <h2>Your Workout Plan</h2>
        <p>Goals: ${workoutPlan.goals}</p>
        <p>Level: ${workoutPlan.level}</p>
        <p>Time: ${workoutPlan.time}</p>
        <ul>
            ${workoutPlan.exercises.map((exercise) => `<li>${exercise}</li>`).join('')}
        </ul>
    `;
});

// Progress tracking logic
const logWorkoutBtn = document.getElementById('log-workout-btn');
const progressTrackingOutput = document.getElementById('progress-tracking-output');

logWorkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const workoutType = document.getElementById('workout-type').value;
    const workoutDuration = document.getElementById('workout-duration').value;

    const workoutLog = {
        type: workoutType,
        duration: workoutDuration,
        date: new Date().toLocaleDateString(),
    };

    progressTrackingOutput.innerHTML += `
        <p>You logged a ${workoutLog.type} workout for ${workoutLog.duration} minutes on ${workoutLog.date}</p>
    `;
})

// Community forum logic
const postBtn = document.getElementById('post-btn');
const forumPosts = document.getElementById('forum-posts');

postBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const forumPostText = document.getElementById('forum-post-text').value;

    const post = {
        text: forumPostText,
        date: new Date().toLocaleDateString(),
    };

    forumPosts.innerHTML += `
        <div class="post">
            <p>${post.text}</p>
            <p>Posted on ${post.date}</p>
        </div>
    `;
});

// Personalized nutrition planning
const nutritionPlan = (userData) => {
    const plan = {
        calories: userData.caloricNeeds,
        macronutrients: {
            protein: userData.proteinNeeds,
            carbohydrates: userData.carbohydrateNeeds,
            fat: userData.fatNeeds,
        },
        mealPlan: [
            `Breakfast: ${userData.breakfastPreference}`,
            `Lunch: ${userData.lunchPreference}`,
            `Dinner: ${userData.dinnerPreference}`,
        ],
    };
    return plan;
};

// AI-driven workout coaching
const workoutCoach = (userData) => {
    const coach = {
        exercises: [
            {
                name: 'Squats',
                sets: 3,
                reps: 10,
            },
            {
                name: 'Push-ups',
                sets: 3,
                reps: 10,
            },
            {
                name: 'Lunges',
                sets: 3,
                reps: 10,
            },
        ],
        guidance: [
            'Focus on proper form and technique',
            'Increase weight or reps as you get stronger',
            'Rest for 60-90 seconds between sets',
        ],
    };
    return coach;
};

// Virtual fitness coach
const virtualCoach = () => {
    const coach = {
        name: 'FitForge Coach',
        avatar: 'coach-avatar.jpg',
        guidance: [
            'Welcome to your workout!',
            'Remember to stay hydrated and listen to your body',
            'You got this!',
        ],
    };
    return coach;
};

const shareProgress = (userData) => {
    const shareOptions = [
        {
            platform: 'Facebook',
            url: 'https://www.facebook.com/sharer/sharer.php?u=',
        },
        {
            platform: 'Twitter',
            url: 'https://twitter.com/intent/tweet?url=',
        },
    ];
    return shareOptions;
};


const shareOptions = shareProgress(userData);
console.log(shareOptions);

// Detailed progress insights
const progressInsights = (userData) => {
    const insights = {
        workoutHistory: [
            {
                date: '2023-02-20',
                workoutType: 'Strength training',
                duration: 60,
            },
            {
                date: '2023-02-22',
                workoutType: 'Cardio',
                duration: 30,
            },
        ],
        progressTrends: [
            {
                trend: 'Increasing strength',
                progress: 10,
            },
            {
                trend: 'Improving cardiovascular endurance',
                progress: 15,
            },
        ],
    };
    return insights;
};


const insights = progressInsights(userData);
console.log(insights);

const progressReports = (userData) => {
    const reports = {
        workoutSummary: [
            {
                date: '2023-02-20',
                workoutType: 'Strength training',
                duration: 60,
            },
        ],
        progressOverview: [
            {
                trend: 'Increasing strength',
                progress: 10,
            },
        ],
    };
    return reports;
};

const reports = progressReports(userData);
console.log(reports);

const wearableIntegration = (userData) => {
    const wearableDevices = [
        {
            device: 'Fitbit',
            api: 'https://api.fitbit.com/',
        },
        {
            device: 'Apple Watch',
            api: 'https://api.healthkit.com/',
        },
    ];
    return wearableDevices;
};

// Example usage:
const userData = {
    wearableDevice: 'Fitbit',
};

const wearableDevices = wearableIntegration(userData);
console.log(wearableDevices);