import React from 'react';

function About() {
  return (
    <section id="about" className="about-section">
      <h2>About Me</h2>
      <div className="about-content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.</p>
        <img src="profile.jpg" alt="Profile Picture" className="profile-picture" />
      </div>
    </section>
  );
}

export default About;