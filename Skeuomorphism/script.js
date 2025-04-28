
// Get the audio context
const audioContext = new AudioContext();

// Create an oscillator
const oscillator = audioContext.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 440;

// Create a gain node
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;

// Connect the oscillator to the gain node
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// Start the oscillator
oscillator.start();

// Get the play and pause buttons
const playButton = document.querySelector('.play-button');
const pauseButton = document.querySelector('.pause-button');

// Add event listeners to the play and pause buttons
playButton.addEventListener('click', () => {
    audioContext.resume();
});

pauseButton.addEventListener('click', () => {
    audioContext.suspend();
});

// Get the volume slider
const volumeSlider = document.querySelector('.volume-slider');

// Add an event listener to the volume slider
volumeSlider.addEventListener('input', () => {
    gainNode.gain.value = volumeSlider.value / 100;
    document.querySelector('.volume-level').textContent = `Volume: ${volumeSlider.value}%`;
});

// Get the take photo button
const takePhotoButton = document.querySelector('.take-photo-button');

// Add an event listener to the take photo button
takePhotoButton.addEventListener('click', () => {
    // Get the camera feed
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.querySelector('.camera-feed');
            video.srcObject = stream;
            video.play();

            // Take a photo
            const canvas = document.querySelector('.photo-preview');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the photo data URL
            const photoDataURL = canvas.toDataURL();

            // Add event listeners to the social media sharing buttons
            document.querySelector('.share-facebook-button').addEventListener('click', () => {
                shareOnFacebook(photoDataURL);
            });

            document.querySelector('.share-twitter-button').addEventListener('click', () => {
                shareOnTwitter(photoDataURL);
            });

            document.querySelector('.share-instagram-button').addEventListener('click', () => {
                shareOnInstagram(photoDataURL);
            });
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
});

// Function to share on Facebook
function shareOnFacebook(photoDataURL) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(photoDataURL)}`;
    window.open(facebookUrl, '_blank');
}

// Function to share on Twitter
function shareOnTwitter(photoDataURL) {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(photoDataURL)}`;
    window.open(twitterUrl, '_blank');
}
