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

const key = env.GEMINI_API_KEY?.trim() ?? '';
const model = env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

if (!key) {
  console.log(JSON.stringify({ ok: false, reason: 'GEMINI_API_KEY 없음' }));
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Respond with JSON only: {"ok":true}' }] }],
    generationConfig: { responseMimeType: 'application/json' },
  }),
});

const payload = await response.json();
const preview = payload.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 60) ?? null;

console.log(
  JSON.stringify({
    ok: response.ok,
    http: response.status,
    keyLength: key.length,
    model,
    error: payload.error?.message ?? null,
    preview,
  }),
);

process.exit(response.ok ? 0 : 1);
