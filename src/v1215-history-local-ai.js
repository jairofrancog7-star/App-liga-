/* V1215 — Asistente inteligente de Historial. Análisis local, revisión automática,
   consultas en español, CSV y modelo ML opcional (solo con autorización).
   Nunca publica ni modifica marcadores, cédulas, permisos ni datos oficiales. */
(function(){
'use strict';
if(window.__LJR_HISTORY_LOCAL_AI_V1215__)return;
window.__LJR_HISTORY_LOCAL_AI_V1215__=true;
const STORE='ljr-history-local-audit-v1215';
const PREF='ljr-history-auto-v1215';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const LOCAL='./data/official-live.json';
const TRAINING=[
 ['recent','últimos resultados','últimos partidos','partidos recientes','encuentros anteriores','jornada reciente'],
 ['goals','más goles','máximo marcador','partidos con goles','encuentros de muchos goles','anotaciones totales'],
 ['margin','goleadas','mayor diferencia','victorias más amplias','mayor goleada','ganaron por muchos'],
 ['draws','empates','partidos empatados','marcadores iguales','cuantos empates','resultado empate'],
 ['wins','cuantas victorias','partidos ganados','cuántos ganó','triunfos del equipo','veces ganó'],
 ['summary','resumen general','estadísticas equipo','balance de partidos','cuantos goles','totales por año'],
 ['audit','revisar datos','partidos duplicados','canchas pendientes','fechas incompletas','auditoría de resultados']
];
const CHECK_INTERVAL=30*60*1000;
let mountPending=false,refreshing=false,lastCheck=0,refreshTimer=null,requestController=null;
let lastFindings=null,lastMessage='',cachedData=null,cachedRows=null,lastSnapshotData=null,lastAudit=null;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeGet=(key,def)=>{try{return localStorage.getItem(key)??def}catch(_){return def}};
const safeSet=(key,value)=>{try{localStorage.setItem(key,value)}catch(_){}};
const getDb=()=>window.LJR_OFFICIAL_DATA?.categories?window.LJR_OFFICIAL_DATA:null;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const catLabel={
 '1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza',
 '4':'Segunda Fuerza','5':'Intermedia'
};
function entries(data=getDb()){
  if(data&&data===cachedData&&cachedRows)return cachedRows;
  const out=[];
  if(!data?.categories)return out;
  for(const [catId,cat] of Object.entries(data.categories)){
    for(const block of cat.fixtures||[]){
      for(const row of block?.rows||[]){
        const h=String(row?.[3]??''),a=String(row?.[5]??'');
        const home=String(row?.[2]||'').trim(),away=String(row?.[6]||'').trim();
        if(!/^\d+$/.test(h)||!/^\d+$/.test(a)||!home||!away)continue;
        const date=String(row?.[8]||'').trim();
        const match=date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
        const stamp=match?Date.UTC(+match[3],+match[2]-1,+match[1],+(match[4]||0),+(match[5]||0)):0;
        const homeGoals=+h,awayGoals=+a;
        out.push({
          key:[catId,norm(home),norm(away),norm(row?.[1]),date].join('|'),
          catId,category:cat.name||catLabel[catId]||'Categoría',
          round:String(row?.[1]||''),home,away,homeGoals,awayGoals,
          score:h+'–'+a,goals:homeGoals+awayGoals,
          venue:String(row?.[7]||'Campo por confirmar').trim(),
          date,year:match?match[3]:date.match(/\b(?:19|20)\d\d\b/)?.[0]||'',
          stamp
        });
      }
    }
  }
  out.sort((a,b)=>b.stamp-a.stamp);
  if(data){cachedData=data;cachedRows=out;}
  return out;
}
function byNativeFilter(list){
  const root=document.querySelector('[data-v164-history-log]');
  if(!root)return list;
  const cat=root.querySelector('[data-v164-category]')?.value||'all';
  const year=root.querySelector('[data-v164-year]')?.value||'all';
  const team=root.querySelector('[data-v164-team]')?.value||'all';
  const search=norm(root.querySelector('[data-v164-search]')?.value||'');
  return list.filter(x=>(cat==='all'||x.catId===cat)&&
    (year==='all'||x.year===year)&&
    (team==='all'||norm(x.home)===team||norm(x.away)===team)&&
    (!search||norm([x.home,x.away,x.category,x.round,x.venue,x.date].join(' ')).includes(search)));
}
function audit(list){
  const seen=new Map(),duplicates=[],venues=[],dates=[];
  for(const x of list){
    if(seen.has(x.key)){duplicates.push(x);continue}
    seen.set(x.key,x);
    if(!x.venue||/por confirmar|sin asignar|pendiente/i.test(x.venue))venues.push(x);
    if(!x.stamp)dates.push(x);
  }
  return {duplicates,venues,dates};
}
function storedSnapshot(){
  try{return JSON.parse(safeGet(STORE,'null'))}catch(_){return null}
}
function inspect(list,save=true){
  const previous=storedSnapshot(),today={};
  for(const x of list)today[x.key]=x.score;
  const fresh=previous?.scores?list.filter(x=>!Object.hasOwn(previous.scores,x.key)):[];
  const changed=previous?.scores?list.filter(x=>Object.hasOwn(previous.scores,x.key)&&previous.scores[x.key]!==x.score):[];
  const missing=audit(list);
  if(save)safeSet(STORE,JSON.stringify({scores:today,checkedAt:new Date().toISOString()}));
  return {...missing,fresh,changed,previous:!!previous};
}
function message(text){
  lastMessage=String(text||'');
  const p=document.querySelector('[data-v1215-status]');
  if(p)p.textContent=lastMessage;
}
function analysisText(textValue){
  const out=document.querySelector('[data-v1215-answer]');
  if(out){out.hidden=false;out.textContent=textValue;}
}
function renderAudit(){
  const data=getDb(),list=entries(data);
  const info=data===lastSnapshotData&&lastAudit?lastAudit:inspect(list,true);
  lastSnapshotData=data;lastAudit=info;
  const noticeCounts=lastFindings||{fresh:info.fresh.length,changed:info.changed.length};
  const box=document.querySelector('[data-v1215-audit]');
  if(box){
    box.hidden=false;
    box.innerHTML=
      '<strong>Revisión del archivo</strong>'+
      '<div class="v1215-audit-stats">'+
        '<span><b>'+list.length+'</b> partidos</span>'+
        '<span><b>'+noticeCounts.fresh+'</b> nuevos</span>'+
        '<span><b>'+noticeCounts.changed+'</b> marcadores modificados</span>'+
      '</div>'+
      '<p>'+info.duplicates.length+' posibles duplicados · '+
      info.venues.length+' canchas por confirmar · '+
      info.dates.length+' fechas sin formato reconocido.</p>'+
      '<small>Las alertas son orientativas: no corrigen ni validan datos oficiales.</small>';
  }
  return info;
}
function findTeam(query,list){
  const q=norm(query), teams=new Map();
  for(const x of list)for(const name of [x.home,x.away])teams.set(norm(name),name);
  const keys=[...teams.keys()].filter(n=>n.length>2).sort((a,b)=>b.length-a.length);
  const exact=keys.find(n=>q.includes(n));if(exact)return exact;
  // Coincidencias parciales solo si hay un único club posible: evita confundir clubes.
  const words=q.split(' ').filter(w=>w.length>=4);
  for(const word of words){
    const hits=keys.filter(n=>n.split(' ').includes(word));
    if(hits.length===1)return hits[0];
  }
  // Tolerancia a nombres con 1–2 errores sin usar servicios externos.
  const possible=new Set();
  for(const word of words){
    if(word.length<5)continue;
    for(const name of keys){
      if(name.split(' ').some(token=>token.length>=5&&distance(word,token)<=Math.min(2,Math.floor(word.length/4))))possible.add(name);
    }
  }
  return possible.size===1?[...possible][0]:'';
}
function distance(a,b){
  if(a===b)return 0;
  if(Math.abs(a.length-b.length)>2)return 99;
  let prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=0;i<a.length;i++){
    const next=[i+1];
    for(let j=0;j<b.length;j++)next[j+1]=Math.min(next[j]+1,prev[j+1]+1,prev[j]+(a[i]===b[j]?0:1));
    prev=next;
  }
  return prev[b.length];
}
function applyNativePrompt(prompt){
  const root=document.querySelector('[data-v164-history-log]');if(!root)return;
  const all=entries(),cat=findCategory(prompt,all),team=findTeam(prompt,all);
  const year=norm(prompt).match(/\b(?:19|20)\d{2}\b/)?.[0]||'';
  const change=selector=>{
    const el=root.querySelector(selector);if(el)el.dispatchEvent(new Event('change',{bubbles:true}));
  };
  const catSelect=root.querySelector('[data-v164-category]');
  if(catSelect){catSelect.value=cat&&catSelect.querySelector('option[value="'+cat+'"]')?cat:'all';change('[data-v164-category]')}
  const yearSelect=root.querySelector('[data-v164-year]');
  if(yearSelect){yearSelect.value=year&&yearSelect.querySelector('option[value="'+year+'"]')?year:'all';change('[data-v164-year]')}
  const teamSelect=root.querySelector('[data-v164-team]');
  if(teamSelect){
    const option=team&&[...teamSelect.options].find(o=>o.value===team);
    teamSelect.value=option?option.value:'all';change('[data-v164-team]');
  }
  const search=root.querySelector('[data-v164-search]');
  if(search&&search.value){
    search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
  }
}
function findCategory(query,list){
  const q=norm(query);
  let id='';
  if(/(?:veteranos?|mayores?).*(?:50|cincuenta)|(?:50|cincuenta).*(?:veteranos?|anos)/.test(q))id='1';
  else if(/(?:veteranos?|mayores?).*(?:35|treinta y cinco)|(?:35|treinta y cinco).*(?:veteranos?|anos)/.test(q))id='2';
  else if(/\bintermedia\b/.test(q))id='5';
  else if(/\bsegunda\b/.test(q))id='4';
  else if(/\bprimera\b/.test(q))id='3';
  return list.some(x=>x.catId===id)?id:'';
}
function intentOf(query){
  const q=norm(query);
  if(/duplicad|incomplet|sin cancha|sin fecha|auditor|errores?|pendient|revis/.test(q))return 'audit';
  if(/empate|empatados?|igualad/.test(q))return 'draws';
  if(/golead|diferencia|paliza|mayor victoria|mas amplio/.test(q))return 'margin';
  if(/mas goles|muchos goles|mayor marcador|mas anotaciones|goles en un partido/.test(q))return 'goals';
  if(/ganad|gan[oó]|victorias?|triunfos?|cuantos gan/.test(q))return 'wins';
  if(/resum|estadistic|balance|total|cantidad|cuantos goles|promedio/.test(q))return 'summary';
  return 'recent';
}
function showResultLines(list,max=5){
  return list.slice(0,max).map(x=>
    '• '+x.home+' '+x.score+' '+x.away+' · '+x.category+
    (x.date?' · '+x.date.split(' ')[0]:'')).join('\n');
}
function summarize(prompt,type){
  const all=entries(),q=norm(prompt),year=q.match(/\b(?:19|20)\d{2}\b/)?.[0]||'';
  const team=findTeam(prompt,all),category=findCategory(prompt,all);
  let list=all.filter(x=>(!year||x.year===year)&&(!team||norm(x.home)===team||norm(x.away)===team)&&(!category||x.catId===category));
  const scope=(team?'Equipo: '+(list.find(x=>norm(x.home)===team)?.home||list.find(x=>norm(x.away)===team)?.away||team)+'. ':'')+
    (category?'Categoría: '+(catLabel[category]||category)+'. ':'')+(year?'Año '+year+'. ':'');
  if(!list.length)return 'No encontré partidos publicados que coincidan con la consulta. Prueba con otra categoría, equipo o año.';
  let first=scope+'Datos registrados por la Liga: '+list.length+' partido'+(list.length===1?'':'s')+'.\n';
  if(type==='audit'){
    const a=audit(list);return first+'Posibles duplicados: '+a.duplicates.length+
      '. Canchas sin confirmar: '+a.venues.length+'. Fechas sin formato reconocido: '+a.dates.length+
      '.\nLa revisión es preventiva; no modifica resultados.';
  }
  if(type==='draws'){
    list=list.filter(x=>x.homeGoals===x.awayGoals);
    return first+'Empates encontrados: '+list.length+'.\n'+(showResultLines(list)||'No hay empates en la selección.');
  }
  if(type==='wins'){
    if(!team)return 'Para buscar victorias, escribe el nombre del equipo. Ejemplo: «¿Cuántos ganó Boavista?»';
    list=list.filter(x=>(norm(x.home)===team&&x.homeGoals>x.awayGoals)||
      (norm(x.away)===team&&x.awayGoals>x.homeGoals));
    return first+'Victorias registradas: '+list.length+'.\n'+(showResultLines(list)||'Sin victorias en los datos disponibles.');
  }
  if(type==='goals'){
    list.sort((a,b)=>b.goals-a.goals||b.stamp-a.stamp);
    return first+'Partidos con más goles (según el archivo):\n'+showResultLines(list);
  }
  if(type==='margin'){
    list.sort((a,b)=>Math.abs(b.homeGoals-b.awayGoals)-Math.abs(a.homeGoals-a.awayGoals)||b.stamp-a.stamp);
    return first+'Mayores diferencias de goles:\n'+showResultLines(list);
  }
  if(type==='summary'){
    const goals=list.reduce((n,x)=>n+x.goals,0),draws=list.filter(x=>x.homeGoals===x.awayGoals).length;
    const wins=team?list.filter(x=>norm(x.home)===team?x.homeGoals>x.awayGoals:x.awayGoals>x.homeGoals).length:null;
    return first+'Goles contabilizados: '+goals+'. Empates: '+draws+
      (wins!==null?'. Victorias: '+wins:'')+'.\n'+showResultLines(list.slice(0,3),3);
  }
  list.sort((a,b)=>b.stamp-a.stamp);
  return first+'Últimos resultados:\n'+showResultLines(list);
}
// Entrenamiento ultraligero Naive Bayes; sin redes, librerías ni modelos de 120 MB.
function tokens(v){
  return norm(v).split(/\s+/).filter(x=>x.length>=3).map(x=>x.replace(/(?:es|s)$/,''));
}
const trainingModel=(()=>{
  const classes=Object.create(null),vocab=new Set();
  for(const [intent,...samples] of TRAINING){
    const counts=new Map();let total=0;
    for(const sample of samples)for(const word of tokens(sample)){
      counts.set(word,(counts.get(word)||0)+1);vocab.add(word);total++;
    }
    classes[intent]={counts,total};
  }
  return {classes,size:vocab.size};
})();
function quickIntent(query){
  const words=tokens(query);if(!words.length)return intentOf(query);
  let best='',bestScore=-Infinity;
  for(const [intent,m] of Object.entries(trainingModel.classes)){
    let score=Math.log(1/TRAINING.length);
    for(const word of words)score+=Math.log(((m.counts.get(word)||0)+1)/(m.total+trainingModel.size));
    if(score>bestScore){bestScore=score;best=intent;}
  }
  const direct=intentOf(query);
  // Las expresiones específicas tienen prioridad ante la clasificación aproximada.
  return direct!=='recent'?direct:best||'recent';
}
function ask(prompt){
  const q=String(prompt||'').trim();
  if(!q){message('Escribe una consulta para buscar en el historial.');return}
  const intent=quickIntent(q);
  applyNativePrompt(q);
  analysisText(summarize(q,intent));
  message('Análisis local ligero, sin descargar modelos ni compartir consultas.');
}
function rowsCsv(){
  const rows=byNativeFilter(entries());
  const head=['Categoría','Jornada','Fecha','Local','Goles local','Goles visitante','Visitante','Cancha'];
  const clean=value=>{
    let s=String(value??'');
    // Previene que Excel evalúe contenidos textuales como fórmulas.
    if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  };
  return '\ufeff'+[head,...rows.map(x=>[x.category,x.round,x.date,x.home,x.homeGoals,x.awayGoals,x.away,x.venue])].map(a=>a.map(clean).join(';')).join('\r\n');
}
function downloadCsv(){
  const data=rowsCsv(),blob=new Blob([data],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='historial-liga-juventino-rosas.csv';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  message('CSV descargado con los filtros actuales. No se modificó ningún resultado.');
}
async function fetchNewest(manual=false){
  if(refreshing||!navigator.onLine||route()!=='historyLog'||document.hidden)return;
  if(!manual&&navigator.connection?.saveData)return;
  if(!manual&&/^(?:slow-2g|2g)$/.test(navigator.connection?.effectiveType||''))return;
  if(!manual&&Date.now()-lastCheck<CHECK_INTERVAL)return;
  refreshing=true;lastCheck=Date.now();
  requestController=new AbortController();
  message('Consultando los resultados oficiales…');
  try{
    // Primero el JSON de la app, usando cache HTTP y 304 condicional.
    // Sólo accedemos a GitHub si la fuente local no está disponible.
    let latest=null;
    for(const url of [LOCAL,REMOTE]){
      const res=await fetch(url,{cache:'no-cache',signal:requestController.signal});
      if(!res.ok)continue;
      latest=await res.json();
      if(latest?.categories)break;
      latest=null;
    }
    if(!latest?.categories)throw Error('Sin datos oficiales');
    if(route()!=='historyLog'||document.hidden)return;
    const previous=getDb(),currentAt=Date.parse(previous?.captured_at_utc||'')||0;
    const nextAt=Date.parse(latest.captured_at_utc||'')||0;
    if(!previous||nextAt>currentAt){
      const changes=inspect(entries(latest),false);
      lastFindings={fresh:changes.fresh.length,changed:changes.changed.length};
      window.LJR_OFFICIAL_DATA=latest;
      cachedData=null;cachedRows=null;lastSnapshotData=null;lastAudit=null;
      window.dispatchEvent(new Event('ljr:official-data'));
      message('Archivo actualizado: '+changes.fresh.length+' nuevos y '+changes.changed.length+' marcadores cambiados.');
    }else{
      if(!lastFindings)lastFindings={fresh:0,changed:0};
      message('Ya tienes la versión oficial disponible.');
    }
    renderAudit();
  }catch(err){
    if(err?.name!=='AbortError')message('No se pudo actualizar. Se conservan los datos existentes.');
  }finally{refreshing=false;requestController=null}
}
function manageRefresh(){
  if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null;}
  if(route()!=='historyLog'||document.hidden){
    requestController?.abort();return;
  }
  if(safeGet(PREF,'1')!=='1')return;
  // Sin temporizadores globales activos en otras pantallas.
  refreshTimer=setInterval(()=>fetchNewest(false),CHECK_INTERVAL);
  if(Date.now()-lastCheck>=CHECK_INTERVAL)fetchNewest(false);
}
function panelMarkup(){
 return '<section class="v1215-panel" aria-label="Asistente y automatización local del historial">'+
   '<div class="v1215-panel-head"><div><small>ASISTENTE EN TU DISPOSITIVO</small><h2>Consulta inteligente</h2></div><span class="v1215-local-tag">LOCAL</span></div>'+
   '<p class="v1215-intro">Pregunta por un equipo, una goleada, un año o una categoría. La respuesta utiliza los marcadores oficiales disponibles, sin inventar datos.</p>'+
   '<form class="v1215-form" data-v1215-form><label for="v1215-question">¿Qué quieres consultar?</label>'+
     '<div class="v1215-query-row"><input id="v1215-question" data-v1215-query maxlength="160" autocomplete="off" placeholder="Ej. Últimos resultados de Boavista" /><button type="submit">Buscar</button></div></form>'+
   '<div class="v1215-suggestions" aria-label="Consultas rápidas">'+
     '<button type="button" data-v1215-example="Últimos resultados">Recientes</button>'+
     '<button type="button" data-v1215-example="¿Cuáles fueron las mayores goleadas?">Goleadas</button>'+
     '<button type="button" data-v1215-example="¿Cuántos empates hubo?">Empates</button>'+
     '<button type="button" data-v1215-example="Revisa partidos duplicados y canchas pendientes">Revisar datos</button>'+
   '</div>'+
   '<output class="v1215-answer" data-v1215-answer aria-live="polite" hidden></output>'+
   '<div class="v1215-automation"><div class="v1215-auto-head"><h3>Automatización del archivo</h3><label class="v1215-toggle"><input type="checkbox" data-v1215-auto '+(safeGet(PREF,'1')==='1'?'checked':'')+' /> <span>Automática</span></label></div>'+
     '<p>Revisa cambios cada 30 minutos, sólo con la pantalla abierta; respeta ahorro de datos. Puedes actualizar manualmente.</p>'+
     '<div class="v1215-action-row"><button type="button" data-v1215-sync>Actualizar ahora</button><button type="button" data-v1215-audit-now>Revisar archivo</button><button type="button" data-v1215-csv>Descargar CSV</button></div>'+
     '<div class="v1215-audit" data-v1215-audit hidden></div>'+
   '</div>'+
   '<p class="v1215-light-label">IA local ligera · Sin descargas de modelos · Ahorra memoria y datos</p>'+
   '<p class="v1215-status" data-v1215-status role="status" aria-live="polite"></p>'+
 '</section>';
}
function bind(panel){
  panel.querySelector('[data-v1215-form]')?.addEventListener('submit',e=>{
    e.preventDefault();ask(panel.querySelector('[data-v1215-query]')?.value||'');
  });
  panel.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-v1215-example')){
      const inp=panel.querySelector('[data-v1215-query]');inp.value=b.dataset.v1215Example;ask(inp.value);
    }else if(b.hasAttribute('data-v1215-sync'))fetchNewest(true);
    else if(b.hasAttribute('data-v1215-audit-now')){
      const a=renderAudit();message('Revisión completa: '+a.duplicates.length+' duplicados posibles y '+a.venues.length+' canchas por confirmar.');
    }else if(b.hasAttribute('data-v1215-csv'))downloadCsv();
  });
  panel.querySelector('[data-v1215-auto]')?.addEventListener('change',e=>{
    safeSet(PREF,e.target.checked?'1':'0');
    message(e.target.checked?'Revisión automática habilitada mientras Historial esté abierto.':'Revisión automática desactivada.');
    manageRefresh();
  });
}
function mount(){
  mountPending=false;if(route()!=='historyLog')return;
  const root=document.querySelector('[data-v164-history-log]');
  if(!root||root.querySelector('.v1215-panel'))return;
  const host=root.querySelector('.v164-history-controls')||root.querySelector('.v164-history-switch');
  if(!host)return;
  const holder=document.createElement('div');holder.innerHTML=panelMarkup();
  const panel=holder.firstElementChild;host.after(panel);bind(panel);
  if(getDb())renderAudit();
  if(lastMessage)message(lastMessage);
  manageRefresh();
}
function scheduleMount(){
  if(mountPending)return;mountPending=true;
  requestAnimationFrame(mount);
}
window.addEventListener('hashchange',()=>{manageRefresh();scheduleMount()});
window.addEventListener('ljr:official-data',()=>{lastSnapshotData=null;lastAudit=null;scheduleMount()});
document.addEventListener('visibilitychange',()=>{manageRefresh();if(!document.hidden)scheduleMount()});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='historyLog')scheduleMount()}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});
else scheduleMount();
})();
