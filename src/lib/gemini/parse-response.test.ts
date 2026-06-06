import { describe, expect, it } from 'vitest';
import {
  extractGeminiText,
  parseVisionPlantJson,
} from './parse-response';

describe('parseVisionPlantJson', () => {
  it('parses valid vision JSON', () => {
    const result = parseVisionPlantJson(
      JSON.stringify({
        plantName: '몬스테라',
        scientificName: 'Monstera deliciosa',
        healthStatus: 'healthy',
        diagnosis: '잎이 건강합니다.',
        recommendation: '간접광을 유지하세요.',
        confidence: 0.91,
        careSummary: [
          { icon: 'water_drop', title: '물 주기', text: '일주일에 한 번' },
        ],
      }),
    );

    expect(result?.plantName).toBe('몬스테라');
    expect(result?.confidence).toBe(0.91);
    expect(result?.careSummary[0]?.title).toBe('물 주기');
  });

  it('returns null for invalid JSON', () => {
    expect(parseVisionPlantJson('not-json')).toBeNull();
    expect(parseVisionPlantJson(JSON.stringify({ plantName: '' }))).toBeNull();
  });
});

describe('extractGeminiText', () => {
  it('extracts candidate text', () => {
    const text = extractGeminiText({
      candidates: [{ content: { parts: [{ text: '{"plantName":"A"}' }] } }],
    });

    expect(text).toBe('{"plantName":"A"}');
  });
});
