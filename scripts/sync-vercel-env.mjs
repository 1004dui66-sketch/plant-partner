/**
 * .env.local → Vercel Environment Variables (production + preview)
 * 사용: npx vercel link 후 node scripts/sync-vercel-env.mjs
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ENV_FILE = resolve(process.cwd(), '.env.local');

const KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'DATA_GO_KR_SERVICE_KEY',
  'DATA_GO_KR_AIR_PURIFYING_URL',
  'DATA_GO_KR_STANDARD_PLANT_URL',
  'DATA_GO_KR_STANDARD_PLANT_OPERATION',
  'DATA_GO_KR_BAEKDU_PLANT_URL',
  'DATA_GO_KR_SEED_BOOK_URL',
  'GEMINI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GEMINI_MODEL',
];

const ENVIRONMENTS = ['production', 'preview'];

const parseEnv = (text) =>
  Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter((line) => line && !line.trim().startsWith('#'))
      .map((line) => {
        const idx = line.indexOf('=');
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
      })
      .filter(([key]) => key.length > 0),
  );

const PRODUCTION_SITE_URL = 'https://plant-partner.vercel.app';

const getValueForVercel = (key, value, environment) => {
  if (key === 'NEXT_PUBLIC_SITE_URL') {
    return PRODUCTION_SITE_URL;
  }
  return value;
};

const isSensitive = (key) =>
  key === 'DATA_GO_KR_SERVICE_KEY' ||
  key === 'GEMINI_API_KEY' ||
  key === 'GOOGLE_AI_API_KEY';

const addEnv = (key, value, environment) => {
  const sensitiveFlag = isSensitive(key) ? ' --sensitive' : '';
  execSync(
    `npx vercel env add ${key} ${environment} --yes --force --value ${JSON.stringify(value)}${sensitiveFlag}`,
    { stdio: 'inherit', encoding: 'utf8' },
  );
};

if (!existsSync(ENV_FILE)) {
  console.error('.env.local 파일이 없습니다.');
  process.exit(1);
}

const env = parseEnv(readFileSync(ENV_FILE, 'utf8'));
let synced = 0;

for (const key of KEYS) {
  const value = env[key]?.trim();
  if (!value) {
    console.log(`[skip] ${key} (값 없음)`);
    continue;
  }

  for (const environment of ENVIRONMENTS) {
    const vercelValue = getValueForVercel(key, value, environment);
    console.log(`[sync] ${key} → ${environment}`);
    addEnv(key, vercelValue, environment);
    synced += 1;
  }
}

console.log(`\n완료: ${synced}개 환경 변수 항목 동기화`);
