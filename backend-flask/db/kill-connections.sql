SELECT pg_terminate(pid) 
FROM pg_stat_activity 
WHERE
--do not kill own session
pid <>pg_backend_pid()
--do not kill connection to other databases
AND datname = 'cruddur';