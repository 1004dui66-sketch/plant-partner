'use client';

import type { ReactNode } from 'react';
import { BottomNav, MobileHeader } from './MobileHeader';
import { SideNav } from './SideNav';
import { WateringRemindersProvider } from './WateringRemindersProvider';

type AppShellProps = {
  children: ReactNode;
  showMobileHeader?: boolean;
  showSideNav?: boolean;
  showBottomNav?: boolean;
  sideNavActive?: string;
  sideNavMainActive?: string;
  className?: string;
};

export const AppShell = ({
  children,
  showMobileHeader = true,
  showSideNav = true,
  showBottomNav = true,
  sideNavActive,
  sideNavMainActive,
  className = '',
}: AppShellProps) => (
  <WateringRemindersProvider>
    <div
      className={`bg-background text-on-background font-body-md antialiased min-h-screen relative overflow-x-hidden ${className}`}
    >
      {showMobileHeader && <MobileHeader />}
      {showSideNav && (
        <SideNav
          activeOverride={sideNavActive}
          mainNavActive={sideNavMainActive}
        />
      )}
      <div className={showSideNav ? 'md:ml-80' : ''}>{children}</div>
      {showBottomNav && <BottomNav />}
    </div>
  </WateringRemindersProvider>
);
