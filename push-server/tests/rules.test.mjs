import test from 'node:test';
import assert from 'node:assert/strict';
import {officialItem,matches,normalizePreferences,pushEndpointValid,extractPublicRecords} from '../rules.mjs';
test('nunca se notifica un borrador',()=>{
 assert.equal(officialItem({id:'1',kind:'news',published:false,payload:{title:'Suspendido'}}),null);
 assert.equal(extractPublicRecords({items:[{id:'1',kind:'news',published:false,payload:{title:'Suspendido'}}]}).length,0);
});
test('solamente cambios publicados, categoría y tipo correctos',()=>{
 const r=officialItem({id:'123',kind:'news',published:true,payload:{type:'cancha',title:'Cambio de sede',body:'Confirmado por la Liga',category:'2',field:'Campo 1'}});
 assert.equal(r.route,'news');assert.equal(r.type,'cancha');
 assert.equal(matches({preferences:{category:'2',types:['cancha']}},r),true);
 assert.equal(matches({preferences:{category:'3',types:['cancha']}},r),false);
 assert.equal(matches({preferences:{category:'all',types:['junta']}},r),false);
});
test('ignora programados futuros',()=>{
 assert.equal(officialItem({id:'1',kind:'notification',published:true,payload:{title:'Próximo',publishAt:'2099-01-01T00:00:00Z'}}),null);
});
test('firma estable y solo cambia si varían los campos oficiales',()=>{
 const x={id:'1',kind:'fixture',published:true,payload:{date:'2026-10-11',time:'10:00',venue:'Campo 1',home:'A',away:'B',status:'programado'}};
 const digest=officialItem(x).digest;
 assert.equal(officialItem({...x,payload:{...x.payload,updatedAt:'today'}}).digest,digest);
 assert.notEqual(officialItem({...x,payload:{...x.payload,venue:'Campo 2'}}).digest,digest);
});
test('endpoints HTTPS de servicios push permitidos; localhost bloqueado',()=>{
 assert.equal(pushEndpointValid('https://fcm.googleapis.com/fcm/send/test'),true);
 assert.equal(pushEndpointValid('http://127.0.0.1:1234/private'),false);
 assert.equal(pushEndpointValid('https://example.com/'),false);
});
test('normaliza categorías y suscripciones',()=>{
 assert.deepEqual(normalizePreferences({category:'hola',types:['cancha','foo']}),{category:'all',team:'',field:'',types:['cancha']});
});