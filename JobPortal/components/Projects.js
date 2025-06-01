import React from 'react';

function Projects() {
  const projects = [
    {
      title: 'Project Title',
      description: 'Project Description',
    },
    {
      title: 'Project Title',
      description: 'Project Description',
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <h2>Projects</h2>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;