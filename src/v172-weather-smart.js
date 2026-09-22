/* V172 — Clima inteligente por partido/campo.
   Port funcional del motor V38 FIX23 de Liga_Futbol a la app azul.
   Mantiene separados: pronóstico meteorológico, estado físico del terreno
   y decisión oficial de la Liga. */
(function(){
'use strict';
if(window.__LJR_V172_WEATHER_SMART__)return;
window.__LJR_V172_WEATHER_SMART__=true;

const BUILD='20260922-weather-field-select-v174';
const TZ='America/Mexico_City';
const CACHE_TTL=20*60*1000;
const ALERT_KEY='v172-weather-alerts';
const CAT_KEY='v172-weather-category';
const MATCH_KEY='v172-weather-match';
const FIELD_KEY='v172-weather-field';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;

let hub=null,cfg=null,fixtures=[],mode='match',selectedCategory='',selectedMatch='',selectedField='',lastAnalysis=null;
let refreshTimer=0,lastAlertCheck=0,loadingPromise=null;
const wxCache=new Map();

function toast(text,type='ok'){
  let t=$('#v172WeatherToast');
  if(!t){t=document.createElement('div');t.id='v172WeatherToast';document.body.appendChild(t)}
  t.textContent=text;t.className='show '+type;clearTimeout(t._timer);
  t._timer=setTimeout(()=>t.className='',2500);
}

/* ---- Motor inteligente: mismo criterio explicable de V38 FIX23 ---- */
function terrainEstimate(p24,p48){
  const a=num(p24?.precipTotal),b=num(p48?.precipTotal);
  if(a>=18||b>=30)return {level:'very-wet',label:'Muy saturado probable',detail:'La lluvia acumulada de las 24–48 h previas puede dejar zonas pesadas o encharcadas.'};
  if(a>=10||b>=18)return {level:'wet',label:'Pesado/húmedo probable',detail:'Hay acumulado suficiente para que el drenaje y la revisión física del campo sean importantes.'};
  if(a>=4||b>=8)return {level:'damp',label:'Humedad moderada probable',detail:'Hubo o se prevé lluvia previa; conviene revisar zonas blandas antes de autorizar.'};
  return {level:'dry',label:'Bajo impacto de lluvia previa',detail:'El acumulado de las 24–48 h previas es bajo según la referencia meteorológica.'};
}
function verdictFor(probability){
  const p=clamp(Math.round(num(probability)),0,100);
  if(p>=80)return {key:'yes',label:'ALTA PROBABILIDAD DE JUGAR',short:'SÍ · MUY PROBABLE',tone:'good'};
  if(p>=65)return {key:'likely',label:'PROBABLEMENTE SE JUEGA',short:'SÍ · PROBABLE',tone:'good'};
  if(p>=45)return {key:'review',label:'REVISAR CAMPO · POR CONFIRMAR',short:'REVISAR',tone:'watch'};
  return {key:'risk',label:'ALTO RIESGO DE NO JUGAR',short:'NO · ALTO RIESGO',tone:'high'};
}
function confidenceFor(precision,hours){
  let c=92,p=String(precision||'regional');
  if(p==='exact'||p==='admin-pin')c=96;
  else if(p==='complex'||p==='near-field')c=88;
  else if(p==='locality')c=78;
  else if(p==='regional')c=64;
  else if(p==='pending')c=55;
  if(num(hours?.hours)<3)c-=15;
  return clamp(Math.round(c),35,98);
}
function scorePlayability(input){
  const m=input?.match||null,p24=input?.prior24||{},p48=input?.prior48||{},precision=input?.precision||'regional';
  if(!m)return {probability:null,confidence:confidenceFor(precision,p48),verdict:{key:'na',label:'SIN DATOS SUFICIENTES',short:'SIN DATOS',tone:'na'},terrain:terrainEstimate(p24,p48),reasons:['No hay datos meteorológicos suficientes para el horario seleccionado.']};
  let score=96;const reasons=[];
  const code=num(m.code),gust=num(m.gustMax),rainMax=num(m.rainMax),precipMax=num(m.precipMax),prob=num(m.probMax),p24sum=num(p24.precipTotal),p48sum=num(p48.precipTotal);
  if(code>=95){score-=42;reasons.push('Tormenta eléctrica prevista cerca del horario.')}else if(code>=80){score-=10;reasons.push('Tiempo inestable cerca del horario.')}
  if(rainMax>=8){score-=35;reasons.push('Lluvia horaria fuerte prevista durante la ventana del partido.')}else if(rainMax>=2.5){score-=25;reasons.push('Lluvia moderada prevista durante la ventana del partido.')}else if(rainMax>=1){score-=13;reasons.push('Lluvia ligera prevista durante la ventana del partido.')}
  if(prob>=85){score-=16;reasons.push('Probabilidad de precipitación muy alta a la hora del partido.')}else if(prob>=65){score-=10;reasons.push('Probabilidad de precipitación elevada a la hora del partido.')}else if(prob>=45){score-=5;reasons.push('Existe posibilidad de precipitación a la hora del partido.')}
  if(gust>=70){score-=24;reasons.push('Rachas de viento fuertes.')}else if(gust>=50){score-=10;reasons.push('Rachas de viento a vigilar.')}
  if(p48sum>=30){score-=31;reasons.push('Acumulado muy alto en las 48 h previas: posible saturación del terreno.')}else if(p48sum>=18){score-=23;reasons.push('Acumulado alto en las 48 h previas.')}else if(p48sum>=8){score-=13;reasons.push('Lluvia relevante en las 48 h previas.')}else if(p48sum>=3){score-=6;reasons.push('Algo de lluvia en las 48 h previas.')}
  if(p24sum>=18){score-=18;reasons.push('Mucha lluvia en las 24 h inmediatamente previas.')}else if(p24sum>=10){score-=12;reasons.push('Lluvia importante en las 24 h previas.')}else if(p24sum>=4){score-=6;reasons.push('Lluvia moderada en las 24 h previas.')}
  if(precipMax>=5&&rainMax<2.5){score-=6;reasons.push('Precipitación total relevante cerca del horario.')}
  score=clamp(Math.round(score),5,98);
  if(!reasons.length)reasons.push('No se detectan señales meteorológicas fuertes ni acumulados importantes en las 48 h previas.');
  return {probability:score,confidence:confidenceFor(precision,p48),verdict:verdictFor(score),terrain:terrainEstimate(p24,p48),reasons};
}
function signature(r){return [r?.verdict?.key||'na',r?.probability??'na',r?.terrain?.level||'na'].join('|')}

/* ---- Datos / fechas ---- */
async function loadJson(url){
  const r=await fetch(url+(url.includes('?')?'&':'?')+'v='+encodeURIComponent(BUILD)+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});
  if(!r.ok)throw new Error('HTTP '+r.status);
  return r.json();
}
async function ensureData(){
  if(cfg&&fixtures.length)return;
  if(loadingPromise)return loadingPromise;
  loadingPromise=(async()=>{
    cfg=await loadJson('./public/data/fields-v38-22.json');
    let season=null;
    try{season=await loadJson('./public/data/temporada-actual-2026.json')}catch(_){}
    fixtures=season?buildSeasonFixtures(season):buildOfficialFixtures();
    if(!fixtures.length)fixtures=buildOfficialFixtures();
  })().finally(()=>loadingPromise=null);
  return loadingPromise;
}
function overrideField(field){
  if(!field)return null;
  try{
    const raw=JSON.parse(localStorage.getItem('jr54-field-pin:'+field.id)||'null');
    if(raw&&Number.isFinite(raw.latitude)&&Number.isFinite(raw.longitude)&&Math.abs(raw.latitude)<=90&&Math.abs(raw.longitude)<=180){
      return {...field,latitude:raw.latitude,longitude:raw.longitude,precision:'admin-pin',weatherEligible:true,sourceNote:'Pin confirmado localmente en este dispositivo.'};
    }
  }catch(_){}
  return field;
}
function mapField(value){
  const n=norm(value);
  if(!n||!cfg?.fields)return null;
  return cfg.fields.find(f=>[f.id,f.name,...(f.aliases||[])].some(a=>norm(a)===n))||
    cfg.fields.find(f=>[f.name,...(f.aliases||[])].some(a=>n.includes(norm(a))||norm(a).includes(n)))||null;
}
function precisionLabel(p){
  return ({exact:'Campo exacto',complex:'Complejo deportivo',locality:'Referencia de comunidad','near-field':'Referencia junto al campo','admin-pin':'Pin ajustado',pending:'Pin pendiente',regional:'Referencia regional'})[p]||p||'Referencia';
}
function weatherCoords(field){
  const f=overrideField(field);
  if(f&&Number.isFinite(f.latitude)&&Number.isFinite(f.longitude))return {latitude:f.latitude,longitude:f.longitude,precision:f.precision||'locality',label:f.name};
  const r=cfg?.regionalFallback||{latitude:20.64337,longitude:-100.99286,label:'Referencia regional Juventino Rosas'};
  return {latitude:r.latitude,longitude:r.longitude,precision:'regional',label:r.label};
}
function mapsTarget(field){
  const f=overrideField(field);if(!f)return '';
  const exact=(f.precision==='exact'||f.precision==='admin-pin')&&Number.isFinite(f.latitude)&&Number.isFinite(f.longitude);
  return exact?(f.latitude+','+f.longitude):(f.mapsQuery||f.address||f.name);
}
function mapsSearch(field){const t=mapsTarget(field);return t?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(t):'#'}
function mapsDirections(field){const t=mapsTarget(field);return t?'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(t):'#'}
function googleWeather(field){const f=overrideField(field);return 'https://www.google.com/search?q='+encodeURIComponent('clima '+(f?.community||f?.name||'Juventino Rosas')+' Guanajuato')}

function localToEpoch(local){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(local||'')))return null;
  const [ds,ts]=local.split('T'),[y,m,d]=ds.split('-').map(Number),[hh,mm]=ts.split(':').map(Number);
  const naive=Date.UTC(y,m-1,d,hh,mm,0);let cand=naive;
  for(let i=0;i<3;i++){
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(cand)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    const represented=Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute,+parts.second);cand+=naive-represented;
  }
  return cand;
}
function dateKey(at){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return p.year+'-'+p.month+'-'+p.day;
}
function weekday(at){return new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short'}).format(new Date(at))}
function nextLeagueDate(dayOfWeek,kickoff){
  const names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],target=names[dayOfWeek],now=Date.now();
  for(let d=0;d<=8;d++){
    const probe=now+d*86400000;if(weekday(probe)!==target)continue;
    const key=dateKey(probe),at=localToEpoch(key+'T'+kickoff);
    if(at&&at>now-30*60*1000)return {date:key,kind:'estimada',at};
  }
  return null;
}
function normalizedTime(category,time){
  if(!/^\d{1,2}:\d{2}$/.test(String(time||'')))return null;
  let [h,m]=String(time).split(':').map(Number);
  if(/^Veteranos/i.test(category)&&h>=1&&h<=7)h+=12;
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
}
function gamesForCategory(categoryName,cat){
  const phase=String(cat?.current_phase||''),out=[];let arr=[];
  if(cat?.knockout&&Array.isArray(cat.knockout[phase]))arr=cat.knockout[phase];
  if(!arr.length&&cat?.rounds){
    const m=phase.match(/\bJ(\d+)\b/i),key=m?'J'+m[1]:Object.keys(cat.rounds).slice(-1)[0];
    if(key&&Array.isArray(cat.rounds[key]))arr=cat.rounds[key];
  }
  for(const g of arr){
    if(!g?.home||!g?.away||!g?.time||!g?.field)continue;
    const time=normalizedTime(categoryName,g.time);if(!time)continue;
    const field=mapField(g.field),pattern=cfg?.playPatterns?.[categoryName]||{dayOfWeek:0,label:'Domingo'};
    let schedule=null;
    if(g.date&&/^\d{4}-\d{2}-\d{2}$/.test(g.date))schedule={date:g.date,kind:'confirmada',at:localToEpoch(g.date+'T'+time)};
    else schedule=nextLeagueDate(pattern.dayOfWeek,time);
    if(!schedule?.at)continue;
    out.push({id:norm([categoryName,phase,g.home,g.away,g.field,g.time].join('|')).replace(/[^a-z0-9]+/g,'-'),category:categoryName,phase,home:g.home,away:g.away,time,originalTime:g.time,fieldValue:g.field,field,pattern,schedule});
  }
  return out;
}
function buildSeasonFixtures(data){
  return Object.entries(data?.categories||{}).flatMap(([name,cat])=>gamesForCategory(name,cat)).sort((a,b)=>a.schedule.at-b.schedule.at||a.category.localeCompare(b.category));
}
function parseOfficialDate(raw){
  const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);if(!m)return null;
  return localToEpoch(m[3]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0')+'T'+String(m[4]).padStart(2,'0')+':'+m[5]);
}
function buildOfficialFixtures(){
  const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{},out=[];
  Object.entries(db.categories||{}).forEach(([id,cat])=>(cat.fixtures||[]).forEach(group=>(group.rows||[]).forEach(r=>{
    if(!r?.[2]||!r?.[6])return;const at=parseOfficialDate(r?.[8]);if(!at)return;
    const category=cat.name||('Categoría '+id),field=mapField(r?.[7]||'');
    out.push({id:'official-'+id+'-'+norm([r[1],r[2],r[6],r[8]].join('|')).replace(/[^a-z0-9]+/g,'-'),category,phase:'Jornada '+(r?.[1]||''),home:r[2],away:r[6],time:new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at)),fieldValue:r?.[7]||'Campo por confirmar',field,schedule:{date:dateKey(at),kind:'confirmada',at}});
  })));
  return out.sort((a,b)=>a.schedule.at-b.schedule.at);
}

/* ---- Open-Meteo ---- */
function forecastUrl(coords){
  const p=new URLSearchParams({latitude:String(coords.latitude),longitude:String(coords.longitude),hourly:'temperature_2m,precipitation_probability,precipitation,rain,weather_code,wind_gusts_10m',past_days:'2',forecast_days:'16',timezone:TZ,temperature_unit:'celsius',wind_speed_unit:'kmh',precipitation_unit:'mm'});
  return 'https://api.open-meteo.com/v1/forecast?'+p.toString();
}
async function getForecast(field,force=false){
  const coords=weatherCoords(field),key=coords.latitude+','+coords.longitude,old=wxCache.get(key);
  if(!force&&old&&Date.now()-old.at<CACHE_TTL)return {data:old.data,coords};
  if(!force){
    try{
      const stored=JSON.parse(sessionStorage.getItem('v172wx:'+key)||'null');
      if(stored&&Date.now()-stored.at<CACHE_TTL){wxCache.set(key,stored);return {data:stored.data,coords}}
    }catch(_){}
  }
  const r=await fetch(forecastUrl(coords),{cache:'no-store',credentials:'omit'});
  if(!r.ok)throw new Error('Open-Meteo HTTP '+r.status);
  const data=await r.json(),entry={at:Date.now(),data};wxCache.set(key,entry);
  try{sessionStorage.setItem('v172wx:'+key,JSON.stringify(entry))}catch(_){}
  return {data,coords};
}
function summarize(data,startAt,endAt){
  const h=data?.hourly;if(!h||!Array.isArray(h.time))return null;const indexes=[];
  for(let i=0;i<h.time.length;i++){const at=localToEpoch(String(h.time[i]).slice(0,16));if(at&&at>=startAt&&at<=endAt)indexes.push({i,at})}
  if(!indexes.length)return null;
  const vals=key=>indexes.map(x=>Number(h[key]?.[x.i])).filter(Number.isFinite),sum=a=>a.length?a.reduce((s,x)=>s+x,0):0,max=a=>a.length?Math.max(...a):null,avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null,now=Date.now();
  return {hours:indexes.length,observedHours:indexes.filter(x=>x.at<=now).length,forecastHours:indexes.filter(x=>x.at>now).length,precipTotal:sum(vals('precipitation')),rainTotal:sum(vals('rain')),rainMax:max(vals('rain')),precipMax:max(vals('precipitation')),probMax:max(vals('precipitation_probability')),gustMax:max(vals('wind_gusts_10m')),code:max(vals('weather_code')),temp:avg(vals('temperature_2m'))};
}
function sourceLabel(s){if(!s)return 'sin datos';if(s.observedHours&&s.forecastHours)return 'mezcla de horas pasadas + pronóstico';if(s.observedHours)return 'horas pasadas/modeladas';return 'pronóstico previo al partido'}

/* ---- UI ---- */
function availableCategories(){return [...new Set(fixtures.map(x=>x.category))]}
function matchesForCategory(cat){return fixtures.filter(x=>x.category===cat)}
function currentMatch(){return fixtures.find(x=>x.id===selectedMatch)||null}
function validFieldId(value){
  const fields=cfg?.fields||[];
  const id=String(value||'');
  return fields.some(f=>String(f.id)===id)?id:(fields[0]?.id||'');
}
function syncFieldFromControl(){
  const sel=$('[data-v172-field-select]',hub);
  if(sel&&sel.value)selectedField=validFieldId(sel.value);
  else selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
  if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  return selectedField;
}
function currentField(){
  if(mode!=='field')return currentMatch()?.field||null;
  selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
  if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  return (cfg?.fields||[]).find(f=>String(f.id)===String(selectedField))||null;
}
function option(value,label,selected){return '<option value="'+esc(value)+'" '+(selected?'selected':'')+'>'+esc(label)+'</option>'}
function fmtDate(match){
  if(!match?.schedule?.at)return 'Fecha pendiente';
  return new Intl.DateTimeFormat('es-MX',{timeZone:TZ,weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(match.schedule.at));
}
function fmtUpdated(){return new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date())}
function metric(label,value,sub=''){return '<div class="v172-metric"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>'}
function loadingMarkup(text='Consultando clima…'){return '<div class="v172-loading"><span></span>'+esc(text)+'</div>'}
function emptyMarkup(text){return '<div class="v172-empty">'+esc(text)+'</div>'}

function controlsMarkup(){
  if(mode==='field'){
    const fields=cfg?.fields||[];
    selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
    if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
    return '<label class="v172-control grow"><span>Campo</span><select data-v172-field-select>' +
      fields.map(f=>option(f.id,f.name,String(f.id)===String(selectedField))).join('')+
      '</select></label>'+
      '<button type="button" class="primary" data-v172-action="analyze">Analizar campo</button>'+
      '<button type="button" data-v172-action="match-mode">← Volver a partido</button>';
  }
  const cats=availableCategories();
  if(!selectedCategory||!cats.includes(selectedCategory))selectedCategory=localStorage.getItem(CAT_KEY)&&cats.includes(localStorage.getItem(CAT_KEY))?localStorage.getItem(CAT_KEY):(cats.includes('Veteranos 50+')?'Veteranos 50+':cats[0]||'');
  const ms=matchesForCategory(selectedCategory);
  const saved=localStorage.getItem(MATCH_KEY)||'';
  if(!selectedMatch||!ms.some(x=>x.id===selectedMatch))selectedMatch=ms.some(x=>x.id===saved)?saved:(ms[0]?.id||'');
  return '<label class="v172-control"><span>Categoría</span><select data-v172-category>'+cats.map(c=>option(c,c,c===selectedCategory)).join('')+'</select></label>'+
    '<label class="v172-control grow"><span>Partido</span><select data-v172-match>'+ms.map(m=>option(m.id,m.home+' vs '+m.away+' · '+m.time+' · '+(m.field?.name||m.fieldValue),m.id===selectedMatch)).join('')+'</select></label>'+
    '<button type="button" class="primary" data-v172-action="analyze">Analizar</button>'+
    '<button type="button" data-v172-action="field-mode">Buscar campo</button>';
}
function renderControls(){const x=$('.v172-controls',hub);if(x)x.innerHTML=controlsMarkup()}

function resultMarkup(ctx){
  const {match,field,coords,windowWx,p24,p48,result,analysisAt}=ctx,p=result.probability,verdict=result.verdict,precision=coords?.precision||field?.precision||'regional';
  const title=match?(match.home+' vs '+match.away):(field?.name||'Campo');
  const kicker=match?(match.category+' · '+match.phase):'CONSULTA DIRECTA DE CAMPO';
  const when=match?(fmtDate(match)+(match.schedule?.kind==='estimada'?' · fecha estimada':'')):'Condición meteorológica alrededor de '+new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(analysisAt));
  const r24=p24?(p24.precipTotal.toFixed(1)+' mm'):'—',r48=p48?(p48.precipTotal.toFixed(1)+' mm'):'—',wxProb=windowWx?.probMax==null?'—':Math.round(windowWx.probMax)+'%',wxRain=windowWx?.rainMax==null?'—':windowWx.rainMax.toFixed(1)+' mm/h',temp=windowWx?.temp==null?'—':windowWx.temp.toFixed(1)+' °C',gust=windowWx?.gustMax==null?'—':Math.round(windowWx.gustMax)+' km/h';
  return '<article class="v172-result '+esc(verdict.tone)+'">'+
    '<div class="v172-result-head"><div><div class="v172-kicker">'+esc(kicker)+'</div><h3>'+esc(title)+'</h3><p>'+esc(when)+'</p><p><b>'+esc(field?.name||match?.fieldValue||'Campo pendiente')+'</b> · <span class="v172-pill">'+esc(precisionLabel(precision))+'</span></p></div>'+
      '<div class="v172-score '+esc(verdict.tone)+'"><span>Probabilidad orientativa</span><strong>'+(p==null?'—':esc(p+'%'))+'</strong><b>'+esc(verdict.short)+'</b><small>confianza '+esc(result.confidence)+'%</small></div></div>'+
    '<div class="v172-verdict '+esc(verdict.tone)+'"><span>ASISTENTE INTELIGENTE</span><strong>'+esc(verdict.label)+'</strong><p>'+esc(result.terrain.label)+'. '+esc(result.terrain.detail)+'</p></div>'+
    '<div class="v172-metrics">'+metric('Lluvia 24 h previas',r24,sourceLabel(p24))+metric('Lluvia 48 h previas',r48,sourceLabel(p48))+metric('Prob. a la hora',wxProb,'ventana -1 h / +2 h')+metric('Lluvia a la hora',wxRain,'máximo horario')+metric('Temperatura',temp)+metric('Racha máxima',gust)+'</div>'+
    '<details class="v172-why"><summary>¿Por qué da esta probabilidad?</summary><ul>'+result.reasons.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul><p>El motor combina lluvia de las 24/48 h previas, lluvia/tormenta/viento cerca del horario y precisión del pin. Es una estimación automática explicable, no una inspección física.</p></details>'+
    '<div class="v172-actions"><a href="'+esc(mapsSearch(field))+'" target="_blank" rel="noopener">📍 Mapa</a><a href="'+esc(mapsDirections(field))+'" target="_blank" rel="noopener">🧭 Cómo llegar</a><a href="'+esc(googleWeather(field))+'" target="_blank" rel="noopener">☁️ Google clima</a><button type="button" data-v172-action="pin" data-field="'+esc(field?.id||'')+'">Ajustar pin</button><button type="button" data-v172-action="share">Compartir aviso</button><button type="button" data-v172-action="copy">Copiar aviso</button></div>'+
    '<div class="v172-official"><b>Automático ≠ oficial.</b> “SÍ/NO probable” es una recomendación meteorológica. El estado oficial Programado / Por confirmar / Retrasado / Suspendido sigue siendo decisión de la Liga tras revisar el terreno.</div>'+
  '</article>';
}
async function analyzeSelection(force=false){
  const panel=$('.v172-panel',hub);if(!panel)return null;
  if(!cfg){
    try{await ensureData();renderControls()}catch(err){panel.innerHTML=emptyMarkup('No se pudo cargar la lista de campos.');return null}
  }
  if(mode==='field')syncFieldFromControl();
  const match=mode==='match'?currentMatch():null,field=currentField();
  if(!field){panel.innerHTML=emptyMarkup(mode==='match'?'El partido seleccionado no tiene un campo reconocido. Usa “Buscar campo” para revisar una cancha.':'Selecciona un campo.');return null}
  panel.innerHTML=loadingMarkup('Consultando el campo seleccionado…');hub.setAttribute('aria-busy','true');
  try{
    const wx=await getForecast(field,force),analysisAt=match?.schedule?.at||Date.now(),windowWx=summarize(wx.data,analysisAt-60*60*1000,analysisAt+2*60*60*1000),p24=summarize(wx.data,analysisAt-24*60*60*1000,analysisAt-1),p48=summarize(wx.data,analysisAt-48*60*60*1000,analysisAt-1),result=scorePlayability({match:windowWx,prior24:p24,prior48:p48,precision:wx.coords.precision});
    lastAnalysis={match,field,coords:wx.coords,windowWx,p24,p48,result,analysisAt};panel.innerHTML=resultMarkup(lastAnalysis);
    const u=$('.v172-updated',hub);if(u)u.textContent='Actualizado '+fmtUpdated();
    return lastAnalysis;
  }catch(err){
    panel.innerHTML='<div class="v172-empty error"><b>No se pudo actualizar el clima.</b><span>'+esc(err?.message||err)+'</span><button type="button" data-v172-action="analyze">Reintentar</button></div>';return null;
  }finally{hub.removeAttribute('aria-busy')}
}
function alertText(ctx){
  if(!ctx?.result)return '';const m=ctx.match,r=ctx.result,subject=m?(m.home+' vs '+m.away):(ctx.field?.name||'Campo');
  return ['Liga Juventino Rosas · '+subject,'Estimación automática: '+r.verdict.label+' ('+(r.probability??'—')+'%).','Terreno meteorológico: '+r.terrain.label+'.',m?(fmtDate(m)+' · '+(ctx.field?.name||m.fieldValue)):(ctx.field?.name||''),'La decisión oficial corresponde a la Liga tras revisar el campo.'].filter(Boolean).join('\n');
}
async function shareCurrent(copyOnly=false){
  if(!lastAnalysis)return toast('Primero analiza un partido o campo','error');const text=alertText(lastAnalysis);
  if(!copyOnly&&navigator.share){try{await navigator.share({title:'Clima de partido · Liga Juventino Rosas',text});return}catch(_){}}
  try{await navigator.clipboard.writeText(text);toast('Aviso copiado')}catch(_){prompt('Copia el aviso:',text)}
}
async function adjustPin(fieldId){
  const field=(cfg?.fields||[]).find(f=>f.id===fieldId);if(!field)return;
  const cur=overrideField(field),lat=prompt('Latitud exacta para '+field.name+':',Number.isFinite(cur.latitude)?String(cur.latitude):'');if(lat===null)return;
  const lon=prompt('Longitud exacta para '+field.name+':',Number.isFinite(cur.longitude)?String(cur.longitude):'');if(lon===null)return;
  const a=Number(lat),b=Number(lon);if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>90||Math.abs(b)>180)return toast('Coordenadas inválidas','error');
  localStorage.setItem('jr54-field-pin:'+field.id,JSON.stringify({latitude:a,longitude:b,updatedAt:Date.now()}));wxCache.clear();toast('Pin guardado en este dispositivo');await analyzeSelection(true);
}

/* ---- Avisos automáticos ---- */
function alertsEnabled(){return localStorage.getItem(ALERT_KEY)==='1'}
function updateAlertButton(){
  const b=$('[data-v172-action="alerts"]',hub);if(!b)return;const enabled=alertsEnabled(),granted=('Notification'in window)&&Notification.permission==='granted';
  b.classList.toggle('active',enabled);b.textContent=enabled?(granted?'🔔 Avisos activos':'🔔 Avisos dentro de la página'):'🔕 Activar avisos';
}
async function toggleAlerts(){
  if(alertsEnabled()){localStorage.setItem(ALERT_KEY,'0');updateAlertButton();toast('Avisos automáticos desactivados');return}
  localStorage.setItem(ALERT_KEY,'1');if('Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission()}catch(_){}}
  updateAlertButton();toast(('Notification'in window&&Notification.permission==='granted')?'Avisos automáticos activados':'Avisos automáticos activos dentro de la página');await checkCategoryAlerts(true);
}
async function analyzeMatchQuiet(match){
  if(!match?.field||!match.schedule?.at)return null;
  try{const wx=await getForecast(match.field,false),at=match.schedule.at,windowWx=summarize(wx.data,at-60*60*1000,at+2*60*60*1000),p24=summarize(wx.data,at-24*60*60*1000,at-1),p48=summarize(wx.data,at-48*60*60*1000,at-1),result=scorePlayability({match:windowWx,prior24:p24,prior48:p48,precision:wx.coords.precision});return {match,field:match.field,coords:wx.coords,windowWx,p24,p48,result,analysisAt:at}}catch(_){return null}
}
async function checkCategoryAlerts(force=false){
  if(!alertsEnabled()||mode!=='match'||!selectedCategory)return;if(!force&&Date.now()-lastAlertCheck<5*60*1000)return;lastAlertCheck=Date.now();
  const now=Date.now(),upcoming=matchesForCategory(selectedCategory).filter(m=>m.schedule?.at>=now-60*60*1000&&m.schedule?.at<=now+7*86400000).slice(0,4);let worst=null;
  for(const m of upcoming){
    const ctx=await analyzeMatchQuiet(m);if(!ctx)continue;if(!worst||num(ctx.result.probability)<num(worst.result.probability))worst=ctx;
    const sig=signature(ctx.result),key='v172-weather-alert-signature:'+m.id,prev=localStorage.getItem(key);if(prev===sig)continue;localStorage.setItem(key,sig);
    const title=m.category+' · '+ctx.result.verdict.short,body=m.home+' vs '+m.away+' · '+ctx.result.probability+'% · '+(ctx.field?.name||m.fieldValue);
    if('Notification'in window&&Notification.permission==='granted'){try{new Notification(title,{body,tag:'v172-'+m.id})}catch(_){}}
  }
  if(worst&&worst.result.verdict.tone==='high')toast('⚠ '+worst.match.home+' vs '+worst.match.away+': '+worst.result.verdict.short,'error');
}

/* ---- Estado / eventos ---- */
function setMode(next){
  mode=next==='field'?'field':'match';
  if(mode==='field'){
    selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
    if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  }
  renderControls();
  analyzeSelection(false);
}
async function openFields(){
  if(!hub)return;
  try{await ensureData()}catch(err){toast('No se pudo cargar la lista de campos','error');return}
  selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
  if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  setMode('field');
  hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  setTimeout(()=>$('[data-v172-field-select]',hub)?.focus(),220);
}
async function openMatches(){
  if(!hub)return;
  try{await ensureData()}catch(_){}
  setMode('match');
  hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
function bindHub(){
  const onSelect=e=>{
    if(e.target.matches('[data-v172-category]')){selectedCategory=e.target.value;localStorage.setItem(CAT_KEY,selectedCategory);selectedMatch=matchesForCategory(selectedCategory)[0]?.id||'';if(selectedMatch)localStorage.setItem(MATCH_KEY,selectedMatch);renderControls();analyzeSelection(false);checkCategoryAlerts(true)}
    else if(e.target.matches('[data-v172-match]')){selectedMatch=e.target.value;localStorage.setItem(MATCH_KEY,selectedMatch);analyzeSelection(false)}
    else if(e.target.matches('[data-v172-field-select]')){
      selectedField=validFieldId(e.target.value);
      if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
      analyzeSelection(false);
    }
  };
  hub.addEventListener('change',onSelect);
  hub.addEventListener('input',e=>{if(e.target.matches('[data-v172-field-select]'))onSelect(e)});
  hub.addEventListener('click',async e=>{
    const b=e.target.closest('[data-v172-action]');if(!b)return;const a=b.dataset.v172Action;
    if(a==='analyze'){
      if(mode==='field')syncFieldFromControl();
      await analyzeSelection(true);
    }else if(a==='field-mode')setMode('field');else if(a==='match-mode')setMode('match');else if(a==='alerts')await toggleAlerts();else if(a==='pin')await adjustPin(b.dataset.field);else if(a==='share')await shareCurrent(false);else if(a==='copy')await shareCurrent(true);
  });
}
function bindTopWeatherButtons(){
  const screen=$('#screen');if(!screen||screen.dataset.v172WeatherBound)return;screen.dataset.v172WeatherBound='1';
  screen.addEventListener('click',e=>{
    if(route()!=='v38Weather')return;const b=e.target.closest('[data-v163-weather-inline]');if(!b)return;e.preventDefault();e.stopPropagation();
    const m=b.dataset.v163WeatherInline;if(m==='fields')openFields();else openMatches();
  },true);
}
async function initData(){
  try{
    await ensureData();const cats=availableCategories(),savedCat=localStorage.getItem(CAT_KEY);
    selectedCategory=savedCat&&cats.includes(savedCat)?savedCat:(cats.includes('Veteranos 50+')?'Veteranos 50+':cats[0]||'');
    const ms=matchesForCategory(selectedCategory),savedMatch=localStorage.getItem(MATCH_KEY);
    selectedMatch=ms.some(x=>x.id===savedMatch)?savedMatch:(ms[0]?.id||'');
    selectedField=validFieldId(localStorage.getItem(FIELD_KEY));
    if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
    renderControls();await analyzeSelection(false);await checkCategoryAlerts(false);
  }catch(err){
    const p=$('.v172-panel',hub);if(p)p.innerHTML='<div class="v172-empty error"><b>No se pudo cargar clima/jornada.</b><span>'+esc(err?.message||err)+'</span><button type="button" data-v172-action="analyze">Reintentar</button></div>';
  }
}
function markup(){
  return '<section id="v172-weather-smart" class="v172-weather-smart" aria-label="Clima inteligente del partido">'+
    '<div class="v172-head"><div><div class="v172-kicker">CENTRAL OPERATIVA V38 · MOTOR INTELIGENTE</div><h2>Clima inteligente del partido</h2><p>Elige categoría y partido. Mostramos <b>un solo análisis</b>: clima del campo, lluvia de 24/48 h previas y probabilidad orientativa de que el terreno esté jugable.</p></div><button type="button" class="v172-alert" data-v172-action="alerts">🔕 Activar avisos</button></div>'+
    '<div class="v172-rule"><b>🔔 Avisos dentro de la página</b><span>Automático: el motor inteligente puede avisar “sí probable / revisar / alto riesgo de no jugar”. No cambia por sí solo el estado oficial a “Suspendido”.</span></div>'+
    '<div class="v172-controls"></div>'+
    '<div class="v172-status"><span class="v172-updated">Preparando análisis…</span><span>Open-Meteo · 2 días previos + hasta 16 días de pronóstico</span></div>'+
    '<div class="v172-panel" aria-live="polite">'+loadingMarkup('Cargando jornada…')+'</div>'+
  '</section>';
}
function mount(){
  if(route()!=='v38Weather')return;
  const screen=$('#screen');if(!screen)return;
  $('#v100-weather-extra',screen)?.remove();
  if($('#v172-weather-smart',screen)){bindTopWeatherButtons();return}
  const page=$('.v163-weather-page',screen)||screen.firstElementChild;
  if(page)page.insertAdjacentHTML('afterend',markup());else screen.insertAdjacentHTML('beforeend',markup());
  hub=$('#v172-weather-smart',screen);if(!hub)return;bindHub();bindTopWeatherButtons();updateAlertButton();initData();
  clearTimeout(refreshTimer);refreshTimer=setTimeout(async function loop(){if(route()==='v38Weather'&&document.visibilityState==='visible'){await analyzeSelection(false);await checkCategoryAlerts(false)}refreshTimer=setTimeout(loop,CACHE_TTL)},CACHE_TTL);
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(mount,90)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',()=>{if(route()==='v38Weather'&&!fixtures.length)schedule()});
document.addEventListener('visibilitychange',()=>{if(route()==='v38Weather'&&document.visibilityState==='visible'){analyzeSelection(false);checkCategoryAlerts(false)}});
window.addEventListener('focus',()=>{if(route()==='v38Weather')checkCategoryAlerts(false)});
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,700);

window.LJR_V172_WEATHER={openFields,openMatches,refresh:()=>analyzeSelection(true),get selectedCategory(){return selectedCategory},get selectedMatch(){return selectedMatch},get selectedField(){return selectedField},get mode(){return mode}};
})();