import axiosClient from './axiosClient';

export const orderApi = {
  placeOrder: (payload) => axiosClient.post('/orders', payload).then((r) => r.data.data),

  getOrders: (status) =>
    axiosClient.get('/orders', { params: { status } }).then((r) => r.data.data),

  updateStatus: (id, status) =>
    axiosClient.patch(`/orders/${id}/status`, { status }).then((r) => r.data.data),
};
