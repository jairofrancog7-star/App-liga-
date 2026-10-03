/* V643 — Generador de Cuadro Final por categoría + PNG/PDF.
   Mantiene la ruta #/bracketBuilder, filtra equipos oficiales por categoría,
   reutiliza logos reales y exporta el cuadro con el lenguaje visual de Competición/Simulador. */
(function(){
'use strict';
if(window.__LJR_V648_BRACKET_EXPORT__)return;
window.__LJR_V648_BRACKET_EXPORT__=true;

const BUILD='20261003-v648-professional-portrait-bracket';
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
    '.v643-cat-logo{width:54px;height:54px;border-radius:16px;background:#080d66;border:1px solid rgba(79,112,255,.58);display:grid;place-items:center}.v643-cat-logo img{width:46px;height:46px;object-fit:contain}.v643-cat-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v643-cat-fields label{display:block;color:#58e8f4;font-size:10px;font-weight:900;letter-spacing:.08em;margin:0 0 6px 2px}.v643-cat-fields select{width:100%;height:46px;border:1px solid #3546ba;border-radius:14px;background:#101474;color:#fff;padding:0 30px 0 10px;font-weight:850;font-size:12px;outline:none;}',
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
function v647StageValue(page){
  const v=String(page?.querySelector('[data-v647-stage]')?.value||localStorage.getItem('v647-bracket-stage')||'quarter');
  return STAGES[v]?v:'quarter';
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
  const stage=v647StageValue(page),count=STAGES[stage].slots;
  host.innerHTML=Array.from({length:count},(_,i)=>{
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


function v647DrawFooter(ctx,meta,W,H){
  const y=H-118;
  ctx.fillStyle='rgba(255,255,255,.10)';ctx.fillRect(58,y-30,W-116,2);
  ctx.fillStyle='#55e9f4';ctx.font='900 15px Arial';ctx.fillText('TORNEO DE COPA · '+meta.name.toUpperCase(),58,y+8);
  ctx.fillStyle='#b4c0ef';ctx.font='800 13px Arial';ctx.fillText(new Date().toLocaleDateString('es-MX'),58,y+36);
  ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='900 13px Arial';ctx.fillText('LJR',W-58,y+8);ctx.textAlign='left';
}
async function v647Trophy(ctx,x,y,w,h){
  let trophy=await imageLoad(TROPHY);
  if(!trophy)trophy=await imageLoad(TROPHY_FALLBACK);
  if(trophy){
    ctx.save();
    ctx.shadowColor='rgba(71,231,255,.66)';ctx.shadowBlur=30;
    drawContain(ctx,trophy,x,y,w,h);
    ctx.restore();
  }
}
function v648ProBackground(ctx,W,H){
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#06146f');bg.addColorStop(.42,'#03095c');bg.addColorStop(1,'#01022f');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  const g1=ctx.createRadialGradient(W*.5,H*.52,40,W*.5,H*.52,W*.55);
  g1.addColorStop(0,'rgba(23,82,255,.32)');g1.addColorStop(.45,'rgba(0,225,245,.08)');g1.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g1;ctx.fillRect(0,0,W,H);

  ctx.save();ctx.globalAlpha=.09;ctx.strokeStyle='#39dff0';ctx.lineWidth=2;
  for(let x=-H;x<W+H;x+=155){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-H*.46,H);ctx.stroke()}
  ctx.restore();

  ctx.save();ctx.globalAlpha=.14;ctx.strokeStyle='#405cff';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(W/2,H*.54,410,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(W/2,H*.54,300,0,Math.PI*2);ctx.stroke();
  ctx.restore();

  const top=ctx.createLinearGradient(0,0,W,0);
  top.addColorStop(0,'rgba(18,76,255,.0)');top.addColorStop(.5,'rgba(18,76,255,.34)');top.addColorStop(1,'rgba(18,76,255,.0)');
  ctx.fillStyle=top;ctx.fillRect(0,235,W,2);
}
async function v648ProHeader(ctx,W,meta,stage){
  const league=await imageLoad(LEAGUE_LOGO),cat=await imageLoad(meta.logo);
  if(league)drawContain(ctx,league,55,48,88,88);
  if(cat)drawContain(ctx,cat,W-143,48,88,88);

  ctx.textAlign='center';
  ctx.fillStyle='#55e9f4';ctx.font='900 16px Arial';ctx.fillText('LIGA JUVENTINO ROSAS',W/2,68);
  ctx.fillStyle='#fff';ctx.font='900 54px Arial';ctx.fillText('CUADRO DE ',W/2-90,132);
  ctx.fillStyle='#31e2f0';ctx.font='900 54px Arial';ctx.fillText('COPA',W/2+205,132);
  ctx.fillStyle='#c8d2ff';ctx.font='800 19px Arial';ctx.fillText(meta.name+' · '+(stage==='semi'?'Semifinales':stage==='final'?'Gran Final':'Cuartos de final'),W/2,174);
  ctx.textAlign='left';
}
function v648Stroke(ctx,x1,y1,x2,y2){
  ctx.save();ctx.strokeStyle='#37e3ef';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.shadowColor='rgba(55,227,239,.65)';ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
}
function v648BracketJoin(ctx,x,y1,y2,outX,outY,side){
  const mid=side==='left'?x+34:x-34;
  ctx.save();ctx.strokeStyle='#37e3ef';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.shadowColor='rgba(55,227,239,.58)';ctx.shadowBlur=9;
  ctx.beginPath();
  ctx.moveTo(x,y1);ctx.lineTo(mid,y1);
  ctx.moveTo(x,y2);ctx.lineTo(mid,y2);
  ctx.moveTo(mid,y1);ctx.lineTo(mid,y2);
  ctx.moveTo(mid,outY);ctx.lineTo(outX,outY);
  ctx.stroke();ctx.restore();
}
async function v648TeamCard(ctx,num,name,x,y,w,h,align){
  const grad=ctx.createLinearGradient(x,y,x+w,y);
  if(align==='right'){grad.addColorStop(0,'#11196d');grad.addColorStop(1,'#123bdf')}
  else{grad.addColorStop(0,'#123bdf');grad.addColorStop(1,'#11196d')}
  fillR(ctx,x,y,w,h,13,grad,'rgba(76,118,255,.92)');

  const logo=await imageLoad(teamLogo(name));
  const box=h-18;
  const bx=align==='right'?x+w-box-10:x+10;
  fillR(ctx,bx,y+9,box,box,10,'rgba(5,11,70,.88)','rgba(88,116,231,.7)');
  if(logo)drawContain(ctx,logo,bx+5,y+14,box-10,box-10);

  const label=name||'Por confirmar';
  const tx=align==='right'?x+14:x+box+25;
  const max=align==='right'?w-box-45:w-box-45;
  ctx.fillStyle='#7af1f6';ctx.font='900 12px Arial';
  if(align==='right'){ctx.textAlign='right';ctx.fillText(String(num),x+w-box-22,y+20)}
  else{ctx.textAlign='left';ctx.fillText(String(num),tx,y+20)}
  ctx.fillStyle='#fff';
  fitFont(ctx,label,max,20,12,900);
  if(align==='right'){ctx.textAlign='left';ctx.fillText(label,x+16,y+h-15)}
  else{ctx.textAlign='left';ctx.fillText(label,tx,y+h-15)}
  ctx.textAlign='left';
}
function v648MiniPanel(ctx,x,y,w,h,title,line1,line2,align){
  const grad=ctx.createLinearGradient(x,y,x+w,y+h);
  grad.addColorStop(0,'rgba(16,35,160,.98)');grad.addColorStop(1,'rgba(11,17,104,.98)');
  fillR(ctx,x,y,w,h,18,grad,'rgba(75,106,245,.9)');
  ctx.fillStyle='#60eaf4';ctx.font='900 12px Arial';ctx.fillText(title,x+16,y+24);
  ctx.fillStyle='#fff';ctx.font='900 16px Arial';ctx.fillText(line1,x+16,y+58);
  ctx.fillStyle='#b8c5f4';ctx.font='800 12px Arial';ctx.fillText(line2,x+16,y+84);
  ctx.fillStyle='rgba(47,225,240,.28)';fillR(ctx,x+16,y+h-22,w-32,6,3,'rgba(47,225,240,.28)');
}
async function v648CenterTrophy(ctx,W,H,label){
  const cx=W/2;
  ctx.save();
  const glow=ctx.createRadialGradient(cx,H*.53,10,cx,H*.53,245);
  glow.addColorStop(0,'rgba(28,92,255,.42)');glow.addColorStop(.62,'rgba(0,226,246,.08)');glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(cx-270,H*.53-270,540,540);
  ctx.restore();

  ctx.textAlign='center';
  ctx.fillStyle='#65edf5';ctx.font='900 13px Arial';ctx.fillText(label||'GRAN FINAL',cx,H*.48-100);
  ctx.fillStyle='#fff';ctx.font='900 25px Arial';ctx.fillText('TORNEO DE COPA',cx,H*.48-67);
  ctx.textAlign='left';
  await v647Trophy(ctx,cx-105,H*.48-35,210,260);
}
async function v648DrawQuarter(ctx,W,H,teams){
  const leftX=56,rightX=W-386,cardW=330,cardH=84;
  const topA=360,topB=462,bottomA=1080,bottomB=1182;
  await v648TeamCard(ctx,1,teams[0],leftX,topA,cardW,cardH,'left');
  await v648TeamCard(ctx,8,teams[7],leftX,topB,cardW,cardH,'left');
  await v648TeamCard(ctx,4,teams[3],leftX,bottomA,cardW,cardH,'left');
  await v648TeamCard(ctx,5,teams[4],leftX,bottomB,cardW,cardH,'left');

  await v648TeamCard(ctx,2,teams[1],rightX,topA,cardW,cardH,'right');
  await v648TeamCard(ctx,7,teams[6],rightX,topB,cardW,cardH,'right');
  await v648TeamCard(ctx,3,teams[2],rightX,bottomA,cardW,cardH,'right');
  await v648TeamCard(ctx,6,teams[5],rightX,bottomB,cardW,cardH,'right');

  const lpX=425,rpX=W-425-190,py=720,pw=190,ph=116;
  v648MiniPanel(ctx,lpX,py,pw,ph,'SEMIFINAL 1','GANADORES','Cruce 1 vs Cruce 2');
  v648MiniPanel(ctx,rpX,py,pw,ph,'SEMIFINAL 2','GANADORES','Cruce 3 vs Cruce 4');

  v648BracketJoin(ctx,leftX+cardW,topA+cardH/2,topB+cardH/2,lpX,py+42,'left');
  v648BracketJoin(ctx,leftX+cardW,bottomA+cardH/2,bottomB+cardH/2,lpX,py+78,'left');
  v648BracketJoin(ctx,rightX,topA+cardH/2,topB+cardH/2,rpX+pw,py+42,'right');
  v648BracketJoin(ctx,rightX,bottomA+cardH/2,bottomB+cardH/2,rpX+pw,py+78,'right');

  v648Stroke(ctx,lpX+pw,py+ph/2,W/2-125,py+ph/2);
  v648Stroke(ctx,rpX,py+ph/2,W/2+125,py+ph/2);
  await v648CenterTrophy(ctx,W,H,'GRAN FINAL');
}
async function v648DrawSemi(ctx,W,H,teams){
  const leftX=70,rightX=W-430,cardW=360,cardH=92;
  const y1=565,y2=690;
  await v648TeamCard(ctx,1,teams[0],leftX,y1,cardW,cardH,'left');
  await v648TeamCard(ctx,2,teams[1],leftX,y2,cardW,cardH,'left');
  await v648TeamCard(ctx,3,teams[2],rightX,y1,cardW,cardH,'right');
  await v648TeamCard(ctx,4,teams[3],rightX,y2,cardW,cardH,'right');

  const lcY=(y1+y2+cardH)/2, rcY=lcY;
  v648BracketJoin(ctx,leftX+cardW,y1+cardH/2,y2+cardH/2,W/2-120,lcY,'left');
  v648BracketJoin(ctx,rightX,y1+cardH/2,y2+cardH/2,W/2+120,rcY,'right');
  await v648CenterTrophy(ctx,W,H,'GRAN FINAL');
}
async function v648DrawFinal(ctx,W,H,teams){
  const cardW=390,cardH=104,y=760,leftX=70,rightX=W-460;
  await v648TeamCard(ctx,1,teams[0],leftX,y,cardW,cardH,'left');
  await v648TeamCard(ctx,2,teams[1],rightX,y,cardW,cardH,'right');
  v648Stroke(ctx,leftX+cardW,y+cardH/2,W/2-135,y+cardH/2);
  v648Stroke(ctx,rightX,y+cardH/2,W/2+135,y+cardH/2);
  await v648CenterTrophy(ctx,W,H,'GRAN FINAL');
}
async function drawBracket(canvas,page){
  const W=1350,H=1688,S=2;
  canvas.width=W*S;canvas.height=H*S;
  const ctx=canvas.getContext('2d');
  ctx.setTransform(S,0,0,S,0,0);

  const cat=String(page.querySelector('[data-v643-cat]')?.value||currentCategory());
  const meta=catMeta(cat),teams=slotValues(page),stage=v647StageValue(page);

  v648ProBackground(ctx,W,H);
  await v648ProHeader(ctx,W,meta,stage);

  if(stage==='semi')await v648DrawSemi(ctx,W,H,teams);
  else if(stage==='final')await v648DrawFinal(ctx,W,H,teams);
  else await v648DrawQuarter(ctx,W,H,teams);

  v647DrawFooter(ctx,meta,W,H);
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
    download(b,'Liga_Juventino_Copa_'+slug(STAGES[v647StageValue(page)].name)+'_'+slug(catMeta(page.querySelector('[data-v643-cat]').value).name)+'.png');
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
    const pdf=new JS({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,210,262.6,undefined,'FAST');
    const name='Liga_Juventino_Copa_'+slug(STAGES[v647StageValue(page)].name)+'_'+slug(catMeta(page.querySelector('[data-v643-cat]').value).name)+'.pdf';
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
      '<p>Selecciona la categoría, la etapa y los equipos. El generador evita repetidos y exporta PNG/PDF en alta resolución.</p>'+
    '</section>'+
    '<section class="v643-cat-card">'+
      '<span class="v643-cat-logo"><img data-v643-cat-logo src="'+esc(meta.logo)+'" alt=""></span>'+
      '<div class="v643-cat-fields"><label>CATEGORÍA<select data-v643-cat>'+CATS.map(c=>'<option value="'+c.id+'" '+(c.id===cat?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></label><label>ETAPA<select data-v647-stage><option value="quarter">Cuartos de final</option><option value="semi">Semifinales</option><option value="final">Final</option></select></label></div>'+
    '</section>'+
    '<div class="v643-top-actions"><button type="button" class="v643-soft-btn" data-v643-top8>Cargar clasificación</button><button type="button" class="v643-soft-btn" data-v643-clear>Limpiar</button></div>'+
    '<div class="v643-section-title"><span><small>CLASIFICADOS</small><b data-v647-slot-title>Lugares 1–8</b></span><em data-v647-slot-hint>Sin equipos repetidos<br>Cuartos de final</em></div>'+
    '<section class="v643-slots" data-v643-slots></section>'+
    '<div class="v643-section-title"><span><small>VISTA PREVIA</small><b>Cuadro final</b></span><em>Diseño profesional tipo bracket</em></div>'+
    '<section class="v643-preview-card"><canvas data-v643-preview width="2700" height="3376"></canvas><div class="v643-preview-note"><span>Bracket profesional + logos oficiales</span><b>Trofeo central</b></div></section>'+
    '<div class="v643-export"><button type="button" data-v643-png>Generar PNG HD</button><button type="button" data-v643-pdf>Generar PDF</button></div>'+
    '<div class="v643-status" data-v643-status aria-live="polite"></div>';

  const catSel=page.querySelector('[data-v643-cat]');
  const stageSel=page.querySelector('[data-v647-stage]');
  const savedStage=String(localStorage.getItem('v647-bracket-stage')||'quarter');
  stageSel.value=STAGES[savedStage]?savedStage:'quarter';
  const syncStageCopy=()=>{
    const st=v647StageValue(page),n=STAGES[st].slots;
    const t=page.querySelector('[data-v647-slot-title]'),h=page.querySelector('[data-v647-slot-hint]'),b=page.querySelector('[data-v643-top8]');
    if(t)t.textContent=n===8?'Lugares 1–8':n===4?'Semifinalistas 1–4':'Finalistas 1–2';
    if(h)h.innerHTML='Sin equipos repetidos<br>'+STAGES[st].name;
    if(b)b.textContent='Cargar Top '+n+' de clasificación';
  };
  renderSlots(page,cat,false);
  syncStageCopy();
  catSel.addEventListener('change',()=>{
    const id=catSel.value,m=catMeta(id);
    try{localStorage.setItem('v643-bracket-cat',id);localStorage.setItem('v62-category',id)}catch(_){}
    const im=page.querySelector('[data-v643-cat-logo]');if(im)im.src=m.logo;
    renderSlots(page,id,false);syncStageCopy();queuePreview(page);
  });
  stageSel.addEventListener('change',()=>{
    try{localStorage.setItem('v647-bracket-stage',stageSel.value)}catch(_){}
    renderSlots(page,catSel.value,true);syncStageCopy();queuePreview(page);
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
