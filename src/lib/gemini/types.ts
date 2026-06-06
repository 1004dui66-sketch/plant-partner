import type { CareSummaryItem } from '@/lib/analysis';

export type VisionPlantResult = {
  readonly plantName: string;
  readonly scientificName: string;
  readonly healthStatus: string;
  readonly diagnosis: string;
  readonly recommendation: string;
  readonly confidence: number;
  readonly careSummary: readonly CareSummaryItem[];
};

export type GeminiGenerateResponse = {
  candidates?: ReadonlyArray<{
    content?: {
      parts?: ReadonlyArray<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
};
