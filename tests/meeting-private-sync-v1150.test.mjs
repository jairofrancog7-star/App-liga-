import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {prepareMeeting,validMeetingDate,registerMeetingRoutes} from '../server/notifications/meeting-store.mjs';

const front=readFileSync(new URL('../src/v1150-meeting-sync.js',import.meta.url),'utf8');
const hub=readFileSync(new URL('../src/v1130-meeting-hub.js',import.meta.url),'utf8');
const root=readFileSync(new URL('../index.html',import.meta.url),'utf8');

function fixture(){
 const routes={get:{},put:{}},queries=[],audits=[];
 const app={get:(p,...args)=>routes.get[p]=args.at(-1),put:(p,...args)=>routes.put[p]=args.at(-1)};
 const pool={query:async(sql,args=[])=>{queries.push({sql,args});return {rowCount:1,rows:[{revision:2,updated_at:new Date()}]}}};
 registerMeetingRoutes({app,pool,admin:()=>{},requirePermission:()=>()=>{},audit:async(...args)=>audits.push(args),apiError:()=>{}});
 return {routes,queries,audits};
}
const valid={attendance:[{team:'Boavista',delegate:'Ana'}],tasks:[{name:'Confirmar campo'}],votes:[{title:'Programación'}],sign:{president:'Presidente',secretary:'Secretaría'},attachments:[]};
test('sincronización mantiene estado local y carga antes que el panel',()=>{
 new Function(front);new Function(hub);
 assert.match(hub,/sync\(\)\?\.handle/);
 assert.match(root,/v1150-meeting-sync\.js/);
 assert.ok(root.indexOf('v1150-meeting-sync.js')<root.indexOf('v1130-meeting-hub.js'));
});
test('fechas son martes reales y validación descarta imágenes',()=>{
 assert.equal(validMeetingDate('2026-10-13'),true);
 assert.equal(validMeetingDate('2026-10-14'),false);
 assert.equal(validMeetingDate('2026-02-31'),false);
 assert.deepEqual(prepareMeeting(valid),valid);
 assert.throws(()=>prepareMeeting({...valid,sign:{images:{president:'data:image/png;base64,ABC'}}}),/firmas/);
 assert.throws(()=>prepareMeeting({...valid,attachments:[{name:'privado.pdf'}]}),/archivos/);
});
test('endpoints solo rutas admin y con control de versión SQL',async()=>{
 const x=fixture();
 assert.ok(x.routes.get['/admin/meetings']);
 assert.ok(x.routes.get['/admin/meetings/:date']);
 assert.ok(x.routes.put['/admin/meetings/:date']);
 const answers={code:200,body:null,status(n){this.code=n;return this},json(x){this.body=x;return this}};
 await x.routes.put['/admin/meetings/:date']({params:{date:'2026-10-13'},body:{ifRevision:1,payload:valid},actor:{subject:'presidente'}},answers);
 assert.equal(answers.body.ok,true);
 assert.match(x.queries[0].sql,/WHERE ljr_meeting_minutes\.revision=\$4/);
 assert.equal(x.queries[0].args[3],1);
 assert.equal(x.audits[0][1],'meetings:save');
});
test('el cliente sólo usa la API existente y no sincroniza firmas ni adjuntos',()=>{
 const window={LJR_MEDIA:{admin:{role:'secretario'}}};
 runInNewContext(front,{window,document:{},navigator:{}});
 const local={...valid,sign:{president:'P',images:{president:'data:image/png;base64,abc'}},attachments:[{name:'foto.jpg'}],remoteRevision:4};
 const stripped=window.LJR_MEETING_SYNC_V1150.exportable(local,{});
 assert.equal(stripped.sign.images,undefined);
 assert.deepEqual(JSON.parse(JSON.stringify(stripped.attachments)),[]);
 assert.equal(stripped.remoteRevision,undefined);
 assert.match(front,/notifyAPI/);
 assert.match(front,/confirm/);
});
