import api from './api';

const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async logoutAll() {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },
};

export default authService;
