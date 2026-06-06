import { describe, expect, it, vi, beforeEach } from 'vitest';
import { uploadPlantImage } from './upload-client';

const mockUpload = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
      }),
    },
  }),
  resetSupabaseBrowserClientForTests: vi.fn(),
}));

describe('uploadPlantImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc123.supabase.co';
    mockUpload.mockResolvedValue({ error: null });
  });

  it('plant-images 버킷에 업로드하고 public URL을 반환한다', async () => {
    const userId = '00000000-0000-4000-8000-000000000001';
    const file = new Blob(['image'], { type: 'image/jpeg' });

    const result = await uploadPlantImage({
      file,
      userId,
      mimeType: 'image/jpeg',
    });

    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^${userId}/analyses/`)),
      file,
      expect.objectContaining({ contentType: 'image/jpeg' }),
    );
    expect(result.publicUrl).toContain(
      '/storage/v1/object/public/plant-images/',
    );
    expect(result.publicUrl).toContain(`${userId}/analyses/`);
  });
});
