import type { SupabaseClient } from '@supabase/supabase-js';

// 수동 스키마 유지 시 Supabase 제네릭과의 호환을 위해 any 사용
export type AppSupabaseClient = SupabaseClient<any>;
