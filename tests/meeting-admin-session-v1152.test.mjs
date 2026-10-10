import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const script=readFileSync(new URL('../src/v1150-meeting-sync.js',import.meta.url),'utf8');

function harness(role='secretario',allowed=['meetings:read','meetings:write']){
 const calls=[],notices=[];
 let rendered=0;
 const api=async(path,opts)=>{
  calls.push({path,opts});
  if(path==='/admin/me')return {actor:{role,permissions:allowed}};
  if(path==='/admin/meetings')return {items:[{date:'2026-10-13',revision:3}]};
  if(path==='/admin/meetings/2026-10-13')return {date:'2026-10-13',revision:3,payload:{}};
  throw Object.assign(Error('not found'),{status:404});
 };
 const window={LJR_MEDIA:{admin:{role},notifyAPI:api}};
 runInNewContext(script,{window,document:{},navigator:{}});
 const ctx={
  date:()=> '2026-10-13',
  validDate:s=>s==='2026-10-13',
  fmt:date=>date,
  item:()=>({}),
  msg:s=>notices.push(s),
  render:()=>{rendered++}
 };
 return {window,ctx,calls,notices,get rendered(){return rendered++}};
}
const flush=async()=>{await new Promise(resolve=>setImmediate(resolve));await Promise.resolve()};
test('a genuine authenticated session performs strictly read-only diagnostics',async()=>{
 const h=harness();
 const changed=h.window.LJR_MEETING_SYNC_V1150.handle('sync-check',{},h.ctx);
 assert.equal(changed,true);
 await flush();
 assert.deepEqual(h.calls.map(x=>x.path),['/admin/me','/admin/meetings','/admin/meetings/2026-10-13']);
 assert.equal(h.calls.some(x=>x.opts?.method),false,'diagnostics must not send writes');
 assert.match(h.notices.join(' '),/Acceso verificado/);
 assert.match(h.window.LJR_MEETING_SYNC_V1150.view(h.ctx),/Cargo: secretario/);
 assert.match(h.window.LJR_MEETING_SYNC_V1150.view(h.ctx),/v3/);
});
test('read-only administrator sees rights but no editing approval',async()=>{
 const h=harness('lector-autorizado',['meetings:read']);
 h.window.LJR_MEETING_SYNC_V1150.handle('sync-check',{},h.ctx);
 await flush();
 assert.match(h.window.LJR_MEETING_SYNC_V1150.view(h.ctx),/Edición: sin permiso/);
 assert.match(h.notices.join(' '),/no puede guardar juntas/);
});
test('unprivileged actor gets no minute listings or uploads',async()=>{
 const h=harness('lector',[]);
 h.window.LJR_MEETING_SYNC_V1150.handle('sync-check',{},h.ctx);
 await flush();
 assert.deepEqual(h.calls.map(x=>x.path),['/admin/me']);
 assert.match(h.notices.join(' '),/no permite consultar juntas/);
});
test('no session blocks all access without contacting server',async()=>{
 const h=harness();h.window.LJR_MEDIA.admin=null;
 h.window.LJR_MEETING_SYNC_V1150.handle('sync-check',{},h.ctx);
 await flush();
 assert.equal(h.calls.length,0);
 assert.match(h.notices.join(' '),/Inicia sesión/);
});
