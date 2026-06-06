import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlantImageUploadButton } from './PlantImageUploadButton';

vi.mock('@/components/providers/SupabaseProvider', () => ({
  useSupabaseUser: () => ({
    user: { id: 'user-1' },
    isLoading: false,
  }),
}));

vi.mock('@/lib/handlers/handle-image-submit', () => ({
  handleImageSubmit: vi.fn().mockResolvedValue({ publicUrl: 'https://example.com/a.jpg' }),
}));

describe('PlantImageUploadButton', () => {
  it('업로드 버튼 클릭 시 파일 선택 input을 연다', () => {
    render(<PlantImageUploadButton />);

    const button = screen.getByRole('button', { name: '갤러리 업로드' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(button);

    expect(clickSpy).toHaveBeenCalled();
  });
});
