import {
  STORAGE_ALLOWED_MIME_TYPES,
  type StorageAllowedMimeType,
  isAllowedMimeType,
} from '@/lib/storage';

export type CameraFacingMode = 'environment' | 'user';

export const JPEG_QUALITY = 0.92;

export const getExtensionForMimeType = (
  mimeType: StorageAllowedMimeType,
): string => {
  const extensions: Record<StorageAllowedMimeType, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
  };
  return extensions[mimeType];
};

export const buildAnalysisFileName = (
  mimeType: StorageAllowedMimeType,
  id = crypto.randomUUID(),
): string => `${id}.${getExtensionForMimeType(mimeType)}`;

export const validateImageBlob = (
  blob: Blob,
  mimeType: string,
): StorageAllowedMimeType | null => {
  if (blob.size > 5_242_880) {
    return null;
  }

  if (!isAllowedMimeType(mimeType)) {
    return null;
  }

  return mimeType;
};

export const validateImageFile = (
  file: File,
): StorageAllowedMimeType | null => validateImageBlob(file, file.type);

export const captureVideoFrame = (
  video: HTMLVideoElement,
  mimeType: StorageAllowedMimeType = 'image/jpeg',
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      reject(new Error('카메라가 준비되지 않았습니다.'));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('이미지 캡처에 실패했습니다.'));
      return;
    }

    context.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('이미지 캡처에 실패했습니다.')),
      mimeType,
      JPEG_QUALITY,
    );
  });

export const normalizeCaptureMimeType = (
  mimeType: string | undefined,
): StorageAllowedMimeType =>
  mimeType && isAllowedMimeType(mimeType) ? mimeType : 'image/jpeg';

export const getCameraErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return '카메라를 시작할 수 없습니다.';
  }

  if (error.name === 'NotAllowedError') {
    return '카메라 권한이 필요합니다. 갤러리에서 선택할 수도 있습니다.';
  }

  if (error.name === 'NotFoundError') {
    return '사용 가능한 카메라가 없습니다. 갤러리에서 선택해 주세요.';
  }

  return error.message;
};

export const ACCEPTED_IMAGE_INPUT = STORAGE_ALLOWED_MIME_TYPES.join(',');
