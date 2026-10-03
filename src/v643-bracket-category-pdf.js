/* V652 — Dos estilos de bracket fieles a las dos referencias.
   Diseño 1: ROUND OF 16 / cuadro horizontal con balón-esfera, barras y trofeo central.
   Diseño 2: FULL BRACKET / tarjetas verticales en los extremos, rondas hacia el centro y trofeo central.
   Automático: 9–16 Octavos · 5–8 Cuartos · 3–4 Semifinales · 2 Final.
   Evita equipos repetidos y usa PASE DIRECTO cuando la llave no está completa. */
(function(){
'use strict';
if(window.__LJR_V652_EXACT_BRACKETS__)return;
window.__LJR_V652_EXACT_BRACKETS__=true;

const BUILD='20261003-v652-reference-exact-brackets';
const CATS=[
  {id:'3',name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
  {id:'5',name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
  {id:'4',name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
  {id:'2',name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
  {id:'1',name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
];
const STAGES={
  r16:{name:'Octavos de final',short:'ROUND OF 16',slots:16},
  qf:{name:'Cuartos de final',short:'CUARTOS DE FINAL',slots:8},
  sf:{name:'Semifinales',short:'SEMIFINALES',slots:4},
  final:{name:'Final',short:'GRAN FINAL',slots:2}
};
const DESIGNS={
  round:{name:'Diseño 1 · Round of 16 exacto',slug:'round-of-16'},
  full:{name:'Diseño 2 · Full Bracket exacto',slug:'full-bracket'}
};
const LEAGUE_LOGO='./assets/liga-logo.webp';
const TROPHY='./assets/reference/final-trophy-drive.png';
const TROPHY_FALLBACK='./final-trophy-drive.png';
const W=1228,H=1536;
const imgCache=new Map();
let mountTimer=0,previewTimer=0,previewToken=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const catMeta=id=>CATS.find(x=>x.id===String(id))||CATS[0];
const data=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};

function injectCss(){
  ['v643-bracket-style','v647-bracket-style','v649-bracket-style','v651-bracket-style'].forEach(id=>document.getElementById(id)?.remove());
  const s=document.createElement('style');
  s.id='v651-bracket-style';
  s.textContent=[
    'body[data-app-route="bracketBuilder"] #screen{background:#02032f!important;}',
    'body[data-app-route="bracketBuilder"] .v64-page[data-v651="1"]{padding:13px 13px calc(116px + env(safe-area-inset-bottom))!important;background:radial-gradient(430px 280px at 50% 0,rgba(31,87,255,.27),transparent 75%),linear-gradient(180deg,#07106c 0,#03044d 48%,#010224 100%)!important;min-height:100%!important;color:#fff!important;}',
    '.v651-hero{position:relative;overflow:hidden;border:1px solid rgba(73,113,255,.75);border-radius:20px;padding:15px;background:radial-gradient(280px 190px at 86% 16%,rgba(0,230,246,.16),transparent 70%),linear-gradient(145deg,#13259c,#090e72 56%,#050848);box-shadow:0 18px 42px rgba(0,0,35,.3)}',
    '.v651-brand{display:flex;align-items:center;gap:10px}.v651-brand img{width:50px;height:50px;object-fit:contain}.v651-brand small{display:block;color:#58eaf4;font-size:9.5px;font-weight:950;letter-spacing:.08em}.v651-brand h1{margin:2px 0 0;font-size:23px;line-height:1.04}.v651-hero p{margin:8px 0 0;color:#c4cef5;font-size:11.5px;line-height:1.4}',
    '.v651-controls{margin-top:10px;border:1px solid rgba(70,94,213,.78);border-radius:18px;background:#090e70;padding:10px}.v651-catrow{display:grid;grid-template-columns:48px minmax(0,1fr);gap:9px;align-items:center}.v651-catlogo{width:48px;height:48px;border-radius:13px;background:#05095a;border:1px solid #3145b8;display:grid;place-items:center;overflow:hidden}.v651-catlogo img{width:42px;height:42px;object-fit:contain}.v651-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v651-grid label{min-width:0;color:#5beaf4;font-size:9px;font-weight:950;letter-spacing:.07em}.v651-grid select{margin-top:5px;width:100%;height:41px;border:1px solid #3448bd;border-radius:12px;background:#101475;color:#fff;padding:0 26px 0 9px;font-size:11px;font-weight:850;outline:none}',
    '.v651-auto{margin-top:9px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-radius:13px;padding:9px 10px;background:linear-gradient(90deg,rgba(23,77,255,.35),rgba(24,223,240,.08));border:1px solid rgba(61,120,255,.48)}.v651-auto span small{display:block;color:#7aeef6;font-size:8.5px;font-weight:950;letter-spacing:.07em}.v651-auto span b{display:block;margin-top:2px;font-size:12px}.v651-auto em{font-style:normal;color:#b9c4f2;font-size:9px;text-align:right}',
    '.v651-actions{display:flex;gap:8px;margin-top:9px}.v651-soft{height:39px;border:1px solid #3957df;border-radius:12px;background:#111b89;color:#fff;padding:0 12px;font-size:10.5px;font-weight:900}.v651-soft:first-child{background:linear-gradient(180deg,#1c5bff,#173bb8);border-color:#4d7cff}',
    '.v651-title{display:flex;align-items:end;justify-content:space-between;gap:9px;margin:15px 2px 8px}.v651-title small{display:block;color:#50e8f3;font-size:9px;font-weight:950;letter-spacing:.08em}.v651-title b{display:block;margin-top:2px;font-size:16px}.v651-title em{font-style:normal;color:#aab5e6;font-size:9px;text-align:right}',
    '.v651-slots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v651-slot{min-width:0;border:1px solid #2f43ba;border-radius:14px;background:linear-gradient(180deg,#11177d,#0b0f69);padding:8px}.v651-slothead{display:flex;align-items:center;gap:6px;margin-bottom:6px}.v651-seed{width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#174dff;border:1px solid #5e82ff;color:#fff;font-size:10px;font-weight:950}.v651-slothead b{font-size:10.5px}.v651-pick{display:grid;grid-template-columns:34px minmax(0,1fr);gap:6px;align-items:center}.v651-logo{width:34px;height:34px;border-radius:10px;background:#05095a;border:1px solid #3042a9;display:grid;place-items:center;overflow:hidden}.v651-logo img{width:28px;height:28px;object-fit:contain}.v651-slot select{min-width:0;width:100%;height:37px;border:1px solid #2b3aa5;border-radius:10px;background:#10146f;color:#fff;padding:0 24px 0 8px;font-size:10px;font-weight:850;outline:none;text-overflow:ellipsis}.v651-slot select option:disabled{color:#6f79a8}',
    '.v651-designs{display:grid;grid-template-columns:1fr 1fr;gap:9px}.v651-design-card{appearance:none;text-align:left;padding:7px;border:2px solid rgba(58,77,177,.85);border-radius:17px;background:#050854;color:#fff;overflow:hidden;box-shadow:0 12px 28px rgba(0,0,25,.22);transition:.18s}.v651-design-card.selected{border-color:#42e5f1;box-shadow:0 0 0 2px rgba(66,229,241,.12),0 14px 30px rgba(0,0,25,.28)}.v651-design-card canvas{display:block;width:100%;height:auto;border-radius:10px;background:#02032f}.v651-design-card span{display:flex;align-items:center;justify-content:space-between;gap:7px;padding:7px 2px 1px}.v651-design-card b{font-size:10px}.v651-design-card i{font-style:normal;color:#63eaf4;font-size:8px;font-weight:900}.v651-design-card.selected i:after{content:" · SELECCIONADO"}',
    '.v651-current{margin-top:10px;border:1px solid rgba(54,80,210,.78);border-radius:18px;background:#04075a;padding:7px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,30,.24)}.v651-current canvas{display:block;width:100%;height:auto;border-radius:12px;background:#04064c}.v651-current-meta{display:flex;justify-content:space-between;gap:8px;padding:7px 3px 1px;color:#9fa9da;font-size:9px}.v651-current-meta b{color:#55eaf4}',
    '.v651-export{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.v651-export button{min-height:48px;border-radius:14px;border:1px solid #4a79ff;background:linear-gradient(180deg,#1d5dff,#173db9);color:#fff;font-size:12px;font-weight:950;box-shadow:0 8px 18px rgba(7,35,150,.3)}.v651-export button[data-v651-pdf]{background:linear-gradient(180deg,#13bbd9,#0b72c9);border-color:#34dceb}.v651-status{min-height:18px;margin:6px 3px 0;color:#76eaf4;font-size:9.5px;font-weight:800}',
    '@media(max-width:380px){.v651-grid,.v651-slots{grid-template-columns:1fr}.v651-designs{grid-template-columns:1fr 1fr}.v651-brand h1{font-size:21px}}'
  ].join('\n');
  document.head.appendChild(s);
}

async function ensureData(){try{await window.V66_OFFICIAL_DIRECTORY?.load?.()}catch(_){}}
function teamLogo(name){
  name=String(name||'').trim();if(!name)return'';
  try{
    const x=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'';
    if(x)return x;
  }catch(_){}
  const hit=Object.entries(data()?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  if(typeof hit==='string'&&hit)return hit;
  if(hit&&typeof hit==='object')return hit.local||hit.source||hit.app||'';
  return'';
}
function collectTeams(cat){
  const id=String(cat),out=[],seen=new Set();
  const add=v=>{const n=String(v||'').trim(),k=norm(n);if(!n||!k||seen.has(k))return;seen.add(k);out.push(n)};
  try{(window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[]).filter(t=>String(t?.cat||'')===id).forEach(t=>add(t?.name))}catch(_){}
  const c=data()?.categories?.[id]||{};
  Object.keys(c?.rosters||{}).forEach(add);
  (c?.teams||[]).forEach(t=>add(typeof t==='string'?t:t?.name));
  (c?.standings?.[0]?.rows||[]).forEach(r=>add(Array.isArray(r)?r[1]:(r?.team||r?.name)));
  (c?.fixtures||[]).forEach(g=>(g?.rows||[]).forEach(r=>Array.isArray(r)?(add(r[2]),add(r[6])):(add(r?.home),add(r?.away))));
  return out.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function rankedTeams(cat){
  const rows=data()?.categories?.[String(cat)]?.standings?.[0]?.rows||[],out=[],seen=new Set();
  rows.forEach(r=>{const n=String(Array.isArray(r)?r[1]:(r?.team||r?.name||'')).trim(),k=norm(n);if(n&&k&&!seen.has(k)){seen.add(k);out.push(n)}});
  collectTeams(cat).forEach(n=>{const k=norm(n);if(!seen.has(k)){seen.add(k);out.push(n)}});
  return out;
}
function autoStageForCount(n){n=Number(n)||0;if(n>=9)return'r16';if(n>=5)return'qf';if(n>=3)return'sf';return'final'}
function currentCategory(){
  const v=String(localStorage.getItem('v651-bracket-cat')||localStorage.getItem('v62-category')||'3');
  return CATS.some(c=>c.id===v)?v:'3';
}
function requestedStage(page){return String(page?.querySelector('[data-v651-stage]')?.value||localStorage.getItem('v651-bracket-stage')||'auto')}
function resolvedStage(page){
  const req=requestedStage(page);if(STAGES[req])return req;
  const cat=page?.querySelector('[data-v651-cat]')?.value||currentCategory();
  return autoStageForCount(collectTeams(cat).length);
}
function selectedDesign(page){
  const v=String(page?.dataset?.v651Design||localStorage.getItem('v651-bracket-design')||'round');
  return DESIGNS[v]?v:'round';
}
function slotValues(page){return[...page.querySelectorAll('[data-v651-place]')].map(s=>String(s.value||'').trim())}
function setStatus(page,msg,bad){
  const el=page.querySelector('[data-v651-status]');if(!el)return;
  el.textContent=msg||'';el.style.color=bad?'#ffb8c9':'#76eaf4';
}
function optionHtml(list,value){return'<option value="">Por confirmar / pase directo</option>'+list.map(n=>'<option value="'+esc(n)+'" '+(n===value?'selected':'')+'>'+esc(n)+'</option>').join('')}
function updateSlotLogo(sel){
  const im=sel.closest('.v651-slot')?.querySelector('.v651-logo img');if(!im)return;
  const src=teamLogo(sel.value);im.src=src||LEAGUE_LOGO;im.style.opacity=src?'1':'.2';
}
function syncNoDuplicates(page,changed){
  const sels=[...page.querySelectorAll('[data-v651-place]')];
  if(changed&&changed.value){
    const k=norm(changed.value),dup=sels.find(s=>s!==changed&&s.value&&norm(s.value)===k);
    if(dup){const n=changed.value;changed.value='';updateSlotLogo(changed);setStatus(page,n+' ya está seleccionado. Un equipo no puede repetirse.',true)}
  }
  const active=sels.map(s=>String(s.value||'').trim()).filter(Boolean);
  sels.forEach(sel=>[...sel.options].forEach(opt=>{
    if(!opt.value){opt.disabled=false;return}
    opt.disabled=active.some(v=>norm(v)===norm(opt.value))&&norm(sel.value)!==norm(opt.value);
  }));
}
function stageInfo(page){
  const cat=page.querySelector('[data-v651-cat]')?.value||currentCategory();
  const count=collectTeams(cat).length,stage=resolvedStage(page),slots=STAGES[stage].slots,byes=Math.max(0,slots-count);
  const auto=page.querySelector('[data-v651-auto]');
  if(auto)auto.innerHTML='<span><small>CLASIFICACIÓN AUTOMÁTICA</small><b>'+count+' equipos → '+esc(STAGES[stage].name)+'</b></span><em>'+(byes?byes+' pase'+(byes===1?'':'s')+' directo'+(byes===1?'':'s'):'Llave completa')+'</em>';
  const t=page.querySelector('[data-v651-slot-title]');if(t)t.textContent=slots===16?'Semillas 1–16':slots===8?'Semillas 1–8':slots===4?'Semifinalistas 1–4':'Finalistas 1–2';
  const h=page.querySelector('[data-v651-slot-hint]');if(h)h.innerHTML=esc(STAGES[stage].name)+'<br>sin equipos repetidos';
  const b=page.querySelector('[data-v651-autofill]');if(b)b.textContent='Clasificar '+Math.min(count,slots)+' equipos';
}
function renderSlots(page,keep){
  const cat=page.querySelector('[data-v651-cat]')?.value||currentCategory();
  const teams=collectTeams(cat),stage=resolvedStage(page),count=STAGES[stage].slots;
  const prev=keep?slotValues(page):[],host=page.querySelector('[data-v651-slots]');if(!host)return;
  const used=new Set();
  host.innerHTML=Array.from({length:count},(_,i)=>{
    let val=teams.includes(prev[i])?prev[i]:'';
    if(val&&used.has(norm(val)))val='';
    if(val)used.add(norm(val));
    const src=teamLogo(val);
    return'<div class="v651-slot"><div class="v651-slothead"><span class="v651-seed">'+(i+1)+'</span><b>Semilla '+(i+1)+'</b></div>'+
      '<div class="v651-pick"><span class="v651-logo"><img src="'+esc(src||LEAGUE_LOGO)+'" style="opacity:'+(src?'1':'.2')+'" alt=""></span>'+
      '<select data-v651-place="'+(i+1)+'">'+optionHtml(teams,val)+'</select></div></div>';
  }).join('');
  host.querySelectorAll('[data-v651-place]').forEach(sel=>sel.addEventListener('change',()=>{updateSlotLogo(sel);syncNoDuplicates(page,sel);queueAllPreviews(page)}));
  syncNoDuplicates(page);stageInfo(page);
}
function autoFill(page){
  const cat=page.querySelector('[data-v651-cat]')?.value||currentCategory(),ranked=rankedTeams(cat),sels=[...page.querySelectorAll('[data-v651-place]')],used=new Set();
  sels.forEach(s=>{const v=ranked.find(n=>!used.has(norm(n)))||'';if(v)used.add(norm(v));s.value=v;updateSlotLogo(s)});
  syncNoDuplicates(page);
  const byes=Math.max(0,sels.length-used.size);
  setStatus(page,'Clasificación cargada: '+used.size+' equipos'+(byes?' · '+byes+' pase'+(byes===1?'':'s')+' directo'+(byes===1?'':'s'):'')+'.');
  queueAllPreviews(page);
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
async function trophy(ctx,x,y,w,h){
  let im=await imageLoad(TROPHY);if(!im)im=await imageLoad(TROPHY_FALLBACK);
  if(im){ctx.save();ctx.shadowColor='rgba(54,226,255,.7)';ctx.shadowBlur=28;drawContain(ctx,im,x,y,w,h);ctx.restore()}
}
function neon(ctx,points,color='#47e5f0',width=4){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor=color;ctx.shadowBlur=8;
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
}
function line(ctx,x1,y1,x2,y2,color='#47e5f0',width=4){neon(ctx,[[x1,y1],[x2,y2]],color,width)}
function teamAt(teams,seed){return teams[seed-1]||''}
const SEED16=[[1,16],[8,9],[4,13],[5,12],[2,15],[7,10],[3,14],[6,11]];
const SEED8=[[1,8],[4,5],[2,7],[3,6]];

/* =========================
   DISEÑO 1 · ROUND OF 16
   ========================= */
function exactTitleFont(size){return '900 '+size+'px "Arial Narrow","Roboto Condensed",Impact,Arial,sans-serif'}
function exactBodyFont(size,weight){return String(weight||900)+' '+size+'px "Arial Narrow","Roboto Condensed",Arial,sans-serif'}
function drawLeagueFooter(ctx){
  ctx.textAlign='center';
  ctx.fillStyle='#fff';ctx.font=exactTitleFont(34);ctx.fillText('LJR',W/2,H-105);
  ctx.fillStyle='#fff';ctx.font=exactBodyFont(13,800);ctx.letterSpacing='5px';ctx.fillText('LIGA JUVENTINO ROSAS',W/2,H-77);
  ctx.letterSpacing='0px';ctx.textAlign='left';
}

/* =========================
   DISEÑO 1 · ROUND OF 16
   Reproduce la composición de la primera referencia:
   título enorme, esfera azul, tarjetas horizontales, llaves blancas y trofeo central.
   ========================= */
function roundBackground(ctx){
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#09101f');bg.addColorStop(.22,'#07377e');bg.addColorStop(.55,'#064aa8');bg.addColorStop(.78,'#0a347e');bg.addColorStop(1,'#09101d');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  const topGlow=ctx.createRadialGradient(W*.49,330,20,W*.49,330,430);
  topGlow.addColorStop(0,'rgba(53,138,255,.42)');topGlow.addColorStop(.65,'rgba(14,83,200,.18)');topGlow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=topGlow;ctx.fillRect(0,120,W,720);

  const globe=ctx.createRadialGradient(W/2,680,70,W/2,680,535);
  globe.addColorStop(0,'rgba(12,83,232,.52)');globe.addColorStop(.60,'rgba(13,102,243,.28)');globe.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=globe;ctx.fillRect(40,250,W-80,1000);

  ctx.save();
  ctx.globalAlpha=.22;ctx.strokeStyle='#5e9fff';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(W/2,682,420,Math.PI*.03,Math.PI*.97);ctx.stroke();
  ctx.beginPath();ctx.arc(W/2,682,330,Math.PI*.04,Math.PI*.96);ctx.stroke();
  ctx.beginPath();ctx.arc(W/2,682,245,Math.PI*.07,Math.PI*.93);ctx.stroke();
  for(let k=-3;k<=3;k++){
    ctx.beginPath();
    ctx.moveTo(W/2+k*95,285);
    ctx.bezierCurveTo(W/2+k*35,475,W/2+k*35,855,W/2+k*105,1110);
    ctx.stroke();
  }
  ctx.restore();

  const cyan=ctx.createRadialGradient(160,580,20,160,580,260);
  cyan.addColorStop(0,'rgba(28,183,255,.40)');cyan.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=cyan;ctx.fillRect(0,330,460,540);
  const mag=ctx.createRadialGradient(W-185,1020,20,W-185,1020,300);
  mag.addColorStop(0,'rgba(242,35,255,.38)');mag.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=mag;ctx.fillRect(W-520,730,520,600);
}
async function roundHeader(ctx,meta,stage){
  ctx.textAlign='center';
  ctx.fillStyle='#fff';ctx.font=exactTitleFont(stage==='r16'?116:96);
  ctx.fillText(stage==='r16'?'ROUND OF 16':STAGES[stage].short,W/2,170);
  ctx.fillStyle='#fff';ctx.font=exactTitleFont(42);
  ctx.fillText('LIGA JUVENTINO ROSAS',W/2,246);
  ctx.fillStyle='#dbe6ff';ctx.font=exactBodyFont(18,900);
  ctx.fillText(meta.name.toUpperCase(),W/2,282);
  ctx.textAlign='left';
}
async function roundTeam(ctx,seed,name,x,y,w,h,side){
  const g=ctx.createLinearGradient(x,y,x+w,y);
  if(side==='right'){g.addColorStop(0,'#07102c');g.addColorStop(.68,'#092e9c');g.addColorStop(1,'#124cff')}
  else{g.addColorStop(0,'#124cff');g.addColorStop(.32,'#092e9c');g.addColorStop(1,'#07102c')}
  fillR(ctx,x,y,w,h,4,g,'rgba(84,128,255,.70)',2);

  const logo=await imageLoad(teamLogo(name));
  const box=h-10,bx=side==='right'?x+w-box-6:x+6;
  if(logo)drawContain(ctx,logo,bx+3,y+8,box-6,box-6);

  const label=name||'PASE DIRECTO';
  const tx=side==='right'?x+16:x+box+17;
  const max=w-box-38;
  ctx.fillStyle=name?'#fff':'#79eef5';
  fitFont(ctx,label,max,27,13,900);
  ctx.fillText(label,tx,y+h/2+10);
}
function roundBracket(ctx,x,y1,y2,dir,depth){
  const d=depth||34,mid=dir==='left'?x+d:x-d;
  ctx.save();ctx.strokeStyle='rgba(218,226,255,.70)';ctx.lineWidth=3;ctx.lineCap='square';ctx.lineJoin='miter';
  ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(mid,y1);ctx.lineTo(mid,y2);ctx.lineTo(x,y2);ctx.stroke();ctx.restore();
  return mid;
}
async function roundCenter(ctx){
  const x=W/2-90,y=676,w=180,h=300;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,'rgba(13,61,161,.24)');g.addColorStop(.52,'rgba(4,18,68,.55)');g.addColorStop(1,'rgba(2,7,36,.20)');
  fillR(ctx,x,y,w,h,62,g,'rgba(62,92,174,.18)',2);
  await trophy(ctx,x+25,y+84,w-50,165);
}
async function drawRoundR16(ctx,teams){
  const cw=390,ch=76,lx=18,rx=W-18-cw;
  const ys=[378,464,578,664,966,1052,1166,1252];

  for(let i=0;i<4;i++){
    const p=SEED16[i],b=i*2;
    await roundTeam(ctx,p[0],teamAt(teams,p[0]),lx,ys[b],cw,ch,'left');
    await roundTeam(ctx,p[1],teamAt(teams,p[1]),lx,ys[b+1],cw,ch,'left');
    roundBracket(ctx,lx+cw,ys[b]+ch/2,ys[b+1]+ch/2,'left',34);
  }
  for(let i=4;i<8;i++){
    const p=SEED16[i],j=i-4,b=j*2;
    await roundTeam(ctx,p[0],teamAt(teams,p[0]),rx,ys[b],cw,ch,'right');
    await roundTeam(ctx,p[1],teamAt(teams,p[1]),rx,ys[b+1],cw,ch,'right');
    roundBracket(ctx,rx,ys[b]+ch/2,ys[b+1]+ch/2,'right',34);
  }

  const l1=460,l2=505,r1=W-460,r2=W-505;
  ctx.save();ctx.strokeStyle='rgba(218,226,255,.66)';ctx.lineWidth=3;ctx.lineCap='square';ctx.lineJoin='miter';
  const segs=[
    [442,421,l1,421],[442,621,l1,621],[l1,421,l1,621],[l1,520,l2,520],
    [442,1009,l1,1009],[442,1209,l1,1209],[l1,1009,l1,1209],[l1,1109,l2,1109],
    [W-442,421,r1,421],[W-442,621,r1,621],[r1,421,r1,621],[r1,520,r2,520],
    [W-442,1009,r1,1009],[W-442,1209,r1,1209],[r1,1009,r1,1209],[r1,1109,r2,1109],
    [l2,520,535,520],[535,520,535,1109],[535,815,W/2-91,815],
    [r2,520,W-535,520],[W-535,520,W-535,1109],[W-535,815,W/2+91,815]
  ];
  segs.forEach(s=>{ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(s[2],s[3]);ctx.stroke()});
  ctx.restore();
  await roundCenter(ctx);
}
async function drawRoundQF(ctx,teams){
  const cw=390,ch=78,lx=18,rx=W-18-cw,ys=[430,520,1015,1105],lp=[SEED8[0],SEED8[1]],rp=[SEED8[2],SEED8[3]];
  for(let i=0;i<2;i++){const p=lp[i],b=i*2;await roundTeam(ctx,p[0],teamAt(teams,p[0]),lx,ys[b],cw,ch,'left');await roundTeam(ctx,p[1],teamAt(teams,p[1]),lx,ys[b+1],cw,ch,'left');roundBracket(ctx,lx+cw,ys[b]+ch/2,ys[b+1]+ch/2,'left',44)}
  for(let i=0;i<2;i++){const p=rp[i],b=i*2;await roundTeam(ctx,p[0],teamAt(teams,p[0]),rx,ys[b],cw,ch,'right');await roundTeam(ctx,p[1],teamAt(teams,p[1]),rx,ys[b+1],cw,ch,'right');roundBracket(ctx,rx,ys[b]+ch/2,ys[b+1]+ch/2,'right',44)}
  ctx.save();ctx.strokeStyle='rgba(218,226,255,.68)';ctx.lineWidth=3;
  [[452,513,535,513],[452,1098,535,1098],[W-452,513,W-535,513],[W-452,1098,W-535,1098],[535,513,535,1098],[535,806,W/2-90,806],[W-535,513,W-535,1098],[W-535,806,W/2+90,806]].forEach(s=>{ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(s[2],s[3]);ctx.stroke()});
  ctx.restore();await roundCenter(ctx);
}
async function drawRoundSF(ctx,teams){
  const cw=410,ch=86,lx=18,rx=W-18-cw,y1=600,y2=710;
  await roundTeam(ctx,1,teamAt(teams,1),lx,y1,cw,ch,'left');await roundTeam(ctx,4,teamAt(teams,4),lx,y2,cw,ch,'left');
  await roundTeam(ctx,2,teamAt(teams,2),rx,y1,cw,ch,'right');await roundTeam(ctx,3,teamAt(teams,3),rx,y2,cw,ch,'right');
  const ml=roundBracket(ctx,lx+cw,y1+ch/2,y2+ch/2,'left',58),mr=roundBracket(ctx,rx,y1+ch/2,y2+ch/2,'right',58);
  line(ctx,ml,(y1+y2+ch)/2,W/2-90,(y1+y2+ch)/2,'rgba(218,226,255,.68)',3);
  line(ctx,mr,(y1+y2+ch)/2,W/2+90,(y1+y2+ch)/2,'rgba(218,226,255,.68)',3);
  await roundCenter(ctx);
}
async function drawRoundFinal(ctx,teams){
  const cw=430,ch=92,lx=18,rx=W-18-cw,y=760;
  await roundTeam(ctx,1,teamAt(teams,1),lx,y,cw,ch,'left');await roundTeam(ctx,2,teamAt(teams,2),rx,y,cw,ch,'right');
  line(ctx,lx+cw,y+ch/2,W/2-90,y+ch/2,'rgba(218,226,255,.68)',3);
  line(ctx,rx,y+ch/2,W/2+90,y+ch/2,'rgba(218,226,255,.68)',3);
  await roundCenter(ctx);
}
async function renderRound(ctx,meta,stage,teams){
  roundBackground(ctx);await roundHeader(ctx,meta,stage);
  if(stage==='r16')await drawRoundR16(ctx,teams);else if(stage==='qf')await drawRoundQF(ctx,teams);else if(stage==='sf')await drawRoundSF(ctx,teams);else await drawRoundFinal(ctx,teams);
  drawLeagueFooter(ctx);
}

/* =========================
   DISEÑO 2 · FULL BRACKET
   Reproduce la composición de la segunda referencia:
   tarjetas verticales, llaves cyan, rondas interiores y columna central.
   ========================= */
function fullBackground(ctx){
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#07137a');bg.addColorStop(.30,'#050762');bg.addColorStop(.72,'#02023b');bg.addColorStop(1,'#010128');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const glow=ctx.createRadialGradient(W/2,680,25,W/2,680,520);
  glow.addColorStop(0,'rgba(19,69,255,.24)');glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(100,160,W-200,1080);
  ctx.fillStyle='#ff721f';ctx.fillRect(6,0,5,H);ctx.fillRect(W-11,0,5,H);
  ctx.save();ctx.globalAlpha=.10;ctx.fillStyle='#1b2b89';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(240,0);ctx.lineTo(80,190);ctx.lineTo(0,150);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(W,0);ctx.lineTo(W-240,0);ctx.lineTo(W-80,190);ctx.lineTo(W,150);ctx.closePath();ctx.fill();
  ctx.restore();
}
async function fullHeader(ctx,meta,stage){
  ctx.textAlign='center';
  ctx.fillStyle='#fff';ctx.font=exactTitleFont(31);ctx.fillText('LIGA JUVENTINO ROSAS · '+meta.name.toUpperCase(),W/2,75);
  ctx.fillStyle='#fff';ctx.font=exactTitleFont(76);ctx.fillText('FULL',W/2-160,152);
  ctx.fillStyle='#20e2f2';ctx.fillText('BRACKET',W/2+128,152);
  ctx.fillStyle='#adb8e7';ctx.font=exactBodyFont(15,900);ctx.fillText(STAGES[stage].name.toUpperCase(),W/2,187);
  ctx.textAlign='left';
}
async function fullTile(ctx,seed,name,x,y,w,h){
  const g=ctx.createLinearGradient(x,y,x,y+h);
  g.addColorStop(0,'#113eff');g.addColorStop(.52,'#09218e');g.addColorStop(1,'#05083f');
  fillR(ctx,x,y,w,h,8,g,'rgba(49,87,244,.72)',1.5);
  const logo=await imageLoad(teamLogo(name)),label=name||'PASE DIRECTO';
  if(logo)drawContain(ctx,logo,x+w*.20,y+9,w*.60,h*.50);
  ctx.textAlign='center';ctx.fillStyle=name?'#fff':'#65eaf4';fitFont(ctx,label,w-12,15,9,900);ctx.fillText(label,x+w/2,y+h-14);ctx.textAlign='left';
}
function fullMatch(ctx,x,y,w,h,title,a,b){
  const g=ctx.createLinearGradient(x,y,x,y+h);
  g.addColorStop(0,'#113eff');g.addColorStop(.45,'#09218e');g.addColorStop(1,'#05083f');
  fillR(ctx,x,y,w,h,9,g,'rgba(49,87,244,.76)',1.5);
  ctx.textAlign='center';ctx.fillStyle='#63eaf4';ctx.font=exactBodyFont(10,900);ctx.fillText(title,x+w/2,y+18);
  ctx.fillStyle='#fff';ctx.font=exactBodyFont(14,900);ctx.fillText(a,x+w/2,y+h*.36);
  ctx.fillStyle='#ff7624';ctx.fillRect(x+10,y+h/2,w-20,2);
  ctx.fillStyle='#fff';ctx.fillText(b,x+w/2,y+h*.78);ctx.textAlign='left';
}
async function fullPillar(ctx,x,y,w,h){
  const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,'rgba(13,57,205,.95)');g.addColorStop(.35,'rgba(7,21,104,.97)');g.addColorStop(1,'rgba(2,6,43,.98)');
  fillR(ctx,x,y,w,h,40,g,'rgba(38,72,178,.42)',2);
  await trophy(ctx,x+w*.22,y+h*.27,w*.56,h*.45);
}
async function drawFullR16(ctx,teams){
  const tw=130,th=118,lx=30,rx=W-30-tw;
  const ys=[190,310,432,552,790,910,1032,1152];

  for(let i=0;i<4;i++){
    const p=SEED16[i],b=i*2;
    await fullTile(ctx,p[0],teamAt(teams,p[0]),lx,ys[b],tw,th);
    await fullTile(ctx,p[1],teamAt(teams,p[1]),lx,ys[b+1],tw,th);
    neon(ctx,[[lx+tw,ys[b]+th/2],[lx+tw+25,ys[b]+th/2],[lx+tw+25,ys[b+1]+th/2],[lx+tw,ys[b+1]+th/2]]);
  }
  for(let i=4;i<8;i++){
    const p=SEED16[i],j=i-4,b=j*2;
    await fullTile(ctx,p[0],teamAt(teams,p[0]),rx,ys[b],tw,th);
    await fullTile(ctx,p[1],teamAt(teams,p[1]),rx,ys[b+1],tw,th);
    neon(ctx,[[rx,ys[b]+th/2],[rx-25,ys[b]+th/2],[rx-25,ys[b+1]+th/2],[rx,ys[b+1]+th/2]]);
  }

  const qw=142,qh=170,lq=198,rq=W-198-qw,qy=[340,920];
  fullMatch(ctx,lq,qy[0],qw,qh,'CUARTOS 1','GANADOR 1','GANADOR 2');
  fullMatch(ctx,lq,qy[1],qw,qh,'CUARTOS 2','GANADOR 3','GANADOR 4');
  fullMatch(ctx,rq,qy[0],qw,qh,'CUARTOS 3','GANADOR 5','GANADOR 6');
  fullMatch(ctx,rq,qy[1],qw,qh,'CUARTOS 4','GANADOR 7','GANADOR 8');

  neon(ctx,[[lx+tw+25,ys[0]+th],[lq,qy[0]+44]]);neon(ctx,[[lx+tw+25,ys[2]+th],[lq,qy[0]+126]]);
  neon(ctx,[[lx+tw+25,ys[4]+th],[lq,qy[1]+44]]);neon(ctx,[[lx+tw+25,ys[6]+th],[lq,qy[1]+126]]);
  neon(ctx,[[rx-25,ys[0]+th],[rq+qw,qy[0]+44]]);neon(ctx,[[rx-25,ys[2]+th],[rq+qw,qy[0]+126]]);
  neon(ctx,[[rx-25,ys[4]+th],[rq+qw,qy[1]+44]]);neon(ctx,[[rx-25,ys[6]+th],[rq+qw,qy[1]+126]]);

  const sw=142,sh=224,sy=606,ls=365,rs=W-365-sw;
  fullMatch(ctx,ls,sy,sw,sh,'SEMIFINAL 1','GANADOR QF1','GANADOR QF2');
  fullMatch(ctx,rs,sy,sw,sh,'SEMIFINAL 2','GANADOR QF3','GANADOR QF4');
  neon(ctx,[[lq+qw,qy[0]+qh/2],[ls,sy+55]]);neon(ctx,[[lq+qw,qy[1]+qh/2],[ls,sy+168]]);
  neon(ctx,[[rq,qy[0]+qh/2],[rs+sw,sy+55]]);neon(ctx,[[rq,qy[1]+qh/2],[rs+sw,sy+168]]);

  const fw=150,fh=420,fx=W/2-fw/2,fy=500;
  await fullPillar(ctx,fx,fy,fw,fh);
  neon(ctx,[[ls+sw,sy+sh/2],[fx,sy+sh/2]]);neon(ctx,[[rs,sy+sh/2],[fx+fw,sy+sh/2]]);
}
async function drawFullQF(ctx,teams){
  const tw=148,th=138,lx=34,rx=W-34-tw,ys=[315,462,945,1092],lp=[SEED8[0],SEED8[1]],rp=[SEED8[2],SEED8[3]];
  for(let i=0;i<2;i++){const p=lp[i],b=i*2;await fullTile(ctx,p[0],teamAt(teams,p[0]),lx,ys[b],tw,th);await fullTile(ctx,p[1],teamAt(teams,p[1]),lx,ys[b+1],tw,th);neon(ctx,[[lx+tw,ys[b]+th/2],[lx+tw+28,ys[b]+th/2],[lx+tw+28,ys[b+1]+th/2],[lx+tw,ys[b+1]+th/2]])}
  for(let i=0;i<2;i++){const p=rp[i],b=i*2;await fullTile(ctx,p[0],teamAt(teams,p[0]),rx,ys[b],tw,th);await fullTile(ctx,p[1],teamAt(teams,p[1]),rx,ys[b+1],tw,th);neon(ctx,[[rx,ys[b]+th/2],[rx-28,ys[b]+th/2],[rx-28,ys[b+1]+th/2],[rx,ys[b+1]+th/2]])}
  const sw=152,sh=224,sy=620,ls=335,rs=W-335-sw;fullMatch(ctx,ls,sy,sw,sh,'SEMIFINAL 1','GANADOR 1','GANADOR 2');fullMatch(ctx,rs,sy,sw,sh,'SEMIFINAL 2','GANADOR 3','GANADOR 4');
  const fw=160,fh=430,fx=W/2-fw/2,fy=505;await fullPillar(ctx,fx,fy,fw,fh);
  neon(ctx,[[lx+tw+28,440],[ls,sy+58]]);neon(ctx,[[lx+tw+28,1070],[ls,sy+167]]);
  neon(ctx,[[rx-28,440],[rs+sw,sy+58]]);neon(ctx,[[rx-28,1070],[rs+sw,sy+167]]);
  neon(ctx,[[ls+sw,sy+sh/2],[fx,sy+sh/2]]);neon(ctx,[[rs,sy+sh/2],[fx+fw,sy+sh/2]]);
}
async function drawFullSF(ctx,teams){
  const tw=170,th=155,lx=45,rx=W-45-tw,ys=[550,718];
  await fullTile(ctx,1,teamAt(teams,1),lx,ys[0],tw,th);await fullTile(ctx,4,teamAt(teams,4),lx,ys[1],tw,th);
  await fullTile(ctx,2,teamAt(teams,2),rx,ys[0],tw,th);await fullTile(ctx,3,teamAt(teams,3),rx,ys[1],tw,th);
  const fw=190,fh=455,fx=W/2-fw/2,fy=490;await fullPillar(ctx,fx,fy,fw,fh);
  neon(ctx,[[lx+tw,ys[0]+th/2],[lx+tw+36,ys[0]+th/2],[lx+tw+36,ys[1]+th/2],[lx+tw,ys[1]+th/2],[fx,636]]);
  neon(ctx,[[rx,ys[0]+th/2],[rx-36,ys[0]+th/2],[rx-36,ys[1]+th/2],[rx,ys[1]+th/2],[fx+fw,636]]);
}
async function drawFullFinal(ctx,teams){
  const tw=210,th=185,lx=60,rx=W-60-tw,y=660;
  await fullTile(ctx,1,teamAt(teams,1),lx,y,tw,th);await fullTile(ctx,2,teamAt(teams,2),rx,y,tw,th);
  const fw=220,fh=480,fx=W/2-fw/2,fy=465;await fullPillar(ctx,fx,fy,fw,fh);
  neon(ctx,[[lx+tw,y+th/2],[fx,y+th/2]]);neon(ctx,[[rx,y+th/2],[fx+fw,y+th/2]]);
}
async function renderFull(ctx,meta,stage,teams){
  fullBackground(ctx);await fullHeader(ctx,meta,stage);
  if(stage==='r16')await drawFullR16(ctx,teams);else if(stage==='qf')await drawFullQF(ctx,teams);else if(stage==='sf')await drawFullSF(ctx,teams);else await drawFullFinal(ctx,teams);
  drawLeagueFooter(ctx);
}

async function renderCanvas(canvas,page,design,scale){
  scale=scale||1;
  canvas.width=Math.round(W*scale);canvas.height=Math.round(H*scale);
  const ctx=canvas.getContext('2d');ctx.setTransform(scale,0,0,scale,0,0);
  const cat=page.querySelector('[data-v651-cat]')?.value||currentCategory(),meta=catMeta(cat),stage=resolvedStage(page),teams=slotValues(page);
  if(design==='full')await renderFull(ctx,meta,stage,teams);else await renderRound(ctx,meta,stage,teams);
  return canvas;
}
function refreshSelectedCards(page){
  const design=selectedDesign(page);
  page.querySelectorAll('[data-v651-design]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.v651Design===design));
  const meta=page.querySelector('[data-v651-current-name]');if(meta)meta.textContent=DESIGNS[design].name;
}
function queueAllPreviews(page){
  const token=++previewToken;clearTimeout(previewTimer);
  previewTimer=setTimeout(async()=>{
    if(token!==previewToken||!page.isConnected)return;
    try{
      const a=page.querySelector('[data-v651-preview-round]'),b=page.querySelector('[data-v651-preview-full]'),main=page.querySelector('[data-v651-preview-main]');
      if(a)await renderCanvas(a,page,'round',.36);
      if(b)await renderCanvas(b,page,'full',.36);
      if(main)await renderCanvas(main,page,selectedDesign(page),.65);
    }catch(e){console.warn('V651 preview',e)}
  },80);
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
  if(!validateUnique(page))return;
  setStatus(page,'Generando PNG HD del diseño seleccionado…');
  try{
    const c=document.createElement('canvas'),design=selectedDesign(page);await renderCanvas(c,page,design,2);
    const stage=resolvedStage(page),meta=catMeta(page.querySelector('[data-v651-cat]').value);
    download(await blobFromCanvas(c),'Liga_Juventino_'+DESIGNS[design].slug+'_'+slug(STAGES[stage].name)+'_'+slug(meta.name)+'_HD.png');
    setStatus(page,'PNG HD generado correctamente.');
  }catch(e){console.warn(e);setStatus(page,'No se pudo generar el PNG.',true)}
}
function loadJsPDF(){
  if(window.jspdf?.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((res,rej)=>{let s=document.querySelector('script[data-v651-jspdf]');if(!s){s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';s.async=true;s.dataset.v651Jspdf='1';document.head.appendChild(s)}const ok=()=>window.jspdf?.jsPDF?res(window.jspdf.jsPDF):rej(new Error('jsPDF'));s.addEventListener('load',ok,{once:true});s.addEventListener('error',rej,{once:true});if(window.jspdf?.jsPDF)ok()});
}
async function exportPdf(page){
  if(!validateUnique(page))return;
  setStatus(page,'Generando PDF del diseño seleccionado…');
  try{
    const c=document.createElement('canvas'),design=selectedDesign(page);await renderCanvas(c,page,design,2);
    const JS=await loadJsPDF(),pdf=new JS({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,210,262.6,undefined,'FAST');
    const stage=resolvedStage(page),meta=catMeta(page.querySelector('[data-v651-cat]').value);
    pdf.save('Liga_Juventino_'+DESIGNS[design].slug+'_'+slug(STAGES[stage].name)+'_'+slug(meta.name)+'.pdf');
    setStatus(page,'PDF generado correctamente.');
  }catch(e){console.warn(e);setStatus(page,'No se pudo generar el PDF.',true)}
}

async function mount(){
  if(route()!=='bracketBuilder')return;injectCss();
  const page=document.querySelector('#screen .v64-page');if(!page||page.dataset.v651==='1')return;
  await ensureData();if(route()!=='bracketBuilder'||!page.isConnected)return;
  const cat=currentCategory(),meta=catMeta(cat),design=String(localStorage.getItem('v651-bracket-design')||'round');
  page.dataset.v651='1';page.dataset.v651Design=DESIGNS[design]?design:'round';page.dataset.v643='2';
  page.innerHTML=
    '<section class="v651-hero"><div class="v651-brand"><img src="'+esc(LEAGUE_LOGO)+'" alt=""><span><small>LIGA JUVENTINO ROSAS</small><h1>Generador de Bracket</h1></span></div><p>Dos diseños rehechos con la misma composición de tus referencias: solo cambian los nombres, logos, categoría y datos de la Liga.</p></section>'+
    '<section class="v651-controls"><div class="v651-catrow"><span class="v651-catlogo"><img data-v651-cat-logo src="'+esc(meta.logo)+'" alt=""></span><div class="v651-grid">'+
      '<label>CATEGORÍA<select data-v651-cat>'+CATS.map(c=>'<option value="'+c.id+'" '+(c.id===cat?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></label>'+
      '<label>ETAPA<select data-v651-stage><option value="auto">Automático</option><option value="r16">Octavos de final</option><option value="qf">Cuartos de final</option><option value="sf">Semifinales</option><option value="final">Final</option></select></label>'+
    '</div></div><div class="v651-auto" data-v651-auto></div></section>'+
    '<div class="v651-actions"><button type="button" class="v651-soft" data-v651-autofill>Clasificar equipos</button><button type="button" class="v651-soft" data-v651-clear>Limpiar</button></div>'+
    '<div class="v651-title"><span><small>CLASIFICADOS</small><b data-v651-slot-title></b></span><em data-v651-slot-hint></em></div>'+
    '<section class="v651-slots" data-v651-slots></section>'+
    '<div class="v651-title"><span><small>ELIGE DISEÑO</small><b>Dos vistas previas</b></span><em>Toca una para usarla<br>al generar PNG/PDF</em></div>'+
    '<section class="v651-designs">'+
      '<button type="button" class="v651-design-card" data-v651-design="round"><canvas data-v651-preview-round></canvas><span><b>Diseño 1 · Round of 16</b><i>VISTA PREVIA</i></span></button>'+
      '<button type="button" class="v651-design-card" data-v651-design="full"><canvas data-v651-preview-full></canvas><span><b>Diseño 2 · Full Bracket</b><i>VISTA PREVIA</i></span></button>'+
    '</section>'+
    '<div class="v651-title"><span><small>VISTA PREVIA GRANDE</small><b data-v651-current-name></b></span><em>Trofeo central<br>logos y nombres</em></div>'+
    '<section class="v651-current"><canvas data-v651-preview-main></canvas><div class="v651-current-meta"><span>Diseño seleccionado</span><b>PNG HD · PDF</b></div></section>'+
    '<div class="v651-export"><button type="button" data-v651-png>Generar PNG HD</button><button type="button" data-v651-pdf>Generar PDF</button></div><div class="v651-status" data-v651-status aria-live="polite"></div>';

  const catSel=page.querySelector('[data-v651-cat]'),stageSel=page.querySelector('[data-v651-stage]');
  stageSel.value=String(localStorage.getItem('v651-bracket-stage')||'auto');
  if(stageSel.value!=='auto'&&!STAGES[stageSel.value])stageSel.value='auto';

  renderSlots(page,false);autoFill(page);refreshSelectedCards(page);
  catSel.addEventListener('change',()=>{
    const id=catSel.value,m=catMeta(id);try{localStorage.setItem('v651-bracket-cat',id);localStorage.setItem('v62-category',id)}catch(_){}
    page.querySelector('[data-v651-cat-logo]').src=m.logo;renderSlots(page,false);autoFill(page);stageInfo(page);
  });
  stageSel.addEventListener('change',()=>{
    try{localStorage.setItem('v651-bracket-stage',stageSel.value)}catch(_){}
    renderSlots(page,true);stageInfo(page);autoFill(page);
  });
  page.querySelector('[data-v651-autofill]').addEventListener('click',()=>autoFill(page));
  page.querySelector('[data-v651-clear]').addEventListener('click',()=>{page.querySelectorAll('[data-v651-place]').forEach(s=>{s.value='';updateSlotLogo(s)});syncNoDuplicates(page);setStatus(page,'Selección limpiada.');queueAllPreviews(page)});
  page.querySelectorAll('[data-v651-design]').forEach(btn=>btn.addEventListener('click',()=>{
    page.dataset.v651Design=btn.dataset.v651Design;try{localStorage.setItem('v651-bracket-design',btn.dataset.v651Design)}catch(_){}
    refreshSelectedCards(page);queueAllPreviews(page);setStatus(page,DESIGNS[btn.dataset.v651Design].name+' seleccionado.');
  }));
  page.querySelector('[data-v651-png]').addEventListener('click',()=>exportPng(page));
  page.querySelector('[data-v651-pdf]').addEventListener('click',()=>exportPdf(page));
  stageInfo(page);queueAllPreviews(page);
}
function schedule(){clearTimeout(mountTimer);mountTimer=setTimeout(mount,45)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.getElementById('screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();setTimeout(mount,300);setTimeout(mount,900);
})();
