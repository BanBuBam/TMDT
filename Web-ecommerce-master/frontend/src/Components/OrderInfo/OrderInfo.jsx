import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import './OrderInfo.css';

const TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending Payment' },
  { key: 'shipping', label: 'Shipping' }
];

const OrderInfo = () => {
  const { all_product } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState({
    all: [],
    pending: [],
    shipping: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:4000/orders', {
        headers: {
          'auth-token': token
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders({
          all: data.allOrders,
          pending: data.pendingOrders,
          shipping: data.shippingOrders
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:4000/orders/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ orderId })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleProceedToCheckout = (orderId) => {
    navigate(`/checkout?orderId=${orderId}`);
  };

  const renderOrderItems = (order) => {
    return order.items.map(item => {
      const product = all_product.find(p => p.id === item.productId);
      if (!product) return null;
      return (
        <div key={item.productId} className="order-item">
          <img src={product.image} alt={product.name} className="order-item-image" />
          <div className="order-item-details">
            <p>{product.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {product.new_price}Đ</p>
            <p>Total: {product.new_price * item.quantity}Đ</p>
          </div>
        </div>
      );
    });
  };

  const renderOrders = (orderList, type) => {
    return orderList.map(order => (
      <div key={order._id} className="order-card">
        <h3>Order #{order._id}</h3>
        <div className="order-items">{renderOrderItems(order)}</div>
        <div className="order-footer">
          <p>Total: {order.total}Đ</p>
          {type === 'shipping' && (
            <>
              <p>
                Status: {order.shippingStatus === 'waiting' ? 'Chờ vận chuyển' : 'Đã chuyển hàng'}
              </p>
              {order.shippingStatus === 'waiting' && order.status !== 'canceled' && (
                <button onClick={() => handleCancelOrder(order._id)}>
                  Cancel Order
                </button>
              )}
            </>
          )}
          {type === 'pending' && order.status !== 'canceled' && (
            <div className="order-actions">
              <button onClick={() => handleProceedToCheckout(order._id)}>
                Proceed to Checkout
              </button>
              <button onClick={() => handleCancelOrder(order._id)}>
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  // Lấy danh sách đơn hàng theo tab đang chọn
  const getCurrentOrderList = () => {
    if (activeTab === 'all') return orders.all;
    if (activeTab === 'pending') return orders.pending;
    if (activeTab === 'shipping') return orders.shipping;
    return [];
  };

  return (
    <div className="order-info">
      <h2>My Orders</h2>
      <div className="order-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`order-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="order-section">
        {loading ? (
          <p>Loading...</p>
        ) : getCurrentOrderList().length > 0 ? (
          renderOrders(getCurrentOrderList(), activeTab)
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderInfo;