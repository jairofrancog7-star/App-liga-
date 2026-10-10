import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {join} from 'node:path';
const base=process.cwd();
const get=p=>readFileSync(join(base,p),'utf8');

test('perfil v1300: sintaxis y compatibilidad con la app',()=>{
 const source=get('src/profile-smart-v1300.js');
 new Function(source);
 const auth=get('src/v569-account-auth.js');
 assert.match(auth,/accountPreferences','accountAdvisor','accountCloud/);
 assert.match(auth,/data-v1300-panel/);
 const html=get('index.html');
 assert.match(html,/profile-smart-v1300.js/);
 assert.match(html,/profile-smart-v1300.css/);
 const css=get('src/profile-smart-v1300.css');
 assert.match(css,/#060c46/i);
 assert.match(css,/#102f7d/i);
});
test('perfil v1300: las recomendaciones y contraseñas funcionan offline',()=>{
 const actions={};
 const fakeAccount={id:'test-user',email:'',devices:[],biometric:null};
 const store=new Map();
 const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 const body={dataset:{}};
 const doc={body,readyState:'loading',addEventListener:(ev,handler)=>{actions[ev]=handler},querySelector:()=>null};
 const ctx={
   window:{LJR_V569_AUTH:{currentAccount:()=>fakeAccount},Notification:{permission:'denied'},addEventListener:()=>{}},
   document:doc,
   localStorage,
   Notification:{permission:'denied'},
   location:{hash:'#/profile'},
   MutationObserver:class {observe(){}},
   URL,console,Promise,setTimeout,queueMicrotask
 };
 runInNewContext(get('src/profile-smart-v1300.js'),ctx);
 const api=ctx.window.LJR_PROFILE_V1300;
 assert.ok(api);
 const warnings=api.signals(fakeAccount);
 assert.ok(warnings.find(w=>w.kind==='contact'));
 assert.ok(warnings.find(w=>w.kind==='biometric'));
 assert.ok(warnings.find(w=>w.kind==='notices'));
 assert.equal(api.scorePassword('123456').score<=1,true);
 assert.ok(api.scorePassword('CorrectHorse-Battery2026!').score>=3);
});
test('nube opt-in: sin activación ni secretos remotos',()=>{
 const config=JSON.parse(get('data/account-cloud-config.json'));
 assert.equal(config.enabled,false);
 assert.equal(config.publishableKey,'');
 const sql=get('docs/sql/profile-preferences-rls.sql');
 assert.match(sql,/enable row level security/i);
 assert.match(sql,/auth\.uid\(\)/);
 const script=get('src/profile-smart-v1300.js');
 assert.doesNotMatch(script,/service_role|supabaseSecretKey/);
 assert.match(script,/persistSession:true/);
 assert.match(script,/data-v1300-cloud-action="restore"/);
});
