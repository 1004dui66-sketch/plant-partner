alter table plants
  add column if not exists image_url text;

alter table growth_logs
  add column if not exists activity_type text not null default 'water';

alter table profiles
  add column if not exists display_name text,
  add column if not exists bio text;
