export type ImagePayload = {
  readonly mimeType: string;
  readonly data: string;
};

export const fetchImageAsBase64 = async (url: string): Promise<ImagePayload> => {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`이미지를 불러오지 못했습니다. (HTTP ${response.status})`);
  }

  const mimeType =
    response.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg';
  const data = Buffer.from(await response.arrayBuffer()).toString('base64');

  return { mimeType, data };
};
