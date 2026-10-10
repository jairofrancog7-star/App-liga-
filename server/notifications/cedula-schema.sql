-- V1181: centro de actas arbitrales. PostgreSQL privado, nunca GitHub Pages.
CREATE TABLE IF NOT EXISTS ljr_cedulas (
  id UUID PRIMARY KEY,
  fixture_key TEXT NOT NULL UNIQUE,
  category_id TEXT NOT NULL CHECK (category_id IN ('1','2','3','4','5')),
  home TEXT NOT NULL,
  away TEXT NOT NULL,
  round TEXT NOT NULL DEFAULT '',
  fixture_date DATE,
  field TEXT NOT NULL DEFAULT '',
  payload JSONB NOT NULL DEFAULT '{"homeScore":null,"awayScore":null,"referee":"","notes":"","incidents":[]}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft','submitted','review','approved','published','correction','void')),
  revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>0),
  assigned_to TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  signed_by TEXT,
  signed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ljr_cedulas_status_idx ON ljr_cedulas(status,updated_at DESC);
CREATE INDEX IF NOT EXISTS ljr_cedulas_category_idx ON ljr_cedulas(category_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS ljr_cedula_events (
  id BIGSERIAL PRIMARY KEY,
  cedula_id UUID NOT NULL REFERENCES ljr_cedulas(id) ON DELETE RESTRICT,
  actor TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ljr_cedula_events_doc_idx ON ljr_cedula_events(cedula_id,id DESC);
CREATE TABLE IF NOT EXISTS ljr_cedula_attachments (
  id UUID PRIMARY KEY,
  cedula_id UUID NOT NULL REFERENCES ljr_cedulas(id) ON DELETE RESTRICT,
  mime TEXT NOT NULL CHECK(mime IN ('image/jpeg','image/png','application/pdf')),
  filename TEXT NOT NULL,
  content BYTEA NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ljr_cedula_attachments_doc_idx ON ljr_cedula_attachments(cedula_id,created_at DESC);
-- Permitir que la directiva asigne árbitros autenticados, sin confiar en roles del navegador.
ALTER TABLE ljr_admin_roles DROP CONSTRAINT IF EXISTS ljr_admin_roles_role_check;
ALTER TABLE ljr_admin_roles ADD CONSTRAINT ljr_admin_roles_role_check
 CHECK(role IN ('secretario','editor','disciplina','arbitro','delegado','lector'));
