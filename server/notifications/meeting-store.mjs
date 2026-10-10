/* Liga Juventino Rosas · archivo privado de juntas. Sin rutas públicas. */
export const MEETING_DATE=/^\d{4}-\d{2}-\d{2}$/;
export function validMeetingDate(date){
 if(typeof date!=='string'||!MEETING_DATE.test(date))return false;
 const x=new Date(date+'T12:00:00Z');
 return Number.isFinite(+x)&&x.toISOString().slice(0,10)===date&&x.getUTCDay()===2;
}
export function prepareMeeting(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('La minuta debe ser un objeto');
 const serialized=JSON.stringify(payload);
 if(!serialized||serialized.length>15500)throw Error('Minuta demasiado grande; guarda los archivos en el dispositivo');
 const plain=JSON.parse(serialized);
 if(!Array.isArray(plain.attendance)||!Array.isArray(plain.tasks)||!Array.isArray(plain.votes))throw Error('Faltan listas obligatorias');
 if(plain.attendance.length>250||plain.tasks.length>350||plain.votes.length>90)throw Error('Exceso de registros');
 if(plain.attendance.some(x=>!x||typeof x.team!=='string'||x.team.length>90||typeof x.delegate!=='string'||x.delegate.length>120))throw Error('Delegado no válido');
 if(plain.tasks.some(x=>!x||typeof x.name!=='string'||x.name.length>240))throw Error('Acuerdo no válido');
 if(plain.votes.some(x=>!x||typeof x.title!=='string'||x.title.length>180))throw Error('Propuesta no válida');
 if(plain.sign?.images&&Object.keys(plain.sign.images).length)throw Error('Las firmas manuscritas permanecen en el dispositivo; no se suben al servidor');
 if(Array.isArray(plain.attachments)&&plain.attachments.length)throw Error('Los archivos se administran en el dispositivo; no se suben al servidor');
 if(/data:image\/|data:application\/|<script\b/i.test(serialized))throw Error('La minuta contiene archivos o código no permitidos');
 return plain;
}
export function registerMeetingRoutes({app,pool,admin,requirePermission,audit,apiError}){
 app.get('/admin/meetings',admin,requirePermission('meetings:read'),async(req,res)=>{
  try{
   const r=await pool.query('SELECT meeting_date,revision,updated_at,updated_by FROM ljr_meeting_minutes ORDER BY meeting_date DESC LIMIT 300');
   res.json({items:r.rows.map(x=>({date:x.meeting_date instanceof Date?x.meeting_date.toISOString().slice(0,10):String(x.meeting_date).slice(0,10),revision:x.revision,updated_at:x.updated_at,updated_by:x.updated_by}))});
  }catch(e){apiError(e,res)}
 });
 app.get('/admin/meetings/:date',admin,requirePermission('meetings:read'),async(req,res)=>{
  if(!validMeetingDate(req.params.date))return res.status(400).json({error:'Fecha de martes inválida'});
  try{
   const r=await pool.query('SELECT payload,revision,updated_at,updated_by FROM ljr_meeting_minutes WHERE meeting_date=$1',[req.params.date]);
   if(!r.rowCount)return res.status(404).json({error:'La junta aún no está guardada en el servidor'});
   res.json({date:req.params.date,payload:r.rows[0].payload,revision:r.rows[0].revision,updated_at:r.rows[0].updated_at,updated_by:r.rows[0].updated_by});
  }catch(e){apiError(e,res)}
 });
 app.put('/admin/meetings/:date',admin,requirePermission('meetings:write'),async(req,res)=>{
  const date=req.params.date,revision=req.body?.ifRevision;
  if(!validMeetingDate(date))return res.status(400).json({error:'Fecha de martes inválida'});
  if(!Number.isSafeInteger(revision)||revision<0)return res.status(400).json({error:'Falta la versión esperada de la junta'});
  let payload;
  try{payload=prepareMeeting(req.body?.payload)}catch(e){return res.status(400).json({error:e.message})}
  try{
   const sql='INSERT INTO ljr_meeting_minutes(meeting_date,payload,revision,updated_by) '+
     'SELECT $1::date,$2::jsonb,1,$3::text WHERE $4=0 '+
     'ON CONFLICT(meeting_date) DO UPDATE SET '+
     'payload=EXCLUDED.payload,revision=ljr_meeting_minutes.revision+1, '+
     'updated_by=EXCLUDED.updated_by,updated_at=now() '+
     'WHERE ljr_meeting_minutes.revision=$4 RETURNING revision,updated_at,updated_by';
   const r=await pool.query(sql,[date,JSON.stringify(payload),req.actor.subject,revision]);
   if(!r.rowCount)return res.status(409).json({error:'Otro administrador modificó esta junta; recarga antes de guardar'});
   await audit(req,'meetings:save',date,{revision:r.rows[0].revision});
   res.json({ok:true,date,revision:r.rows[0].revision,updated_at:r.rows[0].updated_at});
  }catch(e){apiError(e,res)}
 });
}
