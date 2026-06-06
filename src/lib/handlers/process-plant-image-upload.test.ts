import { describe, expect, it, vi, beforeEach } from 'vitest';
import { processPlantImageUpload } from './process-plant-image-upload';

const mockCreateAnalysis = vi.fn();
const mockAddPlant = vi.fn();

vi.mock('@/lib/repositories/analyses', () => ({
  createAnalysisFromScan: (...args: unknown[]) => mockCreateAnalysis(...args),
  addPlantFromAnalysis: (...args: unknown[]) => mockAddPlant(...args),
}));

describe('processPlantImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc123.supabase.co';
  });

  it('public URL로 AI 분석 후 analyses에 저장한다', async () => {
    const userId = '00000000-0000-4000-8000-000000000001';
    const publicUrl = `https://abc123.supabase.co/storage/v1/object/public/plant-images/${userId}/analyses/scan.jpg`;

    mockCreateAnalysis.mockResolvedValue({
      id: 'analysis-1',
      image_url: publicUrl,
    });

    const result = await processPlantImageUpload({} as never, {
      userId,
      imageRef: publicUrl,
    });

    expect(mockCreateAnalysis).toHaveBeenCalledWith({} as never, {
      userId,
      imageUrl: publicUrl,
    });
    expect(result.publicUrl).toBe(publicUrl);
    expect(result.analysis.id).toBe('analysis-1');
    expect(result.plant).toBeUndefined();
  });

  it('addToCollection이 true이면 plants에도 저장한다', async () => {
    const userId = '00000000-0000-4000-8000-000000000001';
    const path = `${userId}/analyses/scan.jpg`;
    const publicUrl = `https://abc123.supabase.co/storage/v1/object/public/plant-images/${path}`;

    mockCreateAnalysis.mockResolvedValue({
      id: 'analysis-1',
      image_url: publicUrl,
    });
    mockAddPlant.mockResolvedValue({ id: 'plant-1' });

    const result = await processPlantImageUpload({} as never, {
      userId,
      imageRef: path,
      nickname: '거실',
      addToCollection: true,
    });

    expect(result.publicUrl).toBe(publicUrl);
    expect(mockAddPlant).toHaveBeenCalledWith({} as never, {
      userId,
      analysisId: 'analysis-1',
      nickname: '거실',
    });
    expect(result.plant?.id).toBe('plant-1');
  });
});
