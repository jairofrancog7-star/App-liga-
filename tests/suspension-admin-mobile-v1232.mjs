/* Prueba visual de V1232 con sesión administradora SIMULADA.
   No autentica personas reales ni envía/publica mensajes. */
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'..');
const output=resolve(root,'artifacts/v1232-suspension-android');
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const html=`<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aviso de suspensión · prueba</title><style>
html,body{margin:0;max-width:100%;background:#060c46;color:white;font:14px system-ui}
#screen{padding:12px;box-sizing:border-box;min-height:900px}
.v425-suspension{max-width:600px;margin:auto}.v425-panel,.v1074-content{padding:10px;border-radius:12px}
fieldset{border:0;padding:0;margin:0;display:grid;gap:8px}
label{display:grid;gap:4px;min-width:0}
input,select,textarea{max-width:100%;width:100%;box-sizing:border-box;min-height:40px}
button{cursor:pointer}
</style></head><body data-app-route="suspensionTool">
<main id="screen"><section class="v425-suspension"><div class="v425-panel">
<h1>Aviso de suspensión</h1><div class="v1074-content v1074-flow">
<div class="v1074-progress"><strong>Revisión administrativa</strong></div>
<fieldset>
<label>Categoría<input data-v64-susp-cat></label>
<label>Jornada<input data-v64-susp-round></label>
<label>Tipo<input data-v64-susp-type></label>
<label>Alcance<select data-v64-susp-scope><option value="Todas las categorías">General</option><option>Un partido</option></select></label>
<label>Partido<input data-v64-susp-match></label>
<label>Campo<input data-v64-susp-venue></label>
<label>Motivo<input data-v64-susp-reason></label>
<label>Fecha<input data-v64-susp-date type="date"></label>
<label>Hora<input data-v64-susp-time type="time"></label>
<label>Mensaje<textarea data-v64-susp-message></textarea></label>
<label>Prioridad<input data-v64-susp-priority value="Normal"></label>
<label>Canal<input data-v64-susp-channel value="App"></label>
</fieldset>
<button type="button" data-v1062-generate>Redactor original</button>
</div></div></section></main></body></html>`;
try{
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:800},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('http://127.0.0.1:9175/**',r=>r.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto('http://127.0.0.1:9175/#/suspensionTool');
  await page.evaluate(()=>{
    window.LJR_MEDIA={admin:{owner:true}};
    window.__writerClicks=0;
    document.querySelector('[data-v1062-generate]').addEventListener('click',()=>window.__writerClicks++);
    window.__copied='';
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.__copied=t}}});
  });
  await page.addStyleTag({path:resolve(root,'src/v1232-suspension-official-blue.css')});
  await page.addScriptTag({path:resolve(root,'src/v1232-suspension-quality.js')});
  const panel=page.locator('[data-v1232-qa]');
  await panel.waitFor();
  const status=page.locator('[data-v1232-status]');
  assert.match(await status.innerText(),/Necesita correcciones/);
  await page.locator('[data-v1232-auto]').uncheck();
  const day=new Date(Date.now()+3*86400000).toISOString().slice(0,10);
  for(const [key,val] of Object.entries({cat:'Primera',round:'Jornada 7',type:'Suspensión',reason:'Lluvia fuerte',date:day,time:'12:30',
    message:'Comunicado oficial pendiente de aprobación de la directiva. Revisar en la aplicación.'})){
    await page.locator('[data-v64-susp-'+key+']').fill(val);
  }
  await page.locator('[data-v1232-check]').tap();
  assert.match(await status.innerText(),/Datos completos para revisión humana/);
  await page.locator('[data-v1232-write]').tap();
  assert.equal(await page.evaluate(()=>window.__writerClicks),1,'Redacción local debe activar el redactor existente');
  await page.locator('[data-v1232-copy]').tap();
  await page.waitForFunction(()=>window.__copied.includes('Revisión LOCAL'));
  assert.equal(await page.evaluate(()=>window.__copied.includes('La revisión humana')),true);
  assert.match(await status.innerText(),/NO se publicó/);

  await page.evaluate(()=>localStorage.setItem('ljr-v713-auto-notices',JSON.stringify([{
    id:'test-only',published:false,type:'suspension',title:'Suspensión',
    body:'Categoría: Primera · Jornada: Jornada 7 · Comunicado oficial pendiente de aprobación de la directiva. Revisar en la aplicación.'
  }])));
  await page.locator('[data-v1232-check]').tap();
  assert.match(await page.locator('[data-v1232-items]').innerText(),/aviso similar programado/);
  await page.evaluate(()=>localStorage.removeItem('ljr-v713-auto-notices'));
  await page.locator('[data-v1232-auto]').check();
  await page.locator('[data-v64-susp-message]').fill('Comunicado corregido y pendiente de aprobación administrativa. Consultar fecha y campo oficial.');
  await page.waitForFunction(()=>document.querySelector('[data-v1232-status]')?.textContent?.includes('Datos completos para revisión humana'));

  const metrics=await page.evaluate(()=>{
    const p=document.querySelector('[data-v1232-qa]'),buttons=[...p.querySelectorAll('.v1232-actions button')];
    return {vw:innerWidth,doc:document.documentElement.scrollWidth,
      rect:(()=>{const r=p.getBoundingClientRect();return {left:r.left,right:r.right}})(),
      buttons:buttons.map(b=>{const r=b.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height,visible:r.width>0&&r.height>0}}),
      gradient:getComputedStyle(p).backgroundImage};
  });
  assert.ok(metrics.doc<=metrics.vw+1,'Desbordamiento horizontal: '+JSON.stringify(metrics));
  assert.ok(metrics.rect.left>=0&&metrics.rect.right<=metrics.vw+1,'Panel sale de pantalla: '+JSON.stringify(metrics));
  assert.equal(metrics.buttons.length,3);
  for(const b of metrics.buttons)assert.ok(b.visible&&b.left>=0&&b.right<=metrics.vw+1,'Botón recortado: '+JSON.stringify(metrics));
  assert.match(metrics.gradient,/linear-gradient/);
  assert.deepEqual(errors,[],'Errores JavaScript: '+JSON.stringify(errors));
  await panel.scrollIntoViewIfNeeded();
  await page.screenshot({path:resolve(output,'aviso-'+width+'.png'),animations:'disabled'});
  await panel.screenshot({path:resolve(output,'panel-v1232-'+width+'.png'),animations:'disabled'});
  console.log('V1232 / Android simulado '+width+' px: revisión, redacción, copia, duplicados, azul y ajuste horizontal OK.');
  await context.close();
 }
}finally{await browser.close()}
console.log('OK: pantallas simuladas 360/390/412; NO equivale a prueba física ni autorización real del servidor.');
