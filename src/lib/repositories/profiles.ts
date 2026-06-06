import type { AppSupabaseClient } from '@/lib/supabase/types';
import { deriveCaretakerProgress } from '@/lib/caretaker-tier';
import type { Profile } from '@/types/database';

export type ProfileUpdateInput = {
  displayName: string;
  bio: string;
  careAlertsEnabled: boolean;
};

export const fetchUserProfile = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const syncCaretakerProgress = async (
  supabase: AppSupabaseClient,
  userId: string,
  activePlantCount: number,
): Promise<Profile> => {
  const progress = deriveCaretakerProgress(activePlantCount);

  const { data, error } = await supabase
    .from('profiles')
    .update({
      caretaker_level: progress.level,
      caretaker_tier: progress.tier,
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? '등급 정보를 갱신하지 못했습니다.');
  }

  return data;
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
