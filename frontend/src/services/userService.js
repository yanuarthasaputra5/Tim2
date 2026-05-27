import api from './api';

const userService = {
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async changePassword(id, password, passwordConfirmation) {
    const response = await api.post(`/admin/users/${id}/change-password`, {
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async assignRole(userId, role) {
    const response = await api.post(`/admin/users/${userId}/assign-role`, { role });
    return response.data;
  },
};

export default userService;
