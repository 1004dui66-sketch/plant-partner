import type { AppSupabaseClient } from '@/lib/supabase/types';
import { countActiveUserPlants } from '@/lib/repositories/plants';
import {
  fetchUserProfile,
  syncCaretakerProgress,
} from '@/lib/repositories/profiles';
import {
  deriveCaretakerProgress,
  formatActivePlantsLabel,
  formatCaretakerLabel,
} from '@/lib/caretaker-tier';

export type UserDashboardStatus = {
  readonly displayName: string;
  readonly caretakerLevel: number;
  readonly caretakerTier: string;
  readonly caretakerLabel: string;
  readonly activePlantCount: number;
  readonly activePlantsLabel: string;
};

const DEFAULT_DISPLAY_NAME = '초보 식물 집사';

export const fetchUserDashboardStatus = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<UserDashboardStatus> => {
  const [profile, activePlantCount] = await Promise.all([
    fetchUserProfile(supabase, userId),
    countActiveUserPlants(supabase, userId),
  ]);

  const derived = deriveCaretakerProgress(activePlantCount);

  if (
    profile &&
    (profile.caretaker_level !== derived.level ||
      profile.caretaker_tier !== derived.tier)
  ) {
    const synced = await syncCaretakerProgress(
      supabase,
      userId,
      activePlantCount,
    );

    return {
      displayName: synced.display_name ?? DEFAULT_DISPLAY_NAME,
      caretakerLevel: synced.caretaker_level,
      caretakerTier: synced.caretaker_tier,
      caretakerLabel: formatCaretakerLabel({
        level: synced.caretaker_level,
        tier: synced.caretaker_tier,
      }),
      activePlantCount,
      activePlantsLabel: formatActivePlantsLabel(activePlantCount),
    };
  }

  const caretakerLevel = profile?.caretaker_level ?? derived.level;
  const caretakerTier = profile?.caretaker_tier ?? derived.tier;

  return {
    displayName: profile?.display_name ?? DEFAULT_DISPLAY_NAME,
    caretakerLevel,
    caretakerTier,
    caretakerLabel: formatCaretakerLabel({
      level: caretakerLevel,
      tier: caretakerTier,
    }),
    activePlantCount,
    activePlantsLabel: formatActivePlantsLabel(activePlantCount),
  };
};

export const refreshUserCaretakerProgress = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<UserDashboardStatus> => {
  const activePlantCount = await countActiveUserPlants(supabase, userId);
  const profile = await syncCaretakerProgress(supabase, userId, activePlantCount);

  return {
    displayName: profile.display_name ?? DEFAULT_DISPLAY_NAME,
    caretakerLevel: profile.caretaker_level,
    caretakerTier: profile.caretaker_tier,
    caretakerLabel: formatCaretakerLabel({
      level: profile.caretaker_level,
      tier: profile.caretaker_tier,
    }),
    activePlantCount,
    activePlantsLabel: formatActivePlantsLabel(activePlantCount),
  };
};
