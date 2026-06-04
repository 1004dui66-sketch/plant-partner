import { describe, expect, it } from 'vitest';
import {
  formatConfidence,
  parseCareSummary,
} from './analysis';

describe('analysis helpers', () => {
  it('유효한 care summary JSON을 파싱한다', () => {
    const result = parseCareSummary([
      { icon: 'water_drop', title: '물 주기', text: '주 1회' },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('물 주기');
  });

  it('잘못된 care summary는 기본값을 반환한다', () => {
    expect(parseCareSummary(null).length).toBeGreaterThan(0);
  });

  it('confidence를 퍼센트 문자열로 변환한다', () => {
    expect(formatConfidence(0.98)).toBe('98% Accuracy');
    expect(formatConfidence(null)).toBe('98% Accuracy');
  });
});
