import { createSupabaseBrowserClient } from './client';

/** 브라우저 Supabase 클라이언트 싱글톤 (supabaseClient.js 패턴) */
export const supabaseClient = createSupabaseBrowserClient();
