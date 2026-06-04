import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchDataGoKrJson } from './client';

describe('fetchDataGoKrJson', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('XML 응답을 파싱한다', async () => {
    vi.stubEnv('DATA_GO_KR_SERVICE_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          `<response><header><resultCode>00</resultCode></header><body><items><item><title>몬스테라</title></item></items></body></response>`,
          { headers: { 'content-type': 'application/xml' } },
        ),
      ),
    );

    const payload = await fetchDataGoKrJson(
      'https://apis.data.go.kr/1390804/NihhsFuriAirInfo/selectPuriAirPlantList',
      { searchWord: '몬스테라', type: 'xml' },
      { preferJson: false },
    );

    expect(payload).toEqual({
      header: { resultCode: '00' },
      body: { items: { item: [{ title: '몬스테라' }] } },
    });
  });
});
