// import React from 'react'
// import './Offers.css'
// import exclusive_image from '../Assets/motopage1-removebg-preview.png'

// const Offers = () => {
//     return (
//       <div className='offers'>
//         <div className="offers-left">
//             <h1>Exlusive</h1>
//             <h1>Offer For You</h1>
//             <p>ONLY ON BEST SELLERS PRODUCTS</p>
//             <button>Check Now</button>
//         </div>
//         <div className='offer-right'>
//             <img src={exclusive_image} alt="" />
//         </div>
//       </div>
//     );
//   }

// export default Offers


// // src/Components/Offers/Offers.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Offers.css';

// const Offers = () => {
//   const [banners, setBanners] = useState([]);
//   const [current, setCurrent] = useState(0);

//   // 1. Fetch tất cả banner kiểu "offer"
//   useEffect(() => {
//     async function fetchOffers() {
//       try {
//         const res = await axios.get('http://localhost:4000/banners/offers');
//         setBanners(res.data);
//       } catch (err) {
//         console.error('⚠️ Lỗi load offer banner:', err);
//       }
//     }
//     fetchOffers();
//   }, []);

//   // 2. Mỗi 2s chuyển ảnh
//   useEffect(() => {
//     if (banners.length <= 1) return; // nếu chỉ 0 hoặc 1 ảnh thì thôi
//     const timer = setInterval(() => {
//       setCurrent(prev => (prev + 1) % banners.length);
//     }, 2000);
//     return () => clearInterval(timer);
//   }, [banners]);

//   if (banners.length === 0) {
//     return null; // hoặc show placeholder
//   }

//   const { imageUrl } = banners[current];

//   return (
//     <div className='offers'>
//       <div className="offers-left">
//         <h1>Exclusive</h1>
//         <h1>Offer For You</h1>
//         <p>ONLY ON BEST SELLERS PRODUCTS</p>
//         <button>Check Now</button>
//       </div>
//       <div className='offers-right'>
//         <img src={imageUrl} alt={`Offer ${current + 1}`} />
//       </div>
//     </div>
//   );
// };

// export default Offers;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Offers.css';

const Offers = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  // 1) Fetch danh sách banner kiểu "offer"
  useEffect(() => {
    axios.get('http://localhost:4000/banners/offer')
      .then(res => setBanners(res.data))
      .catch(err => {
        console.error('⚠️ Lỗi load offer banners:', err);
        setBanners([]);
      });
  }, []);

  // 2) Nếu có >1 thì chạy carousel mỗi 3s
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % banners.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [banners]);

  const imageUrl = banners[current]?.imageUrl;

  return (
    <div className='offers'>
      {/* PHẦN STATIC */}
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offer For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button>Check Now</button>
      </div>

      {/* PHẦN ẢNH CÓ THỂ LÀ carousel hoặc ẩn */}
      <div className='offers-right'>
        {imageUrl
          ? <img src={imageUrl} alt={`Offer ${current + 1}`} />
          : null}
      </div>
    </div>
  );
};

export default Offers;
