import React, { useEffect, useMemo, useState } from 'react';
import MapLocationSelector from './MapLocationSelector';
import { useAuth } from '../contexts/AuthContext';

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const isMongoId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id));

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString();
};

const formatMoney = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : 'N/A';
};

const displayId = (order) => {
  if (order.orderNumber) return order.orderNumber;
  const raw = String(order.id || '');
  return raw.length > 10 ? `#${raw.slice(-8).toUpperCase()}` : `#${raw}`;
};

const normalizeOrder = (order) => {
  const items = (order.items || []).map((item) => ({
    name: item.name || item.product?.name || 'Item',
    quantity: item.quantity || 1,
    price: item.price ?? item.product?.price ?? 0,
    image: item.image || item.product?.image || item.product?.images?.[0] || ''
  }));

  const customerName = [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ');

  return {
    id: order._id || order.id,
    orderNumber: order.orderNumber,
    receiverName: order.receiverName || customerName || order.customer?.email || 'Customer',
    customerEmail: order.customer?.email || '',
    items,
    totalAmount: order.totalAmount ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    deliveryDate: order.deliveryDate,
    createdAt: order.createdAt,
    status: order.status || 'pending',
    note: order.note || order.specialInstructions || '',
    location: order.location && typeof order.location.lat === 'number' ? order.location : null,
    screenshot: order.screenshot || '',
    source: order._id ? 'api' : 'local'
  };
};

const readLocalOrders = () => {
  const collected = [];
  try {
    collected.push(...(JSON.parse(localStorage.getItem('orders')) || []));
  } catch (e) {
    console.error(e);
  }
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith('orders_')) {
        collected.push(...(JSON.parse(localStorage.getItem(key)) || []));
      }
    }
  } catch (e) {
    console.error(e);
  }

  const seen = new Set();
  return collected.filter((order) => {
    const key = String(order._id || order.id);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const persistLocalOrders = (updatedOrder) => {
  const rewrite = (key) => {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(existing) || existing.length === 0) return;
    const next = existing.map((order) =>
      String(order._id || order.id) === String(updatedOrder.id)
        ? { ...order, status: updatedOrder.status }
        : order
    );
    localStorage.setItem(key, JSON.stringify(next));
  };

  const keys = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key === 'orders' || (key && key.startsWith('orders_'))) keys.push(key);
  }
  keys.forEach(rewrite);
};

const StaffOrdersPanel = ({ title = 'Orders' }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      const localOrders = readLocalOrders().map(normalizeOrder);
      let apiOrders = [];

      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/orders/staff', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            apiOrders = (Array.isArray(data) ? data : []).map(normalizeOrder);
          }
        } catch (e) {
          setError('Could not load server orders. Showing locally saved orders.');
        }
      }

      const merged = [...apiOrders];
      const apiIds = new Set(apiOrders.map((order) => String(order.id)));
      localOrders.forEach((order) => {
        if (!apiIds.has(String(order.id))) merged.push(order);
      });

      setOrders(merged);
      setLoading(false);
    };

    loadOrders();
  }, [token]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === 'all' || order.status === filter;
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        displayId(order).toLowerCase().includes(query) ||
        order.receiverName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    });
  }, [orders, filter, search]);

  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    inProgress: orders.filter((order) => ['confirmed', 'preparing', 'shipped'].includes(order.status)).length,
    delivered: orders.filter((order) => order.status === 'delivered').length,
    totalRevenue: orders
      .filter((order) => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0)
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusError('');
    const previous = orders.find((order) => String(order.id) === String(orderId));
    if (!previous) return;

    const updated = { ...previous, status: newStatus };
    setOrders((current) => current.map((order) => (String(order.id) === String(orderId) ? updated : order)));
    setSelectedOrder((current) => (current && String(current.id) === String(orderId) ? updated : current));

    persistLocalOrders(updated);

    if (isMongoId(orderId) && token) {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) {
          throw new Error('Failed to update status on server');
        }
      } catch (e) {
        setStatusError('Status saved locally, but the server update failed.');
      }
    }
  };

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, order, or item"
            className="p-2 border rounded w-full sm:w-64"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Orders</option>
            {Object.keys(STATUS_COLORS).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">In Progress</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Delivered</h3>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow col-span-2 md:col-span-1">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-2xl font-bold text-pink-600">{formatMoney(stats.totalRevenue)}</p>
        </div>
      </div>

      {error && <p className="text-sm text-amber-700 mb-3">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredOrders.map((order) => (
              <tr key={String(order.id)} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{displayId(order)}</td>
                <td className="px-4 py-3 text-sm">
                  <div>{order.receiverName}</div>
                  {order.customerEmail && <div className="text-xs text-gray-500">{order.customerEmail}</div>}
                </td>
                <td className="px-4 py-3 text-sm">{order.items.length} item(s)</td>
                <td className="px-4 py-3 text-sm font-medium">{formatMoney(order.totalAmount)}</td>
                <td className="px-4 py-3 text-sm">{formatDate(order.deliveryDate || order.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setStatusError('');
                      setSelectedOrder(order);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-8 text-center text-gray-500">Loading orders...</div>}
        {!loading && filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Order {displayId(selectedOrder)}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.receiverName}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedOrder.deliveryDate || selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-pink-600">{formatMoney(selectedOrder.totalAmount)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Items</h3>
              {selectedOrder.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatMoney(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No item details saved for this order.</p>
              )}
            </div>

            {selectedOrder.location && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Delivery Location</h3>
                <MapLocationSelector
                  onLocationSelect={() => {}}
                  initialCoords={selectedOrder.location}
                  readOnly
                />
              </div>
            )}

            {selectedOrder.note && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Note</h3>
                <p className="text-gray-600">{selectedOrder.note}</p>
              </div>
            )}

            {selectedOrder.screenshot && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Receipt</h3>
                <a
                  href={selectedOrder.screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Receipt
                </a>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Update Status</h3>
              {statusError && <p className="text-sm text-red-600 mb-2">{statusError}</p>}
              <div className="flex gap-2 flex-wrap">
                {Object.keys(STATUS_COLORS).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedOrder.status === status
                        ? STATUS_COLORS[status]
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StaffOrdersPanel;
