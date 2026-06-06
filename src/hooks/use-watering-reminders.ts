'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWateringReminderInputs } from '@/lib/repositories/watering-reminders';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/lib/supabase/types';
import {
  buildWateringReminders,
  countOverdueWateringReminders,
  overduePlantIdSet,
  type WateringReminder,
} from '@/lib/watering-reminders';

export type UseWateringRemindersResult = {
  readonly reminders: readonly WateringReminder[];
  readonly overdueCount: number;
  readonly overduePlantIds: ReadonlySet<string>;
  readonly plantCount: number;
  readonly highlightActive: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refresh: () => Promise<void>;
  readonly handleWateringRemindersClick: () => Promise<void>;
};

export const useWateringReminders = (): UseWateringRemindersResult => {
  const router = useRouter();
  const [reminders, setReminders] = useState<WateringReminder[]>([]);
  const [highlightActive, setHighlightActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient() as unknown as AppSupabaseClient;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setReminders([]);
        return;
      }

      const inputs = await fetchWateringReminderInputs(supabase, user.id);
      setReminders(buildWateringReminders(inputs));
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : '물주기 알림을 불러오지 못했습니다.',
      );
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const overdueCount = useMemo(
    () => countOverdueWateringReminders(reminders),
    [reminders],
  );

  const overduePlantIds = useMemo(
    () => overduePlantIdSet(reminders),
    [reminders],
  );

  const handleWateringRemindersClick = useCallback(async () => {
    await refresh();
    setHighlightActive(true);
    router.push('/collection?watering=overdue');
  }, [refresh, router]);

  return {
    reminders,
    overdueCount,
    overduePlantIds,
    plantCount: reminders.length,
    highlightActive,
    isLoading,
    error,
    refresh,
    handleWateringRemindersClick,
  };
};
