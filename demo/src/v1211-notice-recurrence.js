/* V1211 · Recurrencias locales + fechas en español.
   No concede permisos de publicación global; ninguna llamada de red. */
(function(){
'use strict';
if(window.__LJR_V1211_RECURRING__)return;
window.__LJR_V1211_RECURRING__=true;
const KEY='ljr-v713-auto-notices',PREF='ljr-v1211-recurrence';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const pad=n=>String(n).padStart(2,'0');
const ZONE='America/Mexico_City';
const MONTHS={enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,setiembre:9,octubre:10,noviembre:11,diciembre:12};
const DAYS={domingo:0,lunes:1,martes:2,miercoles:3,jueves:4,viernes:5,sabado:6};
function parts(ms){
  const arr=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ms));
  const p=Object.fromEntries(arr.map(x=>[x.type,x.value]));
  return {year:+p.year,month:+p.month,day:+p.day,hour:+p.hour,minute:+p.minute,second:+p.second};
}
function isoDay(y,m,d){
  const v=new Date(Date.UTC(y,m-1,d));
  return v.getUTCFullYear()===y&&v.getUTCMonth()+1===m&&v.getUTCDate()===d?y+'-'+pad(m)+'-'+pad(d):'';
}
function todayMx(now=Date.now()){const p=parts(+now);return isoDay(p.year,p.month,p.day)}
function toUtcDay(s){
  if(!/^\d{4}-\d\d-\d\d$/.test(s))return NaN;
  const [y,m,d]=s.split('-').map(Number);return isoDay(y,m,d)?Date.UTC(y,m-1,d):NaN;
}
function addDays(s,n){
  const ms=toUtcDay(s);if(!Number.isFinite(ms))return '';
  const d=new Date(ms+n*86400000);return isoDay(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate());
}
function wallMillis(date,time){
  if(!Number.isFinite(toUtcDay(date))||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return NaN;
  const [y,m,day]=date.split('-').map(Number),[h,min]=time.split(':').map(Number);
  const wanted=Date.UTC(y,m-1,day,h,min);let found=wanted;
  for(let i=0;i<4;i++){
    const p=parts(found);
    found+=wanted-Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
  }
  const check=parts(found);
  return check.year===y&&check.month===m&&check.day===day&&check.hour===h&&check.minute===min?found:NaN;
}
function repeatFromText(text){
  const t=norm(text);
  if(/\b(?:cada|todos? los?)\s*(?:2|dos)\s*semanas?\b|quincenal/.test(t))return 'biweekly';
  if(/lunes\s+a\s+viernes|entre semana|dias habiles/.test(t))return 'weekdays';
  if(/todos? los? dias|diari[oa]|cada dia/.test(t))return 'daily';
  if(/cada mes|mensual|todos? los? meses/.test(t))return 'monthly';
  if(/semanal|cada semana|todos? los? (domingo|lunes|martes|miercoles|jueves|viernes|sabado)\b|cada (domingo|lunes|martes|miercoles|jueves|viernes|sabado)\b/.test(t))return 'weekly';
  return '';
}
function spanish(text,now=Date.now()){
  const raw=norm(text),data={},base=todayMx(now);
  let m=raw.match(/\b(20\d{2})-(\d\d)-(\d\d)\b/);
  if(m){const date=isoDay(+m[1],+m[2],+m[3]);if(date)data.date=date}
  if(!data.date){
    m=raw.match(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+(?:de|del)\s+(\d{4}))?\b/);
    if(m){
      const p=parts(+now);let y=m[3]?+m[3]:p.year,day=+m[1],month=MONTHS[m[2]];
      let candidate=isoDay(y,month,day);
      if(!m[3]&&candidate&&candidate<base)candidate=isoDay(y+1,month,day);
      if(candidate)data.date=candidate;
    }
  }
  if(!data.date){
    m=raw.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
    if(m){const date=isoDay(+m[3],+m[2],+m[1]);if(date)data.date=date}
  }
  if(!data.date){
    if(/\bpasado manana\b/.test(raw))data.date=addDays(base,2);
    else if(/\bmanana\b/.test(raw))data.date=addDays(base,1);
    else if(/\bhoy\b/.test(raw))data.date=base;
    else if((m=raw.match(/\ben\s+(\d{1,2})\s+dias?\b/)))data.date=addDays(base,+m[1]);
    else if((m=raw.match(/\b(?:el\s+|este\s+|proximo\s+)?(domingo|lunes|martes|miercoles|jueves|viernes|sabado)\b/))){
      const ms=toUtcDay(base),diff=(DAYS[m[1]]-new Date(ms).getUTCDay()+7)%7;
      data.date=addDays(base,diff||(raw.includes('hoy ')?0:7));
    }
  }
  let tm=raw.match(/\b(?:a\s+las?\s+)?([01]?\d|2[0-3]):([0-5]\d)\s*(am|pm|a\.m\.|p\.m\.)?\b/);
  if(tm){
    let hour=+tm[1],minute=+tm[2],mer=(tm[3]||'').replace(/\./g,'');
    if(mer==='pm'&&hour<12)hour+=12;
    if(mer==='am'&&hour===12)hour=0;
    data.time=pad(hour)+':'+pad(minute);
  }else{
    tm=raw.match(/\b(?:a\s+las?\s+)?(1[0-2]|[1-9])\s*(am|pm|a\.m\.|p\.m\.|de la (?:tarde|manana|noche))\b/);
    if(tm){
      let h=+tm[1],mer=tm[2].replace(/\./g,'');
      if((mer==='pm'||mer==='de la tarde'||mer==='de la noche')&&h<12)h+=12;
      if((mer==='am'||mer==='de la manana')&&h===12)h=0;
      data.time=pad(h)+':00';
    }
  }
  const rep=repeatFromText(raw);if(rep)data.repeat=rep;
  return data;
}
function localPlan(opts){
  const {date,time,repeat,count}=opts;
  const n=Math.max(1,Math.min(20,Math.floor(Number(count)||1)));
  if(!Number.isFinite(wallMillis(date,time)))return [];
  if(repeat==='none')return [date];
  const output=[],start=toUtcDay(date),day=new Date(start).getUTCDay(),startMonth=new Date(start).getUTCMonth(),
    startYear=new Date(start).getUTCFullYear(),startDay=new Date(start).getUTCDate();
  for(let i=0;i<850&&output.length<n;i++){
    const raw=addDays(date,i);const d=new Date(toUtcDay(raw)),dow=d.getUTCDay(),delta=Math.floor(i/7);
    let ok=false;
    if(repeat==='daily')ok=true;
    else if(repeat==='weekdays')ok=dow>=1&&dow<=5;
    else if(repeat==='weekly')ok=dow===day;
    else if(repeat==='biweekly')ok=dow===day&&delta%2===0;
    else if(repeat==='monthly')ok=d.getUTCDate()===startDay&&
      (d.getUTCFullYear()-startYear)*12+d.getUTCMonth()-startMonth>=0;
    if(ok)output.push(raw);
  }
  return output;
}
function planned(opts){
  const safeCount=Math.max(1,Math.min(20,Math.floor(Number(opts.count)||1)));
  const engine=window.LJR_NOTICE_DATE_LIBS;
  if(engine?.plan){
    try{
      const result=engine.plan({...opts,count:safeCount});
      if(Array.isArray(result?.dates)&&result.dates.length===safeCount&&result.dates.every(s=>Number.isFinite(wallMillis(s,opts.time))))return result;
    }catch(_){}
  }
  const dates=localPlan({...opts,count:safeCount});
  return {dates,rrule:ruleString(opts,safeCount),engine:'local'};
}
function ruleString(opts,count){
  const map={daily:'DAILY',weekdays:'WEEKLY',weekly:'WEEKLY',biweekly:'WEEKLY',monthly:'MONTHLY'};
  if(!map[opts.repeat])return '';
  const start=toUtcDay(opts.date),weekday=['SU','MO','TU','WE','TH','FR','SA'][new Date(start).getUTCDay()];
  return 'RRULE:FREQ='+map[opts.repeat]+';INTERVAL='+(opts.repeat==='biweekly'?2:1)+
    (opts.repeat==='weekdays'?';BYDAY=MO,TU,WE,TH,FR':opts.repeat==='weekly'||opts.repeat==='biweekly'?';BYDAY='+weekday:'')+';COUNT='+count;
}
function readItems(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return []}}
async function authorized(){try{return !!window.LJR_MEDIA?.admin&&!!(await window.LJR_MEDIA.api('me'))?.admin}catch(_){return false}}
function setNotice(root,text){const target=$('[data-v1211-status]',root);if(target)target.textContent=text}
function repeatSettings(){try{const v=JSON.parse(localStorage.getItem(PREF)||'{}');return v&&typeof v==='object'?v:{}}catch(_){return {}}}
function saveSettings(root){try{localStorage.setItem(PREF,JSON.stringify({repeat:$('[data-v1211-repeat]',root).value,count:$('[data-v1211-count]',root).value}))}catch(_){}}
function state(root){return {date:$('[data-v713-date]',root)?.value||'',time:$('[data-v713-time]',root)?.value||'',
 repeat:$('[data-v1211-repeat]',root)?.value||'none',count:Number($('[data-v1211-count]',root)?.value||1)}}
function display(root){
  const s=state(root),info=planned(s),p=$('[data-v1211-preview]',root);
  p.replaceChildren();
  if(!info.dates.length){p.textContent='Selecciona una fecha y hora válidas.';return}
  info.dates.slice(0,6).forEach((day,i)=>{
    const d=wallMillis(day,s.time),e=document.createElement('li');
    e.textContent=(i+1)+'. '+new Date(d).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short',timeZone:ZONE});
    p.append(e);
  });
  if(info.dates.length>6){const e=document.createElement('li');e.textContent='… y '+(info.dates.length-6)+' fechas más.';p.append(e)}
  $('[data-v1211-engine]',root).textContent=window.LJR_NOTICE_DATE_LIBS?.plan?'RRule local':'Regla local compatible con RRule';
}
function attach(root){
  if(root.dataset.v1211Ready)return;
  root.dataset.v1211Ready='1';
  const schedule=$('.v729-schedule-card',root);
  if(!schedule)return;
  schedule.insertAdjacentHTML('afterend',
   '<section class="v1211-recurrence" data-v1211-card>'+
     '<div class="v1211-heading"><span>04</span><div><small>PROGRAMACIÓN AVANZADA</small><strong>Fechas inteligentes y avisos recurrentes</strong></div></div>'+
     '<p>Escribe «próximo sábado a las 11:30» o «cada dos semanas». Revisa las fechas antes de programar.</p>'+
     '<button type="button" data-v1211-parse>Detectar fechas del mensaje</button>'+
     '<div class="v1211-grid"><label>Repetir<select data-v1211-repeat>'+
       '<option value="none">Una sola vez</option><option value="daily">Cada día</option>'+
       '<option value="weekdays">Lunes a viernes</option><option value="weekly">Cada semana</option>'+
       '<option value="biweekly">Cada 2 semanas</option><option value="monthly">Cada mes</option>'+
     '</select></label><label>Número de avisos<input type="number" data-v1211-count value="4" min="2" max="20" inputmode="numeric"></label></div>'+
     '<div class="v1211-forecast"><strong>PRÓXIMAS FECHAS · HORA JUVENTINO ROSAS</strong><ol data-v1211-preview></ol></div>'+
     '<small data-v1211-engine></small><p class="v1211-disclaimer">Solo programa avisos de este dispositivo. Para entregas globales con el teléfono cerrado se requiere el servicio oficial autenticado.</p>'+
     '<p class="v1211-status" data-v1211-status role="status" aria-live="polite"></p>'+
   '</section>');
  const rec=$('[data-v1211-repeat]',root),count=$('[data-v1211-count]',root),p=repeatSettings();
  rec.value=['none','daily','weekdays','weekly','biweekly','monthly'].includes(p.repeat)?p.repeat:'none';
  count.value=Number.isInteger(+p.count)&&+p.count>=2&&+p.count<=20?String(+p.count):'4';
  const update=()=>{count.disabled=rec.value==='none';display(root);saveSettings(root)};
  rec.addEventListener('change',update);
  count.addEventListener('input',update);
  root.addEventListener('change',e=>{if(e.target.matches('[data-v713-date],[data-v713-time]'))update()});
  root.addEventListener('input',e=>{if(e.target.matches('[data-v713-date],[data-v713-time]'))display(root)});
  $('[data-v1211-parse]',root).onclick=()=>{
    const content=['extra','body','title'].map(x=>$('[data-v713-'+x+']',root)?.value||'').join(' ');
    const found=spanish(content),advanced=window.LJR_NOTICE_DATE_LIBS?.parseEs;
    if(advanced&&(!found.date||!found.time)){
      try{const more=advanced(content,new Date());if(more){if(!found.date&&more.date)found.date=more.date;if(!found.time&&more.time)found.time=more.time}}catch(_){}
    }
    if(found.date)$('[data-v713-date]',root).value=found.date;
    if(found.time)$('[data-v713-time]',root).value=found.time;
    if(found.repeat)rec.value=found.repeat;
    update();
    setNotice(root,Object.keys(found).length?'Sugerencias detectadas. Verifica la fecha, hora y repetición.':'No encontré una fecha clara. Especifica el día y la hora.');
  };
  root.addEventListener('click',async e=>{
    const btn=e.target.closest('[data-v713-save]');
    if(!btn||rec.value==='none'||btn.textContent.includes('Guardar cambios'))return;
    e.preventDefault();e.stopImmediatePropagation();
    const s=state(root);
    const requested=Number(count.value);
    if(!Number.isInteger(requested)||requested<2||requested>20){setNotice(root,'Selecciona entre 2 y 20 avisos por serie.');return}
    const plan=planned({...s,count:requested});
    if(plan.dates.length!==requested){setNotice(root,'No se pudieron calcular todas las fechas. Revisa el día y la repetición.');return}
    const title=$('[data-v713-title]',root)?.value.trim()||'';
    const body=$('[data-v713-body]',root)?.value.trim()||'';
    const category=$('[data-v713-category]',root)?.value||'Todas';
    const type=$('[data-v713-type].active',root)?.dataset.v713Type||'general';
    const channels=Object.fromEntries($$('[data-v713-ch]',root).map(x=>[x.dataset.v713Ch,x.checked]));
    if(title.length<8||body.length<25){setNotice(root,'Completa un título y un mensaje suficientemente claros.');return}
    if(!Object.values(channels).some(Boolean)){setNotice(root,'Selecciona al menos un canal.');return}
    if(channels.facebook){setNotice(root,'Para evitar publicaciones repetidas por error, desactiva Facebook en las series locales.');return}
    const dates=plan.dates.map(x=>({day:x,at:wallMillis(x,s.time)}));
    if(dates.some(x=>!Number.isFinite(x.at)||x.at<=Date.now())){setNotice(root,'Todas las fechas deben ser futuras, en horario de Juventino Rosas.');return}
    if(!await authorized()){setNotice(root,'Solo administración autorizada puede crear avisos.');return}
    const current=readItems(),remind=Number($('[data-v713-remind]',root)?.value||0),recId='serie-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
    let skipped=0,prepared=[];
    dates.forEach((x,index)=>{
      const duplicated=current.some(old=>!old.published&&old.type===type&&old.category===category&&
        norm(old.title)===norm(title)&&norm(old.body)===norm(body)&&Math.abs(Date.parse(old.publishAt)-x.at)<300000);
      if(duplicated){skipped++;return}
      prepared.push({id:recId+'-'+(index+1),type,title,body,category,publishAt:new Date(x.at).toISOString(),
        remindAt:remind?new Date(x.at-remind*60000).toISOString():'',
        channels,status:'scheduled',createdAt:new Date().toISOString(),published:false,reminderSent:false,
        recurrenceId:recId,recurrenceIndex:index+1,recurrenceCount:requested,recurrenceRule:plan.rrule,timezone:ZONE});
    });
    if(!prepared.length){setNotice(root,'Estos avisos ya están programados. No se crearon duplicados.');return}
    const msg='Se crearán '+prepared.length+' avisos LOCALES ('+s.repeat+'), '+skipped+' repetidos omitidos. No se publicarán globalmente. ¿Confirmas?';
    if(!window.confirm(msg)){setNotice(root,'No se programó ningún aviso.');return}
    try{localStorage.setItem(KEY,JSON.stringify([...current,...prepared]))}catch(_){setNotice(root,'No fue posible guardar los avisos en este teléfono.');return}
    window.LJR_V713_NOTICE_SCHEDULER_REFRESH?.();
    setNotice(root,'Programados '+prepared.length+' avisos locales. '+(skipped?'Omitidos '+skipped+' duplicados.':'Puedes editar cada fecha desde la lista.'));
  },true);
  root.addEventListener('click',e=>{if(e.target.closest('[data-v1210-edit]')){rec.value='none';update();setNotice(root,'Edición de una fecha: no cambia las demás fechas de la serie.')}}); 
  update();
}
function mount(){$$('.v713-auto[data-v713-auto]').forEach(attach)}
if(document.documentElement)new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(mount,80));
document.addEventListener('DOMContentLoaded',mount);mount();
})();
