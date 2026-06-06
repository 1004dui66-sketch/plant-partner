import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  SupabaseProvider,
  useSupabase,
  useSupabaseUser,
} from './SupabaseProvider';
import { resetSupabaseBrowserClientForTests } from '@/lib/supabase/client';

const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('@/lib/supabase/client', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/supabase/client')>();
  return {
    ...original,
    createSupabaseBrowserClient: () =>
      ({
        auth: {
          getUser: mockGetUser,
          onAuthStateChange: mockOnAuthStateChange,
        },
      }) as unknown as ReturnType<typeof original.createSupabaseBrowserClient>,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SupabaseProvider>{children}</SupabaseProvider>
);

describe('SupabaseProvider', () => {
  beforeEach(() => {
    resetSupabaseBrowserClientForTests();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetSupabaseBrowserClientForTests();
  });

  it('useSupabase로 브라우저 클라이언트를 제공한다', () => {
    const { result } = renderHook(() => useSupabase(), { wrapper });
    expect(result.current.auth.getUser).toBeDefined();
  });

  it('Provider 밖에서 useSupabase 호출 시 에러를 던진다', () => {
    expect(() => renderHook(() => useSupabase())).toThrow(
      'useSupabase는 SupabaseProvider 안에서 사용해야 합니다.',
    );
  });

  it('useSupabaseUser로 로그인 사용자를 조회한다', async () => {
    const { result } = renderHook(() => useSupabaseUser(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toEqual({ id: 'user-1' });
  });
});
