import { describe, expect, it } from 'vitest';
import {
  getBottomNavScanStyle,
  isBottomNavActive,
  isActiveNav,
  isSideNavMainActive,
} from './navigation';
import { BOTTOM_NAV_ITEMS, SIDE_NAV_ITEMS } from './navigation';

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

describe('isBottomNavActive', () => {
  it('컬렉션 화면에서는 컬렉션 탭만 활성화한다', () => {
    const home = BOTTOM_NAV_ITEMS.find((item) => item.icon === 'home');
    const collection = BOTTOM_NAV_ITEMS.find(
      (item) => item.icon === 'potted_plant',
    );

    expect(home).toBeDefined();
    expect(collection).toBeDefined();
    expect(isBottomNavActive('/collection', home!)).toBe(false);
    expect(isBottomNavActive('/collection', collection!)).toBe(true);
  });
});

describe('getBottomNavScanStyle', () => {
  it('인식 결과는 pill-elevated 스타일을 사용한다', () => {
    expect(getBottomNavScanStyle('/scan/result?id=1')).toBe('pill-elevated');
  });

  it('설정 화면은 fab-elevated 스타일을 사용한다', () => {
    expect(getBottomNavScanStyle('/settings')).toBe('fab-elevated');
  });
});

describe('isSideNavMainActive', () => {
  it('히스토리 화면에서 케어 히스토리 항목을 활성화한다', () => {
    const historyItem = SIDE_NAV_ITEMS.find((item) => item.icon === 'history');
    expect(historyItem).toBeDefined();
    expect(isSideNavMainActive('/history', historyItem!)).toBe(true);
  });
});
