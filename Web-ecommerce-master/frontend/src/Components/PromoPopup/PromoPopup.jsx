// src/Components/Popup/PromoPopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PromoPopup.css';

const PromoPopup = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/popups')
      .then(res => setList(res.data))
      .catch(() => setList([]));
  }, []);

  const handleClose = (id) => {
    // 1) Ẩn popup này
    setList(list.filter(p => p._id !== id));

    // 2) Mở tab mới về trang category (ví dụ: bike)
    window.open('/xedap', '_blank');
  };

  return (
    <>
      {list.map(p => (
        <div
          key={p._id}
          className={`promo-modal promo-${p.position}`}
        >
          <div className={`promo-content animate__animated ${p.effect}`}>
            {/* Nút đóng */}
            <button
              className="promo-close"
              onClick={() => handleClose(p._id)}
              aria-label="Đóng popup và đi tới category"
            >
              &times;
            </button>
            {/* Ảnh popup */}
            <img src={p.imageUrl} alt="" className="promo-img" />
          </div>
        </div>
      ))}
    </>
  );
};

export default PromoPopup;
