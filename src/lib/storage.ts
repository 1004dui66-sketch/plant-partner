export const STORAGE_BUCKET = 'plant-images' as const;

export const STORAGE_MAX_FILE_SIZE_BYTES = 5_242_880;

export const STORAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
] as const;

export type StorageAllowedMimeType =
  (typeof STORAGE_ALLOWED_MIME_TYPES)[number];

export const STORAGE_POLICIES = [
  'plant_images_select_own',
  'plant_images_insert_own',
  'plant_images_update_own',
  'plant_images_delete_own',
] as const;

export type StorageImageKind = 'analyses' | 'growth-logs';

const sanitizeSegment = (segment: string): string =>
  segment.replace(/[^a-zA-Z0-9._-]/g, '');

export const buildStoragePath = (
  userId: string,
  kind: StorageImageKind,
  fileName: string,
  plantId?: string,
): string => {
  const safeUserId = sanitizeSegment(userId);
  const safeFileName = sanitizeSegment(fileName);

  if (kind === 'growth-logs') {
    if (!plantId) {
      throw new Error('growth-logs 이미지는 plantId가 필요합니다.');
    }

    return `${safeUserId}/growth-logs/${sanitizeSegment(plantId)}/${safeFileName}`;
  }

  return `${safeUserId}/analyses/${safeFileName}`;
};

export const getStorageOwnerId = (path: string): string | null => {
  const [ownerId] = path.split('/');
  return ownerId ?? null;
};

export const isAllowedMimeType = (
  mimeType: string,
): mimeType is StorageAllowedMimeType =>
  (STORAGE_ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
