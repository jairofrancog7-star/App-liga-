/* V485 — credencial roja oficial hard override.
   Usa la imagen original de la Liga y elimina solo el fondo negro,
   preservando completa la bruja, sombrero, ropa, luna, escoba y letras. */
(function(){
'use strict';
if(window.__LJR_V480_CREDENTIAL__)return;
window.__LJR_V480_CREDENTIAL__=true;

const BUILD='20261001-v490-exact-user-reference-logo';
const LEAGUE_LOGO='data:image/webp;base64,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[...truncated due to length...]';
const $=(s,r=document)=>r.querySelector(s);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function loadImage(src){
  if(!src)return Promise.resolve(null);
  return new Promise(resolve=>{
    const im=new Image();
    im.crossOrigin='anonymous';
    im.onload=()=>resolve(im);
    im.onerror=()=>resolve(null);
    im.src=src;
  });
let leagueLogoCache=null;
async function transparentLeagueLogo(src){
  if(leagueLogoCache)return leagueLogoCache;
  /* V490: usar DIRECTAMENTE el logo extraído de la referencia del usuario.
     Sin máscara adicional, sin quitar negros y sin reconstruir la bruja. */
  leagueLogoCache=await loadImage(src);
  return leagueLogoCache;
}

function roundRect(x,a,b,w,h,r){
  r=Math.min(r,w/2,h/2);
  x.beginPath();
  x.moveTo(a+r,b);
  x.arcTo(a+w,b,a+w,b+h,r);
  x.arcTo(a+w,b+h,a,b+h,r);
  x.arcTo(a,b+h,a,b,r);
  x.arcTo(a,b,a+w,b,r);
  x.closePath();
}
function contained(x,img,a,b,w,h){
  if(!img)return;
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const s=Math.min(w/iw,h/ih),dw=iw*s,dh=ih*s;
  x.drawImage(img,a+(w-dw)/2,b+(h-dh)/2,dw,dh);
}
function cover(x,img,a,b,w,h){
  if(!img)return;
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const s=Math.max(w/iw,h/ih),sw=w/s,sh=h/s,sx=(iw-sw)/2,sy=(ih-sh)/2;
  x.drawImage(img,sx,sy,sw,sh,a,b,w,h);
}
function outlined(x,text,a,b,fill='#111',stroke='#fff',lw=5){
  x.lineJoin='round';x.miterLimit=2;x.lineWidth=lw;x.strokeStyle=stroke;x.strokeText(text,a,b);x.fillStyle=fill;x.fillText(text,a,b);
}
function fit(x,text,maxW,max=39,min=22){
  for(let s=max;s>=min;s--){
    x.font='900 '+s+'px Arial,Helvetica,sans-serif';
    if(x.measureText(text).width<=maxW)return s;
  }
  return min;
}
function wrap(x,text,maxW,maxLines=2){
  const words=String(text||'').trim().split(/\s+/).filter(Boolean),lines=[];
  let line='';
  for(const word of words){
    const t=line?line+' '+word:word;
    if(x.measureText(t).width<=maxW||!line)line=t;
    else{
      lines.push(line);line=word;
      if(lines.length===maxLines-1)break;
    }
  }
  if(line&&lines.length<maxLines)lines.push(line);
  return lines.length?lines:['JUGADOR'];
}
function playerFile(){
  const p=$('[data-v64-photo]')?.files?.[0]||null;
  const d=$('[data-v64-doc]')?.files?.[0]||null;
  if(!p)return null;
  const n=String(p.name||'').toLowerCase();
  const bad=/(^|[^a-z])(ine|curp|credencial|documento|identificacion|identificación)([^a-z]|$)/i.test(n);
  const same=!!d&&p.name===d.name&&p.size===d.size&&p.lastModified===d.lastModified;
  return bad||same?null:p;
}
async function playerImage(){
  const f=playerFile();if(!f)return null;
  const u=URL.createObjectURL(f);
  try{return await loadImage(u)}finally{URL.revokeObjectURL(u)}
}
function teamLogoUrl(team){
  try{
    const u=window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||'';
    if(u)return /^https?:/i.test(u)?u:new URL(String(u).replace(/^\.\//,''),location.href).href;
  }catch(_){}
  try{
    const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
    const hit=Object.entries(db.team_logos||{}).find(([n])=>norm(n)===norm(team));
    if(hit){
      const v=hit[1],p=typeof v==='string'?v:(v?.local||v?.source||'');
      if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
    }
  }catch(_){}
  return '';
}
async function transparentTeam(src){
  const im=await loadImage(src);if(!im)return null;
  const iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
  const max=360,s=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*s)),h=Math.max(1,Math.round(ih*s));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const q=cv.getContext('2d',{willReadFrequently:true});q.drawImage(im,0,0,w,h);
  let id;try{id=q.getImageData(0,0,w,h)}catch(_){return im}
  const d=id.data,c=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]];
  let r=0,g=0,b=0,a=0;
  c.forEach(([xx,yy])=>{const k=(yy*w+xx)*4;r+=d[k];g+=d[k+1];b+=d[k+2];a+=d[k+3]});
  r/=4;g/=4;b/=4;a/=4;
  if(a<20)return cv;
  const tol=50*50,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
  let head=0,tail=0;
  const near=i=>{const k=i*4,dr=d[k]-r,dg=d[k+1]-g,db=d[k+2]-b;return d[k+3]>0&&dr*dr+dg*dg+db*db<=tol};
  const push=i=>{if(i<0||i>=w*h||seen[i]||!near(i))return;seen[i]=1;queue[tail++]=i};
  for(let xx=0;xx<w;xx++){push(xx);push((h-1)*w+xx)}
  for(let yy=0;yy<h;yy++){push(yy*w);push(yy*w+w-1)}
  while(head<tail){
    const i=queue[head++],xx=i%w,yy=(i/w)|0;
    if(xx)push(i-1);if(xx<w-1)push(i+1);if(yy)push(i-w);if(yy<h-1)push(i+w);
  }
  for(let i=0;i<w*h;i++)if(seen[i])d[i*4+3]=0;
  q.putImageData(id,0,0);
  return cv;
}

async function makeCanvas(){
  const cv=document.createElement('canvas');
  cv.width=1011;cv.height=638;
  const x=cv.getContext('2d'),W=cv.width,H=cv.height;

  const name=($('[data-v64-cred-name]')?.value||'JUGADOR').trim().toUpperCase();
  const team=($('[data-v64-cred-team]')?.value||'EQUIPO').trim().toUpperCase();
  const teamSel=$('[data-v64-cred-team]');
  const cat=(teamSel?.selectedOptions?.[0]?.dataset?.category||$('[data-v64-cred-cat]')?.value||'Por confirmar').replace(/^Categoria:?\s*/i,'');
  const curp=String($('[data-v64-cred-curp]')?.value||'POR CAPTURAR').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18)||'POR CAPTURAR';

  x.clearRect(0,0,W,H);
  x.save();
  roundRect(x,5,5,W-10,H-10,34);
  x.clip();

  /* Diseño físico rojo limpio. SIN líneas blancas, SIN rayas diagonales. */
  x.fillStyle='#d83f60';x.fillRect(0,0,W,H);
  x.fillStyle='#0a8049';x.fillRect(0,0,W,126);

  x.strokeStyle='#15171b';x.lineWidth=5;roundRect(x,8,8,W-16,H-16,31);x.stroke();
  x.strokeStyle='#8b203d';x.lineWidth=3;roundRect(x,17,17,W-34,H-34,26);x.stroke();

  /* V484: imagen suministrada por el usuario, usada directamente. Sin procesamiento. */
  const league=await transparentLeagueLogo(LEAGUE_LOGO);
  if(league)x.drawImage(league,20,12,180,147);

  x.textAlign='center';x.textBaseline='alphabetic';
  x.fillStyle='#fff';x.font='900 31px Arial,Helvetica,sans-serif';
  x.fillText('LIGA MUNICIPAL DE FUTBOL JUVENTINO',580,49);
  x.fillText('ROSAS',580,86);
  x.textAlign='left';

  const tlogo=await transparentTeam(teamLogoUrl(team));
  if(tlogo)contained(x,tlogo,830,128,150,150);

  const photo=await playerImage(),cx=205,cy=365,r=131;
  x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();
  x.fillStyle='#93a4ad';x.fillRect(cx-r,cy-r,r*2,r*2);
  if(photo)cover(x,photo,cx-r,cy-r,r*2,r*2);
  else{x.fillStyle='#fff';x.textAlign='center';x.font='900 28px Arial';x.fillText('FOTO',cx,cy+10)}
  x.restore();x.textAlign='left';
  x.beginPath();x.arc(cx,cy,r+5,0,Math.PI*2);x.strokeStyle='#075a37';x.lineWidth=9;x.stroke();
  x.beginPath();x.arc(cx,cy,r+11,0,Math.PI*2);x.strokeStyle='#222';x.lineWidth=3;x.stroke();

  const tx=392,tw=430,fs=fit(x,name,tw,39,24);
  x.font='900 '+fs+'px Arial,Helvetica,sans-serif';
  const lines=wrap(x,name,tw,2),base=292,lh=fs+7;
  lines.forEach((line,i)=>outlined(x,line,tx,base+i*lh,'#111','#fff',6));

  x.font='900 31px Arial,Helvetica,sans-serif';
  outlined(x,'Categoría: '+cat,tx,405,'#111','#fff',5);
  x.font='900 29px Arial,Helvetica,sans-serif';
  outlined(x,'CURP: '+curp,tx,466,'#111','#fff',5);

  const ts=fit(x,team,330,45,25);
  x.font='900 '+ts+'px Arial,Helvetica,sans-serif';
  outlined(x,team,45,592,'#fff','#111',7);

  x.restore();
  return cv;
}

async function render(){
  if(route()!=='credentialBuilder')return;
  const target=$('[data-v196-preview-canvas]');if(!target)return;
  const seq=++render.seq,cv=await makeCanvas();
  if(seq!==render.seq)return;
  target.width=cv.width;target.height=cv.height;
  const q=target.getContext('2d');
  q.clearRect(0,0,target.width,target.height);
  q.drawImage(cv,0,0);
  const h=$('[data-v196-classic-preview] .v196-preview-head b');
  if(h)h.textContent='Vista previa · credencial roja oficial de la Liga';
  const s=$('[data-v100-credential-style]');
  if(s){s.value='red';s.disabled=true}
}
render.seq=0;

function canvasBlob(cv){return new Promise(r=>cv.toBlob(r,'image/png',1))}
function download(b,n){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=n;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);
}
async function png(){
  const b=await canvasBlob(await makeCanvas());
  if(b)download(b,'Credencial_Liga_Juventino.png');
}
async function share(){
  const b=await canvasBlob(await makeCanvas());if(!b)return;
  try{
    const f=new File([b],'Credencial_Liga_Juventino.png',{type:'image/png'});
    if(navigator.canShare?.({files:[f]})){await navigator.share({title:'Credencial Liga Juventino',files:[f]});return}
  }catch(_){}
  download(b,'Credencial_Liga_Juventino.png');
}
async function pdf(){
  const cv=await makeCanvas();
  let JS=window.jspdf?.jsPDF;
  if(!JS){
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    }).catch(()=>{});
    JS=window.jspdf?.jsPDF;
  }
  if(!JS){
    const b=await canvasBlob(cv);
    if(b)download(b,'Credencial_Liga_Juventino.png');
    return;
  }
  const p=new JS({orientation:'landscape',unit:'mm',format:[85.60,53.98]});
  p.addImage(cv.toDataURL('image/png'),'PNG',0,0,85.60,53.98,undefined,'FAST');
  p.save('Credencial_Liga_Juventino_tamano_INE.pdf');
}

function schedule(){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(render,80);
  setTimeout(render,280);
}
document.addEventListener('input',e=>{
  if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.closest('#screen'))schedule();
},false);
document.addEventListener('change',e=>{
  if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.closest('#screen'))schedule();
},false);
document.addEventListener('click',e=>{
  if(route()!=='credentialBuilder'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v100-credential-png],[data-v64-download-credential-png],[data-v100-credential-pdf],[data-v64-print-credential],[data-v100-credential-share]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(b.matches('[data-v100-credential-pdf],[data-v64-print-credential]'))pdf();
  else if(b.matches('[data-v100-credential-share]'))share();
  else png();
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
const screen=$('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
setTimeout(schedule,0);
setTimeout(schedule,900);
setTimeout(schedule,2200);

window.LJR_V480={build:BUILD,render,makeCanvas,png,pdf,share};
})();