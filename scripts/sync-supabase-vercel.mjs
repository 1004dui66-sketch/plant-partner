import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    }),
);

const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

for (const key of keys) {
  const value = env[key]?.trim();
  if (!value) {
    console.log(`[skip] ${key}`);
    continue;
  }
  for (const target of ['production', 'preview']) {
    execSync(
      `npx vercel env add ${key} ${target} --yes --force --value ${JSON.stringify(value)}`,
      { stdio: 'inherit' },
    );
  }
}

console.log('Supabase env synced to Vercel');
