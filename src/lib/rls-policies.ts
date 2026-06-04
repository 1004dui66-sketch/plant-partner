export const RLS_TABLES = [
  'profiles',
  'plants',
  'analyses',
  'growth_logs',
] as const;

export type RlsTable = (typeof RLS_TABLES)[number];

export const RLS_POLICIES = {
  profiles: ['profiles_select_own', 'profiles_update_own'],
  plants: [
    'plants_select_own',
    'plants_insert_own',
    'plants_update_own',
    'plants_delete_own',
  ],
  analyses: [
    'analyses_select_own',
    'analyses_insert_own',
    'analyses_update_own',
    'analyses_delete_own',
  ],
  growth_logs: [
    'growth_logs_select_own',
    'growth_logs_insert_own',
    'growth_logs_update_own',
    'growth_logs_delete_own',
  ],
} as const satisfies Record<RlsTable, readonly string[]>;

export const PROFILE_TRIGGER = {
  function: 'handle_new_user',
  trigger: 'on_auth_user_created',
} as const;
