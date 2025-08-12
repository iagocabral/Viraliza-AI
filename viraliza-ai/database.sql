-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  subscription_status text check (subscription_status in ('free', 'pro')) default 'free',
  generation_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy to allow users to see only their own profile
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Create policy to allow users to insert their own profile
create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update updated_at column automatically
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();