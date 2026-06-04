'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SIDE_NAV_BOTTOM,
  SIDE_NAV_ITEMS,
  isActiveNav,
} from '@/config/navigation';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRVhudXpzpnBJdMoE8Rp9sRYkskHTQdOTa-6_PXHE2ZuCVRqHBWKELJCoZbosjIF9pIgqAL0a4xkSz_hLzfgw2yv4zvgoC10OPi1gTNWFB9HXehGp3uVLAhXVFrPBdIAqAJnKP1ZzbglZ4yTOloRaTzPt656EZ8Tla8QyNTRNFaiE3PAmdTBxR_Z9uHhs4PDk68TcUy-TMsoaz-xW7BDI_-Ws1OLV9xec8DRB4Ro5mtdqn6brj9-ZOwmNW7FxaSh2lzZhD7qt_7c7j';

type SideNavProps = {
  activeOverride?: string;
};

export const SideNav = ({ activeOverride }: SideNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex fixed inset-y-0 left-0 z-[60] flex-col py-6 bg-surface h-full w-80 rounded-r-lg shadow-2xl border-r border-white/30">
      <div className="px-6 mb-8 flex flex-col items-start">
        <Image
          alt="프로필"
          src={DEFAULT_AVATAR}
          width={64}
          height={64}
          className="rounded-full object-cover mb-4 border-2 border-primary-container/20 shadow-sm shadow-primary/10"
        />
        <h2 className="font-headline-md text-primary text-xl font-semibold">
          Botanist Explorer
        </h2>
        <p className="font-label-md text-label-md text-secondary mt-1 bg-secondary-container/50 px-2 py-0.5 rounded-full inline-block">
          Level 12 Caretaker
        </p>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">
          14 Plants Active
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {SIDE_NAV_ITEMS.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="flex items-center gap-3 text-on-surface-variant mx-2 px-4 py-3 hover:bg-surface-container-high rounded-xl transition-colors"
          >
            <MaterialIcon name={item.icon} />
            <span className="font-label-md text-label-md">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-surface-variant pt-4">
        {SIDE_NAV_BOTTOM.map((item) => {
          const active = activeOverride
            ? item.href === activeOverride
            : isActiveNav(pathname, item.href);

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex items-center gap-3 mx-2 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <MaterialIcon name={item.icon} filled={active} />
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
