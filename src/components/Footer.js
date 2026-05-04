import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <img src={logo} alt="Charity Connect Logo" className="footer-logo" />
          <h2 className="footer-site-name">Charity Connect</h2>
        </div>

        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/donate">Donate</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Charity Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
