import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardUserStatusBar } from './DashboardUserStatusBar';

vi.mock('@/components/layout/UserDashboardProvider', () => ({
  useUserDashboardContext: () => ({
    displayName: '식물 탐험가',
    caretakerLevel: 12,
    caretakerTier: '식물 집사',
    caretakerLabel: 'Lv.12 식물 집사',
    activePlantCount: 14,
    activePlantsLabel: '활성 식물 14개',
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  }),
}));

describe('DashboardUserStatusBar', () => {
  it('profiles 등급과 활성 식물 수를 표시한다', () => {
    render(<DashboardUserStatusBar />);

    expect(screen.getByRole('heading', { name: '식물 탐험가' })).toBeTruthy();
    expect(screen.getByText('Lv.12 식물 집사')).toBeTruthy();
    expect(screen.getByText('활성 식물 14개')).toBeTruthy();
  });
});
