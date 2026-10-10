import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('https://liga-backup.test/',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body><div class="ljr-bc-overlay"><div class="ljr-bc-note"></div></div></body></html>'}));
 await page.goto('https://liga-backup.test/',{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>{
  window.LJR_MEDIA={admin:{owner:true}};
  window.confirm=()=>true;
  window.showDirectoryPicker=async()=>({
   getFileHandle:async()=>({
    createWritable:async()=>({
     write:async(blob)=>{window.__mediaArchive=await blob.text()},
     close:async()=>{},
     abort:async()=>{}
    })
   })
  });
  async function make(name,store,keyPath,record){
   await new Promise((resolve,reject)=>{
    const req=indexedDB.open(name,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(store,keyPath?{keyPath}:undefined);
    req.onsuccess=()=>{
     const db=req.result,tx=db.transaction(store,'readwrite');
     if(keyPath)tx.objectStore(store).add(record);
     else tx.objectStore(store).add(record,'registro-1');
     tx.oncomplete=()=>{db.close();resolve()};
     tx.onerror=()=>reject(tx.error);
    };
    req.onerror=()=>reject(req.error);
   });
  }
  await make('ljr-player-photos-v1','photos','id',{id:'p1',blob:new File(['foto de jugador'],'jugador.jpg',{type:'image/jpeg'})});
  await make('ljr-incidents-media-v1','photos','id',{id:'i1',blob:new Blob(['foto incidencia original'],{type:'image/jpeg'})});
  await make('ljr-registration-media','players',null,{photo:new File(['rostro'],'jugador2.jpg',{type:'image/jpeg'}),document:new File(['identidad privada'],'doc.png',{type:'image/png'})});
  await make('LJR-Juntas-Archivos','files','id',{id:'j1',name:'minuta.pdf',blob:new File(['pdf ficticio'],'minuta.pdf',{type:'application/pdf'})});
 });
 await page.addScriptTag({path:'src/v1213-indexeddb-backup.js'});
 await page.evaluate(()=>window.LJR_INDEXED_BACKUP.mount(document.querySelector('.ljr-bc-overlay')));
 assert.equal(await page.locator('[data-idb-group]').count(),4);
 assert.equal(await page.locator('[data-idb-group="registration"]').isChecked(),false);
 assert.equal(await page.locator('[data-idb-group="meetings"]').isChecked(),false);
 await page.locator('[data-idb-group="registration"]').check();
 await page.locator('[data-idb-group="meetings"]').check();
 await page.locator('[data-idb-pass]').fill('clave-multimedia-larga-2026');
 await page.locator('[data-idb-repeat]').fill('clave-multimedia-larga-2026');
 await page.locator('[data-idb-folder]').click();
 await page.waitForFunction(()=>!!window.__mediaArchive || document.querySelector('[data-idb-status]')?.classList.contains('error'),{timeout:10000});
 console.log('Estado de respaldo:',await page.locator('[data-idb-status]').innerText(),'errores navegador:',errors);
 assert.equal(await page.locator('[data-idb-status]').evaluate(el=>el.classList.contains('error')),false,'La carpeta no debe mostrar un error');
 assert.ok(await page.evaluate(()=>window.__mediaArchive),'Debe guardar el archivo cifrado en carpeta');
 const archive=await page.evaluate(()=>JSON.parse(window.__mediaArchive));
 assert.equal(archive.format,'LJR_IDB_MEDIA_PRIVATE');
 assert.equal(archive.encrypted,true);
 assert.equal(archive.records,4);
 assert.equal(archive.payload!==undefined,true);
 const saved=await page.evaluate(()=>window.__mediaArchive);
 await page.evaluate(async()=>{
  const db=await new Promise((res,rej)=>{const q=indexedDB.open('ljr-player-photos-v1');q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});
  await new Promise((res,rej)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').delete('p1');tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close();
  const other=await new Promise((res,rej)=>{const q=indexedDB.open('ljr-incidents-media-v1');q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});
  await new Promise((res,rej)=>{const tx=other.transaction('photos','readwrite');tx.objectStore('photos').put({id:'i1',blob:new Blob(['modificada'],{type:'image/jpeg'})});tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});other.close();
 });
 await page.locator('[data-idb-file]').setInputFiles({name:'archivos.json',mimeType:'application/json',buffer:Buffer.from(saved)});
 await page.locator('[data-idb-import-pass]').fill('contraseña-incorrecta');
 await page.locator('[data-idb-check]').click();
 await page.getByText(/Contraseña incorrecta/i).waitFor();
 await page.locator('[data-idb-import-pass]').fill('clave-multimedia-larga-2026');
 await page.locator('[data-idb-check]').click();
 await page.locator('[data-idb-restore]').waitFor({state:'visible'});
 await page.locator('[data-idb-restore]').click();
 await page.getByText(/Restauración terminada/i).waitFor();
 const result=await page.evaluate(async()=>{
  async function get(name,store,key){
   const db=await new Promise((res,rej)=>{const req=indexedDB.open(name);req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)});
   const value=await new Promise((res,rej)=>{const req=db.transaction(store,'readonly').objectStore(store).get(key);req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)});
   db.close();return value;
  }
  const p=await get('ljr-player-photos-v1','photos','p1');
  const i=await get('ljr-incidents-media-v1','photos','i1');
  return {photoName:p?.blob?.name,photoText:await p?.blob?.text(),incidentText:await i.blob.text()};
 });
 assert.equal(result.photoName,'jugador.jpg');
 assert.equal(result.photoText,'foto de jugador');
 assert.equal(result.incidentText,'modificada','No debe sobrescribir la foto actual');
 assert.deepEqual(errors,[]);
 console.log('Chromium: exportación cifrada, carpeta, cuatro almacenes, restauración sin sobrescritura, correcto.');
}finally{await browser.close()}
