/* V1126 · Extensiones operativas privadas para Árbitros y oficiales.
   Datos oficiales SOLO LECTURA. No publica ni modifica el calendario/cédula.
   Respaldo cifrado manual: NO es sincronización automática. */
(function(){
'use strict';
if(window.__LJR_OFFICIALS_OPS_1126__)return;
window.__LJR_OFFICIALS_OPS_1126__=true;

const ROOT='.v105-modal.v1125-officials-modal';
const ASSIGNMENTS='v1125-official-assignments';
const OFFICIALS='v105-officials';
const OPERATIONS='v1126-official-operations';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const read=(key,otherwise)=>{try{const obj=JSON.parse(localStorage.getItem(key));return obj==null?otherwise:obj}catch(_){return otherwise}};
const save=(key,obj)=>{try{localStorage.setItem(key,JSON.stringify(obj));return true}catch(_){alert('El navegador no pudo guardar los datos privados. Revisa el almacenamiento disponible.');return false}};
const getAssignments=()=>{const r=read(ASSIGNMENTS,[]);return Array.isArray(r)?r:[]};
const getOfficials=()=>{const r=read(OFFICIALS,[]);return Array.isArray(r)?r:[]};
const getOperations=()=>{const r=read(OPERATIONS,{});return r&&typeof r==='object'&&!Array.isArray(r)?r:{}};
const isoDay=(d)=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const pad=n=>String(n).padStart(2,'0');
const dateTime=(day,hh)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!/^\d{2}:\d{2}$/.test(hh))return null;const v=new Date(day+'T'+hh+':00');return Number.isNaN(+v)?null:v};
const download=(name,content,type)=>{
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
};
const toast=message=>{
 const el=document.createElement('p');el.className='v1126-flash';el.setAttribute('role','status');el.textContent=message;
 document.querySelector(ROOT+' .v1126-operational')?.prepend(el);
 setTimeout(()=>el.remove(),3500);
};
const parseFixtureDate=s=>{
 const match=String(s||'').match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})(?:[^\d]+(\d{1,2}):(\d{2}))?/);
 if(!match)return null;
 const year=Number(match[3]),month=Number(match[2]),day=Number(match[1]);
 const d=new Date(year,month-1,day);if(d.getFullYear()!==year||d.getMonth()+1!==month||d.getDate()!==day)return null;
 const hour=match[4]===undefined?'':pad(match[4]),minute=match[5]===undefined?'':pad(match[5]);
 return {day:isoDay(d),time:hour&&minute?hour+':'+minute:'',epoch:d.getTime()};
};
function getFixtures(){
 let data={};try{data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){data=window.LJR_OFFICIAL_DATA||{}}
 if(!data.categories)return [];
 const earliest=Date.now()-2*24*3600000,latest=Date.now()+120*24*3600000,all=[];
 Object.entries(data.categories).forEach(([catId,c])=>{
  const category=String(c?.name||('Categoría '+catId));
  (c?.fixtures||[]).forEach((block,bi)=>{
   (block?.rows||[]).forEach((r,ri)=>{
    if(!Array.isArray(r)||!r[2]||!r[6])return;
    const date=parseFixtureDate(r[8]);if(!date||date.epoch<earliest||date.epoch>latest)return;
    if(/^\d+$/.test(String(r[3]??'').trim())&&/^\d+$/.test(String(r[5]??'').trim()))return;
    const home=String(r[2]).trim(),away=String(r[6]).trim(),field=String(r[7]||'Por definir').trim();
    const key=[catId,bi,ri,r[0]||'',r[8]||'',home,away].join('|');
    all.push({key,day:date.day,time:date.time,epoch:date.epoch,home,away,category,field,round:String(r[1]||'')});
   });
  });
 });
 return all.sort((a,b)=>a.epoch-b.epoch).slice(0,180);
}
function fixtureLabel(f){
 return (f.round?'J'+f.round+' · ':'')+f.category+' · '+f.home+' vs '+f.away+' · '+f.day+(f.time?' '+f.time:'');
}
function operationSection(){
 return '<div class="v1126-operational">'+
  '<div class="v1126-tool"><strong>Elegir partido del rol oficial</strong><small>Consulta de jornadas cargadas, sin modificar datos oficiales.</small>'+
   '<select data-op-fixture aria-label="Partido oficial"><option value="">Cargando partidos…</option></select>'+
   '<button type="button" data-op-action="pick-fixture">Preparar designación</button><p data-op-fixture-msg class="v1126-help"></p></div>'+
  '<div class="v1126-tool"><strong>Historial y honorarios</strong><small>Marca los partidos realizados y registra pagos locales en pesos mexicanos.</small>'+
   '<div data-op-stats class="v1126-stats"></div><div data-op-games class="v1126-rows"></div></div>'+
  '<div class="v1126-tool"><strong>Respaldo privado cifrado</strong><small>Exporta o importa un archivo con contraseña. Se transfiere manualmente entre dispositivos; no se sube a internet.</small>'+
   '<label class="v1126-backup"><span>Contraseña de respaldo (mínimo 8 caracteres)</span><input type="password" data-op-pass autocomplete="new-password" minlength="8" placeholder="Contraseña privada"></label>'+
   '<div class="v1126-backup-actions"><button type="button" data-op-action="export">Exportar cifrado</button><button type="button" data-op-action="import">Importar cifrado</button></div>'+
   '<input type="file" data-op-file accept=".json,application/json" hidden>'+
   '<p class="v1126-help">La contraseña no se guarda. La importación reemplaza los registros locales después de tu confirmación. Guarda la contraseña en un sitio seguro: sin ella no podrás recuperar el respaldo.</p></div>'+
  '<p class="v1126-help">Los importes, notas y teléfonos no son públicos. Una confirmación local no sustituye una autorización oficial de la Liga.</p>'+
 '</div>';
}
function fillFixture(root){
 const sel=$('[data-op-fixture]',root),label=$('[data-op-fixture-msg]',root);
 const fixtures=getFixtures();root.__ljrOpsFixtures=fixtures;
 sel.innerHTML='<option value="">'+(fixtures.length?'Selecciona un partido…':'No hay próximos partidos oficiales disponibles')+'</option>'+
  fixtures.map((f,i)=>'<option value="'+i+'">'+escapeHTML(fixtureLabel(f))+'</option>').join('');
 label.textContent=fixtures.length?'Partidos próximos sin marcador final. Verifica siempre el horario antes de designar.':'Actualiza los datos oficiales de la Liga y vuelve a abrir este apartado.';
}
function sendCalendar(a,off){
 const start=dateTime(a.date,a.time);if(!start){toast('Este partido no tiene fecha y hora válidas.');return}
 const end=new Date(start.getTime()+120*60*1000);
 const stamp=d=>String(d.getFullYear())+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+'00';
 const safe=t=>String(t||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const uid=String(a.id||a.date+a.time).replace(/[^a-zA-Z0-9-]/g,'');
 const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Arbitraje privado//ES','BEGIN:VEVENT',
 'UID:ljr-ops-'+uid+'@local','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),
 'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+safe('Arbitraje: '+a.game),
 'LOCATION:'+safe(a.field),'DESCRIPTION:'+safe('Designación local: '+(off?.name||a.officialName)+' · '+(a.category||'')),
 'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:Tu partido de arbitraje es mañana','END:VALARM',
 'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY','DESCRIPTION:Tu partido de arbitraje es en dos horas','END:VALARM',
 'END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';
 download('arbitraje-avisos-'+a.date+'.ics',content,'text/calendar;charset=utf-8');
 toast('Importa el archivo en tu calendario para activar dos recordatorios (24 h y 2 h).');
}
function renderOperations(root){
 const assignments=getAssignments(),officials=getOfficials(),records=getOperations();
 const states=assignments.map(a=>({a,rec:records[a.id]||{},off:officials.find(o=>o.id===a.officialId)}));
 const completed=states.filter(x=>x.rec.done===true).length;
 const pending=states.reduce((sum,x)=>sum+(Number(x.rec.amount)>0&&!x.rec.paid?Number(x.rec.amount):0),0);
 const paid=states.reduce((sum,x)=>sum+(Number(x.rec.amount)>0&&x.rec.paid?Number(x.rec.amount):0),0);
 const money=n=>Number(n).toLocaleString('es-MX',{style:'currency',currency:'MXN'});
 $('[data-op-stats]',root).innerHTML=
  '<span><b>'+assignments.length+'</b><small>Designaciones</small></span>'+
  '<span><b>'+completed+'</b><small>Realizados</small></span>'+
  '<span><b>'+money(pending)+'</b><small>Pendiente</small></span>'+
  '<span><b>'+money(paid)+'</b><small>Pagado</small></span>';
 const sorted=states.sort((a,b)=>(b.a.date+' '+b.a.time).localeCompare(a.a.date+' '+a.a.time));
 $('[data-op-games]',root).innerHTML=sorted.length?sorted.map(({a,rec,off})=>{
  const ref=String(a.id||'');
  return '<article class="v1126-game" data-op-row="'+escapeHTML(ref)+'">'+
   '<div class="v1126-game-head"><b>'+escapeHTML(a.game||'Partido')+'</b><span>'+escapeHTML(a.date||'')+' '+escapeHTML(a.time||'')+'</span></div>'+
   '<small>'+escapeHTML(off?.name||a.officialName||'Oficial')+' · '+escapeHTML(a.category||'')+' · '+escapeHTML(a.field||'')+'</small>'+
   '<div class="v1126-game-fields"><label><span>Honorarios MXN</span><input inputmode="decimal" type="number" min="0" max="1000000" step="0.01" data-op-amount value="'+escapeHTML(rec.amount??'')+'" placeholder="0.00"></label>'+
   '<label><span>Estado</span><select data-op-paid><option value="pending"'+(!rec.paid?' selected':'')+'>Pendiente</option><option value="paid"'+(rec.paid?' selected':'')+'>Pagado</option></select></label>'+
   '<label class="v1126-full"><span>Nota privada</span><input maxlength="180" data-op-note value="'+escapeHTML(rec.note||'')+'" placeholder="Observaciones del pago"></label></div>'+
   '<div class="v1126-game-actions"><button type="button" data-op-action="save-payment" data-id="'+escapeHTML(ref)+'">Guardar pago</button>'+
   '<button type="button" data-op-action="toggle-done" data-id="'+escapeHTML(ref)+'">'+(rec.done?'Desmarcar realizado':'Marcar realizado')+'</button>'+
   '<button type="button" data-op-action="remind" data-id="'+escapeHTML(ref)+'">Calendario + avisos</button></div>'+
   (rec.done?'<span class="v1126-status">✓ Partido registrado como realizado</span>':'')+
   '</article>';
 }).join(''):'<p class="v1126-help">Primero crea una designación en la pestaña Designaciones.</p>';
}
const arrBytes=new TextEncoder();
function base64(bytes){
 let s='';for(const b of bytes)s+=String.fromCharCode(b);
 return btoa(s);
}
function unbase64(value){
 const s=atob(value),out=new Uint8Array(s.length);
 for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);
 return out;
}
async function cipherKey(pass,salt){
 const source=await crypto.subtle.importKey('raw',arrBytes.encode(pass),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},source,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function exportEncrypted(root){
 if(!crypto?.subtle){toast('Este navegador no dispone de cifrado seguro.');return}
 const pass=$('[data-op-pass]',root).value;
 if(pass.length<8){toast('La contraseña debe tener mínimo 8 caracteres.');return}
 const payload={schema:'ljr-officials-v1126',exportedAt:new Date().toISOString(),
  officials:getOfficials(),assignments:getAssignments(),operations:getOperations()};
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await cipherKey(pass,salt);
 const sealed=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,arrBytes.encode(JSON.stringify(payload)));
 const wrapper={schema:'ljr-officials-encrypted-v1',algorithm:'AES-GCM/PBKDF2-SHA256',salt:base64(salt),iv:base64(iv),data:base64(new Uint8Array(sealed))};
 download('liga-arbitros-respaldo-'+isoDay(new Date())+'.json',JSON.stringify(wrapper), 'application/json;charset=utf-8');
 $('[data-op-pass]',root).value='';toast('Respaldo privado cifrado descargado.');
}
async function importEncrypted(root,file){
 if(!file)return;
 if(!crypto?.subtle){toast('Importación cifrada no disponible en este navegador.');return}
 if(file.size>2e6){toast('El archivo de respaldo es demasiado grande.');return}
 const pass=$('[data-op-pass]',root).value;
 if(pass.length<8){toast('Introduce la contraseña del respaldo.');return}
 try{
  const wrapper=JSON.parse(await file.text());
  if(wrapper.schema!=='ljr-officials-encrypted-v1')throw new Error('Archivo no compatible');
  const key=await cipherKey(pass,unbase64(wrapper.salt));
  const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(wrapper.iv)},key,unbase64(wrapper.data));
  const obj=JSON.parse(new TextDecoder().decode(decrypted));
  if(obj.schema!=='ljr-officials-v1126'||!Array.isArray(obj.officials)||!Array.isArray(obj.assignments)||
   !obj.operations||typeof obj.operations!=='object'||Array.isArray(obj.operations)){
   throw new Error('El respaldo no contiene datos compatibles');
  }
  if(obj.officials.length>5000||obj.assignments.length>10000)throw new Error('El respaldo supera el límite de registros');
  if(!confirm('¿Reemplazar los datos locales de árbitros, designaciones e historial con este respaldo? Esta acción no puede deshacerse.'))return;
  const values=[[OFFICIALS,obj.officials],[ASSIGNMENTS,obj.assignments],[OPERATIONS,obj.operations]];
  const snap=values.map(([k])=>[k,localStorage.getItem(k)]);
  try{
   values.forEach(([k,v])=>localStorage.setItem(k,JSON.stringify(v)));
  }catch(err){
   snap.forEach(([k,v])=>{try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(_){}});
   throw err;
  }
  $('[data-op-pass]',root).value='';
  toast('Respaldo restaurado. Cierra y abre de nuevo esta sección para actualizar todos los registros.');
  fillFixture(root);renderOperations(root);
 }catch(error){
  toast('No se pudo importar: contraseña incorrecta o archivo no válido.');
 }finally{$('[data-op-file]',root).value=''}
}
function bindOperations(root){
 const tabs=$('.v1125-tabs',root),panels=$('[data-o-panel="assignments"]',root);
 if(!tabs||!panels)return;
 const tab=document.createElement('button');
 tab.type='button';tab.textContent='Gestión';tab.dataset.oOpsTab='';tab.setAttribute('role','tab');tab.setAttribute('aria-selected','false');
 tabs.append(tab);
 const panel=document.createElement('section');panel.dataset.oOpsPanel='';panel.setAttribute('role','tabpanel');panel.hidden=true;panel.innerHTML=operationSection();
 panels.insertAdjacentElement('afterend',panel);
 const show=()=>{
  $$('[data-o-tab]',root).forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-selected','false')});
  $$('[data-o-panel]',root).forEach(s=>s.hidden=true);
  tab.classList.add('is-active');tab.setAttribute('aria-selected','true');panel.hidden=false;
  fillFixture(root);renderOperations(root);
 };
 tab.addEventListener('click',show);
 $$('[data-o-tab]',root).forEach(b=>b.addEventListener('click',()=>{
  tab.classList.remove('is-active');tab.setAttribute('aria-selected','false');panel.hidden=true;
 }));
 panel.addEventListener('click',event=>{
  const button=event.target.closest('[data-op-action]');if(!button)return;
  const action=button.dataset.opAction,id=button.dataset.id;
  if(action==='pick-fixture'){
   const value=$('[data-op-fixture]',root).value;
   const f=root.__ljrOpsFixtures?.[Number(value)];
   if(value===''||!f){toast('Selecciona primero un partido del calendario.');return}
   if(!getOfficials().some(o=>(o.status||'Activo')==='Activo')){toast('Primero registra un árbitro activo en Directorio.');return}
   $('[data-o-tab="assignments"]',root).click();
   $('[data-o-action="new-assignment"]',root).click();
   const name=$('[data-o-game]',root),d=$('[data-o-date]',root),t=$('[data-o-time]',root),field=$('[data-o-game-field]',root),category=$('[data-o-game-cat]',root);
   if(!name||!d||!t){toast('No se pudo abrir el formulario de designación.');return}
   name.value=f.home+' vs '+f.away;
   d.value=f.day;t.value=f.time||'';
   if(field){
    const opt=Array.from(field.options).find(o=>normalize(o.value)===normalize(f.field));
    field.value=opt?.value||'Otro';
   }
   if(category){
    const cat=normalize(f.category),opt=Array.from(category.options).find(o=>{
     const v=normalize(o.value);return v===cat||cat.includes(v)||(v==='primera'&&cat.includes('primera fuerza'));
    });
    if(opt)category.value=opt.value;
   }
   name.focus();return;
  }
  const a=getAssignments().find(a=>String(a.id)===String(id));if(!a&&action!=='export'&&action!=='import'){toast('Designación no encontrada.');return}
  if(action==='remind'){const off=getOfficials().find(o=>o.id===a.officialId);sendCalendar(a,off);return}
  if(action==='save-payment'){
   const article=button.closest('[data-op-row]'),amountRaw=$('[data-op-amount]',article).value.trim(),paid=$('[data-op-paid]',article).value==='paid',
    note=$('[data-op-note]',article).value.trim();
   const amount=amountRaw===''?0:Number(amountRaw);
   if(!Number.isFinite(amount)||amount<0||amount>1000000){toast('Indica un importe válido entre 0 y 1,000,000 MXN.');return}
   const data=getOperations();
   data[id]={...data[id],amount,paid,note,paymentUpdatedAt:new Date().toISOString()};
   if(save(OPERATIONS,data)){renderOperations(root);toast('Pago guardado solo en este dispositivo.')}return;
  }
  if(action==='toggle-done'){
   const data=getOperations();data[id]={...data[id],done:!data[id]?.done,completedAt:new Date().toISOString()};
   if(save(OPERATIONS,data)){renderOperations(root);toast('Historial actualizado.')}return;
  }
  if(action==='export'){exportEncrypted(root).catch(()=>toast('No se pudo cifrar el respaldo.'));return}
  if(action==='import'){$('[data-op-file]',root).click();return}
 });
 $('[data-op-file]',root).addEventListener('change',e=>importEncrypted(root,e.target.files?.[0]));
}
function setup(){
 $$(ROOT).forEach(root=>{if(root.dataset.v1126Operations==='1')return;root.dataset.v1126Operations='1';bindOperations(root)});
}
new MutationObserver(()=>setup()).observe(document.body,{childList:true});
setup();
})();