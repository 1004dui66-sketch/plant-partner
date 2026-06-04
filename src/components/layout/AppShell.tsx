import type { ReactNode } from 'react';
import { BottomNav, MobileHeader } from './MobileHeader';
import { SideNav } from './SideNav';

type AppShellProps = {
  children: ReactNode;
  showMobileHeader?: boolean;
  showSideNav?: boolean;
  showBottomNav?: boolean;
  sideNavActive?: string;
  className?: string;
};

export const AppShell = ({
  children,
  showMobileHeader = true,
  showSideNav = true,
  showBottomNav = true,
  sideNavActive,
  className = '',
}: AppShellProps) => (
  <div
    className={`bg-background text-on-background font-body-md antialiased min-h-screen relative overflow-x-hidden ${className}`}
  >
    {showMobileHeader && <MobileHeader />}
    {showSideNav && <SideNav activeOverride={sideNavActive} />}
    <div className={showSideNav ? 'md:ml-80' : ''}>{children}</div>
    {showBottomNav && <BottomNav />}
  </div>
);
