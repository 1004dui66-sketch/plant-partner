import { beforeEach, describe, expect, it } from 'vitest';
import { resetSupabaseBrowserClientForTests } from './client';

describe('supabaseClient.js', () => {
  beforeEach(() => {
    resetSupabaseBrowserClientForTests();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  it('브라우저 클라이언트를 export한다', async () => {
    const { supabaseClient } = await import('./supabaseClient.js');
    const { createSupabaseBrowserClient } = await import('./client');

    expect(supabaseClient).toBeDefined();
    expect(supabaseClient.auth).toBeDefined();
    expect(supabaseClient).toBe(createSupabaseBrowserClient());
  });
});
