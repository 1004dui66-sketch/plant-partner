'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateUserProfile } from '@/lib/repositories/profiles';
import { createSupabaseServerClient, getSessionUser } from '@/lib/supabase/server';

export type ProfileActionResult = {
  error?: string;
  success?: boolean;
};

export const updateProfile = async (
  _prev: ProfileActionResult,
  formData: FormData,
): Promise<ProfileActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  const displayName = String(formData.get('displayName') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const careAlertsEnabled = formData.get('careAlertsEnabled') === 'on';

  if (!displayName) {
    return { error: '표시 이름을 입력해 주세요.' };
  }

  const supabase = await createSupabaseServerClient();

  try {
    await updateUserProfile(supabase, user.id, {
      displayName,
      bio,
      careAlertsEnabled,
    });
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
};
