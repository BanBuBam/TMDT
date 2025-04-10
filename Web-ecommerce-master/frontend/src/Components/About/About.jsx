// About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <div className="about-content">
        <p>Welcome to RideOn, your trusted partner in finding the perfect vehicle.</p>
        <div className="about-details">
          <h2>Who We Are</h2>
          <p>We are a team of car enthusiasts dedicated to helping you find your dream car.</p>
          <h2>Our Team</h2>
          <p>Experienced professionals with extensive knowledge of the automotive industry.</p>
          <h2>Why Choose Us</h2>
          <ul>
            <li>Wide selection of vehicles</li>
            <li>Competitive pricing</li>
            <li>Excellent customer support</li>
            <li>Flexible financing options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;