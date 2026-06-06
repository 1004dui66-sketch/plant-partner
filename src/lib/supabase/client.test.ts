import { describe, expect, it, beforeEach } from 'vitest';
import {
  createSupabaseBrowserClient,
  resetSupabaseBrowserClientForTests,
} from './client';

describe('createSupabaseBrowserClient', () => {
  beforeEach(() => {
    resetSupabaseBrowserClientForTests();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  it('브라우저 클라이언트 싱글톤을 반환한다', () => {
    const first = createSupabaseBrowserClient();
    const second = createSupabaseBrowserClient();
    expect(first).toBe(second);
  });

  it('환경 변수가 없으면 에러를 던진다', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(() => createSupabaseBrowserClient()).toThrow(
      'Supabase 환경 변수가 설정되지 않았습니다.',
    );
  });
});
