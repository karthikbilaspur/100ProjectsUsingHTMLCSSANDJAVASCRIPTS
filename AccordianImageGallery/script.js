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

// Image data
let images = [
    { src: 'https://picsum.photos/200/150', description: 'Image 1' },
    { src: 'https://picsum.photos/200/151', description: 'Image 2' },
    { src: 'https://picsum.photos/200/152', description: 'Image 3' },
    // Add more images here...
];

let currentIndex = 0;

// Function to open lightbox
function openLightbox(index) {
    lightbox.style.display = 'block';
    lightboxImg.src = images[index].src;
    lightboxDescription.textContent = images[index].description;
    currentIndex = index;
}

// Function to close lightbox
function closeLightboxFunc() {
    lightbox.style.display = 'none';
}

// Function to show previous image
function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxDescription.textContent = images[currentIndex].description;
}

// Function to show next image
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxDescription.textContent = images[currentIndex].description;
}

// Function to download image
function downloadImage() {
    const link = document.createElement('a');
    link.href = lightboxImg.src;
    link.download = `image-${currentIndex}.jpg`;
    link.click();
}

// Function to share image
function shareImage() {
    navigator.share({
        title: 'Image Gallery',
        text: `Check out this image: ${lightboxImg.src}`,
        url: lightboxImg.src,
    });
}

// Function to randomize images
function randomizeImages() {
    images.sort(() => Math.random() - 0.5);
    gallery.innerHTML = '';
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.description;
        img.addEventListener('click', () => openLightbox(index));
        gallery.appendChild(img);
    });
}

// Function to upload image
function uploadImage() {
    const file = imageUpload.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const newImage = {
            src: reader.result,
            description: file.name,
        };
        images.push(newImage);
        const img = document.createElement('img');
        img.src = newImage.src;
        img.alt = newImage.description;
        img.addEventListener('click', () => openLightbox(images.length - 1));
        gallery.appendChild(img);
    };
    reader.readAsDataURL(file);
}

// Function to load more images
function loadMoreImages() {
    for (let i = 0; i < 6; i++) {
        const newImage = {
            src: `https://picsum.photos/200/150?random=${images.length}`,
            description: `Image ${images.length}`,
        };
        images.push(newImage);
        const img = document.createElement('img');
        img.src = newImage.src;
        img.alt = newImage.description;
        img.addEventListener('click', () => openLightbox(images.length - 1));
        gallery.appendChild(img);
    }
}

// Function to search images
function searchImages() {
    const searchValue = searchInput.value.toLowerCase();
    gallery.innerHTML = '';
    images.forEach((image, index) => {
        if (image.description.toLowerCase().includes(searchValue)) {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.description;
            img.addEventListener('click', () => openLightbox(index));
            gallery.appendChild(img);
        }
    });
}


// Event listeners
gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const index = Array.prototype.indexOf.call(gallery.children, e.target);
        openLightbox(index);
    }
});

closeLightbox.addEventListener('click', closeLightboxFunc);

prevImg.addEventListener('click', showPrevImage);

nextImg.addEventListener('click', showNextImage);

downloadBtn.addEventListener('click', downloadImage);

shareBtn.addEventListener('click', shareImage);

randomizeBtn.addEventListener('click', randomizeImages);

uploadBtn.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', uploadImage);

loadMoreBtn.addEventListener('click', loadMoreImages);

searchInput.addEventListener('input', searchImages);

// Initialize gallery
images.forEach((image, index) => {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.description;
    img.addEventListener('click', () => openLightbox(index));
    gallery.appendChild(img);
});