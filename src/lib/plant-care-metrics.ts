import type { PlantStatus } from '@/lib/plants';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Days since last water → 0–100% (Stitch 상세 화면 수분 게이지용) */
export const computeHydrationPercent = (
  daysSinceWater: number | null,
): number => {
  if (daysSinceWater === null) {
    return 35;
  }
  return clamp(100 - daysSinceWater * 10, 0, 100);
};

export const daysSinceWaterFromLogs = (
  waterLogDates: readonly string[],
): number | null => {
  const latest = waterLogDates[0];
  if (!latest) {
    return null;
  }
  return Math.floor(
    (Date.now() - new Date(latest).getTime()) / 86_400_000,
  );
};

export type CareGauge = {
  readonly id: 'hydration' | 'sunlight' | 'soil';
  readonly label: string;
  readonly valueLabel: string;
  readonly percent: number;
  readonly icon: string;
  readonly strokeClass: string;
};

export const deriveCareGauges = (input: {
  daysSinceWater: number | null;
  plantStatus: PlantStatus;
  healthStatus: string | null;
}): readonly CareGauge[] => {
  const hydration = computeHydrationPercent(input.daysSinceWater);
  const sunlight =
    input.plantStatus === 'needs-sun'
      ? { percent: 45, valueLabel: '부족' }
      : { percent: 80, valueLabel: '최적' };
  const soil =
    input.healthStatus &&
    /poor|bad|warning|주의/i.test(input.healthStatus)
      ? { percent: 40, valueLabel: '주의' }
      : { percent: 90, valueLabel: '우수' };

  return [
    {
      id: 'hydration',
      label: '수분 상태',
      valueLabel: `${hydration}%`,
      percent: hydration,
      icon: 'water_drop',
      strokeClass: 'text-secondary',
    },
    {
      id: 'sunlight',
      label: '채광량',
      valueLabel: sunlight.valueLabel,
      percent: sunlight.percent,
      icon: 'light_mode',
      strokeClass: 'text-[#eab308]',
    },
    {
      id: 'soil',
      label: '토양 건강',
      valueLabel: soil.valueLabel,
      percent: soil.percent,
      icon: 'eco',
      strokeClass: 'text-on-primary-fixed-variant',
    },
  ] as const;
};
