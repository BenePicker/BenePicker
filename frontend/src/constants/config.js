const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api'   // Android 에뮬레이터 → localhost
  : 'https://your-production-url.com/api'; // TODO: 운영 URL 교체

export default API_BASE_URL;
