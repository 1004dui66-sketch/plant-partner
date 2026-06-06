import type { AppSupabaseClient } from '@/lib/supabase/types';
import { DEFAULT_PLANT_IMAGE } from '@/lib/constants';
import type { PlantCardData } from '@/types/plant-card';
import { resolveImageUrl } from '@/lib/storage/resolve-image-url';
import type { PlantStatus } from '@/lib/plants';
import { syncCaretakerProgress } from '@/lib/repositories/profiles';
import type { Analysis, Plant } from '@/types/database';
type PlantWithLogs = Plant & {
  growth_logs: Array<{ activity_type: string; created_at: string }> | null;
};

const MS_PER_DAY = 86_400_000;

export const computePlantStatus = (
  lastWateredAt: string | null,
): { status: PlantStatus; statusLabel: string; lastWatered: string } => {
  if (!lastWateredAt) {
    return {
      status: 'needs-water',
      statusLabel: '물 필요',
      lastWatered: '기록 없음',
    };
  }

  const days = Math.floor(
    (Date.now() - new Date(lastWateredAt).getTime()) / MS_PER_DAY,
  );

  if (days >= 10) {
    return {
      status: 'needs-water',
      statusLabel: '물 필요',
      lastWatered: `${days}일 전`,
    };
  }

  if (days >= 7) {
    return {
      status: 'needs-sun',
      statusLabel: '햇빛 필요',
      lastWatered: `${days}일 전`,
    };
  }

  return {
    status: 'healthy',
    statusLabel: days <= 3 ? '성장 중' : '건강함',
    lastWatered: `${days}일 전`,
  };
};

export const mapPlantToCard = (plant: PlantWithLogs): PlantCardData => {
  const waterLogs =
    plant.growth_logs
      ?.filter((log) => log.activity_type === 'water')
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ) ?? [];

  const lastWateredAt = waterLogs[0]?.created_at ?? null;
  const { status, statusLabel, lastWatered } =
    computePlantStatus(lastWateredAt);

  return {
    id: plant.id,
    plantName: plant.plant_name,
    nickname: plant.nickname ?? '위치 미설정',
    imageUrl: plant.image_url ?? DEFAULT_PLANT_IMAGE,
    category: plant.category ?? '실내',
    status,
    statusLabel,
    lastWatered,
  };
};

export const fetchPlantCards = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<PlantCardData[]> => {
  const { data, error } = await supabase
    .from('plants')
    .select('*, growth_logs(activity_type, created_at)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const plantsWithLogs = (data ?? []) as PlantWithLogs[];

  return Promise.all(
    plantsWithLogs.map(async (plant) => {
      const card = mapPlantToCard(plant);
      return {
        ...card,
        imageUrl: await resolveImageUrl(supabase, plant.image_url),
      };
    }),
  );
};

export const fetchPlantById = async (
  supabase: AppSupabaseClient,
  userId: string,
  plantId: string,
): Promise<Plant | null> => {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', plantId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchLatestAnalysis = async (
  supabase: AppSupabaseClient,
  userId: string,
  plantId: string,
): Promise<Analysis | null> => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .eq('plant_id', plantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const countActiveUserPlants = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<number> => {
  const { count, error } = await supabase
    .from('plants')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const countUserPlants = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<number> => {
  const { count, error } = await supabase
    .from('plants')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const updatePlantNickname = async (
  supabase: AppSupabaseClient,
  userId: string,
  plantId: string,
  nickname: string,
): Promise<Plant> => {
  const { data, error } = await supabase
    .from('plants')
    .update({ nickname })
    .eq('id', plantId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? '식물 정보를 수정하지 못했습니다.');
  }

  return data;
};

export const deletePlantById = async (
  supabase: AppSupabaseClient,
  userId: string,
  plantId: string,
): Promise<void> => {
  const { error } = await supabase
    .from('plants')
    .delete()
    .eq('id', plantId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const activeCount = await countActiveUserPlants(supabase, userId);
  await syncCaretakerProgress(supabase, userId, activeCount);
};
