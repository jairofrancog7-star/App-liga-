/* V650 — Bracket profesional estilo FULL BRACKET, adaptativo por número de equipos.
   Automático: 9–16 Octavos · 5–8 Cuartos · 3–4 Semifinales · 2 Final.
   Si faltan equipos para completar la llave, los huecos se muestran como PASE DIRECTO.
   Exporta PNG vertical HD 2700x3376 y PDF A4 vertical. */
(function(){
'use strict';
if(window.__LJR_V650_FULL_BRACKET__)return;
window.__LJR_V650_FULL_BRACKET__=true;

const BUILD='20261003-v650-full-bracket-exact-style';
const CATS=[
  {id:'3',name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
  {id:'5',name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
  {id:'4',name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
  {id:'2',name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
  {id:'1',name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
];
const STAGES={
  r16:{name:'Octavos de final',short:'OCTAVOS DE FINAL',slots:16},
  qf:{name:'Cuartos de final',short:'CUARTOS DE FINAL',slots:8},
  sf:{name:'Semifinales',short:'SEMIFINALES',slots:4},
  final:{name:'Final',short:'GRAN FINAL',slots:2}
};
const LEAGUE_LOGO='./assets/liga-logo.webp';
const TROPHY='./assets/reference/final-trophy-drive.png';
const TROPHY_FALLBACK='./final-trophy-drive.png';
const W=1350,H=1688,SCALE=2;
const imgCache=new Map();
let mountTimer=0,previewTimer=0,previewToken=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const catMeta=id=>CATS.find(x=>x.id===String(id))||CATS[0];
const data=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};

function injectCss(){
  document.getElementById('v643-bracket-style')?.remove();
  document.getElementById('v647-bracket-style')?.remove();
  document.getElementById('v649-bracket-style')?.remove();
  const s=document.createElement('style');
  s.id='v649-bracket-style';
  s.textContent=[
    'body[data-app-route="bracketBuilder"] #screen{background:#02034c!important;}',
    'body[data-app-route="bracketBuilder"] .v64-page[data-v649="1"]{padding:13px 13px calc(116px + env(safe-area-inset-bottom))!important;background:radial-gradient(420px 280px at 50% 0,rgba(32,91,255,.28),transparent 75%),linear-gradient(180deg,#07106b 0,#030452 44%,#010238 100%)!important;min-height:100%!important;color:#fff!important;}',
    '.v649-hero{position:relative;overflow:hidden;border:1px solid rgba(69,111,255,.72);border-radius:20px;padding:15px;background:radial-gradient(260px 180px at 86% 18%,rgba(0,232,247,.16),transparent 70%),linear-gradient(145deg,#13249d,#090d70 56%,#06094e);box-shadow:0 18px 42px rgba(0,0,35,.28)}',
    '.v649-hero:before{content:"";position:absolute;inset:auto -32px -62px auto;width:180px;height:180px;border-radius:50%;border:26px solid rgba(65,231,245,.055)}',
    '.v649-brand{display:flex;align-items:center;gap:10px;position:relative;z-index:1}.v649-brand img{width:50px;height:50px;object-fit:contain;filter:drop-shadow(0 5px 10px rgba(0,0,0,.28))}.v649-brand small{display:block;color:#54e8f3;font-size:9.5px;font-weight:950;letter-spacing:.08em}.v649-brand h1{margin:2px 0 0;font-size:23px;line-height:1.04;letter-spacing:-.025em}.v649-hero p{position:relative;z-index:1;margin:8px 0 0;color:#c5cff8;font-size:11.5px;line-height:1.4}',
    '.v649-controls{margin-top:10px;border:1px solid rgba(69,93,213,.75);border-radius:18px;background:#090e70;padding:10px}.v649-catrow{display:grid;grid-template-columns:48px minmax(0,1fr);gap:9px;align-items:center}.v649-catlogo{width:48px;height:48px;border-radius:13px;background:#05095a;border:1px solid #3145b8;display:grid;place-items:center;overflow:hidden}.v649-catlogo img{width:42px;height:42px;object-fit:contain}.v649-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v649-grid label{min-width:0;color:#5beaf4;font-size:9px;font-weight:950;letter-spacing:.07em}.v649-grid select{margin-top:5px;width:100%;height:41px;border:1px solid #3448bd;border-radius:12px;background:#101475;color:#fff;padding:0 26px 0 9px;font-size:11px;font-weight:850;outline:none}',
    '.v649-auto{margin-top:9px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-radius:13px;padding:9px 10px;background:linear-gradient(90deg,rgba(23,77,255,.35),rgba(24,223,240,.08));border:1px solid rgba(61,120,255,.48)}.v649-auto span small{display:block;color:#7aeef6;font-size:8.5px;font-weight:950;letter-spacing:.07em}.v649-auto span b{display:block;margin-top:2px;font-size:12px}.v649-auto em{font-style:normal;color:#b9c4f2;font-size:9px;text-align:right}',
    '.v649-actions{display:flex;gap:8px;margin-top:9px}.v649-soft{height:39px;border:1px solid #3957df;border-radius:12px;background:#111b89;color:#fff;padding:0 12px;font-size:10.5px;font-weight:900}.v649-soft:first-child{background:linear-gradient(180deg,#1c5bff,#173bb8);border-color:#4d7cff}',
    '.v649-title{display:flex;align-items:end;justify-content:space-between;gap:9px;margin:15px 2px 8px}.v649-title small{display:block;color:#50e8f3;font-size:9px;font-weight:950;letter-spacing:.08em}.v649-title b{display:block;margin-top:2px;font-size:16px}.v649-title em{font-style:normal;color:#aab5e6;font-size:9px;text-align:right}',
    '.v649-slots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v649-slot{min-width:0;border:1px solid #2f43ba;border-radius:14px;background:linear-gradient(180deg,#11177d,#0b0f69);padding:8px}.v649-slothead{display:flex;align-items:center;gap:6px;margin-bottom:6px}.v649-seed{width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#174dff;border:1px solid #5e82ff;color:#fff;font-size:10px;font-weight:950}.v649-slothead b{font-size:10.5px}.v649-pick{display:grid;grid-template-columns:34px minmax(0,1fr);gap:6px;align-items:center}.v649-logo{width:34px;height:34px;border-radius:10px;background:#05095a;border:1px solid #3042a9;display:grid;place-items:center;overflow:hidden}.v649-logo img{width:28px;height:28px;object-fit:contain}.v649-slot select{min-width:0;width:100%;height:37px;border:1px solid #2b3aa5;border-radius:10px;background:#10146f;color:#fff;padding:0 24px 0 8px;font-size:10px;font-weight:850;outline:none;text-overflow:ellipsis}.v649-slot select option:disabled{color:#6f79a8}',
    '.v649-preview{margin-top:12px;border:1px solid rgba(54,80,210,.78);border-radius:18px;background:#04075a;padding:7px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,30,.24)}.v649-preview canvas{display:block;width:100%;height:auto;border-radius:12px;background:#04064c}.v649-preview-meta{display:flex;justify-content:space-between;gap:8px;padding:7px 3px 1px;color:#9fa9da;font-size:9px}.v649-preview-meta b{color:#55eaf4}',
    '.v649-export{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.v649-export button{min-height:48px;border-radius:14px;border:1px solid #4a79ff;background:linear-gradient(180deg,#1d5dff,#173db9);color:#fff;font-size:12px;font-weight:950;box-shadow:0 8px 18px rgba(7,35,150,.3)}.v649-export button[data-v649-pdf]{background:linear-gradient(180deg,#13bbd9,#0b72c9);border-color:#34dceb}.v649-status{min-height:18px;margin:6px 3px 0;color:#76eaf4;font-size:9.5px;font-weight:800}',
    '@media(max-width:360px){.v649-grid,.v649-slots,.v649-export{grid-template-columns:1fr}.v649-brand h1{font-size:21px}}'
  ].join('\n');
  document.head.appendChild(s);
}

async function ensureData(){try{await window.V66_OFFICIAL_DIRECTORY?.load?.()}catch(_){}}

function teamLogo(name){
  name=String(name||'').trim();
  if(!name)return '';
  try{
    const x=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'';
    if(x)return x;
  }catch(_){}
  const hit=Object.entries(data()?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  if(typeof hit==='string'&&hit)return hit;
  if(hit&&typeof hit==='object')return hit.local||hit.source||hit.app||'';
  return '';
}

function collectTeams(cat){
  const id=String(cat),out=[],seen=new Set();
  const add=v=>{
    const n=String(v||'').trim(),k=norm(n);
    if(!n||!k||seen.has(k))return;
    seen.add(k);out.push(n);
  };
  try{(window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[]).filter(t=>String(t?.cat||'')===id).forEach(t=>add(t?.name))}catch(_){}
  const c=data()?.categories?.[id]||{};
  Object.keys(c?.rosters||{}).forEach(add);
  (c?.teams||[]).forEach(t=>add(typeof t==='string'?t:t?.name));
  (c?.standings?.[0]?.rows||[]).forEach(r=>add(Array.isArray(r)?r[1]:(r?.team||r?.name)));
  (c?.fixtures||[]).forEach(g=>(g?.rows||[]).forEach(r=>{
    if(Array.isArray(r)){add(r[2]);add(r[6])}
    else{add(r?.home);add(r?.away)}
  }));
  return out.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}

function rankedTeams(cat){
  const rows=data()?.categories?.[String(cat)]?.standings?.[0]?.rows||[],out=[],seen=new Set();
  rows.forEach(r=>{
    const n=String(Array.isArray(r)?r[1]:(r?.team||r?.name||'')).trim(),k=norm(n);
    if(n&&k&&!seen.has(k)){seen.add(k);out.push(n)}
  });
  const all=collectTeams(cat);
  all.forEach(n=>{const k=norm(n);if(!seen.has(k)){seen.add(k);out.push(n)}});
  return out;
}

function autoStageForCount(n){
  n=Number(n)||0;
  if(n>=9)return'r16';
  if(n>=5)return'qf';
  if(n>=3)return'sf';
  return'final';
}
function currentCategory(){
  const v=String(localStorage.getItem('v649-bracket-cat')||localStorage.getItem('v62-category')||'3');
  return CATS.some(c=>c.id===v)?v:'3';
}
function requestedStage(page){
  return String(page?.querySelector('[data-v649-stage]')?.value||localStorage.getItem('v649-bracket-stage')||'auto');
}
function resolvedStage(page){
  const req=requestedStage(page);
  if(STAGES[req])return req;
  const cat=page?.querySelector('[data-v649-cat]')?.value||currentCategory();
  return autoStageForCount(collectTeams(cat).length);
}
function slotValues(page){return[...page.querySelectorAll('[data-v649-place]')].map(s=>String(s.value||'').trim())}
function setStatus(page,msg,bad){
  const el=page.querySelector('[data-v649-status]');if(!el)return;
  el.textContent=msg||'';el.style.color=bad?'#ffb8c9':'#76eaf4';
}
function optionHtml(list,value){
  return '<option value="">Por confirmar / pase directo</option>'+list.map(n=>'<option value="'+esc(n)+'" '+(n===value?'selected':'')+'>'+esc(n)+'</option>').join('');
}
function updateSlotLogo(sel){
  const im=sel.closest('.v649-slot')?.querySelector('.v649-logo img');if(!im)return;
  const src=teamLogo(sel.value);im.src=src||LEAGUE_LOGO;im.style.opacity=src?'1':'.2';
}
function syncNoDuplicates(page,changed){
  const sels=[...page.querySelectorAll('[data-v649-place]')];
  if(changed&&changed.value){
    const key=norm(changed.value);
    const dup=sels.find(s=>s!==changed&&s.value&&norm(s.value)===key);
    if(dup){
      const n=changed.value;changed.value='';updateSlotLogo(changed);
      setStatus(page,n+' ya está seleccionado. Un equipo no puede repetirse.',true);
    }
  }
  const active=sels.map(s=>String(s.value||'').trim()).filter(Boolean);
  sels.forEach(sel=>[...sel.options].forEach(opt=>{
    if(!opt.value){opt.disabled=false;return}
    opt.disabled=active.some(v=>norm(v)===norm(opt.value))&&norm(sel.value)!==norm(opt.value);
  }));
}

function stageInfo(page){
  const cat=page.querySelector('[data-v649-cat]')?.value||currentCategory();
  const count=collectTeams(cat).length,stage=resolvedStage(page),slots=STAGES[stage].slots,byes=Math.max(0,slots-count);
  const auto=page.querySelector('[data-v649-auto]');
  if(auto){
    auto.innerHTML='<span><small>CLASIFICACIÓN AUTOMÁTICA</small><b>'+count+' equipos → '+esc(STAGES[stage].name)+'</b></span>'+
      '<em>'+(byes?byes+' pase'+(byes===1?'':'s')+' directo'+(byes===1?'':'s'):'Llave completa')+'</em>';
  }
  const title=page.querySelector('[data-v649-slot-title]');
  if(title)title.textContent=slots===16?'Semillas 1–16':slots===8?'Semillas 1–8':slots===4?'Semifinalistas 1–4':'Finalistas 1–2';
  const hint=page.querySelector('[data-v649-slot-hint]');
  if(hint)hint.innerHTML=esc(STAGES[stage].name)+'<br>sin equipos repetidos';
  const top=page.querySelector('[data-v649-autofill]');
  if(top)top.textContent='Clasificar '+Math.min(count,slots)+' equipos';
}
function renderSlots(page,keep){
  const cat=page.querySelector('[data-v649-cat]')?.value||currentCategory();
  const teams=collectTeams(cat),stage=resolvedStage(page),count=STAGES[stage].slots;
  const prev=keep?slotValues(page):[],host=page.querySelector('[data-v649-slots]');if(!host)return;
  const used=new Set();
  host.innerHTML=Array.from({length:count},(_,i)=>{
    let val=teams.includes(prev[i])?prev[i]:'';
    if(val&&used.has(norm(val)))val='';
    if(val)used.add(norm(val));
    const src=teamLogo(val);
    return '<div class="v649-slot"><div class="v649-slothead"><span class="v649-seed">'+(i+1)+'</span><b>Semilla '+(i+1)+'</b></div>'+
      '<div class="v649-pick"><span class="v649-logo"><img src="'+esc(src||LEAGUE_LOGO)+'" style="opacity:'+(src?'1':'.2')+'" alt=""></span>'+
      '<select data-v649-place="'+(i+1)+'" aria-label="Semilla '+(i+1)+'">'+optionHtml(teams,val)+'</select></div></div>';
  }).join('');
  host.querySelectorAll('[data-v649-place]').forEach(sel=>sel.addEventListener('change',()=>{updateSlotLogo(sel);syncNoDuplicates(page,sel);queuePreview(page)}));
  syncNoDuplicates(page);stageInfo(page);
}
function autoFill(page){
  const cat=page.querySelector('[data-v649-cat]')?.value||currentCategory(),ranked=rankedTeams(cat);
  const sels=[...page.querySelectorAll('[data-v649-place]')],used=new Set();
  sels.forEach((s,i)=>{
    const v=ranked.find(n=>!used.has(norm(n)))||'';
    if(v)used.add(norm(v));
    s.value=v;updateSlotLogo(s);
  });
  syncNoDuplicates(page);
  const slots=sels.length,byes=Math.max(0,slots-used.size);
  setStatus(page,'Clasificación cargada: '+used.size+' equipos'+(byes?' · '+byes+' pase'+(byes===1?'':'s')+' directo'+(byes===1?'':'s'):'')+'.');
  queuePreview(page);
}

function rr(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,Math.min(w,h)/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function fillR(ctx,x,y,w,h,r,fill,stroke,lw=2){rr(ctx,x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function imageLoad(src){
  src=String(src||'');if(!src)return Promise.resolve(null);if(imgCache.has(src))return imgCache.get(src);
  const p=new Promise(resolve=>{const im=new Image();im.crossOrigin='anonymous';im.decoding='async';im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src});
  imgCache.set(src,p);return p;
}
function drawContain(ctx,im,x,y,w,h){if(!im||!im.naturalWidth||!im.naturalHeight)return;const s=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*s,dh=im.naturalHeight*s;ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function fitFont(ctx,text,maxW,start,min,weight=900){let size=start;do{ctx.font=weight+' '+size+'px Arial,Helvetica,sans-serif';if(ctx.measureText(text).width<=maxW)break;size--}while(size>min);return size}
function line(ctx,x1,y1,x2,y2){
  ctx.save();ctx.strokeStyle='#35e2ef';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='rgba(53,226,239,.58)';ctx.shadowBlur=9;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
}
function pairJoin(ctx,x,y1,y2,outX,outY,side){
  const mid=side==='left'?x+32:x-32;
  ctx.save();ctx.strokeStyle='#35e2ef';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='rgba(53,226,239,.55)';ctx.shadowBlur=9;
  ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(mid,y1);ctx.moveTo(x,y2);ctx.lineTo(mid,y2);ctx.moveTo(mid,y1);ctx.lineTo(mid,y2);ctx.moveTo(mid,outY);ctx.lineTo(outX,outY);ctx.stroke();ctx.restore();
}
async function trophy(ctx,x,y,w,h){
  let im=await imageLoad(TROPHY);if(!im)im=await imageLoad(TROPHY_FALLBACK);
  if(im){ctx.save();ctx.shadowColor='rgba(54,226,255,.72)';ctx.shadowBlur=30;drawContain(ctx,im,x,y,w,h);ctx.restore()}
}
function background(ctx){
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#06135f');bg.addColorStop(.42,'#030747');bg.addColorStop(1,'#01011d');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  const glow=ctx.createRadialGradient(W/2,H*.51,30,W/2,H*.51,650);
  glow.addColorStop(0,'rgba(21,66,255,.27)');
  glow.addColorStop(.5,'rgba(4,26,118,.10)');
  glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.globalAlpha=.065;
  ctx.strokeStyle='#1e43c7';
  ctx.lineWidth=2;
  for(let x=-100;x<W+100;x+=140){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-340,H);ctx.stroke()}
  ctx.restore();

  const edge=ctx.createLinearGradient(0,0,0,H);
  edge.addColorStop(0,'#ff741b');edge.addColorStop(.35,'#22dbf0');edge.addColorStop(.72,'#22dbf0');edge.addColorStop(1,'#ff741b');
  ctx.fillStyle=edge;ctx.fillRect(8,0,5,H);ctx.fillRect(W-13,0,5,H);

  ctx.save();
  ctx.globalAlpha=.09;ctx.strokeStyle='#2140b4';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(W/2,H*.56,375,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(W/2,H*.56,270,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}
async function header(ctx,meta,stage){
  const league=await imageLoad(LEAGUE_LOGO),cat=await imageLoad(meta.logo);
  if(league)drawContain(ctx,league,46,40,78,78);
  if(cat)drawContain(ctx,cat,W-124,40,78,78);

  ctx.textAlign='center';
  ctx.fillStyle='#dbe5ff';ctx.font='900 19px Arial';
  ctx.fillText('TORNEO DE COPA · '+meta.name.toUpperCase(),W/2,58);

  ctx.fillStyle='#fff';ctx.font='900 58px Arial';
  ctx.fillText('CUADRO',W/2-118,132);
  ctx.fillStyle='#24def1';ctx.font='900 58px Arial';
  ctx.fillText('COMPLETO',W/2+168,132);

  ctx.fillStyle='#a9b6ea';ctx.font='800 17px Arial';
  ctx.fillText(STAGES[stage].short,W/2,168);
  ctx.textAlign='left';
}
function neonPath(ctx,points){
  ctx.save();
  ctx.strokeStyle='#39e1ee';
  ctx.lineWidth=4;
  ctx.lineCap='round';
  ctx.lineJoin='round';
  ctx.shadowColor='rgba(57,225,238,.7)';
  ctx.shadowBlur=10;
  ctx.beginPath();
  points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
  ctx.stroke();
  ctx.restore();
}
async function teamCard(ctx,seed,name,x,y,w,h,side){
  const grad=ctx.createLinearGradient(x,y,x+w,y);
  if(side==='right'){
    grad.addColorStop(0,'#07104d');grad.addColorStop(.68,'#091f8e');grad.addColorStop(1,'#123cff');
  }else{
    grad.addColorStop(0,'#123cff');grad.addColorStop(.32,'#091f8e');grad.addColorStop(1,'#07104d');
  }
  fillR(ctx,x,y,w,h,11,grad,'rgba(53,97,255,.92)',2);

  const label=name||'PASE DIRECTO';
  const logo=await imageLoad(teamLogo(name));
  const box=h-16;
  const bx=side==='right'?x+w-box-8:x+8;
  if(name){
    fillR(ctx,bx,y+8,box,box,9,'#050938','rgba(72,102,223,.75)',1.5);
    if(logo)drawContain(ctx,logo,bx+5,y+13,box-10,box-10);
  }else{
    ctx.save();ctx.globalAlpha=.65;
    fillR(ctx,bx,y+8,box,box,9,'#060937','rgba(63,98,210,.55)',1.5);
    ctx.restore();
  }

  const tx=side==='right'?x+14:x+box+22;
  const max=w-box-40;
  ctx.fillStyle=name?'#fff':'#54e8f3';
  fitFont(ctx,label,max,19,11,900);
  ctx.fillText(label,tx,y+h/2+8);

  ctx.fillStyle='#69edf5';ctx.font='900 10px Arial';
  if(side==='right'){
    ctx.textAlign='right';ctx.fillText(String(seed),x+w-box-15,y+17);ctx.textAlign='left';
  }else{
    ctx.fillText(String(seed),tx,y+17);
  }
}
function stageCard(ctx,x,y,w,h,title,rows){
  const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,'#0f3dff');g.addColorStop(.42,'#0a2396');g.addColorStop(1,'#050a49');
  fillR(ctx,x,y,w,h,13,g,'rgba(48,94,255,.9)',2);

  ctx.fillStyle='#5deaf4';ctx.font='900 10px Arial';
  ctx.fillText(title,x+14,y+20);

  const usable=h-34;
  const rh=usable/rows.length;
  rows.forEach((r,i)=>{
    const yy=y+30+i*rh;
    if(i>0){
      ctx.fillStyle='rgba(255,118,36,.76)';
      ctx.fillRect(x+12,yy-2,w-24,2);
    }
    ctx.fillStyle='#fff';ctx.font='900 14px Arial';
    ctx.fillText(r,x+14,yy+rh*.58);
  });
}
async function finalPillar(ctx,x,y,w,h){
  const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,'rgba(17,70,255,.95)');
  g.addColorStop(.35,'rgba(8,26,112,.98)');
  g.addColorStop(1,'rgba(3,7,48,.98)');
  fillR(ctx,x,y,w,h,36,g,'rgba(41,75,185,.72)',2);

  const glow=ctx.createRadialGradient(x+w/2,y+h*.53,20,x+w/2,y+h*.53,w*.72);
  glow.addColorStop(0,'rgba(38,107,255,.42)');glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(x-30,y+80,w+60,h-120);

  ctx.textAlign='center';
  ctx.fillStyle='#5deaf4';ctx.font='900 11px Arial';ctx.fillText('GRAN FINAL',x+w/2,y+42);
  ctx.fillStyle='#fff';ctx.font='900 20px Arial';ctx.fillText('TORNEO DE COPA',x+w/2,y+70);
  ctx.textAlign='left';
  await trophy(ctx,x+w*.19,y+h*.28,w*.62,h*.45);
}

const SEED16=[[1,16],[8,9],[4,13],[5,12],[2,15],[7,10],[3,14],[6,11]];
const SEED8=[[1,8],[4,5],[2,7],[3,6]];
function teamAt(teams,seed){return teams[seed-1]||''}

async function drawR16(ctx,teams){
  const outerW=250,outerH=58,lx=34,rx=W-34-outerW;
  const top=286,gap=62,groupGap=40;
  const leftPairs=SEED16.slice(0,4),rightPairs=SEED16.slice(4);
  const leftCenters=[],rightCenters=[];

  for(let i=0;i<4;i++){
    const gy=top+i*(gap*2+groupGap);
    const p=leftPairs[i];
    await teamCard(ctx,p[0],teamAt(teams,p[0]),lx,gy,outerW,outerH,'left');
    await teamCard(ctx,p[1],teamAt(teams,p[1]),lx,gy+gap,outerW,outerH,'left');
    leftCenters.push(gy+gap/2+outerH/2);
    const midx=lx+outerW+28;
    neonPath(ctx,[[lx+outerW,gy+outerH/2],[midx,gy+outerH/2],[midx,gy+gap+outerH/2],[lx+outerW,gy+gap+outerH/2]]);
  }
  for(let i=0;i<4;i++){
    const gy=top+i*(gap*2+groupGap);
    const p=rightPairs[i];
    await teamCard(ctx,p[0],teamAt(teams,p[0]),rx,gy,outerW,outerH,'right');
    await teamCard(ctx,p[1],teamAt(teams,p[1]),rx,gy+gap,outerW,outerH,'right');
    rightCenters.push(gy+gap/2+outerH/2);
    const midx=rx-28;
    neonPath(ctx,[[rx,gy+outerH/2],[midx,gy+outerH/2],[midx,gy+gap+outerH/2],[rx,gy+gap+outerH/2]]);
  }

  const qW=174,qH=130,lq=335,rq=W-335-qW,qYs=[390,990];
  stageCard(ctx,lq,qYs[0],qW,qH,'CUARTOS 1',['GANADOR 1','GANADOR 2']);
  stageCard(ctx,lq,qYs[1],qW,qH,'CUARTOS 2',['GANADOR 3','GANADOR 4']);
  stageCard(ctx,rq,qYs[0],qW,qH,'CUARTOS 3',['GANADOR 5','GANADOR 6']);
  stageCard(ctx,rq,qYs[1],qW,qH,'CUARTOS 4',['GANADOR 7','GANADOR 8']);

  neonPath(ctx,[[lx+outerW+28,leftCenters[0]],[lq,qYs[0]+38]]);
  neonPath(ctx,[[lx+outerW+28,leftCenters[1]],[lq,qYs[0]+90]]);
  neonPath(ctx,[[lx+outerW+28,leftCenters[2]],[lq,qYs[1]+38]]);
  neonPath(ctx,[[lx+outerW+28,leftCenters[3]],[lq,qYs[1]+90]]);
  neonPath(ctx,[[rx-28,rightCenters[0]],[rq+qW,qYs[0]+38]]);
  neonPath(ctx,[[rx-28,rightCenters[1]],[rq+qW,qYs[0]+90]]);
  neonPath(ctx,[[rx-28,rightCenters[2]],[rq+qW,qYs[1]+38]]);
  neonPath(ctx,[[rx-28,rightCenters[3]],[rq+qW,qYs[1]+90]]);

  const sW=158,sH=132,sy=695,ls=530,rs=W-530-sW;
  stageCard(ctx,ls,sy,sW,sH,'SEMIFINAL 1',['GANADOR QF1','GANADOR QF2']);
  stageCard(ctx,rs,sy,sW,sH,'SEMIFINAL 2',['GANADOR QF3','GANADOR QF4']);

  neonPath(ctx,[[lq+qW,qYs[0]+qH/2],[ls,sy+42]]);
  neonPath(ctx,[[lq+qW,qYs[1]+qH/2],[ls,sy+92]]);
  neonPath(ctx,[[rq,qYs[0]+qH/2],[rs+sW,sy+42]]);
  neonPath(ctx,[[rq,qYs[1]+qH/2],[rs+sW,sy+92]]);

  const fw=176,fh=420,fx=W/2-fw/2,fy=505;
  await finalPillar(ctx,fx,fy,fw,fh);
  neonPath(ctx,[[ls+sW,sy+sH/2],[fx,sy+sH/2]]);
  neonPath(ctx,[[rs,sy+sH/2],[fx+fw,sy+sH/2]]);
}
async function drawQF(ctx,teams){
  const outerW=300,outerH=76,lx=38,rx=W-38-outerW;
  const top1=342,top2=434,bottom1=1042,bottom2=1134;

  await teamCard(ctx,1,teamAt(teams,1),lx,top1,outerW,outerH,'left');
  await teamCard(ctx,8,teamAt(teams,8),lx,top2,outerW,outerH,'left');
  await teamCard(ctx,4,teamAt(teams,4),lx,bottom1,outerW,outerH,'left');
  await teamCard(ctx,5,teamAt(teams,5),lx,bottom2,outerW,outerH,'left');

  await teamCard(ctx,2,teamAt(teams,2),rx,top1,outerW,outerH,'right');
  await teamCard(ctx,7,teamAt(teams,7),rx,top2,outerW,outerH,'right');
  await teamCard(ctx,3,teamAt(teams,3),rx,bottom1,outerW,outerH,'right');
  await teamCard(ctx,6,teamAt(teams,6),rx,bottom2,outerW,outerH,'right');

  const lJoin=lx+outerW+32,rJoin=rx-32;
  neonPath(ctx,[[lx+outerW,top1+outerH/2],[lJoin,top1+outerH/2],[lJoin,top2+outerH/2],[lx+outerW,top2+outerH/2]]);
  neonPath(ctx,[[lx+outerW,bottom1+outerH/2],[lJoin,bottom1+outerH/2],[lJoin,bottom2+outerH/2],[lx+outerW,bottom2+outerH/2]]);
  neonPath(ctx,[[rx,top1+outerH/2],[rJoin,top1+outerH/2],[rJoin,top2+outerH/2],[rx,top2+outerH/2]]);
  neonPath(ctx,[[rx,bottom1+outerH/2],[rJoin,bottom1+outerH/2],[rJoin,bottom2+outerH/2],[rx,bottom2+outerH/2]]);

  const sW=205,sH=150,sy=702,ls=390,rs=W-390-sW;
  stageCard(ctx,ls,sy,sW,sH,'SEMIFINAL 1',['GANADOR CRUCE 1','GANADOR CRUCE 2']);
  stageCard(ctx,rs,sy,sW,sH,'SEMIFINAL 2',['GANADOR CRUCE 3','GANADOR CRUCE 4']);

  neonPath(ctx,[[lJoin,(top1+top2+outerH)/2],[ls,sy+45]]);
  neonPath(ctx,[[lJoin,(bottom1+bottom2+outerH)/2],[ls,sy+104]]);
  neonPath(ctx,[[rJoin,(top1+top2+outerH)/2],[rs+sW,sy+45]]);
  neonPath(ctx,[[rJoin,(bottom1+bottom2+outerH)/2],[rs+sW,sy+104]]);

  const fw=186,fh=470,fx=W/2-fw/2,fy=540;
  await finalPillar(ctx,fx,fy,fw,fh);
  neonPath(ctx,[[ls+sW,sy+sH/2],[fx,sy+sH/2]]);
  neonPath(ctx,[[rs,sy+sH/2],[fx+fw,sy+sH/2]]);
}
async function drawSF(ctx,teams){
  const outerW=330,outerH=88,lx=46,rx=W-46-outerW,y1=610,y2=718;
  await teamCard(ctx,1,teamAt(teams,1),lx,y1,outerW,outerH,'left');
  await teamCard(ctx,4,teamAt(teams,4),lx,y2,outerW,outerH,'left');
  await teamCard(ctx,2,teamAt(teams,2),rx,y1,outerW,outerH,'right');
  await teamCard(ctx,3,teamAt(teams,3),rx,y2,outerW,outerH,'right');

  const lj=lx+outerW+36,rj=rx-36;
  neonPath(ctx,[[lx+outerW,y1+outerH/2],[lj,y1+outerH/2],[lj,y2+outerH/2],[lx+outerW,y2+outerH/2]]);
  neonPath(ctx,[[rx,y1+outerH/2],[rj,y1+outerH/2],[rj,y2+outerH/2],[rx,y2+outerH/2]]);

  const fw=220,fh=500,fx=W/2-fw/2,fy=470;
  await finalPillar(ctx,fx,fy,fw,fh);
  neonPath(ctx,[[lj,(y1+y2+outerH)/2],[fx,(y1+y2+outerH)/2]]);
  neonPath(ctx,[[rj,(y1+y2+outerH)/2],[fx+fw,(y1+y2+outerH)/2]]);
}
async function drawFinal(ctx,teams){
  const outerW=360,outerH=98,lx=54,rx=W-54-outerW,y=760;
  await teamCard(ctx,1,teamAt(teams,1),lx,y,outerW,outerH,'left');
  await teamCard(ctx,2,teamAt(teams,2),rx,y,outerW,outerH,'right');
  const fw=230,fh=510,fx=W/2-fw/2,fy=500;
  await finalPillar(ctx,fx,fy,fw,fh);
  neonPath(ctx,[[lx+outerW,y+outerH/2],[fx,y+outerH/2]]);
  neonPath(ctx,[[rx,y+outerH/2],[fx+fw,y+outerH/2]]);
}
function footer(ctx,meta,stage){
  const y=H-88;
  ctx.textAlign='center';
  ctx.fillStyle='#7f8fc8';ctx.font='800 11px Arial';
  ctx.fillText('LIGA JUVENTINO ROSAS · '+meta.name.toUpperCase()+' · '+STAGES[stage].short,W/2,y);
  ctx.textAlign='left';
}
async function drawBracket(canvas,page){
  canvas.width=W*SCALE;canvas.height=H*SCALE;
  const ctx=canvas.getContext('2d');
  ctx.setTransform(SCALE,0,0,SCALE,0,0);
  const cat=page.querySelector('[data-v649-cat]')?.value||currentCategory();
  const meta=catMeta(cat),stage=resolvedStage(page),teams=slotValues(page);
  background(ctx);
  await header(ctx,meta,stage);
  if(stage==='r16')await drawR16(ctx,teams);
  else if(stage==='qf')await drawQF(ctx,teams);
  else if(stage==='sf')await drawSF(ctx,teams);
  else await drawFinal(ctx,teams);
  footer(ctx,meta,stage);
  return canvas;
}

function queuePreview(page){
  const token=++previewToken;clearTimeout(previewTimer);
  previewTimer=setTimeout(async()=>{const c=page.querySelector('[data-v649-preview]');if(!c||token!==previewToken)return;try{await drawBracket(c,page)}catch(e){console.warn('V649 preview',e)}},70);
}
function validateUnique(page){
  const vals=slotValues(page).filter(Boolean),seen=new Set();
  for(const v of vals){const k=norm(v);if(seen.has(k)){setStatus(page,'Hay un equipo repetido. Corrígelo antes de generar.',true);return false}seen.add(k)}
  return true;
}
function blobFromCanvas(c){return new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('PNG')),'image/png'))}
function download(blob,name){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function slug(v){return norm(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'categoria'}
async function exportPng(page){
  if(!validateUnique(page))return;setStatus(page,'Generando PNG profesional HD…');
  try{
    const c=document.createElement('canvas');await drawBracket(c,page);
    const stage=resolvedStage(page),meta=catMeta(page.querySelector('[data-v649-cat]').value);
    download(await blobFromCanvas(c),'Liga_Juventino_Copa_'+slug(STAGES[stage].name)+'_'+slug(meta.name)+'_HD.png');
    setStatus(page,'PNG HD generado correctamente.');
  }catch(e){console.warn(e);setStatus(page,'No se pudo generar el PNG.',true)}
}
function loadJsPDF(){
  if(window.jspdf?.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((res,rej)=>{let s=document.querySelector('script[data-v649-jspdf]');if(!s){s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';s.async=true;s.dataset.v649Jspdf='1';document.head.appendChild(s)}const ok=()=>window.jspdf?.jsPDF?res(window.jspdf.jsPDF):rej(new Error('jsPDF'));s.addEventListener('load',ok,{once:true});s.addEventListener('error',rej,{once:true});if(window.jspdf?.jsPDF)ok()});
}
async function exportPdf(page){
  if(!validateUnique(page))return;setStatus(page,'Generando PDF profesional…');
  try{
    const c=document.createElement('canvas');await drawBracket(c,page);const JS=await loadJsPDF(),pdf=new JS({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,210,262.6,undefined,'FAST');
    const stage=resolvedStage(page),meta=catMeta(page.querySelector('[data-v649-cat]').value);
    pdf.save('Liga_Juventino_Copa_'+slug(STAGES[stage].name)+'_'+slug(meta.name)+'.pdf');setStatus(page,'PDF generado correctamente.');
  }catch(e){console.warn(e);setStatus(page,'No se pudo generar el PDF.',true)}
}

async function mount(){
  if(route()!=='bracketBuilder')return;injectCss();
  const page=document.querySelector('#screen .v64-page');if(!page||page.dataset.v649==='1')return;
  await ensureData();if(route()!=='bracketBuilder'||!page.isConnected)return;
  const cat=currentCategory(),meta=catMeta(cat);
  page.dataset.v649='1';page.dataset.v643='2';
  page.innerHTML=
    '<section class="v649-hero"><div class="v649-brand"><img src="'+esc(LEAGUE_LOGO)+'" alt=""><span><small>LIGA JUVENTINO ROSAS</small><h1>FULL BRACKET · Copa</h1></span></div><p>Diseño simétrico inspirado en cuadro profesional: equipos a los lados, rondas hacia el centro y trofeo en la Final.</p></section>'+
    '<section class="v649-controls"><div class="v649-catrow"><span class="v649-catlogo"><img data-v649-cat-logo src="'+esc(meta.logo)+'" alt=""></span><div class="v649-grid">'+
      '<label>CATEGORÍA<select data-v649-cat>'+CATS.map(c=>'<option value="'+c.id+'" '+(c.id===cat?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></label>'+
      '<label>ETAPA<select data-v649-stage><option value="auto">Automático</option><option value="r16">Octavos de final</option><option value="qf">Cuartos de final</option><option value="sf">Semifinales</option><option value="final">Final</option></select></label>'+
    '</div></div><div class="v649-auto" data-v649-auto></div></section>'+
    '<div class="v649-actions"><button type="button" class="v649-soft" data-v649-autofill>Clasificar equipos</button><button type="button" class="v649-soft" data-v649-clear>Limpiar</button></div>'+
    '<div class="v649-title"><span><small>CLASIFICADOS</small><b data-v649-slot-title></b></span><em data-v649-slot-hint></em></div>'+
    '<section class="v649-slots" data-v649-slots></section>'+
    '<div class="v649-title"><span><small>VISTA PREVIA</small><b>Diseño profesional</b></span><em>Vertical · simétrico · HD</em></div>'+
    '<section class="v649-preview"><canvas data-v649-preview width="'+(W*SCALE)+'" height="'+(H*SCALE)+'"></canvas><div class="v649-preview-meta"><span>Diseño FULL BRACKET profesional</span><b>Equipos laterales + rondas al centro</b></div></section>'+
    '<div class="v649-export"><button type="button" data-v649-png>Generar PNG HD</button><button type="button" data-v649-pdf>Generar PDF</button></div><div class="v649-status" data-v649-status aria-live="polite"></div>';

  const catSel=page.querySelector('[data-v649-cat]'),stageSel=page.querySelector('[data-v649-stage]');
  stageSel.value=String(localStorage.getItem('v649-bracket-stage')||'auto');
  if(stageSel.value!=='auto'&&!STAGES[stageSel.value])stageSel.value='auto';

  renderSlots(page,false);autoFill(page);
  catSel.addEventListener('change',()=>{
    const id=catSel.value,m=catMeta(id);try{localStorage.setItem('v649-bracket-cat',id);localStorage.setItem('v62-category',id)}catch(_){}
    page.querySelector('[data-v649-cat-logo]').src=m.logo;renderSlots(page,false);autoFill(page);stageInfo(page);
  });
  stageSel.addEventListener('change',()=>{
    try{localStorage.setItem('v649-bracket-stage',stageSel.value)}catch(_){}
    renderSlots(page,true);stageInfo(page);autoFill(page);
  });
  page.querySelector('[data-v649-autofill]').addEventListener('click',()=>autoFill(page));
  page.querySelector('[data-v649-clear]').addEventListener('click',()=>{page.querySelectorAll('[data-v649-place]').forEach(s=>{s.value='';updateSlotLogo(s)});syncNoDuplicates(page);setStatus(page,'Selección limpiada.');queuePreview(page)});
  page.querySelector('[data-v649-png]').addEventListener('click',()=>exportPng(page));
  page.querySelector('[data-v649-pdf]').addEventListener('click',()=>exportPdf(page));
  stageInfo(page);queuePreview(page);
}

function schedule(){clearTimeout(mountTimer);mountTimer=setTimeout(mount,45)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.getElementById('screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();setTimeout(mount,300);setTimeout(mount,900);
})();
