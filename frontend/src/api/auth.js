import apiClient from './client';

export const login = (data) =>
  apiClient.post('/api/member/login', data);

export const signup = (data) =>
  apiClient.post('/api/member/signup', data);

export const checkEmail = (memberEmail) =>
  apiClient.get('/api/member/check-email', { params: { memberEmail } });

export const checkNickname = (memberNickname) =>
  apiClient.get('/api/member/check-nickname', { params: { memberNickname } });

export const logout = () =>
  apiClient.post('/api/auth/logout');

export const getMyInfo = () =>
  apiClient.get('/api/member/me');
