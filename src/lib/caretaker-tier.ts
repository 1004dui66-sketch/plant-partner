export type CaretakerProgress = {
  readonly level: number;
  readonly tier: string;
};

const MIN_LEVEL = 1;
const MAX_LEVEL = 99;

export const deriveCaretakerProgress = (
  activePlantCount: number,
): CaretakerProgress => {
  const level = Math.min(
    MAX_LEVEL,
    Math.max(MIN_LEVEL, activePlantCount === 0 ? 1 : activePlantCount + 1),
  );

  if (activePlantCount >= 10) {
    return { level, tier: '숙련 집사' };
  }

  if (activePlantCount >= 3) {
    return { level, tier: '식물 집사' };
  }

  return { level, tier: '초보 식집사' };
};

export const formatCaretakerLabel = ({
  level,
  tier,
}: CaretakerProgress): string => `Lv.${level} ${tier}`;

export const formatActivePlantsLabel = (count: number): string =>
  `활성 식물 ${count}개`;
