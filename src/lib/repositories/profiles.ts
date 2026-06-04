import type { AppSupabaseClient } from '@/lib/supabase/types';
import type { Profile } from '@/types/database';

export type ProfileUpdateInput = {
  displayName: string;
  bio: string;
  careAlertsEnabled: boolean;
};

export const updateUserProfile = async (
  supabase: AppSupabaseClient,
  userId: string,
  input: ProfileUpdateInput,
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: input.displayName,
      bio: input.bio,
      care_alerts_enabled: input.careAlertsEnabled,
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? '프로필을 저장하지 못했습니다.');
  }

  return data;
};
