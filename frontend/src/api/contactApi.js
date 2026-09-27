import axiosClient from './axiosClient';

export const contactApi = {
  sendMessage: (payload) => axiosClient.post('/contact', payload).then((r) => r.data),
  getReviews: () => axiosClient.get('/reviews').then((r) => r.data.data),
};
