import type { PlantCardData } from '@/lib/mock-plants';
import type { PlantCategory } from '@/types/database';

export type PlantStatus = 'needs-water' | 'healthy' | 'needs-sun';

export const PLANT_FILTERS = ['전체', '실내', '실외', '다육식물'] as const;

export type PlantFilter = (typeof PLANT_FILTERS)[number];

const SUCCULENT_KEYWORDS = [
  'echeveria',
  'cactus',
  'succulent',
  'aloe',
  'sedum',
  '다육',
] as const;

const OUTDOOR_KEYWORDS = ['rose', 'lavender', 'tomato', '외부', '정원'] as const;

export const inferPlantCategory = (plantName: string): PlantCategory => {
  const lower = plantName.toLowerCase();

  if (SUCCULENT_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    return '다육식물';
  }

  if (OUTDOOR_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    return '실외';
  }

  return '실내';
};

export const filterPlants = (
  plants: readonly PlantCardData[],
  query: string,
  categoryFilter: PlantFilter = '전체',
): PlantCardData[] => {
  const byCategory =
    categoryFilter === '전체'
      ? plants
      : plants.filter((plant) => plant.category === categoryFilter);

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...byCategory];
  }

  return byCategory.filter(
    (plant) =>
      plant.plantName.toLowerCase().includes(normalized) ||
      plant.nickname.toLowerCase().includes(normalized),
  );
};

export const getStatusLabel = (status: PlantStatus): string => {
  const labels: Record<PlantStatus, string> = {
    'needs-water': '물 필요',
    healthy: '건강함',
    'needs-sun': '햇빛 필요',
  };
  return labels[status];
};
