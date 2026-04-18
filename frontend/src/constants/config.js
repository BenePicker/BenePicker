import { Platform } from 'react-native';

// 웹: same-origin으로 요청 → Vercel rewrite가 백엔드로 프록시 (Mixed Content/CORS 우회)
// 네이티브: 백엔드 IP로 직접 요청
const API_BASE_URL = Platform.OS === 'web'
  ? '/proxy'
  : 'http://54.253.35.160:8080';

export default API_BASE_URL;
