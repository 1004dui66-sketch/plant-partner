import { describe, expect, it } from 'vitest';
import {
  deriveCaretakerProgress,
  formatActivePlantsLabel,
  formatCaretakerLabel,
} from './caretaker-tier';

describe('deriveCaretakerProgress', () => {
  it('활성 식물이 없으면 초보 등급을 반환한다', () => {
    expect(deriveCaretakerProgress(0)).toEqual({
      level: 1,
      tier: '초보 식집사',
    });
  });

  it('3개 이상이면 식물 집사 등급을 반환한다', () => {
    expect(deriveCaretakerProgress(3).tier).toBe('식물 집사');
    expect(deriveCaretakerProgress(9).tier).toBe('식물 집사');
  });

  it('10개 이상이면 숙련 집사 등급을 반환한다', () => {
    expect(deriveCaretakerProgress(14)).toEqual({
      level: 15,
      tier: '숙련 집사',
    });
  });
});

describe('formatCaretakerLabel', () => {
  it('레벨과 등급을 포맷한다', () => {
    expect(
      formatCaretakerLabel({ level: 12, tier: '식물 집사' }),
    ).toBe('Lv.12 식물 집사');
  });
});

describe('formatActivePlantsLabel', () => {
  it('활성 식물 수를 포맷한다', () => {
    expect(formatActivePlantsLabel(14)).toBe('활성 식물 14개');
  });
});
