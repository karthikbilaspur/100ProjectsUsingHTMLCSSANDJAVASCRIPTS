let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let moods = {};
let notes = {};
let theme = 'light';

// Function to generate calendar
function generateCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calendar = document.querySelector(".calendar");
    calendar.innerHTML = "";

    // Add day names
    daysInWeek.forEach(day => {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });

    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement("div");
        calendar.appendChild(emptyCell);
    }

    // Get number of days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = i;
        dayElement.classList.add("day");
        dayElement.dataset.date = `${currentYear}-${currentMonth + 1}-${i}`;

        // Add mood class if mood is set for the day
        if (moods[dayElement.dataset.date]) {
            dayElement.classList.add(moods[dayElement.dataset.date]);
        }

        dayElement.addEventListener("click", () => {
            const selectedMood = document.querySelector('input[name="mood"]:checked').value;
            moods[dayElement.dataset.date] = selectedMood;
            dayElement.classList.remove("happy", "sad", "neutral");
            dayElement.classList.add(selectedMood);
            updateMoodStats();
        });

        calendar.appendChild(dayElement);
    }

    // Update month and year
    document.getElementById("month-year").textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Function to update mood statistics
function updateMoodStats() {
    const moodCounts = {};
    Object.values(moods).forEach(mood => {
        if (!moodCounts[mood]) {
            moodCounts[mood] = 0;
        }
        moodCounts[mood]++;
    });

    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
    document.getElementById("most-common-mood").textContent = `Most common mood: ${mostCommonMood}`;

    const moodTrend = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a]);
    document.getElementById("mood-trend").textContent = `Mood trend: ${moodTrend.join(", ")}`;
}

// Function to save note
function saveNote() {
    const noteDate = document.querySelector(".day.active");
    if (noteDate) {
        const note = document.getElementById("mood-note").value;
        notes[noteDate.dataset.date] = note;
        document.getElementById("note-display").textContent = note;
    }
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    if (theme === 'light') {
        document.body.classList.add("dark-theme");
        theme = 'dark';
    } else {
        document.body.classList.remove("dark-theme");
        theme = 'light';
    }
});


// Add event listeners
document.getElementById("prev-month").addEventListener("click", () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    generateCalendar();
});

document.getElementById("save-note").addEventListener("click", saveNote);

// Add event listener for day click
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("day")) {
        const day = e.target;
        day.classList.add("active");
        document.getElementById("mood-note").value = notes[day.dataset.date] || "";
        document.getElementById("note-display").textContent = notes[day.dataset.date] || "";
    }
});

// Add event listeners for social sharing buttons
document.getElementById("share-facebook").addEventListener("click", () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(url, "_blank");
});

document.getElementById("share-twitter").addEventListener("click", () => {
    const url = `https://twitter.com/intent/tweet?url=${window.location.href}`;
    window.open(url, "_blank");
});

document.getElementById("share-linkedin").addEventListener("click", () => {
    const url = `https://www.linkedin.com/sharing/share?url=${window.location.href}`;
    window.open(url, "_blank");
});


// Generate calendar for current month
generateCalendar();

