import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { useWateringReminders } from './use-watering-reminders';

const mockPush = vi.fn();
const mockGetUser = vi.fn();
const mockFetchInputs = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => ({
    auth: { getUser: mockGetUser },
  }),
  resetSupabaseBrowserClientForTests: vi.fn(),
}));

vi.mock('@/lib/repositories/watering-reminders', () => ({
  fetchWateringReminderInputs: (...args: unknown[]) => mockFetchInputs(...args),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SupabaseProvider>{children}</SupabaseProvider>
);

describe('useWateringReminders', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('물주기 알림 클릭 시 컬렉션 연체 필터로 이동한다', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockFetchInputs.mockResolvedValue([
      {
        plantId: 'plant-1',
        plantName: '몬스테라',
        nickname: '거실',
        lastWateredAt: null,
      },
    ]);

    const { result } = renderHook(() => useWateringReminders(), { wrapper });

    await waitFor(() => {
      expect(result.current.overdueCount).toBe(1);
    });

    await result.current.handleWateringRemindersClick();

    expect(mockPush).toHaveBeenCalledWith('/collection?watering=overdue');

    await waitFor(() => {
      expect(result.current.highlightActive).toBe(true);
    });
  });
});
