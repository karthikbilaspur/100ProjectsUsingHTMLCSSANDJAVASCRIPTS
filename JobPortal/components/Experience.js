import React from 'react';

function Experience() {
  const experiences = [
    {
      jobTitle: 'Job Title',
      companyName: 'Company Name',
      duration: 'Duration',
      jobDescription: 'Job Description',
    },
    {
      jobTitle: 'Job Title',
      companyName: 'Company Name',
      duration: 'Duration',
      jobDescription: 'Job Description',
    },
  ];

  return (
    <section id="experience" className="experience-section">
      <h2>Experience</h2>
      <ul>
        {experiences.map((exp, index) => (
          <li key={index}>
            <h3>{exp.jobTitle}</h3>
            <p>{exp.companyName}</p>
            <p>{exp.duration}</p>
            <p>{exp.jobDescription}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Experience;