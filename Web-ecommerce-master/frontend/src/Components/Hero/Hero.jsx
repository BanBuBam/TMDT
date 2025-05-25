// import React from 'react'
// import './Hero.css'
// import hand_icon from '../Assets/hand_icon.png'
// import arrow_icon from '../Assets/arrow.png'
// import hero_image from '../Assets/hero_image.jpg'

// const Hero = () => {
//     return (
//       <div className='hero'>
//         <div className="hero-left">
//             <h2>NEEW ARRIVALS ONLY</h2>
//             <div>
//                 <div className="hero-hand-icon">
//                     <p>new</p>
//                     <img src={hand_icon} alt="" />
//                 </div>
//                 <p>collections</p>
//                 <p>for everyone</p>
//             </div>
//             <div className="hero-latest-btn">
//                 <div>Latest Collection</div>
//                 <img src={arrow_icon} alt="" />
//             </div>
//         </div>
//         <div className="hero-right">
//             <img src={hero_image} alt="" />
//         </div>
//       </div>
//     );
//   }

// export default Hero



// // src/Components/Hero/Hero.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Hero.css';

// const Hero = () => {
//   const [banners, setBanners] = useState([]);
//   const [current, setCurrent] = useState(0);

//   // 1. Lấy tất cả banner loại "hero"
//   useEffect(() => {
//     async function fetchHeroBanners() {
//       try {
//         const res = await axios.get('http://localhost:4000/banners/hero');
//         setBanners(res.data);
//       } catch (err) {
//         console.error('⚠️ Lỗi load hero banner:', err);
//       }
//     }
//     fetchHeroBanners();
//   }, []);

//   // 2. Mỗi 2s chuyển sang banner kế tiếp
//   useEffect(() => {
//     if (banners.length <= 1) return;
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
//     <div className='hero'>
//       <div className="hero-left">
//         <h2>NEEW ARRIVALS ONLY</h2>
//         <div className="hero-hand-icon">
//           <p>new</p>
//           {/* Bạn có thể để icon ở đây */}
//         </div>
//         <p>collections</p>
//         <p>for everyone</p>
//         <div className="hero-latest-btn">
//           <div>Latest Collection</div>
//           {/* Icon arrow */}
//         </div>
//       </div>
//       <div className="hero-right">
//         <img src={imageUrl} alt={`Hero banner ${current + 1}`} />
//       </div>
//     </div>
//   );
// };

// export default Hero;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  // 1) Fetch danh sách banner kiểu "hero"
  useEffect(() => {
    axios.get('http://localhost:4000/banners/hero')
      .then(res => setBanners(res.data))
      .catch(err => {
        console.error('⚠️ Lỗi load hero banners:', err);
        setBanners([]); // đảm bảo banners là mảng
      });
  }, []);

  // 2) Nếu có >1 banner thì chạy carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % banners.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [banners]);

  // Lấy URL hiện tại (nếu có)
  const imageUrl = banners[current]?.imageUrl;

  return (
    <div className='hero'>
      {/* PHẦN STATIC BÊN TRÁI luôn hiển thị */}
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div className="hero-hand-icon">
          <p>new</p>
          {/* đặt icon nếu có */}
        </div>
        <p>collections</p>
        <p>for everyone</p>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          {/* icon mũi tên nếu có */}
        </div>
      </div>

      {/* PHẦN ẢNH BÊN PHẢI */}
      <div className="hero-right">
        {imageUrl
          ? <img src={imageUrl} alt={`Hero banner ${current + 1}`} />
          : null /* hoặc <div className="placeholder"/> nếu bạn muốn hiển thị ô trống */}
      </div>
    </div>
  );
};

export default Hero;
