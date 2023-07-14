-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Kwadwo Addo', 'yharnamfc@outlook.com', 'luu' ,'MOCK'),
  ('angelo ogbonna', 'kwadwoaddo97@gmail.com', 'captain_ogbonna' ,'MOCK'),
  ('Khal Drogo', 'khaleesidaddy@gmail.com', 'BigDrogo' ,'MOCK')
  ;

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'luu' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  ),
  (
    (SELECT uuid from public.users WHERE users.handle = 'captain_ogbonna' LIMIT 1),
    'I am the other guy!',
    current_timestamp + interval '10 day'
  );