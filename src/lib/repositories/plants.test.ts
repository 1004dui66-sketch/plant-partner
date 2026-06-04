import { describe, expect, it } from 'vitest';
import { computePlantStatus } from './plants';

describe('computePlantStatus', () => {
  it('물 주기 기록이 없으면 물 필요 상태를 반환한다', () => {
    const result = computePlantStatus(null);
    expect(result.status).toBe('needs-water');
    expect(result.lastWatered).toBe('기록 없음');
  });

  it('10일 이상 지나면 물 필요 상태를 반환한다', () => {
    const old = new Date(Date.now() - 12 * 86_400_000).toISOString();
    const result = computePlantStatus(old);
    expect(result.status).toBe('needs-water');
  });

  it('3일 이내면 성장 중 상태를 반환한다', () => {
    const recent = new Date(Date.now() - 2 * 86_400_000).toISOString();
    const result = computePlantStatus(recent);
    expect(result.status).toBe('healthy');
    expect(result.statusLabel).toBe('성장 중');
  });
});
