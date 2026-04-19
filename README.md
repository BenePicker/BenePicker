# BenePicker

> 내 위치 주변의 통신사·카드·멤버십 혜택을 한눈에 보여주는 풀스택 앱

---

## 구성

BenePicker는 Spring Boot 백엔드 + React Native(Expo) 모바일·웹 프론트로 이루어진 모노레포입니다. 웹은 Expo의 React Native Web 타겟을 Vercel에 빌드·배포하고, 백엔드는 EC2(Amazon Linux 2023)에 systemd로 상주합니다. `main` 브랜치에 머지되는 순간 프론트(Vercel)와 백엔드(GitHub Actions → EC2)가 자동 배포됩니다.

```
BenePicker/
├── backend/                  Spring Boot REST API + WebSocket
├── frontend/                 Expo 앱 (iOS / Android / Web)
├── deploy/benepicker.service systemd 유닛 (EC2 배포용 레퍼런스)
└── .github/workflows/        GitHub Actions (백엔드 자동 배포)
```

---

## 기술 스택

### Backend (`/backend`)
| 항목 | 값 |
|---|---|
| Language | Java 21 (Amazon Corretto) |
| Framework | Spring Boot 3.5.8 |
| DB | PostgreSQL (Supabase, HikariCP) |
| Persistence | MyBatis 3.0.5 (`mapUnderscoreToCamelCase`) |
| Auth | Spring Security + JWT (stateless, BCrypt) |
| Real-time | WebSocket (STOMP/SockJS `/ws`, 네이티브용 순수 WS `/ws-native`) |
| Mail | Spring Boot Starter Mail |
| Config | `dotenv-java` 로 `backend/.env` 로드 → System Property 주입 |
| Docs | Springdoc OpenAPI (Swagger UI `/swagger-ui.html`) |

### Frontend (`/frontend`)
| 항목 | 값 |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Language | JavaScript (JSX) |
| 타겟 | iOS / Android / Web (React Native Web 0.21) |
| Navigation | React Navigation v7 (bottom-tabs + native-stack) |
| HTTP | Axios (interceptor 기반 토큰 주입·401 처리) |
| State | Context API (`AuthContext`) |
| 저장소 | AsyncStorage (accessToken / refreshToken / 프로필 이미지 로컬 URI) |
| 지도 | Kakao Maps SDK (웹: 직접 로드 / 네이티브: WebView + HTML 브릿지) |

---

## 배포 구성

### 프론트엔드 (Vercel)
- `main` 푸시 시 Vercel이 자동 감지 → `npx expo export --platform web` → 정적 배포
- 루트 디렉토리: `frontend/`
- `vercel.json`의 rewrite로 `/proxy/*` 요청을 EC2 백엔드(`http://43.203.64.160:8080`)로 프록시 (Mixed Content / CORS 우회)

### 백엔드 (EC2 + GitHub Actions)
- 트리거: `main` 브랜치에 `backend/**` 변경 푸시
- 흐름:
  1. GitHub Actions runner가 JDK 21 + Gradle 8.10.2 설치
  2. `gradle clean bootJar -x test` → `backend/build/libs/backend-0.0.1-SNAPSHOT.jar` 생성
  3. `scp`로 EC2 `/home/ec2-user/BenePicker/backend/build/libs/`에 업로드
  4. `ssh ec2-user@... 'sudo systemctl restart benepicker'` → 3초 뒤 `is-active` 검증
- 서비스: systemd `benepicker.service` 가 상주, 프로세스 다운 시 자동 재시작

### 필요한 GitHub Secrets
| Secret | 값 |
|---|---|
| `EC2_HOST` | EC2 public IP |
| `EC2_SSH_KEY` | 인스턴스 키페어 pem 파일 전체 내용 |

### EC2 쪽 선행 세팅 (최초 1회)
1. `~/BenePicker/backend/.env` 작성 (아래 *환경변수* 참고, mode 600)
2. `~/.ssh/authorized_keys`에 `EC2_SSH_KEY`의 공개키 등록
3. `deploy/benepicker.service`를 `/etc/systemd/system/`에 복사 → `sudo systemctl daemon-reload && sudo systemctl enable --now benepicker`

---

## API 엔드포인트

> 인증이 필요한 엔드포인트는 `Authorization: Bearer <accessToken>` 헤더 필수. 로그인·회원가입·이메일 인증·WebSocket 핸드셰이크·Swagger는 인증 없이 접근.

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/member/login` | 로그인 (이메일/비번 → access·refresh 토큰) |
| POST | `/api/member/signup` | 회원가입 |
| GET | `/api/member/check-email` | 이메일 중복 확인 |
| GET | `/api/member/check-nickname` | 닉네임 중복 확인 |
| GET | `/api/member/me` | 내 정보 조회 |
| PATCH | `/api/member/me/profile` | 프로필 수정 |
| PATCH | `/api/member/me/password` | 비밀번호 변경 |
| PATCH | `/api/member/me/privacy` | 개인정보 동의 변경 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/home/benefits/nearby` | 홈: 내 주변 혜택 목록 |
| GET | `/api/map` | 지도: 마커·매장·혜택 통합 응답 |
| GET | `/benefits/{benefitId}` | 혜택 상세 |
| GET | `/search` | 검색 |
| GET | `/search/history` | 최근 검색어 |
| DELETE | `/search/history/{searchId}` | 최근 검색어 개별 삭제 |
| DELETE | `/search/history` | 최근 검색어 전체 삭제 |
| POST | `/wishes/stores/{storeId}` | 매장 찜 |
| DELETE | `/wishes/stores/{storeId}` | 매장 찜 해제 |
| POST | `/wishes/brands/{brandId}` | 브랜드 찜 |
| DELETE | `/wishes/brands/{brandId}` | 브랜드 찜 해제 |

API 응답은 `ApiResponse<T>` 공통 래퍼로 `{ code, message, data }` 형태.

---

## 프로젝트 레이아웃

### Backend
```
backend/src/main/java/com/benepicker/
├── BenePickerApplication.java
├── common/
│   ├── auth/                JWT 인증 관련 Principal / UserDetails
│   ├── config/              Security / DB / WebSocket / Swagger / Env(Dotenv)
│   ├── exception/           전역 예외 핸들러
│   └── util/                JwtUtil, JwtFilter, Utility
├── auth/                    로그아웃
├── member/                  회원 CRUD / 로그인 / 프로필
├── home/                    홈 화면 데이터
├── map/                     지도 마커 / 매장 상세
├── benefit/                 혜택 상세
├── search/                  검색 / 최근 검색어
└── wish/                    매장·브랜드 찜
```
각 도메인은 `controller` → `service` / `service.impl` → `mapper` 의 3계층 구조. MyBatis XML은 `src/main/resources/mappers/<domain>-mapper.xml`.

### Frontend
```
frontend/
├── App.jsx                  AuthProvider + Navigation 컨테이너 (웹은 폰 프레임 UI)
├── app.json                 Expo 설정 (패키지명, 아이콘, 권한)
├── vercel.json              Vercel 빌드·rewrite 설정
└── src/
    ├── api/                 Axios 인스턴스 + 도메인별 API 모듈
    ├── constants/           API base URL, Kakao 키
    ├── context/             AuthContext (토큰 상태 + 프로필 이미지 로컬 캐시)
    ├── navigation/          AuthNavigator / AppNavigator (5탭)
    └── screens/
        ├── auth/            로그인 / 회원가입
        ├── home/            홈
        ├── map/             지도 (네이티브: WebView / 웹: 직접 SDK)
        ├── search/          검색
        ├── history/         사용내역
        ├── bookmark/        찜
        └── mypage/          MY
```

---

## 로컬 실행

### Backend
```bash
cd backend

# backend/.env 작성 (아래 환경변수 참고)

# gradle wrapper 가 없는 경우 먼저 설치: gradle -v
./gradlew bootRun
# 또는 gradle bootRun

# http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
```

### Frontend (모바일)
```bash
cd frontend
npm install

npm run android        # Android 에뮬레이터
npm run ios            # iOS (macOS 필요)
npm start              # Metro bundler (Expo Go)
```
- Android 에뮬레이터 → 백엔드: `10.0.2.2:8080` 자동 매핑
- 실기기 테스트 시 `src/constants/config.js`의 네이티브 URL을 PC 로컬 IP로 변경

### Frontend (웹)
```bash
cd frontend
npm install

npm run web            # 브라우저에서 Expo Web 미리보기
npm run build:web      # dist/ 정적 빌드
```

---

## 환경변수

### Backend (`backend/.env`, mode 600, gitignored)
```env
# Supabase PostgreSQL
SUPABASE_DB_URL=jdbc:postgresql://<supabase-pooler-host>:6543/postgres?prepareThreshold=0
SUPABASE_DB_USERNAME=postgres.<project-ref>
SUPABASE_DB_PASSWORD=<rotated-password>
DB_DRIVER=org.postgresql.Driver

# JWT
JWT_SECRET=<random-string-at-least-256-bits>
JWT_ACCESS_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=1209600000
```
`common/config/EnvConfig.java`의 static 블록에서 앱 기동 시 `Dotenv`로 읽어 `System.setProperty()`로 주입 → `application.properties`의 `${...}` 플레이스홀더가 해석됨.

### Frontend
`frontend/src/constants/kakao.js`에 Kakao JavaScript 앱 키. API Base URL은 `src/constants/config.js`에 하드코딩 (웹은 `/proxy`, 네이티브는 EC2 IP).

---

## CORS / 공개 경로

### CORS (배포 환경)
- `http://localhost:5173` (개발)
- `https://bene-picker.vercel.app`
- `https://*.vercel.app` (프리뷰)

### 인증 불필요
- `/api/member/login`, `/api/member/signup`, `/api/member/check-email`, `/api/member/check-nickname`, `/api/member/email/**`
- `/ws/**`, `/ws-native/**`
- `/swagger-ui/**`, `/swagger-ui.html`, `/v3/api-docs/**`

---

## 브랜치 전략

```
main  ← 배포되는 단일 기준 브랜치 (Vercel + EC2 자동 배포)
 ├── backend      백엔드 작업
 ├── frontend     모바일·웹 프론트 작업
 └── fix/*, feat/*, chore/*  단위 작업 브랜치
```

- 작업 브랜치 → `main` PR → 리뷰 후 머지
- 본인 PR 본인 머지 지양
- push 전 `git pull --rebase` 권장

### 커밋 태그
| 태그 | 의미 | 예 |
|---|---|---|
| `[Add]` | 기능 · 파일 추가 | `[Add] 회원가입 API 추가` |
| `[Fix]` | 버그 수정 | `[Fix] 토큰 만료 401 처리` |
| `[Update]` | 기능 수정 | `[Update] 로그인 유효성 검사` |
| `[Delete]` | 제거 | `[Delete] 미사용 util 제거` |
| `[Chore]` | 설정 · 주석 | `[Chore] gitignore 조정` |

태그 없이도 도메인 prefix(`웹 지도:`, `백엔드 배포:` 등) 형태로 커밋하는 것도 기존 히스토리에 섞여 있음 — 둘 다 허용.

---

## 네이밍 / 주석

### 네이밍
| 케이스 | 용도 |
|---|---|
| `camelCase` | 변수, 함수 |
| `PascalCase` | 클래스, 컴포넌트, DTO |
| `UPPER_SNAKE_CASE` | 상수 |

### API 필드 규약 (백엔드 DTO 기준, snake_case 금지)
- 로그인 요청: `{ memberEmail, memberPw }`
- 회원가입 요청: `{ memberEmail, memberPw, memberNickname, memberTel? }`
- 로그인 응답: `{ accessToken, refreshToken }`

### 주석 (필요 시)
**Backend (JavaDoc)**
```java
/**
 * dev. 이름
 * 기능 : 회원 정보 조회
 * @param memberNo 회원 번호
 * @return Member
 */
```
**Frontend (JSDoc)**
```javascript
/**
 * dev. 이름
 * 기능 : 로그인 API 호출
 */
```

---

## 주의사항

- `backend/.env`, `backend/src/main/resources/config.properties` 절대 커밋 금지 (gitignore 처리됨)
- `main` 에 직접 푸시하면 그 즉시 프로덕션 배포가 트리거됨 — PR 경유 필수
- EC2 SSH 키 교체 시 `~/.ssh/authorized_keys` + GitHub Secret `EC2_SSH_KEY` 양쪽 동시 갱신 필요
- DB 비밀번호·JWT secret 등 민감 값은 **채팅·이슈·PR 본문에 절대 평문 노출 금지** (노출 즉시 Supabase 콘솔에서 로테이트)
