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

export const updateProfile = (data) =>
  apiClient.patch('/api/member/me/profile', data);

export const updatePassword = ({ currentPassword, newPassword }) =>
  apiClient.patch('/api/member/me/password', { currentPassword, newPassword });

export const updatePrivacy = (data) =>
  apiClient.patch('/api/member/me/privacy', data);
