import { afterEach, describe, expect, it } from 'vitest';
import {
  buildPublicStorageUrl,
  parseStoragePathFromPublicUrl,
  toPublicStorageUrl,
} from './public-url';

describe('public-url helpers', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it('storage path에서 public URL을 생성한다', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc123.supabase.co';
    const path = 'user-1/analyses/scan.jpg';

    expect(buildPublicStorageUrl(path)).toBe(
      'https://abc123.supabase.co/storage/v1/object/public/plant-images/user-1/analyses/scan.jpg',
    );
  });

  it('public URL에서 storage path를 파싱한다', () => {
    const path = 'user-1/analyses/scan.jpg';
    const publicUrl = `https://abc123.supabase.co/storage/v1/object/public/plant-images/${path}`;

    expect(parseStoragePathFromPublicUrl(publicUrl)).toBe(path);
  });

  it('이미 public URL이면 그대로 반환한다', () => {
    const publicUrl =
      'https://abc123.supabase.co/storage/v1/object/public/plant-images/user-1/analyses/a.jpg';

    expect(toPublicStorageUrl(publicUrl)).toBe(publicUrl);
  });
});
