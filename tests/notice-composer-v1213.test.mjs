import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const js=read('src/v1075-admin-editor-center.js');
const css=read('src/v1075-admin-editor-center.css');
const index=read('index.html');
const official=JSON.parse(read('data/official-live.json'));
function extract(begin,end){
 const start=js.indexOf(begin),stop=js.indexOf(end,start+begin.length);
 assert.ok(start>=0&&stop>start,'Función no localizada: '+begin);
 return js.slice(start,stop);
}
test('aviso oficial: sintaxis, carga y 4 selectores nativos',()=>{
 assert.doesNotThrow(()=>new Function(js));
 for(const name of ['type','category','round','field','team']){
  assert.match(js,new RegExp('<select name="'+name+'"'));
 }
 assert.match(index,/src\/v1075-admin-editor-center\.js\?v=/);
 assert.match(index,/src\/v1075-admin-editor-center\.css\?v=/);
 assert.match(js,/categoryTeams\.get\(cat\)/);
 assert.match(js,/categoryRounds\.get\(cat\)/);
 assert.match(js,/LJR_FIELDS\?\.catalog/);
 assert.match(js,/fetch\('\.\/data\/official-live\.json',\{cache:'default'\}\)/);
});
test('el rol oficial tiene jornadas y equipos en las cinco categorías',()=>{
 for(const id of ['1','2','3','4','5']){
  const cat=official.categories[id];
  assert.ok(cat,'Categoría '+id);
  const rows=(cat.fixtures||[]).flatMap(table=>table.rows||[]);
  assert.ok(rows.length>0,'No hay rol en '+id);
  assert.ok(rows.some(row=>/^\d+$/.test(String(row[1]))),'No hay jornadas en '+id);
  assert.ok(rows.some(row=>String(row[2]||'').trim()&&String(row[6]||'').trim()),'No hay equipos en '+id);
 }
});
test('fecha del rol: evita tomar 00:00 como horario confirmado',()=>{
 const decode=new Function(extract(' function decodeDate(text){',' async function loadCatalogs(){')+';return decodeDate')();
 assert.deepEqual(decode('11/10/2026 08:00'),{date:'2026-10-11',time:'08:00'});
 assert.deepEqual(decode('17/10/2026 00:00'),{date:'2026-10-17',time:''});
 assert.deepEqual(decode('Fecha por confirmar 04:30'),{date:'',time:''});
});
test('autocompletado local: partido único y sin sobrescribir valores existentes',()=>{
 const decode=new Function(extract(' function decodeDate(text){',' async function loadCatalogs(){')+';return decodeDate')();
 const normalizeName=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const categoryGames=new Map(Object.entries(official.categories).map(([id,cat])=>[id,(cat.fixtures||[])
  .flatMap(tab=>tab.rows||[]).filter(r=>/^\d+$/.test(String(r[1])))
  .map(r=>({round:String(r[1]),home:String(r[2]),away:String(r[6]),field:String(r[7]),...decode(r[8])}))]));
 const form={elements:{category:{value:'3'},round:{value:'7'},team:{value:'HERMANOS'},
  field:{value:''},date:{value:''},time:{value:''}}};
 const matcher=new Function('form','categoryGames','normalizeName',
  extract(' function matchingGames(){',' function matchHint(){')+';return matchingGames')(form,categoryGames,normalizeName);
 assert.equal(matcher().length,1);
 assert.equal(matcher()[0].away,'LOBOS CDG');
 const fieldInput={options:[{value:'Campo 3'}],add(x){this.options.push(x)}};
 const messages=[];
 const fill=new Function('matchingGames','form','fieldInput','updatePreview','checkNotice','matchHint','status','modal',
  extract(' function autofillMatch(){',' function qualityNotes(){')+';return autofillMatch')
  (matcher,form,fieldInput,()=>{},()=>{},()=>{},(_,msg)=>messages.push(msg),{});
 fill();
 assert.deepEqual([form.elements.field.value,form.elements.date.value,form.elements.time.value],
  ['Campo 3','2026-10-11','10:00']);
 form.elements.field.value='Campo elegido manualmente';
 fill();
 assert.equal(form.elements.field.value,'Campo elegido manualmente');
 form.elements.team.value='EQUIPO INEXISTENTE';
 fill();
 assert.match(messages.at(-1),/Elige una categoría/);
});
test('diseño azul oficial, tamaño móvil y publicación protegida',()=>{
 for(const color of ['#0055a5','#0d47a1','#0a235c'])assert.ok(css.toLowerCase().includes(color));
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/ljr-editor-autofill/);
 assert.match(js,/await verified\(\)/);
 assert.match(js,/confirm\('¿Confirmas que verificaste/);
});
