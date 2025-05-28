import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Project from './Project';

function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/projects', { title, description, goal }, { headers: { Authorization: token } })
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  };

  const handleDonate = async (projectId) => {
    const token = localStorage.getItem('token');
    axios.post(`http://localhost:3000/donate/${projectId}`, { amount }, { headers: { Authorization: token } })
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>GreenFunder</h1>
      <form onSubmit={handleCreateProject}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" />
        <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Project goal" />
        <button type="submit">Create project</button>
      </form>
      <ul>
        {projects.map(project => (
          <li key={project._id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p>Goal: {project.goal}</p>
            <p>Raised: {project.raised}</p>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Donation amount" />
            <button onClick={() => handleDonate(project._id)}>Donate</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;