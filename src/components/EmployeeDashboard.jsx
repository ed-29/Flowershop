import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StaffOrdersPanel from './StaffOrdersPanel';
import EmployeeInventory from './EmployeeInventory';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email;

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome, {displayName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/')}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            View Shop
          </button>
          <button
            onClick={logout}
            className="bg-black text-white px-4 py-2 rounded hover:bg-neutral-800"
          >
            Logout
          </button>
        </div>
      </div>

      <StaffOrdersPanel title="Assigned Orders" />
      <EmployeeInventory />
    </div>
  );
};

export default EmployeeDashboard;
