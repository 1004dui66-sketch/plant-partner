# Plant Buddy (식물도감)

Next.js 15 · Supabase · 공공데이터포털 API 기반 반려식물 관리 앱.

## 로컬 실행

```powershell
npm install
cp .env.example .env.local
# .env.local 에 Supabase·공공데이터 키 입력
npm run dev
```

## 배포

GitHub · Vercel 설정은 [docs/DEPLOY.md](docs/DEPLOY.md) 를 참고하세요.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm test` | Vitest |
| `npm run typecheck` | TypeScript 검사 |
| `node scripts/verify-public-data-api.mjs` | 공공데이터 API 연결 확인 |
