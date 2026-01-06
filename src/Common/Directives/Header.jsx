import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo/Urban RWA Token/Urban RWA Token logo 3.png';
import '../Styles/Header.css';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header id="header" className="header">
      {/* LOGO */}
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" />
        </NavLink>
      </div>

      {/* NAV MENU */}
      <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul onClick={() => setIsMobileMenuOpen(false)}>
          <li><NavLink to="/?=invest">Invest</NavLink></li>
          <li><NavLink to="/user/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/?=opportunities">Opportunities</NavLink></li>
        </ul>
      </nav>

      {/* AUTH BUTTONS */}
      <div className="auth-btns">
        <a href="/user/login" className="buy-token-btn">
          Login
        </a>

        <a href="/user/signup" className="signup-btn">
          Sign Up
        </a>
      </div>

      {/* MOBILE TOGGLE */}
      <div
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="hamburger-icon"></span>
      </div>
    </header>
  );
}

export default Navbar;


