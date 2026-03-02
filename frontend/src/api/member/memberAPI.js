import api from '../core/axiosAPI'

export const memberAPI = {

  // 로그인
  login: (memberEmail, memberPw) =>
    api.post('/member/login', { memberEmail, memberPw }),

  // 회원가입
  signup: (memberData) =>
    api.post('/member/signup', memberData),

  // 이메일 중복 확인
  checkEmail: (memberEmail) =>
    api.get('/member/check-email', { params: { memberEmail } }),

  // 닉네임 중복 확인
  checkNickname: (memberNickname) =>
    api.get('/member/check-nickname', { params: { memberNickname } }),
}
