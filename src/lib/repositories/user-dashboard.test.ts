import { describe, expect, it, vi } from 'vitest';
import { fetchUserDashboardStatus } from './user-dashboard';

vi.mock('@/lib/repositories/profiles', () => ({
  fetchUserProfile: vi.fn(),
  syncCaretakerProgress: vi.fn(),
}));

vi.mock('@/lib/repositories/plants', () => ({
  countActiveUserPlants: vi.fn(),
}));

import { fetchUserProfile } from '@/lib/repositories/profiles';
import { countActiveUserPlants } from '@/lib/repositories/plants';

describe('fetchUserDashboardStatus', () => {
  it('프로필 등급과 활성 식물 수를 조합한다', async () => {
    vi.mocked(fetchUserProfile).mockResolvedValue({
      id: 'user-1',
      created_at: '2026-01-01T00:00:00Z',
      display_name: '식물 탐험가',
      bio: null,
      care_alerts_enabled: true,
      caretaker_level: 15,
      caretaker_tier: '숙련 집사',
    });
    vi.mocked(countActiveUserPlants).mockResolvedValue(14);

    const status = await fetchUserDashboardStatus({} as never, 'user-1');

    expect(status).toEqual({
      displayName: '식물 탐험가',
      caretakerLevel: 15,
      caretakerTier: '숙련 집사',
      caretakerLabel: 'Lv.15 숙련 집사',
      activePlantCount: 14,
      activePlantsLabel: '활성 식물 14개',
    });
  });
});
