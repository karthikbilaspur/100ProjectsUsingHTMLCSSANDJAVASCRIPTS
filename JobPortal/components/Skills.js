import React from 'react';

function Skills() {
  const skills = [
    {
      name: 'Skill Name',
      description: 'Skill Description',
    },
    {
      name: 'Skill Name',
      description: 'Skill Description',
    },
  ];

  return (
    <section id="skills" className="skills-section">
      <h2>Skills</h2>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;