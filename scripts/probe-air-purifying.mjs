import { readFileSync } from 'node:fs';

const key = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .find((l) => l.startsWith('DATA_GO_KR_SERVICE_KEY='))
  ?.split('=')
  .slice(1)
  .join('=')
  .trim();

const url = new URL(
  'https://apis.data.go.kr/1390804/NihhsFuriAirInfo/selectPuriAirPlantList',
);
url.searchParams.set('serviceKey', key);
url.searchParams.set('pageNo', '1');
url.searchParams.set('numOfRows', '3');
url.searchParams.set('searchWord', '몬스테라');

const res = await fetch(url);
const text = await res.text();
console.log('len', text.length);
console.log(text.slice(0, 800));
