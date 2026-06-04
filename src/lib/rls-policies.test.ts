import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PROFILE_TRIGGER, RLS_POLICIES, RLS_TABLES } from './rls-policies';

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../supabase/migrations/20260531000001_rls_and_profile_trigger.sql',
);

const migrationSql = readFileSync(migrationPath, 'utf8');

describe('rls migration', () => {
  it('모든 테이블에 RLS를 활성화한다', () => {
    for (const table of RLS_TABLES) {
      expect(migrationSql).toContain(
        `alter table ${table} enable row level security`,
      );
    }
  });

  it('정의된 RLS 정책을 모두 포함한다', () => {
    for (const policies of Object.values(RLS_POLICIES)) {
      for (const policy of policies) {
        expect(migrationSql).toContain(`create policy "${policy}"`);
      }
    }
  });

  it('회원가입 시 profiles 자동 생성 트리거를 포함한다', () => {
    expect(migrationSql).toContain(
      `create or replace function public.${PROFILE_TRIGGER.function}()`,
    );
    expect(migrationSql).toContain(
      `create trigger ${PROFILE_TRIGGER.trigger}`,
    );
    expect(migrationSql).toContain('after insert on auth.users');
  });

  it('growth_logs는 plants 소유권으로 접근을 제한한다', () => {
    expect(migrationSql).toContain('from plants');
    expect(migrationSql).toContain('plants.user_id = auth.uid()');
  });
});
