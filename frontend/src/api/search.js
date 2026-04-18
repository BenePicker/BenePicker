import apiClient from './client';

export const search = (keyword) =>
  apiClient.get('/search', { params: { keyword } });

export const getSearchHistory = () =>
  apiClient.get('/search/history');

export const deleteSearchHistory = () =>
  apiClient.delete('/search/history');

export const deleteSearchHistoryItem = (searchId) =>
  apiClient.delete(`/search/history/${searchId}`);
