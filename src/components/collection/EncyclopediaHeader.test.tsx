import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EncyclopediaHeader } from './EncyclopediaHeader';

vi.mock('@/components/layout/UserDashboardProvider', () => ({
  useUserDashboardContext: () => ({
    activePlantsLabel: '활성 식물 14개',
    isLoading: false,
  }),
}));

vi.mock('@/components/providers/SupabaseProvider', () => ({
  useSupabaseUser: () => ({
    user: { id: 'user-1' },
    isLoading: false,
  }),
}));

vi.mock('@/lib/handlers/handle-image-submit', () => ({
  handleImageSubmit: vi.fn(),
}));

describe('EncyclopediaHeader', () => {
  it('식물 도감 제목과 업로드 CTA를 렌더링한다', () => {
    render(<EncyclopediaHeader />);

    expect(screen.getByRole('heading', { name: '식물 도감' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /식물 촬영하기/ }).getAttribute('href')).toBe(
      '/scan',
    );
    expect(screen.getByRole('button', { name: '갤러리 업로드' })).toBeTruthy();
  });
});
