// Offices.js
import React from 'react';
import './Offices.css';

const Offices = () => {
  return (
    <div className="offices-container">
      <h1>Our Offices</h1>
      <div className="offices-content">
        <div className="office-location">
          <h2>Headquarters</h2>
          <p>123 Auto Street, Car City, CA 90001</p>
          <p>Phone: (555) 123-4567</p>
          <p>Hours: Mon-Fri 9AM-6PM</p>
        </div>
        <div className="office-location">
          <h2>Branch Office</h2>
          <p>456 Drive Avenue, Motor Town, TX 75001</p>
          <p>Phone: (555) 234-5678</p>
          <p>Hours: Mon-Sat 10AM-7PM</p>
        </div>
      </div>
    </div>
  );
};

export default Offices;