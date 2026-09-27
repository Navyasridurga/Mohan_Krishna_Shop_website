import axiosClient from './axiosClient';

export const menuApi = {
  getCategories: () => axiosClient.get('/menu/categories').then((r) => r.data.data),

  getItems: ({ category, includeDisabled } = {}) =>
    axiosClient
      .get('/menu', { params: { category, includeDisabled: includeDisabled ? 'true' : undefined } })
      .then((r) => r.data.data),

  getItemById: (id) => axiosClient.get(`/menu/${id}`).then((r) => r.data.data),

  createItem: (payload) => axiosClient.post('/menu', payload).then((r) => r.data.data),

  updateItem: (id, payload) => axiosClient.put(`/menu/${id}`, payload).then((r) => r.data.data),

  setAvailability: (id, is_available) =>
    axiosClient.patch(`/menu/${id}/availability`, { is_available }).then((r) => r.data.data),

  deleteItem: (id) => axiosClient.delete(`/menu/${id}`).then((r) => r.data),
};
