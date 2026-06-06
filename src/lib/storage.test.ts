import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  STORAGE_BUCKET,
  STORAGE_POLICIES,
  buildStoragePath,
  getStorageOwnerId,
  isAllowedMimeType,
} from './storage';

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../supabase/migrations/20260531000002_storage_bucket_policies.sql',
);

const migrationSql = readFileSync(migrationPath, 'utf8');

describe('storage migration', () => {
  it('plant-images 버킷을 private로 생성한다', () => {
    expect(migrationSql).toContain(`'${STORAGE_BUCKET}'`);
    expect(migrationSql).toContain('false');
  });

  it('정의된 storage 정책을 모두 포함한다', () => {
    for (const policy of STORAGE_POLICIES) {
      expect(migrationSql).toContain(`create policy "${policy}"`);
    }
  });

  it('첫 번째 폴더를 auth.uid()로 제한한다', () => {
    expect(migrationSql).toContain('storage.foldername(name))[1]');
    expect(migrationSql).toContain('auth.uid()::text');
  });
});

describe('public bucket migration', () => {
  const publicMigrationPath = join(
    dirname(fileURLToPath(import.meta.url)),
    '../../supabase/migrations/20260531000006_plant_images_public_bucket.sql',
  );
  const publicMigrationSql = readFileSync(publicMigrationPath, 'utf8');

  it('plant-images 버킷을 public으로 전환한다', () => {
    expect(publicMigrationSql).toContain('set public = true');
    expect(publicMigrationSql).toContain(`'${STORAGE_BUCKET}'`);
  });
});

describe('buildStoragePath', () => {
  const userId = '00000000-0000-4000-8000-000000000001';
  const plantId = '00000000-0000-4000-8000-000000000002';

  it('분석 이미지 경로를 생성한다', () => {
    expect(buildStoragePath(userId, 'analyses', 'scan.jpg')).toBe(
      `${userId}/analyses/scan.jpg`,
    );
  });

  it('성장 로그 이미지 경로를 생성한다', () => {
    expect(
      buildStoragePath(userId, 'growth-logs', 'log.webp', plantId),
    ).toBe(`${userId}/growth-logs/${plantId}/log.webp`);
  });

  it('growth-logs는 plantId 없이 호출하면 에러를 던진다', () => {
    expect(() => buildStoragePath(userId, 'growth-logs', 'log.webp')).toThrow(
      'plantId',
    );
  });
});

describe('storage helpers', () => {
  it('경로에서 owner id를 추출한다', () => {
    expect(getStorageOwnerId('user-1/analyses/a.jpg')).toBe('user-1');
    expect(getStorageOwnerId('')).toBe('');
  });

  it('허용 MIME 타입만 통과시킨다', () => {
    expect(isAllowedMimeType('image/jpeg')).toBe(true);
    expect(isAllowedMimeType('application/pdf')).toBe(false);
  });
});
