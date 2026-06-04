import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.local');
const envText = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    }),
);

const key = env.DATA_GO_KR_SERVICE_KEY ?? '';
const endpoints = {
  airPurifying:
    env.DATA_GO_KR_AIR_PURIFYING_URL ||
    'https://apis.data.go.kr/1390804/NihhsFuriAirInfo/selectPuriAirPlantList',
  standardPlant: (() => {
    const base = env.DATA_GO_KR_STANDARD_PLANT_URL?.trim();
    const op = env.DATA_GO_KR_STANDARD_PLANT_OPERATION?.trim();
    if (!base) {
      return null;
    }
    if (base.includes('KpniService') && !op) {
      return null;
    }
    if (base.includes('KpniService') && op) {
      return `${base.replace(/\/$/, '')}/${op.replace(/^\//, '')}`;
    }
    return base;
  })(),
  baekduProtected:
    env.DATA_GO_KR_BAEKDU_PLANT_URL ||
    'https://apis.data.go.kr/B554620/prtcPrntInfoService/getPrtcPrntInfoList',
  seedBook:
    env.DATA_GO_KR_SEED_BOOK_URL ||
    'https://apis.data.go.kr/B554620/srbkInfoService/getSrbkInfoList',
};

const extractResultCode = (text) => {
  const xmlMatch = text.match(/<resultCode>([^<]+)<\/resultCode>/i);
  if (xmlMatch) {
    return xmlMatch[1];
  }

  try {
    const json = JSON.parse(text);
    return json?.response?.header?.resultCode ?? null;
  } catch {
    return null;
  }
};

const probe = async (name, url, params) => {
  if (!url) {
    return { name, ok: false, reason: 'URL 미설정' };
  }

  if (!key) {
    return { name, ok: false, reason: 'DATA_GO_KR_SERVICE_KEY 미설정' };
  }

  const requestUrl = new URL(url);
  requestUrl.searchParams.set('serviceKey', key);
  Object.entries(params).forEach(([paramKey, value]) => {
    requestUrl.searchParams.set(paramKey, String(value));
  });

  try {
    const response = await fetch(requestUrl.toString(), {
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    const resultCode = extractResultCode(text);

    const success =
      resultCode === '00' || resultCode === '0' || resultCode === '1';

    return {
      name,
      ok: response.ok && success,
      http: response.status,
      resultCode,
      reason:
        success
          ? '연결 성공'
          : resultCode ?? text.replace(/\s+/g, ' ').slice(0, 120),
    };
  } catch (error) {
    return {
      name,
      ok: false,
      reason: error instanceof Error ? error.message : '요청 실패',
    };
  }
};

console.log('=== 공공데이터 API 연결 확인 ===');
console.log(`serviceKey: ${key ? `설정됨 (${key.length}자)` : '미설정'}`);
const standardBase = env.DATA_GO_KR_STANDARD_PLANT_URL?.trim();
const standardOp = env.DATA_GO_KR_STANDARD_PLANT_OPERATION?.trim();
console.log(`standardPlant base: ${standardBase ? '설정됨' : '미설정'}`);
console.log(
  `standardPlant operation: ${standardOp ? standardOp : '미설정 (Swagger에서 확인)'}`,
);
console.log('');

const results = await Promise.all([
  probe('공기정화식물', endpoints.airPurifying, {
    pageNo: 1,
    numOfRows: 3,
    searchWord: '몬스테라',
  }),
  probe('국가표준식물목록', endpoints.standardPlant, {
    pageNo: 1,
    numOfRows: 3,
    searchWord: '몬스테라',
  }),
  probe('백두대간 보호식물', endpoints.baekduProtected, {
    pageNo: 1,
    numOfRows: 3,
    type: 'json',
  }),
  probe('종자자료집', endpoints.seedBook, {
    pageNo: 1,
    numOfRows: 3,
    type: 'json',
  }),
]);

for (const result of results) {
  const status = result.ok ? 'OK' : 'FAIL';
  console.log(`[${status}] ${result.name}: ${result.reason}`);
  if (result.http) {
    console.log(`       HTTP ${result.http}, resultCode=${result.resultCode ?? '-'}`);
  }
}

const successCount = results.filter((result) => result.ok).length;
console.log('');
console.log(`결과: ${successCount}/${results.length} 성공`);

process.exit(successCount === results.length ? 0 : 1);
