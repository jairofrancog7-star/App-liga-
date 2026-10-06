import { rosterGroups, monthIndicator } from './v839-reference-data.js';
/* V415 — Calendario referencia: calendario visual con escudos, meses y tarjeta de partido.
   Sólo reemplaza #/v4-calendar. Usa datos oficiales ya publicados y conserva la navegación global. */
(function(){
'use strict';
if(window.__LJR_V415_CALENDAR_REFERENCE__)return;
window.__LJR_V415_CALENDAR_REFERENCE__=true;

const ROUTES=new Set(['v4-calendar']);
const isCalendarRoute=()=>ROUTES.has(route());
const OFFICIAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
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
let activeView='calendar';
let squadCategory='3';
let squadTeam='';
let selectedPlayer='';
let playerPickerOpen=false;
let playerPanel='Resumen';
const enabledCategories=new Set(CATEGORY_ORDER);
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

function games(categoryId=null){
  const out=[];
  const cats=db?.categories||{};
  CATEGORY_ORDER.forEach(catId=>{
    if(categoryId&&categoryId!=='all'&&categoryId!=='custom'&&String(categoryId)!==String(catId))return;
    if(!categoryId&&!enabledCategories.has(String(catId)))return;
    const cat=cats[catId]||{};
    (cat.fixtures||[]).forEach((group,groupIndex)=>{
      (group?.rows||[]).forEach((r,rowIndex)=>{
        if(!r?.[2]||!r?.[6])return;
        const d=fixtureDate(r?.[8]); if(!d)return;
        const hs=String(r?.[3]??'').trim();
        const as=String(r?.[5]??'').trim();
        const score=/^\d+$/.test(hs)&&/^\d+$/.test(as);
        const status=String(r?.[10]??'').trim();
        const played=score||/\bJUGADO\b|FINALIZADO|FINAL|\bGANA\b/i.test(status);
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
  if(id==='custom'){
    const n=enabledCategories.size;
    return n===1?(db?.categories?.[[...enabledCategories][0]]?.name||CATEGORY_FALLBACK[[...enabledCategories][0]]||'Categoría'):(n+' categorías');
  }
  return db?.categories?.[id]?.name||CATEGORY_FALLBACK[id]||'Categoría';
}
function syncSelectedCategory(){
  if(enabledCategories.size===CATEGORY_ORDER.length)selectedCategory='all';
  else if(enabledCategories.size===1)selectedCategory=[...enabledCategories][0];
  else selectedCategory='custom';
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
      '<button type="button" class="'+(activeView==='calendar'?'active':'')+'" data-v415-go="calendar" role="tab" aria-selected="'+(activeView==='calendar'?'true':'false')+'">Calendario</button>'+
      '<button type="button" class="'+(activeView==='standings'?'active':'')+'" data-v415-go="standings" role="tab" aria-selected="'+(activeView==='standings'?'true':'false')+'">Clasificación</button>'+
      '<button type="button" class="'+(activeView==='squad'?'active':'')+'" data-v415-go="teams" role="tab" aria-selected="'+(activeView==='squad'?'true':'false')+'">Plantilla</button>'+
    '</div>'+
    '<button type="button" class="v415-filter'+(filterOpen?' active':'')+'" data-v415-filter aria-label="Equipos y competiciones" aria-expanded="'+(filterOpen?'true':'false')+'">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>'+
    '</button>'+
  '</div>';
}

function categoryPanel(){
  if(!filterOpen)return '';
  const available=CATEGORY_ORDER.filter(id=>db?.categories?.[id]);
  const allOn=available.length&&available.every(id=>enabledCategories.has(id));
  const card=(id,label)=>{
    const on=enabledCategories.has(id);
    const teamCount=Object.keys(db?.categories?.[id]?.rosters||{}).length;
    return '<div class="v415-filter-category-card '+(on?'active':'')+'">'+
      '<button type="button" class="v415-filter-row" data-v415-category-toggle="'+esc(id)+'">'+
        '<span><b>'+esc(label)+'</b><small>'+teamCount+' equipos registrados</small></span>'+
        '<i class="v415-switch" aria-hidden="true"><em></em></i>'+
      '</button>'+
      '<button type="button" class="v415-filter-subrow" data-v415-squad-category="'+esc(id)+'"><span>Todos los equipos</span><i>⌄</i></button>'+
    '</div>';
  };
  return '<div class="v415-filter-backdrop" data-v415-filter-close></div>'+
    '<aside class="v415-filter-sheet" role="dialog" aria-modal="true" aria-label="Equipos y competiciones">'+
      '<div class="v415-filter-sheet-head"><h2>Equipos y competiciones</h2><button type="button" data-v415-filter-close aria-label="Cerrar">×</button></div>'+
      teamPicker()+'<h3>Fútbol</h3>'+
      '<div class="v415-filter-sheet-list">'+
        '<div class="v415-filter-category-card master '+(allOn?'active':'')+'">'+
          '<button type="button" class="v415-filter-row" data-v415-all-categories><span><b>Todas las categorías</b><small>Mostrar todo el rol oficial</small></span><i class="v415-switch" aria-hidden="true"><em></em></i></button>'+
        '</div>'+
        available.map(id=>card(id,categoryLabel(id))).join('')+
      '</div>'+
    '</aside>';
}

function monthStrip(){
  const y=viewDate.getFullYear(),m=viewDate.getMonth();
  const months=[];
  for(let delta=-3;delta<=2;delta++){
    const d=new Date(y,m+delta,1);
    months.push({year:d.getFullYear(),month:d.getMonth()});
  }
  const activeIndex=Math.max(0,months.findIndex(x=>x.year===y&&x.month===m));
  const indicatorX=((activeIndex+.5)/months.length*100).toFixed(4)+'%';
  return '<div class="v415-month-strip" role="tablist" aria-label="Meses">'+
    months.map(x=>'<button type="button" class="'+(x.year===y&&x.month===m?'active':'')+'" data-v415-month="'+x.year+'-'+x.month+'" role="tab" aria-selected="'+(x.year===y&&x.month===m?'true':'false')+'">'+monthName(x.month)+'</button>').join('')+
  '</div><div class="v415-month-line" style="--v415-month-indicator-x:'+indicatorX+'"><i></i></div>';
}

function rosterTeams(catId=squadCategory){
  const rosters=db?.categories?.[catId]?.rosters||{};
  return Object.keys(rosters);
}
function ensureSquadSelection(){
  if(!db?.categories?.[squadCategory])squadCategory=CATEGORY_ORDER.find(id=>db?.categories?.[id])||'3';
  const teams=rosterTeams(squadCategory);
  if(!teams.some(t=>norm(t)===norm(squadTeam)))squadTeam=teams.find(t=>(db?.categories?.[squadCategory]?.rosters?.[t]||[]).length)||teams[0]||'';
}
function playerUsage(name,catId=squadCategory){
  const usage=db?.categories?.[catId]?.player_usage||{};
  const key=Object.keys(usage).find(k=>norm(k)===norm(name));
  return key?usage[key]:null;
}
function currentRosterGroups(){
  ensureSquadSelection();
  return rosterGroups(db?.categories?.[squadCategory],squadTeam);
}
function currentRoster(){return currentRosterGroups().flatMap(group=>group.players)}
function playerPhoto(player){
  return player.photo||window.LJR_PLAYER_PHOTOS?.[norm(player.name)+'|'+norm(squadTeam)]||'';
}
function playerVisual(player,cls){
  const photo=playerPhoto(player),logo=logoFor(squadTeam);
  return '<span class="'+cls+'">'+(logo?'<img class="v839-player-fallback" src="'+esc(logo)+'" alt="" loading="lazy">':'')+
    (photo?'<img class="v415-player-portrait" src="'+esc(photo)+'" alt="'+esc(player.name)+'" loading="lazy" decoding="async">':'')+'</span>';
}
function squadPlayerCard(player){
  return '<button type="button" class="v415-player-card" data-v839-player="'+esc(player.name)+'" aria-label="Ver jugador: '+esc(player.name)+'" title="'+esc(player.name)+'">'+
    playerVisual(player,'v415-player-art')+
    '<span class="v839-player-caption">'+(player.number?'<span class="v839-player-number">'+esc(player.number)+'</span>':'')+
    '<span class="v415-player-copy"><strong>'+esc(player.name)+'</strong><small>'+esc(player.position==='Jugadores'?'Jugador':player.position)+'</small></span></span></button>';
}
function squadCategories(){
  const available=CATEGORY_ORDER.filter(id=>db?.categories?.[id]);
  return '<div class="v415-squad-categories" role="tablist" aria-label="Categorías">'+available.map(id=>'<button type="button" class="'+(id===squadCategory?'active':'')+'" data-v415-squad-category="'+esc(id)+'" role="tab" aria-selected="'+(id===squadCategory)+'">'+esc(categoryLabel(id))+'</button>').join('')+'</div><div class="v415-squad-line"><i></i></div>';
}
function squadMarkup(){
  ensureSquadSelection();
  const groups=currentRosterGroups();
  return '<section class="v415-squad-view" data-v415-squad-view>'+squadCategories()+
    (groups.length?groups.map(group=>'<section class="v839-position-group"><h2>'+esc(group.position)+'</h2><div class="v415-player-grid">'+group.players.map(squadPlayerCard).join('')+'</div></section>').join(''):'<div class="v415-empty v415-squad-empty">No hay jugadores oficiales publicados para este equipo.</div>')+'</section>';
}
function teamPicker(){
  if(activeView==='calendar')return '';
  ensureSquadSelection();
  return '<div class="v415-team-picker-wrap"><label for="v839-squad-team">Equipo</label><select id="v839-squad-team" data-v415-squad-team>'+rosterTeams().map(team=>'<option value="'+esc(team)+'"'+(norm(team)===norm(squadTeam)?' selected':'')+'>'+esc(team)+'</option>').join('')+'</select></div>';
}
function playerPickerMarkup(){
  if(!playerPickerOpen)return '';
  return '<div class="v839-picker-backdrop" data-v839-picker-close></div><section class="v839-player-picker" role="dialog" aria-modal="true" aria-labelledby="v839-picker-title">'+
    '<header><h2 id="v839-picker-title">Selecciona jugador</h2><button type="button" data-v839-picker-close aria-label="Cerrar selector">×</button></header>'+
    '<div class="v839-picker-list">'+currentRosterGroups().map(group=>'<section><h3>'+esc(group.position)+'</h3>'+group.players.map(player=>'<button type="button" class="v839-picker-player '+(player.name===selectedPlayer?'active':'')+'" data-v839-player="'+esc(player.name)+'" aria-pressed="'+(player.name===selectedPlayer)+'">'+
      '<span class="v839-picker-number">'+esc(player.number)+'</span>'+playerVisual(player,'v839-picker-photo')+'<span><strong>'+esc(player.name)+'</strong><small>'+esc(player.position==='Jugadores'?'Jugador':player.position)+'</small></span></button>').join('')+'</section>').join('')+'</div></section>';
}
function playerMarkup(){
  const player=currentRoster().find(player=>player.name===selectedPlayer);
  if(!player)return squadMarkup();
  const usage=playerUsage(player.name);
  return '<section class="v839-player-view"><header class="v839-player-head"><button type="button" data-v839-player-back aria-label="Mostrar plantilla"><svg viewBox="0 0 24 24"><path d="M20 12H4m7-7-7 7 7 7"/></svg></button><button type="button" data-v839-picker-open aria-label="Selecciona jugador"><svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6 20v-3a6 6 0 0 1 12 0v3M19 7v6M16 10h6"/></svg></button></header>'+
    '<div class="v839-player-hero">'+playerVisual(player,'v839-player-hero-art')+'<div class="v839-player-hero-caption">'+(player.number?'<b>'+esc(player.number)+'</b>':'')+'<span><h1>'+esc(player.name)+'</h1><small>'+esc(player.position==='Jugadores'?'Jugador':player.position)+'</small></span></div></div>'+
    '<div class="v839-player-tabs" role="tablist" aria-label="Datos del jugador">'+['Resumen','Estadísticas'].map(panel=>'<button type="button" role="tab" aria-selected="'+(playerPanel===panel)+'" class="'+(playerPanel===panel?'active':'')+'" data-v839-player-panel="'+panel+'">'+panel+'</button>').join('')+'</div>'+
    (playerPanel==='Resumen'?'<section class="v839-player-public"><h2>Datos del jugador</h2><dl><div><dt>Nombre completo</dt><dd>'+esc(player.name)+'</dd></div><div><dt>Equipo</dt><dd>'+logoMarkup(squadTeam)+'<span>'+esc(squadTeam)+'</span></dd></div><div><dt>Categoría</dt><dd>'+esc(categoryLabel(squadCategory))+'</dd></div><div><dt>Posición</dt><dd>'+esc(player.position==='Jugadores'?'No publicada':player.position)+'</dd></div>'+(player.number?'<div><dt>Dorsal</dt><dd>'+esc(player.number)+'</dd></div>':'')+'</dl></section>':'<section class="v839-player-public"><h2>Estadísticas oficiales</h2><dl><div><dt>Cédulas registradas</dt><dd>'+esc(usage?.cedulas??'No publicadas')+'</dd></div></dl></section>')+
    '<button type="button" class="v839-full-profile" data-v839-full-profile="'+esc(player.name)+'">Ver ficha completa</button></section>'+playerPickerMarkup();
}
function alignReferenceStrips(root,center=false){
  const strip=root.querySelector('.v415-month-strip');
  const active=strip?.querySelector('button.active');
  const line=root.querySelector('.v415-month-line');
  if(strip&&active&&line){
    if(center)strip.scrollLeft=Math.max(0,active.offsetLeft-(strip.clientWidth-active.offsetWidth)/2);
    const pos=monthIndicator(strip.getBoundingClientRect(),active.getBoundingClientRect());
    line.style.setProperty('--v839-month-center',pos.center+'px');
    line.style.setProperty('--v839-month-width',pos.width+'px');
  }
  const categories=root.querySelector('.v415-squad-categories');
  const selected=categories?.querySelector('.active');
  const categoryLine=root.querySelector('.v415-squad-line');
  if(categories&&selected&&categoryLine){
    if(center)categories.scrollLeft=Math.max(0,selected.offsetLeft-(categories.clientWidth-selected.offsetWidth)/2);
    const pos=monthIndicator(categories.getBoundingClientRect(),selected.getBoundingClientRect());
    categoryLine.style.setProperty('--v839-category-center',pos.center+'px');
    categoryLine.style.setProperty('--v839-category-width',selected.offsetWidth+'px');
  }
}
function standingsMarkup(){
  const available=CATEGORY_ORDER.filter(id=>db?.categories?.[id]);
  if(!available.includes(squadCategory))squadCategory=available[0]||'3';
  const tables=db?.categories?.[squadCategory]?.standings||[];
  return '<section class="v837-standings-view">'+
    '<div class="v415-squad-categories">'+available.map(id=>'<button type="button" class="'+(id===squadCategory?'active':'')+'" data-v837-standing-category="'+esc(id)+'">'+esc(categoryLabel(id))+'</button>').join('')+'</div>'+
    '<h2>'+esc(categoryLabel(squadCategory))+'</h2>'+
    (tables.length?tables.map(t=>'<div class="v837-standings-scroll"><table><thead><tr>'+t.headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+t.rows.map(row=>'<tr>'+row.map((value,i)=>'<td>'+(i===1?'<span class="v837-table-team">'+logoMarkup(value)+'<span>'+esc(value)+'</span></span>':esc(value))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>').join(''):'<div class="v415-empty">Clasificación oficial no publicada.</div>')+
  '</section>';
}
function icsEscape(v){return String(v??'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function addToCalendar(g){
  if(!g)return;
  const date=String(g.iso||'').replace(/-/g,'');
  const hasTime=/^\d{2}:\d{2}$/.test(g.time||'');
  let dtStart='',dtEnd='';
  if(hasTime){
    const [hh,mm]=g.time.split(':').map(Number);
    const d=new Date(g.year,g.month,g.day,hh,mm||0,0);
    const e=new Date(d.getTime()+2*60*60*1000);
    const fmt=x=>x.getFullYear()+pad(x.getMonth()+1)+pad(x.getDate())+'T'+pad(x.getHours())+pad(x.getMinutes())+'00';
    dtStart='DTSTART;TZID=America/Mexico_City:'+fmt(d);
    dtEnd='DTEND;TZID=America/Mexico_City:'+fmt(e);
  }else{
    dtStart='DTSTART;VALUE=DATE:'+date;
    const e=new Date(g.year,g.month,g.day+1);
    dtEnd='DTEND;VALUE=DATE:'+e.getFullYear()+pad(e.getMonth()+1)+pad(e.getDate());
  }
  const title=g.home+' vs '+g.away;
  const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Calendario//ES','BEGIN:VEVENT',
    'UID:'+g.id+'@juventinorosasliga.com',dtStart,dtEnd,
    'SUMMARY:'+icsEscape(title),'LOCATION:'+icsEscape(g.venue||''),
    'DESCRIPTION:'+icsEscape((g.category||'')+(g.round?' · Jornada '+g.round:'')),
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  try{
    const blob=new Blob([body],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='partido-'+g.iso+'.ics';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }catch(_){}
}

function dayLogoStack(dayGames){
  const first=dayGames[0]||{};
  const home=String(first.home||'').trim();
  const away=String(first.away||'').trim();
  let html='<span class="v415-day-logos" aria-label="'+esc((home||'Local')+' vs '+(away||'Visitante'))+'">'+
    (home?logoMarkup(home,'is-home'):'')+
    (away?logoMarkup(away,'is-away is-second'):'')+
  '</span>';
  if(dayGames.length>1){
    html+='<span class="v415-day-dots" aria-label="'+dayGames.length+' partidos">'+
      Array.from({length:2},(_,i)=>'<i'+(i===0?' class="on"':'')+'></i>').join('')+
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
    const now=new Date();
    const todayIso=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate());
    const isToday=iso===todayIso;
    cells+='<button type="button" class="v415-day'+(list.length?' has-match':'')+(selectedIso===iso?' selected':'')+(isToday?' today':'')+'" data-v415-date="'+iso+'" aria-label="'+d+' de '+monthName(m)+(list.length?', '+list.length+' partido'+(list.length>1?'s':''):'')+'">'+
      (list.length?dayLogoStack(list):'<span class="v415-day-number">'+d+'</span>')+
      (isToday&&list.length?'<span class="v415-today-badge">'+d+'</span>':'')+
    '</button>';
  }
  return '<div class="v415-week">'+['D','L','M','X','J','V','S'].map(d=>'<b>'+d+'</b>').join('')+'</div>'+
    '<div class="v415-grid">'+cells+'</div>';
}

function statusText(g){
  if(g.score)return 'Finalizado';
  if(/\bGANA\b/i.test(g.status||''))return g.status;
  if(g.played)return 'Jugado';
  return 'Programado';
}

function matchCard(g){
  const roundText=g.round?'Jornada '+g.round:'Partido oficial';
  const dateLine=shortDate(g.iso)+(g.time?' · '+g.time:'');
  return '<article class="v415-match-card v448-reference-card">'+
    '<header class="v448-card-head">'+
      '<div class="v415-match-meta"><b>'+esc(g.category)+'</b><span>·</span><span>'+esc(roundText)+'</span></div>'+
      '<div class="v415-match-date">'+esc(dateLine)+'</div>'+
    '</header>'+
    '<div class="v415-match-main v448-teams-row">'+
      '<div class="v415-match-team v448-home">'+logoMarkup(g.home,'large')+'<b>'+esc(g.home)+'</b></div>'+
      '<div class="v415-match-center v448-center-action">'+
        '<button type="button" class="v415-add-calendar" data-v415-add-calendar="'+esc(g.id)+'" aria-label="Agregar partido al calendario"><span>＋</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16"/></svg></button>'+
      '</div>'+
      '<div class="v415-match-team v448-away">'+logoMarkup(g.away,'large')+'<b>'+esc(g.away)+'</b></div>'+
    '</div>'+
    '<button type="button" class="v415-primary-match-action" data-v415-open-match="'+esc(g.id)+'"><span class="v415-ticket-icon" aria-hidden="true"><i></i></span><b>Ver detalles</b></button>'+
    '<button type="button" class="v415-venue" data-v415-open-match="'+esc(g.id)+'"><span>Área de partido</span></button>'+
    '<footer class="v415-match-footer"><b>'+esc(g.category)+(g.round?' · Jornada '+esc(g.round):'')+'</b><span>'+esc(g.venue||'Campo por confirmar')+'</span></footer>'+
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
  const todayDay=now.getFullYear()===y&&now.getMonth()===m?now.getDate():1;
  const nearest=[...inMonth].sort((a,b)=>Math.abs(a.day-todayDay)-Math.abs(b.day-todayDay)||b.day-a.day)[0];
  selectedIso=nearest?.iso||prefix+pad(todayDay);
}

function bind(root){
  root.querySelectorAll('.v415-player-portrait').forEach(image=>{
    const loaded=()=>image.previousElementSibling?.classList.add('v839-hide-fallback');
    image.addEventListener('load',loaded,{once:true});
    image.addEventListener('error',()=>image.remove(),{once:true});
    if(image.complete&&image.naturalWidth)loaded();
  });
  root.querySelectorAll('[data-v839-player]').forEach(button=>button.addEventListener('click',()=>{
    selectedPlayer=button.dataset.v839Player;activeView='player';playerPickerOpen=false;playerPanel='Resumen';render();screen().scrollTop=0;window.scrollTo(0,0);
  }));
  root.querySelector('[data-v839-player-back]')?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();activeView='squad';playerPickerOpen=false;render();window.scrollTo(0,0)});
  root.querySelector('[data-v839-picker-open]')?.addEventListener('click',()=>{playerPickerOpen=true;render();requestAnimationFrame(()=>root.querySelector('[data-v839-picker-close]')?.focus())});
  root.querySelectorAll('[data-v839-picker-close]').forEach(button=>button.addEventListener('click',()=>{playerPickerOpen=false;render();requestAnimationFrame(()=>root.querySelector('[data-v839-picker-open]')?.focus())}));
  root.querySelectorAll('[data-v839-player-panel]').forEach(button=>button.addEventListener('click',()=>{playerPanel=button.dataset.v839PlayerPanel;render()}));
  root.querySelector('[data-v839-full-profile]')?.addEventListener('click',()=>{
    const player={name:selectedPlayer,team:squadTeam,cat:squadCategory};
    if(window.LJR_PLAYER_PROFILE_API?.open)window.LJR_PLAYER_PROFILE_API.open(player);
  });
  root.querySelectorAll('.v415-month-strip,.v415-squad-categories').forEach(strip=>strip.addEventListener('scroll',()=>alignReferenceStrips(root),{passive:true}));
  root.querySelector('[data-v415-top-back]')?.addEventListener('click',()=>{
    if(history.length>1)history.back();else location.hash='#/more';
  });
  root.querySelector('[data-v415-top-profile]')?.addEventListener('click',()=>{
    location.hash='#/profile';
  });
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
  root.querySelectorAll('[data-v415-filter-close]').forEach(btn=>btn.addEventListener('click',()=>{
    filterOpen=false;
    render();
  }));
  root.querySelector('[data-v415-all-categories]')?.addEventListener('click',()=>{
    const allOn=CATEGORY_ORDER.every(id=>enabledCategories.has(id));
    enabledCategories.clear();
    if(!allOn)CATEGORY_ORDER.forEach(id=>{if(db?.categories?.[id])enabledCategories.add(id)});
    syncSelectedCategory();
    selectedIso='';
    render();
  });
  root.querySelectorAll('[data-v415-category-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.v415CategoryToggle||'';
    if(!id)return;
    if(enabledCategories.has(id)){if(enabledCategories.size>1)enabledCategories.delete(id)}
    else enabledCategories.add(id);
    syncSelectedCategory();
    selectedIso='';
    render();
  }));
  root.querySelectorAll('[data-v415-squad-category]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.v415SquadCategory||'3';
    squadCategory=id;squadTeam='';activeView='squad';filterOpen=false;render();
  }));
  root.querySelector('[data-v415-squad-team]')?.addEventListener('change',e=>{squadTeam=e.target.value||'';selectedPlayer='';filterOpen=false;render()});
  root.querySelectorAll('[data-v415-add-calendar]').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const g=games().find(x=>x.id===btn.dataset.v415AddCalendar);
    addToCalendar(g);
  }));
  root.querySelectorAll('[data-v415-open-match]').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const g=games().find(x=>x.id===btn.dataset.v415OpenMatch);
    if(!g)return;
    try{
      sessionStorage.setItem('lj-match-detail',JSON.stringify({
        id:g.id,
        from:'#/v4-calendar',
        home:g.home,
        away:g.away,
        time:g.time||'Por confirmar',
        date:shortDate(g.iso),
        venue:g.venue||'Campo por confirmar',
        category:g.category||'Liga Municipal',
        jornada:g.round||''
      }));
      sessionStorage.removeItem('v69-match-center-entry');
    }catch(_){}
    location.hash='#/match';
  }));
  root.querySelectorAll('[data-v415-go]').forEach(btn=>btn.addEventListener('click',()=>{
    const dest=btn.dataset.v415Go;
    if(dest==='calendar'){
      activeView='calendar';
      filterOpen=false;
      render();
      return;
    }
    if(dest==='standings'){
      activeView='standings';
      filterOpen=false;
      render();
      return;
    }
    if(dest==='teams'){
      activeView='squad';
      filterOpen=false;
      render();
      return;
    }
    if(dest==='matches'){
      location.hash='#/competition';
      return;
    }
  }));
  root.querySelectorAll('[data-v837-standing-category]').forEach(btn=>btn.addEventListener('click',()=>{
    squadCategory=btn.dataset.v837StandingCategory;
    render();
  }));
}

function calendarTopbar(){
  return '<header class="v415-reference-topbar" data-v415-reference-topbar aria-label="Barra superior">'+
    '<button type="button" class="v415-reference-back" data-v415-top-back aria-label="Regresar">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5M8 12h12"/></svg>'+
    '</button>'+
    '<span class="v415-reference-trophy" aria-hidden="true"></span>'+
    '<button type="button" class="v415-reference-profile" data-v415-top-profile aria-label="Perfil">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6"/><circle cx="12" cy="8.1" r="2.85"/><path d="M5.35 19.15c1.55-3.35 3.76-4.9 6.65-4.9s5.1 1.55 6.65 4.9"/></svg>'+
    '</button>'+
  '</header>';
}

function render(){
  if(!isCalendarRoute()||rendering)return;
  const root=screen(); if(!root)return;
  rendering=true;
  try{
    document.body.classList.add('v70-calendar-active','v103-calendar-active','v415-calendar-active','v839-reference-calendar');
    const allGames=games();
    pickSelected(allGames);
    const y=viewDate.getFullYear(),m=viewDate.getMonth();
    const monthGames=allGames.filter(g=>g.year===y&&g.month===m);

    root.innerHTML='<section class="v103-calendar-page v415-calendar-page v839-reference-page" data-view="'+activeView+'" data-v103-calendar data-v415-calendar>'+
      (activeView==='player'?playerMarkup():(topTabs()+categoryPanel()+(activeView==='squad'?squadMarkup():activeView==='standings'?standingsMarkup():(monthStrip()+calendarGrid(monthGames)+selectedMatches(allGames)))))+
    '</section>';
    document.body.classList.toggle('v839-picker-open',playerPickerOpen&&activeView==='player');
    bind(root);
    requestAnimationFrame(()=>alignReferenceStrips(root,true));
    try{window.LJR_TEAM_LOGOS?.refresh?.()}catch(_){}
  }finally{
    rendering=false;
  }
}

let timer=0;
async function schedule(force=false){
  if(!isCalendarRoute()){
    document.body.classList.remove('v415-calendar-active','v839-reference-calendar','v839-picker-open');
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
window.addEventListener('resize',()=>{if(isCalendarRoute())alignReferenceStrips(screen(),true)});
document.addEventListener('keydown',event=>{
  if(!isCalendarRoute()||!playerPickerOpen)return;
  if(event.key==='Escape'){playerPickerOpen=false;render();return}
  if(event.key==='Tab'){
    const nodes=[...screen().querySelectorAll('.v839-player-picker button')];
    if(event.shiftKey&&document.activeElement===nodes[0]){event.preventDefault();nodes.at(-1)?.focus()}
    else if(!event.shiftKey&&document.activeElement===nodes.at(-1)){event.preventDefault();nodes[0]?.focus()}
  }
});
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
