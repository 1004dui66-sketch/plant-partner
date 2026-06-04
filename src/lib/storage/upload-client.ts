import {
  STORAGE_BUCKET,
  buildStoragePath,
  isAllowedMimeType,
  type StorageAllowedMimeType,
} from '@/lib/storage';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { buildAnalysisFileName } from '@/lib/storage/camera';

export type UploadAnalysisImageInput = {
  file: Blob;
  userId: string;
  mimeType: string;
};

export const uploadAnalysisImage = async ({
  file,
  userId,
  mimeType,
}: UploadAnalysisImageInput): Promise<string> => {
  if (!isAllowedMimeType(mimeType)) {
    throw new Error('지원하지 않는 이미지 형식입니다.');
  }

  const supabase = createSupabaseBrowserClient();
  const fileName = buildAnalysisFileName(mimeType);
  const path = buildStoragePath(userId, 'analyses', fileName);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return path;
};
