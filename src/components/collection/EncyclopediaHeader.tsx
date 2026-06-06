'use client';

import Link from 'next/link';
import { PlantImageUploadButton } from '@/components/collection/PlantImageUploadButton';
import { useUserDashboardContext } from '@/components/layout/UserDashboardProvider';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const EncyclopediaHeader = () => {
  const { activePlantsLabel, isLoading } = useUserDashboardContext();

  return (
    <section className="mb-stack-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1">
            Plant Encyclopedia
          </p>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            식물 도감
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            {isLoading
              ? '내 식물 컬렉션을 불러오는 중...'
              : `${activePlantsLabel} · 사진을 찍어 AI로 식물을 등록하세요.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-start sm:items-center">
          <PlantImageUploadButton />
          <Link
            href="/scan"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <MaterialIcon name="photo_camera" filled />
            식물 촬영하기
          </Link>
        </div>
      </div>
    </section>
  );
};
