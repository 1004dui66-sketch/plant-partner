alter table profiles
  add column if not exists caretaker_level int not null default 1,
  add column if not exists caretaker_tier text not null default '초보 식집사';

alter table plants
  add column if not exists is_active boolean not null default true;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table profiles;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'plants'
  ) then
    alter publication supabase_realtime add table plants;
  end if;
end $$;
