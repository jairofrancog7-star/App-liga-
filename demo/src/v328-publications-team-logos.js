/* V328 — Publicaciones PNG con identidad oficial.
   Añade al PNG compartido/descargado el logo de la Liga y los escudos reales
   de todos los equipos detectados en el boletín, sin cambiar la pantalla. */
(function(){
'use strict';
if(window.__LJR_V328_PUBLICATIONS_TEAM_LOGOS__)return;
window.__LJR_V328_PUBLICATIONS_TEAM_LOGOS__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE_LOGO=ROOT+'assets/liga-logo.webp';
const norm=v=>String(v||'')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function logoFor(name){
  try{
    const v=window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||'';
    if(v)return v;
  }catch(_){}
  const db=window.LJR_OFFICIAL_DATA||{};
  const hit=Object.entries(db.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  if(typeof hit==='string')return hit;
  if(hit?.local)return ROOT+String(hit.local).replace(/^\.?\//,'');
  if(hit?.source)return hit.source;
  return '';
}

function teamDirectory(){
  const out=[];
  const add=name=>{
    name=String(name||'').trim();
    if(!name)return;
    const n=norm(name);
    if(!n||n.length<2)return;
    if(/^(tabla|goleadores?|goleo|jornada|liga|pts?|pj|pg|pe|pp|gf|gc|dif|resultado|resultados)$/.test(n))return;
    out.push(name);
  };
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.();
    if(Array.isArray(list))list.forEach(x=>add(x?.name));
  }catch(_){}
  const db=window.LJR_OFFICIAL_DATA||{};
  Object.values(db.categories||{}).forEach(c=>{
    (c?.standings||[]).forEach(g=>(g?.rows||[]).forEach(r=>add(r?.[1])));
    Object.keys(c?.rosters||{}).forEach(add);
    (c?.fixtures||[]).forEach(g=>(g?.rows||[]).forEach(r=>{add(r?.[2]);add(r?.[6]);}));
  });
  try{Object.keys(window.LJR_TEAM_LOGOS?.map||{}).forEach(add)}catch(_){}
  const seen=new Set();
  return out
    .sort((a,b)=>norm(b).length-norm(a).length)
    .filter(name=>{const n=norm(name);if(seen.has(n))return false;seen.add(n);return true});
}

function teamsInText(text){
  const hay=' '+norm(text)+' ';
  const selected=[];
  const covered=[];
  for(const name of teamDirectory()){
    const n=norm(name);
    if(!n)continue;
    const pos=hay.indexOf(' '+n+' ');
    if(pos<0)continue;
    if(covered.some(x=>pos>=x[0]&&pos<x[1]))continue;
    const src=logoFor(name);
    if(!src)continue;
    selected.push({name,src});
    covered.push([pos,pos+n.length+2]);
  }
  return selected;
}

function image(src){
  return new Promise(resolve=>{
    if(!src)return resolve(null);
    const im=new Image();
    im.crossOrigin='anonymous';
    let done=false;
    const finish=v=>{if(done)return;done=true;clearTimeout(timer);resolve(v)};
    const timer=setTimeout(()=>finish(null),3500);
    im.onload=()=>finish(im);
    im.onerror=()=>finish(null);
    im.src=src;
  });
}

function roundRect(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}

function fitText(ctx,text,maxWidth){
  let s=String(text||'');
  if(ctx.measureText(s).width<=maxWidth)return s;
  while(s.length>3&&ctx.measureText(s+'…').width>maxWidth)s=s.slice(0,-1);
  return s+'…';
}

function wrapLines(ctx,text,maxWidth,maxLines){
  const lines=[];
  for(const para of String(text||'').split(/\n/)){
    const words=para.trim().split(/\s+/).filter(Boolean);
    if(!words.length){if(lines.length<maxLines)lines.push('');continue}
    let line='';
    for(const word of words){
      const next=line?line+' '+word:word;
      if(line&&ctx.measureText(next).width>maxWidth){
        lines.push(line);
        if(lines.length>=maxLines)return lines;
        line=word;
      }else line=next;
    }
    if(line&&lines.length<maxLines)lines.push(line);
    if(lines.length>=maxLines)return lines;
  }
  return lines;
}

function initials(name){
  return String(name||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR';
}

async function makePngCanvas(){
  const text=document.querySelector('[data-v60-share-text]')?.textContent?.trim()||
    'Liga Municipal de Fútbol Juventino Rosas';
  const teams=teamsInText(text);
  const canvas=document.createElement('canvas');
  canvas.width=1080;canvas.height=1350;
  const x=canvas.getContext('2d');

  const g=x.createLinearGradient(0,0,1080,1350);
  g.addColorStop(0,'#02095c');g.addColorStop(.55,'#073aa9');g.addColorStop(1,'#02064d');
  x.fillStyle=g;x.fillRect(0,0,1080,1350);
  x.strokeStyle='#18ddea';x.lineWidth=5;x.strokeRect(50,50,980,1250);

  const league=await image(LEAGUE_LOGO);
  if(league){
    x.save();
    x.beginPath();x.arc(118,128,54,0,Math.PI*2);x.clip();
    x.drawImage(league,64,74,108,108);
    x.restore();
  }

  x.fillStyle='#5cecf3';x.font='800 22px Arial';
  x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',195,116);
  x.fillStyle='rgba(255,255,255,.78)';x.font='700 18px Arial';
  x.fillText('PUBLICACIÓN OFICIAL',195,146);
  x.fillStyle='#fff';x.font='900 58px Arial';
  x.fillText('JORNADA',90,232);

  const count=teams.length;
  const cols=count>24?10:12;
  const rows=Math.max(1,Math.ceil(Math.min(count,30)/cols));
  const logoArea=count?Math.min(260,82+rows*76):0;
  const logoTop=count?1260-logoArea:1260;

  x.font='700 29px Arial';
  const maxTextLines=Math.max(10,Math.floor((logoTop-310)/43));
  const lines=wrapLines(x,text,900,maxTextLines);
  x.fillStyle='#fff';
  lines.forEach((line,i)=>x.fillText(line,90,310+i*43));
  if(lines.length>=maxTextLines){
    x.fillStyle='rgba(255,255,255,.68)';x.font='600 17px Arial';
    x.fillText('Consulta la publicación completa en la app.',90,logoTop-18);
  }

  if(count){
    x.fillStyle='rgba(2,8,72,.62)';
    roundRect(x,72,logoTop,936,logoArea,24);x.fill();
    x.strokeStyle='rgba(92,236,243,.34)';x.lineWidth=2;
    roundRect(x,72,logoTop,936,logoArea,24);x.stroke();

    x.fillStyle='#5cecf3';x.font='800 17px Arial';
    x.fillText('EQUIPOS DE ESTA PUBLICACIÓN',96,logoTop+30);

    const visible=teams.slice(0,30);
    const cellW=888/cols;
    const imgs=await Promise.all(visible.map(t=>image(t.src)));
    visible.forEach((t,i)=>{
      const row=Math.floor(i/cols),col=i%cols;
      const cx=96+cellW*col+cellW/2;
      const cy=logoTop+61+row*76;
      const im=imgs[i];
      if(im){
        const size=42;
        const ratio=Math.min(size/im.naturalWidth,size/im.naturalHeight);
        const w=im.naturalWidth*ratio,h=im.naturalHeight*ratio;
        x.drawImage(im,cx-w/2,cy-h/2,w,h);
      }else{
        x.fillStyle='rgba(255,255,255,.13)';
        x.beginPath();x.arc(cx,cy,21,0,Math.PI*2);x.fill();
        x.fillStyle='#fff';x.font='800 13px Arial';x.textAlign='center';
        x.fillText(initials(t.name),cx,cy+5);x.textAlign='left';
      }
      x.fillStyle='rgba(255,255,255,.88)';x.font='700 11px Arial';x.textAlign='center';
      x.fillText(fitText(x,t.name,cellW-5),cx,cy+34);
      x.textAlign='left';
    });
  }

  x.fillStyle='rgba(255,255,255,.68)';x.font='600 18px Arial';
  x.fillText('Información generada desde la app oficial de la Liga',90,1282);

  return canvas;
}

async function makePngBlob(){
  const canvas=await makePngCanvas();
  return new Promise(resolve=>canvas.toBlob(resolve,'image/png',1));
}

function fileName(){
  const kind=localStorage.getItem('v95-bulletin-kind')||'full';
  return 'Publicacion_Liga_Juventino_'+kind+'.png';
}

function toast(msg){
  let t=document.querySelector('.v328-toast');
  if(t)t.remove();
  t=document.createElement('div');
  t.className='v328-toast';t.textContent=msg;
  t.style.cssText='position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:99999;background:#07105f;color:#fff;border:1px solid rgba(92,236,243,.45);border-radius:999px;padding:11px 16px;font:700 13px Arial;box-shadow:0 12px 28px rgba(0,0,0,.35)';
  document.body.appendChild(t);setTimeout(()=>t.remove(),2300);
}

function download(blob,name){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200);
}

async function onClick(e){
  if(!/\/publications(?:\?|$)/.test(location.hash.replace(/^#/,'')||''))return;
  const down=e.target.closest?.('[data-v100-bulletin-png]');
  const share=e.target.closest?.('[data-v100-bulletin-share]');
  if(!down&&!share)return;

  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const button=down||share;
  if(button.dataset.v328Busy==='1')return;
  button.dataset.v328Busy='1';
  const old=button.textContent;
  button.textContent='Generando PNG…';

  try{
    const blob=await makePngBlob();
    if(!blob)throw new Error('No se pudo crear el PNG');
    const name=fileName();
    if(share){
      const file=new File([blob],name,{type:'image/png'});
      if(navigator.canShare?.({files:[file]})){
        await navigator.share({title:'Liga Juventino Rosas',files:[file]});
        toast('PNG compartido con logos oficiales');
      }else{
        download(blob,name);
        toast('PNG descargado con logos oficiales');
      }
    }else{
      download(blob,name);
      toast('PNG descargado con logos oficiales');
    }
  }catch(err){
    console.error('[V328 publications PNG]',err);
    toast('No se pudo generar el PNG');
  }finally{
    button.dataset.v328Busy='0';button.textContent=old;
  }
}

document.addEventListener('click',onClick,true);

/* V951 — La vista previa usa EL MISMO canvas del PNG real con escudos.
   No duplica lógica, no inventa partidos; se actualiza al cambiar tipo o texto. */
let previewTimer=0,previewBusy=false,previewText='',previewRequested=false,previewScreen=null,previewObserver=null;
const selectedText=()=>document.querySelector('body[data-app-route="publications"] [data-v60-share-text]')?.textContent?.trim()||
  'Liga Municipal de Fútbol Juventino Rosas';

function previewBox(){
  if(!/\/publications(?:\?|$)/.test(location.hash.replace(/^#/,'')))return null;
  const section=document.querySelector('body[data-app-route="publications"] #v100-publication-extra');
  if(!section)return null;
  let box=section.querySelector('[data-v328-preview-box]');
  if(box)return box;
  box=document.createElement('div');
  box.className='v328-live-preview';
  box.dataset.v328PreviewBox='';
  box.innerHTML=
    '<button type="button" class="v328-preview-open" aria-label="Ampliar vista previa PNG">'+
    '<span class="v328-preview-thumb"><img alt="Vista previa de la imagen PNG de jornada" data-v328-preview-img>'+
    '<span class="v328-preview-placeholder" aria-hidden="true"><small>LIGA JUVENTINO</small><b>JORNADA</b></span></span>'+
    '<span class="v328-preview-copy"><b>Vista previa PNG</b><small data-v328-preview-status>Preparando imagen oficial…</small><em>Ampliar imagen ↗</em></span></button>';
  const actions=section.querySelector('.v100-actions');
  if(actions)actions.before(box);
  else section.append(box);
  box.querySelector('.v328-preview-open').onclick=()=>{
    const src=box.querySelector('[data-v328-preview-img]')?.src;
    if(!src)return;
    const dialog=document.createElement('dialog');
    dialog.className='v328-preview-modal';
    dialog.setAttribute('aria-label','Vista previa PNG de jornada');
    const close=document.createElement('button');
    close.type='button';close.textContent='✕ Cerrar vista previa';close.className='v328-preview-close';
    close.onclick=()=>dialog.close();
    const img=document.createElement('img');
    img.src=src;img.alt='Vista previa completa del boletín de jornada PNG';
    dialog.append(close,img);
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
    document.body.append(dialog);
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  };
  return box;
}
async function refreshPreview(){
  const box=previewBox();
  if(!box)return;
  const value=selectedText(),img=box.querySelector('[data-v328-preview-img]');
  if(value===previewText && (previewBusy || img?.getAttribute('src')))return;
  if(previewBusy){previewRequested=true;return;}
  previewBusy=true;previewText=value;
  const status=box.querySelector('[data-v328-preview-status]');
  status.textContent='Generando vista previa…';
  try{
    const canvas=await makePngCanvas();
    const current=document.querySelector('body[data-app-route="publications"] #v100-publication-extra [data-v328-preview-box]');
    if(current===box&&selectedText()===value){
      img.src=canvas.toDataURL('image/png');
      box.classList.add('is-ready');
      status.textContent='Así se verá tu PNG HD';
    }
  }catch(e){
    console.error('[V951 bulletin preview]',e);
    if(box.isConnected){
      box.classList.remove('is-ready');
      status.textContent='Vista previa no disponible. Prueba descargar PNG.';
    }
  }finally{
    previewBusy=false;
    if(previewRequested || selectedText()!==value){
      previewRequested=false;queuePreview();
    }
  }
}
function queuePreview(){
  if(previewTimer)clearTimeout(previewTimer);
  previewTimer=setTimeout(()=>{previewTimer=0;refreshPreview()},180);
}
function watchPreview(){
  const screen=document.querySelector('#screen');
  if(!screen)return;
  if(previewScreen!==screen){
    previewObserver?.disconnect();
    previewScreen=screen;
    previewObserver=new MutationObserver(()=>{
      if(document.body?.dataset?.appRoute==='publications')queuePreview();
    });
    previewObserver.observe(screen,{childList:true,subtree:true,characterData:true});
  }
  queuePreview();
}
document.addEventListener('click',e=>{
  if(e.target?.closest?.('[data-v95-bulletin-kind]'))queuePreview();
},true);
window.addEventListener('hashchange',()=>setTimeout(watchPreview,100));
window.addEventListener('pageshow',watchPreview);
window.addEventListener('ljr:official-data',queuePreview);
document.addEventListener('DOMContentLoaded',watchPreview,{once:true});
if(document.readyState!=='loading')watchPreview();

})();