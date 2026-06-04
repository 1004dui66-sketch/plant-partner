import type { CareSummaryItem } from '@/lib/analysis';

export type PublicPlantRecord = {
  plantName: string | null;
  scientificName: string | null;
  description: string | null;
  source: 'standardPlant' | 'airPurifying' | 'baekduProtected' | 'seedBook';
  raw: Record<string, unknown>;
};

export type EnrichedPlantAnalysis = {
  plantName: string;
  scientificName: string;
  healthStatus: string;
  diagnosis: string;
  recommendation: string;
  symbolism: string;
  confidence: number;
  careSummary: readonly CareSummaryItem[];
  badges: readonly string[];
};
