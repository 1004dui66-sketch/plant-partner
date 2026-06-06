import {
  STORAGE_BUCKET,
  buildStoragePath,
  isAllowedMimeType,
} from '@/lib/storage';
import { buildPublicStorageUrl } from '@/lib/storage/public-url';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { buildAnalysisFileName } from '@/lib/storage/camera';

export type UploadPlantImageInput = {
  file: Blob;
  userId: string;
  mimeType: string;
};

export type UploadPlantImageResult = {
  readonly storagePath: string;
  readonly publicUrl: string;
};

/** plant-images 버킷에 업로드하고 Public URL을 반환 */
export const uploadPlantImage = async ({
  file,
  userId,
  mimeType,
}: UploadPlantImageInput): Promise<UploadPlantImageResult> => {
  if (!isAllowedMimeType(mimeType)) {
    throw new Error('지원하지 않는 이미지 형식입니다.');
  }

  const supabase = createSupabaseBrowserClient();
  const fileName = buildAnalysisFileName(mimeType);
  const storagePath = buildStoragePath(userId, 'analyses', fileName);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    storagePath,
    publicUrl: buildPublicStorageUrl(storagePath),
  };
};

/** @deprecated uploadPlantImage 사용 */
export const uploadAnalysisImage = async (
  input: UploadPlantImageInput,
): Promise<string> => {
  const { publicUrl } = await uploadPlantImage(input);
  return publicUrl;
};
