'use client';

import Image from 'next/image';
import { useUserDashboardContext } from '@/components/layout/UserDashboardProvider';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRVhudXpzpnBJdMoE8Rp9sRYkskHTQdOTa-6_PXHE2ZuCVRqHBWKELJCoZbosjIF9pIgqAL0a4xkSz_hLzfgw2yv4zvgoC10OPi1gTNWFB9HXehGp3uVLAhXVFrPBdIAqAJnKP1ZzbglZ4yTOloRaTzPt656EZ8Tla8QyNTRNFaiE3PAmdTBxR_Z9uHhs4PDk68TcUy-TMsoaz-xW7BDI_-Ws1OLV9xec8DRB4Ro5mtdqn6brj9-ZOwmNW7FxaSh2lzZhD7qt_7c7j';

type DashboardUserStatusBarProps = {
  readonly className?: string;
};

/** 대시보드 상단: profiles 등급 + 활성 식물 수 (Supabase Realtime) */
export const DashboardUserStatusBar = ({
  className = '',
}: DashboardUserStatusBarProps) => {
  const {
    displayName,
    caretakerLabel,
    activePlantsLabel,
    isLoading,
    error,
  } = useUserDashboardContext();

  return (
    <section
      className={`glass-panel rounded-xl p-4 md:p-5 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,53,39,0.05)] ${className}`}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <Image
        alt={displayName}
        src={DEFAULT_AVATAR}
        width={48}
        height={48}
        className="rounded-full object-cover border-2 border-primary/20 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-headline-md text-primary text-lg font-semibold truncate">
          {isLoading ? '불러오는 중...' : displayName}
        </h2>
        <p className="font-label-md text-label-md text-secondary mt-0.5 bg-secondary-container/50 px-2 py-0.5 rounded-full inline-block">
          {isLoading ? '—' : caretakerLabel}
        </p>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">
          {isLoading ? '—' : activePlantsLabel}
        </p>
        {error ? (
          <p className="font-body-md text-error text-xs mt-1">{error}</p>
        ) : null}
      </div>
    </section>
  );
};
