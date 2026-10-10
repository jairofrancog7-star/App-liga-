-- Liga Juventino Rosas · V1224.
-- Ejecutar manualmente con credenciales privadas de PostgreSQL antes de desplegar el backend.
-- Solo modifica el CHECK de cargos permitidos, no asigna cuentas ni permisos.
BEGIN;
ALTER TABLE ljr_admin_roles DROP CONSTRAINT IF EXISTS ljr_admin_roles_role_check;
ALTER TABLE ljr_admin_roles ADD CONSTRAINT ljr_admin_roles_role_check
 CHECK (role IN ('secretario','editor','disciplina','arbitro','delegado','lector'));
COMMIT;
