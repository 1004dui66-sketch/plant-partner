/**
 * .env.local → Vercel (production만, 빠른 동기화)
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ENV_FILE = resolve(process.cwd(), '.env.local');
const SITE_URL = 'https://plant-partner.vercel.app';

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
  'GEMINI_MODEL',
];

const SENSITIVE = new Set(['DATA_GO_KR_SERVICE_KEY', 'GEMINI_API_KEY']);

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

const addProduction = (key, value) => {
  const sensitiveFlag = SENSITIVE.has(key) ? ' --sensitive' : '';
  execSync(
    `npx vercel env add ${key} production --yes --force --value ${JSON.stringify(value)}${sensitiveFlag}`,
    { stdio: 'inherit', encoding: 'utf8', shell: true },
  );
};

if (!existsSync(ENV_FILE)) {
  console.error('.env.local 없음');
  process.exit(1);
}

const env = parseEnv(readFileSync(ENV_FILE, 'utf8'));
let count = 0;

for (const key of KEYS) {
  let value = env[key]?.trim();
  if (!value && key !== 'NEXT_PUBLIC_SITE_URL') {
    console.log(`[skip] ${key}`);
    continue;
  }
  if (key === 'NEXT_PUBLIC_SITE_URL') {
    value = SITE_URL;
  }
  console.log(`[sync] ${key}`);
  addProduction(key, value);
  count += 1;
}

console.log(`\nproduction 동기화 완료: ${count}개`);
