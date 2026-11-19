-- Allow members to opt their shared identity into CAST (append-only apps).
-- Run after 005_profiles_and_member_auth.sql.

create or replace function public.profiles_guard_sensitive()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and coalesce(auth.role(), '') = 'authenticated' then
    new.role := old.role;
    new.id := old.id;

    -- Append-only apps: keep previous entries, allow adding 'cast'.
    if new.apps is distinct from old.apps then
      if not (
        old.apps <@ new.apps
        and cardinality(new.apps) <= cardinality(old.apps) + 1
        and 'ten_talents' = any (new.apps)
        and (
          new.apps = old.apps
          or 'cast' = any (new.apps)
        )
      ) then
        new.apps := old.apps;
      end if;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.link_cast_app()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set apps = case
    when apps is null then array['ten_talents', 'cast']::text[]
    when 'cast' = any (apps) then apps
    else array_append(apps, 'cast')
  end
  where id = auth.uid()
  returning * into row;

  if row.id is null then
    raise exception 'Profile not found';
  end if;

  return row;
end;
$$;

revoke all on function public.link_cast_app() from public;
grant execute on function public.link_cast_app() to authenticated;
