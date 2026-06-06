'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/supabaseClient.js';
import type { AppSupabaseClient } from '@/lib/supabase/types';
import {
  fetchUserDashboardStatus,
  type UserDashboardStatus,
} from '@/lib/repositories/user-dashboard';

export type UseDashboardUserStatusResult = UserDashboardStatus & {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refresh: () => Promise<void>;
};

const EMPTY_STATUS: UserDashboardStatus = {
  displayName: '초보 식물 집사',
  caretakerLevel: 1,
  caretakerTier: '초보 식집사',
  caretakerLabel: 'Lv.1 초보 식집사',
  activePlantCount: 0,
  activePlantsLabel: '활성 식물 0개',
};

/**
 * 페이지 로드 시 profiles + 활성 plants count 조회,
 * Realtime 구독으로 상단 UI 실시간 반영
 */
export const useDashboardUserStatus = (): UseDashboardUserStatusResult => {
  const [status, setStatus] = useState<UserDashboardStatus>(EMPTY_STATUS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        setStatus(EMPTY_STATUS);
        return;
      }

      const nextStatus = await fetchUserDashboardStatus(
        supabaseClient as unknown as AppSupabaseClient,
        user.id,
      );
      setStatus(nextStatus);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : '대시보드 상태를 불러오지 못했습니다.',
      );
      setStatus(EMPTY_STATUS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    let channel: ReturnType<typeof supabaseClient.channel> | null = null;
    let mounted = true;

    const subscribeRealtime = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user || !mounted) {
        return;
      }

      channel = supabaseClient
        .channel(`dashboard-user-status-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          () => {
            void refresh();
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'plants',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            void refresh();
          },
        )
        .subscribe();
    };

    void subscribeRealtime();

    return () => {
      mounted = false;
      if (channel) {
        void supabaseClient.removeChannel(channel);
      }
    };
  }, [refresh]);

  return {
    ...status,
    isLoading,
    error,
    refresh,
  };
};

/** @deprecated useDashboardUserStatus 사용 */
export const useUserDashboardStatus = useDashboardUserStatus;

export type UseUserDashboardStatusResult = UseDashboardUserStatusResult;
