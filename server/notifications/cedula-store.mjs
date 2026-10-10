/* Centro de cédulas arbitrales v1181 — permisos verificados en servidor.
   Los partidos del rol son solo referencias; jamás implican actas aprobadas. */
import crypto from 'node:crypto';
import QRCode from 'qrcode';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CATEGORIES=new Set(['1','2','3','4','5']);
const STATES=new Set(['draft','submitted','review','approved','published','correction','void']);
const asText=(s,max=120)=>typeof s==='string'?s.trim().slice(0,max):'';
const cleanName=s=>asText(s,100).replace(/[\u0000-\u001f\u007f]/g,'');
const safeDate=s=>{
 if(s===null||s===undefined||s==='')return null;
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('Fecha en formato AAAA-MM-DD');
 const d=new Date(s+'T12:00:00Z');
 if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==s)throw Error('Fecha inválida');
 return s;
};
function fixture(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Datos del partido inválidos');
 const categoryId=String(data.categoryId||''),home=cleanName(data.home),away=cleanName(data.away);
 const round=asText(data.round,35),field=cleanName(data.field),date=safeDate(data.date);
 if(!CATEGORIES.has(categoryId)||home.length<2||away.length<2||home.toLowerCase()===away.toLowerCase())
  throw Error('Indica categoría y dos equipos diferentes');
 const key=crypto.createHash('sha256').update(JSON.stringify([categoryId,home.toLowerCase(),away.toLowerCase(),round,date])).digest('hex');
 return {categoryId,home,away,round,field,date,key,assignedTo:asText(data.assignedTo,128)};
}
function payload(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Datos de acta inválidos');
 const num=v=>(v===null||v===undefined||v==='')?null:Number(v);
 const homeScore=num(raw.homeScore),awayScore=num(raw.awayScore);
 if([homeScore,awayScore].some(v=>v!==null&&(!Number.isInteger(v)||v<0||v>99)))throw Error('Marcador incorrecto');
 const incidents=Array.isArray(raw.incidents)?raw.incidents:[];
 if(incidents.length>100)throw Error('Máximo 100 incidencias');
 const types=new Set(['goal','yellow','red','second_yellow','substitution','injury','penalty','suspension','note']);
 const clean=incidents.map(e=>{
  if(!e||typeof e!=='object'||!types.has(e.type)||!['home','away','general'].includes(e.team))throw Error('Incidencia inválida');
  const minute=Number(e.minute);
  if(!Number.isInteger(minute)||minute<0||minute>150)throw Error('Minuto inválido');
  return {type:e.type,team:e.team,minute,player:cleanName(e.player),detail:asText(e.detail,180)};
 });
 const result={homeScore,awayScore,referee:cleanName(raw.referee),notes:asText(raw.notes,2000),incidents:clean};
 if(JSON.stringify(result).length>14500)throw Error('Acta demasiado extensa');
 return result;
}
const err=(res,status,message)=>res.status(status).json({error:message});
const publicView=row=>({id:row.id,categoryId:row.category_id,home:row.home,away:row.away,round:row.round,
 date:row.fixture_date?String(row.fixture_date).slice(0,10):null,field:row.field,status:row.status,
 revision:row.revision,publishedAt:row.published_at,verified:row.status==='published'});
const ownRole=(req,permission)=>Array.isArray(req.actor?.permissions)&&req.actor.permissions.includes(permission);
const assigned=(req,row)=>req.actor?.role!=='arbitro'||row.assigned_to===req.actor.subject;
async function event(client,req,id,action,detail){
 await client.query('INSERT INTO ljr_cedula_events(cedula_id,actor,role,action,detail) VALUES($1,$2,$3,$4,$5)',
 [id,req.actor.subject,req.actor.role,action,JSON.stringify(detail)]);
}
async function mutation(pool,req,res,handler){
 const client=await pool.connect();
 try{await client.query('BEGIN');const result=await handler(client);
  if(result?.error){await client.query('ROLLBACK');return err(res,result.status||400,result.error)}
  await client.query('COMMIT');res.status(result?.created?201:200).json(result);
 }catch(e){await client.query('ROLLBACK').catch(()=>{});console.error('Cedula mutation',e.code||e.name);err(res,500,'No se pudo guardar el acta')}
 finally{client.release()}
}
const allowed={
 draft:['submitted','void'],submitted:['review','correction'],review:['approved','correction'],
 approved:['published','correction'],published:['correction'],correction:['submitted','void'],void:[]
};
const hasTransition=(from,to)=>allowed[from]?.includes(to);
const readMetadata=async(pool,id)=>{
 const r=await pool.query('SELECT * FROM ljr_cedulas WHERE id=$1',[id]);return r.rows[0]||null;
};
export function registerCedulaRoutes({app,pool,admin,requirePermission,apiError}){
 const read=requirePermission('cedulas:read'),write=requirePermission('cedulas:write'),review=requirePermission('cedulas:review'),
 publish=requirePermission('cedulas:publish'),sign=requirePermission('cedulas:sign');
 app.get('/admin/cedulas',admin,read,async(req,res)=>{
  try{
   const category=String(req.query.category||''),limit=100;
   const r=await pool.query('SELECT id,category_id,home,away,round,fixture_date,field,status,revision,published_at,updated_at,signed_at FROM ljr_cedulas WHERE ($1::text = \'\' OR category_id=$1) AND ($3::text = \'\' OR assigned_to=$3) ORDER BY updated_at DESC LIMIT $2',[CATEGORIES.has(category)?category:'',limit,req.actor.role==='arbitro'?req.actor.subject:'']);
   const summary=await pool.query('SELECT status,count(*)::int AS count FROM ljr_cedulas GROUP BY status');
   res.json({items:r.rows.map(x=>({...publicView(x),signed:Boolean(x.signed_at),updatedAt:x.updated_at})),
    counts:Object.fromEntries(summary.rows.map(x=>[x.status,x.count])),total:summary.rows.reduce((n,x)=>n+x.count,0)});
  }catch(e){apiError(e,res)}
 });
 app.get('/admin/cedulas/:id',admin,read,async(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,400,'Identificador inválido');
  try{
   const row=await readMetadata(pool,req.params.id);
   if(!row||!assigned(req,row))return err(res,404,'Cédula no encontrada');
   const ev=await pool.query('SELECT actor,role,action,detail,created_at FROM ljr_cedula_events WHERE cedula_id=$1 ORDER BY id DESC LIMIT 70',[row.id]);
   const attachments=await pool.query('SELECT id,mime,filename,octet_length(content)::int AS size,created_at FROM ljr_cedula_attachments WHERE cedula_id=$1 ORDER BY created_at DESC',[row.id]);
   res.json({document:{...publicView(row),payload:row.payload,signed:Boolean(row.signed_at),
    signedAt:row.signed_at,signedBy:row.signed_by,reviewedBy:row.reviewed_by,
    updatedAt:row.updated_at,createdBy:row.created_by,assignedTo:row.assigned_to},events:ev.rows,attachments:attachments.rows});
  }catch(e){apiError(e,res)}
 });
 app.post('/admin/cedulas',admin,write,(req,res)=>{
  let input;
  try{input=fixture(req.body)}catch(e){return err(res,400,e.message)}
  if(input.assignedTo&&!/^[A-Za-z0-9:_-]{1,128}$/.test(input.assignedTo))return err(res,400,'Identificador de árbitro inválido');
  if(req.actor.role==='arbitro')input.assignedTo=req.actor.subject;
  mutation(pool,req,res,async(client)=>{
   const id=crypto.randomUUID();
   const r=await client.query('INSERT INTO ljr_cedulas(id,fixture_key,category_id,home,away,round,fixture_date,field,assigned_to,created_by,updated_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10) ON CONFLICT (fixture_key) DO NOTHING RETURNING id,revision',
    [id,input.key,input.categoryId,input.home,input.away,input.round,input.date,input.field,input.assignedTo||null,req.actor.subject]);
   if(!r.rowCount)return {error:'Esta cédula ya existe para el mismo partido. Actualiza la lista.',status:409};
   await event(client,req,id,'created',{categoryId:input.categoryId,home:input.home,away:input.away});
   return {ok:true,created:true,id,revision:1,status:'draft'};
  });
 });
 app.put('/admin/cedulas/:id',admin,write,(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,400,'Identificador inválido');
  const revision=req.body?.ifRevision;let p;
  if(!Number.isInteger(revision)||revision<1)return err(res,400,'Falta versión actual');
  try{p=payload(req.body?.payload)}catch(e){return err(res,400,e.message)}
  mutation(pool,req,res,async(client)=>{
   const r=await client.query('SELECT * FROM ljr_cedulas WHERE id=$1 FOR UPDATE',[req.params.id]);
   const row=r.rows[0];
   if(!row||!assigned(req,row))return {error:'Cédula no encontrada',status:404};
   if(row.revision!==revision)return {error:'Otra persona modificó el acta. Recupera la versión actual.',status:409};
   if(!['draft','correction'].includes(row.status))return {error:'Solo los borradores y las correcciones se pueden editar',status:409};
   await client.query('UPDATE ljr_cedulas SET payload=$2::jsonb,revision=revision+1,updated_at=now(),updated_by=$3,signed_at=NULL,signed_by=NULL WHERE id=$1',
   [row.id,JSON.stringify(p),req.actor.subject]);
   await event(client,req,row.id,'edited',{previousRevision:revision,score:[p.homeScore,p.awayScore],incidents:p.incidents.length});
   return {ok:true,id:row.id,status:row.status,revision:revision+1,signed:false};
  });
 });
 app.post('/admin/cedulas/:id/sign',admin,sign,(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,400,'Identificador inválido');
  const revision=req.body?.ifRevision;
  if(!Number.isInteger(revision)||revision<1||req.body?.acknowledge!==true)return err(res,400,'Confirma el contenido y la versión del acta');
  mutation(pool,req,res,async(client)=>{
   const r=await client.query('SELECT * FROM ljr_cedulas WHERE id=$1 FOR UPDATE',[req.params.id]),row=r.rows[0];
   if(!row||!assigned(req,row))return {error:'Cédula no encontrada',status:404};
   if(row.revision!==revision)return {error:'Versión desactualizada',status:409};
   if(!['draft','correction'].includes(row.status))return {error:'Solo se firman borradores',status:409};
   if(row.payload.homeScore===null||row.payload.awayScore===null)return {error:'Completa el marcador antes de firmar',status:400};
   await client.query('UPDATE ljr_cedulas SET signed_by=$2,signed_at=now(),revision=revision+1,updated_at=now(),updated_by=$2 WHERE id=$1',[row.id,req.actor.subject]);
   await event(client,req,row.id,'signed',{statement:'Confirmo que he revisado el contenido de esta cédula y asumo la autoría de esta firma electrónica simple.',revision});
   return {ok:true,revision:revision+1,signedBy:req.actor.subject,statement:'Firma electrónica simple; no sustituye una firma electrónica avanzada.'};
  });
 });
 app.post('/admin/cedulas/:id/status',admin,read,(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,400,'Identificador inválido');
  const target=String(req.body?.status||''),revision=req.body?.ifRevision,reason=asText(req.body?.reason,400);
  if(!STATES.has(target)||!Number.isInteger(revision)||revision<1)return err(res,400,'Estado o versión inválidos');
  mutation(pool,req,res,async(client)=>{
   const r=await client.query('SELECT * FROM ljr_cedulas WHERE id=$1 FOR UPDATE',[req.params.id]),row=r.rows[0];
   if(!row||!assigned(req,row))return {error:'Cédula no encontrada',status:404};
   if(row.revision!==revision)return {error:'Esta cédula cambió; recarga la versión actual',status:409};
   if(!hasTransition(row.status,target))return {error:'Transición de estado no permitida',status:409};
   const permission=['draft','submitted','void'].includes(target)?'cedulas:write':
     ['review','approved','correction'].includes(target)?'cedulas:review':'cedulas:publish';
   if(!ownRole(req,permission)||(target==='correction'&&row.status==='published'&&!ownRole(req,'cedulas:publish')))
    return {error:'Tu cargo no tiene permiso para esta acción',status:403};
   if(target==='approved'&&row.signed_by===req.actor.subject)return {error:'La revisión debe hacerla alguien distinto de quien firmó',status:403};
   if(['submitted','approved','published'].includes(target)&&(!row.signed_by||!row.signed_at))return {error:'El acta necesita firma del árbitro',status:409};
   if(['correction','void'].includes(target)&&reason.length<8)return {error:'Escribe el motivo de al menos 8 caracteres',status:400};
   if(target==='published'&&!row.reviewed_by)return {error:'Falta revisión de directiva',status:409};
   const newReview=target==='approved'?req.actor.subject:
    target==='correction'?null:row.reviewed_by;
   const publishDate=target==='published'?new Date().toISOString():null;
   await client.query('UPDATE ljr_cedulas SET status=$2,revision=revision+1,reviewed_by=$3,published_at=$4,updated_at=now(),updated_by=$5 WHERE id=$1',
    [row.id,target,newReview,publishDate,req.actor.subject]);
   await event(client,req,row.id,'status:'+target,{from:row.status,to:target,reason,previousRevision:revision});
   return {ok:true,revision:revision+1,status:target};
  });
 });
 app.post('/admin/cedulas/:id/attachments',admin,write,async(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,400,'Identificador inválido');
  const mime=String(req.body?.mime||''),encoded=req.body?.data;
  if(!['image/jpeg','image/png','application/pdf'].includes(mime)||typeof encoded!=='string'||encoded.length>2100000||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))return err(res,400,'Adjunta JPG, PNG o PDF de hasta 1,5 MB');
  const file=Buffer.from(encoded,'base64');
  if(!file.length||file.length>1500000)return err(res,400,'Archivo demasiado grande');
  const valid=mime==='image/jpeg'?(file[0]===0xff&&file[1]===0xd8&&file[2]===0xff):
   mime==='image/png'?(file.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))):
    file.subarray(0,5).toString('ascii')==='%PDF-';
  if(!valid)return err(res,400,'La firma del archivo no coincide con su formato');
  const filename=asText(req.body.filename,90).replace(/[^a-zA-Z0-9._-]/g,'_')||'evidencia';
  await mutation(pool,req,res,async(client)=>{
   const r=await client.query('SELECT id,status,assigned_to FROM ljr_cedulas WHERE id=$1 FOR UPDATE',[req.params.id]);
   if(!r.rowCount||!assigned(req,r.rows[0]))return {error:'Acta no encontrada',status:404};
   if(!['draft','correction'].includes(r.rows[0].status))return {error:'Los anexos solo se cargan durante la edición',status:409};
   const n=await client.query('SELECT count(*)::int n FROM ljr_cedula_attachments WHERE cedula_id=$1',[req.params.id]);
   if(n.rows[0].n>=5)return {error:'Máximo 5 anexos por cédula',status:409};
   const id=crypto.randomUUID();
   await client.query('INSERT INTO ljr_cedula_attachments(id,cedula_id,mime,filename,content,created_by) VALUES($1,$2,$3,$4,$5,$6)',
    [id,req.params.id,mime,filename,file,req.actor.subject]);
   await client.query('UPDATE ljr_cedulas SET signed_by=NULL,signed_at=NULL,reviewed_by=NULL,revision=revision+1,updated_at=now(),updated_by=$2 WHERE id=$1',[req.params.id,req.actor.subject]);
   await event(client,req,req.params.id,'attachment:added',{attachmentId:id,mime,size:file.length,signatureInvalidated:true});
   return {ok:true,created:true,id,signatureInvalidated:true};
  });
 });
 app.get('/admin/cedulas/:id/attachments/:attachment',admin,read,async(req,res)=>{
  if(!UUID.test(req.params.id)||!UUID.test(req.params.attachment))return err(res,400,'Identificador inválido');
  try{
   const doc=await readMetadata(pool,req.params.id);if(!doc||!assigned(req,doc))return err(res,404,'Anexo no encontrado');
   const r=await pool.query('SELECT mime,filename,content FROM ljr_cedula_attachments WHERE id=$1 AND cedula_id=$2',[req.params.attachment,req.params.id]);
   if(!r.rowCount)return err(res,404,'Anexo no encontrado');
   res.setHeader('Content-Type',r.rows[0].mime);res.setHeader('Content-Disposition','attachment; filename="anexo-celda"');
   res.setHeader('Content-Security-Policy','sandbox');res.send(r.rows[0].content);
  }catch(e){apiError(e,res)}
 });
 app.get('/admin/cedulas/:id/attachments/:attachment/file',admin,read,async(req,res)=>{
  if(!UUID.test(req.params.id)||!UUID.test(req.params.attachment))return err(res,400,'Identificador inválido');
  try{
   const doc=await readMetadata(pool,req.params.id);
   if(!doc||!assigned(req,doc))return err(res,404,'Anexo no encontrado');
   const r=await pool.query('SELECT mime,filename,content FROM ljr_cedula_attachments WHERE id=$1 AND cedula_id=$2',
   [req.params.attachment,req.params.id]);
   if(!r.rowCount)return err(res,404,'Anexo no encontrado');
   res.json({mime:r.rows[0].mime,filename:r.rows[0].filename,data:r.rows[0].content.toString('base64')});
  }catch(e){apiError(e,res)}
 });
 app.get('/api/cedulas/verify/:id',async(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,404,'Acta no encontrada');
  try{const row=await readMetadata(pool,req.params.id);
   if(!row||row.status!=='published')return err(res,404,'No hay cédula pública aprobada para ese folio');
   res.json(publicView(row));
  }catch(e){apiError(e,res)}
 });
 app.get('/cedulas/verify/:id',async(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,404,'Acta no encontrada');
  try{
   const row=await readMetadata(pool,req.params.id);
   if(!row||row.status!=='published')return err(res,404,'No existe una cédula pública aprobada con ese folio');
   const safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   res.setHeader('Content-Type','text/html; charset=utf-8');
   res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
   res.send('<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verificación · Liga Juventino Rosas</title>'+
    '<main style="font-family:system-ui;background:#0b1557;color:white;max-width:560px;margin:8vh auto;padding:28px;border-radius:20px">'+
    '<h1>✓ Cédula publicada y verificada</h1><p><b>'+safe(row.home)+' vs '+safe(row.away)+'</b></p>'+
    '<p>Fecha: '+safe(row.fixture_date?String(row.fixture_date).slice(0,10):'Sin confirmar')+'</p>'+
    '<p>Categoría: '+safe(row.category_id)+' · Jornada '+safe(row.round)+'</p>'+
    '<p>Folio: '+safe(row.id)+' · Versión '+row.revision+'</p>'+
    '<small>La verificación confirma su publicación, no divulga firmas ni anexos privados.</small></main></html>');
  }catch(e){apiError(e,res)}
 });
 app.get('/cedulas/verify/:id/qr.png',async(req,res)=>{
  if(!UUID.test(req.params.id))return err(res,404,'Acta no encontrada');
  try{
   const row=await readMetadata(pool,req.params.id);
   if(!row||row.status!=='published')return err(res,404,'No hay cédula publicada para generar QR');
   const base=(process.env.CEDULAS_PUBLIC_BASE_URL||'https://liga-avisos-api-production.up.railway.app').replace(/\/+$/,'');
   if(!/^https:\/\/[a-z0-9.-]+$/i.test(base))return err(res,503,'URL pública no configurada');
   const png=await QRCode.toBuffer(base+'/cedulas/verify/'+row.id,{type:'png',margin:2,width:320,errorCorrectionLevel:'M'});
   res.type('png').send(png);
  }catch(e){apiError(e,res)}
 });
}
