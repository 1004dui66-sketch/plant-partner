import type { AppSupabaseClient } from '@/lib/supabase/types';
import type { GrowthLog } from '@/types/database';
import type { HistoryEntry } from '@/lib/history';
import {
  ACTIVITY_META,
  type ActivityType,
  isActivityType,
} from '@/lib/activities';
import { DEFAULT_PLANT_IMAGE } from '@/lib/constants';
import { resolveImageUrl } from '@/lib/storage/resolve-image-url';

const formatSectionLabel = (date: Date, now: Date): string => {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays <= 7) return '지난주';
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

const formatTimeLabel = (date: Date): string =>
  date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const mapGrowthLog = (
  log: {
    id: string;
    activity_type: string;
    memo: string | null;
    created_at: string;
    plants:
      | {
          plant_name: string;
          nickname: string | null;
          image_url: string | null;
        }
      | Array<{
          plant_name: string;
          nickname: string | null;
          image_url: string | null;
        }>
      | null;
  },
  now: Date,
): HistoryEntry => {
  const plant = Array.isArray(log.plants) ? log.plants[0] : log.plants;
  const activityType: ActivityType = isActivityType(log.activity_type)
    ? log.activity_type
    : 'water';
  const meta = ACTIVITY_META[activityType];
  const createdAt = new Date(log.created_at);

  return {
    id: log.id,
    section: formatSectionLabel(createdAt, now),
    icon: meta.icon,
    iconFilled: activityType === 'water',
    title: meta.historyTitle,
    plantName: plant?.plant_name ?? '알 수 없음',
    location: plant?.nickname ?? '위치 미설정',
    memo: log.memo,
    time: formatTimeLabel(createdAt),
    imageUrl: plant?.image_url ?? DEFAULT_PLANT_IMAGE,
    highlight: formatSectionLabel(createdAt, now) === '오늘',
  };
};

export const fetchHistoryEntries = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<HistoryEntry[]> => {
  const { data: plants } = await supabase
    .from('plants')
    .select('id')
    .eq('user_id', userId);

  const plantIds = plants?.map((plant) => plant.id) ?? [];

  if (plantIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('growth_logs')
    .select(
      'id, activity_type, memo, created_at, plants(plant_name, nickname, image_url)',
    )
    .in('plant_id', plantIds)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  const now = new Date();
  const entries = (data ?? []).map((log) => mapGrowthLog(log, now));

  return Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      imageUrl: await resolveImageUrl(supabase, entry.imageUrl),
    })),
  );
};

export const fetchPlantGrowthLogs = async (
  supabase: AppSupabaseClient,
  plantId: string,
  limit = 10,
): Promise<GrowthLog[]> => {
  const { data, error } = await supabase
    .from('growth_logs')
    .select('*')
    .eq('plant_id', plantId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const createGrowthLog = async (
  supabase: AppSupabaseClient,
  input: {
    plantId: string;
    activityType: ActivityType;
    memo: string;
    loggedAt: string;
  },
) => {
  const { data, error } = await supabase
    .from('growth_logs')
    .insert({
      plant_id: input.plantId,
      activity_type: input.activityType,
      memo: input.memo,
      created_at: input.loggedAt,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
