// Get elements
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxDescription = document.getElementById('lightbox-description');
const closeLightbox = document.getElementById('close-lightbox');
const prevImg = document.getElementById('prev-img');
const nextImg = document.getElementById('next-img');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const loadMoreBtn = document.getElementById('load-more-btn');
const searchInput = document.getElementById('search-input');
const loadingSpinner = document.getElementById('loading-spinner');
const currentYearSpan = document.getElementById('current-year');

// Set current year in footer
currentYearSpan.textContent = new Date().getFullYear();

// Image data
let images = [
    { src: 'https://picsum.photos/id/100/400/300', description: 'Morning Fog' },
    { src: 'https://picsum.photos/id/101/400/300', description: 'Forest Path' },
    { src: 'https://picsum.photos/id/102/400/300', description: 'Rocky Coast' },
    { src: 'https://picsum.photos/id/103/400/300', description: 'Mountain Lake' },
    { src: 'https://picsum.photos/id/104/400/300', description: 'Cityscape at Night' },
    { src: 'https://picsum.photos/id/105/400/300', description: 'Desert Sunset' },
    { src: 'https://picsum.photos/id/106/400/300', description: 'Old Town Alley' },
    { src: 'https://picsum.photos/id/107/400/300', description: 'Green Fields' },
    { src: 'https://picsum.photos/id/108/400/300', description: 'Abstract Shapes' },
    { src: 'https://picsum.photos/id/109/400/300', description: 'Flowing River' },
];

let filteredImages = [...images]; // Images currently displayed based on search
let currentIndex = 0;
const imagesPerLoad = 9; // Number of images to load initially and on 'Load More'
let loadedImageCount = 0;

// Function to render images to the gallery
function renderImages(imagesToRender, append = false) {
    if (!append) {
        gallery.innerHTML = '';
        loadedImageCount = 0;
    }

    const start = loadedImageCount;
    const end = Math.min(loadedImageCount + imagesPerLoad, imagesToRender.length);

    for (let i = start; i < end; i++) {
        const image = imagesToRender[i];
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-item', 'col-md-4', 'col-sm-6', 'col-12'); // Responsive grid
        imgContainer.innerHTML = `
            <img src="${image.src}" alt="${image.description}" loading="lazy">
            <div class="image-title">${image.description}</div>
        `;
        imgContainer.addEventListener('click', () => openLightbox(i, imagesToRender));
        gallery.appendChild(imgContainer);
    }
    loadedImageCount = end;

    // Show/hide load more button
    if (loadedImageCount < imagesToRender.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Function to open lightbox
function openLightbox(index, currentSet) {
    lightbox.style.display = 'flex'; // Use flex for centering
    lightboxImg.src = currentSet[index].src;
    lightboxDescription.textContent = currentSet[index].description;
    currentIndex = index;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

// Function to close lightbox
function closeLightboxFunc() {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Function to show previous image
function showPrevImage() {
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    lightboxImg.src = filteredImages[currentIndex].src;
    lightboxDescription.textContent = filteredImages[currentIndex].description;
}

// Function to show next image
function showNextImage() {
    currentIndex = (currentIndex + 1) % filteredImages.length;
    lightboxImg.src = filteredImages[currentIndex].src;
    lightboxDescription.textContent = filteredImages[currentIndex].description;
}

// Function to download image
function downloadImage() {
    const link = document.createElement('a');
    link.href = lightboxImg.src;
    link.download = `image-${filteredImages[currentIndex].description.replace(/\s/g, '-')}.jpg`;
    document.body.appendChild(link); // Append to body to make it clickable in all browsers
    link.click();
    document.body.removeChild(link); // Clean up
}

// Function to share image
function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: 'Image Gallery',
            text: `Check out this image: ${lightboxDescription.textContent}`,
            url: lightboxImg.src,
        }).catch(error => console.error('Error sharing:', error));
    } else {
        alert('Web Share API is not supported in your browser. You can manually copy the image URL.');
        // Fallback: Copy URL to clipboard
        navigator.clipboard.writeText(lightboxImg.src).then(() => {
            alert('Image URL copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
}

// Function to randomize images
function randomizeImages() {
    images.sort(() => Math.random() - 0.5);
    filteredImages = [...images]; // Update filtered images as well
    renderImages(filteredImages);
}

// Function to upload image
function uploadImage() {
    imageUpload.click(); // Trigger the hidden file input click
}

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadstart = () => { loadingSpinner.style.display = 'block'; };
        reader.onloadend = () => { loadingSpinner.style.display = 'none'; };
        reader.onload = (e) => {
            const newImage = {
                src: e.target.result,
                description: file.name.split('.')[0] || 'Uploaded Image',
            };
            images.unshift(newImage); // Add to the beginning
            filteredImages.unshift(newImage);
            renderImages(filteredImages); // Re-render the gallery to show new image at top
            // Reset the file input to allow uploading the same file again
            imageUpload.value = '';
        };
        reader.readAsDataURL(file);
    } else if (file) {
        alert('Please upload a valid image file.');
    }
});

// Function to load more images
function loadMoreImages() {
    loadingSpinner.style.display = 'block';
    // Simulate API call delay
    setTimeout(() => {
        // Generate new random images for demonstration
        const newImages = Array.from({ length: imagesPerLoad }).map((_, i) => ({
            src: `https://picsum.photos/seed/${Date.now() + i}/400/300`, // Unique seed for more variety
            description: `Generated Image ${images.length + i + 1}`,
        }));
        images.push(...newImages);
        // If there's a search term, only add the new images that match the search
        const searchValue = searchInput.value.toLowerCase();
        const newlyFiltered = newImages.filter(image => image.description.toLowerCase().includes(searchValue));
        filteredImages.push(...newlyFiltered);

        renderImages(filteredImages, true); // Append new images
        loadingSpinner.style.display = 'none';
    }, 500); // Simulate network delay
}

// Function to search images
function searchImages() {
    const searchValue = searchInput.value.toLowerCase();
    filteredImages = images.filter(image =>
        image.description.toLowerCase().includes(searchValue)
    );
    renderImages(filteredImages);
}

// Event listeners
closeLightbox.addEventListener('click', closeLightboxFunc);
prevImg.addEventListener('click', showPrevImage);
nextImg.addEventListener('click', showNextImage);
downloadBtn.addEventListener('click', downloadImage);
shareBtn.addEventListener('click', shareImage);
randomizeBtn.addEventListener('click', randomizeImages);
uploadBtn.addEventListener('click', uploadImage);
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('input', searchImages);

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    renderImages(filteredImages);
});

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightboxFunc();
    }
});