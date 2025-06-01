import React from 'react';

function Education() {
  const education = [
    {
      degree: 'Degree',
      university: 'University Name',
      duration: 'Duration',
    },
    {
      degree: 'Degree',
      university: 'University Name',
      duration: 'Duration',
    },
  ];

  return (
    <section id="education" className="education-section">
      <h2>Education</h2>
      <ul>
        {education.map((edu, index) => (
          <li key={index}>
            <h3>{edu.degree}</h3>
            <p>{edu.university}</p>
            <p>{edu.duration}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Education;