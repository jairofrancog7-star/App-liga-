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
const MODEL='Xenova/paraphrase-multilingual-MiniLM-L12-v2';
const PHRASES=[
  ['recent','Muéstrame los últimos partidos y resultados recientes'],
  ['goals','Encuentra los partidos con más goles y marcadores más altos'],
  ['margin','Busca las mayores goleadas por diferencia de goles'],
  ['draws','Consulta cuántos partidos terminaron empatados'],
  ['wins','Cuántos encuentros ha ganado este equipo'],
  ['summary','Resume el historial de partidos y goles por equipo'],
  ['audit','Revisa registros duplicados, canchas pendientes y datos incompletos']
];
let model=null,modelPromise=null,mountPending=false,refreshing=false,lastCheck=0;
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
  return out.sort((a,b)=>b.stamp-a.stamp);
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
  const p=document.querySelector('[data-v1215-status]');
  if(p)p.textContent=String(text||'');
}
function analysisText(textValue){
  const out=document.querySelector('[data-v1215-answer]');
  if(out){out.hidden=false;out.textContent=textValue;}
}
function renderAudit(){
  const list=entries(),info=inspect(list,true);
  const box=document.querySelector('[data-v1215-audit]');
  if(box){
    box.hidden=false;
    box.innerHTML=
      '<strong>Revisión del archivo</strong>'+
      '<div class="v1215-audit-stats">'+
        '<span><b>'+list.length+'</b> partidos</span>'+
        '<span><b>'+info.fresh.length+'</b> nuevos</span>'+
        '<span><b>'+info.changed.length+'</b> marcadores modificados</span>'+
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
  return '';
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
function noteModel(textValue){
  const el=document.querySelector('[data-v1215-ml-state]');
  if(el)el.textContent=textValue;
}
async function activateModel(){
  if(model){noteModel('Modelo semántico activo en este dispositivo.');return}
  if(modelPromise)return modelPromise;
  if(!navigator.onLine){noteModel('Conéctate a Wi-Fi para descargar el modelo primero.');return}
  if(!window.confirm('El modelo multilingüe necesita descargar aproximadamente 120 MB o más (además de sus recursos). ¿Deseas activarlo ahora? Recomendado con Wi-Fi.'))return;
  const button=document.querySelector('[data-v1215-model]');
  if(button)button.disabled=true;
  noteModel('Descargando el modelo y preparando la IA en tu navegador…');
  modelPromise=(async()=>{
    const module=await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
    const extractor=await module.pipeline('feature-extraction',MODEL,{device:'wasm',dtype:'q8'});
    const examples=await extractor(PHRASES.map(p=>p[1]),{pooling:'mean',normalize:true});
    const vectors=examples.tolist();
    model={extractor,vectors};noteModel('IA semántica activada. El análisis se realiza localmente.');
  })();
  try{await modelPromise}catch(err){model=null;noteModel('No se pudo cargar el modelo en este dispositivo. Continúa disponible el asistente local sin descarga.');}
  finally{modelPromise=null;if(button)button.disabled=false;}
}
async function modelIntent(q){
  if(!model)return '';
  try{
    const output=await model.extractor(q,{pooling:'mean',normalize:true});
    const vector=output.tolist()[0];
    const cosine=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
    const scored=model.vectors.map((v,i)=>({type:PHRASES[i][0],score:cosine(v,vector)})).sort((a,b)=>b.score-a.score);
    return scored[0]?.score>0.35?scored[0].type:'';
  }catch(_){return ''}
}
async function ask(prompt){
  const q=String(prompt||'').trim();if(!q){message('Escribe una consulta para buscar en el historial.');return}
  message('Analizando los resultados oficiales de este dispositivo…');
  const intent=(await modelIntent(q))||intentOf(q);
  analysisText(summarize(q,intent));
  message(model?'Respuesta mediante IA semántica local y datos oficiales.':'Consulta inteligente local, sin enviar preguntas a servidores.');
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
async function fetchNewest(){
  if(refreshing||!navigator.onLine||route()!=='historyLog'||document.hidden)return;
  refreshing=true;lastCheck=Date.now();
  message('Consultando si existe una actualización oficial…');
  try{
    const results=await Promise.allSettled([LOCAL+'?historial='+lastCheck,REMOTE+'?historial='+lastCheck].map(u=>fetch(u,{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error(String(r.status));return r.json()})));
    const choices=results.filter(x=>x.status==='fulfilled'&&x.value?.categories).map(x=>x.value);
    if(!choices.length){message('No se pudo revisar la fuente oficial. Se conservan los datos disponibles.');return}
    const current=getDb(),currentAt=Date.parse(current?.captured_at_utc||0)||0;
    choices.sort((a,b)=>(Date.parse(b.captured_at_utc||0)||0)-(Date.parse(a.captured_at_utc||0)||0));
    const latest=choices[0],nextAt=Date.parse(latest.captured_at_utc||0)||0;
    if(!current||nextAt>currentAt){
      const changes=inspect(entries(latest),false);
      window.LJR_OFFICIAL_DATA=latest;
      window.dispatchEvent(new Event('ljr:official-data'));
      message('Datos oficiales actualizados: '+changes.fresh.length+' partidos nuevos y '+changes.changed.length+' marcadores cambiados.');
      scheduleMount();
    }else{message('Revisión completada: ya tienes la versión oficial disponible.');}
    renderAudit();
  }catch(_){message('No se pudo completar la revisión automática; los marcadores no fueron modificados.');}
  finally{refreshing=false}
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
     '<p>Revisa cambios de los datos oficiales al abrir esta sección y cada 5 minutos mientras está abierta.</p>'+
     '<div class="v1215-action-row"><button type="button" data-v1215-sync>Actualizar ahora</button><button type="button" data-v1215-audit-now>Revisar archivo</button><button type="button" data-v1215-csv>Descargar CSV</button></div>'+
     '<div class="v1215-audit" data-v1215-audit hidden></div>'+
   '</div>'+
   '<details class="v1215-ai-details"><summary>IA semántica real en el celular (opcional)</summary><p>Modelo multilingüe de Transformers.js: se descarga una vez (aprox. 120 MB o más) y después analiza preguntas en el navegador usando CPU. No sube tus consultas ni el historial a un servicio de IA; necesita internet para descargar sus archivos.</p><button type="button" data-v1215-model>Descargar y activar IA local</button><small data-v1215-ml-state>Desactivada para ahorrar datos móviles y memoria.</small></details>'+
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
    }else if(b.hasAttribute('data-v1215-sync'))fetchNewest();
    else if(b.hasAttribute('data-v1215-audit-now')){
      const a=renderAudit();message('Revisión completa: '+a.duplicates.length+' duplicados posibles y '+a.venues.length+' canchas por confirmar.');
    }else if(b.hasAttribute('data-v1215-csv'))downloadCsv();
    else if(b.hasAttribute('data-v1215-model'))activateModel();
  });
  panel.querySelector('[data-v1215-auto]')?.addEventListener('change',e=>{
    safeSet(PREF,e.target.checked?'1':'0');
    message(e.target.checked?'Revisión automática habilitada mientras Historial esté abierto.':'Revisión automática desactivada.');
    if(e.target.checked)fetchNewest();
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
  if(safeGet(PREF,'1')==='1'&&Date.now()-lastCheck>300000)fetchNewest();
}
function scheduleMount(){
  if(mountPending)return;mountPending=true;
  requestAnimationFrame(mount);
}
window.addEventListener('hashchange',scheduleMount);
window.addEventListener('ljr:official-data',scheduleMount);
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&route()==='historyLog'){
    scheduleMount();
    if(safeGet(PREF,'1')==='1'&&Date.now()-lastCheck>300000)fetchNewest();
  }
});
window.setInterval(()=>{
  if(route()==='historyLog'&&!document.hidden&&safeGet(PREF,'1')==='1'&&Date.now()-lastCheck>300000)fetchNewest();
},60000);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(scheduleMount).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});
else scheduleMount();
})();