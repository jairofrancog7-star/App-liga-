import test from 'node:test';
import assert from 'node:assert/strict';
import {registerMeetingRoutes,prepareMeeting} from '../server/notifications/meeting-store.mjs';
import {ROLE_PERMS,can} from '../server/notifications/authorization.mjs';

const meeting={
 attendance:[{team:'Boavista FC',delegate:'Delegado de prueba',status:'Presente'}],
 tasks:[{name:'Confirmar cancha de prueba',owner:'Secretario',due:'2026-10-20',status:'Pendiente'}],
 votes:[{title:'Propuesta de prueba',ballots:{'boavista fc':{team:'Boavista FC',vote:'Sí'}}}],
 sign:{president:'',secretary:'',approved:false},
 attachments:[]
};

function makeApi(){
 const rows=new Map(),auditLog=[],routes=new Map();
 const pool={async query(sql,args=[]){
  if(sql.startsWith('SELECT meeting_date,')){
   return {rowCount:rows.size,rows:[...rows.entries()].map(([meeting_date,r])=>({meeting_date,revision:r.revision,updated_by:r.updated_by,updated_at:r.updated_at})).sort((a,b)=>b.meeting_date.localeCompare(a.meeting_date))};
  }
  if(sql.startsWith('SELECT payload,')){
   const r=rows.get(args[0]);return {rowCount:r?1:0,rows:r?[r]:[]};
  }
  if(sql.startsWith('INSERT INTO ljr_meeting_minutes(')){
   const [date,serialized,actor,expected]=args;
   const stored=rows.get(date);
   if(!stored&&expected!==0)return {rowCount:0,rows:[]};
   if(stored&&stored.revision!==expected)return {rowCount:0,rows:[]};
   const result={payload:JSON.parse(serialized),revision:stored?stored.revision+1:1,updated_by:actor,updated_at:'2026-10-10T15:00:00.000Z'};
   rows.set(date,result);
   return {rowCount:1,rows:[result]};
  }
  throw Error('Unexpected SQL: '+sql.slice(0,80));
 }};
 const app={
  get(path,...handlers){routes.set('GET '+path,handlers)},
  put(path,...handlers){routes.set('PUT '+path,handlers)}
 };
 const admin=(req,res,next)=>{
  if(!req.authenticated)return res.status(401).json({error:'Se requiere una sesión'});
  req.actor={subject:req.subject||'usuario-prueba',role:req.role,permissions:ROLE_PERMS[req.role]||[]};
  next();
 };
 const requirePermission=permission=>(req,res,next)=>{
  if(!can(req.actor?.role,permission))return res.status(403).json({error:'No autorizado'});
  next();
 };
 registerMeetingRoutes({app,pool,admin,requirePermission,
  audit:async(req,action,target,detail)=>{auditLog.push({actor:req.actor.subject,action,target,detail})},
  apiError:(error,res)=>{throw error}
 });
 async function call(method,path,{date='2026-10-13',role='presidente',authenticated=true,body=undefined}={}){
  const pathKey=path.endsWith('/:date')?path:path;
  const handlers=routes.get(method+' '+pathKey);
  assert.ok(handlers,'Missing route '+method+' '+path);
  const req={authenticated,role,subject:'delegado-demo',params:{date},body};
  const result={status:200,body:null};
  const res={status(n){result.status=n;return this},json(value){result.body=value;return this}};
  for(const handler of handlers){
   let advanced=false;
   await handler(req,res,()=>{advanced=true});
   if(!advanced)break;
  }
  return result;
 }
 return {rows,auditLog,routes,call};
}

test('acceso anónimo o lector no puede leer ni escribir ninguna minuta',async()=>{
 const api=makeApi();
 for(const method of ['GET','PUT']){
  const path='/admin/meetings/:date';
  const unauth=await api.call(method,path,{authenticated:false,body:{ifRevision:0,payload:meeting}});
  assert.equal(unauth.status,401);
  for(const role of ['lector','editor','disciplina']){
   const forbidden=await api.call(method,path,{role,body:{ifRevision:0,payload:meeting}});
   assert.equal(forbidden.status,403,role+' must be blocked');
  }
 }
 assert.equal(api.rows.size,0);
});

test('presidente o secretario puede crear, leer y actualizar; conflicto impide perder cambios',async()=>{
 const api=makeApi(),path='/admin/meetings/:date';
 const initial=await api.call('PUT',path,{role:'secretario',body:{ifRevision:0,payload:meeting}});
 assert.equal(initial.status,200);
 assert.equal(initial.body.revision,1);
 const list=await api.call('GET','/admin/meetings',{role:'secretario'});
 assert.equal(list.body.items.length,1);
 assert.equal('payload' in list.body.items[0],false,'list must not leak the full minute');
 const loaded=await api.call('GET',path,{role:'presidente'});
 assert.equal(loaded.body.revision,1);
 assert.equal(loaded.body.payload.attendance[0].team,'Boavista FC');
 const revised={...meeting,tasks:[{...meeting.tasks[0],status:'Completado'}]};
 const update=await api.call('PUT',path,{role:'presidente',body:{ifRevision:1,payload:revised}});
 assert.equal(update.body.revision,2);
 const stale=await api.call('PUT',path,{role:'secretario',body:{ifRevision:1,payload:meeting}});
 assert.equal(stale.status,409);
 assert.equal(api.rows.get('2026-10-13').payload.tasks[0].status,'Completado');
 assert.deepEqual(api.auditLog.map(x=>x.action),['meetings:save','meetings:save']);
});

test('fechas inválidas, versión incorrecta y firmas o archivos bloquean la escritura',async()=>{
 const api=makeApi(),path='/admin/meetings/:date';
 assert.equal((await api.call('PUT',path,{date:'2026-10-14',body:{ifRevision:0,payload:meeting}})).status,400);
 assert.equal((await api.call('PUT',path,{body:{ifRevision:8,payload:meeting}})).status,409);
 assert.equal((await api.call('PUT',path,{body:{ifRevision:-1,payload:meeting}})).status,400);
 const images={...meeting,sign:{images:{president:'data:image/png;base64,QUJD'}}};
 assert.equal((await api.call('PUT',path,{body:{ifRevision:0,payload:images}})).status,400);
 const files={...meeting,attachments:[{name:'privado.pdf'}]};
 assert.equal((await api.call('PUT',path,{body:{ifRevision:0,payload:files}})).status,400);
 assert.equal(api.rows.size,0);
 assert.doesNotThrow(()=>prepareMeeting(meeting));
});
