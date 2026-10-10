/* V1321: render real v64SuspensionView from src/main.js in mobile Chromium.
   Admin/fixtures are synthetic. Never connects to an official server. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const root=resolve(import.meta.dirname,'..'),out=resolve(root,'artifacts/v1321-suspension');
mkdirSync(out,{recursive:true});
const source=readFileSync(resolve(root,'src/main.js'),'utf8');
const first=source.indexOf('function v64SuspensionCategories(){');
const last=source.indexOf('function v64RenderAgenda(){',first);
assert.ok(first>0&&last>first,'No se encontraron las funciones reales del formulario');
const renderer=source.slice(first,last);
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try {
 for(const width of [360,390,412]){
  const page=await browser.newPage({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('http://127.0.0.1:9321/**',route=>route.fulfill({status:200,contentType:'text/html',body:
   '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body data-app-route="suspensionTool" style="margin:0;background:#060c46;color:white"><main id="screen" style="padding:12px;box-sizing:border-box"></main></body></html>'}));
  await page.goto('http://127.0.0.1:9321/#/suspensionTool');
  await page.evaluate(()=>{
   window.LJR_OFFICIAL_DATA={categories:{
    '1':{name:'Veteranos 50+',fixtures:[{rows:[['','1','América','','','','Juventus','Campo Municipal','10:00'],['','1','Manchester','','','','Boavista','UDS Campo 1','12:00']]}]},
    '2':{name:'Veteranos 35+',fixtures:[{rows:[['','1','Equipo A','','','','Equipo B','Campo 2','08:00']]}]}
   }};
   window.__fieldChanges=[];
   document.addEventListener('change',e=>{
    if(e.target.matches('[data-v64-susp-cat],[data-v64-susp-reason]'))window.__fieldChanges.push({name:e.target.getAttributeNames().find(x=>x.startsWith('data-v64-susp-')),value:e.target.value});
   });
  });
  const helpers="function v64Esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]))}function v60Header(){return '<header><b>Aviso de suspensión</b></header>';}\n";
  await page.addScriptTag({content:helpers+renderer});
  await page.evaluate(()=>{document.querySelector('#screen').innerHTML=v64SuspensionView()});
  for(const css of ['src/v60-league-tools.css','src/v1059-suspension-selectors-polish.css',
   'src/v1232-suspension-official-blue.css','src/v1321-suspension-android-fields.css']){
   await page.addStyleTag({path:resolve(root,css)});
  }
  await page.addScriptTag({path:resolve(root,'src/v1059-suspension-selectors-polish.js')});
  const category=page.locator('[data-v64-susp-cat]'),reason=page.locator('[data-v64-susp-reason]');
  await category.waitFor();await reason.waitFor();
  const layout=await page.evaluate(()=>{
   const data=k=>{const select=document.querySelector('[data-v64-susp-'+k+']'),label=select.closest('label');
    const title=label.querySelector('b'),r=select.getBoundingClientRect(),t=title.getBoundingClientRect();
    const css=getComputedStyle(select);
    return {label:label.getBoundingClientRect().height, gap:r.top-t.bottom, width:r.width,height:r.height,visible:css.display!=='none'&&css.visibility!=='hidden'&&Number(css.opacity)>0,
      text:select.value,options:select.options.length,decoration:!!label.querySelector('.v1059-chevron')};};
   return {category:data('cat'),reason:data('reason'),documentWidth:document.documentElement.scrollWidth,viewport:innerWidth};
  });
  assert.ok(layout.category.visible&&layout.category.width>160,'Categoría no visible '+JSON.stringify(layout));
  assert.ok(layout.reason.visible&&layout.reason.width>160&&layout.reason.height>=44,'Motivo oculto '+JSON.stringify(layout));
  assert.ok(layout.category.gap>=0&&layout.category.gap<=20,'Hueco de categoría '+JSON.stringify(layout));
  assert.ok(layout.reason.gap>=0&&layout.reason.gap<=20,'Hueco de motivo '+JSON.stringify(layout));
  assert.ok(layout.documentWidth<=layout.viewport+1,'Desbordamiento móvil '+JSON.stringify(layout));
  assert.ok(layout.reason.options>=6,'Se perdieron las opciones originales');
  await reason.selectOption({label:'Seguridad'});
  assert.equal(await reason.inputValue(),'Seguridad');
  await category.selectOption({label:'Veteranos 35+'});
  assert.equal(await category.inputValue(),'Veteranos 35+');
  const events=await page.evaluate(()=>window.__fieldChanges);
  assert.equal(events.length,2,'No llegaron cambios nativos '+JSON.stringify(events));
  await page.locator('.v425-panel').first().screenshot({path:resolve(out,'categoria-'+width+'.png'),animations:'disabled'});
  await page.locator('.v425-panel').nth(1).screenshot({path:resolve(out,'motivo-'+width+'.png'),animations:'disabled'});
  assert.deepEqual(errors,[],'JS errors: '+JSON.stringify(errors));
  console.log('V1321 OK '+width+'px, selector Categoría y Motivo, cambios, sin espacios ni recorte');
  await page.close();
 }
}finally{await browser.close()}
