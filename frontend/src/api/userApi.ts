import api from './api';

export const userApi = {
  getCurrentUser: () => api.get('/users/profile'),
  updateUser: (userData: any) => api.put('/users/profile', userData),
  getUserOrders: () => api.get('/users/orders'),
  getUserAddresses: () => api.get('/users/addresses'),
  addAddress: (addressData: any) => api.post('/users/addresses', addressData),
  updateAddress: (id: string, addressData: any) => api.put(`/users/addresses/${id}`, addressData),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};