import React, { useState, useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './CheckOutPage.css'; // We'll add some CSS separately

const CheckOutPage = () => {
  const { getTotalCartAmount } = useContext(ShopContext);
  
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'momo',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!buyerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!buyerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,11}$/.test(buyerInfo.phone)) {
      newErrors.phone = 'Phone number must be 10-11 digits';
    }
    if (!buyerInfo.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when user types
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:4000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotalCartAmount(),
          buyer: buyerInfo,
        }),
      });

      const data = await response.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert('Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const totalAmount = getTotalCartAmount();

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-form">
        <div className="checkout-form-group">
          <label>Recipient Name:</label>
          <input
            type="text"
            name="name"
            value={buyerInfo.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="checkout-form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={buyerInfo.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="checkout-form-group">
          <label>Delivery Address:</label>
          <textarea
            name="address"
            value={buyerInfo.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            rows="3"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        <div className="checkout-form-group">
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={buyerInfo.paymentMethod}
            onChange={handleChange}
          >
            <option value="momo">MoMo</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank">Bank Card</option>
          </select>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="total-amount">
            <span>Total:</span>
            <span>{totalAmount.toLocaleString()} VND</span>
          </div>
        </div>

        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={!totalAmount}
        >
          COMPLETE CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CheckOutPage;