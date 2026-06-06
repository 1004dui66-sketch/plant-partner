import { readFileSync } from 'node:fs';

export const loadEnvFile = (path = '.env.local') =>
  Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.trim().startsWith('#'))
      .map((line) => {
        const idx = line.indexOf('=');
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
      }),
  );

export const projectRefFromUrl = (url) =>
  url.replace('https://', '').split('.')[0];
