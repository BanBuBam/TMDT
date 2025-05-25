import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './RelatedProducts.css';

function RelatedProducts({ product }) {
  const { all_product } = useContext(ShopContext);

  if (!product || !all_product.length) return <p>Đang tải dữ liệu...</p>;

  // Lọc sản phẩm cùng category, khác id hiện tại
  const related = all_product.filter(
    (item) => item.category === product.category && item.id !== product.id
  );

  // Hàm shuffle (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const arr = [...array]; // copy mảng để không mutate gốc
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Xáo trộn mảng related rồi lấy 4 sản phẩm đầu (hoặc ít hơn nếu k đủ)
  const relatedRandom = shuffleArray(related).slice(0, 6);

  return (
    <div className="relatedproducts">
      <h2>Sản phẩm liên quan ({product.category})</h2>
      <div className="relatedproducts-container">
        {relatedRandom.map((item) => (
          <div className="relatedproducts-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
