// Company.js
import React from 'react';
import './Company.css';

const Company = () => {
  return (
    <div className="company-container">
      <h1>Our Company</h1>
      <div className="company-content">
        <p>RideOn is a leading car dealership dedicated to providing quality vehicles and exceptional customer service.</p>
        <div className="company-details">
          <h2>Our Mission</h2>
          <p>To make car buying a seamless and enjoyable experience for everyone.</p>
          <h2>Our History</h2>
          <p>Founded in 2010, we've grown to become a trusted name in the automotive industry.</p>
          <h2>Our Values</h2>
          <ul>
            <li>Customer Satisfaction</li>
            <li>Quality Vehicles</li>
            <li>Transparent Pricing</li>
            <li>Professional Service</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Company;