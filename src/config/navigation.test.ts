import { describe, expect, it } from 'vitest';
import { isActiveNav } from './navigation';

describe('isActiveNav', () => {
  it('컬렉션 경로에서 plants 하위 경로도 활성화한다', () => {
    expect(isActiveNav('/plants/abc', '/collection')).toBe(true);
    expect(isActiveNav('/collection', '/collection')).toBe(true);
  });

  it('스캔 결과 페이지에서 scan 탭을 활성화한다', () => {
    expect(isActiveNav('/scan/result', '/scan')).toBe(true);
  });

  it('다른 탭은 정확히 일치할 때만 활성화한다', () => {
    expect(isActiveNav('/settings', '/history')).toBe(false);
    expect(isActiveNav('/history', '/history')).toBe(true);
  });
});
