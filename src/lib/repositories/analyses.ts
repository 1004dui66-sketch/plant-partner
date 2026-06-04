import type { AppSupabaseClient } from '@/lib/supabase/types';
import { DEFAULT_SCAN_IMAGE, MOCK_ANALYSIS_RESULT } from '@/lib/constants';
import { enrichPlantAnalysis } from '@/lib/public-data/enrich-plant-analysis';
import { inferPlantCategory } from '@/lib/plants';
import type { Analysis, Plant } from '@/types/database';

export type AnalysisInput = {
  userId: string;
  plantId?: string | null;
  imageUrl: string;
};

export const createAnalysisFromScan = async (
  supabase: AppSupabaseClient,
  input: AnalysisInput,
): Promise<Analysis> => {
  const result = await enrichPlantAnalysis(MOCK_ANALYSIS_RESULT.plantName);

  const { data, error } = await supabase
    .from('analyses')
    .insert({
      user_id: input.userId,
      plant_id: input.plantId ?? null,
      image_url: input.imageUrl,
      plant_name: result.plantName,
      scientific_name: result.scientificName,
      health_status: result.healthStatus,
      diagnosis: result.diagnosis,
      recommendation: result.recommendation,
      care_summary: result.careSummary,
      confidence: result.confidence,
      symbolism: result.symbolism,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addPlantFromAnalysis = async (
  supabase: AppSupabaseClient,
  input: {
    userId: string;
    analysisId: string;
    nickname?: string;
  },
) => {
  const { data: analysis, error: analysisError } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', input.analysisId)
    .eq('user_id', input.userId)
    .single();

  if (analysisError || !analysis) {
    throw new Error(analysisError?.message ?? '분석 결과를 찾을 수 없습니다.');
  }

  const { data: plant, error: plantError } = await supabase
    .from('plants')
    .insert({
      user_id: input.userId,
      plant_name: analysis.plant_name,
      scientific_name: analysis.scientific_name,
      nickname: input.nickname ?? null,
      image_url: analysis.image_url,
      category: inferPlantCategory(analysis.plant_name),
    })
    .select('*')
    .single();

  if (plantError || !plant) {
    throw new Error(plantError?.message ?? '식물 추가에 실패했습니다.');
  }

  await supabase
    .from('analyses')
    .update({ plant_id: plant.id })
    .eq('id', analysis.id);

  return plant;
};

export const getAnalysisById = async (
  supabase: AppSupabaseClient,
  userId: string,
  analysisId: string,
): Promise<Analysis | null> => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getOrCreateScanAnalysis = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<Analysis> => {
  const { data: existing } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .is('plant_id', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  return createAnalysisFromScan(supabase, {
    userId,
    imageUrl: DEFAULT_SCAN_IMAGE,
  });
};
