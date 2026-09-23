import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const { token, user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          // fallback to localStorage
          const local = JSON.parse(localStorage.getItem(`orders_${user?.id}`)) || [];
          setOrders(local);
        }
      } catch (e) {
        const local = JSON.parse(localStorage.getItem(`orders_${user?.id}`)) || [];
        setOrders(local);
      }
    };
    fetchOrders();
  }, [token, user && user.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || user?.email}</p>
        </div>
        <div>
          <button onClick={logout} className="bg-black text-white px-4 py-2 rounded hover:bg-neutral-800">Logout</button>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <div className="text-gray-600">No orders yet</div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o._id || o.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Order #{o._id || o.id}</div>
                    <div className="text-sm text-gray-500">{o.deliveryDate || '—'}</div>
                  </div>
                  <div className="text-pink-600 font-semibold">${o.totalAmount?.toFixed(2) || (o.items ? o.items.reduce((s, it) => s + (it.price * it.quantity),0).toFixed(2) : '0.00')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
