import { afterEach, describe, expect, it, vi } from 'vitest';
import { identifyPlantFromImage } from './identify-plant';

describe('identifyPlantFromImage', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('키가 없으면 null을 반환한다', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    await expect(
      identifyPlantFromImage('https://example.com/plant.jpg'),
    ).resolves.toBeNull();
  });

  it('Gemini 응답을 파싱한다', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL) => {
        const href = String(url);

        if (href.includes('example.com')) {
          return new Response(new Uint8Array([1, 2, 3]), {
            headers: { 'content-type': 'image/jpeg' },
          });
        }

        return Response.json({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      plantName: '스킨답서스',
                      scientificName: 'Epipremnum aureum',
                      healthStatus: 'healthy',
                      diagnosis: '잎색이 좋습니다.',
                      recommendation: '물을 조금 줄이세요.',
                      confidence: 0.88,
                      careSummary: [],
                    }),
                  },
                ],
              },
            },
          ],
        });
      }),
    );

    const result = await identifyPlantFromImage('https://example.com/plant.jpg');

    expect(result?.plantName).toBe('스킨답서스');
    expect(result?.scientificName).toBe('Epipremnum aureum');
  });
});
