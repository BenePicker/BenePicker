import { useMutation } from '@tanstack/react-query'
import { memberAPI } from './memberAPI'
import { tokenStorage } from '../core/tokenStorage'

// 로그인 훅
export function useLogin() {
  return useMutation({
    mutationFn: ({ memberEmail, memberPw }) =>
      memberAPI.login(memberEmail, memberPw),
    onSuccess: ({ data }) => {
      tokenStorage.setAccessToken(data.accessToken)
      tokenStorage.setRefreshToken(data.refreshToken)
    },
  })
}

// 회원가입 훅
export function useSignup() {
  return useMutation({
    mutationFn: (memberData) => memberAPI.signup(memberData),
  })
}
