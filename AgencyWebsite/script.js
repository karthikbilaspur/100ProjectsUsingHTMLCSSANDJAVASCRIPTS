
// Testimonials array
var testimonials = [
    {quote: '"(2)Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco"', author: "- Author Two"},
    {quote: '"(3)Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco"', author: "- Author Three" },
    {quote: '"(4)Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco"', author: "- Author Four" }
  ];
  
  // Smooth scrolling
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (e.button === 0) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId !== '#') {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.error(`Target section not found: ${targetId}`);
          }
        }
      }
    });
  });
  
  // Button animations
  const buttons = document.querySelectorAll('.button1, .button2');
  buttons.forEach((button) => {
    button.addEventListener('mouseover', () => {
      button.style.transform = 'scale(1.1)';
      button.style.transition = 'transform 0.3s ease-in-out';
    });
    button.addEventListener('mouseout', () => {
      button.style.transform = 'scale(1)';
      button.style.transition = 'transform 0.3s ease-in-out';
    });
  });
  
  // Overlay animation
  const overlay = document.querySelector('.overlay');
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    overlay.style.opacity = `${1 - (scrollPosition / 1000)}`;
  });
  
  // Navigation bar animation
  const navBar = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
      navBar.style.backgroundColor = '#22252c';
      navBar.style.opacity = '1';
    } else {
      navBar.style.backgroundColor = '';
      navBar.style.opacity = '0.8';
    }
  });
  
  // jQuery code
  $(document).ready(function() {
    //Simple nav bar scroll animation.
    $(window).scroll(function() {
      var y_scroll_pos = window.pageYOffset;
      var scroll_pos_test = 50;
      if (y_scroll_pos > scroll_pos_test) {
        $('nav').stop().animate({height: "60px", opacity: "1"}, 400);
        $('nav ul').stop().animate({padding: "9px"}, 400);
        $('nav ul li').stop().animate({padding: "20px"}, 400);
      }
      else {
        $('nav').stop().animate({height: "40px", opacity: ".8"}, 400);
        $('nav ul').stop().animate({padding: "0px"}, 400);
        $('nav ul li').stop().animate({padding: "0px"}, 400);
      }
    });
    //Arrow fade animation in Testimonials.
    $('.testimonials').hover(function() {
      $(".arrows").stop().fadeIn("slow");
    }, function() {
      $(".arrows").stop().fadeOut("fast");
    });
    
    //Testimonial quotes fade in when fa-arrow-right div is clicked.
    $('.fa-arrow-right').click(function() {
      var randomQuote = testimonials[Math.floor(Math.random() * testimonials.length)];
      $('.quotes').hide().html(randomQuote.quote).fadeIn(2000);
      $('.author').hide().html(randomQuote.author).fadeIn(2000);
    });
    //Testimonial quotes fade in when fa-arrow-left div is clicked.
    $('.fa-arrow-left').click(function() {
      var randomQuote = testimonials[Math.floor(Math.random() * testimonials.length)];
      $('.quotes').hide().html(randomQuote.quote).fadeIn(2000);
      $('.author').hide().html(randomQuote.author).fadeIn(2000);
    });
    
    //Testimonials fade in when dots are clicked.
    $('#dotsTwo').click(function() {
      $('.quotes').hide().html(testimonials[0].quote).fadeIn(2000);
      $('.author').hide().html(testimonials[0].author).fadeIn(2000);
    });
    
    $('#dotsThree').click(function() {
      $('.quotes').hide().html(testimonials[1].quote).fadeIn(2000);
      $('.author').hide().html(testimonials[1].author).fadeIn(2000);
    });
    
    $('#dotsFour').click(function() {
      $('.quotes').hide().html(testimonials[2].quote).fadeIn(2000);
      $('.author').hide().html(testimonials[2].author).fadeIn(2000);
    }); 
  });