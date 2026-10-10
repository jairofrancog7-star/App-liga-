/* Simulación Chromium móvil con pantalla táctil y servidor CMS falso.
   Nunca inicia sesión real ni envía publicaciones oficiales. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const root=resolve(import.meta.dirname,'..'),out=resolve(root,'artifacts/editor-visual-v1236');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [360,412]){
  const page=await browser.newPage({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const failures=[];page.on('pageerror',e=>failures.push(e.message));
  const pageHtml='< !doctype html>'.replace(' ','')+'<html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>'+
   '<body style="background:#061a47;color:#fff;margin:0"><main id="screen" style="padding:16px;min-height:600px">'+
   '<section><p id="title">Jornada oficial</p><button id="fixture">Ver jornada</button><img alt="Escudo oficial" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22/%3E"></section></main></body></html>';
  await page.route('http://localhost:9175/**',route=>route.fulfill({status:200,contentType:'text/html',body:pageHtml}));
  await page.goto('http://localhost:9175/');
  await page.evaluate(()=>{
   const records=[];
   window.__cms={records,puts:[],publications:0};
   window.LJR_MEDIA={
    admin:{owner:true},
    async api(path,opts){
     if(path==='me')return {admin:{owner:true}};
     if(path==='content?admin=1')return {items:records};
     if(path.startsWith('content/')&&opts?.method==='PUT'){
      const id=decodeURIComponent(path.slice(8));
      const record={id,...opts.body,revision:1};
      records.push(record);window.__cms.puts.push(record);
      if(record.published)window.__cms.publications++;
      return {revision:1};
     }
     throw Error('Ruta no permitida en prueba: '+path);
    },
    modal(title,html){
     const outer=document.createElement('div');outer.className='liga-media-modal';
     outer.style.cssText='position:fixed;inset:0;z-index:2147483500;background:#030a2fdc;display:flex;align-items:center;padding:10px';
     outer.innerHTML='<section style="width:100%;max-height:90dvh;overflow:auto;background:#0a2050;border:1px solid #4477cb;border-radius:17px;padding:12px">'+
      '<button data-close aria-label="Cerrar">✕</button><h2>'+title+'</h2>'+html+'</section>';
     document.body.append(outer);
     outer.querySelector('[data-close]').onclick=()=>{outer.dispatchEvent(new Event('media-close'));outer.remove()};
     return outer;
    },
    login(){throw Error('No debería solicitar login con sesión autorizada')}
   };
  });
  for(const path of ['src/v1225-editor-visual-studio.css'])
   await page.addStyleTag({path:resolve(root,path)});
  for(const path of ['src/v1236-editor-cms-bridge.js','src/v1225-editor-visual-studio.js'])
   await page.addScriptTag({path:resolve(root,path)});
  await page.evaluate(()=>window.LJR_EDITOR_STUDIO.open(['Inicio','home']));
  await page.locator('.ljr-studio').waitFor();
  await page.tap('#title');
  await page.locator('[data-studio-text]').fill('Jornada revisada');
  await page.locator('[data-studio-apply]').tap();
  assert.equal(await page.locator('#title').innerText(),'Jornada revisada','El toque no seleccionó el título');
  await page.locator('[data-studio-undo]').tap();
  assert.equal(await page.locator('#title').innerText(),'Jornada oficial','No deshace');
  await page.locator('[data-studio-redo]').tap();
  assert.equal(await page.locator('#title').innerText(),'Jornada revisada','No rehace');
  await page.locator('[data-studio-save]').tap();
  await page.locator('[data-studio-reset]').tap();
  assert.equal(await page.locator('#title').innerText(),'Jornada oficial','No restablece');
  await page.locator('[data-studio-restore]').tap();
  assert.equal(await page.locator('#title').innerText(),'Jornada revisada','No recupera borrador: '+await page.locator('[data-studio-note]').innerText());
  await page.locator('[data-studio-cms]').tap();
  await page.locator('[data-studio-server-draft]').waitFor();
  const debugging=await page.evaluate(()=>({route:document.querySelector('[data-studio-server-draft] [name=route]')?.value,values:[...document.querySelectorAll('[data-studio-server-draft] [name]')].map(x=>({name:x.name,value:x.value})),status:document.querySelector('[data-studio-note]')?.textContent}));
  assert.equal(await page.locator('[data-studio-server-draft] [name=route]').inputValue(),'home','Formulario: '+JSON.stringify(debugging));
  assert.match(await page.locator('[name=selector]').inputValue(),/^#screen > section:nth-of-type\(1\) > p:nth-of-type\(1\)$/);
  assert.equal(await page.locator('[name=text]').inputValue(),'Jornada revisada');
  assert.equal(await page.evaluate(()=>window.__cms.puts.length),0,'El formulario no debe guardar solo');
  await page.locator('[data-studio-server-draft] button[type=submit]').tap();
  await page.locator('[data-studio-server-status]').filter({hasText:'Borrador visual guardado'}).waitFor();
  const outcome=await page.evaluate(()=>window.__cms);
  assert.equal(outcome.puts.length,1);
  assert.equal(outcome.puts[0].kind,'page');
  assert.equal(outcome.puts[0].published,false);
  assert.equal(outcome.publications,0);
  const dims=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,w:innerWidth,panel:(()=>{const r=document.querySelector('.ljr-studio').getBoundingClientRect();return {left:r.left,right:r.right}})()}));
  assert.ok(dims.doc<=dims.w+1&&dims.panel.left>=0&&dims.panel.right<=dims.w+1,'Desbordamiento móvil '+JSON.stringify(dims));
  await page.screenshot({path:resolve(out,'studio-'+width+'.png'),animations:'disabled'});
  await page.locator('.liga-media-modal [data-close]').tap();
  await page.locator('[data-studio-close]').tap();
  assert.equal(await page.locator('#title').innerText(),'Jornada oficial','Al cerrar debe revertir la vista previa');
  assert.deepEqual(failures,[],JSON.stringify(failures));
  await page.close();
  console.log('Android simulado '+width+'px: selección táctil, historial, borrador privado API, sin publicación y sin desbordamiento.');
 }
}finally{await browser.close()}
console.log('OK: 2 tamaños Android simulados; la prueba física en dispositivo sigue pendiente.');
