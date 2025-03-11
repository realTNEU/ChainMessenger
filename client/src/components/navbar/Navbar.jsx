import React from 'react';
import { NavLink } from 'react-router-dom';
import "./Navbar.css";
import brandlogo from './brandlogo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="logo">
          <img src={brandlogo} alt="BlockChat Logo" className="logos" />
          {/* <div className="logo-icon">CM</div> */}
          {/* <div className="logo-text">BlockChat</div> */}
        </div>
      </div>

      <div className="navbar-links">
        <NavLink to="/" exact activeClassName="active">Home</NavLink>
        <NavLink to="/about" activeClassName="active">About</NavLink>
        <NavLink to="/IpTracker" activeClassName="active">Chat</NavLink>
        <NavLink to="/legal" activeClassName="active">Legal</NavLink>
        <NavLink to="/contact" activeClassName="active">Contact</NavLink>
      </div>
      <div className="navbar-actions">
        <button className="btn-download">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;

function showSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'flex';
}
