-- V1208: Un segundo administrador principal para Avisos y Juntas.
-- Solo se inserta mediante una sesión /api/me del propietario real, después
-- de consultar /api/admins del CMS. No se autoriza por teléfono ni correo.
CREATE TABLE IF NOT EXISTS ljr_co_principals (
 subject TEXT PRIMARY KEY CHECK (subject ~ '^[A-Za-z0-9:_-]{1,128}$'),
 approved_by TEXT NOT NULL,
 approved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Un único segundo principal; el primero es owner=true en el servidor CMS.
CREATE UNIQUE INDEX IF NOT EXISTS ljr_one_secondary_principal
 ON ljr_co_principals ((true));
