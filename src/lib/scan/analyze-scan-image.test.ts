import { afterEach, describe, expect, it, vi } from 'vitest';
import { mergeVisionWithEnrichment } from './analyze-scan-image';

describe('mergeVisionWithEnrichment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Gemini 진단을 공공데이터 결과 위에 병합한다', () => {
    const merged = mergeVisionWithEnrichment(
      {
        plantName: '몬스테라',
        scientificName: 'Monstera deliciosa',
        healthStatus: 'needs-attention',
        diagnosis: '잎 끝이 갈색입니다.',
        recommendation: '습도를 높이세요.',
        confidence: 0.9,
        careSummary: [
          { icon: 'water_drop', title: '물 주기', text: '겨울에는 줄이세요.' },
        ],
      },
      {
        plantName: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        healthStatus: 'healthy',
        diagnosis: '공공데이터 설명',
        recommendation: '공공데이터 권장',
        symbolism: '상징',
        confidence: 0.92,
        careSummary: [
          { icon: 'air', title: '공기정화', text: '효과 있음' },
        ],
        badges: ['공기정화식물'],
      },
    );

    expect(merged.healthStatus).toBe('needs-attention');
    expect(merged.diagnosis).toBe('잎 끝이 갈색입니다.');
    expect(merged.badges).toContain('공기정화식물');
    expect(merged.confidence).toBeGreaterThanOrEqual(0.92);
  });
});
