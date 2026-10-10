/* Visual smoke en Chromium con dimensiones de Android: sin sesión administrativa ni escrituras oficiales. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const origin=process.env.LJR_SMOKE_ORIGIN||'http://127.0.0.1:4173/App-liga-/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const checks=[],errors=[];
fs.mkdirSync('csv-android-artifacts',{recursive:true});

async function snapshot(page,name){
 const path='csv-android-artifacts/'+name+'.jpg';
 const content=await page.screenshot({path,type:'jpeg',quality:42,animations:'disabled'});
 // Los fragmentos permiten recuperar una captura exacta desde los registros de Actions.
 const b64=content.toString('base64');
 console.log('CSV_SCREENSHOT_BEGIN '+name+' '+b64.length);
 for(let i=0;i<b64.length;i+=3000)console.log('CSV_SCREENSHOT_CHUNK '+name+' '+Math.floor(i/3000)+' '+b64.slice(i,i+3000));
 console.log('CSV_SCREENSHOT_END '+name);
}
try{
 for(const width of [393,360,412]){
  const height=width===393?852:width===360?800:915;
  const context=await browser.newContext({
   viewport:{width,height},screen:{width,height},
   isMobile:true,hasTouch:true,deviceScaleFactor:1,acceptDownloads:true,
   userAgent:'Mozilla/5.0 (Linux; Android 15; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
  });
  const page=await context.newPage();
  page.on('pageerror',err=>errors.push(width+': '+String(err).slice(0,200)));
  page.on('dialog',d=>d.dismiss());
  try{
   await page.goto(origin+'?refresh=csv-android-visual-'+width+'#/more',{waitUntil:'domcontentloaded',timeout:65000});
   await page.waitForFunction(()=>typeof window.LJR_V105_OPEN_TOOL==='function',{timeout:55000});
   assert.equal(await page.evaluate(()=>window.LJR_V105_OPEN_TOOL('csv-import')),true);
   const modal=page.locator('.v105-modal.v1212-csv-modal');
   await modal.waitFor({state:'visible',timeout:15000});
   const dialog=modal.locator('.v105-dialog');
   await page.waitForTimeout(250);
   const metrics=await modal.evaluate(root=>{
    const dialog=root.querySelector('.v105-dialog');
    const box=dialog.getBoundingClientRect();
    const close=root.querySelector('.v105-close').getBoundingClientRect();
    const upload=root.querySelector('.csvpro-drop').getBoundingClientRect();
    const heading=root.querySelector('.v105-dialog > h3').getBoundingClientRect();
    const description=root.querySelector('.v105-dialog > p').getBoundingClientRect();
    const onTop=rect=>{const x=Math.max(1,Math.min(innerWidth-2,(rect.left+rect.right)/2));
      const y=Math.max(1,Math.min(innerHeight-2,(rect.top+rect.bottom)/2));
      const above=document.elementFromPoint(x,y);return !!above&&(root===above||root.contains(above));};
    const buttons=[...root.querySelectorAll('.csvpro-button')].map(b=>({name:b.innerText.trim(),width:b.getBoundingClientRect().width,visible:b.getBoundingClientRect().width>10}));
    const cs=getComputedStyle(dialog);
    const csBtn=getComputedStyle(root.querySelector('.csvpro-primary'));
    return {
     viewport:{width:innerWidth,height:innerHeight},
     box:{left:box.left,right:box.right,top:box.top,bottom:box.bottom,width:box.width,height:box.height},
     innerOverflow:dialog.scrollWidth-dialog.clientWidth,
     scrollable:dialog.scrollHeight>dialog.clientHeight,
     uploadWidth:upload.width,close:{left:close.left,right:close.right,top:close.top,bottom:close.bottom},
     heading:{top:heading.top,bottom:heading.bottom,visible:onTop(heading)},
     description:{top:description.top,bottom:description.bottom,visible:onTop(description)},
     closeClickable:onTop(close),
     background:cs.backgroundImage,buttonBackground:csBtn.backgroundImage,
     buttons
    };
   });
   console.log('CSV_MOBILE_METRICS '+width+' '+JSON.stringify(metrics));
   assert.ok(metrics.box.left>=-1&&metrics.box.right<=width+1,'Dialog width fits viewport '+width);
   assert.ok(metrics.box.top>=-1&&metrics.box.bottom<=height+1,'Dialog height fits viewport '+width);
   assert.ok(metrics.innerOverflow<=3,'No unintended horizontal overflow in modal '+width+': '+metrics.innerOverflow);
   assert.ok(metrics.close.left>=0&&metrics.close.right<=width+1&&metrics.close.top>=0,'Close button visible '+width);
   assert.ok(metrics.heading.top>=85&&metrics.heading.visible,'Título Importar CSV visible sin la barra Más encima '+width);
   assert.ok(metrics.description.visible,'Descripción del CSV visible '+width);
   assert.equal(metrics.closeClickable,true,'Botón de cerrar accesible sin la barra Más encima '+width);
   assert.ok(metrics.uploadWidth>180,'CSV upload control legible '+width);
   assert.ok(metrics.buttons.some(b=>/Analizar/.test(b.name)&&b.visible));
   assert.match(metrics.background,/16,\s*43,\s*123|11,\s*29,\s*101|7,\s*14,\s*68/,'Official night-blue gradient '+width);
   checks.push(width+'px: posición, contraste azul, dimensiones, botones');
   await snapshot(page,'csv-android-'+width+'-initial');
   const input=modal.locator('input[data-csv-file]');
   await input.setInputFiles({name:'equipos-prueba.csv',mimeType:'text/csv',
    buffer:Buffer.from('Nombre del equipo,Categoría,Campo\nManchester,Primera,UDS Campo 1\nBoavista FC,Primera,UDS Campo 2\n','utf8')});
   await modal.locator('.csvpro-summary').waitFor({timeout:30000});
   const stats=await modal.locator('.csvpro-summary').innerText();
   console.log('CSV_MOBILE_STATS '+width+' '+JSON.stringify(stats));
   assert.match(stats,/2/,'Data rows recognized at '+width);
   const report=await modal.locator('.csvpro-aireport').innerText();
   assert.match(report,/Diagnóstico local/);
   // Confirmar scroll real: el usuario llega al pie sin que desaparezca el encabezado.
   const downloadBtn=modal.locator('button[data-csv-valid]');
   await downloadBtn.scrollIntoViewIfNeeded();
   assert.equal(await downloadBtn.isVisible(),true,'Export button reachable by touch scroll');
   assert.equal(await downloadBtn.isEnabled(),true,'Export valid records enabled');
   await snapshot(page,'csv-android-'+width+'-preview');
   const downloadPromise=page.waitForEvent('download',{timeout:15000});
   await downloadBtn.click();
   const dl=await downloadPromise;
   const contents=fs.readFileSync(await dl.path(),'utf8');
   assert.match(contents,/Manchester/);assert.match(contents,/Boavista FC/);
   checks.push(width+'px: lectura automática, tabla, desplazamiento, descarga segura');
   await modal.locator('.v105-close').click();
   assert.equal(await modal.count(),0,'Close button works');
   await context.close();
  }catch(error){
   console.error('CSV_MOBILE_FAILURE '+width+' '+String(error?.stack||error));
   await snapshot(page,'csv-android-'+width+'-error').catch(()=>{});
   throw error;
  }
 }
 console.log('CSV_MOBILE_CHECKS '+JSON.stringify(checks));
 console.log('CSV_OTHER_PAGE_ERRORS '+JSON.stringify(errors.slice(0,15)));
}finally{
 await browser.close();
}
