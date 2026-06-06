import { submitScanImage } from '@/lib/actions/scan';
import { uploadPlantImage } from '@/lib/storage/upload-client';

export type HandleImageSubmitInput = {
  readonly file: Blob;
  readonly userId: string;
  readonly mimeType: string;
  readonly onProgress?: (label: string) => void;
};

export type HandleImageSubmitResult = {
  readonly publicUrl: string;
};

/**
 * 1) plant-images 버킷 업로드
 * 2) Public URL로 AI 진단 + analyses insert (서버 액션)
 */
export const handleImageSubmit = async ({
  file,
  userId,
  mimeType,
  onProgress,
}: HandleImageSubmitInput): Promise<HandleImageSubmitResult> => {
  onProgress?.('이미지 업로드 중...');

  const { publicUrl } = await uploadPlantImage({
    file,
    userId,
    mimeType,
  });

  onProgress?.('AI 분석 결과 저장 중...');
  await submitScanImage(publicUrl);

  return { publicUrl };
};
