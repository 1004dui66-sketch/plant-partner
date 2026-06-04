create table profiles (
  id uuid primary key references auth.users(id),
  created_at timestamptz default now()
);

create table plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),

  nickname text,
  plant_name text not null,
  scientific_name text,

  created_at timestamptz default now()
);

create table analyses (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id),
  plant_id uuid references plants(id),

  image_url text not null,

  plant_name text not null,
  scientific_name text,

  health_status text not null,
  diagnosis text not null,
  recommendation text not null,

  created_at timestamptz default now()
);

create table growth_logs (
  id uuid primary key default gen_random_uuid(),

  plant_id uuid not null references plants(id),

  image_url text,
  memo text,

  created_at timestamptz default now()
);
