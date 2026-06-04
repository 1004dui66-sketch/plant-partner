import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    }),
);

const key = env.DATA_GO_KR_SERVICE_KEY;

const extract = (text) => {
  const xmlCode = text.match(/<resultCode>([^<]+)<\/resultCode>/i)?.[1];
  const xmlMsg = text.match(/<resultMsg>([^<]+)<\/resultMsg>/i)?.[1];
  if (xmlCode) {
    return { code: xmlCode, msg: xmlMsg ?? '' };
  }
  try {
    const json = JSON.parse(text);
    return {
      code: String(json?.response?.header?.resultCode ?? ''),
      msg: String(json?.response?.header?.resultMsg ?? ''),
    };
  } catch {
    return { code: '', msg: text.slice(0, 100) };
  }
};

const probe = async (name, url, params) => {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('serviceKey', key);
  Object.entries(params).forEach(([k, v]) =>
    requestUrl.searchParams.set(k, String(v)),
  );

  const response = await fetch(requestUrl.toString());
  const text = await response.text();
  const { code, msg } = extract(text);
  console.log(
    JSON.stringify({
      name,
      http: response.status,
      resultCode: code,
      resultMsg: msg.slice(0, 120),
    }),
  );
};

const standardUrl = env.DATA_GO_KR_STANDARD_PLANT_URL;
console.log('standard_url_host', standardUrl ? new URL(standardUrl).host : 'none');

if (standardUrl) {
  try {
    const response = await fetch(standardUrl);
    console.log(
      JSON.stringify({
        name: '국가표준식물목록(URL)',
        http: response.status,
        contentType: response.headers.get('content-type'),
        note: 'apis.data.go.kr 이 아니면 잘못된 URL',
      }),
    );
  } catch (error) {
    console.log(
      JSON.stringify({
        name: '국가표준식물목록(URL)',
        error: error instanceof Error ? error.message : 'fetch failed',
      }),
    );
  }
}

await probe(
  '공기정화식물',
  'https://apis.data.go.kr/1390804/NihhsFuriAirInfo/selectPuriAirPlantList',
  { pageNo: 1, numOfRows: 2, searchWord: '몬스테라' },
);
await probe(
  '백두대간',
  'https://apis.data.go.kr/B554620/prtcPrntInfoService/getPrtcPrntInfoList',
  { pageNo: 1, numOfRows: 2, type: 'json' },
);
await probe(
  '종자자료집',
  'https://apis.data.go.kr/B554620/srbkInfoService/getSrbkInfoList',
  { pageNo: 1, numOfRows: 2, type: 'json' },
);
