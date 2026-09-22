/* V129 — Cambios urgentes de horario y sede.
   Herramienta operativa: selecciona un partido oficial, registra el cambio,
   genera aviso, imagen, URL directa, QR y acceso para compartir en Facebook.
   Los cambios se guardan localmente; la fuente oficial sigue siendo AdminFut/Liga_Futbol. */
(function(){
'use strict';
if(window.__LJR_V129_SCHEDULE_CHANGES__)return;
window.__LJR_V129_SCHEDULE_CHANGES__=true;

const DATA_URL='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const ASSET_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const STORE_KEY='ljr-schedule-changes-v1';
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const read=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{return []}};
const write=v=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch{}};
let db=null,loading=null,currentNotice=null;

function toast(msg){
  let t=document.querySelector('.v129-toast');
  if(!t){t=document.createElement('div');t.className='v129-toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800);
}

async function loadData(){
  if(db)return db;
  if(loading)return loading;
  loading=(async()=>{
    try{
      if(window.LJR_OFFICIAL_DATA){db=window.LJR_OFFICIAL_DATA;return db}
      const r=await fetch(DATA_URL+'?v='+Date.now(),{cache:'no-store'});
      if(r.ok){db=await r.json();window.LJR_OFFICIAL_DATA=db}
    }catch(_){}
    return db;
  })();
  return loading;
}

function parseDate(raw){
  const s=String(raw||'').trim();
  const m=s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return {date:'',time:'',label:s||'Por confirmar'};
  const date=m[3]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0');
  const time=m[4]?String(m[4]).padStart(2,'0')+':'+m[5]:'';
  return {date,time,label:s};
}

function matches(){
  const out=[];
  for(const [catId,c] of Object.entries(db?.categories||{})){
    (c.fixtures||[]).forEach((block,bi)=>{
      (block?.rows||[]).forEach((r,ri)=>{
        const home=String(r?.[2]||'').trim(),away=String(r?.[6]||'').trim();
        if(!home&&!away)return;
        const d=parseDate(r?.[8]);
        out.push({
          id:catId+'-'+bi+'-'+ri,
          catId,category:c.name||('Categoría '+catId),
          round:String(r?.[1]||'').trim(),
          home,away,
          venue:String(r?.[7]||'').trim(),
          rawDate:String(r?.[8]||'').trim(),
          date:d.date,time:d.time
        });
      });
    });
  }
  return out.sort((a,b)=>(a.rawDate||'').localeCompare(b.rawDate||''));
}

function teamLogo(name){
  try{const s=window.LJR_TEAM_LOGOS?.get?.(name);if(s)return s}catch(_){}
  const hit=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===norm(name));
  const v=hit?.[1];
  if(typeof v==='string')return v;
  if(v?.local)return ASSET_BASE+String(v.local).replace(/^\.\//,'');
  if(v?.source)return v.source;
  return '';
}

function shareUrl(n){
  const u=new URL(location.href);
  u.searchParams.delete('refresh');
  u.searchParams.set('notice',JSON.stringify(n));
  u.hash='/scheduleChanges';
  return u.toString();
}

function noticeText(n){
  const parts=[
    '⚠️ CAMBIO DE HORARIO / SEDE',
    n.home+' vs '+n.away,
    n.category+(n.round?' · Jornada '+n.round:''),
    'Nuevo horario: '+(n.newDate||'Por confirmar')+(n.newTime?' · '+n.newTime:''),
    'Nueva sede: '+(n.newVenue||'Por confirmar')
  ];
  if(n.reason)parts.push('Motivo: '+n.reason);
  parts.push('Liga Municipal de Fútbol Juventino Rosas');
  return parts.join('\n');
}

function currentOption(m){
  return esc(m.category+' · J'+(m.round||'—')+' · '+m.home+' vs '+m.away+' · '+(m.rawDate||'Sin fecha'));
}

function pageMarkup(){
  const all=matches();
  const saved=read();
  return '<section class="v129-page" data-v129-schedule>'+
    '<header class="v129-top"><button type="button" aria-label="Volver" data-v129-back>‹</button><div><small>OPERACIÓN DE JORNADA</small><h1>Cambios de horario y sedes</h1><p>Genera un aviso de último momento con imagen, enlace directo y QR.</p></div></header>'+
    '<section class="v129-card v129-editor">'+
      '<label><span>Partido oficial</span><select data-v129-match><option value="">Selecciona un partido</option>'+all.map(m=>'<option value="'+esc(m.id)+'">'+currentOption(m)+'</option>').join('')+'</select></label>'+
      '<div class="v129-current" data-v129-current><b>Selecciona un partido</b><small>Se mostrarán aquí el horario y la sede actuales.</small></div>'+
      '<div class="v129-grid">'+
        '<label><span>Tipo de cambio</span><select data-v129-type><option>Cambio de horario y sede</option><option>Cambio de horario</option><option>Cambio de sede</option><option>Reprogramación</option><option>Suspensión</option></select></label>'+
        '<label><span>Nueva fecha</span><input type="date" data-v129-date></label>'+
        '<label><span>Nueva hora</span><input type="time" data-v129-time></label>'+
        '<label><span>Nueva sede / campo</span><input type="text" data-v129-venue placeholder="Ej. Campo 1 · Unidad Deportiva Sur"></label>'+
      '</div>'+
      '<label><span>Motivo / aviso</span><textarea data-v129-reason placeholder="Ej. Cambio de último momento por disponibilidad del campo."></textarea></label>'+
      '<div class="v129-actions"><button class="primary" type="button" data-v129-generate>Generar aviso</button><button type="button" data-v129-save>Guardar cambio</button></div>'+
      '<p class="v129-note">Guardar cambio actualiza esta herramienta y el aviso en este dispositivo. Para que sea oficial para todos, también debe actualizarse la fuente oficial de la Liga.</p>'+
    '</section>'+
    '<section class="v129-card v129-preview" data-v129-preview hidden></section>'+
    '<section class="v129-card"><div class="v129-list-head"><div><small>CAMBIOS GUARDADOS</small><h2>Historial local</h2></div><button type="button" data-v129-clear>Limpiar</button></div><div data-v129-list>'+savedList(saved)+'</div></section>'+
  '</section>';
}

function savedList(saved){
  if(!saved.length)return '<p class="v129-empty">Todavía no hay cambios guardados en este dispositivo.</p>';
  return saved.slice().reverse().map((n,i)=>'<article class="v129-saved"><div><b>'+esc(n.home)+' vs '+esc(n.away)+'</b><small>'+esc(n.newDate||'')+' · '+esc(n.newTime||'')+' · '+esc(n.newVenue||'')+'</small></div><button type="button" data-v129-open-saved="'+esc(n.uid)+'">Abrir</button></article>').join('');
}

function selectedMatch(root){
  const id=root.querySelector('[data-v129-match]')?.value||'';
  return matches().find(m=>m.id===id)||null;
}

function formNotice(root){
  const m=selectedMatch(root);if(!m)return null;
  return {
    uid:'chg-'+Date.now(),
    type:root.querySelector('[data-v129-type]')?.value||'Cambio de horario y sede',
    matchId:m.id,catId:m.catId,category:m.category,round:m.round,
    home:m.home,away:m.away,
    oldDate:m.date,oldTime:m.time,oldVenue:m.venue,oldRaw:m.rawDate,
    newDate:root.querySelector('[data-v129-date]')?.value||m.date,
    newTime:root.querySelector('[data-v129-time]')?.value||m.time,
    newVenue:(root.querySelector('[data-v129-venue]')?.value||m.venue||'').trim(),
    reason:(root.querySelector('[data-v129-reason]')?.value||'').trim(),
    createdAt:new Date().toISOString()
  };
}

function previewMarkup(n){
  const url=shareUrl(n);
  const qr='https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data='+encodeURIComponent(url);
  const homeLogo=teamLogo(n.home),awayLogo=teamLogo(n.away);
  return '<div class="v129-poster" data-v129-poster>'+
    '<div class="v129-poster-head"><small>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</small><strong>'+esc(n.type.toUpperCase())+'</strong></div>'+
    '<div class="v129-versus">'+
      '<div>'+(homeLogo?'<img src="'+esc(homeLogo)+'" alt="">':'')+'<b>'+esc(n.home)+'</b></div><span>VS</span>'+
      '<div>'+(awayLogo?'<img src="'+esc(awayLogo)+'" alt="">':'')+'<b>'+esc(n.away)+'</b></div>'+
    '</div>'+
    '<div class="v129-change-grid">'+
      '<div><small>ANTES</small><b>'+esc((n.oldDate||'Por confirmar')+(n.oldTime?' · '+n.oldTime:''))+'</b><span>'+esc(n.oldVenue||'Sede por confirmar')+'</span></div>'+
      '<div><small>NUEVO</small><b>'+esc((n.newDate||'Por confirmar')+(n.newTime?' · '+n.newTime:''))+'</b><span>'+esc(n.newVenue||'Sede por confirmar')+'</span></div>'+
    '</div>'+
    (n.reason?'<p>'+esc(n.reason)+'</p>':'')+
    '<div class="v129-poster-foot"><span>Información de jornada · Consulta la URL o escanea el QR</span></div>'+
  '</div>'+
  '<div class="v129-publish"><button type="button" data-v129-download>Descargar imagen</button><button type="button" data-v129-facebook>Facebook</button><button type="button" data-v129-copy>Copiar URL</button><button type="button" data-v129-qr-toggle>QR</button></div>'+
  '<div class="v129-url"><input readonly value="'+esc(url)+'" data-v129-url><button type="button" data-v129-copy>Copiar</button></div>'+
  '<div class="v129-qr" data-v129-qr hidden><img src="'+esc(qr)+'" alt="Código QR del aviso"><small>Escanea para abrir este aviso directamente.</small></div>'+
  '<pre class="v129-caption">'+esc(noticeText(n))+'</pre>';
}

function fillFromMatch(root,m){
  const cur=root.querySelector('[data-v129-current]');
  cur.innerHTML='<b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>Actual: '+esc(m.rawDate||'Fecha por confirmar')+' · '+esc(m.venue||'Sede por confirmar')+'</small>';
  root.querySelector('[data-v129-date]').value=m.date||'';
  root.querySelector('[data-v129-time]').value=m.time||'';
  root.querySelector('[data-v129-venue]').value=m.venue||'';
}

function showPreview(root,n){
  currentNotice=n;
  const p=root.querySelector('[data-v129-preview]');
  p.hidden=false;p.innerHTML=previewMarkup(n);
  bindPreview(root,n);
  p.scrollIntoView({behavior:'smooth',block:'start'});
}

async function loadImage(src){
  return new Promise(resolve=>{
    if(!src)return resolve(null);
    const img=new Image();img.crossOrigin='anonymous';
    img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;
  });
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function wrap(ctx,text,x,y,maxWidth,lineHeight,maxLines=3){
  const words=String(text||'').split(/\s+/);let line='',lines=[];
  for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=w}else line=test}
  if(line)lines.push(line);lines=lines.slice(0,maxLines);
  lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));
}

async function downloadPoster(n){
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d');
  const g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#08147f');g.addColorStop(.55,'#07106a');g.addColorStop(1,'#02043f');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);
  const glow=ctx.createRadialGradient(860,250,20,860,250,520);glow.addColorStop(0,'rgba(22,222,234,.38)');glow.addColorStop(1,'rgba(22,222,234,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,1080,800);
  ctx.fillStyle='#22dfe9';ctx.font='800 34px Arial';ctx.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',70,92);
  ctx.fillStyle='#fff';ctx.font='900 74px Arial';wrap(ctx,n.type.toUpperCase(),70,180,940,82,2);
  roundRect(ctx,60,300,960,750,48);ctx.fillStyle='rgba(25,40,145,.76)';ctx.fill();ctx.strokeStyle='rgba(111,145,255,.42)';ctx.lineWidth=3;ctx.stroke();
  const hLogo=await loadImage(teamLogo(n.home)),aLogo=await loadImage(teamLogo(n.away));
  if(hLogo)ctx.drawImage(hLogo,150,390,150,150);
  if(aLogo)ctx.drawImage(aLogo,780,390,150,150);
  ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='800 42px Arial';wrap(ctx,n.home,225,600,300,48,2);wrap(ctx,n.away,855,600,300,48,2);
  ctx.fillStyle='#22dfe9';ctx.font='900 36px Arial';ctx.fillText('VS',540,495);
  ctx.textAlign='left';ctx.fillStyle='#8feef4';ctx.font='900 28px Arial';ctx.fillText('ANTES',120,735);ctx.fillText('NUEVO',575,735);
  ctx.fillStyle='#fff';ctx.font='800 34px Arial';wrap(ctx,(n.oldDate||'Por confirmar')+(n.oldTime?' · '+n.oldTime:''),120,790,380,42,2);wrap(ctx,(n.newDate||'Por confirmar')+(n.newTime?' · '+n.newTime:''),575,790,380,42,2);
  ctx.fillStyle='#d7dcf4';ctx.font='500 28px Arial';wrap(ctx,n.oldVenue||'Sede por confirmar',120,900,380,36,2);wrap(ctx,n.newVenue||'Sede por confirmar',575,900,380,36,2);
  if(n.reason){ctx.fillStyle='#fff';ctx.font='600 28px Arial';wrap(ctx,n.reason,90,1120,900,38,3)}
  ctx.fillStyle='#22dfe9';ctx.font='700 23px Arial';ctx.fillText('Aviso para compartir · '+shareUrl(n).slice(0,82),70,1290);
  canvas.toBlob(blob=>{
    if(!blob)return toast('No se pudo crear la imagen');
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Cambio_'+slug(n.home)+'_'+slug(n.away)+'.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  },'image/png',.95);
}

function slug(v){return String(v||'partido').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'')}

function bindPreview(root,n){
  root.querySelector('[data-v129-download]')?.addEventListener('click',()=>downloadPoster(n));
  root.querySelector('[data-v129-facebook]')?.addEventListener('click',()=>{
    window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareUrl(n)),'_blank','noopener,noreferrer');
  });
  root.querySelectorAll('[data-v129-copy]').forEach(b=>b.addEventListener('click',async()=>{
    const u=shareUrl(n);try{await navigator.clipboard.writeText(u);toast('URL copiada')}catch{const i=root.querySelector('[data-v129-url]');i?.select();document.execCommand?.('copy');toast('URL lista para copiar')}
  }));
  root.querySelector('[data-v129-qr-toggle]')?.addEventListener('click',()=>{
    const q=root.querySelector('[data-v129-qr]');if(q)q.hidden=!q.hidden;
  });
}

function bind(root){
  root.querySelector('[data-v129-back]')?.addEventListener('click',()=>{if(window.LJR_APP_BACK)window.LJR_APP_BACK();else location.hash='#/home'});
  root.querySelector('[data-v129-match]')?.addEventListener('change',e=>{const m=matches().find(x=>x.id===e.target.value);if(m)fillFromMatch(root,m)});
  root.querySelector('[data-v129-generate]')?.addEventListener('click',()=>{
    const n=formNotice(root);if(!n)return toast('Selecciona un partido');showPreview(root,n);
  });
  root.querySelector('[data-v129-save]')?.addEventListener('click',()=>{
    const n=formNotice(root);if(!n)return toast('Selecciona un partido');
    const list=read();list.push(n);write(list.slice(-60));
    window.LJR_SCHEDULE_CHANGES=list.slice(-60);
    window.dispatchEvent(new CustomEvent('ljr:schedule-change',{detail:n}));
    root.querySelector('[data-v129-list]').innerHTML=savedList(list);
    showPreview(root,n);toast('Cambio guardado en este dispositivo');
  });
  root.querySelector('[data-v129-clear]')?.addEventListener('click',()=>{write([]);root.querySelector('[data-v129-list]').innerHTML=savedList([]);toast('Historial local limpiado')});
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-v129-open-saved]');if(!b)return;
    const n=read().find(x=>x.uid===b.dataset.v129OpenSaved);if(n)showPreview(root,n);
  });
}

function fromUrl(){
  try{
    const raw=new URLSearchParams(location.search).get('notice');
    if(!raw)return null;
    const n=JSON.parse(raw);
    return n&&n.home&&n.away?n:null;
  }catch{return null}
}

async function render(){
  if(route()!=='scheduleChanges')return;
  document.body.setAttribute('data-app-route','scheduleChanges');
  const root=document.querySelector('#screen');if(!root)return;
  if(root.querySelector('[data-v129-schedule]'))return;
  await loadData();
  root.innerHTML=pageMarkup();
  bind(root);
  const shared=fromUrl();
  if(shared)showPreview(root,shared);
}

window.LJR_SCHEDULE_CHANGES=read();
window.addEventListener('hashchange',()=>setTimeout(render,0));
const root=document.querySelector('#screen');
if(root)new MutationObserver(()=>{if(route()==='scheduleChanges'&&!root.querySelector('[data-v129-schedule]'))setTimeout(render,0)}).observe(root,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();