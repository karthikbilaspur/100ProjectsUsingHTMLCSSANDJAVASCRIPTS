import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header id="header" className="header">
      <nav>
        <ul>
          <li>
            <NavLink to="/" activeClassName="active" exact>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/experience" activeClassName="active">
              Experience
            </NavLink>
          </li>
          <li>
            <NavLink to="/education" activeClassName="active">
              Education
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" activeClassName="active">
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/skills" activeClassName="active">
              Skills
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeClassName="active">
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;