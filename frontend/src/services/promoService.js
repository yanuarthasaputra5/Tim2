import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getPromos    = (params = {}) => api.get('/api/promos', { params });
export const getPromo     = (id)          => api.get(`/api/promos/${id}`);
export const createPromo  = (data)        => api.post('/api/promos', data);
export const updatePromo  = (id, data)    => api.put(`/api/promos/${id}`, data);
export const deletePromo  = (id)          => api.delete(`/api/promos/${id}`);
