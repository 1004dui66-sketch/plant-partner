import { getDataGoKrServiceKey } from '@/lib/public-data/config';
import { parseDataGoKrXml } from '@/lib/public-data/parse-xml';

export type DataGoKrQuery = Record<string, string | number | undefined>;

export type DataGoKrFetchOptions = {
  preferJson?: boolean;
};

export const buildDataGoKrUrl = (
  endpoint: string,
  params: DataGoKrQuery,
  options: DataGoKrFetchOptions = {},
): URL => {
  const url = new URL(endpoint);
  const serviceKey = getDataGoKrServiceKey();

  if (!serviceKey) {
    throw new Error('DATA_GO_KR_SERVICE_KEY가 설정되지 않았습니다.');
  }

  url.searchParams.set('serviceKey', serviceKey);
  url.searchParams.set('pageNo', String(params.pageNo ?? 1));
  url.searchParams.set('numOfRows', String(params.numOfRows ?? 10));

  const preferJson = options.preferJson ?? params.type !== 'xml';

  if (preferJson && params.type !== 'xml') {
    url.searchParams.set('type', 'json');
  }

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      ['pageNo', 'numOfRows', 'type'].includes(key)
    ) {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();

  if (contentType.includes('json') || text.trimStart().startsWith('{')) {
    return JSON.parse(text) as unknown;
  }

  return parseDataGoKrXml(text);
};

export const fetchDataGoKrJson = async (
  endpoint: string,
  params: DataGoKrQuery,
  options: DataGoKrFetchOptions = {},
): Promise<unknown> => {
  const url = buildDataGoKrUrl(endpoint, params, options);
  const response = await fetch(url.toString(), { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`공공데이터 API HTTP 오류: ${response.status}`);
  }

  return parseResponseBody(response);
};
