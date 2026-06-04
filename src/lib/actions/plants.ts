'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addPlantFromAnalysis,
  getAnalysisById,
} from '@/lib/repositories/analyses';
import {
  deletePlantById,
  updatePlantNickname,
} from '@/lib/repositories/plants';
import { createSupabaseServerClient, getSessionUser } from '@/lib/supabase/server';

export type PlantActionResult = {
  error?: string;
  success?: boolean;
};

export const getScanAnalysis = async (analysisId: string) => {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  const analysis = await getAnalysisById(supabase, user.id, analysisId);

  if (!analysis) {
    redirect('/scan');
  }

  return analysis;
};

export const addScanResultToCollection = async (
  _prev: PlantActionResult,
  formData: FormData,
): Promise<PlantActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  const analysisId = String(formData.get('analysisId') ?? '');
  const nickname = String(formData.get('nickname') ?? '').trim();

  const supabase = await createSupabaseServerClient();

  try {
    const plant = await addPlantFromAnalysis(supabase, {
      userId: user.id,
      analysisId,
      nickname: nickname || undefined,
    });

    revalidatePath('/collection');
    redirect(`/plants/${plant.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '추가에 실패했습니다.',
    };
  }
};

export const updatePlantDetails = async (
  _prev: PlantActionResult,
  formData: FormData,
): Promise<PlantActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  const plantId = String(formData.get('plantId') ?? '');
  const nickname = String(formData.get('nickname') ?? '').trim();

  if (!plantId) {
    return { error: '식물을 찾을 수 없습니다.' };
  }

  const supabase = await createSupabaseServerClient();

  try {
    await updatePlantNickname(supabase, user.id, plantId, nickname);
    revalidatePath(`/plants/${plantId}`);
    revalidatePath('/collection');
    revalidatePath('/history');
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '수정에 실패했습니다.',
    };
  }
};

export const deletePlant = async (
  _prev: PlantActionResult,
  formData: FormData,
): Promise<PlantActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  const plantId = String(formData.get('plantId') ?? '');

  if (!plantId) {
    return { error: '식물을 찾을 수 없습니다.' };
  }

  const supabase = await createSupabaseServerClient();

  try {
    await deletePlantById(supabase, user.id, plantId);
    revalidatePath('/collection');
    revalidatePath('/history');
    redirect('/collection');
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '삭제에 실패했습니다.',
    };
  }
};
