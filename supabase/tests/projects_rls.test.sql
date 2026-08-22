begin;

create extension if not exists pgtap with schema extensions;

select plan(16);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'owner@example.com',
    crypt('correct-horse-battery-staple', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Owner"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'other@example.com',
    crypt('correct-horse-battery-staple', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Other"}',
    now(),
    now()
  );

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select results_eq(
  $$select display_name from public.profiles$$,
  $$values ('Owner'::text)$$,
  'the owner can only read their profile'
);

select lives_ok(
  $$insert into public.projects (name, description) values ('Private project', 'Owner only')$$,
  'the owner can create a project'
);

select results_eq(
  $$select count(*)::integer from public.projects$$,
  $$values (1)$$,
  'the owner can read their project'
);

select throws_ok(
  $$insert into public.projects (user_id, name) values ('22222222-2222-4222-8222-222222222222', 'Foreign owner')$$,
  '42501',
  'new row violates row-level security policy for table "projects"',
  'the owner cannot create a project for another user'
);

select throws_ok(
  $$update public.projects set user_id = '22222222-2222-4222-8222-222222222222' where name = 'Private project'$$,
  '42501',
  'new row violates row-level security policy for table "projects"',
  'the owner cannot transfer a project through an update'
);

select lives_ok(
  $$update public.projects set status = 'building' where name = 'Private project'$$,
  'the owner can update their project'
);

select results_eq(
  $$select status from public.projects where name = 'Private project'$$,
  $$values ('building'::text)$$,
  'the owner sees the updated status'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);

select results_eq(
  $$select display_name from public.profiles$$,
  $$values ('Other'::text)$$,
  'another user can only read their profile'
);

select lives_ok(
  $$update public.profiles set display_name = 'Stolen' where id = '11111111-1111-4111-8111-111111111111'$$,
  'an unauthorized profile update returns without exposing a row'
);

select results_eq(
  $$select count(*)::integer from public.projects$$,
  $$values (0)$$,
  'another user cannot read the project'
);

select lives_ok(
  $$update public.projects set name = 'Stolen'$$,
  'an unauthorized update returns without exposing a row'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select results_eq(
  $$select display_name from public.profiles$$,
  $$values ('Owner'::text)$$,
  'the unauthorized profile update changed nothing'
);

select results_eq(
  $$select name from public.projects$$,
  $$values ('Private project'::text)$$,
  'the unauthorized update changed nothing'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);

select lives_ok(
  $$delete from public.projects$$,
  'an unauthorized delete returns without exposing a row'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::integer from public.projects$$,
  $$values (1)$$,
  'the unauthorized delete changed nothing'
);

select lives_ok(
  $$delete from public.projects where name = 'Private project'$$,
  'the owner can delete their project'
);

select * from finish();
rollback;
