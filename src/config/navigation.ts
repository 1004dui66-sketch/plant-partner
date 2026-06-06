export type NavIcon =
  | 'home'
  | 'potted_plant'
  | 'photo_camera'
  | 'history'
  | 'settings'
  | 'library_books'
  | 'water_drop'
  | 'psychology'
  | 'workspace_premium';

export type NavAction = 'watering-reminders';

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  mobileLabel?: string;
  navAction?: NavAction;
};

export const APP_NAME = '플랜트 버디';

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: '/collection', label: '홈', icon: 'home', mobileLabel: '홈' },
  { href: '/collection', label: '컬렉션', icon: 'potted_plant', mobileLabel: '컬렉션' },
  { href: '/scan', label: '인식', icon: 'photo_camera', mobileLabel: '인식' },
  { href: '/history', label: '히스토리', icon: 'history', mobileLabel: '히스토리' },
  { href: '/settings', label: '설정', icon: 'settings', mobileLabel: '설정' },
];

export const SIDE_NAV_ITEMS: NavItem[] = [
  { href: '/collection', label: '식물 도감', icon: 'library_books' },
  { href: '/history', label: '케어 히스토리', icon: 'history' },
  {
    href: '/collection',
    label: '물주기 알림',
    icon: 'water_drop',
    navAction: 'watering-reminders',
  },
  { href: '/scan', label: 'AI 전문가 상담', icon: 'psychology' },
  { href: '/settings', label: '프리미엄 지원', icon: 'workspace_premium' },
];

export const SIDE_NAV_BOTTOM: NavItem[] = [
  { href: '/collection', label: '홈', icon: 'home' },
  { href: '/collection', label: '컬렉션', icon: 'potted_plant' },
  { href: '/settings', label: '설정', icon: 'settings' },
];

export type AppRoute =
  | '/collection'
  | '/history'
  | '/scan'
  | '/scan/result'
  | '/settings'
  | '/login'
  | `/plants/${string}`
  | `/plants/${string}/log`;

export const isActiveNav = (pathname: string, href: string): boolean => {
  if (href === '/collection') {
    return pathname === '/collection' || pathname.startsWith('/plants');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

/** Stitch kr_2: 컬렉션 탭만 활성 (홈·컬렉션 href가 같을 때 구분) */
export const isBottomNavActive = (
  pathname: string,
  item: NavItem,
): boolean => {
  if (item.icon === 'potted_plant') {
    return pathname === '/collection' || pathname.startsWith('/plants');
  }

  if (item.icon === 'home') {
    return pathname === '/';
  }

  return isActiveNav(pathname, item.href);
};

export const isWateringRemindersQuery = (value: string | null): boolean =>
  value === 'overdue';

/** Stitch kr_3/kr_7: 인식 탭 FAB vs pill 강조 */
export type BottomNavScanStyle = 'fab' | 'fab-elevated' | 'pill-elevated';

export const getBottomNavScanStyle = (pathname: string): BottomNavScanStyle => {
  if (pathname.startsWith('/scan/result')) {
    return 'pill-elevated';
  }
  if (pathname === '/settings') {
    return 'fab-elevated';
  }
  return 'fab';
};

export const isSideNavMainActive = (
  pathname: string,
  item: NavItem,
  mainNavActive?: string,
): boolean => {
  if (mainNavActive) {
    return item.href === mainNavActive;
  }

  if (item.navAction) {
    return false;
  }

  if (item.icon === 'psychology') {
    return pathname.startsWith('/scan');
  }

  return isActiveNav(pathname, item.href);
};
