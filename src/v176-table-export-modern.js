/* V176 — Exportador moderno de tablas por categoría.
   - 5 categorías oficiales
   - escudos reales desde LJR_TEAM_LOGOS / official-live
   - PNG moderno
   - marca 1.º–4.º como CLASIFICADO
   - descarga individual o las 5 categorías
*/
(function(){
'use strict';
if(window.__LJR_V176_TABLE_EXPORT__)return;
window.__LJR_V176_TABLE_EXPORT__=true;

const ORDER=['3','5','4','2','1'];
const LABELS={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
const STORE='v176-table-category';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
let db=null,category=localStorage.getItem(STORE)||'3',busy=false;

function toast(msg){
 let t=$('.v176-toast');if(t)t.remove();
 t=document.createElement('div');t.className='v176-toast';t.textContent=msg;document.body.appendChild(t);
 setTimeout(()=>t.remove(),2200);
}
async function getDb(){
 if(db?.categories)return db;
 if(window.LJR_OFFICIAL_DATA?.categories){db=window.LJR_OFFICIAL_DATA;return db}
 try{
  const r=await fetch('./public/data/official-live.json?v=20260922-table-v176',{cache:'no-store'});
  if(r.ok){db=await r.json();return db}
 }catch(_){}
 return {categories:{}};
}
function cat(id){return db?.categories?.[String(id)]||null}
function rows(id){
 const c=cat(id),raw=(c?.standings?.[0]?.rows||[]);
 return raw.map((r,i)=>({
   pos:Number(r?.[0])||i+1,
   name:String(r?.[1]||'').trim(),
   pj:String(r?.[2]??''),
   g:String(r?.[3]??''),
   e:String(r?.[4]??''),
   p:String(r?.[5]??''),
   gf:String(r?.[6]??''),
   gc:String(r?.[7]??''),
   dg:String(r?.[8]??''),
   pts:String(r?.[9]??''),
   classified:(Number(r?.[0])||i+1)<=4
 })).filter(x=>x.name);
}
function logo(name){
 try{
   const v=window.LJR_TEAM_LOGOS?.get?.(name);
   if(v)return v;
 }catch(_){}
 const logos=db?.team_logos||{},n=norm(name);
 for(const [k,v] of Object.entries(logos)){
   if(norm(k)!==n)continue;
   if(typeof v==='string')return v;
   if(v?.local)return './'+String(v.local).replace(/^\.\//,'');
   if(v?.source)return v.source;
 }
 try{return window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){return ''}
}
function categoryOptions(){
 return ORDER.filter(id=>cat(id)).map(id=>'<option value="'+id+'" '+(id===category?'selected':'')+'>'+esc(cat(id)?.name||LABELS[id])+'</option>').join('');
}
function logoMarkup(name){
 const src=logo(name);
 return src?'<span class="v176-logo"><img src="'+esc(src)+'" alt="'+esc(name)+'"></span>':'<span class="v176-logo fallback">'+esc(name.slice(0,2).toUpperCase())+'</span>';
}
function previewRows(id){
 return rows(id).map(r=>'<div class="v176-row '+(r.classified?'is-qualified':'')+'">'+
   '<span class="v176-pos">'+r.pos+(r.classified?'<i></i>':'')+'</span>'+
   '<span class="v176-team">'+logoMarkup(r.name)+'<b>'+esc(r.name)+'</b>'+(r.classified?'<small>CLASIFICADO</small>':'')+'</span>'+
   '<span>'+esc(r.pj)+'</span><span>'+esc(r.g)+'</span><span>'+esc(r.e)+'</span><span>'+esc(r.p)+'</span>'+
   '<span>'+esc(r.dg)+'</span><strong>'+esc(r.pts)+'</strong>'+
 '</div>').join('');
}
function markup(){
 const c=cat(category),name=c?.name||LABELS[category]||'Categoría';
 return '<section class="v176-table-page" data-v176-page>'+
  '<header class="v176-hero"><div><small>EXPORTAR · TABLA OFICIAL</small><h1>Tabla de posiciones</h1><p>Escudos de los equipos, clasificación marcada y PNG listo para compartir.</p></div><span class="v176-badge">TOP 4<br><b>CLASIFICAN</b></span></header>'+
  '<div class="v176-toolbar">'+
    '<label><span>Categoría</span><select data-v176-category>'+categoryOptions()+'</select></label>'+
    '<button type="button" class="primary" data-v176-download>Descargar PNG</button>'+
    '<button type="button" data-v176-share>Compartir</button>'+
  '</div>'+
  '<div class="v176-all-actions"><button type="button" data-v176-download-all>Descargar las 5 categorías PNG</button><button type="button" data-v176-csv>CSV de esta categoría</button></div>'+
  '<div class="v176-legend"><span><i></i> 1.º–4.º · Clasificados</span><small>La marca visual se aplica a los primeros cuatro lugares.</small></div>'+
  '<section class="v176-card">'+
    '<div class="v176-card-head"><div><small>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</small><h2>'+esc(name)+'</h2></div><div class="v176-round">TABLA<br><b>OFICIAL</b></div></div>'+
    '<div class="v176-columns"><span>#</span><span>EQUIPO</span><span>PJ</span><span>G</span><span>E</span><span>P</span><span>DG</span><span>PTS</span></div>'+
    '<div class="v176-body">'+previewRows(category)+'</div>'+
    '<footer><span><i></i> CLASIFICACIÓN · PUESTOS 1–4</span><small>Actualizada con los datos disponibles de la Liga.</small></footer>'+
  '</section>'+
 '</section>';
}
function download(blob,name){
 const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200);
}
function rounded(ctx,x,y,w,h,r){
 const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
}
function fitText(ctx,text,maxWidth,startSize,minSize=18,weight=700){
 let s=startSize;while(s>minSize){ctx.font=weight+' '+s+'px Arial';if(ctx.measureText(text).width<=maxWidth)return s;s-=1}return minSize;
}
function imageFor(src){
 if(!src)return Promise.resolve(null);
 return new Promise(resolve=>{
   const im=new Image();
   if(/^https?:\/\//i.test(src))im.crossOrigin='anonymous';
   im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;
 });
}
async function canvasFor(id){
 const data=rows(id),label=cat(id)?.name||LABELS[id]||'Categoría';
 if(!data.length)throw new Error('No hay tabla publicada para '+label);
 const W=1400,rowH=86,top=330,bottom=120,H=top+data.length*rowH+bottom;
 const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');

 // Fondo
 const bg=x.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#06136d');bg.addColorStop(.55,'#09198a');bg.addColorStop(1,'#030749');x.fillStyle=bg;x.fillRect(0,0,W,H);
 const glow=x.createRadialGradient(1120,130,20,1120,130,540);glow.addColorStop(0,'rgba(27,212,246,.24)');glow.addColorStop(1,'rgba(27,212,246,0)');x.fillStyle=glow;x.fillRect(0,0,W,600);

 // Encabezado
 x.fillStyle='#27e2ee';x.font='800 27px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',68,70);
 x.fillStyle='#fff';x.font='900 60px Arial';x.fillText('TABLA DE POSICIONES',68,142);
 x.fillStyle='#a9b8df';x.font='700 31px Arial';x.fillText(label.toUpperCase(),68,192);
 x.fillStyle='rgba(39,226,238,.12)';rounded(x,1080,64,250,110,28);x.fill();
 x.strokeStyle='#27e2ee';x.lineWidth=2;rounded(x,1080,64,250,110,28);x.stroke();
 x.textAlign='center';x.fillStyle='#27e2ee';x.font='900 22px Arial';x.fillText('TOP 4',1205,105);x.fillStyle='#fff';x.font='900 25px Arial';x.fillText('CLASIFICAN',1205,140);x.textAlign='left';

 // Cabecera columnas
 x.fillStyle='rgba(255,255,255,.08)';rounded(x,52,235,W-104,62,18);x.fill();
 const cols={pos:78,logo:128,team:200,pj:820,g:900,e:970,p:1040,dg:1115,pts:1235};
 x.fillStyle='#aab7d8';x.font='800 21px Arial';
 x.fillText('#',cols.pos,274);x.fillText('EQUIPO',cols.team,274);x.fillText('PJ',cols.pj,274);x.fillText('G',cols.g,274);x.fillText('E',cols.e,274);x.fillText('P',cols.p,274);x.fillText('DG',cols.dg,274);x.fillText('PTS',cols.pts,274);

 const imgs=await Promise.all(data.map(r=>imageFor(logo(r.name))));
 for(let i=0;i<data.length;i++){
   const r=data[i],y=top+i*rowH,isQ=r.classified;
   x.fillStyle=isQ?(i%2?'rgba(22,55,151,.96)':'rgba(18,63,163,.96)'):(i%2?'rgba(8,15,101,.92)':'rgba(10,19,113,.92)');
   rounded(x,52,y,W-104,rowH-8,16);x.fill();
   if(isQ){x.fillStyle='#26e1ed';rounded(x,52,y,7,rowH-8,3);x.fill()}

   x.fillStyle='#fff';x.font='900 27px Arial';x.fillText(String(r.pos),cols.pos,y+49);

   // logo
   const im=imgs[i];
   if(im){
     try{
       x.save();rounded(x,118,y+13,54,54,27);x.clip();x.fillStyle='#fff';x.fillRect(118,y+13,54,54);
       const ratio=Math.min(50/im.naturalWidth,50/im.naturalHeight),dw=im.naturalWidth*ratio,dh=im.naturalHeight*ratio;
       x.drawImage(im,145-dw/2,y+40-dh/2,dw,dh);x.restore();
     }catch(_){}
   }else{
     x.fillStyle='#123d99';x.beginPath();x.arc(145,y+40,27,0,Math.PI*2);x.fill();x.fillStyle='#52e8f1';x.font='900 16px Arial';x.textAlign='center';x.fillText(r.name.slice(0,2).toUpperCase(),145,y+46);x.textAlign='left';
   }

   const nameSize=fitText(x,r.name.toUpperCase(),560,27,19,800);x.font='800 '+nameSize+'px Arial';x.fillStyle='#fff';x.fillText(r.name.toUpperCase(),cols.team,y+38);
   if(isQ){x.font='900 13px Arial';x.fillStyle='#31e4ee';x.fillText('CLASIFICADO',cols.team,y+61)}

   x.font='800 25px Arial';x.fillStyle='#dce4fb';x.fillText(r.pj,cols.pj,y+49);x.fillText(r.g,cols.g,y+49);x.fillText(r.e,cols.e,y+49);x.fillText(r.p,cols.p,y+49);x.fillText(r.dg,cols.dg,y+49);
   x.fillStyle='#2ae2ee';x.font='900 29px Arial';x.fillText(r.pts,cols.pts,y+49);
 }

 const fy=top+data.length*rowH+35;
 x.fillStyle='#2ae2ee';x.beginPath();x.arc(70,fy,7,0,Math.PI*2);x.fill();
 x.fillStyle='#dce4fb';x.font='800 18px Arial';x.fillText('PUESTOS 1–4 · CLASIFICADOS',88,fy+6);
 x.fillStyle='#7f8fb8';x.font='500 17px Arial';x.fillText('Tabla generada desde los datos oficiales disponibles en la app.',68,fy+48);

 return new Promise(resolve=>c.toBlob(resolve,'image/png',.96));
}
function filename(id){return 'Tabla_'+String(cat(id)?.name||LABELS[id]).replace(/[^a-z0-9+]+/gi,'_')+'_Liga_Juventino.png'}
async function doDownload(id){
 try{busy=true;setBusy(true);const b=await canvasFor(id);download(b,filename(id));toast('PNG generado · '+(cat(id)?.name||LABELS[id]))}
 catch(e){toast(e.message||'No se pudo generar la imagen')}
 finally{busy=false;setBusy(false)}
}
async function doShare(id){
 try{
   busy=true;setBusy(true);const b=await canvasFor(id),file=new File([b],filename(id),{type:'image/png'});
   if(navigator.canShare?.({files:[file]}))await navigator.share({title:'Tabla '+(cat(id)?.name||LABELS[id]),files:[file]});
   else download(b,file.name);
 }catch(e){}finally{busy=false;setBusy(false)}
}
async function doAll(){
 if(busy)return;busy=true;setBusy(true);
 try{
   for(const id of ORDER.filter(x=>cat(x))){
     const b=await canvasFor(id);download(b,filename(id));await new Promise(r=>setTimeout(r,260));
   }
   toast('Se generaron las 5 tablas PNG');
 }catch(e){toast(e.message||'No se pudieron generar todas')}finally{busy=false;setBusy(false)}
}
function csv(){
 const rs=rows(category);if(!rs.length)return toast('No hay tabla publicada');
 const head=['Posición','Equipo','PJ','G','E','P','GF','GC','DG','PTS','Clasificado'];
 const lines=[head,...rs.map(r=>[r.pos,r.name,r.pj,r.g,r.e,r.p,r.gf,r.gc,r.dg,r.pts,r.classified?'Sí':'No'])];
 const text=lines.map(a=>a.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');
 download(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}),'Tabla_'+(cat(category)?.name||LABELS[category]).replace(/[^a-z0-9+]+/gi,'_')+'.csv');
}
function setBusy(on){
 $$('button',document.querySelector('[data-v176-page]')||document).forEach(b=>b.disabled=!!on);
}
function bind(){
 const page=$('[data-v176-page]');if(!page)return;
 $('[data-v176-category]',page).onchange=e=>{category=e.target.value;localStorage.setItem(STORE,category);page.outerHTML=markup();bind()};
 $('[data-v176-download]',page).onclick=()=>doDownload(category);
 $('[data-v176-share]',page).onclick=()=>doShare(category);
 $('[data-v176-download-all]',page).onclick=doAll;
 $('[data-v176-csv]',page).onclick=csv;
}
async function mount(){
 if(route()!=='tableExport')return;
 await getDb();
 if(!cat(category))category=ORDER.find(x=>cat(x))||'3';
 const screen=$('#screen');if(!screen)return;
 const old=screen.querySelector('.v60-tool-page.v64-page, [data-v176-page]');
 if(old?.matches('[data-v176-page]'))return;
 if(old){old.outerHTML=markup()}else screen.insertAdjacentHTML('beforeend',markup());
 bind();
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(mount,70)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',()=>{db=null;schedule()});
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,500);
})();