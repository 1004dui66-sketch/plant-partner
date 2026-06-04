import { DEFAULT_PLANT_IMAGE } from '@/lib/constants';
import { STORAGE_BUCKET } from '@/lib/storage';
import type { AppSupabaseClient } from '@/lib/supabase/types';

const SIGNED_URL_TTL_SECONDS = 3600;

export const isStoragePath = (value: string): boolean =>
  !value.startsWith('http://') && !value.startsWith('https://');

export const assertAnalysisStoragePath = (
  userId: string,
  storagePath: string,
): void => {
  const [ownerId, folder] = storagePath.split('/');

  if (ownerId !== userId || folder !== 'analyses') {
    throw new Error('유효하지 않은 이미지 경로입니다.');
  }
};

export const resolveImageUrl = async (
  supabase: AppSupabaseClient,
  imageRef: string | null | undefined,
): Promise<string> => {
  if (!imageRef) {
    return DEFAULT_PLANT_IMAGE;
  }

  if (!isStoragePath(imageRef)) {
    return imageRef;
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(imageRef, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return DEFAULT_PLANT_IMAGE;
  }

  return data.signedUrl;
};

export const resolveImageUrls = async (
  supabase: AppSupabaseClient,
  imageRefs: readonly (string | null | undefined)[],
): Promise<string[]> =>
  Promise.all(imageRefs.map((imageRef) => resolveImageUrl(supabase, imageRef)));
