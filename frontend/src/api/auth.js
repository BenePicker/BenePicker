import apiClient from './client';

export const login = (data) =>
  apiClient.post('/member/login', data);

export const signup = (data) =>
  apiClient.post('/member/signup', data);

export const checkEmail = (memberEmail) =>
  apiClient.get('/member/check-email', { params: { memberEmail } });

export const checkNickname = (memberNickname) =>
  apiClient.get('/member/check-nickname', { params: { memberNickname } });
