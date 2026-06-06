import { describe, expect, it } from 'vitest';
import {
  assertAnalysisStoragePath,
  isStoragePath,
} from './resolve-image-url';
import { parseStoragePathFromPublicUrl } from './public-url';

describe('resolve-image-url helpers', () => {
  const userId = '00000000-0000-4000-8000-000000000001';

  it('storage path 여부를 판별한다', () => {
    expect(isStoragePath(`${userId}/analyses/photo.jpg`)).toBe(true);
    expect(isStoragePath('https://example.com/a.jpg')).toBe(false);
  });

  it('본인 analyses 경로만 허용한다', () => {
    expect(() =>
      assertAnalysisStoragePath(
        userId,
        `${userId}/analyses/abc.jpg`,
      ),
    ).not.toThrow();

    expect(() =>
      assertAnalysisStoragePath(userId, 'other-user/analyses/abc.jpg'),
    ).toThrow('유효하지 않은 이미지 경로');
  });

  it('public URL에서 storage path를 파싱한다', () => {
    const publicUrl =
      'https://abc123.supabase.co/storage/v1/object/public/plant-images/' +
      `${userId}/analyses/abc.jpg`;

    expect(() => assertAnalysisStoragePath(userId, `${userId}/analyses/abc.jpg`)).not.toThrow();
    expect(parseStoragePathFromPublicUrl(publicUrl)).toBe(`${userId}/analyses/abc.jpg`);
  });
});
