const V12_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
const V12_TEAM_ASSET_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V12_TEAMS=[
  {
    "name": "SAN JOSE FC",
    "logo": "assets/official-logos/san-jose-fc.png",
    "p": 4,
    "w": 4,
    "d": 0,
    "l": 0,
    "gf": 13,
    "ga": 3,
    "gd": 10,
    "pts": 12
  },
  {
    "name": "JUVENTUS",
    "logo": "assets/official-logos/juventus.png",
    "p": 4,
    "w": 3,
    "d": 0,
    "l": 1,
    "gf": 20,
    "ga": 6,
    "gd": 14,
    "pts": 9
  },
  {
    "name": "HERMANOS",
    "logo": "assets/official-logos/hermanos.png",
    "p": 3,
    "w": 2,
    "d": 1,
    "l": 0,
    "gf": 8,
    "ga": 4,
    "gd": 4,
    "pts": 7
  },
  {
    "name": "LINCES",
    "logo": "assets/official-logos/linces.png",
    "p": 3,
    "w": 2,
    "d": 0,
    "l": 1,
    "gf": 10,
    "ga": 7,
    "gd": 3,
    "pts": 6
  },
  {
    "name": "NAPOLI",
    "logo": "assets/official-logos/napoli.png",
    "p": 4,
    "w": 2,
    "d": 0,
    "l": 2,
    "gf": 8,
    "ga": 7,
    "gd": 1,
    "pts": 6
  },
  {
    "name": "FRANCO FC",
    "logo": "assets/official-logos/franco-fc.png",
    "p": 3,
    "w": 2,
    "d": 0,
    "l": 1,
    "gf": 3,
    "ga": 3,
    "gd": 0,
    "pts": 6
  },
  {
    "name": "HERRERAS FC",
    "logo": "assets/official-logos/herreras-fc.png",
    "p": 4,
    "w": 1,
    "d": 1,
    "l": 2,
    "gf": 9,
    "ga": 12,
    "gd": -3,
    "pts": 4
  },
  {
    "name": "ABEJAS",
    "logo": "assets/official-logos/abejas.png",
    "p": 4,
    "w": 2,
    "d": 0,
    "l": 2,
    "gf": 7,
    "ga": 7,
    "gd": 0,
    "pts": 3
  },
  {
    "name": "LOBOS CDG",
    "logo": "assets/official-logos/lobos-cdg.png",
    "p": 4,
    "w": 1,
    "d": 0,
    "l": 3,
    "gf": 2,
    "ga": 17,
    "gd": -15,
    "pts": 3
  },
  {
    "name": "TERRICOLAS",
    "logo": "assets/official-logos/terricolas.png",
    "p": 3,
    "w": 0,
    "d": 0,
    "l": 3,
    "gf": 4,
    "ga": 14,
    "gd": -10,
    "pts": 0
  },
  {
    "name": "GALACTICOS",
    "logo": "assets/teams/galacticos-pozos.webp",
    "p": 4,
    "w": 0,
    "d": 0,
    "l": 4,
    "gf": 0,
    "ga": 4,
    "gd": -4,
    "pts": -12
  }
];

function v12Route(){return location.hash.replace('#/','')||'home'}
function v12Logo(src,alt,cls=''){return src?'<img class="'+cls+'" src="'+src+'" alt="'+alt+'" loading="eager" decoding="async">':'<span class="'+cls+' v12-team-fallback">'+String(alt).split(/\s+/).map(x=>x[0]||'').join('').slice(0,3)+'</span>'}
function v12TeamLogo(t){return v12Logo(t.logo?V12_TEAM_ASSET_BASE+t.logo:'',t.name,'v12-team-logo')}
function v12Form(){return '<div class="v12-form"><b>—</b></div>'}
function v12Rows(mode='compact'){
  if(mode==='criteria'){
    const head=['PTOS','+/-','GF','GA','V','E','P'];
    const rows=V12_TEAMS.map((t,i)=>'<div class="v12-criteria-row">'+
      '<span class="v12-criteria-rank">'+(i+1)+'</span>'+
      '<span class="v12-criteria-team">'+v12TeamLogo(t)+'<strong>'+t.name+'</strong></span>'+
      [t.pts,t.gd,t.gf,t.ga,t.w,t.d,t.l].map(n=>'<span class="v12-criteria-stat">'+n+'</span>').join('')+
    '</div>').join('');
    return '<div class="v12-table-shell v12-criteria-shell"><div class="v12-table-scroll v12-criteria-scroll"><div class="v12-table-inner v12-criteria-table">'+
      '<div class="v12-criteria-head"><span></span><span></span>'+head.map(h=>'<b>'+h+'</b>').join('')+'</div>'+
      '<div class="v12-criteria-direct">CLASIFICACIÓN ACTUAL</div><div class="v12-criteria-line"></div>'+rows+
    '</div></div><span class="v12-table-edge v12-criteria-edge" aria-hidden="true"></span></div>';
  }
  if(mode==='complete'){
    const rows=V12_TEAMS.map((t,i)=>'<div class="v12-complete-row"><span class="v12-rank">'+(i+1)+'</span>'+
      '<span class="v12-team-cell">'+v12TeamLogo(t)+'<strong>'+t.name+'</strong></span>'+
      '<span>'+t.p+'</span><span>'+t.w+'</span><span>'+t.d+'</span><span>'+t.l+'</span><b>'+t.pts+'</b></div>').join('');
    return '<div class="v12-table-shell v12-complete-shell"><div class="v12-table-scroll"><div class="v12-table-inner v12-table-inner-complete">'+
      '<div class="v12-complete-head"><span></span><span></span><b>P</b><b>V</b><b>E</b><b>D</b><b>PTOS</b></div>'+
      '<div class="v12-direct-label">CLASIFICACIÓN ACTUAL</div><div class="v12-direct-line"></div><div class="v12-complete-list">'+rows+'</div>'+
    '</div></div><span class="v12-table-edge" aria-hidden="true"></span></div>';
  }
  return '<div class="v12-table-shell v12-compact-shell"><div class="v12-table-scroll"><div class="v12-table-inner v12-table-inner-compact">'+
    '<div class="v12-stand-head"><span></span><b>P</b><b>+/-</b><b>PTOS</b><b>FORMA</b></div>'+
    '<div class="v12-direct-label">CLASIFICACIÓN ACTUAL</div><div class="v12-direct-line"></div>'+
    '<div class="v12-stand-list">'+V12_TEAMS.map((t,i)=>'<div class="v12-stand-row"><span class="v12-rank">'+(i+1)+'</span>'+
      '<span class="v12-team-cell">'+v12TeamLogo(t)+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+v12Form()+'</div>').join('')+'</div>'+
  '</div></div><span class="v12-table-edge" aria-hidden="true"></span></div>';
}
function v12StandingsBody(){
  return '<section class="v12-standings-reference" data-v12-standings>'+
    '<div class="v12-segmented">'+
      '<button class="active" data-v12-mode="compact">Compacta</button>'+
      '<button data-v12-mode="complete">Completa</button>'+
      '<button data-v12-mode="criteria">Criterios de<br>desempate</button>'+
    '</div>'+
    '<div class="v12-stand-content" data-v12-stand-content>'+v12Rows('compact')+'</div>'+
  '</section>';
}
function patchStandings(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Clasificaci/i.test(active.textContent||'')) return;

  const existing=screen.querySelector('[data-v12-standings]');
  if(existing){
    const contaminated=
      existing.classList.contains('v13-standings-reference') ||
      existing.hasAttribute('data-v13-standings') ||
      !!existing.querySelector('[data-v13-mode],.v13-stand-content,.v13-compact-table,.v13-complete-table,.v13-criteria-wrap');

    if(!contaminated) return;

    /* Hard takeover: restore the V12 table even if an older cached V13 script is still loaded. */
    existing.classList.remove('v13-standings-reference');
    existing.removeAttribute('data-v13-standings');
    existing.dataset.v13Ready='1';
    existing.innerHTML=
      '<div class="v12-segmented">'+
        '<button class="active" data-v12-mode="compact">Compacta</button>'+
        '<button data-v12-mode="complete">Completa</button>'+
        '<button data-v12-mode="criteria">Criterios de<br>desempate</button>'+
      '</div>'+
      '<div class="v12-stand-content" data-v12-stand-content>'+v12Rows('compact')+'</div>';
    return;
  }

  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12StandingsBody());
}

function v12ProfileIcon(type){
  const icons={
    following:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24Zm-10 6.16-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4Z" fill="currentColor"/></svg>',
    notifications:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19.29 17.29-1.29-1.29v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29C4.08 17.92 4.52 19 5.41 19h13.17c.9 0 1.34-1.08.71-1.71ZM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6Zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2Z" fill="currentColor"/></svg>',
    language:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.6 12h16.8M12 3c2.35 2.45 3.55 5.45 3.55 9S14.35 18.55 12 21M12 3C9.65 5.45 8.45 8.45 8.45 12S9.65 18.55 12 21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    feedback:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.8 4.8h14.4v10.8H5.853L4.8 16.653V4.8ZM4.8 3C3.81 3 3.009 3.81 3.009 4.8L3 21l3.6-3.6h12.6c.99 0 1.8-.81 1.8-1.8V4.8C21 3.81 20.19 3 19.2 3H4.8Zm1.8 9h7.2v1.8H6.6V12Zm0-2.7h10.8v1.8H6.6V9.3Zm0-2.7h10.8v1.8H6.6V6.6Z" fill="currentColor"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.705 6.705a.997.997 0 0 0-1.41 0 .997.997 0 0 0-.001 1.41L13.17 12l-3.876 3.885a.997.997 0 1 0 1.411 1.41l4.588-4.588a1 1 0 0 0 0-1.414l-4.588-4.588Z" fill="currentColor"/></svg>'
  };
  return icons[type]||'';
}
function profileMenuRow(icon,label,route,action,chevron=false){
  const attr=route?'data-v12-route="'+route+'"':'data-v12-action="'+action+'"';
  return '<button class="v12-profile-row" '+attr+'>'+
    '<span class="v12-profile-row-icon">'+(icon?v12ProfileIcon(icon):'')+'</span>'+
    '<span class="v12-profile-row-label">'+label+'</span>'+
    '<span class="v12-profile-row-chevron">'+(chevron?v12ProfileIcon('chevron'):'')+'</span>'+
  '</button>';
}
function patchProfile(){
  if(v12Route()!=='profile') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  const existing=screen.querySelector('[data-v12-profile]');
  if(existing?.dataset.profileRef==='parts37') return;
  screen.innerHTML='<section class="v12-profile-page" data-v12-profile data-profile-ref="parts37">'+
    '<div class="v12-profile-menu">'+
      profileMenuRow('following','Siguiendo','following',null,true)+
      profileMenuRow('notifications','Notificaciones','notifications',null,true)+
      profileMenuRow('language','Tu idioma preferido',null,'language',false)+
      profileMenuRow('feedback','Ayúdanos a mejorar',null,'feedback',false)+
      profileMenuRow(null,'Ajustes de privacidad',null,'privacy',true)+
      profileMenuRow(null,'Términos y condiciones',null,'terms',true)+
    '</div>'+
    '<div class="v12-profile-card v12-profile-card-bottom">'+
      '<div class="v12-profile-copy"><h1>Más de la Liga</h1><p>Crea tu cuenta y disfruta de un acceso inigualable a resultados, estadísticas, calendarios, equipos de la liga y mucho más.</p></div>'+
      '<div class="v12-profile-actions"><button class="outline" data-v12-action="login">Iniciar sesión</button><button class="solid" data-v12-action="create">Crear una cuenta</button></div>'+
    '</div>'+
  '</section>';
}
function avatarSvg(color){
  return '<div class="v12-avatar" style="--av:'+color+'"><svg viewBox="0 0 96 96" aria-hidden="true"><path d="M30 35c0-14 8-22 18-22s18 8 18 22c0 11-4 19-9 24v8H39v-8c-5-5-9-13-9-24Z" fill="#d7d7d7"/><path d="M25 30c4-16 12-25 23-25 10 0 20 8 24 24l-7 2c-2-8-8-12-17-12-8 0-14 4-17 13Z" fill="#a9a9a9"/><path d="M38 57h20l14 9c6 4 10 10 11 18H13c1-8 5-14 11-18Z" fill="var(--av)"/></svg></div>'
}
function curveArrow(color,flip=false){
  return '<svg class="v12-curve-arrow '+(flip?'flip':'')+'" viewBox="0 0 100 150" aria-hidden="true"><path d="M25 130C55 90 60 55 45 20" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round"/><path d="M36 27 46 12l14 14" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
}
function patchMoreLess(){
  if(v12Route()!=='moreLess') return;
  const screen=document.querySelector('#screen');
  if(!screen||screen.querySelector('[data-v12-moreless]')) return;
  screen.innerHTML='<section class="v12-moreless" data-v12-moreless>'+
    '<div class="v12-ml-title"><span>MÁS</span><small>O</small><span>MENOS</span></div>'+
    '<div class="v12-ml-curves"><div class="down">'+curveArrow('#ff003c',true)+'</div><div class="up">'+curveArrow('#18ef72',false)+'</div></div>'+
    '<div class="v12-ml-choice">'+
      '<button data-v12-choice="more" aria-label="Elegir más">'+avatarSvg('#c776e8')+'</button>'+
      '<div class="v12-ml-mid"><button data-v12-choice="more" class="up-arrow" aria-label="Más">▲</button><button data-v12-choice="less" class="down-arrow" aria-label="Menos">▼</button></div>'+
      '<button data-v12-choice="less" aria-label="Elegir menos">'+avatarSvg('#77f1ea')+'</button>'+
    '</div>'+
    v12Logo(V12_LOGO,'Liga Municipal de Fútbol Juventino Rosas','v12-ml-logo')+
    '<div class="v12-stadium" aria-hidden="true"><i></i><b></b></div>'+
  '</section>';
}
function v12Toast(text){
  let t=document.querySelector('.v12-toast');
  if(!t){t=document.createElement('div');t.className='v12-toast';document.body.appendChild(t)}
  t.textContent=text;t.classList.add('show');clearTimeout(v12Toast.t);v12Toast.t=setTimeout(()=>t.classList.remove('show'),1700)
}

const V12_FIXTURE_LOGOS={
  "FRANCO FC":"assets/official-logos/franco-fc.png",
  "HERRERAS FC":"assets/official-logos/herreras-fc.png",
  "TERRICOLAS":"assets/official-logos/terricolas.png",
  "GALACTICOS":"assets/teams/galacticos-pozos.webp",
  "LINCES":"assets/official-logos/linces.png",
  "JUVENTUS":"assets/official-logos/juventus.png",
  "HERMANOS":"assets/official-logos/hermanos.png",
  "SAN JOSE FC":"assets/official-logos/san-jose-fc.png",
  "LOBOS CDG":"assets/official-logos/lobos-cdg.png",
  "NAPOLI":"assets/official-logos/napoli.png"
};
const V12_FIXTURE_BUILD='20260921-rule-bottom-dom-v138';
const V12_FIXTURE_ORDER=['3','4','5','2','1'];
const V12_FIXTURE_LABELS={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
const V12_MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const V12_MONTHS_SHORT=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const V12_DAYS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const V12_DAYS_SHORT=['dom','lun','mar','mié','jue','vie','sáb'];
let V12_FIXTURE_DB=window.LJR_OFFICIAL_DATA||null;
let V12_FIXTURE_LOADING=null;
let V12_LEGACY_DB=null;

function v12Esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function v12Norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function v12LatestDb(a,b){
  if(!a)return b||null;if(!b)return a;
  const ta=Date.parse(a.captured_at_utc||'')||0,tb=Date.parse(b.captured_at_utc||'')||0;
  return tb>ta?b:a;
}
function v12FixtureDb(){
  let live=null;
  try{live=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}catch(_){}
  return v12LatestDb(V12_FIXTURE_DB,live);
}
async function v12LoadFixtureDb(){
  if(V12_FIXTURE_LOADING)return V12_FIXTURE_LOADING;
  V12_FIXTURE_LOADING=(async()=>{
    let best=v12FixtureDb();
    const urls=[
      './public/data/official-live.json?v='+V12_FIXTURE_BUILD,
      'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v='+V12_FIXTURE_BUILD
    ];
    for(const url of urls){
      try{
        const r=await fetch(url,{cache:'no-store'});if(!r.ok)continue;
        const d=await r.json();if(d?.categories)best=v12LatestDb(best,d);
      }catch(_){}
    }
    try{
      const lr=await fetch('./public/data/temporada-actual-2026.json?v='+V12_FIXTURE_BUILD,{cache:'no-store'});
      if(lr.ok){
        const ld=await lr.json();
        if(ld?.categories)V12_LEGACY_DB=ld;
      }
    }catch(_){}
    if(best)V12_FIXTURE_DB=best;
    return best;
  })().finally(()=>{V12_FIXTURE_LOADING=null});
  return V12_FIXTURE_LOADING;
}
function v12ParseFixtureDate(raw){
  const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  const d=Number(m[1]),mo=Number(m[2]),y=Number(m[3]),h=Number(m[4]||0),mi=Number(m[5]||0);
  const date=new Date(y,mo-1,d,h,mi,0,0);
  if(Number.isNaN(date.getTime()))return null;
  return {date,key:y+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0'),day:d,month:mo,year:y,time:m[4]?String(h).padStart(2,'0')+':'+String(mi).padStart(2,'0'):'Por confirmar'};
}
function v12DateLong(info){
  if(!info)return 'Fecha por confirmar';
  return V12_DAYS[info.date.getDay()]+', '+info.day+' '+V12_MONTHS[info.month-1]+' '+info.year;
}
function v12DateShort(info){
  if(!info)return 'Por confirmar';
  return V12_DAYS_SHORT[info.date.getDay()]+' '+info.day+' '+V12_MONTHS_SHORT[info.month-1];
}
function v12FixtureCategories(){
  const db=v12FixtureDb(),cats=db?.categories||{};
  return V12_FIXTURE_ORDER.map(id=>({id,name:cats[id]?.name||V12_FIXTURE_LABELS[id]||('Categoría '+id)}));
}
function v12LegacyCategory(catId){
  const name=V12_FIXTURE_LABELS[String(catId)]||'';
  return V12_LEGACY_DB?.categories?.[name]||null;
}
function v12LegacyRows(catId){
  const legacy=v12LegacyCategory(catId);
  if(!legacy)return [];
  const rows=[];
  let n=1;
  const pushGame=(game,group,groupLabel,sort,current=false)=>{
    if(!game?.home||!game?.away)return;
    const rawTime=String(game.time||'').trim();
    const field=String(game.field||'').trim();
    const r=[String(n++),groupLabel,game.home,'-','vs','-',game.away,field?( /^\d+$/.test(field)?'Campo '+field:field ):'Campo por confirmar','', '---'];
    r.__v12Group='legacy-'+String(sort).padStart(2,'0')+'-'+v12Norm(group).replace(/\s+/g,'-');
    r.__v12GroupLabel=groupLabel;
    r.__v12LongLabel=(/veteranos/i.test(V12_FIXTURE_LABELS[String(catId)]||'')?'sábado':'domingo')+' · '+groupLabel+' · fecha por confirmar';
    r.__v12ShortLabel=(/veteranos/i.test(V12_FIXTURE_LABELS[String(catId)]||'')?'sáb':'dom')+' · '+groupLabel;
    r.__v12Sort=sort;
    r.__v12Current=!!current;
    r.__v12Time=rawTime||'Por confirmar';
    r.__v12Venue=r[7];
    rows.push(r);
  };
  if(legacy.knockout){
    let s=0;
    for(const [phase,games] of Object.entries(legacy.knockout)){
      const current=v12Norm(legacy.current_phase)===v12Norm(phase);
      (games||[]).forEach(g=>pushGame(g,phase,phase,++s,current));
    }
  }else if(legacy.rounds){
    let s=0;
    for(const [round,games] of Object.entries(legacy.rounds)){
      const current=v12Norm(legacy.current_phase).includes(v12Norm(round));
      (games||[]).forEach(g=>pushGame(g,round,'Jornada '+round.replace(/^J/i,''),++s,current));
    }
  }
  return rows;
}
function v12FixtureRows(catId){
  const db=v12FixtureDb(),cat=db?.categories?.[String(catId)];
  const official=(cat?.fixtures||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[]).filter(r=>Array.isArray(r)&&r[2]&&r[6]);
  const rows=official.length?official:v12LegacyRows(catId);
  return rows.sort((a,b)=>{
    const specialA=Number(a?.__v12Sort??Number.MAX_SAFE_INTEGER),specialB=Number(b?.__v12Sort??Number.MAX_SAFE_INTEGER);
    if(specialA!==specialB)return specialA-specialB;
    const da=v12ParseFixtureDate(a[8])?.date?.getTime()||Number.MAX_SAFE_INTEGER;
    const dbb=v12ParseFixtureDate(b[8])?.date?.getTime()||Number.MAX_SAFE_INTEGER;
    return da-dbb||Number(a?.[0]||0)-Number(b?.[0]||0);
  });
}
function v12FixtureGroups(catId){
  const map=new Map();
  v12FixtureRows(catId).forEach(r=>{
    const info=v12ParseFixtureDate(r[8]);
    const key=r.__v12Group||info?.key||'sin-fecha';
    if(!map.has(key))map.set(key,{
      key,
      info,
      rows:[],
      label:r.__v12GroupLabel||'',
      longLabel:r.__v12LongLabel||'',
      shortLabel:r.__v12ShortLabel||'',
      sort:Number(r.__v12Sort??Number.MAX_SAFE_INTEGER),
      current:!!r.__v12Current
    });
    const g=map.get(key);
    g.rows.push(r);
    if(r.__v12Current)g.current=true;
  });
  return [...map.values()].sort((a,b)=>{
    if(a.sort!==b.sort)return a.sort-b.sort;
    return (a.info?.date?.getTime()||Number.MAX_SAFE_INTEGER)-(b.info?.date?.getTime()||Number.MAX_SAFE_INTEGER);
  });
}
function v12StoredCat(){
  const cats=v12FixtureCategories(),saved=localStorage.getItem('v12-fixture-cat')||'3';
  return cats.some(c=>c.id===saved)?saved:(cats[0]?.id||'3');
}
function v12PickGroup(catId,groups){
  if(!groups.length)return null;
  const saved=localStorage.getItem('v12-fixture-date-'+catId);
  if(saved&&groups.some(g=>g.key===saved))return groups.find(g=>g.key===saved);
  const current=groups.find(g=>g.current);
  if(current)return current;
  const now=Date.now();
  return groups.reduce((best,g)=>{
    const d=g.info?.date?.getTime();
    if(!Number.isFinite(d))return best;
    if(!best)return g;
    const bd=best.info?.date?.getTime();
    return Math.abs(d-now)<Math.abs(bd-now)?g:best;
  },null)||groups[0];
}
function v12CategoryRule(catName){
  return /veteranos/i.test(catName||'')?'Veteranos · partidos los sábados':'Primera / Intermedia / Segunda · partidos los domingos';
}
function v12FixtureLogo(name){
  let src='';
  try{src=window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){}
  const db=v12FixtureDb();
  if(!src){
    const hit=Object.entries(db?.team_logos||{}).find(([k])=>v12Norm(k)===v12Norm(name));
    const v=hit?.[1];
    src=typeof v==='string'?v:(v?.local||v?.source||'');
  }
  if(!src){
    const p=V12_FIXTURE_LOGOS[String(name||'').toUpperCase()];
    if(p)src=V12_TEAM_ASSET_BASE+p;
  }
  if(src)return '<img src="'+v12Esc(src)+'" alt="'+v12Esc(name)+'" class="v12-fixture-logo" loading="eager" decoding="async">';
  const ab=String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]||'').join('').slice(0,3).toUpperCase();
  return '<span class="v12-fixture-fallback">'+v12Esc(ab||'JR')+'</span>';
}
function v12FixtureModel(row,catId,catName){
  const info=v12ParseFixtureDate(row?.[8]);
  const hg=String(row?.[3]??''),ag=String(row?.[5]??''),played=/^\d+$/.test(hg)&&/^\d+$/.test(ag);
  return {
    id:'official-'+catId+'-'+String(row?.[0]||Math.random()),
    home:String(row?.[2]||'Local'),
    away:String(row?.[6]||'Visitante'),
    venue:String(row?.__v12Venue||row?.[7]||'').trim()||'Campo por confirmar',
    datetime:String(row?.[8]||''),
    time:String(row?.__v12Time||info?.time||'Por confirmar'),
    jornada:String(row?.[1]||'—'),
    category:catName,
    catId:String(catId),
    dateLabel:String(row?.__v12LongLabel||v12DateLong(info)),
    played,
    score:played?(hg+' - '+ag):''
  };
}
function v12UpcomingRow(m){
  const primary=m.played?m.score:m.time;
  return '<div class="v12-schedule-match v12-result-match v76-upcoming-match" data-v12-category="'+v12Esc(m.category)+'" data-v12-cat-id="'+v12Esc(m.catId)+'" data-v12-jornada="'+v12Esc(m.jornada)+'" data-v12-venue="'+v12Esc(m.venue)+'" data-v12-date-label="'+v12Esc(m.dateLabel)+'" data-v12-time="'+v12Esc(m.time)+'">'+
    '<div class="v12-schedule-clubs"><div class="v12-result-team">'+v12FixtureLogo(m.home)+'<b>'+v12Esc(m.home)+'</b></div>'+
    '<div class="v12-result-team">'+v12FixtureLogo(m.away)+'<b>'+v12Esc(m.away)+'</b></div></div>'+
    '<div class="v12-schedule-meta"><time class="'+(m.played?'v12-score-time':'')+'">'+v12Esc(primary)+'</time><small class="v76-match-venue">'+v12Esc(m.venue)+'</small><button data-match="'+v12Esc(m.id)+'">Ver detalles</button></div></div>';
}
function v12FixturesMarkup(){
  const db=v12FixtureDb(),cats=v12FixtureCategories();
  if(!cats.length){
    return '<section class="v12-fixtures-reference" data-v12-fixtures data-v12-version="'+V12_FIXTURE_BUILD+'"><div class="v12-fixture-loading">Cargando jornadas oficiales…</div></section>';
  }
  const catId=v12StoredCat(),cat=cats.find(c=>c.id===catId)||cats[0],groups=v12FixtureGroups(cat.id),selected=v12PickGroup(cat.id,groups);
  const catStrip='<div class="v12-category-grid">'+cats.map(c=>'<button class="'+(c.id===cat.id?'active':'')+'" data-v12-cat="'+v12Esc(c.id)+'">'+v12Esc(c.name)+'</button>').join('')+'</div>';
  if(!selected){
    return '<section class="v12-fixtures-reference" data-v12-fixtures data-v12-version="'+V12_FIXTURE_BUILD+'">'+
      '<h2>'+v12Esc(cat.name)+'</h2><section class="v12-schedule-card"><h3>Calendario oficial</h3><div class="v12-fixture-empty">Todavía no hay partidos publicados para esta categoría en la fuente actual.</div></section>'+
      catStrip+
      '<p class="v12-fixture-rule">'+v12Esc(v12CategoryRule(cat.name))+'</p>'+
    '</section>';
  }
  const weekStrip='<div class="v12-date-strip v12-week-strip">'+groups.map(g=>{
    const jornada=g.label||[...new Set(g.rows.map(r=>String(r?.[1]||'—')))].join('/');
    const top=g.shortLabel||v12DateShort(g.info);
    const bottom=g.label?g.label:('Jornada '+jornada);
    return '<button class="'+(g.key===selected.key?'active':'')+'" data-v12-date="'+v12Esc(g.key)+'"><span>'+v12Esc(top)+'</span><small>'+v12Esc(bottom)+'</small></button>';
  }).join('')+'</div>';
  const jornadas=selected.label||[...new Set(selected.rows.map(r=>String(r?.[1]||'—')))].join(' / ');
  const games=selected.rows.map(r=>v12FixtureModel(r,cat.id,cat.name));
  const longDate=selected.longLabel||v12DateLong(selected.info);
  const title=selected.label?(selected.label+' · '+cat.name):('Jornada '+jornadas+' · '+cat.name);
  return '<section class="v12-fixtures-reference" data-v12-fixtures data-v12-version="'+V12_FIXTURE_BUILD+'">'+
    weekStrip+
    '<h2 id="v12-day-'+v12Esc(selected.key)+'">'+v12Esc(longDate)+'</h2>'+
    '<section class="v12-schedule-card"><h3>'+v12Esc(title)+'</h3><div>'+games.map(v12UpcomingRow).join('')+'</div></section>'+
    catStrip+
    '<p class="v12-fixture-rule">'+v12Esc(v12CategoryRule(cat.name))+'</p>'+
  '</section>';
}
function v12RefreshFixtures(){
  if(v12Route()!=='competition')return;
  const screen=document.querySelector('#screen'),tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs)return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Partidos/i.test(active.textContent||''))return;
  const old=screen.querySelector('[data-v12-fixtures]');
  if(old){old.outerHTML=v12FixturesMarkup();return}
  let node=tabs.nextSibling;while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12FixturesMarkup());
}
function patchFixturesReference(){
  if(v12Route()!=='competition')return;
  const screen=document.querySelector('#screen'),tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs)return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Partidos/i.test(active.textContent||''))return;
  const existing=screen.querySelector('[data-v12-fixtures]');
  if(existing?.dataset.v12Version===V12_FIXTURE_BUILD)return;
  v12RefreshFixtures();
  v12LoadFixtureDb().then(()=>requestAnimationFrame(v12RefreshFixtures));
}

/* === PARTS25 — CUADRO / PLAY-OFF EXACTO DE REFERENCIA === */
const V12_BRACKET_SHIELD='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg>';

const V12_BRACKET_PATHS={
  america:'assets/branding/america-veteranos-35-user.png',
  huerta:'assets/teams/la-huerta-cuenda.webp',
  promesas:'assets/teams/promesas-fc-pozos.webp',
  franco:'assets/teams/franco-fc.webp',
  cuenda:'assets/official-logos/toros-de-cuenda.png',
  pozos:'assets/teams/pozos-fc.webp',
  lobos:'assets/teams/lobos-cdg.webp',
  santa:'assets/teams/atletico-santa-cruz.webp',
  galeana:'assets/teams/atletico-galeana.webp',
  sanantonio:'assets/teams/san-antonio-jr.webp',
  sanjose:'assets/teams/san-jose.webp',
  sanjosefc:'assets/official-logos/san-jose-fc.png',
  hermanos:'assets/official-logos/hermanos.png',
  linces:'assets/official-logos/linces.png',
  napoli:'assets/official-logos/napoli.png',
  herreras:'assets/official-logos/herreras-fc.png',
  abejas:'assets/official-logos/abejas.png',
  terricolas:'assets/official-logos/terricolas.png',
  galacticos:'assets/teams/galacticos-pozos.webp',
  sanjulian:'assets/official-logos/san-julian.png',
  sanjuan:'assets/official-logos/san-juan-fc.png',
  taverafc:'assets/official-logos/tavera-fc.png',
  celticos:'assets/official-logos/celticos.png'
};

function v12BracketTeam(name,key,abbr,seed,score){
  return {name,key,abbr,seed,score};
}
function v12BracketLogo(t){
  const path=V12_BRACKET_PATHS[t.key];
  if(path) return '<img src="'+V12_TEAM_ASSET_BASE+path+'" alt="'+t.name+'" loading="eager" decoding="async">';
  if(t.key==='juventino'||t.key==='realjuventino') return '<img src="'+V12_LOGO+'" alt="'+t.name+'" loading="eager" decoding="async">';
  return '<span class="v12-bracket-fallback">'+t.abbr+'</span>';
}
function v12BracketTeamCard(t,mini=false){
  return '<div class="v12-bracket-team '+(mini?'mini':'')+'">'+
    '<small class="v12-bracket-seed">'+(t.seed??'')+'</small>'+
    v12BracketLogo(t)+
    '<strong>'+t.name+'</strong>'+
    (t.score!==undefined&&t.score!==null?'<b class="v12-bracket-score">'+t.score+'</b>':'')+
  '</div>';
}
function v12BracketPair(a,b){
  return '<div class="v12-bracket-pair">'+v12BracketTeamCard(a)+
    '<i class="v12-bracket-vs">o</i>'+v12BracketTeamCard(b)+'</div>';
}
function v12BracketSeedPair(a,b){
  return '<div class="v12-bracket-seeded">'+v12BracketTeamCard(a,true)+
    '<i class="v12-bracket-vs">o</i>'+v12BracketTeamCard(b,true)+'</div>';
}
function v12BracketWinnerBlock(a,b){
  return '<div class="v12-bracket-winner-block">'+
    '<div class="v12-bracket-winner"><span class="shield">'+V12_BRACKET_SHIELD+'</span><strong>Ganador del play-off</strong></div>'+
    v12BracketSeedPair(a,b)+
  '</div>';
}

const V12_BRACKET_ROUTE_LEFT={
  label:'RUTA PLATEADA',
  pairs:[
    [
      v12BracketTeam('América Veteranos','america','AME','1','8'),
      v12BracketTeam('La Huerta','huerta','HUE','8','')
    ],
    [
      v12BracketTeam('Promesas FC','promesas','PRO','4','5'),
      v12BracketTeam('Franco FC','franco','FRA','5','')
    ],
    [
      v12BracketTeam('Cuenda','cuenda','CUE','3','6'),
      v12BracketTeam('Pozos','pozos','POZ','6','')
    ],
    [
      v12BracketTeam('Rincón de Centeno','rincon','RCN','7','0'),
      v12BracketTeam('Deportivo Rosas','depRosas','ROS','2','')
    ]
  ],
  winners:[
    [
      v12BracketTeam('Juventino','juventino','JUV','',''),
      v12BracketTeam('Lobos CDG','lobos','LOB','','')
    ],
    [
      v12BracketTeam('Santa Cruz','santa','STC','',''),
      v12BracketTeam('Atlético Galeana','galeana','GAL','','')
    ]
  ]
};

const V12_BRACKET_ROUTE_RIGHT={
  label:'RUTA AZUL',
  pairs:[
    [
      v12BracketTeam('San José FC','sanjosefc','SJO','2','6'),
      v12BracketTeam('Hermanos','hermanos','HER','16','')
    ],
    [
      v12BracketTeam('Linces','linces','LIN','12','5'),
      v12BracketTeam('Napoli','napoli','NAP','13','')
    ],
    [
      v12BracketTeam('Herreras FC','herreras','HFC','11','6'),
      v12BracketTeam('Abejas','abejas','ABE','14','')
    ],
    [
      v12BracketTeam('Terrícolas','terricolas','TER','10','5'),
      v12BracketTeam('Galácticos','galacticos','GAC','15','')
    ]
  ],
  winners:[
    [
      v12BracketTeam('San Julián','sanjulian','SJL','',''),
      v12BracketTeam('San Juan FC','sanjuan','SJU','','')
    ],
    [
      v12BracketTeam('Tavera FC','taverafc','TVF','',''),
      v12BracketTeam('Célticos FC','celticos','CEL','','')
    ]
  ]
};

function v12BracketRoute(route){
  return '<section class="v12-bracket-route">'+
    '<div class="v12-bracket-side-label"><span>'+route.label+'</span></div>'+
    '<div class="v12-bracket-pairs">'+route.pairs.map(p=>v12BracketPair(p[0],p[1])).join('')+'</div>'+
    '<div class="v12-bracket-connectors" aria-hidden="true">'+
      '<span class="c c1"></span><span class="c c2"></span><span class="c c3"></span><span class="c c4"></span>'+
    '</div>'+
    '<div class="v12-bracket-winners">'+route.winners.map(w=>v12BracketWinnerBlock(w[0],w[1])).join('')+'</div>'+
  '</section>';
}

function v12FinalTrophy(){
  return '<div class="v12-final-trophy-new" aria-label="Trofeo de la final">'+
    '<img src="./final-trophy-drive.png?v=parts35" alt="" aria-hidden="true">'+
  '</div>';
}
function v12FinalCard(){
  return '<section class="v12-final-reference" data-v12-final>'+
    '<div class="v12-final-top-date"><span></span><b>5 jun</b></div>'+
    '<div class="v12-final-side-mark" aria-hidden="true"></div>'+
    '<div class="v12-final-match-card">'+
      '<time>5 jun</time>'+
      '<div class="v12-final-opponent"><span class="v12-final-shield">'+V12_BRACKET_SHIELD+'</span><b>¿?</b></div>'+
      '<div class="v12-final-opponent"><span class="v12-final-shield">'+V12_BRACKET_SHIELD+'</span><b>¿?</b></div>'+
    '</div>'+
    '<div class="v12-final-trophy-wrap">'+v12FinalTrophy()+'</div>'+
  '</section>';
}

/* PARTS50 — PROGRESIÓN VISUAL POR RONDA */
const V12_STAGE_DATES={
  playoff:['16-19 & 24-25 feb','9-12 & 17-18 mar'],
  octavos:['9-12 & 17-18 mar','6-7 & 14-15 abr'],
  cuartos:['6-7 & 14-15 abr','27-28 abr & 5-6 may'],
  semifinal:['27-28 abr & 5-6 may','5 jun'],
  final:['5 jun','']
};

function v12ProgressWinnerBlock(pair){
  return '<div class="v12-progress-winner-block">'+
    '<div class="v12-progress-winner"><span class="shield">'+V12_BRACKET_SHIELD+'</span><strong>Ganador del play-off</strong></div>'+
    '<div class="v12-progress-seeded">'+
      v12BracketTeamCard(pair[0],true)+
      '<i class="v12-progress-vs">o</i>'+
      v12BracketTeamCard(pair[1],true)+
    '</div>'+
  '</div>';
}

function v12ProgressUnknown(dateText,legText='Ida'){
  return '<div class="v12-progress-match">'+
    '<time>'+dateText+'</time>'+
    '<small>'+legText+'</small>'+
    '<div class="v12-progress-opponent"><span class="shield">'+V12_BRACKET_SHIELD+'</span><b>¿?</b></div>'+
    '<div class="v12-progress-opponent"><span class="shield">'+V12_BRACKET_SHIELD+'</span><b>¿?</b></div>'+
  '</div>';
}

function v12ProgressDates(stage){
  const d=V12_STAGE_DATES[stage]||['',''];
  return '<div class="v12-progress-dates"><span>'+d[0]+'</span><span>'+d[1]+'</span></div>';
}

function v12OctavosRoute(route,tone){
  return '<section class="v12-progress-route '+tone+'">'+
    '<div class="v12-progress-rail"><span>'+route.label+'</span></div>'+
    '<div class="v12-progress-left">'+route.winners.map(w=>v12ProgressWinnerBlock(w)).join('')+'</div>'+
    '<div class="v12-progress-connector" aria-hidden="true"><i></i></div>'+
    '<div class="v12-progress-right">'+v12ProgressUnknown('6 - 7 abr')+'</div>'+
  '</section>';
}

function v12CuartosRoute(tone){
  return '<section class="v12-progress-route '+tone+'">'+
    '<div class="v12-progress-rail"><span>'+(tone==='route-blue'?'RUTA AZUL':'RUTA PLATEADA')+'</span></div>'+
    '<div class="v12-progress-left v12-progress-left-matches">'+
      v12ProgressUnknown('6 - 7 abr')+
      v12ProgressUnknown('6 - 7 abr')+
    '</div>'+
    '<div class="v12-progress-connector" aria-hidden="true"><i></i></div>'+
    '<div class="v12-progress-right">'+v12ProgressUnknown('27 - 28 abr')+'</div>'+
  '</section>';
}

function v12SemifinalFlow(){
  return '<div class="v12-semifinal-flow">'+
    '<div class="v12-semifinal-source silver">'+
      '<div class="v12-progress-rail"><span>RUTA PLATEADA</span></div>'+
      v12ProgressUnknown('27 - 28 abr')+
    '</div>'+
    '<div class="v12-semifinal-source blue">'+
      '<div class="v12-progress-rail"><span>RUTA AZUL</span></div>'+
      v12ProgressUnknown('27 - 28 abr')+
    '</div>'+
    '<div class="v12-semifinal-join" aria-hidden="true"></div>'+
    '<div class="v12-semifinal-target">'+v12ProgressUnknown('5 jun','')+'</div>'+
  '</div>';
}

function v12StagePanels(){
  return '<div class="v12-stage-panels">'+
    '<section class="v12-stage-panel v12-stage-panel-octavos">'+
      v12ProgressDates('octavos')+
      '<div class="v12-progress-board">'+
        v12OctavosRoute(V12_BRACKET_ROUTE_LEFT,'route-silver')+
        v12OctavosRoute(V12_BRACKET_ROUTE_RIGHT,'route-blue')+
      '</div>'+
    '</section>'+
    '<section class="v12-stage-panel v12-stage-panel-cuartos">'+
      v12ProgressDates('cuartos')+
      '<div class="v12-progress-board">'+
        v12CuartosRoute('route-silver')+
        v12CuartosRoute('route-blue')+
      '</div>'+
    '</section>'+
    '<section class="v12-stage-panel v12-stage-panel-semifinal">'+
      v12ProgressDates('semifinal')+
      v12SemifinalFlow()+
    '</section>'+
  '</div>';
}

function v12BracketMarkup(){
  return '<section class="v12-bracket-reference stage-playoff" data-v12-bracket>'+
    '<div class="v12-bracket-stage-tabs" role="tablist" aria-label="Etapas del cuadro">'+
      '<button class="active" data-v12-bracket-stage="playoff">Play-off</button>'+
      '<button data-v12-bracket-stage="octavos">Octavos de final</button>'+
      '<button data-v12-bracket-stage="cuartos">Cuartos de final</button>'+
      '<button data-v12-bracket-stage="semifinal">Semifinales</button>'+
      '<button data-v12-bracket-stage="final">Final</button>'+
    '</div>'+
    '<div class="v12-bracket-dates"><span>'+V12_STAGE_DATES.playoff[0]+'</span><span>'+V12_STAGE_DATES.playoff[1]+'</span></div>'+
    '<div class="v12-bracket-board">'+
      v12BracketRoute(V12_BRACKET_ROUTE_LEFT)+
      v12BracketRoute(V12_BRACKET_ROUTE_RIGHT)+
    '</div>'+
    v12StagePanels()+
    v12FinalCard()+
  '</section>';
}
function patchBracketReference(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Cuadro/i.test(active.textContent||'')) return;
  if(screen.querySelector('[data-v12-bracket]')) return;
  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12BracketMarkup());
}

function v12NavBrand(){
  const labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item=>{
    const small=item.querySelector('small');
    if(small&&labels[item.dataset.route]) small.textContent=labels[item.dataset.route];
  });
  const comp=document.querySelector('.bottom-nav .nav-item[data-route="competition"] .nav-icon');
  if(comp) comp.innerHTML='<svg class="v12-competition-field-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5.25 3.5h13.5A1.75 1.75 0 0 1 20.5 5.25v13.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V5.25A1.75 1.75 0 0 1 5.25 3.5Zm0 1.5a.25.25 0 0 0-.25.25v6h4.56a2.75 2.75 0 0 1 4.88 0H19v-6a.25.25 0 0 0-.25-.25H15v2.25A.75.75 0 0 1 14.25 8h-4.5A.75.75 0 0 1 9 7.25V5H5.25ZM10.5 5v1.5h3V5h-3ZM5 12.75v6c0 .138.112.25.25.25H9v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V19h3.75a.25.25 0 0 0 .25-.25v-6h-4.56a2.75 2.75 0 0 1-4.88 0H5Zm5.5 6.25h3v-1.5h-3V19ZM12 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>';
  const profile=document.querySelector('.topbar .profile-button');
  if(profile) profile.innerHTML='<svg class="v12-profile-master-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12,13C13.933,13 15.5,11.433 15.5,9.5C15.5,7.567 13.933,6 12,6C10.067,6 8.5,7.567 8.5,9.5C8.5,11.433 10.067,13 12,13ZM23,12C23,18.0751 18.0751,23 12,23C5.9249,23 1,18.0751 1,12C1,5.9249 5.9249,1 12,1C18.0751,1 23,5.9249 23,12ZM18.9089,17.7681C17.7577,15.8144 15.0622,14.5 12,14.5C8.9417,14.5 6.2438,15.8117 5.0911,17.7682C3.7857,16.2062 3,14.1949 3,12C3,7.0294 7.0294,3 12,3C16.9706,3 21,7.0294 21,12C21,14.1948 20.2144,16.2061 18.9089,17.7681Z" fill="currentColor"/></svg>';
}
function patch(){
  v12NavBrand();
  patchStandings();
  patchFixturesReference();
  patchBracketReference();
  patchProfile();
  patchMoreLess();
}
document.addEventListener('click',e=>{
  /* RESTORE_CUADRO_PLAYOFF — al entrar a Cuadro vuelve al diseño inicial del video. */
  const mainCompetitionTab=e.target.closest('#screen>.tabs .tab');
  if(mainCompetitionTab && /Cuadro/i.test(mainCompetitionTab.textContent||'')){
    setTimeout(()=>{
      const box=document.querySelector('[data-v12-bracket]');
      if(!box) return;
      box.classList.remove('stage-octavos','stage-cuartos','stage-semifinal','stage-final','is-stage-changing','is-stage-ready');
      box.classList.add('stage-playoff');
      box.dataset.v12Stage='playoff';
      box.querySelectorAll('[data-v12-bracket-stage]').forEach((b,i)=>b.classList.toggle('active',i===0));
      const strip=box.querySelector('.v12-bracket-stage-tabs');
      if(strip) strip.scrollLeft=0;
    },100);
  }
  const bracketStage=e.target.closest('[data-v12-bracket-stage]');
  if(bracketStage){
    const box=bracketStage.closest('[data-v12-bracket]');
    if(box){
      const stage=bracketStage.dataset.v12BracketStage;
      box.querySelectorAll('[data-v12-bracket-stage]').forEach(b=>b.classList.toggle('active',b===bracketStage));
      box.classList.remove('stage-playoff','stage-octavos','stage-cuartos','stage-semifinal','stage-final','is-stage-changing','is-stage-ready');
      box.classList.add('stage-'+stage,'is-stage-changing');
      box.dataset.v12Stage=stage;
      const strip=bracketStage.parentElement;
      requestAnimationFrame(()=>{
        box.classList.remove('is-stage-changing');
        box.classList.add('is-stage-ready');
        if(strip){
          const target=Math.max(0,bracketStage.offsetLeft-(strip.clientWidth-bracketStage.offsetWidth)/2);
          strip.scrollTo({left:target,behavior:'smooth'});
        }
      });
      setTimeout(()=>box.classList.remove('is-stage-ready'),430);
    }
    return;
  }
  const catBtn=e.target.closest('[data-v12-cat]');
  if(catBtn){
    localStorage.setItem('v12-fixture-cat',catBtn.dataset.v12Cat||'3');
    requestAnimationFrame(v12RefreshFixtures);
    return;
  }
  const dateBtn=e.target.closest('[data-v12-date]');
  if(dateBtn){
    const cat=v12StoredCat();
    localStorage.setItem('v12-fixture-date-'+cat,dateBtn.dataset.v12Date||'');
    requestAnimationFrame(v12RefreshFixtures);
    return;
  }
  const route=e.target.closest('[data-v12-route]');
  if(route){e.preventDefault();location.hash='#/'+route.dataset.v12Route;return}
  const mode=e.target.closest('[data-v12-mode]');
  if(mode){
    const box=mode.closest('.v12-standings-reference');
    box.querySelectorAll('[data-v12-mode]').forEach(b=>b.classList.toggle('active',b===mode));
    box.querySelector('[data-v12-stand-content]').innerHTML=v12Rows(mode.dataset.v12Mode);
    return;
  }
  const action=e.target.closest('[data-v12-action]');
  if(action){
    const a=action.dataset.v12Action;
    if(a==='login') v12Toast('Inicio de sesión listo para conectar');
    if(a==='create') v12Toast('Registro de cuenta listo para conectar');
    if(a==='language') v12Toast('Idioma: Español (México)');
    if(a==='feedback') v12Toast('Gracias. Aquí se conectará el formulario de comentarios.');
    if(a==='privacy') v12Toast('Ajustes de privacidad');
    if(a==='terms') v12Toast('Términos y condiciones');
    return;
  }
  const choice=e.target.closest('[data-v12-choice]');
  if(choice){
    location.hash='#/moreLessHub';
    return;
  }
},true);
window.addEventListener('ljr:official-data',()=>{V12_FIXTURE_DB=v12LatestDb(V12_FIXTURE_DB,window.LJR_OFFICIAL_DATA||null);requestAnimationFrame(v12RefreshFixtures)});
v12LoadFixtureDb().then(()=>requestAnimationFrame(v12RefreshFixtures));
window.addEventListener('hashchange',()=>requestAnimationFrame(patch));
const obs=new MutationObserver(()=>requestAnimationFrame(patch));
const target=document.querySelector('#screen');
if(target) obs.observe(target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(patch),{once:true}); else requestAnimationFrame(patch);
