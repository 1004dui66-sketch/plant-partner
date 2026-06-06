# Plant Buddy — GitHub · Vercel 배포 가이드

## 1. GitHub 원격 저장소

**저장소:** [1004dui66-sketch/plant-partner](https://github.com/1004dui66-sketch/plant-partner)

로컬 `main`은 이미 `origin`에 push되어 있습니다. Vercel 프로젝트도 이 저장소와 연결되어 있습니다.

```powershell
cd c:\dev\식물도감
git remote -v
git push origin main
```

---

## 2. Vercel 연결

1. [vercel.com](https://vercel.com) 로그인 → **Add New → Project**
2. **Import Git Repository** → 위 GitHub 저장소 선택
3. Framework: **Next.js** (자동 감지)
4. Root Directory: `.` (기본값)
5. **Environment Variables** 아래 표를 Production·Preview에 동일하게 입력
6. Deploy

### 환경 변수 일괄 동기화 (선택)

`.env.local`에 값이 채워져 있으면:

```powershell
npx vercel link --yes --project plant-partner
node scripts/sync-vercel-env.mjs
```

`NEXT_PUBLIC_SUPABASE_*`가 비어 있으면 [Vercel Dashboard → plant-partner → Settings → Environment Variables](https://vercel.com)에서 직접 입력하세요.

배포 후 Supabase **Authentication → URL Configuration** 에 Vercel 도메인을 추가합니다.

| 항목 | 값 예시 |
|------|---------|
| Site URL | `https://<프로젝트>.vercel.app` |
| Redirect URLs | `https://<프로젝트>.vercel.app/auth/callback` |

---

## 3. Vercel 환경 변수 체크리스트

`.env.example` 기준. **Production**과 **Preview** 모두 설정 권장.

### 필수 (앱 동작)

| 변수 | 설명 | Vercel 예시 |
|------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | OAuth·리다이렉트용 공개 URL | `https://your-app.vercel.app` |

### 공공데이터 (스캔 결과 보강, 서버 전용)

| 변수 | 설명 | 비고 |
|------|------|------|
| `DATA_GO_KR_SERVICE_KEY` | data.go.kr Decoding 인증키 | `NEXT_PUBLIC_` 붙이지 않음 |
| `DATA_GO_KR_AIR_PURIFYING_URL` | 공기정화식물 API | 기본값 있음, 생략 가능 |
| `DATA_GO_KR_STANDARD_PLANT_URL` | 국가표준식물 Kpni 베이스 | `https://apis.data.go.kr/1400119/KpniService` |
| `DATA_GO_KR_STANDARD_PLANT_OPERATION` | Kpni Swagger **요청주소** operation | Swagger에서 복사 (미설정 시 3/4 API만 동작) |
| `DATA_GO_KR_BAEKDU_PLANT_URL` | 백두대간 보호식물 | `.env.example` 참고 |
| `DATA_GO_KR_SEED_BOOK_URL` | 종자자료집 | `.env.example` 참고 |

### Google AI Studio / Gemini (스캔 이미지 식별, 서버 전용)

| 변수 | 설명 | 비고 |
|------|------|------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) API key | `NEXT_PUBLIC_` 붙이지 않음 |
| `GOOGLE_AI_API_KEY` | `GEMINI_API_KEY` 대체 이름 | 둘 중 하나만 설정 |
| `GEMINI_MODEL` | 모델 ID (선택) | 기본 `gemini-2.5-flash` |

미설정 시 스캔은 mock 식물명 + 공공데이터 보강만 사용합니다.

---

## 4. 배포 후 확인

- [ ] `/login` — Supabase 로그인·Google OAuth
- [ ] `/collection` — 식물 목록
- [ ] `/scan` — 카메라·업로드
- [ ] `/scan/result` — 분석 결과
- [ ] Supabase Storage 버킷·RLS 마이그레이션 적용 (`supabase/migrations/`)

로컬 검증:

```powershell
npm run typecheck
npm test
npm run build
```

---

## 5. Firebase 관련

이 프로젝트는 **Firebase를 사용하지 않습니다.** 인증·DB·Storage는 **Supabase**입니다.
