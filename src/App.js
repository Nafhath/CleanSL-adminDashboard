import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Operations from './pages/Operations';
import LiveMap from './pages/LiveMap';
import Complaints from './pages/Complaints';
import FleetStatus from './pages/FleetStatus';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Violations from './pages/Violations';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const hasAuthToken = () => Boolean(localStorage.getItem('authToken'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(hasAuthToken());
    };

    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('authchange', syncAuthState);
    setLoading(false);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('authchange', syncAuthState);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Dashboard Routes */}
        {isAuthenticated ? (
          <Route path="/" element={<Dashboard onLogout={handleLogout} />}>
            <Route index element={<Overview />} />
            <Route path="operations" element={<Operations />} />
            <Route path="live-map" element={<LiveMap />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="violations" element={<Violations />} />
            <Route path="driver-log" element={<FleetStatus />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
