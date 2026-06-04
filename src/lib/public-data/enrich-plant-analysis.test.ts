import { afterEach, describe, expect, it, vi } from 'vitest';
import { enrichPlantAnalysis } from './enrich-plant-analysis';

describe('enrichPlantAnalysis', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('키가 없으면 mock 기반 결과를 반환한다', async () => {
    vi.stubEnv('DATA_GO_KR_SERVICE_KEY', '');

    const result = await enrichPlantAnalysis('Monstera Deliciosa');

    expect(result.plantName).toBe('Monstera Deliciosa');
    expect(result.careSummary.length).toBeGreaterThan(0);
  });

  it('공기정화 API 결과를 병합한다', async () => {
    vi.stubEnv('DATA_GO_KR_SERVICE_KEY', 'test-key');

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          response: {
            header: { resultCode: '00' },
            body: {
              items: {
                item: [
                  {
                    title: 'Monstera Deliciosa',
                    content: '포름알데히드 흡수에 효과적입니다.',
                  },
                ],
              },
            },
          },
        }),
      ),
    );

    const result = await enrichPlantAnalysis('Monstera');

    expect(result.badges).toContain('공기정화식물');
    expect(result.diagnosis).toContain('포름알데히드');
  });
});
