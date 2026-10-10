/* V1211 · Fechas con Chrono y avisos locales recurrentes compatibles con RRule.
   rrule y chrono-node se descargan de los archivos compilados SOLO cuando se usan.
   Nunca programa en el backend ni publica para toda la Liga. */
(function(){
'use strict';
if(window.__LJR_V1211_NOTICE_RECURRENCE__)return;
window.__LJR_V1211_NOTICE_RECURRENCE__=true;
const KEY='ljr-v713-auto-notices',TZ='America/Mexico_City';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const p=n=>String(n).padStart(2,'0');
const textDate=d=>d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
const hhmm=d=>p(d.getHours())+':'+p(d.getMinutes());
const localTime=d=>d.toLocaleString('es-MX',{timeZone:TZ,day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
const get=(r,k)=>$('[data-v713-'+k+']',r);
const all=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(_){return []}};
const write=items=>localStorage.setItem(KEY,JSON.stringify(items));
const checked=root=>Object.fromEntries($$('[data-v713-ch]',root).map(x=>[x.dataset.v713Ch,x.checked]));
const safeMsg=(root,message)=>{const el=$('[data-v1211-message]',root);if(el)el.textContent=message};
async function authorized(){
  if(!window.LJR_MEDIA?.admin||typeof window.LJR_MEDIA.api!=='function')return false;
  try{return !!(await window.LJR_MEDIA.api('me'))?.admin}catch(_){return false}
}
const recurrenceInfo={once:'Solo una vez',daily:'Todos los días',weekly:'Cada semana',monthly:'Cada mes'};
function mexicoMillis(raw){
  const m=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(raw||'');
  if(!m)return NaN;
  const [y,mo,day,h,minute]=m.slice(1).map(Number);
  if(mo<1||mo>12||h>23||minute>59||new Date(Date.UTC(y,mo-1,day)).getUTCDate()!==day)return NaN;
  const desired=Date.UTC(y,mo-1,day,h,minute);
  const f=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  let guess=desired;
  for(let i=0;i<3;i++){
    const q=Object.fromEntries(f.formatToParts(guess).map(x=>[x.type,x.value]));
    guess+=desired-Date.UTC(+q.year,+q.month-1,+q.day,+q.hour,+q.minute,+q.second);
  }
  const q=Object.fromEntries(f.formatToParts(guess).map(x=>[x.type,x.value]));
  return desired===Date.UTC(+q.year,+q.month-1,+q.day,+q.hour,+q.minute)?guess:NaN;
}
function spanishToEnglish(s){
  let t=norm(s);
  const words={enero:'january',febrero:'february',marzo:'march',abril:'april',mayo:'may',junio:'june',julio:'july',agosto:'august',septiembre:'september',setiembre:'september',octubre:'october',noviembre:'november',diciembre:'december',
    lunes:'monday',martes:'tuesday',miercoles:'wednesday',jueves:'thursday',viernes:'friday',sabado:'saturday',domingo:'sunday'};
  t=t.replace(/\bpasado manana\b/g,'in 2 days').replace(/\bmanana\b/g,'tomorrow').replace(/\bhoy\b/g,'today');
  t=t.replace(/\b(?:el|este|esta)\s+(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/g,'next $1');
  t=t.replace(/\bproxim[oa]\s+(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/g,'next $1');
  t=t.replace(/\ba las\s+(\d{1,2})(?=\s*(?:de la tarde|de la noche))\s*de la (?:tarde|noche)/g,'at $1 pm');
  t=t.replace(/\ba las\s+(\d{1,2})(?=\s*de la manana)\s*de la manana/g,'at $1 am');
  t=t.replace(/\b(?:a las|a la)\b/g,'at');
  t=t.replace(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+(\d{4}))?/g,(_m,day,month,year)=>day+' '+words[month]+(year?' '+year:''));
  t=t.replace(/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/g,w=>words[w]);
  return t;
}
function hasDateWords(s){
  return /\b(hoy|manana|pasado manana|lunes|martes|miercoles|jueves|viernes|sabado|domingo|proximo|este|esta|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/.test(norm(s)) ||
    /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/.test(s) || /\b\d{4}-\d{2}-\d{2}\b/.test(s);
}
function explicitDateEs(s,reference=new Date()){
  const iso=s.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  const dm=s.match(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/);
  let y,mo,day;
  if(iso){y=+iso[1];mo=+iso[2];day=+iso[3];}
  else if(dm){day=+dm[1];mo=+dm[2];y=dm[3]?+dm[3]:reference.getFullYear();if(y<100)y+=2000;}
  else return '';
  if(!Number.isFinite(Date.UTC(y,mo-1,day))||mo<1||mo>12||new Date(Date.UTC(y,mo-1,day)).getUTCDate()!==day)return '';
  if(dm&&!dm[3]&&new Date(y,mo-1,day,23,59)<reference)y++;
  return y+'-'+p(mo)+'-'+p(day);
}
function timeEs(s){
  const t=norm(s);
  const hm=t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\s*(am|pm)?\b/);
  const suffix=t.match(/\b(1[0-2]|[1-9])\s*(am|pm)\b/) ||
    t.match(/\ba las?\s+(1[0-2]|[1-9])\s*(?:de la\s+)?(manana|tarde|noche)\b/);
  if(!hm&&!suffix)return '';
  let hour=+(hm?hm[1]:suffix[1]),min=hm?+hm[2]:0;
  const meridian=hm?hm[3]||'':suffix[2];
  if((meridian==='pm'||meridian==='tarde'||meridian==='noche')&&hour<12)hour+=12;
  if((meridian==='am'||meridian==='manana')&&hour===12)hour=0;
  return p(hour)+':'+p(min);
}
async function interpretSpanish(input,reference=new Date(),parseFn){
  const result={};
  if(!hasDateWords(input))return result;
  const explicit=explicitDateEs(input,reference);if(explicit)result.date=explicit;
  // "cada sábado" indica tanto la frecuencia como la primera fecha futura.
  const weekday=norm(input).match(/\bcada\s+(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/);
  if(weekday&&!result.date){
    const days={domingo:0,lunes:1,martes:2,miercoles:3,jueves:4,viernes:5,sabado:6};
    const next=new Date(reference);
    let delta=(days[weekday[1]]-next.getDay()+7)%7;
    if(!delta)delta=7;
    next.setDate(next.getDate()+delta);
    result.date=textDate(next);
  }
  const clock=timeEs(input);if(clock)result.time=clock;
  let fn=parseFn;
  if(!fn){
    const chrono=await import('chrono-node');fn=(text,now)=>chrono.en.parse(text,now,{forwardDate:true});
  }
  const translated=spanishToEnglish(input);
  const parsed=fn(translated,reference)||[];
  if(parsed.length){
    const match=parsed.find(x=>x&&x.start&&x.start.date())||null;
    if(match){
      const d=match.start.date();
      if(!result.date&&!Number.isNaN(+d))result.date=textDate(d);
      if(!result.time&&match.start.isCertain?.('hour'))result.time=hhmm(d);
    }
  }
  return result;
}
function recurringType(text){
  const t=norm(text);
  if(/\bcada\s+(dia|manana)\b|\btodos los dias\b/.test(t))return 'daily';
  if(/\bcada\s+(lunes|martes|miercoles|jueves|viernes|sabado|domingo|semana)\b|\btodos los (lunes|martes|miercoles|jueves|viernes|sabados|domingos)\b/.test(t))return 'weekly';
  if(/\bcada mes\b|\bmensualmente\b/.test(t))return 'monthly';
  return 'once';
}
async function occurrenceTimes(date,time,repeat,count,lib){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d\d:\d\d$/.test(time))throw Error('Indica fecha y hora válidas.');
  const max=Math.min(12,Math.max(1,Number(count)||1));
  const freq=String(repeat||'once');
  if(!['once','daily','weekly','monthly'].includes(freq))throw Error('Repetición no válida.');
  const m=Date.UTC(...date.split('-').map((x,i)=>i===1?Number(x)-1:Number(x)),...time.split(':').map(Number));
  const start=new Date(m);
  if(start.toISOString().slice(0,10)!==date||start.toISOString().slice(11,16)!==time)throw Error('Fecha inexistente.');
  let floating=[start];
  if(freq!=='once'){
    const {RRule}=lib || await import('rrule');
    const name={daily:RRule.DAILY,weekly:RRule.WEEKLY,monthly:RRule.MONTHLY}[freq];
    const rule=new RRule({freq:name,dtstart:start,count:max,interval:1});
    floating=rule.all();
  }
  return floating.slice(0,max).map(dt=>{
    const local=dt.getUTCFullYear()+'-'+p(dt.getUTCMonth()+1)+'-'+p(dt.getUTCDate())+'T'+p(dt.getUTCHours())+':'+p(dt.getUTCMinutes());
    const instant=mexicoMillis(local);
    if(!Number.isFinite(instant))throw Error('No se pudo determinar la hora en Juventino Rosas.');
    return new Date(instant).toISOString();
  });
}
function seriesMeta(date,time,repeat,count){
  const freq={daily:'daily',weekly:'weekly',monthly:'monthly'}[repeat];
  if(!freq)return null;
  return {freq,dtstart:date+'T'+time+':00',count:Number(count),tzid:TZ};
}
function getData(root){
  return {title:get(root,'title')?.value.trim()||'',body:get(root,'body')?.value.trim()||'',
    category:get(root,'category')?.value||'Todas',type:$('[data-v713-type].active',root)?.dataset.v713Type||'general',
    date:get(root,'date')?.value,time:get(root,'time')?.value,
    remind:Number(get(root,'remind')?.value||0),channels:checked(root)};
}
function makeLocalRows(d,dates,repeat,count,now=Date.now()){
  const batch='serie-'+now.toString(36)+'-'+Math.random().toString(36).slice(2,9);
  const meta=seriesMeta(d.date,d.time,repeat,count);
  return dates.map((publishAt,i)=>({
    id:'aviso-'+now.toString(36)+'-'+(i+1)+'-'+Math.random().toString(36).slice(2,6),
    type:d.type,title:d.title,body:d.body,category:d.category,publishAt,
    remindAt:d.remind?new Date(Date.parse(publishAt)-d.remind*60000).toISOString():'',
    channels:d.channels,status:'scheduled',createdAt:new Date(now).toISOString(),
    published:false,reminderSent:false,seriesId:batch,seriesIndex:i+1,seriesSize:dates.length,rrule:meta
  }));
}
function refresh(root){
  if(typeof window.LJR_V713_NOTICE_SCHEDULER_REFRESH==='function')window.LJR_V713_NOTICE_SCHEDULER_REFRESH();
  else root.dispatchEvent(new CustomEvent('ljr:v1211-refresh',{bubbles:true}));
}
function setup(root){
  if(root.dataset.v1211Ready)return;
  const destination=$('.v729-schedule-card',root);
  if(!destination)return;
  root.dataset.v1211Ready='true';
  destination.insertAdjacentHTML('afterend',
    '<section class="v1211-panel" data-v1211-panel>'+
    '<div class="v1211-head"><div><small>PROGRAMACIÓN INTELIGENTE · LOCAL</small><h3>Repetir aviso</h3></div><span>RRULE</span></div>'+
    '<div class="v1211-grid"><label>Frecuencia<select data-v1211-repeat aria-label="Frecuencia del aviso">'+
    '<option value="once">Solo una vez</option><option value="daily">Cada día</option><option value="weekly">Cada semana</option><option value="monthly">Cada mes</option></select></label>'+
    '<label data-v1211-count-box hidden>Número de avisos<select data-v1211-count><option value="4">4 avisos</option><option value="8">8 avisos</option><option value="12">12 avisos</option></select></label></div>'+
    '<p class="v1211-preview" data-v1211-preview>El aviso se programará una sola vez.</p>'+
    '<p class="v1211-help">Las repeticiones se guardan en este teléfono. Solo se procesan con la aplicación abierta; no se envían automáticamente a todos los usuarios.</p>'+
    '<small data-v1211-message role="status" aria-live="polite">Puedes usar frases como «cada sábado a las 10:00» o «21 de octubre a las 17:30».</small>'+
    '</section>');
  const repeat=$('[data-v1211-repeat]',root),count=$('[data-v1211-count]',root),panel=$('[data-v1211-panel]',root);
  const redraw=async()=>{
    $('[data-v1211-count-box]',root).hidden=repeat.value==='once';
    const out=$('[data-v1211-preview]',root),d=getData(root);
    if(repeat.value==='once'){out.textContent='El aviso se programará una sola vez.';return}
    out.textContent='Calculando fechas…';
    try{
      const dates=await occurrenceTimes(d.date,d.time,repeat.value,+count.value);
      out.textContent='Próximos avisos ('+dates.length+'): '+dates.slice(0,3).map(localTime).join(' · ')+(dates.length>3?' · …':'');
    }catch(_){out.textContent='Selecciona primero una fecha y una hora válidas.'}
  };
  repeat.addEventListener('change',redraw);count.addEventListener('change',redraw);
  for(const k of ['date','time'])get(root,k)?.addEventListener('change',redraw);
  const labelDetect=()=>{const el=$('[data-v1210-detect]',root);if(el&&el.textContent!=='Detectar fecha en español')el.textContent='Detectar fecha en español'};
  labelDetect();
  // El módulo v1210 puede montarse después: captura el botón aunque aparezca tarde.
  new MutationObserver(labelDetect).observe(root,{childList:true,subtree:true});
  root.addEventListener('click',async ev=>{
      const detect=ev.target.closest('[data-v1210-detect]');
      if(!detect)return;
      ev.preventDefault();ev.stopImmediatePropagation();
      const text=[get(root,'extra')?.value,get(root,'body')?.value,get(root,'title')?.value].filter(Boolean).join(' ');
      if(typeof detect.onclick==='function')detect.onclick();
      const inferred=recurringType(text);
      if(inferred!=='once')repeat.value=inferred;
      try{
        const f=await interpretSpanish(text);
        if(f.date)get(root,'date').value=f.date;
        if(f.time)get(root,'time').value=f.time;
        for(const k of ['date','time'])get(root,k)?.dispatchEvent(new Event('change',{bubbles:true}));
        await redraw();
        safeMsg(root,Object.keys(f).length?'Fecha detectada; confirma que sea correcta antes de programar.':'Se conservaron los datos existentes. Revisa fecha y hora.');
      }catch(_){safeMsg(root,'El reconocimiento avanzado no está disponible. Puedes usar los selectores manuales.')}
    },true);
  // El formulario antiguo gestiona "Solo una vez", y la edición individual mantiene su flujo.
  root.addEventListener('click',async event=>{
    if(!event.target.closest('[data-v713-save]')||repeat.value==='once')return;
    const cancel=$('[data-v1210-cancel]',root);
    if(cancel&&!cancel.hidden)return;
    event.preventDefault();event.stopImmediatePropagation();
    const saveBtn=get(root,'save');
    if(saveBtn.disabled)return;
    saveBtn.disabled=true;
    try{
      if(!await authorized()){safeMsg(root,'Solo una sesión oficial de administración puede guardar avisos.');return}
      const d=getData(root);
      if(d.title.length<8||d.body.length<25)throw Error('Escribe un título y un mensaje suficientemente completos.');
      if(!Object.values(d.channels).some(Boolean))throw Error('Selecciona por lo menos un canal.');
      const dates=await occurrenceTimes(d.date,d.time,repeat.value,+count.value);
      if(dates.some(x=>Date.parse(x)<=Date.now()))throw Error('Todos los avisos deben ser futuros.');
      const old=all(),next=makeLocalRows(d,dates,repeat.value,+count.value);
      if(old.length+next.length>300)throw Error('Este teléfono llegó al límite de 300 recordatorios.');
      if(next.some(item=>old.some(o=>!o.published&&o.category===item.category&&norm(o.title)===norm(item.title)&&Math.abs(Date.parse(o.publishAt)-Date.parse(item.publishAt))<300000)))
        throw Error('Ya existe un aviso del mismo título, categoría y horario.');
      write(old.concat(next));refresh(root);
      safeMsg(root,'Se programaron '+next.length+' avisos LOCALES. No se enviaron mensajes al público.');
    }catch(e){safeMsg(root,e?.message||'No fue posible programar los recordatorios.');}
    finally{saveBtn.disabled=false}
  },true);
  const list=$('[data-v713-list]',root);
  function labelSeries(){
    if(!list)return;
    $$('[data-v713-id]',list).forEach(card=>{
      const item=all().find(i=>i.id===card.dataset.v713Id);
      if(!item?.seriesId)return;
      const actions=$('.v713-item-actions',card);
      if(!actions||$('[data-v1211-series]',actions))return;
      const btn=document.createElement('button');btn.type='button';
      btn.dataset.v1211Series=item.seriesId;btn.textContent='Cancelar serie';
      actions.appendChild(btn);
      const meta=$('.v713-item-top span',card);
      if(meta)meta.textContent=(meta.textContent||'Aviso')+' · '+item.seriesIndex+'/'+item.seriesSize;
    });
  }
  if(list){new MutationObserver(labelSeries).observe(list,{childList:true});labelSeries()}
  root.addEventListener('click',async e=>{
    const btn=e.target.closest('[data-v1211-series]');if(!btn)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(!await authorized()){safeMsg(root,'Necesitas permisos de administración.');return}
    const items=all(),pending=items.filter(x=>x.seriesId===btn.dataset.v1211Series&&!x.published);
    if(!pending.length){safeMsg(root,'Esta serie no tiene avisos pendientes.');return}
    if(!window.confirm('¿Cancelar los '+pending.length+' avisos PENDIENTES de esta serie? Los ya procesados se conservarán.'))return;
    write(items.filter(x=>!pending.includes(x)));refresh(root);
    safeMsg(root,'Se cancelaron '+pending.length+' recordatorios pendientes de la serie.');
  },true);
  redraw();
}
function mount(){$$('.v713-auto[data-v713-auto]').forEach(setup)}
new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',mount);
window.addEventListener('hashchange',()=>setTimeout(mount,75));
mount();
})();
