# 🌿 BenePicker

> 나에게 맞는 복지 혜택을 찾아주는 모바일 서비스

---

## 📁 프로젝트 구조

```
BenePicker/
├── backend/     # Spring Boot API 서버
└── frontend/    # React Native Expo 모바일 앱
```

---

## 🛠 기술 스택

### Backend
| 항목 | 기술 |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5 |
| Security | Spring Security + JWT |
| DB | Oracle + MyBatis |
| 기타 | Spring Mail, WebSocket (STOMP) |

### Frontend (Mobile)
| 항목 | 기술 |
|---|---|
| Framework | React Native (Expo SDK 55) |
| Language | TypeScript |
| 상태관리 | Context API |
| HTTP | Axios |
| 저장소 | AsyncStorage |
| 네비게이션 | React Navigation v7 |

---

## 🌿 브랜치 전략

```
main
└── develop          ← PR 통합 브랜치
    ├── backend      ← 백엔드 개발 (백엔드 + 풀스택)
    └── frontend     ← 프론트 개발 (프론트 + 풀스택)
```

| 브랜치 | 용도 | 작업자 |
|---|---|---|
| `main` | 최종 배포 — 직접 작업 금지 | - |
| `develop` | 작업물 통합 — PR 대상 | - |
| `backend` | 백엔드 기능 개발 | 백엔드, 풀스택 |
| `frontend` | 모바일 기능 개발 | 프론트, 풀스택 |

### 작업 흐름
```
backend  ──PR──▶ develop ──PR──▶ main
frontend ──PR──▶ develop ──PR──▶ main
```

### PR 규칙
- `develop` 머지 : 본인 제외 **1명 이상** 리뷰 & 승인 후 머지
- `main` 머지 : **전원 확인** 후 머지
- 본인이 올린 PR은 **본인이 직접 머지 금지**
- push 전 반드시 **pull 먼저** 받기

---

## 📝 Git 커밋 태그 규칙

| 태그 | 의미 | 예시 |
|---|---|---|
| `[Add]` | 새로운 기능 또는 파일 추가 | `[Add] 회원가입 API 추가` |
| `[Delete]` | 기능 또는 파일 삭제 | `[Delete] 미사용 파일 제거` |
| `[Update]` | 기능 수정 (로직 변경 포함) | `[Update] 로그인 유효성 검사 수정` |
| `[Fix]` | 버그 수정 | `[Fix] 토큰 만료 오류 수정` |
| `[Chore]` | 기타 작업 (주석, 설정 변경 등) | `[Chore] application.properties 수정` |

---

## ✍️ 코딩 컨벤션

### 메서드 네이밍

| prefix | 의미 | 예시 |
|---|---|---|
| `add` | 등록 | `addMember()` |
| `get` | 단건 조회 | `getMember()` |
| `getList` | 목록 조회 | `getMemberList()` |
| `update` | 수정 | `updateMember()` |
| `delete` | 삭제 | `deleteMember()` |

### 네이밍 케이스

| 구분 | 방식 | 적용 대상 |
|---|---|---|
| `camelCase` | 변수명, 함수명 | `memberEmail`, `handleLogin()` |
| `PascalCase` | 클래스, DTO, 컴포넌트 | `MemberController`, `LoginScreen` |
| `UPPER_SNAKE_CASE` | 상수 | `API_BASE_URL` |

### 주석 규칙

**백엔드 (JavaDoc)**
```java
/**
 * dev. 이름
 * 기능 : 회원 정보 조회
 * @param memberNo 회원 번호
 * @return Member 회원 정보
 */
public Member getMember(int memberNo) { ... }
```

**프론트 (JSDoc)**
```typescript
/**
 * dev. 이름
 * 기능 : 로그인 API 호출
 * @param data 이메일, 비밀번호
 * @returns accessToken, refreshToken
 */
export const login = (data: LoginRequest) => apiClient.post(...)
```

---

## ⚙️ 로컬 실행 방법

### Backend
```bash
cd backend

# config.properties 설정 (config.properties.example 참고)
cp src/main/resources/config.properties.example src/main/resources/config.properties
# config.properties에 DB / Mail / JWT 실제 값 입력 후

./gradlew bootRun
# 실행 주소: http://localhost:8080
```

### Frontend (Mobile)
```bash
cd frontend
npm install

npm run android   # Android 에뮬레이터
npm run ios       # iOS (macOS 필요)
```

> ⚠️ Android 에뮬레이터에서 백엔드 접속 시 `10.0.2.2:8080` 사용 (이미 설정됨)
> 실기기 테스트 시 `src/constants/config.ts`의 IP를 PC 로컬 IP로 변경

---

## 🚫 주의사항

- `config.properties` 절대 커밋 금지 (gitignore 처리됨)
- `main`, `develop` 브랜치 직접 작업 금지
- 본인 PR 본인 머지 금지
