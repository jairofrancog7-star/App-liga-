-- Liga Juventino Rosas · V1224. Ejecutado por bootstrap.mjs.
-- Bootstrap proporciona una transacción y bloqueo advisory de PostgreSQL.
-- No concede cargos a nadie; amplía exclusivamente la restricción de valores.
-- También es seguro ejecutarlo manualmente en una transacción privada.
ALTER TABLE ljr_admin_roles DROP CONSTRAINT IF EXISTS ljr_admin_roles_role_check;
ALTER TABLE ljr_admin_roles ADD CONSTRAINT ljr_admin_roles_role_check
 CHECK (role IN ('secretario','editor','disciplina','arbitro','delegado','lector'));
