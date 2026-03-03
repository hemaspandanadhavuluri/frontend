import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/logo2.png" alt="Just Tap Capital Logo" className="logo-img" />
          <span className="web-logo-text">Just Tap <span style={{color:'#ee8926'}}>Capital</span></span>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li className="dropdown">
            <span className="dropdown-trigger">Study Abroad</span>
            <ul className="dropdown-menu">
              <li><Link to="/study-abroad/usa">USA</Link></li>
              <li><Link to="/study-abroad/uk">UK</Link></li>
              <li><Link to="/study-abroad/canada">Canada</Link></li>
            </ul>
          </li>
          <li><Link to="/scholarship">Scholarship</Link></li>
          <li className="dropdown">
            <span className="dropdown-trigger">Exams</span>
            <ul className="dropdown-menu">
              <li><Link to="/exams/ielts">IELTS</Link></li>
              <li><Link to="/exams/toefl">TOEFL</Link></li>
              <li><Link to="/exams/gre">GRE</Link></li>
              <li><Link to="/exams/gmat">GMAT</Link></li>
              <li><Link to="/exams/pte">PTE</Link></li>
              <li><Link to="/exams/sat">SAT</Link></li>
            </ul>
          </li>
          {/* <li><Link to="/careers">Careers</Link></li> */}
          <li><a href="#contact" className="cta-button">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
