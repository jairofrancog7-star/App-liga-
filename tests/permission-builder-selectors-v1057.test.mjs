import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../src/v635-permission-builder.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../src/v635-permission-builder.css',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function section(first,last){
  const a=script.indexOf(first),b=script.indexOf(last,a);
  assert.ok(a>=0&&b>a,'Source must contain '+first+' and '+last);
  return script.slice(a,b);
}
const constants=section('const SIGNER_ROLES=','let db=null;');
const functions=section('function roundOptions(){','function toast(msg){');
const payload=section('function payload(){','function defaultReason(type){');

function harness(){
  const elements={
    '[data-v635-authority]':{value:'Florencio Franco Lerma'},
    '[data-v635-role]':{value:'Presidente de la Liga'},
    '[data-v635-signer]':{value:'',hidden:true},
    '[data-v635-field]':{value:'',hidden:false},
    '[data-v635-field-other]':{value:'',hidden:true}
  };
  const ctx={
    q:s=>elements[s]||null,
    window:{LJR_FIELDS:{catalog:[{name:'Campo 1 · Unidad Deportiva Sur'},{name:'Campo de Tavera'}]}},
    norm:v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),
    esc:v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    folio:()=> 'TEST-FOLIO',signatureData:''
  };
  ctx.same=(a,b)=>ctx.norm(a)===ctx.norm(b);
  const api=vm.runInNewContext(constants+functions+payload+
    ';({roundOptions,fieldOptions,authorityOptions,syncAuthority,syncField,payload})',ctx);
  return {api,elements};
}

test('nombres y cargos oficiales corresponden al Reglamento 2026–2027',()=>{
  const {api}=harness();
  const html=api.authorityOptions();
  for(const person of ['Florencio Franco Lerma','Martín Jaramillo Celedón','Javier Gonzalez Lopez','Octavio Alberto García'])
    assert.ok(html.includes(person),person);
  assert.ok(html.includes('Otra autoridad / administrador'));
  assert.ok(script.includes("role:'Vicepresidente'"));
});

test('cambiar autoridad fija el cargo oficial, sin alterar el título para una autoridad personalizada',()=>{
  const {api,elements:e}=harness();
  e['[data-v635-authority]'].value='Octavio Alberto García';
  api.syncAuthority();
  assert.equal(e['[data-v635-role]'].value,'Tesorero');
  e['[data-v635-authority]'].value='__manual__';
  api.syncAuthority();
  assert.equal(e['[data-v635-role]'].value,'Otro cargo');
  assert.equal(e['[data-v635-signer]'].hidden,false);
  e['[data-v635-signer]'].value='Encargado de categoría';
  e['[data-v635-role]'].value='Administrador de la Liga';
  api.syncAuthority(true);
  assert.equal(e['[data-v635-authority]'].value,'__manual__');
  assert.equal(e['[data-v635-signer]'].value,'Encargado de categoría');
  assert.equal(api.payload().signer,'Encargado de categoría');
  assert.equal(api.payload().role,'Administrador de la Liga');
  e['[data-v635-authority]'].value='Florencio Franco Lerma';
  api.syncAuthority();
  e['[data-v635-role]'].value='Secretario';
  api.syncAuthority(true);
  assert.equal(e['[data-v635-authority]'].value,'Javier Gonzalez Lopez');
  assert.equal(e['[data-v635-signer]'].hidden,true);
});

test('jornada y canchas son selectores locales sin duplicados ni peticiones remotas',()=>{
  const {api,elements:e}=harness();
  const rounds=api.roundOptions(),fields=api.fieldOptions();
  assert.ok(rounds.includes('Jornada 1'));
  assert.ok(rounds.includes('Jornada 40'));
  assert.ok(fields.includes('Campo de Tavera'));
  assert.ok(fields.includes('Otra cancha / sede'));
  assert.equal((fields.match(/Campo de Tavera/g)||[]).length,2,'option value and text');
  e['[data-v635-field]'].value='__other__';
  api.syncField();
  assert.equal(e['[data-v635-field-other]'].hidden,false);
  e['[data-v635-field-other]'].value='Cancha de prueba';
  assert.equal(api.payload().field,'Cancha de prueba');
  assert.ok(script.includes('<select data-v635-round>'));
  assert.ok(script.includes('<select data-v635-field>'));
  assert.ok(script.includes('<select data-v635-authority'));
});

test('permisos conservan dimensiones, diseño azul y selección cargada en Pages',()=>{
  assert.match(styles,/V1056 — Permisos/);
  assert.match(index,/v635-permission-builder\.css\?v=20261009-v1056-authority-round-field-style/);
  assert.match(index,/v635-permission-builder\.js\?v=20261009-v1057-role-manual-safe/);
  assert.match(script,/máximo 3 MB/);
  assert.ok(!functions.includes('fetch('));
});
