import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../src/v1222-admin-offices-compact.js',import.meta.url),'utf8');
function harness(extra={}){
 const saved={
  'v105-delegates':JSON.stringify([{name:'Delegado Ejemplo',category:'Primera',team:'CLUB A'}]),
  'v105-officials':JSON.stringify([{name:'Árbitro Ejemplo',category:'Todas',role:'Árbitro central'}])
 };
 const calls=[];
 const context={
  document:{readyState:'loading',addEventListener(){}},
  window:{
   LJR_MEDIA:{admin:{owner:true}},
   LJR_V105_OPEN_TOOL(name){calls.push(name);return true},
   LJR_OFFICIAL_DATA:{categories:{
    '3':{name:'Primera Fuerza',teams:['CLUB A'],rosters:{'CLUB B':[]},fixtures:[{rows:[['1','1','CLUB C','','','','CLUB D']]}],standings:[]},
    '2':{name:'Veteranos 35+',teams:[],rosters:{},fixtures:[],standings:[]}
   }},...extra
  },
  localStorage:{getItem(key){return saved[key]??null}},
  Option:class Option{constructor(text,value){this.text=text;this.value=value}},
  console
 };
 // Exponer funciones puras únicamente dentro de la prueba; no altera producción.
 const suffix='})();';
 assert.ok(script.trimEnd().endsWith(suffix));
 const at=script.lastIndexOf(suffix);
 const transformed=script.slice(0,at)+
  'window.__v1222_test={compatibleCategory,officialCatalog,localList,openDirectory};\n'+script.slice(at);
 vm.runInNewContext(transformed,context,{timeout:1000});
 return {api:context.window.__v1222_test,calls,saved,context};
}
test('V1222 carga categorías oficiales, equipos, plantillas y rol de partidos',async()=>{
 const {api}=harness();
 const entries=await api.officialCatalog();
 const teams=Array.from(entries.get('3'));
 assert.deepEqual(teams,['CLUB A','CLUB B','CLUB C','CLUB D']);
});
test('V1222 reconoce Primera, veteranos y árbitros para Todas las categorías',()=>{
 const {api}=harness();
 assert.equal(api.compatibleCategory('Primera','3'),true);
 assert.equal(api.compatibleCategory('Primera Fuerza','3'),true);
 assert.equal(api.compatibleCategory('Veteranos 35+','2'),true);
 assert.equal(api.compatibleCategory('Veteranos 50+','2'),false);
 assert.equal(api.compatibleCategory('Todas','3'),true);
 assert.equal(api.compatibleCategory('Todas las categorías','2'),true);
});
test('V1222 reutiliza las listas privadas y el botón original sin autorizar usuarios',()=>{
 const {api,calls}=harness();
 assert.equal(api.localList('delegates')[0].name,'Delegado Ejemplo');
 assert.equal(api.localList('officials')[0].name,'Árbitro Ejemplo');
 const feedback={textContent:''};
 let closed=false;
 const dialog={querySelector(){return {click(){closed=true}}}};
 api.openDirectory('officials',dialog,feedback);
 assert.equal(closed,true);
 assert.deepEqual(calls,['officials']);
});
test('V1222 controles de árbitro: categoría sí, equipo no',()=>{
 assert.match(script,/kind\.value==='officials'\|\|!team\.value/);
 assert.match(script,/teamLabel\.hidden=referee/);
 assert.match(script,/team\.disabled=referee/);
 assert.match(script,/person\.value=''/);
});

test('V1222 conserva Administración abierta si el directorio falla o no hay permiso',()=>{
 const cases=[
  {overrides:{LJR_V105_OPEN_TOOL:()=>false},expected:'No fue posible'},
  {overrides:{LJR_V105_OPEN_TOOL:()=>{throw Error('fallo')}},expected:'Error al abrir'},
  {overrides:{LJR_MEDIA:{admin:null}},expected:'Inicia sesión'},
  {overrides:{LJR_V105_OPEN_TOOL:undefined},expected:'aún no terminó'}
 ];
 for(const x of cases){
  const {api}=harness(x.overrides);let closed=false;
  const dialog={querySelector(){return {click(){closed=true}}}},feedback={textContent:''};
  assert.equal(api.openDirectory('delegates',dialog,feedback),false);
  assert.equal(closed,false);
  assert.match(feedback.textContent,new RegExp(x.expected,'i'));
 }
});
test('V1222 no abre rutas ajenas a los dos directorios autorizados',()=>{
 const {api,calls}=harness();let closed=false;
 const dialog={querySelector(){return {click(){closed=true}}}},feedback={textContent:''};
 assert.equal(api.openDirectory('backup-export',dialog,feedback),false);
 assert.equal(closed,false);
 assert.deepEqual(calls,[]);
 assert.match(feedback.textContent,/no reconocido/i);
});
