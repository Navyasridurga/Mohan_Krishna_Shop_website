import axiosClient from './axiosClient';

export const authApi = {
  login: (username, password) =>
    axiosClient.post('/auth/login', { username, password }).then((r) => r.data.data),
  me: () => axiosClient.get('/auth/me').then((r) => r.data.data),
};
