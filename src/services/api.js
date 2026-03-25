import axios from 'axios';

const DEFAULT_LOCAL_API_URL = 'http://localhost:8000';
const DEFAULT_REMOTE_API_URL = 'https://cleansl-backend-9d4g.onrender.com';

const resolveApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    return isLocalHost ? DEFAULT_LOCAL_API_URL : DEFAULT_REMOTE_API_URL;
  }

  return DEFAULT_LOCAL_API_URL;
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function for error handling
const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  throw error;
};

// User endpoints
export const userAPI = {
  getAll: () => api.get('/users').then(r => r.data).catch(handleError),
  getById: (id) => api.get(`/users/${id}`).then(r => r.data).catch(handleError),
  create: (data) => api.post('/users', data).then(r => r.data).catch(handleError),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data).catch(handleError),
  delete: (id) => api.delete(`/users/${id}`).then(r => r.data).catch(handleError),
  login: (email, password) => api.post('/users/auth/login', { email, password }).then(r => r.data).catch(handleError),
  getDrivers: () => api.get('/users/role/driver').then(r => r.data).catch(handleError)
};

// Truck endpoints
export const truckAPI = {
  getAll: () => api.get('/trucks').then(r => r.data).catch(handleError),
  getById: (id) => api.get(`/trucks/${id}`).then(r => r.data).catch(handleError),
  create: (data) => api.post('/trucks', data).then(r => r.data).catch(handleError),
  update: (id, data) => api.put(`/trucks/${id}`, data).then(r => r.data).catch(handleError),
  delete: (id) => api.delete(`/trucks/${id}`).then(r => r.data).catch(handleError),
  getByStatus: (status) => api.get(`/trucks/status/${status}`).then(r => r.data).catch(handleError),
  updateLocation: (id, location) => api.patch(`/trucks/${id}/location`, location).then(r => r.data).catch(handleError),
  addRoutePoint: (id, point) => api.patch(`/trucks/${id}/add-route-point`, point).then(r => r.data).catch(handleError)
};

// Complaint endpoints
export const complaintAPI = {
  getAll: (params = {}) => api.get('/complaints', { params }).then(r => r.data).catch(handleError),
  getById: (id) => api.get(`/complaints/${id}`).then(r => r.data).catch(handleError),
  create: (data) => api.post('/complaints', data).then(r => r.data).catch(handleError),
  update: (id, data) => api.put(`/complaints/${id}`, data).then(r => r.data).catch(handleError),
  delete: (id) => api.delete(`/complaints/${id}`).then(r => r.data).catch(handleError),
  getStats: () => api.get('/complaints/stats/overview').then(r => r.data).catch(handleError)
};

// Violation endpoints
export const violationAPI = {
  getAll: (params = {}) => api.get('/violations', { params }).then(r => r.data).catch(handleError),
  getById: (id) => api.get(`/violations/${id}`).then(r => r.data).catch(handleError),
  create: (data) => api.post('/violations', data).then(r => r.data).catch(handleError),
  update: (id, data) => api.put(`/violations/${id}`, data).then(r => r.data).catch(handleError),
  delete: (id) => api.delete(`/violations/${id}`).then(r => r.data).catch(handleError),
  getStats: () => api.get('/violations/stats/overview').then(r => r.data).catch(handleError)
};

// Analytics endpoints
export const analyticsAPI = {
  getAll: (params = {}) => api.get('/analytics', { params }).then(r => r.data).catch(handleError),
  getByTruck: (truckId, params = {}) => api.get(`/analytics/truck/${truckId}`, { params }).then(r => r.data).catch(handleError),
  getByDriver: (driverId, params = {}) => api.get(`/analytics/driver/${driverId}`, { params }).then(r => r.data).catch(handleError),
  create: (data) => api.post('/analytics', data).then(r => r.data).catch(handleError),
  getDistrictSummary: (params = {}) => api.get('/analytics/summary/district', { params }).then(r => r.data).catch(handleError),
  getPerformanceSummary: (params = {}) => api.get('/analytics/summary/performance', { params }).then(r => r.data).catch(handleError),
  getDashboardStats: () => api.get('/analytics/summary').then(r => r.data).catch(handleError),
  getMonthlyTrends: () => api.get('/analytics/monthly-trends').then(r => r.data).catch(handleError),
  getWasteDistribution: () => api.get('/analytics/waste-distribution').then(r => r.data).catch(handleError)
};

// Maps endpoints
export const mapsAPI = {
  geocode: (address) => api.post('/maps/geocode', { address }).then(r => r.data).catch(handleError),
  reverseGeocode: (lat, lng) => api.post('/maps/reverse-geocode', { lat, lng }).then(r => r.data).catch(handleError),
  getDistance: (origin, destination) => api.post('/maps/distance', { origin, destination }).then(r => r.data).catch(handleError),
  getDirections: (origin, destination) => api.post('/maps/directions', { origin, destination }).then(r => r.data).catch(handleError),
  checkGeofence: (point, center, radiusKm) => api.post('/maps/check-geofence', { point, center, radiusKm }).then(r => r.data).catch(handleError)
};

// Health check
export const healthAPI = {
  check: () => api.get('/health').then(r => r.data).catch(handleError)
};

export default api;
