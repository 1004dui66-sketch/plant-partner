'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  APP_NAME,
  BOTTOM_NAV_ITEMS,
  getBottomNavScanStyle,
  isBottomNavActive,
} from '@/config/navigation';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDydKa_N9M5IyjApBeXOmW57BDbB4OBd2KMcz5fNpNxvpCE-jzBfzkHhdIAeO841sFL16aFk_u_1fcREarif85B5Y1OjuD3UDMn29zlagGcm1ILuFl4jUkTOewU4lWYbLrMjbMsec9izAy0sKjKFw3TqkgHsQJ7AP-oxpdndq52ZM0mbzvvGA51qtwPwMSUUSxlx4ICt7UtzJwyDBStv_RXk6KN_M4pnVzJRxV-j7Gfm1QEes9rmmPWJ6LuqsjPWMpl9GZ3oH955DLM';

export const MobileHeader = () => {
  const pathname = usePathname();
  const showSearch = pathname === '/history';

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface/70 backdrop-blur-xl md:hidden shadow-sm shadow-primary/5 border-b border-white/30">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="메뉴"
          className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors active:scale-95 duration-150"
        >
          <MaterialIcon name="menu" className="text-2xl" />
        </button>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">
          {APP_NAME}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {showSearch ? (
          <button
            type="button"
            aria-label="검색"
            className="text-on-surface-variant hover:bg-primary-container/20 p-2 rounded-full transition-colors"
          >
            <MaterialIcon name="search" />
          </button>
        ) : null}
        <Image
          alt="프로필"
          src={DEFAULT_AVATAR}
          width={40}
          height={40}
          className="rounded-full object-cover border-2 border-primary/20"
        />
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const pathname = usePathname();
  const scanStyle = getBottomNavScanStyle(pathname);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface/70 backdrop-blur-xl rounded-t-lg shadow-[0_-10px_30px_rgba(0,53,39,0.05)] border-t border-white/30">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const active = isBottomNavActive(pathname, item);
        const isScan = item.icon === 'photo_camera';

        if (isScan && scanStyle === 'pill-elevated') {
          return (
            <Link
              key={item.href + item.icon}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-transform duration-200 py-1 px-3 ${
                active
                  ? 'bg-primary text-on-primary rounded-full px-4 py-1 scale-110 shadow-lg shadow-primary/20 -translate-y-2'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <MaterialIcon name={item.icon} filled={active} />
              <span className="font-label-md text-label-md mt-1 text-[10px]">
                {item.mobileLabel}
              </span>
            </Link>
          );
        }

        if (isScan) {
          const elevated = scanStyle === 'fab-elevated' || active;
          return (
            <Link
              key={item.href + item.icon}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-colors relative ${
                elevated ? '-top-4' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  active || scanStyle === 'fab-elevated'
                    ? 'bg-primary text-on-primary shadow-primary/20'
                    : 'bg-primary/90 text-on-primary'
                }`}
              >
                <MaterialIcon name={item.icon} filled={active} />
              </div>
              <span className="font-label-md text-label-md mt-2 text-[10px]">
                {item.mobileLabel}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href + item.icon}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-transform duration-200 active:scale-90 ${
              active
                ? 'bg-primary text-on-primary rounded-full px-4 py-1 scale-90'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <MaterialIcon name={item.icon} filled={active} />
            <span className="font-label-md text-label-md mt-1 text-[10px]">
              {item.mobileLabel}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
