import api from './api';

const roleService = {
  async getRoles() {
    const response = await api.get('/admin/roles');
    return response.data;
  },

  async createRole(data) {
    const response = await api.post('/admin/roles', data);
    return response.data;
  },

  async updateRole(id, data) {
    const response = await api.put(`/admin/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id) {
    const response = await api.delete(`/admin/roles/${id}`);
    return response.data;
  },
};

export default roleService;
