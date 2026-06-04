'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  buildLogMemo,
  isActivityType,
  type ActivityType,
} from '@/lib/activities';
import { createGrowthLog } from '@/lib/repositories/growth-logs';
import { fetchPlantById } from '@/lib/repositories/plants';
import { createSupabaseServerClient, getSessionUser } from '@/lib/supabase/server';

export type LogActionResult = {
  error?: string;
};

export const saveGrowthLog = async (
  _prev: LogActionResult,
  formData: FormData,
): Promise<LogActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  const plantId = String(formData.get('plantId') ?? '');
  const activityRaw = String(formData.get('activityType') ?? 'water');
  const date = String(formData.get('date') ?? '');
  const time = String(formData.get('time') ?? '09:00');
  const notes = String(formData.get('notes') ?? '');

  if (!isActivityType(activityRaw)) {
    return { error: '유효하지 않은 활동 유형입니다.' };
  }

  const activityType: ActivityType = activityRaw;
  const supabase = await createSupabaseServerClient();
  const plant = await fetchPlantById(supabase, user.id, plantId);

  if (!plant) {
    return { error: '식물을 찾을 수 없습니다.' };
  }

  const loggedAt = new Date(`${date}T${time}:00`).toISOString();

  try {
    await createGrowthLog(supabase, {
      plantId,
      activityType,
      memo: buildLogMemo(activityType, notes),
      loggedAt,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }

  revalidatePath('/history');
  revalidatePath(`/plants/${plantId}`);
  revalidatePath('/collection');
  redirect('/history');
};
