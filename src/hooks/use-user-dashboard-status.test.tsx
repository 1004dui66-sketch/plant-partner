import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockGetUser = vi.fn();
const mockChannel = vi.fn();
const mockRemoveChannel = vi.fn();
const mockFetchUserDashboardStatus = vi.fn();

vi.mock('@/lib/repositories/user-dashboard', () => ({
  fetchUserDashboardStatus: (...args: unknown[]) =>
    mockFetchUserDashboardStatus(...args),
}));

vi.mock('@/lib/supabase/supabaseClient.js', () => ({
  supabaseClient: {
    auth: { getUser: (...args: unknown[]) => mockGetUser(...args) },
    channel: (...args: unknown[]) => mockChannel(...args),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
  },
}));

describe('useDashboardUserStatus', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('페이지 로드 시 profiles와 활성 식물 수를 불러온다', async () => {
    const { useDashboardUserStatus } = await import('./use-user-dashboard-status');

    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockFetchUserDashboardStatus.mockResolvedValue({
      displayName: '식물 탐험가',
      caretakerLevel: 12,
      caretakerTier: '식물 집사',
      caretakerLabel: 'Lv.12 식물 집사',
      activePlantCount: 14,
      activePlantsLabel: '활성 식물 14개',
    });
    mockChannel.mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    });

    const { result } = renderHook(() => useDashboardUserStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUserDashboardStatus).toHaveBeenCalled();
    expect(result.current.caretakerLabel).toBe('Lv.12 식물 집사');
    expect(result.current.activePlantsLabel).toBe('활성 식물 14개');
  });
});
