/* V415 — Calendario referencia: calendario visual con escudos, meses y tarjeta de partido.
   Sólo reemplaza #/v4-calendar. Usa datos oficiales ya publicados y conserva la navegación global. */
(function(){
'use strict';
if(window.__LJR_V415_CALENDAR_REFERENCE__)return;
window.__LJR_V415_CALENDAR_REFERENCE__=true;

const ROUTES=new Set(['v4-calendar','calendar','monthlyCalendar','calendarMonthly']);
const isCalendarRoute=()=>ROUTES.has(route());
const OFFICIAL='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const CATEGORY_ORDER=['3','5','4','2','1'];
const CATEGORY_FALLBACK={
  '3':'Primera Fuerza',
  '5':'Intermedia',
  '4':'Segunda Fuerza',
  '2':'Veteranos 35+',
  '1':'Veteranos 50+'
};
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
let viewDate=new Date();
let selectedIso='';
let selectedCategory='all';
let filterOpen=false;
let rendering=false;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const screen=()=>document.getElementById('screen');
const pad=n=>String(n).padStart(2,'0');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

async function loadOfficial(){
  if(db?.categories)return db;
  if(loading)return loading;
  loading=fetch(OFFICIAL+'?v=20260930-v415',{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(x=>{if(x){db=x;window.LJR_OFFICIAL_DATA=x}return db})
    .catch(()=>null)
    .finally(()=>{loading=null});
  return loading;
}

function fixtureDate(value){
  const m=String(value||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  return {
    day:+m[1],month:+m[2]-1,year:+m[3],
    time:(m[4]&&m[5])?pad(m[4])+':'+m[5]:'Por confirmar',
    iso:m[3]+'-'+pad(m[2])+'-'+pad(m[1])
  };
}

function logoFor(name){
  let src='';
  try{src=window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){}
  if(src)return src;
  try{src=window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){}
  if(src)return src;
  const logos=db?.team_logos||{};
  const key=Object.keys(logos).find(k=>norm(k)===norm(name));
  const item=key?logos[key]:null;
  const path=typeof item==='string'?item:(item?.local||item?.source||item?.url||'');
  if(!path)return '';
  if(/^https?:/i.test(path))return path;
  return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(path).replace(/^\.\//,'');
}

function games(categoryId=selectedCategory){
  const out=[];
  const cats=db?.categories||{};
  CATEGORY_ORDER.forEach(catId=>{
    if(categoryId!=='all'&&String(categoryId)!==String(catId))return;
    const cat=cats[catId]||{};
    (cat.fixtures||[]).forEach((group,groupIndex)=>{
      (group?.rows||[]).forEach((r,rowIndex)=>{
        if(!r?.[2]||!r?.[6])return;
        const d=fixtureDate(r?.[8]); if(!d)return;
        const hs=String(r?.[3]??'').trim();
        const as=String(r?.[5]??'').trim();
        const score=/^\d+$/.test(hs)&&/^\d+$/.test(as);
        const status=String(r?.[10]??'').trim();
        const played=score||/\bJUGADO\b|FINALIZADO|FINAL/i.test(status);
        out.push({
          id:'v415-'+catId+'-'+groupIndex+'-'+rowIndex,
          categoryId:String(catId),
          category:String(cat.name||CATEGORY_FALLBACK[catId]||'Categoría').trim(),
          round:String(r?.[1]||'').trim(),
          home:String(r?.[2]||'').trim(),
          away:String(r?.[6]||'').trim(),
          homeScore:/^\d+$/.test(hs)?hs:'',
          awayScore:/^\d+$/.test(as)?as:'',
          score,played,status,
          venue:String(r?.[7]||'Campo por confirmar').trim()||'Campo por confirmar',
          ...d
        });
      });
    });
  });
  return out.sort((a,b)=>(a.iso+a.time+a.category).localeCompare(b.iso+b.time+b.category));
}

function categoryLabel(id=selectedCategory){
  if(id==='all')return 'Todas';
  return db?.categories?.[id]?.name||CATEGORY_FALLBACK[id]||'Categoría';
}

function monthName(m){
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][m]||'Mes';
}

function shortDate(iso){
  const p=String(iso||'').split('-');
  if(p.length!==3)return iso;
  const d=new Date(+p[0],+p[1]-1,+p[2]);
  const days=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const months=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return days[d.getDay()]+' '+(+p[2])+' '+months[+p[1]-1];
}

function logoMarkup(name,cls=''){
  const src=logoFor(name);
  if(src)return '<span class="v415-logo '+cls+'"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  const initials=String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="v415-logo v415-logo-fallback '+cls+'" aria-label="'+esc(name)+'">'+esc(initials||'EQ')+'</span>';
}

function topTabs(){
  return '<div class="v415-top-row">'+
    '<div class="v415-segment" role="tablist" aria-label="Secciones">'+
      '<button type="button" class="active" role="tab" aria-selected="true">Calendario</button>'+
      '<button type="button" data-v415-go="standings" role="tab">Clasificación</button>'+
      '<button type="button" data-v415-go="teams" role="tab">Plantilla</button>'+
    '</div>'+
    '<button type="button" class="v415-filter'+(filterOpen?' active':'')+'" data-v415-filter aria-label="Filtrar por categoría" aria-expanded="'+(filterOpen?'true':'false')+'">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>'+
    '</button>'+
  '</div>';
}

function categoryPanel(){
  if(!filterOpen)return '';
  const available=CATEGORY_ORDER.filter(id=>db?.categories?.[id]);
  return '<div class="v415-filter-panel" aria-label="Categorías">'+
    [['all','Todas'],...available.map(id=>[id,categoryLabel(id)])].map(([id,label])=>
      '<button type="button" class="'+(selectedCategory===id?'active':'')+'" data-v415-category="'+esc(id)+'">'+esc(label)+'</button>'
    ).join('')+
  '</div>';
}

function monthStrip(){
  const y=viewDate.getFullYear(),m=viewDate.getMonth();
  const months=[];
  for(let delta=-3;delta<=2;delta++){
    const d=new Date(y,m+delta,1);
    months.push({year:d.getFullYear(),month:d.getMonth()});
  }
  return '<div class="v415-month-strip" role="tablist" aria-label="Meses">'+
    months.map(x=>'<button type="button" class="'+(x.year===y&&x.month===m?'active':'')+'" data-v415-month="'+x.year+'-'+x.month+'" role="tab" aria-selected="'+(x.year===y&&x.month===m?'true':'false')+'">'+monthName(x.month)+'</button>').join('')+
  '</div><div class="v415-month-line"><i></i></div>';
}

function dayLogoStack(dayGames){
  const names=[];
  dayGames.forEach(g=>{[g.home,g.away].forEach(n=>{if(n&&!names.some(x=>norm(x)===norm(n)))names.push(n)})});
  const shown=names.slice(0,2);
  let html='<span class="v415-day-logos">'+shown.map((n,i)=>logoMarkup(n,i?'is-second':'')).join('')+'</span>';
  if(dayGames.length>1){
    html+='<span class="v415-day-dots" aria-label="'+dayGames.length+' partidos">'+
      Array.from({length:Math.min(3,dayGames.length)},(_,i)=>'<i'+(i===0?' class="on"':'')+'></i>').join('')+
    '</span>';
  }
  return html;
}

function calendarGrid(monthGames){
  const y=viewDate.getFullYear(),m=viewDate.getMonth();
  const first=new Date(y,m,1);
  const daysInMonth=new Date(y,m+1,0).getDate();
  const offset=first.getDay(); // domingo primero, como la referencia
  const byDay=new Map();
  monthGames.forEach(g=>{
    if(!byDay.has(g.day))byDay.set(g.day,[]);
    byDay.get(g.day).push(g);
  });

  let cells='';
  for(let i=0;i<offset;i++)cells+='<span class="v415-day empty" aria-hidden="true"></span>';
  for(let d=1;d<=daysInMonth;d++){
    const iso=y+'-'+pad(m+1)+'-'+pad(d);
    const list=byDay.get(d)||[];
    cells+='<button type="button" class="v415-day'+(list.length?' has-match':'')+(selectedIso===iso?' selected':'')+'" data-v415-date="'+iso+'" aria-label="'+d+' de '+monthName(m)+(list.length?', '+list.length+' partido'+(list.length>1?'s':''):'')+'">'+
      '<span class="v415-day-number">'+d+'</span>'+
      (list.length?dayLogoStack(list):'')+
    '</button>';
  }
  return '<div class="v415-week">'+['D','L','M','X','J','V','S'].map(d=>'<b>'+d+'</b>').join('')+'</div>'+
    '<div class="v415-grid">'+cells+'</div>';
}

function statusText(g){
  if(g.score)return 'Finalizado';
  if(g.played)return 'Jugado';
  return 'Programado';
}

function matchCard(g){
  const center=g.score?esc(g.homeScore)+' <span>–</span> '+esc(g.awayScore):esc(g.time);
  return '<article class="v415-match-card">'+
    '<div class="v415-match-meta"><b>'+esc(g.category)+'</b><span>·</span><span>'+esc(g.round?'Jornada '+g.round:'Partido oficial')+'</span></div>'+
    '<div class="v415-match-date">'+esc(shortDate(g.iso))+(g.score?'':' · '+esc(g.time))+'</div>'+
    '<div class="v415-match-main">'+
      '<div class="v415-match-team">'+logoMarkup(g.home,'large')+'<b>'+esc(g.home)+'</b></div>'+
      '<div class="v415-match-center"><strong>'+center+'</strong><small class="'+(g.score||g.played?'done':'scheduled')+'">'+statusText(g)+'</small></div>'+
      '<div class="v415-match-team">'+logoMarkup(g.away,'large')+'<b>'+esc(g.away)+'</b></div>'+
    '</div>'+
    '<button type="button" class="v415-venue" data-v415-go="matches"><span>Área de partido</span><small>'+esc(g.venue)+'</small></button>'+
  '</article>';
}

function selectedMatches(allGames){
  const list=allGames.filter(g=>g.iso===selectedIso);
  if(!list.length){
    return '<section class="v415-selected">'+
      '<div class="v415-selected-head"><b>'+esc(shortDate(selectedIso))+'</b><span>'+esc(categoryLabel())+'</span></div>'+
      '<div class="v415-empty">No hay partidos oficiales publicados para esta fecha.</div>'+
    '</section>';
  }
  return '<section class="v415-selected">'+
    '<div class="v415-selected-head"><b>'+esc(shortDate(selectedIso))+'</b><span>'+esc(categoryLabel())+'</span></div>'+
    '<div class="v415-match-list">'+list.map(matchCard).join('')+'</div>'+
  '</section>';
}

function pickSelected(allGames){
  const y=viewDate.getFullYear(),m=viewDate.getMonth();
  const prefix=y+'-'+pad(m+1)+'-';
  if(selectedIso.startsWith(prefix))return;
  const inMonth=allGames.filter(g=>g.year===y&&g.month===m);
  const now=new Date();
  const todayIso=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate());
  const todayHas=inMonth.some(g=>g.iso===todayIso);
  if(todayHas){selectedIso=todayIso;return;}
  selectedIso=inMonth[0]?.iso||prefix+'01';
}

function bind(root){
  root.querySelectorAll('[data-v415-month]').forEach(btn=>btn.addEventListener('click',()=>{
    const [y,m]=String(btn.dataset.v415Month||'').split('-').map(Number);
    if(Number.isFinite(y)&&Number.isFinite(m)){
      viewDate=new Date(y,m,1);
      selectedIso='';
      render();
    }
  }));
  root.querySelectorAll('[data-v415-date]').forEach(btn=>btn.addEventListener('click',()=>{
    selectedIso=btn.dataset.v415Date||selectedIso;
    render();
  }));
  root.querySelector('[data-v415-filter]')?.addEventListener('click',()=>{
    filterOpen=!filterOpen;
    render();
  });
  root.querySelectorAll('[data-v415-category]').forEach(btn=>btn.addEventListener('click',()=>{
    selectedCategory=btn.dataset.v415Category||'all';
    selectedIso='';
    filterOpen=false;
    render();
  }));
  root.querySelectorAll('[data-v415-go]').forEach(btn=>btn.addEventListener('click',()=>{
    const dest=btn.dataset.v415Go;
    if(dest==='standings'){
      try{localStorage.setItem('competitionTab','standings')}catch(_){}
      location.hash='#/competition';
    }else if(dest==='teams'){
      location.hash='#/teams';
    }else{
      try{localStorage.setItem('competitionTab','fixtures')}catch(_){}
      location.hash='#/competition';
    }
  }));
}

function render(){
  if(!isCalendarRoute()||rendering)return;
  const root=screen(); if(!root)return;
  rendering=true;
  try{
    document.body.classList.add('v70-calendar-active','v103-calendar-active','v415-calendar-active');
    const allGames=games();
    pickSelected(allGames);
    const y=viewDate.getFullYear(),m=viewDate.getMonth();
    const monthGames=allGames.filter(g=>g.year===y&&g.month===m);

    root.innerHTML='<section class="v103-calendar-page v415-calendar-page" data-v103-calendar data-v415-calendar>'+
      topTabs()+
      categoryPanel()+
      monthStrip()+
      calendarGrid(monthGames)+
      selectedMatches(allGames)+
    '</section>';
    bind(root);
    try{window.LJR_TEAM_LOGOS?.refresh?.()}catch(_){}
  }finally{
    rendering=false;
  }
}

let timer=0;
async function schedule(force=false){
  if(!isCalendarRoute()){
    document.body.classList.remove('v415-calendar-active');
    return;
  }
  clearTimeout(timer);
  timer=setTimeout(async()=>{
    const root=screen();
    if(force||!root?.querySelector('[data-v415-calendar]'))render();
    await loadOfficial();
    if(isCalendarRoute())render();
  },25);
}

document.addEventListener('click',e=>{
  const hit=e.target.closest?.('[data-safe-route="v4-calendar"],[data-route="v4-calendar"],[data-v412-route="v4-calendar"],[data-v411-route="v4-calendar"]');
  if(!hit)return;
  setTimeout(()=>schedule(true),40);
},true);

window.addEventListener('hashchange',()=>schedule(true));
window.addEventListener('ljr:official-data',()=>{
  db=window.LJR_OFFICIAL_DATA||db;
  if(isCalendarRoute())render();
});

const root=screen();
if(root)new MutationObserver(()=>{
  if(!isCalendarRoute())return;
  if(root.querySelector('[data-v415-calendar]'))return;
  if(root.querySelector('[data-v103-calendar]')||root.childElementCount)schedule(true);
}).observe(root,{childList:true,subtree:false});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(true),{once:true});
}else schedule(true);
setTimeout(()=>schedule(false),500);
setTimeout(()=>schedule(false),1400);
})();