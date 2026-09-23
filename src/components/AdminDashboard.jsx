import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StaffOrdersPanel from './StaffOrdersPanel';

const AdminDashboard = () => {
  const { token, user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email;

  const loadUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    setUserError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load users');
      setUsers(await res.json());
    } catch (e) {
      setUserError('Could not load users. Make sure the server is running.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const changeRole = async (target, role) => {
    if (String(target._id) === String(user?.id) && role !== user?.role) {
      const confirmed = window.confirm('You are changing your own role. Continue?');
      if (!confirmed) return;
    }
    const res = await fetch(`http://localhost:5000/api/admin/users/${target._id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role })
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((current) => current.map((entry) => (entry._id === updated._id ? updated : entry)));
    } else {
      alert('Could not update role');
    }
  };

  const deleteUser = async (target) => {
    if (String(target._id) === String(user?.id)) {
      alert('You cannot delete your own account while signed in.');
      return;
    }
    if (!window.confirm(`Delete ${target.firstName} ${target.lastName}? This cannot be undone.`)) return;
    const res = await fetch(`http://localhost:5000/api/admin/users/${target._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setUsers((current) => current.filter((entry) => entry._id !== target._id));
    else alert('Could not delete user');
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((entry) => {
      const matchesRole = roleFilter === 'all' || entry.role === roleFilter;
      if (!matchesRole) return false;
      if (!query) return true;
      const name = `${entry.firstName || ''} ${entry.lastName || ''}`.toLowerCase();
      return name.includes(query) || String(entry.email || '').toLowerCase().includes(query);
    });
  }, [users, search, roleFilter]);

  const userStats = {
    total: users.length,
    customers: users.filter((entry) => entry.role === 'customer').length,
    employees: users.filter((entry) => entry.role === 'employee').length,
    admins: users.filter((entry) => entry.role === 'admin').length
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {displayName}</p>
        </div>
        <button
          onClick={logout}
          className="bg-black text-white px-4 py-2 rounded hover:bg-neutral-800 self-start"
        >
          Logout
        </button>
      </div>

      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="p-2 border rounded w-full sm:w-64"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All roles</option>
              <option value="customer">Customers</option>
              <option value="employee">Employees</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-2xl font-bold">{userStats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Customers</h3>
            <p className="text-2xl font-bold">{userStats.customers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Employees</h3>
            <p className="text-2xl font-bold">{userStats.employees}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Admins</h3>
            <p className="text-2xl font-bold">{userStats.admins}</p>
          </div>
        </div>

        {userError && (
          <div className="mb-4 text-sm text-red-600 flex items-center gap-3">
            <span>{userError}</span>
            <button onClick={loadUsers} className="underline">Retry</button>
          </div>
        )}

        {loadingUsers ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">No users found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((entry) => {
              const isSelf = String(entry._id) === String(user?.id);
              return (
                <div key={entry._id} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <div className="font-medium">
                      {entry.firstName} {entry.lastName}
                      {isSelf && <span className="ml-2 text-xs text-pink-700">(you)</span>}
                    </div>
                    <div className="text-sm text-gray-500">{entry.email} • {entry.role}</div>
                    {entry.activity && entry.activity.length > 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        Recent activity: {entry.activity.slice(-3).map((activity) => `${activity.type}${activity.message ? ` - ${activity.message}` : ''}`).join(' | ')}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      value={entry.role}
                      onChange={(e) => changeRole(entry, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="customer">customer</option>
                      <option value="employee">employee</option>
                      <option value="admin">admin</option>
                    </select>
                    <button
                      onClick={() => deleteUser(entry)}
                      disabled={isSelf}
                      className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <StaffOrdersPanel title="All Orders" />
    </div>
  );
};

export default AdminDashboard;
