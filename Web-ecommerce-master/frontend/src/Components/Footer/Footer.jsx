
import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom';
import footer_logo from "../Assets/logo22.png"
import instagram_icon from "../Assets/instagram_icon.png"
import printester_icon from "../Assets/pintester_icon.png"
import whatsapp_icon from "../Assets/whatsapp_icon.png"

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="RideOn Logo" />
        <p>RideOn</p>
      </div>
      <ul className="footer-links">
        <li><Link to="/company">Company</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/offices">Offices</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagram_icon} alt="Instagram" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
            <img src={printester_icon} alt="Pinterest" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
            <img src={whatsapp_icon} alt="WhatsApp" />
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;