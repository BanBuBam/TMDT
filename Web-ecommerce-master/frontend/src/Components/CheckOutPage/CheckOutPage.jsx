import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './CheckOutPage.css'; // We'll add some CSS separately

const CheckOutPage = () => {
  const { cartTotal, discount } = useContext(ShopContext);
  
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'momo',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        const response = await fetch('http://localhost:4000/userinfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });

        const data = await response.json();
        if (data.success) {
          setBuyerInfo(prev => ({
            ...prev,
            name: data.user.fullName,
            phone: data.user.phone,
            address: data.user.address
          }));
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

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
    if (!cartTotal || cartTotal <= 0) {
      alert('Please select items to checkout');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal, // Use cartTotal instead of getTotalCartAmount
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
            <span>Total Amount:</span>
            <span>{cartTotal.toLocaleString()} VND</span>
          </div>
        </div>

        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={!cartTotal}
        >
          COMPLETE CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CheckOutPage;