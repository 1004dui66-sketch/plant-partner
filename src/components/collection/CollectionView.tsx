'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useWateringRemindersContext } from '@/components/layout/WateringRemindersProvider';
import { CollectionSearchBar } from '@/components/collection/CollectionSearchBar';
import { DashboardUserStatusBar } from '@/components/dashboard/DashboardUserStatusBar';
import { EncyclopediaHeader } from '@/components/collection/EncyclopediaHeader';
import { PlantCard } from '@/components/collection/PlantCard';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { isWateringRemindersQuery } from '@/config/navigation';
import type { PlantCardData } from '@/lib/mock-plants';
import type { PlantFilter } from '@/lib/plants';
import { filterPlants } from '@/lib/plants';

type CollectionViewProps = {
  plants: PlantCardData[];
};

export const CollectionView = ({ plants }: CollectionViewProps) => (
  <AppShell className="bg-organic-pattern pb-24 md:pb-0">
    <CollectionContent plants={plants} />
  </AppShell>
);

const CollectionContent = ({ plants }: CollectionViewProps) => {
  const searchParams = useSearchParams();
  const { overduePlantIds, highlightActive } = useWateringRemindersContext();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PlantFilter>('전체');

  const wateringFilterActive = useMemo(
    () =>
      highlightActive ||
      isWateringRemindersQuery(searchParams.get('watering')),
    [highlightActive, searchParams],
  );

  const filteredPlants = useMemo(
    () => filterPlants(plants, query, activeFilter),
    [plants, query, activeFilter],
  );

  const displayPlants = useMemo(
    () =>
      wateringFilterActive
        ? filteredPlants.filter((plant) => overduePlantIds.has(plant.id))
        : filteredPlants,
    [filteredPlants, overduePlantIds, wateringFilterActive],
  );

  const shouldShowWateringBadge = (plantId: string): boolean =>
    overduePlantIds.has(plantId) &&
    (wateringFilterActive || highlightActive);

  return (
    <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <DashboardUserStatusBar className="mb-stack-md md:hidden" />
      <EncyclopediaHeader />

      {wateringFilterActive ? (
        <section className="mb-stack-md glass-panel rounded-xl p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,53,39,0.05)]">
          <MaterialIcon name="water_drop" filled className="text-error" />
          <div>
            <p className="font-label-md text-label-md text-primary">
              물주기 알림
            </p>
            <p className="font-body-md text-on-surface-variant text-sm">
              물 줄 시기가 지난 식물 {overduePlantIds.size}개를 표시하고
              있습니다.
            </p>
          </div>
        </section>
      ) : null}

      <CollectionSearchBar
        query={query}
        activeFilter={activeFilter}
        onQueryChange={setQuery}
        onFilterChange={setActiveFilter}
      />

      {displayPlants.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 text-center shadow-[0_10px_30px_rgba(0,53,39,0.05)]">
          <MaterialIcon
            name={wateringFilterActive ? 'water_drop' : 'potted_plant'}
            className="text-primary text-5xl mb-4"
          />
          <h2 className="font-headline-md text-primary mb-2">
            {wateringFilterActive
              ? '물 줄 식물이 없습니다'
              : '아직 등록된 식물이 없습니다'}
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            {wateringFilterActive
              ? '모든 식물이 물주기 일정을 잘 지키고 있어요.'
              : 'AI 인식으로 식물을 추가해 보세요.'}
          </p>
          {!wateringFilterActive ? (
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md"
            >
              <MaterialIcon name="photo_camera" />
              식물 인식하기
            </Link>
          ) : (
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md"
            >
              전체 컬렉션 보기
            </Link>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              showWateringBadge={shouldShowWateringBadge(plant.id)}
            />
          ))}
        </section>
      )}
    </main>
  );
};
