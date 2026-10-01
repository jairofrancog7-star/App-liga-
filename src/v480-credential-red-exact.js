/* V480 — credencial roja oficial hard override.
   El logo de la Liga se usa EXACTAMENTE como el archivo original:
   sin quitar fondo, sin recortar, sin recolorear y sin reconstruir. */
(function(){
'use strict';
if(window.__LJR_V480_CREDENTIAL__)return;
window.__LJR_V480_CREDENTIAL__=true;

const BUILD='20261001-v480-exact-red-credential';
const LEAGUE_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
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

  /* Logo de la Liga ORIGINAL, sin procesamiento. */
  const league=await loadImage(LEAGUE_LOGO);
  if(league)contained(x,league,20,12,180,150);

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