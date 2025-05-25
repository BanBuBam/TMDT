// src/Components/CarouselBanner/CarouselBanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CarouselBanner.css';

const CarouselBanner = ({ type, interval = 3000 }) => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:4000/banners/${type}`)
      .then(res => setSlides(res.data.map(b => b.imageUrl)))
      .catch(() => setSlides([]));
  }, [type]);

  useEffect(() => {
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % slides.length);
      }, interval);
      return () => clearInterval(timerRef.current);
    }
  }, [slides, interval]);

  if (!slides.length) return null;

  return (
    <div className="carousel-container">
      {slides.map((url, i) => (
        <div
          key={i}
          className={`carousel-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
      <button className="carousel-prev" onClick={() => {
        clearInterval(timerRef.current);
        setCurrent(c => (c - 1 + slides.length) % slides.length);
      }}>‹</button>
      <button className="carousel-next" onClick={() => {
        clearInterval(timerRef.current);
        setCurrent(c => (c + 1) % slides.length);
      }}>›</button>
    </div>
  );
};

export default CarouselBanner;
