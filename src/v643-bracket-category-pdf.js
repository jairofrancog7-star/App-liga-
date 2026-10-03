/* V643 — Generador de Cuadro Final por categoría + PNG/PDF.
   Mantiene la ruta #/bracketBuilder, filtra equipos oficiales por categoría,
   reutiliza logos reales y exporta el cuadro con el lenguaje visual de Competición/Simulador. */
(function(){
'use strict';
if(window.__LJR_V647_BRACKET_EXPORT__)return;
window.__LJR_V647_BRACKET_EXPORT__=true;

const BUILD='20261003-v647-bracket-hd-stages-no-duplicates';
const CATS=[
  {id:'3',name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
  {id:'5',name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
  {id:'4',name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
  {id:'2',name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
  {id:'1',name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
];
const LEAGUE_LOGO='./assets/liga-logo.webp';
const TROPHY='./assets/reference/final-trophy-drive.png';
const TROPHY_FALLBACK='./final-trophy-drive.png';
const STAGES={quarter:{name:'Cuartos de final',slots:8},semi:{name:'Semifinales',slots:4},final:{name:'Final',slots:2}};
const imgCache=new Map();
let mountTimer=0,previewTimer=0,previewToken=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const catMeta=id=>CATS.find(x=>x.id===String(id))||CATS[0];
const data=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};

function injectCss(){
  if(document.getElementById('v643-bracket-style'))return;
  const s=document.createElement('style');
  s.id='v643-bracket-style';
  s.textContent=[
    'body[data-app-route="bracketBuilder"] #screen{background:#03065b!important;}',
    'body[data-app-route="bracketBuilder"] .v64-page[data-v643="1"]{padding:16px 14px calc(118px + env(safe-area-inset-bottom))!important;background:linear-gradient(180deg,#07106d 0,#03065b 38%,#020451 100%)!important;min-height:100%!important;color:#fff!important;}',
    '.v643-head{position:relative;overflow:hidden;border:1px solid rgba(75,112,255,.55);border-radius:22px;padding:16px;background:radial-gradient(280px 180px at 82% 20%,rgba(25,225,242,.18),transparent 68%),linear-gradient(145deg,#101c8c,#070c67 55%,#051158);box-shadow:0 18px 42px rgba(0,0,35,.25),inset 0 0 0 1px rgba(255,255,255,.04);}',
    '.v643-head:after{content:"";position:absolute;right:-28px;top:-48px;width:180px;height:180px;border-radius:50%;border:28px solid rgba(27,224,245,.06);pointer-events:none;}',
    '.v643-brand{display:flex;align-items:center;gap:11px;position:relative;z-index:1}.v643-brand img{width:54px;height:54px;object-fit:contain;filter:drop-shadow(0 6px 10px rgba(0,0,0,.25));}.v643-brand small{display:block;color:#42e7f4;font-size:11px;font-weight:900;letter-spacing:.08em}.v643-brand h1{margin:3px 0 0;font-size:25px;line-height:1.02;letter-spacing:-.03em}.v643-head p{position:relative;z-index:1;margin:9px 0 0;color:#c7d0ff;font-size:12.5px;line-height:1.4;max-width:38rem;}',
    '.v643-cat-card{margin-top:12px;display:grid;grid-template-columns:54px minmax(0,1fr);gap:10px;align-items:center;background:#0b1175;border:1px solid rgba(74,100,255,.6);border-radius:18px;padding:10px;box-shadow:inset 0 0 20px rgba(25,225,242,.035)}',
    '.v643-cat-logo{width:54px;height:54px;border-radius:16px;background:#080d66;border:1px solid rgba(79,112,255,.58);display:grid;place-items:center}.v643-cat-logo img{width:46px;height:46px;object-fit:contain}.v643-cat-fields label{display:block;color:#58e8f4;font-size:10px;font-weight:900;letter-spacing:.08em;margin:0 0 6px 2px}.v643-cat-fields select{width:100%;height:46px;border:1px solid #3546ba;border-radius:14px;background:#101474;color:#fff;padding:0 40px 0 13px;font-weight:850;font-size:14px;outline:none;}',
    '.v643-top-actions{display:flex;gap:8px;margin-top:10px}.v643-soft-btn{height:40px;border:1px solid #3754d8;border-radius:12px;background:#101b8b;color:#fff;padding:0 13px;font-weight:850;font-size:12px}.v643-soft-btn:active{transform:translateY(1px)}',
    '.v643-section-title{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:17px 2px 9px}.v643-section-title span small{display:block;color:#42e7f4;font-size:10px;font-weight:900;letter-spacing:.08em}.v643-section-title span b{display:block;margin-top:2px;font-size:17px}.v643-section-title em{font-style:normal;color:#a9b3e3;font-size:10px;text-align:right}',
    '.v643-slots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v643-slot{min-width:0;background:#0d1174;border:1px solid #2a3bb6;border-radius:16px;padding:9px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02)}.v643-slot-top{display:flex;align-items:center;gap:7px;margin-bottom:7px}.v643-slot-num{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#174dff;border:1px solid #4d79ff;color:#fff;font-weight:950;font-size:12px;box-shadow:0 0 13px rgba(25,225,242,.14)}.v643-slot-top b{font-size:12px}.v643-slot-pick{display:grid;grid-template-columns:38px minmax(0,1fr);gap:7px;align-items:center}.v643-team-logo{width:38px;height:38px;border-radius:11px;background:#070b5d;border:1px solid rgba(82,106,217,.7);display:grid;place-items:center;overflow:hidden}.v643-team-logo img{width:32px;height:32px;object-fit:contain}.v643-slot select{min-width:0;width:100%;height:40px;border:1px solid #2937a0;border-radius:11px;background:#111571;color:#fff;padding:0 28px 0 9px;font-size:11px;font-weight:800;outline:none;text-overflow:ellipsis;}',
    '.v643-preview-card{margin-top:16px;border:1px solid rgba(54,80,210,.75);border-radius:19px;background:#05095e;padding:8px;overflow:hidden;box-shadow:0 18px 44px rgba(0,0,30,.22)}.v643-preview-card canvas{display:block;width:100%;height:auto;border-radius:13px;background:#07105d}.v643-preview-note{display:flex;justify-content:space-between;gap:8px;padding:8px 4px 2px;color:#9eabe2;font-size:10px}.v643-preview-note b{color:#48e7f2}',
    '.v643-export{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.v643-export button{min-height:50px;border-radius:15px;border:1px solid #4676ff;background:linear-gradient(180deg,#1b5bff,#1741bd);color:#fff;font-size:13px;font-weight:950;box-shadow:0 8px 20px rgba(7,35,150,.3)}.v643-export button[data-v643-pdf]{background:linear-gradient(180deg,#13b7d7,#0b72c9);border-color:#32d8ef}.v643-status{min-height:18px;margin:7px 3px 0;color:#79eaf4;font-size:10.5px;font-weight:750}',
    '@media(max-width:360px){.v643-slots{grid-template-columns:1fr}.v643-export{grid-template-columns:1fr}.v643-brand h1{font-size:22px}}'
  ].join('\n');
  document.head.appendChild(s);
}

async function ensureData(){
  try{await window.V66_OFFICIAL_DIRECTORY?.load?.()}catch(_){}
}

function teamLogo(name){
  name=String(name||'').trim();
  if(!name)return LEAGUE_LOGO;
  try{
    const x=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'';
    if(x)return x;
  }catch(_){}
  const d=data();
  const hit=Object.entries(d?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  if(typeof hit==='string'&&hit)return hit;
  if(hit&&typeof hit==='object'){
    const p=hit.local||hit.source||hit.app||'';
    if(p)return p;
  }
  return LEAGUE_LOGO;
}

function collectTeams(cat){
  const id=String(cat),names=[],seen=new Set();
  const add=v=>{
    const name=String(v||'').trim();
    const k=norm(name);
    if(!name||!k||seen.has(k))return;
    seen.add(k);names.push(name);
  };
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[];
    list.filter(t=>String(t?.cat||'')===id).forEach(t=>add(t?.name));
  }catch(_){}
  const c=data()?.categories?.[id]||{};
  Object.keys(c?.rosters||{}).forEach(add);
  (c?.teams||[]).forEach(t=>add(typeof t==='string'?t:t?.name));
  (c?.standings?.[0]?.rows||[]).forEach(r=>add(Array.isArray(r)?r[1]:r?.team||r?.name));
  (c?.fixtures||[]).forEach(g=>(g?.rows||[]).forEach(r=>{
    if(Array.isArray(r)){add(r[2]);add(r[6])}
    else{add(r?.home);add(r?.away)}
  }));
  return names.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}

function rankedTeams(cat){
  const rows=data()?.categories?.[String(cat)]?.standings?.[0]?.rows||[];
  const out=[],seen=new Set();
  rows.forEach(r=>{
    const n=String(Array.isArray(r)?r[1]:(r?.team||r?.name||'')).trim();
    const k=norm(n);
    if(n&&k&&!seen.has(k)){seen.add(k);out.push(n)}
  });
  return out.slice(0,8);
}

function currentCategory(){
  const saved=String(localStorage.getItem('v643-bracket-cat')||localStorage.getItem('v62-category')||localStorage.getItem('v12-fixture-cat')||'3');
  return CATS.some(c=>c.id===saved)?saved:'3';
}

function optionHtml(list,value){
  const selected=String(value||'');
  return '<option value="">Por confirmar</option>'+list.map(n=>'<option value="'+esc(n)+'" '+(n===selected?'selected':'')+'>'+esc(n)+'</option>').join('');
}

function slotValues(page){
  return [...page.querySelectorAll('[data-v643-place]')].map(s=>String(s.value||'').trim());
}

function setStatus(page,msg,bad){
  const el=page.querySelector('[data-v643-status]');
  if(!el)return;
  el.textContent=msg||'';
  el.style.color=bad?'#ffb7c8':'#79eaf4';
}

function updateSlotLogo(select){
  const box=select.closest('.v643-slot')?.querySelector('.v643-team-logo img');
  if(box)box.src=teamLogo(select.value);
}

function v647SyncNoDuplicates(page,changed){
  const sels=[...page.querySelectorAll('[data-v64-place],[data-v643-place]')];
  if(changed&&changed.value){
    const k=norm(changed.value);
    const dup=sels.find(s=>s!==changed&&s.value&&norm(s.value)===k);
    if(dup){
      const name=changed.value;
      changed.value='';
      updateSlotLogo(changed);
      setStatus(page,name+' ya está seleccionado. Un equipo no puede jugar contra sí mismo ni repetirse.',true);
    }
  }
  const active=sels.map(s=>String(s.value||'').trim()).filter(Boolean);
  sels.forEach(sel=>[...sel.options].forEach(opt=>{
    if(!opt.value){opt.disabled=false;return}
    opt.disabled=active.some(v=>norm(v)===norm(opt.value))&&norm(sel.value)!==norm(opt.value);
  }));
}

function renderSlots(page,cat,keep){
  const host=page.querySelector('[data-v643-slots]');
  if(!host)return;
  const previous=keep?slotValues(page):[];
  const teams=collectTeams(cat);
  host.innerHTML=Array.from({length:8},(_,i)=>{
    const val=teams.includes(previous[i])?previous[i]:'';
    return '<div class="v643-slot">'+
      '<div class="v643-slot-top"><span class="v643-slot-num">'+(i+1)+'</span><b>Lugar '+(i+1)+'</b></div>'+
      '<div class="v643-slot-pick"><span class="v643-team-logo"><img src="'+esc(teamLogo(val))+'" alt=""></span>'+
      '<select data-v643-place="'+(i+1)+'" aria-label="Lugar '+(i+1)+'">'+optionHtml(teams,val)+'</select></div>'+
    '</div>';
  }).join('');
  host.querySelectorAll('[data-v643-place]').forEach(sel=>sel.addEventListener('change',()=>{
    updateSlotLogo(sel);
    v647SyncNoDuplicates(page,sel);
    queuePreview(page);
  }));
  v647SyncNoDuplicates(page);
  setStatus(page,teams.length?teams.length+' equipos disponibles en '+catMeta(cat).name+'.':'Aún no hay equipos cargados para esta categoría.',!teams.length);
}

function rr(ctx,x,y,w,h,r){
  r=Math.max(0,Math.min(r,Math.min(w,h)/2));
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function fillR(ctx,x,y,w,h,r,fill,stroke){
  rr(ctx,x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}
}
function imageLoad(src){
  src=String(src||'');
  if(!src)return Promise.resolve(null);
  if(imgCache.has(src))return imgCache.get(src);
  const p=new Promise(resolve=>{
    const im=new Image();
    im.crossOrigin='anonymous';
    im.decoding='async';
    im.onload=()=>resolve(im);
    im.onerror=()=>resolve(null);
    im.src=src;
  });
  imgCache.set(src,p);
  return p;
}
function drawContain(ctx,im,x,y,w,h){
  if(!im||!im.naturalWidth||!im.naturalHeight)return;
  const s=Math.min(w/im.naturalWidth,h/im.naturalHeight);
  const dw=im.naturalWidth*s,dh=im.naturalHeight*s;
  ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function fitFont(ctx,text,maxW,start,min,weight){
  let size=start;
  do{ctx.font=(weight||800)+' '+size+'px Arial,Helvetica,sans-serif';if(ctx.measureText(text).width<=maxW)break;size-=1}while(size>min);
  return size;
}
function pairConnector(ctx,leftX,yA,yB,rightX,targetY,midX){
  ctx.save();
  ctx.strokeStyle='#28e4f0';ctx.lineWidth=4;ctx.lineJoin='round';ctx.lineCap='round';
  ctx.shadowColor='rgba(40,228,240,.6)';ctx.shadowBlur=10;
  ctx.beginPath();
  ctx.moveTo(leftX,yA);ctx.lineTo(midX,yA);
  ctx.moveTo(leftX,yB);ctx.lineTo(midX,yB);
  ctx.moveTo(midX,yA);ctx.lineTo(midX,yB);
  ctx.moveTo(midX,targetY);ctx.lineTo(rightX,targetY);
  ctx.stroke();
  ctx.restore();
}
async function drawTeam(ctx,num,name,x,y,w,h){
  const logo=await imageLoad(teamLogo(name));
  fillR(ctx,x,y,w,h,13,'rgba(18,24,132,.98)','rgba(76,102,225,.8)');
  const box=Math.min(34,h-8),by=y+(h-box)/2;
  fillR(ctx,x+10,by,box,box,9,'#080d62','rgba(60,90,220,.65)');
  if(logo)drawContain(ctx,logo,x+14,by+4,box-8,box-8);
  const tx=x+54;
  ctx.fillStyle='#49e8f3';ctx.font='900 13px Arial';ctx.fillText(String(num),tx,y+17);
  const label=name||'Por confirmar';
  ctx.fillStyle='#fff';fitFont(ctx,label,w-76,18,11,900);ctx.fillText(label,tx,y+h-9);
}

async function drawBracket(canvas,page){
  const ctx=canvas.getContext('2d');
  const W=1684,H=1190;
  canvas.width=W;canvas.height=H;
  const cat=String(page.querySelector('[data-v643-cat]')?.value||currentCategory());
  const meta=catMeta(cat),teams=slotValues(page);
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#06147c');bg.addColorStop(.45,'#07106b');bg.addColorStop(1,'#02044c');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const glow=ctx.createRadialGradient(1335,535,20,1335,535,560);
  glow.addColorStop(0,'rgba(23,77,255,.48)');glow.addColorStop(.42,'rgba(26,198,240,.12)');glow.addColorStop(1,'rgba(2,4,76,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  ctx.save();ctx.globalAlpha=.08;ctx.strokeStyle='#52e9f4';ctx.lineWidth=2;
  for(let i=-220;i<W+220;i+=110){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i-430,H);ctx.stroke()}
  ctx.restore();

  const league=await imageLoad(LEAGUE_LOGO),catImg=await imageLoad(meta.logo);
  if(league)drawContain(ctx,league,62,48,94,94);
  if(catImg)drawContain(ctx,catImg,1510,48,105,105);

  ctx.fillStyle='#4ee8f3';ctx.font='900 18px Arial';ctx.fillText('LIGA JUVENTINO ROSAS',184,76);
  ctx.fillStyle='#fff';ctx.font='900 48px Arial';ctx.fillText('CUADRO FINAL',184,124);
  ctx.fillStyle='#b9c6ff';ctx.font='800 21px Arial';ctx.fillText(meta.name,184,158);
  ctx.textAlign='right';ctx.fillStyle='#54eaf4';ctx.font='900 16px Arial';ctx.fillText(meta.name.toUpperCase(),1490,88);ctx.textAlign='left';
  ctx.fillStyle='rgba(255,255,255,.13)';ctx.fillRect(62,190,W-124,2);

  const qX=70,qW=560,qH=126;
  const qY=[260,450,640,830];
  const qC=qY.map(y=>y+qH/2);
  const sX=835,sW=330,sH=150,sC=[(qC[0]+qC[1])/2,(qC[2]+qC[3])/2],sY=sC.map(c=>c-sH/2);
  const fX=1330,fW=285,fH=210,fC=(sC[0]+sC[1])/2,fY=fC-fH/2;

  pairConnector(ctx,qX+qW,qC[0],qC[1],sX,sC[0],735);
  pairConnector(ctx,qX+qW,qC[2],qC[3],sX,sC[1],735);
  pairConnector(ctx,sX+sW,sC[0],sC[1],fX,fC,1245);

  const pairs=[[0,7],[3,4],[1,6],[2,5]];
  for(let i=0;i<4;i++){
    fillR(ctx,qX,qY[i],qW,qH,18,'rgba(13,18,119,.98)','rgba(69,94,220,.8)');
    ctx.fillStyle='#55e9f4';ctx.font='900 13px Arial';ctx.fillText('CRUCE '+(i+1),qX+18,qY[i]+22);
    await drawTeam(ctx,pairs[i][0]+1,teams[pairs[i][0]],qX+16,qY[i]+31,qW-32,42);
    await drawTeam(ctx,pairs[i][1]+1,teams[pairs[i][1]],qX+16,qY[i]+78,qW-32,42);
  }

  for(let i=0;i<2;i++){
    const g=ctx.createLinearGradient(sX,sY[i],sX+sW,sY[i]+sH);
    g.addColorStop(0,'#11147d');g.addColorStop(1,'#12219d');
    fillR(ctx,sX,sY[i],sW,sH,22,g,'rgba(70,103,244,.92)');
    ctx.fillStyle='#55e9f4';ctx.font='900 16px Arial';ctx.fillText('SEMIFINAL '+(i+1),sX+24,sY[i]+34);
    ctx.fillStyle='#fff';ctx.font='900 23px Arial';ctx.fillText('GANADORES',sX+24,sY[i]+70);
    ctx.fillStyle='#aebcf2';ctx.font='750 15px Arial';
    ctx.fillText(i===0?'Cruce 1  vs  Cruce 2':'Cruce 3  vs  Cruce 4',sX+24,sY[i]+103);
    fillR(ctx,sX+24,sY[i]+116,sW-48,7,3,'rgba(40,228,240,.28)');
  }

  const fg=ctx.createLinearGradient(fX,fY,fX+fW,fY+fH);
  fg.addColorStop(0,'#174dff');fg.addColorStop(.62,'#0b36c9');fg.addColorStop(1,'#09207f');
  fillR(ctx,fX,fY,fW,fH,24,fg,'rgba(84,233,244,.92)');
  ctx.fillStyle='#72f0f6';ctx.font='900 15px Arial';ctx.fillText('GRAN FINAL',fX+22,fY+32);
  ctx.fillStyle='#fff';ctx.font='900 28px Arial';ctx.fillText('FINAL',fX+22,fY+66);
  ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='750 13px Arial';ctx.fillText('Ganador SF 1 vs Ganador SF 2',fX+22,fY+92);

  let trophy=await imageLoad(TROPHY);
  if(!trophy)trophy=await imageLoad(TROPHY_FALLBACK);
  if(trophy){
    ctx.save();ctx.shadowColor='rgba(77,235,255,.48)';ctx.shadowBlur=26;
    drawContain(ctx,trophy,fX+78,fY+112,136,92);ctx.restore();
  }else{
    ctx.save();ctx.strokeStyle='#c9f8ff';ctx.lineWidth=6;ctx.beginPath();ctx.arc(fX+143,fY+139,38,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(62,1042,W-124,2);
  ctx.fillStyle='#5aeaf4';ctx.font='900 15px Arial';ctx.fillText('CUADRO OFICIAL · '+meta.name.toUpperCase(),62,1082);
  ctx.fillStyle='#aeb8e8';ctx.font='700 13px Arial';ctx.fillText('TORNEO DE COPA · '+new Date().toLocaleDateString('es-MX'),62,1110);
  ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='900 14px Arial';ctx.fillText('LJR',W-66,1082);ctx.textAlign='left';
  return canvas;
}

function queuePreview(page){
  const token=++previewToken;
  clearTimeout(previewTimer);
  previewTimer=setTimeout(async()=>{
    const canvas=page.querySelector('[data-v643-preview]');
    if(!canvas||token!==previewToken)return;
    try{await drawBracket(canvas,page)}catch(e){console.warn('V643 preview',e)}
  },80);
}

function blobFromCanvas(canvas){
  return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('No se pudo crear la imagen')),'image/png'));
}
function download(blob,name){
  const a=document.createElement('a'),u=URL.createObjectURL(blob);
  a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),1500);
}
function slug(v){return norm(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'categoria'}
async function exportPng(page){
  setStatus(page,'Generando PNG con logos y trofeo…');
  try{
    const c=document.createElement('canvas');await drawBracket(c,page);
    const b=await blobFromCanvas(c);
    download(b,'Liga_Juventino_Cuadro_'+slug(catMeta(page.querySelector('[data-v643-cat]').value).name)+'.png');
    setStatus(page,'PNG generado correctamente.');
  }catch(e){setStatus(page,'No se pudo generar el PNG. Intenta nuevamente.',true)}
}
function loadJsPDF(){
  if(window.jspdf?.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((resolve,reject)=>{
    let s=document.querySelector('script[data-v643-jspdf]');
    if(!s){s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';s.async=true;s.dataset.v643Jspdf='1';document.head.appendChild(s)}
    const ok=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('jsPDF no disponible'));
    s.addEventListener('load',ok,{once:true});s.addEventListener('error',reject,{once:true});
    if(window.jspdf?.jsPDF)ok();
  });
}
async function exportPdf(page){
  setStatus(page,'Generando PDF horizontal con logos y trofeo…');
  try{
    const c=document.createElement('canvas');await drawBracket(c,page);
    const JS=await loadJsPDF();
    const pdf=new JS({orientation:'landscape',unit:'mm',format:'a4',compress:true});
    pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,297,210,undefined,'FAST');
    const name='Liga_Juventino_Cuadro_'+slug(catMeta(page.querySelector('[data-v643-cat]').value).name)+'.pdf';
    pdf.save(name);
    setStatus(page,'PDF generado correctamente.');
  }catch(e){console.warn('V643 PDF',e);setStatus(page,'No se pudo generar el PDF. Revisa la conexión e intenta de nuevo.',true)}
}

async function mount(){
  if(route()!=='bracketBuilder')return;
  injectCss();
  const page=document.querySelector('#screen .v64-page');
  if(!page||page.dataset.v643==='1')return;
  await ensureData();
  if(route()!=='bracketBuilder'||!page.isConnected)return;
  const cat=currentCategory(),meta=catMeta(cat);
  page.dataset.v643='1';
  page.innerHTML=
    '<section class="v643-head">'+
      '<div class="v643-brand"><img src="'+esc(LEAGUE_LOGO)+'" alt=""><span><small>LIGA JUVENTINO ROSAS</small><h1>Cuadro final por categoría</h1></span></div>'+
      '<p>Selecciona la categoría y los ocho lugares. El PNG y el PDF incluyen logos de equipos, logo de la Liga, logo de categoría, líneas corregidas y el trofeo de la Final.</p>'+
    '</section>'+
    '<section class="v643-cat-card">'+
      '<span class="v643-cat-logo"><img data-v643-cat-logo src="'+esc(meta.logo)+'" alt=""></span>'+
      '<div class="v643-cat-fields"><label>CATEGORÍA</label><select data-v643-cat>'+CATS.map(c=>'<option value="'+c.id+'" '+(c.id===cat?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'+
    '</section>'+
    '<div class="v643-top-actions"><button type="button" class="v643-soft-btn" data-v643-top8>Cargar Top 8 de clasificación</button><button type="button" class="v643-soft-btn" data-v643-clear>Limpiar</button></div>'+
    '<div class="v643-section-title"><span><small>CLASIFICADOS</small><b>Lugares 1–8</b></span><em>Solo aparecen equipos<br>de la categoría elegida</em></div>'+
    '<section class="v643-slots" data-v643-slots></section>'+
    '<div class="v643-section-title"><span><small>VISTA PREVIA</small><b>Cuadro final</b></span><em>Diseño Competición / Simulador</em></div>'+
    '<section class="v643-preview-card"><canvas data-v643-preview width="1684" height="1190"></canvas><div class="v643-preview-note"><span>Logo Liga + categoría + equipos</span><b>Trofeo de Final</b></div></section>'+
    '<div class="v643-export"><button type="button" data-v643-png>Generar cuadro PNG</button><button type="button" data-v643-pdf>Generar cuadro PDF</button></div>'+
    '<div class="v643-status" data-v643-status aria-live="polite"></div>';

  const catSel=page.querySelector('[data-v643-cat]');
  renderSlots(page,cat,false);
  catSel.addEventListener('change',()=>{
    const id=catSel.value,m=catMeta(id);
    try{localStorage.setItem('v643-bracket-cat',id);localStorage.setItem('v62-category',id)}catch(_){}
    const im=page.querySelector('[data-v643-cat-logo]');if(im)im.src=m.logo;
    renderSlots(page,id,false);queuePreview(page);
  });
  page.querySelector('[data-v643-top8]')?.addEventListener('click',()=>{
    const ranked=rankedTeams(catSel.value);
    if(!ranked.length){setStatus(page,'No hay una clasificación cargada para esta categoría todavía.',true);return}
    const sels=[...page.querySelectorAll('[data-v643-place]')];
    const used=new Set();
    sels.forEach((s,i)=>{
      const v=ranked.find((n,idx)=>idx>=i&&!used.has(norm(n)))||ranked.find(n=>!used.has(norm(n)))||'';
      if(v)used.add(norm(v));
      s.value=v;updateSlotLogo(s);
    });
    v647SyncNoDuplicates(page);
    setStatus(page,'Se cargaron '+used.size+' equipos sin repetir de la clasificación.');
    queuePreview(page);
  });
  page.querySelector('[data-v643-clear]')?.addEventListener('click',()=>{
    page.querySelectorAll('[data-v643-place]').forEach(s=>{s.value='';updateSlotLogo(s)});
    v647SyncNoDuplicates(page);
    setStatus(page,'Selección limpiada.');queuePreview(page);
  });
  page.querySelector('[data-v643-png]')?.addEventListener('click',()=>exportPng(page));
  page.querySelector('[data-v643-pdf]')?.addEventListener('click',()=>exportPdf(page));
  queuePreview(page);
}

function schedule(){clearTimeout(mountTimer);mountTimer=setTimeout(mount,45)}
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.getElementById('screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
injectCss();
schedule();
setTimeout(mount,350);
setTimeout(mount,1000);
})();
