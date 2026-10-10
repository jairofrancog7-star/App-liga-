/* V1218 - Prueba visual Android aislada; no autentica ni publica avisos. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const root=resolve(import.meta.dirname,'..');
const official=JSON.parse(readFileSync(resolve(root,'data/official-live.json'),'utf8'));
const target=resolve(root,'artifacts/notice-editor');
mkdirSync(target,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [360,412]){
  const page=await browser.newPage({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent([
   '<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1">',
   '<style>*{box-sizing:border-box}html,body{margin:0;background:#031333;color:#fff;font-family:system-ui;overflow-x:hidden}',
   '.liga-media-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8px}',
   '.liga-media-modal>section{width:100%;overflow:auto;max-height:94dvh}',
   '.liga-media-modal header{display:flex;justify-content:space-between;align-items:center}',
   '.liga-media-modal h2{margin:0}</style></head><body></body></html>'
  ].join(''));
  await page.addStyleTag({path:resolve(root,'src/v1075-admin-editor-center.css')});
  await page.evaluate(db=>{
   window.LJR_OFFICIAL_DATA=db;
   window.LJR_FIELDS={
    catalog:['Campo 1 · Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur'].map(name=>({name})),
    canonical:v=>String(v||'')==='Campo 3'?'Campo 3 · Unidad Deportiva Sur':String(v||'')
   };
   window.LJR_MEDIA={
    admin:{owner:true},
    modal(title,html){
     const root=document.createElement('div');root.className='liga-media-modal';
     const section=document.createElement('section');
     const head=document.createElement('header'),label=document.createElement('h2'),close=document.createElement('button');
     label.textContent=title;close.textContent='×';close.dataset.close='';close.onclick=()=>root.remove();
     head.append(label,close);section.append(head);
     section.insertAdjacentHTML('beforeend',html);root.append(section);document.body.append(root);
     return root;
    }
   };
  },official);
  await page.addScriptTag({path:resolve(root,'src/v1075-admin-editor-center.js')});
  await page.evaluate(()=>window.LJR_EDITOR_CENTER.openNotice());
  const form=page.locator('[data-editor-form]');
  assert.equal(await form.count(),1,'No abre el formulario');
  for(const name of ['type','category','round','field','team'])
   assert.equal(await form.locator('select[name='+name+']').count(),1,'Falta selector '+name);
  await form.locator('select[name=category]').selectOption('3');
  assert.ok(await form.locator('select[name=team] option[value="HERMANOS"]').count(),'No carga equipo de Primera');
  await form.locator('select[name=round]').selectOption('7');
  await form.locator('select[name=team]').selectOption('HERMANOS');
  await page.locator('[data-editor-match-autofill]').click();
  assert.equal(await form.locator('input[name=date]').inputValue(),'2026-10-11');
  assert.equal(await form.locator('input[name=time]').inputValue(),'10:00');
  assert.match(await form.locator('select[name=field]').inputValue(),/Campo 3/);
  const box=await page.evaluate(()=>{
   const section=document.querySelector('.ljr-editor-compose'),r=section.getBoundingClientRect();
   const escapes=[...section.querySelectorAll('select,input,textarea')].filter(x=>{
    const b=x.getBoundingClientRect();return b.left<r.left-2||b.right>r.right+2;
   }).map(x=>x.getAttribute('name'));
   return {docWidth:document.documentElement.scrollWidth,screen:innerWidth,
    left:r.left,right:r.right,escapes,background:getComputedStyle(section).backgroundImage,
    scrollHeight:section.scrollHeight,clientHeight:section.clientHeight};
  });
  assert.ok(box.docWidth<=width+1&&box.left>=-1&&box.right<=width+1,'Desbordamiento horizontal '+JSON.stringify(box));
  assert.deepEqual(box.escapes,[],'Campos fuera del modal '+JSON.stringify(box));
  assert.match(box.background,/13,\s*71,\s*161/,'Color azul oficial ausente');
  assert.deepEqual(errors,[],'Errores del navegador');
  await page.locator('.ljr-editor-compose').screenshot({path:resolve(target,'android-'+width+'.png'),animations:'disabled'});
  await form.locator('[data-editor-publish]').scrollIntoViewIfNeeded();
  const bottom=await page.evaluate(()=>{
   const modal=document.querySelector('.ljr-editor-compose');
   modal.scrollTop=modal.scrollHeight;
   const r=modal.getBoundingClientRect(),b=modal.querySelector('[data-editor-publish]').getBoundingClientRect();
   return b.top>=r.top-4&&b.bottom<=r.bottom+4;
  });
  assert.ok(bottom,'Botón Publicar oculto tras desplazamiento');
  console.log('OK Android '+width+'px: selectores, jornadas, equipos, canchas, autocompletado, azul, límites y botón Publicar.');
  await page.close();
 }
}finally{await browser.close()}
console.log('RESULTADO: 2/2 simulaciones móviles aprobadas; sin autenticación ni publicación.');
