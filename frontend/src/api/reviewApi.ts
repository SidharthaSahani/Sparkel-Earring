import api from './api';

export const reviewApi = {
  getProductReviews: (productId: string) => api.get(`/reviews/product/${productId}`),
  getUserReviews: () => api.get('/reviews/user'),
  createReview: (reviewData: any) => api.post('/reviews', reviewData),
  updateReview: (id: string, reviewData: any) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
  getReviewById: (id: string) => api.get(`/reviews/${id}`),
};