import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    }),
);

const SITE = 'https://plant-partner.vercel.app';
const items = [
  ['NEXT_PUBLIC_SITE_URL', SITE, false],
  ['DATA_GO_KR_SERVICE_KEY', env.DATA_GO_KR_SERVICE_KEY, true],
  ['DATA_GO_KR_AIR_PURIFYING_URL', env.DATA_GO_KR_AIR_PURIFYING_URL, false],
  ['DATA_GO_KR_BAEKDU_PLANT_URL', env.DATA_GO_KR_BAEKDU_PLANT_URL, false],
  ['DATA_GO_KR_SEED_BOOK_URL', env.DATA_GO_KR_SEED_BOOK_URL, false],
  ['GEMINI_API_KEY', env.GEMINI_API_KEY, true],
  ['GEMINI_MODEL', env.GEMINI_MODEL || 'gemini-2.5-flash', false],
].filter(([, value]) => Boolean(value?.trim()));

for (const [key, value, sensitive] of items) {
  const flag = sensitive ? ' --sensitive' : '';
  console.log(`sync ${key}`);
  execSync(
    `npx vercel env add ${key} production --yes --force --value ${JSON.stringify(value)}${flag}`,
    { stdio: 'inherit', shell: true, timeout: 120_000 },
  );
}

console.log('done', items.length);
