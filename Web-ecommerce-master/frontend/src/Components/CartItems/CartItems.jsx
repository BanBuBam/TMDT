import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart, removeItemCompletely } = useContext(ShopContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  // Kiểm tra xem tất cả items có được chọn không
  const isAllSelected = Object.keys(cartItems).length > 0 && 
    Object.keys(cartItems).every(id => cartItems[id] > 0 && selectedItems[id]);

  // Hàm xử lý khi click vào checkbox từng item
  const handleCheckboxChange = (productId) => {
    setSelectedItems(prev => {
      const newSelected = {
        ...prev,
        [productId]: !prev[productId]
      };
      // Tự động bỏ chọn selectAll nếu có bất kỳ item nào bị bỏ chọn
      if (selectAll && !newSelected[productId]) {
        setSelectAll(false);
      }
      return newSelected;
    });
  };

  // Hàm xử lý khi click vào checkbox "Select All"
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newSelectedItems = {};
    if (newSelectAll) {
      // Chọn tất cả items
      Object.keys(cartItems).forEach(id => {
        if (cartItems[id] > 0) {
          newSelectedItems[id] = true;
        }
      });
    }
    setSelectedItems(newSelectedItems);
  };

  // Add new function to calculate selected items total
  const getSelectedItemsTotal = () => {
    let totalAmount = 0;
    if (!all_product.length) return totalAmount;

    Object.keys(selectedItems).forEach(itemId => {
      if (selectedItems[itemId] && cartItems[itemId] > 0) {
        const item = all_product.find(product => product.id === Number(itemId));
        if (item) {
          totalAmount += item.new_price * cartItems[itemId];
        }
      }
    });
    return totalAmount;
  };

  const handlePromoCodeSubmit = () => {
    if (promoCode === '12345') {
      setDiscount(getSelectedItemsTotal() * 0.5); // Update to use selected items total
    } else {
      setDiscount(0);
    }
  };

  const cartTotal = getSelectedItemsTotal() - discount; // Update to use selected items total

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, 1); // Chỉ giảm 1, không xóa hoàn toàn
    } else {
      addToCart(productId, newQuantity - cartItems[productId]); // Thêm sự khác biệt
    }
  };

  return (
    <div className='cartitems'>
      <div className='cartitems-format-main'>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAll}
          className="cart-checkbox"
        />
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className='cartitems-format cartitems-format-main'>
                <input
                  type="checkbox"
                  checked={!!selectedItems[e.id]}
                  onChange={() => handleCheckboxChange(e.id)}
                  className="cart-checkbox"
                />
                <img src={e.image} alt='' className='carticon-product-icon' />
                <p>{e.name}</p>
                <p>{e.new_price}Đ</p>
                <div className='cartitems-quantity-control'>
                  <button 
                    onClick={() => handleQuantityChange(e.id, cartItems[e.id] - 1)}
                    disabled={cartItems[e.id] <= 1}
                  >
                    -
                  </button>
                  <span className='cartitems-quantity'>{cartItems[e.id]}</span>
                  <button 
                    onClick={() => handleQuantityChange(e.id, cartItems[e.id] + 1)}
                  >
                    +
                  </button>
                </div>
                <p>{e.new_price * cartItems[e.id]}Đ</p>
                <img
                  className='cartitems-remove-icon'
                  src={remove_icon}
                  onClick={() => removeItemCompletely(e.id)} // Sử dụng hàm xóa hoàn toàn
                  alt='Remove item'
                />
              </div>
            </div>
          );
        }
        return null;
      })}
      <div className='cartitems-down'>
        <div className='cartitems-total'>
          <h1>Cart Total</h1>
          <div>
            <div className='cartitems-total-item'>
              <p>Subtotal</p>
              <p>{getSelectedItemsTotal()}Đ</p>
            </div>
            <hr />
            <div className='cartitems-total-item'>
              <h3>Discount</h3>
              <h3>{discount}Đ</h3>
            </div>
            <hr />
            <div className='cartitems-total-item'>
              <h3>Total</h3>
              <h3>{cartTotal}Đ</h3>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            disabled={getSelectedItemsTotal() === 0} // Disable if no items selected
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className='cartitems-promocode'>
          <p>If you have a promo code, enter it here</p>
          <div className='cartitems-promobox'>
            <input 
              type='text' 
              placeholder='Promo code' 
              value={promoCode} 
              onChange={(e) => setPromoCode(e.target.value)} 
            />
            <button onClick={handlePromoCodeSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;