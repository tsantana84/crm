create table contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table deals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  value numeric(12,2) default 0,
  stage text not null default 'lead'
    check (stage in ('lead','qualified','proposal','negotiation','closed_won','closed_lost')),
  contact_id uuid references contacts(id) on delete set null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table activities (
  id uuid default gen_random_uuid() primary key,
  type text not null
    check (type in ('call','email','meeting','task')),
  title text not null,
  description text,
  due_date date,
  completed boolean default false not null,
  contact_id uuid references contacts(id) on delete set null,
  deal_id uuid references deals(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_deals_stage on deals(stage);
create index idx_deals_contact_id on deals(contact_id);
create index idx_activities_contact_id on activities(contact_id);
create index idx_activities_deal_id on activities(deal_id);
create index idx_activities_due_date on activities(due_date);
create index idx_activities_completed on activities(completed);
