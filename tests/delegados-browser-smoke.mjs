/* Prueba funcional real del directorio local de delegados.
   Abre el build de GitHub Pages con Chromium a tamaño Android.
   No usa números reales ni envía WhatsApp, llamadas o invitaciones. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const origin=process.env.LJR_SMOKE_ORIGIN||'http://127.0.0.1:4173/App-liga-/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const checks=[],errors=[];
fs.mkdirSync('delegados-test-artifacts',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true,acceptDownloads:true});
 const page=await context.newPage();
 page.on('pageerror',error=>errors.push(String(error)));
 page.on('dialog',dialog=>dialog.accept());
 await page.addInitScript(()=>localStorage.removeItem('v105-delegates'));
 await page.goto(origin+'?refresh=v1126-delegados-test#/more',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>typeof window.LJR_V105_OPEN_TOOL==='function',{timeout:45000});
 const opened=await page.evaluate(()=>window.LJR_V105_OPEN_TOOL('delegates'));
 assert.equal(opened,true,'El acceso de Liga Control debe abrir delegados');
 const modal=page.locator('.v1126-delegate-modal');
 await modal.waitFor({timeout:12000});
 assert.equal(await modal.locator('[data-d-stats]').innerText().then(s=>s.includes('Contactos')),true);
 checks.push('Abrir modal / estados vacíos');
 await modal.locator('[data-d-name]').fill('Delegado Prueba');
 await modal.locator('[data-d-team]').fill('Franco FC');
 await modal.locator('[data-d-phone]').fill('412 123 4567');
 await modal.locator('[data-d-category]').selectOption('Intermedia');
 await modal.locator('[data-d-consent]').check();
 await modal.locator('[data-d-save]').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('v105-delegates')||'[]').length),1);
 assert.match(await modal.locator('[data-d-list]').innerText(),/Delegado Prueba/);
 const link=await modal.locator('[data-d-whatsapp]').getAttribute('href');
 assert.match(link,/^https:\/\/wa\.me\/524121234567\?text=/);
 assert.ok(decodeURIComponent(link).includes('Delegado Prueba'),'El mensaje debe personalizarse');
 checks.push('Crear / persistir / WhatsApp con consentimiento');
 await modal.locator('[data-d-search]').fill('equipo-que-no-existe');
 assert.match(await modal.locator('[data-d-list]').innerText(),/No hay contactos con estos filtros/);
 await modal.locator('[data-d-search]').fill('franco');
 assert.match(await modal.locator('[data-d-list]').innerText(),/Delegado Prueba/);
 await modal.locator('[data-d-category-filter]').selectOption('Primera');
 assert.match(await modal.locator('[data-d-list]').innerText(),/No hay contactos/);
 await modal.locator('[data-d-category-filter]').selectOption('');
 checks.push('Búsqueda y filtros');
 await modal.locator('[data-d-edit]').click();
 await modal.locator('[data-d-name]').fill('Delegado Corregido');
 await modal.locator('[data-d-save]').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('v105-delegates'))[0].name),'Delegado Corregido');
 checks.push('Editar sin duplicar');
 const csvEvent=page.waitForEvent('download');
 await modal.locator('[data-d-csv]').click();
 const csvDownload=await csvEvent;
 assert.ok(csvDownload.suggestedFilename().endsWith('.csv'));
 const csvPath=await csvDownload.path();
 assert.match(fs.readFileSync(csvPath,'utf8'),/Delegado Corregido/);
 checks.push('Exportación CSV');
 const vcfEvent=page.waitForEvent('download');
 await modal.locator('[data-d-vcf]').click();
 const vcfDownload=await vcfEvent;
 assert.ok(vcfDownload.suggestedFilename().endsWith('.vcf'));
 assert.match(fs.readFileSync(await vcfDownload.path(),'utf8'),/BEGIN:VCARD/);
 checks.push('Exportación VCF');
 const jsonEvent=page.waitForEvent('download');
 await modal.locator('[data-d-json]').click();
 const jsonDownload=await jsonEvent;
 const backup=JSON.parse(fs.readFileSync(await jsonDownload.path(),'utf8'));
 assert.equal(backup.contacts.length,1);
 checks.push('Respaldo JSON privado');
 await modal.locator('[data-d-file]').setInputFiles({
  name:'delegados-test-import.csv',mimeType:'text/csv',
  buffer:Buffer.from('\ufeffnombre,equipo,categoria,cargo,telefono,correo,notas,avisos_autorizados\r\n"Suplente de Prueba","Manchester","Primera","Subdelegado","412 222 3333","","","si"\r\n','utf8')
 });
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('v105-delegates')||'[]').length===2);
 checks.push('Importar CSV');
 const countBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('v105-delegates')).length);
 await page.evaluate(()=>{
  const native=Storage.prototype.setItem;
  window.__delegateOriginalSetItem=native;
  Storage.prototype.setItem=function(key,value){
   if(key==='v105-delegates')throw new Error('QuotaExceededError');
   return native.call(this,key,value);
  };
 });
 await modal.locator('[data-d-new]').click();
 await modal.locator('[data-d-name]').fill('Prueba sin espacio');
 await modal.locator('[data-d-team]').fill('Franco FC');
 await modal.locator('[data-d-phone]').fill('412 555 7777');
 await modal.locator('[data-d-save]').click();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('v105-delegates')).length);
 assert.equal(after,countBefore,'Si no se pudo guardar, no debe agregar en memoria');
 assert.match(await page.locator('.v100-toast').last().innerText(),/No se pudo guardar/);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__delegateOriginalSetItem});
 await modal.locator('[data-d-cancel]').click();
 checks.push('Fallo de almacenamiento sin perder contactos');
 await modal.locator('[data-d-delete]').first().click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('v105-delegates')).length),1);
 checks.push('Eliminar con confirmación');
 const overflow=await modal.evaluate(root=>{
  const dialog=root.querySelector('.v105-dialog');
  return {dialog:dialog.scrollWidth-dialog.clientWidth,
   card:Math.max(0,...[...root.querySelectorAll('.v1126-card')].map(x=>x.scrollWidth-x.clientWidth))};
 });
 assert.ok(overflow.dialog<=2&&overflow.card<=2,'Sin desbordamientos horizontales: '+JSON.stringify(overflow));
 await page.screenshot({path:'delegados-test-artifacts/delegados-android.png',fullPage:false});
 checks.push('Interfaz Android sin desbordes');
 console.log('Pruebas aprobadas:',checks.join(' · '));
}finally{console.log('Errores de página (no determinan fallo salvo que bloqueen el directorio):',errors.slice(0,10));await browser.close();}
