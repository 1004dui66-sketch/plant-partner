import { STORAGE_BUCKET } from '@/lib/storage';

const PUBLIC_OBJECT_PREFIX = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

export const getSupabaseProjectUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  return url.replace(/\/$/, '');
};

export const buildPublicStorageUrl = (storagePath: string): string =>
  `${getSupabaseProjectUrl()}${PUBLIC_OBJECT_PREFIX}${storagePath}`;

export const parseStoragePathFromPublicUrl = (
  publicUrl: string,
): string | null => {
  const markerIndex = publicUrl.indexOf(PUBLIC_OBJECT_PREFIX);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    publicUrl.slice(markerIndex + PUBLIC_OBJECT_PREFIX.length),
  );
};

export const toPublicStorageUrl = (
  imageRef: string,
): string =>
  imageRef.startsWith('http://') || imageRef.startsWith('https://')
    ? imageRef
    : buildPublicStorageUrl(imageRef);
