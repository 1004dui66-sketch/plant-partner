alter table plants
  add column if not exists category text not null default '실내';

alter table analyses
  add column if not exists care_summary jsonb,
  add column if not exists confidence numeric(5, 2),
  add column if not exists symbolism text;

alter table profiles
  add column if not exists care_alerts_enabled boolean not null default true;
