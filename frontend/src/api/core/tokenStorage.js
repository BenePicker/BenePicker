// Access Token (메모리 저장 - 보안상 localStorage보다 안전)
let accessToken = null

export const tokenStorage = {
  getAccessToken: () => accessToken,
  setAccessToken: (token) => { accessToken = token },
  clearAccessToken: () => { accessToken = null },

  // Refresh Token (httpOnly 쿠키 권장, 여기선 localStorage 사용)
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
  clearRefreshToken: () => localStorage.removeItem('refreshToken'),

  clear: () => {
    accessToken = null
    localStorage.removeItem('refreshToken')
  }
}
