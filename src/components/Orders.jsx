import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const initialStored = isAuthenticated && user && user.id ? (JSON.parse(localStorage.getItem(`orders_${user.id}`)) || []) : (JSON.parse(localStorage.getItem('orders')) || []);
  const [orders, setOrders] = useState(initialStored);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ deliveryDate: '', receiverName: '', note: '' });
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();

  React.useEffect(() => {
    const stored = isAuthenticated && user && user.id ? (JSON.parse(localStorage.getItem(`orders_${user.id}`)) || []) : (JSON.parse(localStorage.getItem('orders')) || []);
    setOrders(stored);
  }, [isAuthenticated, user && user.id]);

  const handleEditClick = (order) => {
    setEditingId(order.id);
    setEditForm({
      deliveryDate: order.deliveryDate,
      receiverName: order.receiverName,
      note: order.note,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...editForm } : order
      )
    );
    setEditingId(null);
    
    // Update localStorage
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, ...editForm } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleCancelOrder = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
    if (confirmDelete) {
      setOrders((prev) => prev.filter((order) => order.id !== id));
      
      // Update localStorage
      const updatedOrders = orders.filter(order => order.id !== id);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  return (
    <section className="p-6" id="Orders">
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center text-pink-600 hover:text-pink-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          {items.length > 0 ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Current Cart (Not placed)</h2>
              <div className="bg-white p-4 rounded shadow max-w-md mx-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img src={item.images ? item.images[0] : item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-gray-600 text-xs">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-pink-600">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                  <div>Total</div>
                  <div className="text-pink-600">${getTotalPrice().toFixed(2)}</div>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={() => navigate('/checkout')} className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">Proceed to Checkout</button>
                <button onClick={() => navigate('/')} className="text-pink-600 px-6 py-2">Continue Shopping</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <button
                onClick={() => navigate('/')}
                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
              >
                Start Shopping
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Order Items */}
              <div className="p-4 border-b">
                {order.items ? (
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                          <p className="text-pink-600 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <img src={order.image} alt="Order" className="w-full h-48 object-cover" />
                )}
              </div>

              {/* Order Details */}
              <div className="p-4">
                {order.totalAmount && (
                  <div className="mb-3">
                    <span className="text-lg font-bold text-pink-600">
                      Total: ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {editingId === order.id ? (
                  <div className="space-y-2">
                    <input
                      type="date"
                      name="deliveryDate"
                      value={editForm.deliveryDate}
                      onChange={handleEditChange}
                      className="w-full border p-2 rounded text-sm"
                    />
                    <input
                      type="text"
                      name="receiverName"
                      value={editForm.receiverName}
                      onChange={handleEditChange}
                      placeholder="Receiver's Name"
                      className="w-full border p-2 rounded text-sm"
                    />
                    <textarea
                      name="note"
                      value={editForm.note}
                      onChange={handleEditChange}
                      placeholder="Note"
                      className="w-full border p-2 rounded text-sm"
                      rows="2"
                    ></textarea>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(order.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-semibold">Delivery Date:</span> {order.deliveryDate}
                    </p>
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-semibold">Receiver:</span> {order.receiverName}
                    </p>
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-semibold">Note:</span> {order.note || 'None'}
                    </p>
                    {order.location && (
                      <p className="text-gray-700 text-sm mb-1">
                        <span className="font-semibold">Location:</span> {order.location.lat.toFixed(6)}, {order.location.lng.toFixed(6)}
                      </p>
                    )}
                    {order.link && (
                      <p className="text-gray-700 text-sm mb-1">
                        <span className="font-semibold">Map Link:</span> <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a>
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
