import { describe, expect, it, vi, beforeEach } from 'vitest';
import { handleImageSubmit } from './handle-image-submit';

const mockUploadPlantImage = vi.fn();
const mockSubmitScanImage = vi.fn();

vi.mock('@/lib/storage/upload-client', () => ({
  uploadPlantImage: (...args: unknown[]) => mockUploadPlantImage(...args),
}));

vi.mock('@/lib/actions/scan', () => ({
  submitScanImage: (...args: unknown[]) => mockSubmitScanImage(...args),
}));

describe('handleImageSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('업로드 후 public URL로 analyses 저장을 요청한다', async () => {
    const file = new Blob(['image'], { type: 'image/jpeg' });
    const publicUrl =
      'https://abc.supabase.co/storage/v1/object/public/plant-images/user-1/analyses/a.jpg';

    mockUploadPlantImage.mockResolvedValue({
      storagePath: 'user-1/analyses/a.jpg',
      publicUrl,
    });
    mockSubmitScanImage.mockResolvedValue(undefined);

    const onProgress = vi.fn();

    const result = await handleImageSubmit({
      file,
      userId: 'user-1',
      mimeType: 'image/jpeg',
      onProgress,
    });

    expect(mockUploadPlantImage).toHaveBeenCalledWith({
      file,
      userId: 'user-1',
      mimeType: 'image/jpeg',
    });
    expect(mockSubmitScanImage).toHaveBeenCalledWith(publicUrl);
    expect(onProgress).toHaveBeenCalledWith('이미지 업로드 중...');
    expect(onProgress).toHaveBeenCalledWith('AI 분석 결과 저장 중...');
    expect(result.publicUrl).toBe(publicUrl);
  });
});
