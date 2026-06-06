import type { EnrichedPlantAnalysis } from '@/lib/public-data/types';
import { MOCK_ANALYSIS_RESULT } from '@/lib/constants';
import { identifyPlantFromImage } from '@/lib/gemini/identify-plant';
import type { VisionPlantResult } from '@/lib/gemini/types';
import { enrichPlantAnalysis } from '@/lib/public-data/enrich-plant-analysis';
import { resolveImageUrl } from '@/lib/storage/resolve-image-url';
import type { AppSupabaseClient } from '@/lib/supabase/types';

export const mergeVisionWithEnrichment = (
  vision: VisionPlantResult,
  enriched: EnrichedPlantAnalysis,
): EnrichedPlantAnalysis => ({
  ...enriched,
  plantName: enriched.plantName || vision.plantName,
  scientificName: enriched.scientificName || vision.scientificName,
  healthStatus: vision.healthStatus,
  diagnosis: vision.diagnosis || enriched.diagnosis,
  recommendation: vision.recommendation || enriched.recommendation,
  confidence: Math.min(
    0.99,
    Math.max(enriched.confidence, vision.confidence),
  ),
  careSummary:
    vision.careSummary.length > 0 ? vision.careSummary : enriched.careSummary,
});

export const analyzeScanImage = async (
  supabase: AppSupabaseClient,
  storagePath: string,
): Promise<EnrichedPlantAnalysis> => {
  const imageUrl = await resolveImageUrl(supabase, storagePath);
  const vision = await identifyPlantFromImage(imageUrl);
  const query = vision?.plantName ?? MOCK_ANALYSIS_RESULT.plantName;
  const enriched = await enrichPlantAnalysis(query);

  if (!vision) {
    return enriched;
  }

  return mergeVisionWithEnrichment(vision, enriched);
};
