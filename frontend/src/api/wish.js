import apiClient from './client';

export const addBrandWish = (brandId) =>
  apiClient.post(`/wishes/brands/${brandId}`);

export const removeBrandWish = (brandId) =>
  apiClient.delete(`/wishes/brands/${brandId}`);

export const addStoreWish = (storeId) =>
  apiClient.post(`/wishes/stores/${storeId}`);

export const removeStoreWish = (storeId) =>
  apiClient.delete(`/wishes/stores/${storeId}`);
