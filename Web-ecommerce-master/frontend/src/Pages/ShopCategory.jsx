import React, { useContext, useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import PromoPopup from '../Components/PromoPopup/PromoPopup';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [sortOrder, setSortOrder] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let products = all_product.filter(item => item.category === props.category);
    
    if (sortOrder === 'asc') {
      products.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOrder === 'desc') {
      products.sort((a, b) => b.new_price - a.new_price);
    }

    setFilteredProducts(products);
  }, [sortOrder, all_product, props.category]);

  return (
    <div className='shop-category'>
      <PromoPopup/>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          <label htmlFor="sort">Sort by price: </label>
          <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => (
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

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;
