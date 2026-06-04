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

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  mobileLabel?: string;
};

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: '/collection', label: '홈', icon: 'home', mobileLabel: '홈' },
  { href: '/collection', label: '컬렉션', icon: 'potted_plant', mobileLabel: '컬렉션' },
  { href: '/scan', label: '인식', icon: 'photo_camera', mobileLabel: '인식' },
  { href: '/history', label: '히스토리', icon: 'history', mobileLabel: '히스토리' },
  { href: '/settings', label: '설정', icon: 'settings', mobileLabel: '설정' },
];

export const SIDE_NAV_ITEMS: NavItem[] = [
  { href: '/collection', label: 'Plant Encyclopedia', icon: 'library_books' },
  { href: '/history', label: 'Watering Reminders', icon: 'water_drop' },
  { href: '/scan', label: 'AI Expert Chat', icon: 'psychology' },
  { href: '/settings', label: 'Premium Support', icon: 'workspace_premium' },
];

export const SIDE_NAV_BOTTOM: NavItem[] = [
  { href: '/collection', label: 'Home', icon: 'home' },
  { href: '/collection', label: 'Collection', icon: 'potted_plant' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
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
