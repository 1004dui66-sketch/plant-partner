import type { WateringReminderInput } from '@/lib/watering-reminders';
import type { AppSupabaseClient } from '@/lib/supabase/types';

type PlantWithWaterLogs = {
  id: string;
  plant_name: string;
  nickname: string | null;
  growth_logs: Array<{ activity_type: string; created_at: string }> | null;
};

const latestWaterDate = (
  logs: PlantWithWaterLogs['growth_logs'],
): string | null => {
  const waterLogs =
    logs
      ?.filter((log) => log.activity_type === 'water')
      .sort(
        (left, right) =>
          new Date(right.created_at).getTime() -
          new Date(left.created_at).getTime(),
      ) ?? [];

  return waterLogs[0]?.created_at ?? null;
};

export const fetchWateringReminderInputs = async (
  supabase: AppSupabaseClient,
  userId: string,
): Promise<WateringReminderInput[]> => {
  const { data, error } = await supabase
    .from('plants')
    .select('id, plant_name, nickname, growth_logs(activity_type, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as PlantWithWaterLogs[]).map((plant) => ({
    plantId: plant.id,
    plantName: plant.plant_name,
    nickname: plant.nickname ?? '위치 미설정',
    lastWateredAt: latestWaterDate(plant.growth_logs),
  }));
};
