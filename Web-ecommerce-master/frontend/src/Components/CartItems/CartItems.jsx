import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { 
    all_product, 
    cartItems, 
    removeFromCart, 
    addToCart, 
    removeItemCompletely,
    setSelectedItems,
    discount,
    setDiscount,
    setCartTotal
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [selectedItems, setSelectedItemsState] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  // Kiểm tra xem tất cả items có được chọn không
  const isAllSelected = Object.keys(cartItems).length > 0 && 
    Object.keys(cartItems).every(id => cartItems[id] > 0 && selectedItems[id]);

  // Hàm xử lý khi click vào checkbox từng item
  const handleCheckboxChange = (productId) => {
    setSelectedItemsState(prev => {
      const newSelected = {
        ...prev,
        [productId]: !prev[productId]
      };
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
      Object.keys(cartItems).forEach(id => {
        if (cartItems[id] > 0) {
          newSelectedItems[id] = true;
        }
      });
    }
    setSelectedItemsState(newSelectedItems);
  };

  // Tính tổng tiền các sản phẩm đã chọn
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
    const newDiscount = promoCode === '12345' ? getSelectedItemsTotal() * 0.5 : 0;
    setDiscount(newDiscount);
  };

  const cartTotal = getSelectedItemsTotal() - discount;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, 1);
    } else {
      addToCart(productId, newQuantity - cartItems[productId]);
    }
  };

  // Hàm tạo đơn hàng và chuyển sang trang checkout
  const handleProceedToCheckout = async () => {
    // Lấy danh sách sản phẩm đã chọn
    const items = Object.keys(selectedItems)
      .filter(id => selectedItems[id] && cartItems[id] > 0)
      .map(id => ({
        productId: Number(id),
        quantity: cartItems[id]
      }));
    

    if (items.length === 0) return alert('Please select items to checkout!');
    const total = getSelectedItemsTotal() - discount;
    const token = localStorage.getItem('auth-token');

    // Gửi API tạo đơn hàng
    const res = await fetch('http://localhost:4000/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ items, total })
    });
    const data = await res.json();
    console.log('API response:', data);

    if (data.success && data.order && data.order._id) {
      // Chuyển sang trang checkout với orderId vừa tạo
      navigate(`/checkout?orderId=${data.order._id}`);
    } else {
      alert('Failed to create order');
    }
  };

  // Đồng bộ selectedItems với context (nếu cần dùng ở nơi khác)
  useEffect(() => {
    setSelectedItems(selectedItems);
    const total = getSelectedItemsTotal() - discount;
    setCartTotal(total);
  }, [selectedItems, discount, setSelectedItems, setCartTotal]);

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
                  onClick={() => removeItemCompletely(e.id)}
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
            onClick={handleProceedToCheckout}
            disabled={getSelectedItemsTotal() === 0}
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