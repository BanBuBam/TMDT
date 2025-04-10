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

  const handlePromoCodeSubmit = () => {
    if (promoCode === '12345') {
      setDiscount(getTotalCartAmount() * 0.5);
    } else {
      setDiscount(0);
    }
  };

  const cartTotal = getTotalCartAmount() - discount;

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
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.length > 0 &&
        all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            return (
              <div key={e.id}>
                <div className='cartitems-format cartitems-format-main'>
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
              <p>{getTotalCartAmount()}Đ</p>
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
          <button onClick={() => navigate('/checkout')}>PROCEED TO CHECKOUT</button>
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