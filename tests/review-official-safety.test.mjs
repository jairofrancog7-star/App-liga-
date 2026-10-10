import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {audit,markdown} from '../.github/scripts/review-official-data.mjs';
import {ROLE_PERMS,can} from '../server/notifications/authorization.mjs';

const code=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const fixture=()=>({
 official:{categories:{1:{},2:{},3:{},4:{},5:{}}},
 publicOfficial:{categories:{1:{},2:{},3:{},4:{},5:{}}},
 adminfut:{cedulaScoreDifferences:[]},
 scheduled:[]
});

test('La aprobación sólo pertenece a Presidencia autenticada',()=>{
 assert.equal(can('presidente','notices:approve'),true);
 for(const role of ['editor','secretario','disciplina','lector'])
   assert.equal(can(role,'notices:approve'),false,role);
 assert.equal(ROLE_PERMS.presidente.filter(x=>x==='notices:approve').length,1);
});

test('Los nuevos avisos se crean como borradores; la programación necesita aprobación persistente',()=>{
 const server=code('server/notifications/index.mjs');
 assert.match(server,/INSERT INTO ljr_scheduled_notices[^\n]+status\) VALUES\([^\n]+'draft'\)/);
 assert.match(server,/app\.post\('\/admin\/notices\/:id\/approve',admin,requirePermission\('notices:approve'\)/);
 assert.match(server,/approved_by=\$3,approved_at=now\(\)/);
 assert.match(server,/AND approved_at IS NOT NULL AND send_at<=now\(\)/);
 assert.match(server,/status='draft',approved_by=NULL,approved_at=NULL/);
 assert.match(server,/revision=revision\+1/);
 const migration=code('server/notifications/approval-schema.sql');
 assert.match(migration,/SET status='draft'/);
 assert.match(migration,/approved_at IS NULL/);
 assert.match(code('server/notifications/Dockerfile'),/approval-schema\.sql/);
});

test('El móvil nunca ofrece aprobación sin permiso real del servidor',()=>{
 const ui=code('src/v1081-global-admin-notices.js');
 assert.doesNotThrow(()=>new Function(ui));
 assert.match(ui,/call\('\/admin\/me'\)/);
 assert.match(ui,/me\.actor\.permissions\.includes\('notices:approve'\)/);
 assert.match(ui,/if\(item\.status==='draft'&&canApprove\)/);
 assert.match(ui,/method:'POST',body:\{revision:item.revision\}/);
});

test('Revisión automática detecta discrepancias sin modificar información oficial',()=>{
 const data=fixture();
 const current=audit(data,new Date('2026-10-10T16:00:00Z'));
 assert.equal(current.status,'ok');
 assert.equal(current.warnings.length,0);
 data.publicOfficial.categories['1']={teams:42};
 const invalid=audit(data,new Date('2026-10-10T16:00:00Z'));
 assert.equal(invalid.status,'needs_attention');
 assert.ok(invalid.warnings.some(x=>x.includes('no son idénticas')));
 assert.match(markdown(invalid),/No se publicaron cambios oficiales/);
});

test('Borradores sin autorización se incluyen como pendientes, nunca elegibles',()=>{
 const data=fixture();
 data.scheduled=[
  {id:'a',title:'Borrador',publishAt:'2000-01-01T00:00:00Z'},
  {id:'b',title:'Aprobado',publishAt:'2026-12-01T00:00:00Z',
   approval:{status:'approved',by:'presidencia',at:'2026-10-10T12:00:00Z'}}
 ];
 const res=audit(data,new Date('2026-10-10T16:00:00Z'));
 assert.equal(res.counts.unapprovedNotices,1);
 assert.ok(res.review.some(v=>v.includes('pendientes de aprobación')));
 assert.ok(res.checks.some(v=>v.includes('1 aviso(s) elegibles')));
});

test('La revisión de cron es sólo lectura y no toca ni datos ni sitio',()=>{
 const yml=code('.github/workflows/official-review-approval.yml');
 assert.match(yml,/contents: read/);
 assert.doesNotMatch(yml,/contents: write|gh pr merge|git push/);
 assert.match(code('.github/scripts/process_scheduled_notices.py'),/not approved\(item\)/);
 assert.match(code('.github/scripts/process_scheduled_notices.py'),/hmac\.compare_digest/);
 assert.match(code('.github/workflows/scheduled-notices.yml'),/LJR_OFFICIAL_NOTICE_APPROVAL_SECRET/);
});
