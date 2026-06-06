import {
  addPlantFromAnalysis,
  createAnalysisFromScan,
} from '@/lib/repositories/analyses';
import { assertUserAnalysisImageRef } from '@/lib/storage/resolve-image-url';
import { toPublicStorageUrl } from '@/lib/storage/public-url';
import type { AppSupabaseClient } from '@/lib/supabase/types';
import type { Analysis, Plant } from '@/types/database';

export type ProcessPlantImageUploadInput = {
  readonly userId: string;
  readonly imageRef: string;
  readonly nickname?: string;
  readonly addToCollection?: boolean;
};

export type ProcessPlantImageUploadResult = {
  readonly publicUrl: string;
  readonly analysis: Analysis;
  readonly plant?: Plant;
};

/** Storage public URL(또는 path)로 AI 진단 후 analyses/plants에 저장 */
export const processPlantImageUpload = async (
  supabase: AppSupabaseClient,
  input: ProcessPlantImageUploadInput,
): Promise<ProcessPlantImageUploadResult> => {
  const storagePath = assertUserAnalysisImageRef(input.userId, input.imageRef);
  const publicUrl = toPublicStorageUrl(
    input.imageRef.startsWith('http') ? input.imageRef : storagePath,
  );

  const analysis = await createAnalysisFromScan(supabase, {
    userId: input.userId,
    imageUrl: publicUrl,
  });

  if (!input.addToCollection) {
    return { publicUrl, analysis };
  }

  const plant = await addPlantFromAnalysis(supabase, {
    userId: input.userId,
    analysisId: analysis.id,
    nickname: input.nickname,
  });

  return { publicUrl, analysis, plant };
};
