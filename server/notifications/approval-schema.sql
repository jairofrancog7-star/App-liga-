-- Flujo de cuatro pasos: borrador, revisión, aprobación y envío.
-- Requiere ejecutar bootstrap antes de levantar el servidor.
ALTER TABLE ljr_scheduled_notices ADD COLUMN IF NOT EXISTS approved_by TEXT;
ALTER TABLE ljr_scheduled_notices ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE ljr_scheduled_notices DROP CONSTRAINT IF EXISTS ljr_scheduled_notices_status_check;
ALTER TABLE ljr_scheduled_notices ADD CONSTRAINT ljr_scheduled_notices_status_check
  CHECK(status IN ('draft','queued','processing','done','cancelled'));
ALTER TABLE ljr_scheduled_notices ALTER COLUMN status SET DEFAULT 'draft';
-- Fallar de forma segura: antiguas programaciones sin autorización explícita
-- regresan a revisión (nunca enviar solo porque ya venció la fecha).
UPDATE ljr_scheduled_notices SET status='draft', revision=revision+1
WHERE status='queued' AND approved_at IS NULL;
CREATE INDEX IF NOT EXISTS ljr_notices_approval_idx
 ON ljr_scheduled_notices(send_at) WHERE status='draft';
