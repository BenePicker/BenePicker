import apiClient from './client';

export const getMapData = (params) =>
  apiClient.get('/api/map', { params });
