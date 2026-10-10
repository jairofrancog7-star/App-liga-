-- Tabla exclusiva para preferencias del usuario autenticado, sin roles ni contraseñas.
create table if not exists public.profile_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb check (jsonb_typeof(profile) = 'object'),
  prefs jsonb not null default '{}'::jsonb check (jsonb_typeof(prefs) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.profile_preferences enable row level security;
drop policy if exists "profile_preferences_read_self" on public.profile_preferences;
create policy "profile_preferences_read_self" on public.profile_preferences for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "profile_preferences_insert_self" on public.profile_preferences;
create policy "profile_preferences_insert_self" on public.profile_preferences for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "profile_preferences_update_self" on public.profile_preferences;
create policy "profile_preferences_update_self" on public.profile_preferences for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "profile_preferences_delete_self" on public.profile_preferences;
create policy "profile_preferences_delete_self" on public.profile_preferences for delete to authenticated using (user_id = (select auth.uid()));
revoke all on public.profile_preferences from anon, public;
grant select, insert, update, delete on public.profile_preferences to authenticated;
