import apiClient from './client';

export const getBenefit = (benefitId) =>
  apiClient.get(`/benefits/${benefitId}`);
