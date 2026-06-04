'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import type { PlantCardData } from '@/lib/mock-plants';
import type { PlantFilter, PlantStatus } from '@/lib/plants';
import { PLANT_FILTERS, filterPlants } from '@/lib/plants';

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

type CollectionViewProps = {
  plants: PlantCardData[];
};

export const CollectionView = ({ plants }: CollectionViewProps) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PlantFilter>('전체');

  const filteredPlants = useMemo(
    () => filterPlants(plants, query, activeFilter),
    [plants, query, activeFilter],
  );

  return (
    <AppShell className="bg-organic-pattern pb-24 md:pb-0">
      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <section className="mb-stack-md relative z-10">
          <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/2">
              <MaterialIcon
                name="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-body-md font-body-md text-on-surface placeholder:text-outline outline-none transition-all"
                placeholder="내 컬렉션에서 검색..."
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {PLANT_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${
                    activeFilter === filter
                      ? 'bg-primary text-on-primary'
                      : 'glass-panel text-on-surface-variant hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {filteredPlants.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center">
            <MaterialIcon
              name="potted_plant"
              className="text-primary text-5xl mb-4"
            />
            <h2 className="font-headline-md text-primary mb-2">
              아직 등록된 식물이 없습니다
            </h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              AI 인식으로 식물을 추가해 보세요.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md"
            >
              <MaterialIcon name="photo_camera" />
              식물 인식하기
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => {
              const style = statusStyles[plant.status];

              return (
                <Link key={plant.id} href={`/plants/${plant.id}`}>
                  <article className="glass-panel rounded-xl overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300">
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
                        <span
                          className={`text-label-md font-label-md ${style.text}`}
                        >
                          {plant.statusLabel}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-surface/50 backdrop-blur-sm">
                      <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-1">
                        {plant.plantName}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {plant.nickname}
                      </p>
                      <div className="mt-4 flex justify-between items-center border-t border-outline-variant/30 pt-3">
                        <span className="font-label-md text-label-md text-outline">
                          마지막 물 주기: {plant.lastWatered}
                        </span>
                        <MaterialIcon
                          name="more_horiz"
                          className="text-primary"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </AppShell>
  );
};
