
$(document).ready(function() {
    const stepper = new Stepper($('#stepper')[0], {
        linear: false
    });

    // Initialize intl-tel-input
    const phoneInput = document.getElementById('phone');
    const iti = window.intlTelInput(phoneInput, {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.13/build/js/utils.min.js"
    });

    // Initialize FilePond
    const pond = FilePond.create(document.getElementById('file'), {
        allowMultiple: true
    });

    // Initialize progress bar
    const progressBar = $('.progress-bar');
    stepper.on('change', function(e) {
        const currentStep = e.detail.index;
        const totalSteps = stepper._steps.length;
        const progress = (currentStep / totalSteps) * 100;
        progressBar.find('.progress').css('width', progress + '%');
    });

    // Handle rating
    $('.rating .fa-star').on('click', function() {
        const rating = $(this).data('rating');
        $('.rating .fa-star').removeClass('selected');
        for (let i = 0; i < rating; i++) {
            $('.rating .fa-star:eq(' + i + ')').addClass('selected');
        }
    });

    // Handle form submission
    $('#stepper').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', $('#name').val());
        formData.append('email', $('#email').val());
        formData.append('phone', iti.getNumber());
        formData.append('feedback', $('#feedback').val());
        const files = pond.getFiles();
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i].file);
        }

        // Show loading animation
        $('#loading-animation').addClass('show');

        // Submit form data using Fetch API
        fetch('/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Hide loading animation
            $('#loading-animation').removeClass('show');
            // Show success message
            alert('Feedback submitted successfully!');
        })
        .catch(error => {
            console.error(error);
            // Hide loading animation
            $('#loading-animation').removeClass('show');
            // Show error message
            alert('Error submitting feedback!');
        });
    });
});