/* V176 — Exportador compartido de publicaciones oficiales por categoría.
   - 5 categorías oficiales
   - escudos reales desde LJR_TEAM_LOGOS / official-live
   - PNG moderno
   - sin reglas de clasificación supuestas
   - descarga individual o las 5 categorías
*/
(function(){
'use strict';
if(window.__LJR_V176_TABLE_EXPORT__)return;
window.__LJR_V176_TABLE_EXPORT__=true;

const ORDER=()=>window.CompetitionController.categories().map(c=>c.id);
const LABELS={};
const STORE='v176-table-category';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
let db=null,category=localStorage.getItem('v12-fixture-cat')||localStorage.getItem(STORE)||'3',busy=false;

function toast(msg){
 let t=$('.v176-toast');if(t)t.remove();
 t=document.createElement('div');t.className='v176-toast';t.textContent=msg;document.body.appendChild(t);
 setTimeout(()=>t.remove(),2200);
}
async function getDb(){ await window.CompetitionController.load();db=window.LJR_OFFICIAL_DATA;return db; }
function cat(id){return window.CompetitionController.categories().find(c=>c.id===String(id))}
function rows(id){return cat(id)?.standings||[]}
function logo(name){return window.CompetitionController.logo(name)}
function categoryOptions(){
 return ORDER().filter(id=>cat(id)).map(id=>'<option value="'+id+'" '+(id===category?'selected':'')+'>'+esc(cat(id)?.name||LABELS[id])+'</option>').join('');
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
  '<header class="v176-hero"><div><small>EXPORTAR · TABLA OFICIAL</small><h1>Tabla de posiciones</h1><p>Datos oficiales y escudos reales. PNG listo para compartir.</p></div></header>'+
  '<div class="v176-toolbar">'+
    '<label><span>Categoría</span><select data-v176-category>'+categoryOptions()+'</select></label>'+
    '<button type="button" class="primary" data-v176-download>Descargar PNG</button>'+
    '<button type="button" data-v176-share>Compartir</button>'+
  '</div>'+
  '<div class="v176-all-actions"><button type="button" data-v176-download-all>Descargar categorías disponibles PNG</button><button type="button" data-v176-csv>CSV de esta categoría</button></div>'+
  ''+
  '<section class="v176-card">'+
    '<div class="v176-card-head"><div><small>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</small><h2>'+esc(name)+'</h2></div><div class="v176-round">TABLA<br><b>OFICIAL</b></div></div>'+
    '<div class="v176-columns"><span>#</span><span>EQUIPO</span><span>PJ</span><span>G</span><span>E</span><span>P</span><span>DG</span><span>PTS</span></div>'+
    '<div class="v176-body">'+previewRows(category)+'</div>'+
    '<footer><span>Datos oficiales disponibles</span><small>Actualizada con los datos disponibles de la Liga.</small></footer>'+
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
   const timer=setTimeout(()=>resolve(null),8000);im.onload=()=>{clearTimeout(timer);resolve(im)};im.onerror=()=>{clearTimeout(timer);resolve(null)};im.src=src;
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
 // Cabecera columnas
 x.fillStyle='rgba(255,255,255,.08)';rounded(x,52,235,W-104,62,18);x.fill();
 const cols={pos:78,logo:128,team:200,pj:820,g:900,e:970,p:1040,dg:1115,pts:1235};
 x.fillStyle='#aab7d8';x.font='800 21px Arial';
 x.fillText('#',cols.pos,274);x.fillText('EQUIPO',cols.team,274);x.fillText('PJ',cols.pj,274);x.fillText('PG',cols.g,274);x.fillText('PE',cols.e,274);x.fillText('PP',cols.p,274);x.fillText('DG',cols.dg,274);x.fillText('PTS',cols.pts,274);

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

   x.font='800 25px Arial';x.fillStyle='#dce4fb';x.fillText(String(r.pj??'—'),cols.pj,y+49);x.fillText(String(r.g??'—'),cols.g,y+49);x.fillText(String(r.e??'—'),cols.e,y+49);x.fillText(String(r.p??'—'),cols.p,y+49);x.fillText(String(r.dg??'—'),cols.dg,y+49);
   x.fillStyle='#2ae2ee';x.font='900 29px Arial';x.fillText(String(r.pts??'—'),cols.pts,y+49);
 }

 const fy=top+data.length*rowH+35;
 x.fillStyle='#2ae2ee';x.beginPath();x.arc(70,fy,7,0,Math.PI*2);x.fill();
 x.fillStyle='#dce4fb';x.font='800 18px Arial';x.fillText('Generada: '+new Date().toLocaleDateString('es-MX'),88,fy+6);
 x.fillStyle='#7f8fb8';x.font='500 17px Arial';x.fillText('Tabla generada desde los datos oficiales disponibles en la app.',68,fy+48);

 return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('No se pudo crear el PNG.')),'image/png'));
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
   for(const id of ORDER().filter(x=>rows(x).length)){
     const b=await canvasFor(id);download(b,filename(id));await new Promise(r=>setTimeout(r,260));
   }
   toast('Se generaron las tablas disponibles');
 }catch(e){toast(e.message||'No se pudieron generar todas')}finally{busy=false;setBusy(false)}
}
function csv(id=category){
 const rs=rows(id);if(!rs.length)return toast('No hay tabla publicada');
 const head=['Position','Team','PJ','PG','PE','PP','GF','GC','DG','PTS'];
 const lines=[head,...rs.map(r=>[r.pos,r.name,r.pj,r.g,r.e,r.p,r.gf,r.gc,r.dg,r.pts])];
 const text=lines.map(a=>a.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');
 download(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}),'Tabla_'+(cat(id)?.name||LABELS[id]).replace(/[^a-z0-9+]+/gi,'_')+'.csv');
}
function setBusy(on){
 const page=document.querySelector('[data-v176-page]');if(!page)return;
 $$('button',page).forEach(b=>b.disabled=!!on);
}
function bind(){
 const page=$('[data-v176-page]');if(!page)return;
 $('[data-v176-category]',page).onchange=e=>{category=e.target.value;window.CompetitionController.setCategory(category);localStorage.setItem(STORE,category);page.outerHTML=markup();bind()};
 $('[data-v176-download]',page).onclick=()=>doDownload(category);
 $('[data-v176-share]',page).onclick=()=>doShare(category);
 $('[data-v176-download-all]',page).onclick=doAll;
 $('[data-v176-csv]',page).onclick=()=>csv(category);
}
async function mount(){
 if(route()!=='tableExport')return;
 try{await getDb()}catch(e){toast(e.message);return}
 category=window.CompetitionController.state.category;
 if(!cat(category))category=ORDER().find(x=>cat(x))||'3';
 const screen=$('#screen');if(!screen)return;
 const old=screen.querySelector('.v60-tool-page.v64-page, [data-v176-page]');
 if(old?.matches('[data-v176-page]'))return;
 if(old){old.outerHTML=markup()}else screen.insertAdjacentHTML('beforeend',markup());
 bind();
}
// Shared publication renderers. They read the same normalized category as V40.
function wrap(ctx,text,width,size=28){
 ctx.font='700 '+size+'px Arial';const words=String(text??'—').split(/\s+/),lines=[];let line='';
 for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines;
}
function linesAt(ctx,lines,x,y,spacing){for(const line of lines){ctx.fillText(line,x,y);y+=spacing}}
function drawLogo(ctx,im,x,y,size){if(!im)return;const ratio=Math.min(size/im.naturalWidth,size/im.naturalHeight);ctx.drawImage(im,x+(size-im.naturalWidth*ratio)/2,y+(size-im.naturalHeight*ratio)/2,im.naturalWidth*ratio,im.naturalHeight*ratio)}
function png(c){return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('No se pudo crear el PNG.')),'image/png'))}
function publicationCanvas(title,label,height,width=1080){
 const c=document.createElement('canvas');c.width=width;c.height=height;const x=c.getContext('2d');
 const bg=x.createLinearGradient(0,0,width,height);bg.addColorStop(0,'#07166d');bg.addColorStop(1,'#030636');x.fillStyle=bg;x.fillRect(0,0,width,height);
 x.fillStyle='#25e2ed';x.font='800 22px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS',50,58);
 x.fillStyle='#fff';x.font='900 48px Arial';x.fillText(title,50,128);
 x.font='700 26px Arial';x.fillStyle='#bdc8eb';x.fillText(label,50,181);
 x.font='500 19px Arial';x.fillText('Liga Juventino Rosas · '+new Date().toLocaleDateString('es-MX'),50,height-36);
 return {c,x};
}
async function matchPublication(context,kind){
 await getDb();const category=cat(context.category);if(!category)throw Error('Categoría no disponible.');
 let matches=category.matches.filter(m=>m.round===String(context.round));
 if(kind==='single')matches=category.matches.filter(m=>m.id===context.match&&m.complete);
 if(kind==='calendar')matches=matches.filter(m=>!m.complete);
 if(!matches.length)throw Error(kind==='single'?'No hay marcador completo publicado.':'No hay partidos disponibles para esta publicación.');
 const title=kind==='calendar'?'CALENDARIO':kind==='single'?'RESULTADO OFICIAL':'RESULTADOS';
 if(kind==='single'){
  const m=matches[0],{c,x}=publicationCanvas(title,category.name+' · Jornada '+m.round,1350);
  const logos=await Promise.all([imageFor(logo(m.home)),imageFor(logo(m.away))]);
  x.fillStyle='#fff';x.font='700 28px Arial';x.fillText(m.date||'Fecha por confirmar',50,255);
  drawLogo(x,logos[0],135,340,240);drawLogo(x,logos[1],705,340,240);
  x.textAlign='center';x.fillStyle='#fff';linesAt(x,wrap(x,m.home,390,34),255,650,42);linesAt(x,wrap(x,m.away,390,34),825,650,42);
  x.fillStyle='#25e2ed';x.font='900 108px Arial';x.fillText(`${m.homeScore} – ${m.awayScore}`,540,910);
  x.font='700 30px Arial';x.fillStyle='#fff';x.fillText(m.status==='FINAL'?'FINAL':m.status,540,990);
  linesAt(x,wrap(x,m.venue||'Campo por confirmar',900,28),540,1110,36);x.textAlign='left';return png(c);
 }
 // Compute every row's height before allocating the canvas: no shrinking long names.
 const measuring=document.createElement('canvas').getContext('2d');
 const rows=matches.map(m=>{const home=wrap(measuring,m.home,330),away=wrap(measuring,m.away,330);const meta=wrap(measuring,(m.date||'Fecha por confirmar')+' · '+(m.venue||'Campo por confirmar')+(kind==='results'&&!m.complete?' · Sin marcador completo':''),920,22);return {m,home,away,meta,height:Math.max(110,Math.max(home.length,away.length)*36+40)+meta.length*28+30}});
 const {c,x}=publicationCanvas(title,category.name+' · Jornada '+context.round,280+rows.reduce((n,r)=>n+r.height,0));
 const logos=await Promise.all(matches.flatMap(m=>[imageFor(logo(m.home)),imageFor(logo(m.away))]));
 let y=230;rows.forEach((r,i)=>{
  x.fillStyle=i%2?'#111b61':'#0b1455';x.fillRect(35,y,1010,r.height-8);drawLogo(x,logos[i*2],50,y+18,58);drawLogo(x,logos[i*2+1],970,y+18,58);
  x.fillStyle='#fff';x.font='700 28px Arial';linesAt(x,r.home,120,y+44,36);linesAt(x,r.away,635,y+44,36);
  x.textAlign='center';x.fillStyle='#25e2ed';x.font='900 31px Arial';x.fillText(r.m.complete?`${r.m.homeScore} – ${r.m.awayScore}`:r.m.time||'—',540,y+45);x.textAlign='left';
  x.font='500 22px Arial';x.fillStyle='#bdc8eb';linesAt(x,r.meta,65,y+r.height-r.meta.length*28-20,28);y+=r.height;
 });return png(c);
}
async function statsPublication(context,kind){
 await getDb();const category=cat(context.category);if(!category)throw Error('Categoría no disponible.');
 const team=category.standings.find(t=>t.name===context.team);
 if(kind==='team'){
  if(!team)throw Error('No hay tabla oficial para este equipo.');
  const {c,x}=publicationCanvas('ESTADÍSTICAS DE EQUIPO',category.name,1350);const im=await imageFor(logo(team.name));drawLogo(x,im,410,245,260);
  x.textAlign='center';x.fillStyle='#fff';linesAt(x,wrap(x,team.name,920,40),540,575,48);
  const values=[['POS',team.pos],['PJ',team.pj],['PG',team.g],['PE',team.e],['PP',team.p],['GF',team.gf],['GC',team.gc],['DG',team.dg],['PTS',team.pts]];
  values.forEach(([label,value],i)=>{const cx=210+i%3*330,cy=760+Math.floor(i/3)*140;x.fillStyle='#aabce5';x.font='700 25px Arial';x.fillText(label,cx,cy);x.fillStyle='#25e2ed';x.font='900 48px Arial';x.fillText(String(value??'—'),cx,cy+57)});
  if(team.form.length){x.font='700 28px Arial';x.fillText('Forma: '+team.form.join(' · '),540,1225)}return png(c);
 }
 if(kind==='scorers'){
  if(!category.scorers.length)throw Error('No hay tabla de goleadores activa en la fuente oficial para esta categoría.');
  const measure=document.createElement('canvas').getContext('2d');
  const rows=category.scorers.map(r=>({...r,lines:wrap(measure,r.player,580,29),teamLines:wrap(measure,r.team,580,23)}));
  rows.forEach(r=>r.height=Math.max(120,r.lines.length*35+r.teamLines.length*29+40));
  const {c,x}=publicationCanvas('GOLEADORES',category.name,280+rows.reduce((n,r)=>n+r.height,0));
  const logos=await Promise.all(rows.map(r=>imageFor(logo(r.team))));let y=235;
  rows.forEach((r,i)=>{x.fillStyle='#fff';x.font='800 28px Arial';x.fillText(String(r.pos??i+1),55,y+40);drawLogo(x,logos[i],110,y+8,68);x.font='700 29px Arial';linesAt(x,r.lines,205,y+32,35);x.fillStyle='#bdc8eb';x.font='500 23px Arial';linesAt(x,r.teamLines,205,y+32+r.lines.length*35,29);x.fillStyle='#25e2ed';x.font='900 38px Arial';x.fillText(String(r.goals),945,y+45);y+=r.height});return png(c);
 }
 const values=Object.entries(window.CompetitionController.statistics(category));
 if(!category.matches.length&&!category.standings.length)throw Error('No hay estadísticas oficiales para esta categoría.');
 const {c,x}=publicationCanvas('ESTADÍSTICAS',category.name,Math.max(1350,340+values.length*100));
 values.forEach(([label,value],i)=>{const y=260+i*100;x.fillStyle='#bdc8eb';x.font='600 24px Arial';x.fillText(label,50,y);x.fillStyle='#fff';x.font='800 30px Arial';x.fillText(String(value),50,y+42)});return png(c);
}
async function bracketPublication(context){
 await getDb();const category=cat(context.category),stages=category?.stages;
 if(!stages?.length)throw Error('No hay cuadro oficial publicado para esta categoría.');
 const width=Math.max(1600,stages.length*460+100),height=Math.max(1000,300+Math.max(...stages.map(s=>s.matches.length))*180);
 const {c,x}=publicationCanvas('CUADRO OFICIAL',category.name,height,width);
 for(let col=0;col<stages.length;col++){
  const stage=stages[col],left=50+col*460;x.fillStyle='#25e2ed';x.font='800 25px Arial';x.fillText(stage.id,left,230);
  for(let i=0;i<stage.matches.length;i++){
   const m=stage.matches[i],top=270+i*180;x.fillStyle='#121d63';rounded(x,left,top,420,148,12);x.fill();
   const logos=await Promise.all([imageFor(logo(m.home)),imageFor(logo(m.away))]);
   for(const [j,name,score] of [[0,m.home,m.homeScore],[1,m.away,m.awayScore]]){drawLogo(x,logos[j],left+8,top+12+j*65,42);x.fillStyle='#fff';const lines=wrap(x,name,280,20);linesAt(x,lines,left+60,top+30+j*65,23);x.fillText(String(score??'—'),left+385,top+35+j*65)}
  }
 }
 return png(c);
}
window.CompetitionExports={
 standings:async context=>{await getDb();return canvasFor(context.category)},
 results:context=>matchPublication(context,'results'),calendar:context=>matchPublication(context,'calendar'),single:context=>matchPublication(context,'single'),
 stats:context=>statsPublication(context,'stats'),team:context=>statsPublication(context,'team'),scorers:context=>statsPublication(context,'scorers'),bracket:bracketPublication,
 csv,download
};

let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(mount,70)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',()=>{db=null;schedule()});
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,500);
})();