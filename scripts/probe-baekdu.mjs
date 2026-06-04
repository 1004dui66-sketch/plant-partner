import { readFileSync } from 'node:fs';

const key = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .find((l) => l.startsWith('DATA_GO_KR_SERVICE_KEY='))
  ?.split('=')
  .slice(1)
  .join('=')
  .trim();

const url = new URL(
  'https://apis.data.go.kr/B554620/prtcPrntInfoService/getPrtcPrntInfoList',
);
url.searchParams.set('serviceKey', key);
url.searchParams.set('pageNo', '1');
url.searchParams.set('numOfRows', '2');
url.searchParams.set('type', 'json');

const res = await fetch(url);
const text = await res.text();
console.log(text.slice(0, 600));
