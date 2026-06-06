import type { PlantStatus } from '@/lib/plants';
import type { PlantCategory } from '@/types/database';

export type PlantCardData = {
  readonly id: string;
  readonly plantName: string;
  readonly nickname: string;
  readonly imageUrl: string;
  readonly category: PlantCategory;
  readonly status: PlantStatus;
  readonly statusLabel: string;
  readonly lastWatered: string;
};
