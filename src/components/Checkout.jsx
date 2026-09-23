import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import MapLocationSelector from './MapLocationSelector';

const Checkout = () => {
  const { items, clearCart, removeFromCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutItemId = location.state?.checkoutItemId;
  const checkoutItems = checkoutItemId
    ? items.filter((item) => String(item.id) === String(checkoutItemId))
    : items;
  const checkoutTotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [orderInfo, setOrderInfo] = useState({
    receiverName: '',
    note: '',
    location: null,
    screenshot: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (coords) => {
    setOrderInfo(prev => ({ ...prev, location: coords }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!orderInfo.location) {
      alert('Please select a delivery location on the map');
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: checkoutItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0]
      })),
      totalAmount: checkoutTotal,
      deliveryDate: new Date().toISOString().split('T')[0],
      receiverName: orderInfo.receiverName,
      note: orderInfo.note,
      location: orderInfo.location,
      screenshot: orderInfo.screenshot,
      status: 'pending'
    };

    // Persist order: localStorage for offline, and backend for authenticated users
    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
      existingOrders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
    } catch (e) { console.error(e); }

    if (isAuthenticated && user && user.id) {
      // send to backend
      (async () => {
        try {
          const payload = {
            items: checkoutItems.map(i => ({ product: i.id, quantity: i.quantity })),
            shippingAddress: {},
            deliveryDate: newOrder.deliveryDate,
            specialInstructions: newOrder.note,
            paymentMethod: 'offline'
          };
          const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            console.warn('Backend order save failed');
          }
        } catch (err) { console.error('Failed to send order to backend', err); }
      })();
      // also persist per-user local storage copy
      try {
        const userKey = `orders_${user.id}`;
        const userOrders = JSON.parse(localStorage.getItem(userKey)) || [];
        userOrders.push(newOrder);
        localStorage.setItem(userKey, JSON.stringify(userOrders));
      } catch (e) { console.error(e); }
    }

    if (checkoutItemId) {
      removeFromCart(checkoutItemId);
    } else {
      clearCart();
    }
    navigate('/orders');
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/')}
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center text-pink-600 hover:text-pink-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Shopping
      </button>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        {checkoutItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600 ml-2">x{item.quantity}</span>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-xl font-bold text-pink-600">
              ${checkoutTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Receiver's Name *</label>
          <input
            type="text"
            name="receiverName"
            value={orderInfo.receiverName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Note to Receiver</label>
          <textarea
            name="note"
            value={orderInfo.note}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Delivery Location *</label>
          <MapLocationSelector onLocationSelect={handleLocationSelect} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link to Payment Receipt Image</label>
          <input
            type="url"
            name="screenshot"
            value={orderInfo.screenshot}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://imgur.com/..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition font-semibold"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
