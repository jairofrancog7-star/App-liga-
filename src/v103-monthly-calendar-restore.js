/* V103 — Restaurar Calendario mensual.
   Aísla #/v4-calendar del Match Center y vuelve a mostrar la cuadrícula mensual.
   Usa programación oficial cuando está disponible y no modifica #/v4-matchcenter. */
(function(){
'use strict';
if(window.__LJR_V103_MONTHLY_CALENDAR__)return;
window.__LJR_V103_MONTHLY_CALENDAR__=true;

var ROUTE='v4-calendar';
var BUILD='20260920-calendar-restore-v103';
var db=window.LJR_OFFICIAL_DATA||null;
var loading=null;
var rendering=false;
var selectedDate='';

function route(){return location.hash.replace(/^#\//,'').split('?')[0]||'home'}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pad(n){return String(n).padStart(2,'0')}
function isoFromOfficial(v){
  var m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  return m?m[3]+'-'+pad(m[2])+'-'+pad(m[1]):'';
}
function clock(v){
  var m=String(v||'').match(/\s(\d{1,2}:\d{2})/);
  return m?m[1]:'Por confirmar';
}
function displayDate(iso){
  var p=String(iso||'').split('-');
  return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:iso;
}
function prettyName(v){
  return String(v||'').trim().toLowerCase().replace(/(^|\s|[-.])([a-záéíóúñ])/g,function(_,a,b){return a+b.toUpperCase()});
}
function logoUrl(name){
  try{
    var a=window.LJR_OFFICIAL_API&&window.LJR_OFFICIAL_API.getLogo&&window.LJR_OFFICIAL_API.getLogo(name);
    if(a)return a;
  }catch(_){}
  try{
    var b=window.LJR_TEAM_LOGOS&&window.LJR_TEAM_LOGOS.get&&window.LJR_TEAM_LOGOS.get(name);
    if(b)return b;
  }catch(_){}
  var logos=(db&&db.team_logos)||{};
  var key=Object.keys(logos).find(function(k){return String(k).trim().toUpperCase()===String(name||'').trim().toUpperCase()});
  var e=key?logos[key]:null;
  var p=typeof e==='string'?e:(e&&((e.local||e.source||e.url)))||'';
  return p||'';
}
function teamIcon(name){
  var src=logoUrl(name);
  if(src){
    return '<span class="v70-team-icon"><img src="'+esc(src)+'" alt="'+esc(prettyName(name))+'" loading="lazy" decoding="async"></span>';
  }
  return '<span class="v70-team-icon v70-team-icon-fallback" aria-label="'+esc(prettyName(name))+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 18.8 6.7 17.5 15 12 20l-5.5-5L5.2 6.7 12 3Z"/><path d="m9.1 9.1 2.9-2 2.9 2-1.1 3.3h-3.6L9.1 9.1Zm-2.6 5.8 3.7-2.5m3.6 0 3.7 2.5M12 7.1V3.8"/></svg></span>';
}
function officialFixtures(){
  var out=[];
  var cats=(db&&db.categories)||{};
  Object.keys(cats).forEach(function(catId){
    var cat=cats[catId]||{};
    (cat.fixtures||[]).forEach(function(group){
      (group.rows||[]).forEach(function(r){
        if(!r||!r[2]||!r[6])return;
        var iso=isoFromOfficial(r[8]);
        if(!iso)return;
        var hs=String(r[3]==null?'':r[3]).trim();
        var as=String(r[5]==null?'':r[5]).trim();
        var hasScore=/^\d+$/.test(hs)&&/^\d+$/.test(as);
        out.push({
          id:String(r[0]||''),
          date:iso,
          home:String(r[2]||'').trim(),
          away:String(r[6]||'').trim(),
          center:hasScore?(hs+'–'+as):clock(r[8]),
          venue:String(r[7]||'').trim(),
          category:String(cat.name||'').trim(),
          round:String(r[1]||'').trim()
        });
      });
    });
  });
  return out.sort(function(a,b){return (a.date+a.center).localeCompare(b.date+b.center)});
}
function monthLabel(y,m){
  var names=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return names[m]+' '+y;
}
function currentMonth(){
  var now=new Date();
  return {year:now.getFullYear(),month:now.getMonth(),iso:now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())};
}
function dateMatches(iso,fixtures){
  var games=fixtures.filter(function(x){return x.date===iso});
  var html='<section class="section v70-calendar-matches"><div class="section-head"><h2><span class="v70-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3.5v4M17 3.5v4M3.5 9.5h17"/></svg></span>Partidos · '+esc(displayDate(iso))+'</h2></div>';
  if(!games.length)return html+'<div class="empty-mini">No hay partidos programados para esta fecha.</div></section>';
  html+='<div class="card match-card v70-match-card">';
  games.forEach(function(m){
    html+='<div class="v70-match-row"><span class="v70-club home">'+teamIcon(m.home)+'<b>'+esc(prettyName(m.home))+'</b></span><strong class="v70-score">'+esc(m.center)+'</strong><span class="v70-club away">'+teamIcon(m.away)+'<b>'+esc(prettyName(m.away))+'</b></span></div>';
  });
  return html+'</div></section>';
}
function render(){
  if(route()!==ROUTE||rendering)return;
  var screen=document.querySelector('#screen');
  if(!screen)return;
  rendering=true;

  var now=currentMonth();
  var y=now.year,m=now.month;
  var fixtures=officialFixtures();
  var first=new Date(y,m,1);
  var days=new Date(y,m+1,0).getDate();
  var offset=(first.getDay()+6)%7;
  var names=['L','M','X','J','V','S','D'];
  var cells=[];
  for(var x=0;x<offset;x++)cells.push('<span class="v4-day empty"></span>');
  for(var d=1;d<=days;d++){
    var iso=y+'-'+pad(m+1)+'-'+pad(d);
    var count=fixtures.filter(function(g){return g.date===iso}).length;
    cells.push('<button type="button" class="v4-day '+(count?'has-match':'')+'" data-v103-date="'+iso+'" aria-label="'+d+' de '+monthLabel(y,m)+'"><b>'+d+'</b>'+(count?'<i>'+count+'</i>':'')+'</button>');
  }

  var inMonthToday=now.iso.slice(0,7)===(y+'-'+pad(m+1));
  var firstMatch=fixtures.find(function(g){return g.date.slice(0,7)===(y+'-'+pad(m+1))});
  selectedDate=(selectedDate&&selectedDate.slice(0,7)===(y+'-'+pad(m+1)))?selectedDate:(inMonthToday?now.iso:(firstMatch?firstMatch.date:(y+'-'+pad(m+1)+'-01')));

  screen.innerHTML='<section class="v70-calendar-page" data-v103-calendar>'+
    '<div class="v70-calendar-title"><span class="v70-calendar-kicker"><span class="v70-calendar-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3.5v4M17 3.5v4M3.5 9.5h17"/></svg></span>CALENDARIO</span><h1>'+esc(monthLabel(y,m))+'</h1><p>Consulta jornadas y partidos por fecha.</p></div>'+
    '<div class="v4-week">'+names.map(function(n){return '<b>'+n+'</b>'}).join('')+'</div>'+
    '<div class="v4-calendar">'+cells.join('')+'</div>'+
    '<div id="v4DateMatches">'+dateMatches(selectedDate,fixtures)+'</div>'+
  '</section>';

  document.body.classList.add('v70-calendar-active');
  document.body.classList.remove('v92-match-center-official');
  Array.from(document.querySelectorAll('.bottom-nav .nav-item')).forEach(function(n){n.classList.remove('active')});
  Array.from(screen.querySelectorAll('[data-v103-date]')).forEach(function(btn){
    btn.onclick=function(){
      selectedDate=btn.getAttribute('data-v103-date')||selectedDate;
      var mount=document.querySelector('#v4DateMatches');
      if(mount)mount.innerHTML=dateMatches(selectedDate,fixtures);
    };
  });
  try{window.LJR_TEAM_LOGOS&&window.LJR_TEAM_LOGOS.refresh&&window.LJR_TEAM_LOGOS.refresh()}catch(_){}
  rendering=false;
}
async function load(){
  if(db&&db.categories)return db;
  if(loading)return loading;
  loading=(async function(){
    var urls=[
      './public/data/official-live.json?v='+BUILD,
      './data/official-live.json?v='+BUILD,
      'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v='+BUILD
    ];
    for(var i=0;i<urls.length;i++){
      try{
        var res=await fetch(urls[i],{cache:'no-store'});
        if(res.ok){db=await res.json();break}
      }catch(_){}
    }
    return db;
  })();
  return loading;
}
async function sync(){
  var on=route()===ROUTE;
  document.body.classList.toggle('v70-calendar-active',on);
  if(!on)return;
  await load();
  render();
}
window.addEventListener('hashchange',function(){setTimeout(sync,0)});
window.addEventListener('ljr:official-data',function(){if(route()===ROUTE){db=window.LJR_OFFICIAL_DATA||db;setTimeout(render,0)}});
var screen=document.querySelector('#screen');
if(screen)new MutationObserver(function(){
  if(route()===ROUTE&&!screen.querySelector('[data-v103-calendar]'))setTimeout(render,0);
}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
setTimeout(sync,250);
})();