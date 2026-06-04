-- profiles: signup 시 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS 활성화
alter table profiles enable row level security;
alter table plants enable row level security;
alter table analyses enable row level security;
alter table growth_logs enable row level security;

-- profiles
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- plants
create policy "plants_select_own"
  on plants for select
  using (auth.uid() = user_id);

create policy "plants_insert_own"
  on plants for insert
  with check (auth.uid() = user_id);

create policy "plants_update_own"
  on plants for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "plants_delete_own"
  on plants for delete
  using (auth.uid() = user_id);

-- analyses
create policy "analyses_select_own"
  on analyses for select
  using (auth.uid() = user_id);

create policy "analyses_insert_own"
  on analyses for insert
  with check (auth.uid() = user_id);

create policy "analyses_update_own"
  on analyses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "analyses_delete_own"
  on analyses for delete
  using (auth.uid() = user_id);

-- growth_logs (plants 소유권으로 접근 제어)
create policy "growth_logs_select_own"
  on growth_logs for select
  using (
    exists (
      select 1
      from plants
      where plants.id = growth_logs.plant_id
        and plants.user_id = auth.uid()
    )
  );

create policy "growth_logs_insert_own"
  on growth_logs for insert
  with check (
    exists (
      select 1
      from plants
      where plants.id = growth_logs.plant_id
        and plants.user_id = auth.uid()
    )
  );

create policy "growth_logs_update_own"
  on growth_logs for update
  using (
    exists (
      select 1
      from plants
      where plants.id = growth_logs.plant_id
        and plants.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from plants
      where plants.id = growth_logs.plant_id
        and plants.user_id = auth.uid()
    )
  );

create policy "growth_logs_delete_own"
  on growth_logs for delete
  using (
    exists (
      select 1
      from plants
      where plants.id = growth_logs.plant_id
        and plants.user_id = auth.uid()
    )
  );
