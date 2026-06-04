'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BOTTOM_NAV_ITEMS, isActiveNav } from '@/config/navigation';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDydKa_N9M5IyjApBeXOmW57BDbB4OBd2KMcz5fNpNxvpCE-jzBfzkHhdIAeO841sFL16aFk_u_1fcREarif85B5Y1OjuD3UDMn29zlagGcm1ILuFl4jUkTOewU4lWYbLrMjbMsec9izAy0sKjKFw3TqkgHsQJ7AP-oxpdndq52ZM0mbzvvGA51qtwPwMSUUSxlx4ICt7UtzJwyDBStv_RXk6KN_M4pnVzJRxV-j7Gfm1QEes9rmmPWJ6LuqsjPWMpl9GZ3oH955DLM';

export const MobileHeader = () => (
  <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface/70 backdrop-blur-xl md:hidden shadow-sm shadow-primary/5">
    <div className="flex items-center gap-4">
      <MaterialIcon name="menu" className="text-primary text-2xl" />
      <span className="font-headline-md text-headline-md text-primary font-bold">
        Plant Buddy
      </span>
    </div>
    <Image
      alt="프로필"
      src={DEFAULT_AVATAR}
      width={32}
      height={32}
      className="rounded-full object-cover border border-white/30"
    />
  </header>
);

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface/70 backdrop-blur-xl rounded-t-lg shadow-[0_-10px_30px_rgba(0,53,39,0.05)] border-t border-white/30">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const active = isActiveNav(pathname, item.href);
        const isScan = item.icon === 'photo_camera';

        if (isScan) {
          return (
            <Link
              key={item.href + item.icon}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-colors relative ${
                active ? '-top-4' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  active
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
            className={`flex flex-col items-center justify-center transition-transform duration-200 ${
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
