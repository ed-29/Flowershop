import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('employee@flowershop.com');
  const [password, setPassword] = useState('employee123');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const pinValue = pin.trim();
      const emailValue = email.trim().toLowerCase();
      const passwordValue = password;

      if (pinValue && pinValue === '1234') {
        const result = await login('employee@flowershop.com', 'employee123');
        if (result.success && result.user.role === 'employee') {
          navigate('/dashboard');
          return;
        }
      }

      if (!emailValue || !passwordValue) {
        throw new Error('Email and password are required');
      }

      const result = await login(emailValue, passwordValue);
      if (result.success) {
        if (result.user.role !== 'employee') {
          throw new Error('This account does not have employee access');
        }
        navigate('/dashboard');
      } else {
        throw new Error(result.error || 'Invalid employee credentials');
      }
    } catch (err) {
      setError(err.message || 'Invalid employee credentials');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Employee Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Employee PIN (fallback)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-center text-2xl tracking-widest"
              maxLength="4"
              placeholder="••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
};

export default EmployeeLogin;
