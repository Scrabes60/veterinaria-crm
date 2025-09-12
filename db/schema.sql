-- Esquema base multi-tenant para Veterinaria CRM

create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text default 'STARTER',
  status text default 'trialing',
  created_at timestamptz default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  created_at timestamptz default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('OWNER','ADMIN','VET','RECEP','READONLY')),
  unique (org_id, user_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  species text check (species in ('perro','gato','otro')),
  breed text,
  sex text check (sex in ('M','H','N/A')),
  birthdate date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  vet_user_id uuid references auth.users(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text default 'scheduled' check (status in ('scheduled','checked_in','done','no_show','cancelled')),
  notes text,
  created_at timestamptz default now()
);

-- Auditoría simple
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text,
  entity text,
  entity_id uuid,
  payload jsonb,
  ip inet,
  created_at timestamptz default now()
);

-- RLS
alter table public.organizations enable row level security;
alter table public.branches enable row level security;
alter table public.memberships enable row level security;
alter table public.customers enable row level security;
alter table public.pets enable row level security;
alter table public.appointments enable row level security;
alter table public.audit_logs enable row level security;

-- Políticas por organización (ejemplos)
create policy org_sel_memberships on public.memberships
  for select using ( auth.uid() = user_id );

create policy org_ins_memberships on public.memberships
  for insert with check (
    exists (select 1 from public.memberships m
            where m.org_id = memberships.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN'))
  );

-- Clientes/mascotas/citas: acceso si soy miembro de la org
create policy org_sel_customers on public.customers
  for select using (
    exists (select 1 from public.memberships m
            where m.org_id = customers.org_id
              and m.user_id = auth.uid())
  );
create policy org_ins_customers on public.customers
  for insert with check (
    exists (select 1 from public.memberships m
            where m.org_id = customers.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN','VET','RECEP'))
  );
create policy org_upd_customers on public.customers
  for update using (
    exists (select 1 from public.memberships m
            where m.org_id = customers.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN','VET','RECEP'))
  );

create policy org_sel_pets on public.pets
  for select using (
    exists (select 1 from public.memberships m
            where m.org_id = pets.org_id
              and m.user_id = auth.uid())
  );
create policy org_cud_pets on public.pets
  for all using (
    exists (select 1 from public.memberships m
            where m.org_id = pets.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN','VET','RECEP'))
  ) with check (
    exists (select 1 from public.memberships m
            where m.org_id = pets.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN','VET','RECEP'))
  );

create policy org_sel_appt on public.appointments
  for select using (
    exists (select 1 from public.memberships m
            where m.org_id = appointments.org_id
              and m.user_id = auth.uid())
  );
create policy org_cud_appt on public.appointments
  for all using (
    exists (select 1 from public.memberships m
            where m.org_id = appointments.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN','VET','RECEP'))
  ) with check (
    exists (select 1 from public.memberships m
            where m.org_id = appointments.org_id
              and m.user_id = auth.uid()
              and m.role in ('OWNER','ADMIN','VET','RECEP'))
  );
