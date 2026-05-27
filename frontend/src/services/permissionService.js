import api from './api';

const permissionService = {
  // Returns array of { id, name }
  async getPermissions() {
    const response = await api.get('/admin/permissions');
    return response.data;
  },

  async createPermission(name) {
    const response = await api.post('/admin/permissions', { name });
    return response.data;
  },

  async deletePermission(id) {
    const response = await api.delete(`/admin/permissions/${id}`);
    return response.data;
  },
};

export default permissionService;
