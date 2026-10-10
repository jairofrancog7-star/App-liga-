-- Ejecutar una sola vez en PostgreSQL (con cuenta de la liga).
CREATE TABLE IF NOT EXISTS ljr_push_subscriptions (
 endpoint TEXT PRIMARY KEY,
 subscription JSONB NOT NULL,
 category TEXT NOT NULL DEFAULT 'Todas',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ljr_message_consent (
 phone TEXT NOT NULL,
 channel TEXT NOT NULL CHECK(channel IN ('sms','whatsapp')),
 category TEXT NOT NULL DEFAULT 'Todas',
 consent_at TIMESTAMPTZ NOT NULL,
 consent_source TEXT NOT NULL,
 opted_out_at TIMESTAMPTZ,
 PRIMARY KEY(phone, channel)
);
CREATE TABLE IF NOT EXISTS ljr_scheduled_notices (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 body TEXT NOT NULL,
 category TEXT NOT NULL DEFAULT 'Todas',
 channels TEXT[] NOT NULL,
 send_at TIMESTAMPTZ NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','processing','done')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ljr_notices_due_idx ON ljr_scheduled_notices(send_at) WHERE status='queued';
CREATE TABLE IF NOT EXISTS ljr_delivery_log (
 notice_id TEXT NOT NULL REFERENCES ljr_scheduled_notices(id) ON DELETE CASCADE,
 channel TEXT NOT NULL,
 recipient_key TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 provider_sid TEXT,
 last_error TEXT,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY(notice_id,channel,recipient_key)
);
CREATE INDEX IF NOT EXISTS ljr_delivery_sid_idx ON ljr_delivery_log(provider_sid) WHERE provider_sid IS NOT NULL;


-- V1081: roles comprobados por sesion desde el backend de medios.
-- Una cuenta no incluida aqui queda en LECTOR; el presidente se reconoce unicamente
-- por la respuesta verificada /api/me del servicio de la Liga.
CREATE TABLE IF NOT EXISTS ljr_admin_roles (
 subject TEXT PRIMARY KEY,
 role TEXT NOT NULL DEFAULT 'lector' CHECK(role IN ('secretario','editor','disciplina','lector')),
 updated_by TEXT NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ljr_admin_audit (
 id BIGSERIAL PRIMARY KEY,
 actor TEXT NOT NULL,
 role TEXT NOT NULL,
 action TEXT NOT NULL,
 target TEXT NOT NULL,
 detail JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ljr_admin_audit_when_idx ON ljr_admin_audit(created_at DESC);
ALTER TABLE ljr_scheduled_notices ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE ljr_scheduled_notices ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1;
ALTER TABLE ljr_scheduled_notices ADD COLUMN IF NOT EXISTS processing_at TIMESTAMPTZ;
ALTER TABLE ljr_scheduled_notices ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE ljr_scheduled_notices DROP CONSTRAINT IF EXISTS ljr_scheduled_notices_status_check;
ALTER TABLE ljr_scheduled_notices ADD CONSTRAINT ljr_scheduled_notices_status_check
 CHECK(status IN ('queued','processing','done','cancelled'));
CREATE INDEX IF NOT EXISTS ljr_public_notices_idx
 ON ljr_scheduled_notices(published_at DESC) WHERE status='done';
