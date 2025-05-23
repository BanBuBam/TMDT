import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item.jsx';
import data_product from '../Assets/data'; // Import dữ liệu từ file local

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    // Gán dữ liệu local thay vì gọi API
    setPopularProducts(data_product);
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR</h1>
      <hr />
      <div className='popular-item'>
        {popularProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
