import { describe, expect, it } from 'vitest';
import {
  buildLogMemo,
  parseActivityTypeFromMemo,
  parseNotesFromMemo,
} from './activities';

describe('activities', () => {
  it('메모에 활동 유형을 포함한다', () => {
    expect(buildLogMemo('water', '잘 자람')).toBe('[water] 잘 자람');
    expect(buildLogMemo('prune', '')).toBe('[prune]');
  });

  it('메모에서 활동 유형을 파싱한다', () => {
    expect(parseActivityTypeFromMemo('[fertilize] 비료 투여')).toBe('fertilize');
    expect(parseActivityTypeFromMemo(null)).toBe('water');
  });

  it('메모에서 본문만 추출한다', () => {
    expect(parseNotesFromMemo('[water] 새 잎')).toBe('새 잎');
  });
});
