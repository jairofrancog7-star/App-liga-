/* V1214: prueba visual móvil aislada de Respaldo oficial; usa datos ficticios.
   No necesita cuenta privada ni publica/modifica información de la Liga. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const root=resolve(import.meta.dirname,'..');
const target=resolve(root,'artifacts/official-backup');
mkdirSync(target,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [320,360,412]){
  const page=await browser.newPage({viewport:{width,height:820},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1">'+
   '<style>*{box-sizing:border-box}html,body{margin:0;background:#08144f;color:white;font-family:system-ui;overflow-x:hidden}'+
   '.liga-media-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8px;background:#020624d8}'+
   '.liga-media-modal>section{width:100%;overflow:auto;max-height:94dvh;padding:12px}'+
   '.liga-media-modal header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}'+
   '.liga-media-modal h2{margin:0;font-size:20px}</style></head><body></body></html>');
  await page.addStyleTag({path:resolve(root,'src/v1212-official-backup-center.css')});
  await page.evaluate(()=>{
   window.__backupCalls=[];
   window.LJR_MEDIA={
    admin:{owner:true},
    async api(name){
     window.__backupCalls.push(name);
     if(name==='me')return {admin:{owner:true}};
     if(name==='content?admin=1')return {items:[{id:1,title:'Equipo de prueba'},{id:2,title:'Jornada de ejemplo'}]};
     throw Error('Ruta inesperada: '+name);
    },
    modal(title,markup){
     const host=document.createElement('div');host.className='liga-media-modal';
     host.innerHTML='<section><header><h2></h2><button type="button" data-close aria-label="Cerrar">×</button></header>'+markup+'</section>';
     host.querySelector('h2').textContent=title;
     host.querySelector('[data-close]').onclick=()=>host.remove();
     document.body.append(host);
     return host;
    }
   };
  });
  await page.addScriptTag({path:resolve(root,'src/v1212-official-backup-center.js')});
  await page.evaluate(()=>window.LJR_BACKUP_CENTER.open());
  await page.waitForSelector('.ljr-backup-dialog');
  for(const selector of ['[data-backup-analyze]','[data-backup-export]','[data-backup-file]','[data-backup-verify]','[data-backup-period]','[data-backup-save]','[data-backup-auto]']){
   assert.equal(await page.locator(selector).count(),1,'Control faltante: '+selector);
  }
  await page.locator('[data-backup-auto]').check();
  await page.waitForFunction(()=>window.__backupCalls.filter(x=>x==='content?admin=1').length===1);
  await page.locator('[data-backup-auto]').uncheck();
  await page.locator('[data-backup-auto]').check();
  await page.waitForTimeout(220);
  assert.equal(await page.evaluate(()=>window.__backupCalls.filter(x=>x==='content?admin=1').length),1,'El análisis automático se repitió en menos de 24 horas');
  await page.locator('[data-backup-period]').selectOption('15');
  await page.locator('[data-backup-save]').click();
  assert.match(await page.locator('[data-backup-status]').innerText(),/Frecuencia guardada/);
  const metrics=await page.evaluate(()=>{
   const panel=document.querySelector('.ljr-backup-dialog'),r=panel.getBoundingClientRect();
   const escapes=[...panel.querySelectorAll('input,select,button')].filter(e=>{
    const b=e.getBoundingClientRect();
    return b.width&& (b.left<r.left-3 || b.right>r.right+3);
   }).map(x=>x.outerHTML.slice(0,100));
   return {viewport:innerWidth,doc:document.documentElement.scrollWidth,left:r.left,right:r.right,scrollWidth:panel.scrollWidth,clientWidth:panel.clientWidth,escapes,
    background:getComputedStyle(panel).backgroundImage,
    checkboxSize:document.querySelector('[data-backup-auto]').getBoundingClientRect().width};
  });
  assert.ok(metrics.doc<=width+1 && metrics.left>=-1 && metrics.right<=width+1 && metrics.scrollWidth<=metrics.clientWidth+2,
   'Desbordamiento horizontal: '+JSON.stringify(metrics));
  assert.deepEqual(metrics.escapes,[],'Controles fuera del cuadro: '+JSON.stringify(metrics));
  assert.ok(metrics.checkboxSize>=16,'Casilla demasiado pequeña');
  assert.match(metrics.background,/18,\s*44,\s*123/,'No usa el azul del CMS');
  await page.locator('[data-backup-save]').scrollIntoViewIfNeeded();
  await page.locator('.ljr-backup-dialog').screenshot({path:resolve(target,'android-'+width+'.png'),animations:'disabled'});
  assert.deepEqual(errors,[],'Errores JavaScript en el navegador');
  console.log('OK respaldo móvil '+width+'px: azul oficial, controles, scroll y revisión automática sin duplicados.');
  await page.close();
 }
}finally{await browser.close()}
console.log('RESULTADO: 3 simulaciones móviles verificadas; se usaron exclusivamente datos ficticios.');
