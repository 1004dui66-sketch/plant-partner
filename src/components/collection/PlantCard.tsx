import Image from 'next/image';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { NotificationBadge } from '@/components/ui/NotificationBadge';
import type { PlantCardData } from '@/lib/mock-plants';
import type { PlantStatus } from '@/lib/plants';

const statusStyles: Record<
  PlantStatus,
  { bg: string; text: string; icon: string }
> = {
  'needs-water': {
    bg: 'bg-error/90',
    text: 'text-on-error',
    icon: 'water_drop',
  },
  healthy: {
    bg: 'bg-primary-container/80',
    text: 'text-on-primary-container',
    icon: 'check_circle',
  },
  'needs-sun': {
    bg: 'bg-tertiary-container/90',
    text: 'text-on-tertiary-container',
    icon: 'sunny',
  },
};

type PlantCardProps = {
  readonly plant: PlantCardData;
  readonly showWateringBadge?: boolean;
};

export const PlantCard = ({ plant, showWateringBadge = false }: PlantCardProps) => {
  const style = statusStyles[plant.status];

  return (
    <article className="glass-panel rounded-xl overflow-hidden relative group shadow-[0_10px_30px_rgba(0,53,39,0.05)] hover:-translate-y-1 transition-transform duration-300">
      {showWateringBadge ? (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-error text-on-error px-2 py-1 rounded-full shadow-md">
          <MaterialIcon name="notifications" filled className="text-sm" />
          <span className="text-[11px] font-label-md">물주기</span>
        </div>
      ) : null}

      <Link href={`/plants/${plant.id}`} className="block">
        <div className="h-48 overflow-hidden relative">
          <Image
            alt={plant.plantName}
            src={plant.imageUrl}
            width={400}
            height={192}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className={`absolute top-3 left-3 ${style.bg} backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20`}
          >
            <MaterialIcon
              name={style.icon}
              filled
              className={`text-[16px] ${style.text}`}
            />
            <span className={`text-label-md font-label-md ${style.text}`}>
              {plant.statusLabel}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 bg-surface/50 backdrop-blur-sm">
        <Link href={`/plants/${plant.id}`} className="block">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-1">
              {plant.plantName}
            </h3>
            {showWateringBadge ? (
              <NotificationBadge count={1} className="shrink-0" />
            ) : null}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {plant.nickname}
          </p>
        </Link>
        <div className="mt-4 flex justify-between items-center border-t border-outline-variant/30 pt-3">
          <span className="font-label-md text-label-md text-outline">
            마지막 물 주기: {plant.lastWatered}
          </span>
          <Link
            href={`/plants/${plant.id}`}
            aria-label={`${plant.plantName} 더보기`}
            className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
          >
            <MaterialIcon name="more_horiz" />
          </Link>
        </div>
      </div>
    </article>
  );
};
