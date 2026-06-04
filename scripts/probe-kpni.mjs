import { readFileSync } from 'node:fs';

const key = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .find((line) => line.startsWith('DATA_GO_KR_SERVICE_KEY='))
  ?.split('=')
  .slice(1)
  .join('=')
  .trim();

const base = 'https://apis.data.go.kr/1400119/KpniService';
const candidates = [
  'getKpniList',
  'getKpniInfoList',
  'getKpniInfoInqire',
  'getKpniInqire',
  'getKpniSttusList',
  'getKpniSttusInfoList',
  'getKpniSttusInfoInqire',
  'selectKpniList',
  'selectKpniInfoList',
  'getPlantList',
  'getPlantInfoList',
  'selectPlantList',
  'getStdPlantList',
  'getStdPlantInfoList',
  'getNatStdPlntList',
  'getNatStdPlntInfoList',
  'getNtPlntList',
  'getNtPlntInfoList',
  'getKornStdPlntList',
  'getKornStdPlntInfoList',
];

for (const op of candidates) {
  const url = new URL(`${base}/${op}`);
  url.searchParams.set('serviceKey', key);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '1');
  url.searchParams.set('type', 'json');

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (response.status === 404) {
      continue;
    }

    const text = await response.text();
    const code =
      text.match(/<resultCode>([^<]+)<\/resultCode>/i)?.[1] ??
      JSON.parse(text)?.response?.header?.resultCode;
    const msg =
      text.match(/<resultMsg>([^<]+)<\/resultMsg>/i)?.[1] ??
      JSON.parse(text)?.response?.header?.resultMsg;

    console.log(JSON.stringify({ op, http: response.status, code, msg }));
  } catch {
    // skip
  }
}
