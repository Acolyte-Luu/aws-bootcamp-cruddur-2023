SELECT
    activities.uuid,
    activities.display_name,
    activities.handle,
    actiivities.message,
    actiivities.created_at,
    actiivities.expires_at
FROM public.activities
INNER JOIN public.users ON users.uuid = activities.user_uuid
WHERE activities.uuid = %(uuid)s

