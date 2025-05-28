import React, { useEffect, useState } from 'react';
import './AdminOrder.css';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:4000/orders/all');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      const res = await fetch('http://localhost:4000/orders/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert('Failed to update shipping status');
      }
    } catch (error) {
      alert('Error updating shipping status');
      console.error(error);
    }
  };

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">Admin - Orders Shipping Management</h2>
      {loading ? (
        <p className="admin-orders-loading">Loading...</p>
      ) : (
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Shipping Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-orders-empty">No orders found</td>
              </tr>
            )}
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId?.name || 'Unknown User'}</td>  {/* Thay đổi ở đây */}
                <td>{order.total}Đ</td>
                <td>{order.status}</td>
                <td>{order.shippingStatus || 'N/A'}</td>
                <td>
                  {order.status === 'shipping' && order.shippingStatus === 'waiting' ? (
                    <button
                      className="admin-orders-ship-btn"
                      onClick={() => handleShipOrder(order._id)}
                    >
                      Xác nhận đã chuyển hàng
                    </button>
                  ) : (
                    <span className="admin-orders-no-action">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrder;