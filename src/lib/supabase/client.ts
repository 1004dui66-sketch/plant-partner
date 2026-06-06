import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export const createSupabaseBrowserClient = () => {
  if (browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  browserClient = createBrowserClient<Database>(url, key);
  return browserClient;
};

/** 테스트에서 싱글톤 초기화 */
export const resetSupabaseBrowserClientForTests = (): void => {
  browserClient = undefined;
};
