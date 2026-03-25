import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userAPI.login(email, password);
      if (response && response.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || {}));
        window.dispatchEvent(new Event('authchange'));
        onLogin?.();
        // Redirect to dashboard
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-accent to-theme-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-theme-accent to-theme-sidebar p-8 text-center">
          <LogIn className="w-12 h-12 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white font-serif">CleanSL Admin</h1>
          <p className="text-white/80 text-sm font-medium mt-2">Waste Management Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-theme-text mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-theme-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all font-medium"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-theme-text mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-theme-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all font-medium"
              disabled={loading}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-theme-accent to-theme-sidebar text-white font-black py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>

          {/* Footer Info */}
          <p className="text-xs text-center text-gray-500 font-medium">
            CleanSL Admin Dashboard
          </p>
        </form>
      </div>
    </div>
  );
}
