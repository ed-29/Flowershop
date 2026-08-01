import React, { useState } from 'react';
const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState(storedOrders);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ deliveryDate: '', receiverName: '', note: '' });
  const navigate = useNavigate();

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
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
          >
            Start Shopping
          </button>
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
                    <p className="text-gray-700 text-sm mb-3">
                      <span className="font-semibold">Note:</span> {order.note || 'None'}
                    </p>
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
