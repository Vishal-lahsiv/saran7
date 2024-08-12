import React, { useState, useEffect } from 'react';
import './OrderDetails.css';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/orders'); // Adjust API URL as needed
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>
            <p><strong>Supplier Name:</strong> {order.supplierName}</p>
            <p><strong>Company Name:</strong> {order.companyName}</p>
            <p><strong>Contact:</strong> {order.contact}</p>
            <p><strong>Order Status:</strong> {order.status}</p>
            <p><strong>Order Items:</strong></p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.productName} - {item.quantity} units (Brand: {item.brand}, Color: {item.color})
                </li>
              ))}
            </ul>
            <div>
              <label htmlFor={`status-${order.id}`}>Update Status:</label>
              <select
                id={`status-${order.id}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderDetails;
