import apiClient from './client';

export const getNearbyBenefits = ({ latitude, longitude, radius } = {}) =>
  apiClient.get('/api/home/benefits/nearby', {
    params: { latitude, longitude, radius },
  });
