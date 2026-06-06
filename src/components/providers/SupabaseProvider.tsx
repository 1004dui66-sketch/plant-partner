'use client';

import type { User } from '@supabase/supabase-js';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/lib/supabase/types';

type SupabaseContextValue = {
  readonly supabase: AppSupabaseClient;
};

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

type SupabaseProviderProps = {
  readonly children: ReactNode;
};

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const supabase = useMemo(
    () => createSupabaseBrowserClient() as unknown as AppSupabaseClient,
    [],
  );

  const value = useMemo(() => ({ supabase }), [supabase]);

  return (
    <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
  );
};

/** Client Component에서 Supabase DB·Auth·Storage 접근 */
export const useSupabase = (): AppSupabaseClient => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase는 SupabaseProvider 안에서 사용해야 합니다.');
  }

  return context.supabase;
};

type UseSupabaseUserResult = {
  readonly user: User | null;
  readonly isLoading: boolean;
};

/** Client Component에서 로그인 사용자 조회 */
export const useSupabaseUser = (): UseSupabaseUserResult => {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) {
        setUser(data.user);
        setIsLoading(false);
      }
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, isLoading };
};
