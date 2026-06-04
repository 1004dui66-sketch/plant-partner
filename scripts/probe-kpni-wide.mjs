import { readFileSync } from 'node:fs';

const key = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .find((line) => line.startsWith('DATA_GO_KR_SERVICE_KEY='))
  ?.split('=')
  .slice(1)
  .join('=')
  .trim();

const base = 'https://apis.data.go.kr/1400119/KpniService';
const prefixes = ['get', 'select'];
const cores = [
  'Kpni',
  'Kpn',
  'KpniStd',
  'KpniStnd',
  'KpniSttus',
  'KpniList',
  'KpniInfo',
  'KpniData',
  'KpniSearch',
  'KpniNm',
  'KpniName',
  'StdPlnt',
  'StdPlant',
  'NatStdPlnt',
  'NatStdPlant',
  'NtPlnt',
  'NtPlant',
  'Plnt',
  'Plant',
  'NtnlStdPlnt',
  'NtnStdPlnt',
  'KornStdPlnt',
  'KornStdPlant',
  'StndPlnt',
  'StndPlant',
];
const suffixes = [
  '',
  'List',
  'Info',
  'InfoList',
  'Inqire',
  'InfoInqire',
  'Search',
  'SearchList',
  'Data',
  'DataList',
  'Nm',
  'NmList',
  'Name',
  'NameList',
];

const ops = new Set();
for (const prefix of prefixes) {
  for (const core of cores) {
    for (const suffix of suffixes) {
      ops.add(`${prefix}${core}${suffix}`);
    }
  }
}

const found = [];
for (const op of ops) {
  const url = new URL(`${base}/${op}`);
  url.searchParams.set('serviceKey', key);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '1');
  url.searchParams.set('type', 'json');

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (response.status === 404) {
      continue;
    }

    const text = await response.text();
    let code = '';
    let msg = '';
    try {
      const json = JSON.parse(text);
      code = String(json?.response?.header?.resultCode ?? '');
      msg = String(json?.response?.header?.resultMsg ?? '');
    } catch {
      code = text.match(/<resultCode>([^<]+)<\/resultCode>/i)?.[1] ?? '';
      msg = text.match(/<resultMsg>([^<]+)<\/resultMsg>/i)?.[1] ?? '';
    }

    found.push({ op, http: response.status, code, msg: msg.slice(0, 60) });
  } catch {
    // skip timeout
  }
}

console.log('found', found.length);
for (const item of found) {
  console.log(JSON.stringify(item));
}
