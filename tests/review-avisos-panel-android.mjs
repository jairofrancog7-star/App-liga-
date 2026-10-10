/* Prueba visual táctil del panel Revisar avisos. SOLO datos y sesión SIMULADOS.
 * Ninguna petición al servidor ni publicación real. Los PNG se adjuntan al workflow.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'artifacts','revisar-avisos-android');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const viewports=[{width:360,height:740},{width:390,height:844},{width:412,height:915}];
const report=[];
try{
 for(const viewport of viewports){
  const context=await browser.newContext({
   viewport,isMobile:true,hasTouch:true,deviceScaleFactor:2,
   userAgent:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36'
  });
  const page=await context.newPage();
  const errors=[],requests=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('request',r=>requests.push(r.url()));
  page.on('dialog',d=>d.accept());
  // Se abortan TODAS las conexiones: es imposible publicar en un servidor real.
  await page.route('**/*',r=>r.abort());
  await page.setContent('<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}html,body{margin:0;background:#071446;color:white;font-family:system-ui;overflow-x:hidden}.liga-media-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#03091cbb;padding:8px}.liga-media-modal>section{max-width:100%;overflow:auto;max-height:96dvh}.liga-media-modal header{display:flex;align-items:center;justify-content:space-between;gap:8px}.liga-media-modal header h2{margin:0;font-size:21px}.liga-media-modal header button{min-height:40px}</style></head><body></body></html>');
  await page.addStyleTag({path:path.join(root,'src','v1075-admin-editor-center.css')});
  await page.evaluate(()=>{
   const initial=[
    {id:'publicado-1',kind:'news',published:true,revision:1,updated:'2026-10-10T18:00:00',payload:{title:'Cambio de cancha',body:'El encuentro se realizará en el Campo Municipal de Juventino Rosas. Verificar la información con la Liga.',category:'3',type:'cancha',field:'Campo Municipal',date:'2026-10-11'}},
    {id:'borrador-2',kind:'news',published:false,revision:2,updated:'2026-10-10T19:00:00',payload:{title:'Cambio de horario',body:'La junta de delegados analizará el ajuste de horario del partido antes de comunicarlo oficialmente.',category:'2',type:'horario',time:'10:00',date:'2026-10-12'}},
    {id:'borrador-3',kind:'news',published:false,revision:1,updated:'2026-10-10T20:00:00',payload:{title:'Recordatorio de junta',body:'Borrador de ejemplo.',category:'3',type:'junta',date:'2026-10-13'}},
    {id:'partido-4',kind:'fixture',published:true,payload:{title:'Registro que no es aviso'}}
   ];
   window.__data=structuredClone(initial);
   window.__writes=[];window.__edited=null;window.__loginCalls=0;window.__failRead=false;
   window.LJR_MEDIA={
    admin:{id:'admin-prueba',owner:true},
    login(){window.__loginCalls++},
    async api(endpoint,options){
     if(endpoint==='me')return {admin:{id:'admin-prueba',owner:true}};
     if(endpoint==='content?admin=1'){
      if(window.__failRead)throw Error('Conexión simulada interrumpida');
      return {items:structuredClone(window.__data)};
     }
     if(endpoint.startsWith('content/')){
      const id=decodeURIComponent(endpoint.slice('content/'.length));
      window.__writes.push({id,method:options?.method});
      const idx=window.__data.findIndex(x=>x.id===id);
      if(idx<0)throw Error('No existe');
      if(options?.method==='PUT'){
       window.__data[idx]={...window.__data[idx],published:!!options.body.published,revision:window.__data[idx].revision+1};
       return {revision:window.__data[idx].revision};
      }
      if(options?.method==='DELETE'){window.__data.splice(idx,1);return {ok:true}}
     }
     throw Error('Ruta inesperada '+endpoint);
    },
    modal(title,html){
     const overlay=document.createElement('div');overlay.className='liga-media-modal';
     const section=document.createElement('section');section.className='ljr-admin-manage';
     const header=document.createElement('header'),heading=document.createElement('h2'),close=document.createElement('button');
     heading.textContent=title;close.type='button';close.dataset.close='';close.textContent='×';close.onclick=()=>overlay.remove();
     header.append(heading,close);section.append(header);
     const holder=document.createElement('div');holder.innerHTML=html;
     while(holder.firstChild)section.append(holder.firstChild);
     overlay.append(section);document.body.append(overlay);
     return overlay;
    }
   };
   window.LJR_CMS={
    editor:(kind,record)=>window.__edited={kind,id:record.id},
    refresh:async()=>{window.__refreshCount=(window.__refreshCount||0)+1}
   };
  });
  await page.addScriptTag({path:path.join(root,'src','v1075-admin-editor-center.js')});
  await page.evaluate(()=>window.LJR_EDITOR_CENTER.openReview());
  const modal=page.locator('.ljr-editor-review-dialog');
  await modal.waitFor({state:'visible'});
  await page.getByText('3 de 3 avisos').waitFor({state:'visible'});
  const layout=await modal.evaluate(section=>{
   const rect=section.getBoundingClientRect();
   const nodes=[...section.querySelectorAll('input,select,button')].filter(el=>getComputedStyle(el).display!=='none');
   const broken=nodes.filter(el=>{
    const r=el.getBoundingClientRect();
    return r.right>rect.right+4||r.left<rect.left-4;
   }).map(el=>el.outerHTML.slice(0,80));
   return {viewport:innerWidth,boxLeft:rect.left,boxRight:rect.right,
    overflow:section.scrollWidth-section.clientWidth,docOverflow:document.documentElement.scrollWidth-innerWidth,
    broken:broken.slice(0,8)};
  });
  assert.ok(layout.docOverflow<=2 && layout.overflow<=5 && layout.boxLeft>=-2 &&
    layout.boxRight<=viewport.width+2 && !layout.broken.length,'Desbordamiento Android '+JSON.stringify(layout));
  await modal.screenshot({path:path.join(output,'revisar-'+viewport.width+'-inicial.png'),animations:'disabled'});
  // Comprobar el teléfono sin modificar los datos ni realizar peticiones externas.
  await page.locator('[data-review-device]').click();
  await page.locator('[data-review-device-results]').getByText('Diagnóstico local completado').waitFor({state:'visible'});
  assert.equal(await page.locator('[data-review-device-results] li[data-passed="true"]').count(),5);
  assert.deepEqual(await page.evaluate(()=>window.__writes),[]);
  // Filtro real: búsqueda, categoría, tipo y estado; después restaurar.
  await page.locator('[data-review-category]').selectOption('2');
  assert.equal(await page.locator('.ljr-review-card').count(),1);
  await page.locator('[data-review-type]').selectOption('horario');
  assert.equal(await page.locator('.ljr-review-card').count(),1);
  await page.locator('[data-review-query]').fill('Cambio de horario');
  await page.waitForTimeout(180);
  assert.equal(await page.locator('.ljr-review-card').count(),1);
  await page.locator('[data-state="published"]').click();
  assert.equal(await page.locator('.ljr-review-card').count(),0);
  await page.locator('[data-review-clear]').click();
  assert.equal(await page.locator('.ljr-review-card').count(),3);
  // Revisión local y vista previa.
  await page.locator('[data-review-audit]').click();
  assert.match(await page.locator('[data-review-insights]').innerText(),/Revisión local/);
  const draft=page.locator('.ljr-review-card').filter({hasText:'Cambio de horario'});
  await draft.getByRole('button',{name:'Ver'}).click();
  assert.equal(await draft.locator('.ljr-review-body').isVisible(),true);
  await draft.getByRole('button',{name:'Editar'}).click();
  assert.deepEqual(await page.evaluate(()=>window.__edited),{kind:'news',id:'borrador-2'});
  // Publicar y retirar SOLO dentro del estado de prueba de memoria.
  await draft.getByRole('button',{name:'Publicar'}).click();
  await page.waitForFunction(()=>window.__data.some(r=>r.id==='borrador-2'&&r.published));
  assert.match(await page.locator('[data-status]').innerText(),/Aviso publicado en el servidor/);
  const newCard=page.locator('.ljr-review-card').filter({hasText:'Cambio de horario'});
  await newCard.getByRole('button',{name:'Retirar'}).click();
  await page.waitForFunction(()=>!window.__data.some(r=>r.id==='borrador-2'));
  assert.match(await page.locator('[data-status]').innerText(),/retirado del servidor/);
  assert.equal(await page.locator('.ljr-review-card').count(),2);
  assert.deepEqual(await page.evaluate(()=>window.__writes.map(x=>x.method)),['PUT','DELETE']);
  // Fallo de red: se conserva la lista, y se informa al administrador.
  await page.evaluate(()=>{window.__failRead=true});
  await page.locator('[data-reload]').click();
  assert.equal(await page.locator('.ljr-review-card').count(),2);
  assert.match(await page.locator('[data-status]').innerText(),/Conexión simulada interrumpida/);
  await modal.evaluate(el=>{el.scrollTop=el.scrollHeight});
  await modal.screenshot({path:path.join(output,'revisar-'+viewport.width+'-final.png'),animations:'disabled'});
  // Revocación de acceso: no se abre otra ventana de administrador.
  await page.evaluate(()=>{document.querySelector('.liga-media-modal')?.remove();window.LJR_MEDIA.admin=null;window.LJR_EDITOR_CENTER.openReview()});
  assert.equal(await page.evaluate(()=>window.__loginCalls),1);
  assert.equal(await page.locator('.ljr-review-smart').count(),0);
  assert.deepEqual(errors,[],'Errores JS: '+JSON.stringify(errors));
  assert.deepEqual(requests,[],'Se intentó una petición fuera de la simulación: '+JSON.stringify(requests));
  report.push({viewport,layout,checks:'filtros, editar, publicar, retirar, error, privacidad, sin red: OK'});
  await context.close();
 }
 await fs.writeFile(path.join(output,'resultado.json'),JSON.stringify({kind:'Simulación móvil sin autenticación real',report},null,2));
 console.log('OK: tres vistas móviles, filtros, acciones y control administrativo simulados; sin conexiones externas.');
}finally{await browser.close()}
