import React, { useState } from 'react';
const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
import { useNavigate } from 'react-router-dom';


const Orders = () => {
  const [orders, setOrders] = useState(storedOrders);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ deliveryDate: '', receiverName: '', note: '' });

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
  };

  const handleCancelOrder = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
    if (confirmDelete) {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    }
  };
  const navigate = useNavigate();

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
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded p-4">
            <img src={order.image} alt="Order" className="w-full h-48 object-cover rounded" />
            {editingId === order.id ? (
              <div className="mt-4 space-y-2">
                <input
                  type="date"
                  name="deliveryDate"
                  value={editForm.deliveryDate}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="receiverName"
                  value={editForm.receiverName}
                  onChange={handleEditChange}
                  placeholder="Receiver's Name"
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="note"
                  value={editForm.note}
                  onChange={handleEditChange}
                  placeholder="Note"
                  className="w-full border p-2 rounded"
                ></textarea>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSave(order.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Delivery Date:</span> {order.deliveryDate}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Receiver:</span> {order.receiverName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Note:</span> {order.note}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditClick(order)}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
