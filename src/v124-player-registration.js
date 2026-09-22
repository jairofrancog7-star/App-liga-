/* V124 — Registro de jugadores por temporada.
   Complementa credentialBuilder sin publicar CURP/fecha/domicilio en GitHub.
   Los datos capturados se guardan solo en localStorage del dispositivo. */
(function(){
'use strict';
if(window.__LJR_V124_PLAYER_REGISTRY__)return;
window.__LJR_V124_PLAYER_REGISTRY__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const KEY='v124-player-registry';
const SEASON_KEY='v124-player-season';
const EDIT_KEY='v124-player-edit-id';
const selectedIds=new Set();
let quickTeam='';
let quickSeason='';
let quickTeamPickerOpen=false;
let quickTeamQuery='';
let quickTeamCategory='Todas';
let quickTeamLetter='Todas';
let rosterImportTeam='';
let rosterTeamPickerOpen=false;
let rosterTeamQuery='';
let rosterImportFile=null;
let rosterHandwritingMode=false;
let rosterDetectedKind='auto';
let rosterExpectedRows=0;
let rosterImport={fileName:'',rawText:'',entries:[],missing:[],status:'',busy:false};
let lastManagerHtml='';
let filePickerCooldownUntil=0;
let registryQuery='';
let registrySort='newest';
let registryCategory='Todas';
let registryTeam='Todos';
let registryLetter='Todas';
let registrySource='Todos';

function toast(msg){
  let n=$('.v124-toast');if(n)n.remove();
  n=document.createElement('div');n.className='v124-toast';n.textContent=msg;document.body.appendChild(n);
  setTimeout(()=>n.remove(),2400);
}
function currentRegistrarName(){
  try{
    const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}')||{};
    const n=String(s?.user?.name||'').trim();
    if(n)return n;
  }catch(e){}
  return 'Este dispositivo';
}
function recordOrigin(r){
  if(r?.registrationOrigin)return String(r.registrationOrigin);
  if(r?.source==='official')return 'AdminFut';
  const st=norm(r?.status||'');
  if(st.includes('renovacion'))return 'Renovación';
  if(st.includes('cambio de equipo'))return 'Cambio de equipo';
  if(st.includes('import'))return 'Importación';
  return 'Registro en la app';
}
function recordRegistrar(r){
  if(r?.registeredBy)return String(r.registeredBy);
  if(r?.source==='official')return 'AdminFut';
  return 'Registro local anterior';
}
function fmtRecordDate(v){
  if(!v)return 'Sin fecha';
  const d=new Date(v);if(Number.isNaN(d.getTime()))return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d);
}
function recordTimestamp(r){
  const t=Date.parse(r?.createdAt||r?.updatedAt||'');
  return Number.isFinite(t)?t:0;
}
function filterRegistry(list){
  let out=(Array.isArray(list)?list:[]).slice();
  const q=norm(registryQuery);
  if(q)out=out.filter(r=>[r.name,r.team,r.category,recordOrigin(r),recordRegistrar(r)].some(v=>norm(v).includes(q)));
  if(registryCategory!=='Todas')out=out.filter(r=>String(r.category||'')===registryCategory);
  if(registryTeam!=='Todos')out=out.filter(r=>String(r.team||'')===registryTeam);
  if(registryLetter!=='Todas')out=out.filter(r=>norm(r.name).charAt(0).toUpperCase()===registryLetter);
  if(registrySource!=='Todos')out=out.filter(r=>recordOrigin(r)===registrySource);
  const byName=(a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'});
  if(registrySort==='oldest')out.sort((a,b)=>recordTimestamp(a)-recordTimestamp(b)||byName(a,b));
  else if(registrySort==='az')out.sort(byName);
  else if(registrySort==='za')out.sort((a,b)=>-byName(a,b));
  else out.sort((a,b)=>recordTimestamp(b)-recordTimestamp(a)||byName(a,b));
  return out;
}
function uniqueSorted(list,key){
  return [...new Set((list||[]).map(key).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'es',{sensitivity:'base'}));
}
function registryFilterHtml(list){
  const cats=uniqueSorted(list,r=>r.category||'');
  const teams=uniqueSorted(list,r=>r.team||'');
  const sources=uniqueSorted(list,recordOrigin);
  const letters=uniqueSorted(list,r=>norm(r.name).charAt(0).toUpperCase()).filter(x=>/^[A-Z0-9]$/.test(x));
  const filtered=filterRegistry(list);
  const opt=(v,label,current)=>'<option value="'+esc(v)+'" '+(current===v?'selected':'')+'>'+esc(label||v)+'</option>';
  return '<section class="v161-registry-filters" data-v161-filters>'+
    '<div class="v161-filter-head"><b>Encontrar jugadores rápido</b><span data-v161-count>'+filtered.length+' de '+list.length+' jugadores</span></div>'+
    '<div class="v161-filter-grid">'+
      '<label><span>Orden</span><select data-v161-sort>'+
        opt('newest','Más nuevos primero',registrySort)+opt('oldest','Más antiguos primero',registrySort)+opt('az','Nombre A–Z',registrySort)+opt('za','Nombre Z–A',registrySort)+
      '</select></label>'+
      '<label><span>Categoría</span><select data-v161-category>'+opt('Todas','Todas',registryCategory)+cats.map(x=>opt(x,x,registryCategory)).join('')+'</select></label>'+
      '<label><span>Equipo</span><select data-v161-team>'+opt('Todos','Todos',registryTeam)+teams.map(x=>opt(x,x,registryTeam)).join('')+'</select></label>'+
      '<label><span>Origen</span><select data-v161-source>'+opt('Todos','Todos',registrySource)+sources.map(x=>opt(x,x,registrySource)).join('')+'</select></label>'+
    '</div>'+
    '<div class="v161-letter-filter"><span>Letra inicial</span><div>'+
      '<button type="button" data-v161-letter="Todas" class="'+(registryLetter==='Todas'?'active':'')+'">Todas</button>'+
      letters.map(x=>'<button type="button" data-v161-letter="'+esc(x)+'" class="'+(registryLetter===x?'active':'')+'">'+esc(x)+'</button>').join('')+
    '</div></div>'+
  '</section>';
}
function applyRegistryFilters(root){
  if(!root)return;
  const all=seasonRecords(),filtered=filterRegistry(all),host=$('[data-v124-list]',root);
  if(host){host.innerHTML=listHtml(filtered);bindList(root)}
  const count=$('[data-v161-count]',root);if(count)count.textContent=filtered.length+' de '+all.length+' jugadores';
}

function currentSeason(){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth()+1;
  const start=m>=7?y:y-1;return start+'–'+(start+1);
}
function nextSeason(s){
  const m=String(s||'').match(/(\d{4})\D+(\d{4})/);const y=m?Number(m[1])+1:new Date().getFullYear()+1;
  return y+'–'+(y+1);
}
function store(){const x=read(KEY,{seasons:{}});if(!x.seasons)x.seasons={};return x}
function saveStore(x){write(KEY,x)}
function selectedSeason(){return localStorage.getItem(SEASON_KEY)||currentSeason()}
function setSeason(s){localStorage.setItem(SEASON_KEY,s)}

function officialPlayers(){
  const out=[],db=window.LJR_OFFICIAL_DATA||{};
  for(const [catId,c] of Object.entries(db.categories||{})){
    for(const [team,roster] of Object.entries(c.rosters||{})){
      for(const name of (Array.isArray(roster)?roster:[])){
        if(!name)continue;
        const key=norm(name)+'|'+norm(team)+'|'+catId;
        if(out.some(x=>x.key===key))continue;
        out.push({key,name:String(name).trim(),team:String(team).trim(),category:c.name||'',catId:String(catId)});
      }
    }
  }
  return out;
}
function teamInfo(name){
  const n=norm(name);if(!n)return null;
  try{
    const t=window.LJR_V100?.officialTeams?.().find(x=>norm(x.name)===n);if(t)return t;
  }catch(e){}
  const p=officialPlayers().find(x=>norm(x.team)===n);return p?{name:p.team,category:p.category,cat:p.catId}:null;
}
function officialMatch(rec){
  const list=officialPlayers();
  if(rec.curp){
    // CURP no se publica en AdminFut: nunca se compara ni se envía.
  }
  return list.find(p=>norm(p.name)===norm(rec.name)&&norm(p.team)===norm(rec.team))||
         list.find(p=>norm(p.name)===norm(rec.name));
}
function recordKey(r){return norm(r.name)+'|'+norm(r.team)}
function uid(){return 'reg-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}
function seasonRecords(season=selectedSeason()){
  const x=store();return Array.isArray(x.seasons?.[season])?x.seasons[season]:[];
}
function putSeason(season,list){
  const x=store();x.seasons[season]=list;saveStore(x);
}
function allSeasons(){
  const a=Object.keys(store().seasons||{});
  for(const s of [currentSeason(),selectedSeason()])if(s&&!a.includes(s))a.push(s);
  return a.sort((a,b)=>String(b).localeCompare(String(a)));
}
function categoryForTeam(team){return teamInfo(team)?.category||''}

function syncOfficialSeason(silent=false){
  const season=selectedSeason(),official=officialPlayers(),list=seasonRecords(season).slice(),now=new Date().toISOString();
  const byKey=new Map(list.map(r=>[recordKey(r),r]));
  let added=0,kept=0,removed=0;
  for(const p of official){
    const k=norm(p.name)+'|'+norm(p.team),old=byKey.get(k);
    if(old){
      old.category=p.category;old.catId=p.catId;old.officialPresent=true;old.officialCheckedAt=now;
      if(old.source==='official'){
        old.status='Oficial en AdminFut';
        old.registrationOrigin=old.registrationOrigin||'AdminFut';
        old.registeredBy=old.registeredBy||'AdminFut';
      }
      kept++;continue;
    }
    const rec={id:uid(),name:p.name,team:p.team,category:p.category,catId:p.catId,season,
      status:'Oficial en AdminFut',source:'official',registrationOrigin:'AdminFut',registeredBy:'AdminFut',
      officialPresent:true,officialCheckedAt:now,
      curp:'',dob:'',city:'',position:'Sin definir',createdAt:now,updatedAt:now};
    list.push(rec);byKey.set(k,rec);added++;
  }
  const officialKeys=new Set(official.map(p=>norm(p.name)+'|'+norm(p.team)));
  const cleaned=list.filter(r=>{
    if(r.source!=='official')return true;
    if(officialKeys.has(recordKey(r)))return true;
    removed++;return false;
  });
  // Registros locales no se borran automáticamente; se marcan para revisión.
  for(const r of cleaned){
    if(r.source==='official')continue;
    const hit=officialMatch(r);r.officialPresent=!!hit;r.officialCheckedAt=now;
    if(hit){r.category=hit.category;r.catId=hit.catId;if(r.status==='Pendiente de validación')r.status='Registrado · coincide con AdminFut'}
    else if(r.status==='Registrado · coincide con AdminFut')r.status='Pendiente de validación';
  }
  putSeason(season,cleaned);
  if(!silent)toast('Sincronizado: '+added+' nuevos oficiales · '+kept+' conservados · '+removed+' retirados del padrón oficial');
  return {added,kept,removed};
}

function v124AgeFromDob(v){
  if(!v)return null;
  const d=new Date(v+'T12:00:00'),n=new Date();
  if(Number.isNaN(d.getTime())||d>n)return null;
  let a=n.getFullYear()-d.getFullYear();
  const md=n.getMonth()-d.getMonth();
  if(md<0||(md===0&&n.getDate()<d.getDate()))a--;
  return a>=0&&a<120?a:null;
}
function v124VeteranMinimum(category){
  const c=norm(category);
  if(/50/.test(c)&&/veteran/.test(c))return 50;
  if(/35/.test(c)&&/veteran/.test(c))return 35;
  return 0;
}
function v124EligibleCategories(age){
  if(age===null)return ['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
  const list=['Primera Fuerza','Intermedia','Segunda Fuerza'];
  if(age>=35)list.push('Veteranos 35+');
  if(age>=50)list.push('Veteranos 50+');
  return list;
}
function v124Eligibility(data=captureForm()){
  const min=v124VeteranMinimum(data.category),age=v124AgeFromDob(data.dob);
  if(!min)return {ok:true,min:0,age};
  if(age===null)return {ok:false,min,age:null,message:'No se puede registrar en '+data.category+' hasta detectar o capturar una fecha de nacimiento válida.'};
  if(age<min)return {ok:false,min,age,message:'No elegible para '+data.category+': tiene '+age+' años y se requieren '+min+' años cumplidos como mínimo.'};
  return {ok:true,min,age,message:'Edad válida para '+data.category+': '+age+' años.'};
}
function v124EligibilityHtml(){
  const e=v124Eligibility(),eligible=v124EligibleCategories(e.age);
  if(e.age===null){
    return '<div class="v124-eligibility neutral" data-v124-eligibility><b>Edad por detectar</b><span>Cuando se detecte la fecha de nacimiento se mostrarán sólo las categorías en las que puede jugar.</span></div>';
  }
  const cls=e.ok?'ok':'blocked',title=e.ok?'✓ Elegible · '+e.age+' años':'✕ No elegible · '+e.age+' años';
  return '<div class="v124-eligibility '+cls+'" data-v124-eligibility><b>'+title+'</b><span>'+(e.ok?'Puede registrarse en: ':esc(e.message||'')+' · Elegibles: ')+esc(eligible.join(' · '))+'</span></div>';
}
function renderEligibility(){
  if(route()!=='credentialBuilder')return;
  let box=$('[data-v124-eligibility]');
  const auto=$('.v64-auto-category'),extra=$('#v100-credential-extra');
  if(!box){
    const host=auto||extra;
    if(!host)return;
    host.insertAdjacentHTML('afterend',v124EligibilityHtml());
    box=$('[data-v124-eligibility]');
  }else box.outerHTML=v124EligibilityHtml();

  const e=v124Eligibility();
  const save=$('[data-v124-save]');
  if(save){save.disabled=!e.ok;save.setAttribute('aria-disabled',String(!e.ok))}
  ['[data-v100-credential-png]','[data-v100-credential-pdf]','[data-v100-credential-share]','[data-v64-download-credential-png]','[data-v64-print-credential]'].forEach(sel=>{
    const b=$(sel);if(!b)return;b.disabled=!e.ok;b.setAttribute('aria-disabled',String(!e.ok));
  });
}
function bindEligibility(){
  const sels=['[data-v64-cred-team]','[data-v64-cred-cat]','[data-v64-cred-curp]','[data-v100-dob]','[data-v100-age]'];
  for(const sel of sels){
    const el=$(sel);if(!el||el.dataset.v124EligibilityBound)continue;
    el.dataset.v124EligibilityBound='1';
    el.addEventListener('input',renderEligibility);
    el.addEventListener('change',renderEligibility);
  }
  renderEligibility();
}

function captureForm(){
  const team=$('[data-v64-cred-team]')?.value||'',info=teamInfo(team);
  return {
    name:$('[data-v64-cred-name]')?.value.trim()||'',
    curp:($('[data-v64-cred-curp]')?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18),
    team,
    category:info?.category||$('[data-v64-cred-cat]')?.value||'',
    catId:String(info?.cat||''),
    dob:$('[data-v100-dob]')?.value||'',
    city:$('[data-v100-city]')?.value.trim()||'',
    position:$('[data-v100-position]')?.value||'Sin definir',
    status:$('[data-v100-status]')?.value||'Pendiente de validación',
    season:selectedSeason()
  };
}
function setValue(sel,val,event=true){
  const el=$(sel);if(!el)return;el.value=val??'';
  if(event){el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}
}
function loadRecord(rec){
  localStorage.setItem(EDIT_KEY,rec.id);
  setValue('[data-v64-cred-name]',rec.name);
  setValue('[data-v64-cred-curp]',rec.curp||'');
  setValue('[data-v64-cred-team]',rec.team);
  setValue('[data-v64-cred-cat]',rec.category||categoryForTeam(rec.team));
  setValue('[data-v100-dob]',rec.dob||'');
  setValue('[data-v100-city]',rec.city||'');
  setValue('[data-v100-position]',rec.position||'Sin definir');
  setValue('[data-v100-status]',rec.status&&rec.status!=='Oficial en AdminFut'?rec.status:'Revisado');
  try{window.v64SyncCredentialTeamCategory?.()}catch(e){}
  document.querySelector('.v64-page')?.scrollIntoView({behavior:'smooth',block:'start'});
  toast('Registro cargado para revisar o generar credencial');
  schedule();
}
function clearForm(){
  localStorage.removeItem(EDIT_KEY);
  for(const sel of ['[data-v64-cred-name]','[data-v64-cred-curp]','[data-v100-dob]','[data-v100-age]','[data-v100-city]'])setValue(sel,'');
  setValue('[data-v64-cred-team]','');
  setValue('[data-v100-position]','Sin definir');
  setValue('[data-v100-status]','Pendiente de validación');
  const txt=$('[data-v64-ocr-text]');if(txt)txt.value='';
  const doc=$('[data-v64-doc]'),photo=$('[data-v64-photo]');
  if(doc)doc.value='';if(photo)photo.value='';
  const docPreview=$('[data-v64-doc-preview]');if(docPreview)docPreview.innerHTML='<span>Vista previa del documento</span>';
  const playerPreview=$('[data-v64-player-mini-preview]');if(playerPreview)playerPreview.innerHTML='<span>Vista previa de la foto</span>';
  toast('Formulario listo para un jugador nuevo');
  document.querySelector('.v64-page')?.scrollIntoView({behavior:'smooth',block:'start'});
  schedule();
}
function saveForm(silent=false){
  const data=captureForm();
  if(!data.name)return toast('Falta el nombre del jugador');
  if(!data.team)return toast('Selecciona el equipo; la categoría se asigna sola');
  if(!data.category)return toast('No se encontró la categoría oficial de ese equipo');
  const eligibility=v124Eligibility(data);
  if(!eligibility.ok){renderEligibility();return toast(eligibility.message)}
  const season=data.season,list=seasonRecords(season).slice(),editId=localStorage.getItem(EDIT_KEY);
  let idx=editId?list.findIndex(r=>r.id===editId):-1;
  if(idx<0&&data.curp)idx=list.findIndex(r=>r.curp&&r.curp===data.curp);
  if(idx<0)idx=list.findIndex(r=>recordKey(r)===norm(data.name)+'|'+norm(data.team));
  const now=new Date().toISOString(),hit=officialMatch(data);
  const source=idx>=0?list[idx].source:'local',registrar=currentRegistrarName();
  const prior=idx>=0?list[idx]:null;
  const rec={...(prior||{}),...data,id:prior?prior.id:uid(),source,
    registrationOrigin:prior?.registrationOrigin||(source==='official'?'AdminFut':'Registro en la app'),
    registeredBy:prior?.registeredBy||(source==='official'?'AdminFut':registrar),
    officialPresent:!!hit,officialCheckedAt:now,createdAt:prior?.createdAt||now,updatedAt:now};
  if(hit){
    rec.category=hit.category;rec.catId=hit.catId;
    if(source==='official')rec.status='Oficial en AdminFut';
    else if(rec.status==='Pendiente de validación')rec.status='Registrado · coincide con AdminFut';
  }
  if(idx>=0)list[idx]=rec;else list.unshift(rec);
  putSeason(season,list);localStorage.setItem(EDIT_KEY,rec.id);
  if(!silent)toast(idx>=0?'Registro actualizado':'Jugador guardado en la temporada '+season);
  renderManager();
}
function deleteRecord(id){
  const season=selectedSeason(),list=seasonRecords(season),rec=list.find(r=>r.id===id);if(!rec)return;
  if(!confirm('¿Borrar el registro de '+rec.name+' de '+season+'?'))return;
  putSeason(season,list.filter(r=>r.id!==id));
  if(localStorage.getItem(EDIT_KEY)===id)localStorage.removeItem(EDIT_KEY);
  toast('Registro borrado');renderManager();
}
function newSeason(){
  const base=selectedSeason(),next=nextSeason(base);
  const x=store();if(!x.seasons[next])x.seasons[next]=[];saveStore(x);setSeason(next);localStorage.removeItem(EDIT_KEY);
  selectedIds.clear();quickSeason='';toast('Temporada '+next+' creada. Usa “Renovar temporada” para traer el padrón anterior en un toque.');renderManager();
}

function seasonStart(s){
  const m=String(s||'').match(/(\d{4})/);return m?Number(m[1]):0;
}
function previousSeasonWithRecords(){
  const current=selectedSeason(),cur=seasonStart(current);
  return allSeasons()
    .filter(s=>s!==current&&seasonStart(s)<cur&&seasonRecords(s).length)
    .sort((a,b)=>seasonStart(b)-seasonStart(a))[0]||'';
}
function registryTeams(){
  const out=[];
  try{
    const list=window.LJR_V100?.officialTeams?.();
    if(Array.isArray(list))list.forEach(x=>out.push({name:x.name,category:x.category||'',cat:String(x.cat||'')}));
  }catch(e){}
  if(!out.length){
    const seen=new Set();
    for(const p of officialPlayers()){
      const k=norm(p.team)+'|'+p.catId;if(seen.has(k))continue;seen.add(k);
      out.push({name:p.team,category:p.category||'',cat:String(p.catId||'')});
    }
  }
  const seen=new Set();
  return out.filter(x=>{
    if(!x?.name)return false;
    const k=norm(x.name)+'|'+String(x.cat||'');
    if(seen.has(k))return false;seen.add(k);return true;
  }).sort((a,b)=>(a.category||'').localeCompare(b.category||'','es')||a.name.localeCompare(b.name,'es'));
}
function teamPickerOptions(){
  const groups=new Map();
  for(const t of registryTeams()){
    const cat=t.category||'Sin categoría';
    if(!groups.has(cat))groups.set(cat,[]);
    groups.get(cat).push(t);
  }
  let html='<option value="">Elige equipo destino</option>';
  for(const [cat,teams] of groups){
    html+='<optgroup label="'+esc(cat)+'">'+teams.map(t=>'<option value="'+esc(t.name)+'" '+(quickTeam===t.name?'selected':'')+'>'+esc(t.name)+'</option>').join('')+'</optgroup>';
  }
  return html;
}
function targetSeasonOptions(){
  const current=selectedSeason(),set=new Set(allSeasons());
  set.add(nextSeason(current));
  return [...set].sort((a,b)=>seasonStart(b)-seasonStart(a)).map(s=>'<option value="'+esc(s)+'" '+((quickSeason||nextSeason(current))===s?'selected':'')+'>'+esc(s)+(s===current?' · actual':'')+'</option>').join('');
}
function duplicateIndex(list,rec,ignoreId=''){
  if(rec.curp){
    const c=String(rec.curp).toUpperCase();
    const i=list.findIndex(x=>x.id!==ignoreId&&x.curp&&String(x.curp).toUpperCase()===c);
    if(i>=0)return i;
  }
  return list.findIndex(x=>x.id!==ignoreId&&norm(x.name)===norm(rec.name)&&norm(x.team)===norm(rec.team));
}
function renewFromPrevious(){
  const from=previousSeasonWithRecords(),to=selectedSeason();
  if(!from)return toast('No hay una temporada anterior con registros guardados');
  const source=seasonRecords(from),target=seasonRecords(to).slice();
  if(!source.length)return toast('La temporada anterior no tiene jugadores guardados');
  if(!confirm('¿Traer a '+to+' los jugadores de '+from+'? Se copiarán como pendientes de confirmación.'))return;
  const now=new Date().toISOString();let added=0,skipped=0;
  for(const r of source){
    const copy={...r,id:uid(),season:to,source:'local',registrationOrigin:'Renovación',registeredBy:currentRegistrarName(),officialPresent:false,
      status:'Renovación · por confirmar',previousTeam:r.team||'',createdAt:now,updatedAt:now};
    if(duplicateIndex(target,copy)>=0){skipped++;continue}
    target.push(copy);added++;
  }
  putSeason(to,target);selectedIds.clear();
  toast('Renovación rápida: '+added+' jugadores copiados'+(skipped?' · '+skipped+' ya existían':''));
  renderManager(true);
}
function moveSelectedTeam(){
  const ids=new Set(selectedIds);
  if(!ids.size)return toast('Selecciona uno o más jugadores');
  if(!quickTeam)return toast('Elige el equipo destino');
  const info=teamInfo(quickTeam);
  if(!info)return toast('No se encontró la categoría oficial del equipo destino');
  const season=selectedSeason(),list=seasonRecords(season).slice(),now=new Date().toISOString();
  let moved=0,blocked=0,duplicates=0;
  for(let i=0;i<list.length;i++){
    const r=list[i];if(!ids.has(r.id))continue;
    const min=v124VeteranMinimum(info.category),age=v124AgeFromDob(r.dob);
    if(min&&(age===null||age<min)){blocked++;continue}
    const proposed={...r,team:quickTeam,category:info.category||'',catId:String(info.cat||''),season};
    if(duplicateIndex(list,proposed,r.id)>=0){duplicates++;continue}
    list[i]={...r,previousTeam:r.team||'',team:quickTeam,category:info.category||'',catId:String(info.cat||''),
      source:'local',officialPresent:false,status:'Cambio de equipo · por confirmar',updatedAt:now};
    moved++;
  }
  putSeason(season,list);selectedIds.clear();
  toast('Cambio rápido: '+moved+' movidos'+(blocked?' · '+blocked+' bloqueados por edad/datos':'')+(duplicates?' · '+duplicates+' duplicados omitidos':''));
  renderManager(true);
}
function copySelectedToSeason(){
  const ids=new Set(selectedIds);
  if(!ids.size)return toast('Selecciona uno o más jugadores');
  const from=selectedSeason(),to=quickSeason||nextSeason(from);
  if(to===from)return toast('Elige otra temporada como destino');
  const source=seasonRecords(from).filter(r=>ids.has(r.id)),target=seasonRecords(to).slice(),now=new Date().toISOString();
  let added=0,skipped=0;
  for(const r of source){
    const copy={...r,id:uid(),season:to,source:'local',officialPresent:false,
      status:'Renovación · por confirmar',previousTeam:r.team||'',createdAt:now,updatedAt:now};
    if(duplicateIndex(target,copy)>=0){skipped++;continue}
    target.push(copy);added++;
  }
  const x=store();if(!x.seasons[to])x.seasons[to]=[];x.seasons[to]=target;saveStore(x);
  selectedIds.clear();
  toast('Copiados a '+to+': '+added+(skipped?' · '+skipped+' ya existían':''));
  renderManager(true);
}
function removeSelectedRecords(){
  const ids=new Set(selectedIds);
  if(!ids.size)return toast('Selecciona uno o más jugadores');
  const season=selectedSeason(),list=seasonRecords(season),picked=list.filter(r=>ids.has(r.id));
  if(!confirm('¿Dar de baja '+picked.length+' jugador(es) de '+season+'? Solo se quitan de esta temporada.'))return;
  putSeason(season,list.filter(r=>!ids.has(r.id)));
  if(ids.has(localStorage.getItem(EDIT_KEY)))localStorage.removeItem(EDIT_KEY);
  selectedIds.clear();toast(picked.length+' jugador(es) dados de baja de '+season);renderManager();
}

function v126LoadScript(src,key){
  if(key&&window[key])return Promise.resolve(window[key]);
  const existing=[...document.scripts].find(s=>s.src===src);
  if(existing)return new Promise((resolve,reject)=>{
    if(key&&window[key])return resolve(window[key]);
    existing.addEventListener('load',()=>resolve(key?window[key]:true),{once:true});
    existing.addEventListener('error',reject,{once:true});
  });
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');s.src=src;s.async=true;
    s.onload=()=>resolve(key?window[key]:true);s.onerror=reject;document.head.appendChild(s);
  });
}
async function v126Tesseract(){
  if(window.Tesseract)return window.Tesseract;
  return v126LoadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js','Tesseract');
}
async function v126PdfJs(){
  if(window.pdfjsLib)return window.pdfjsLib;
  const pdfjs=await v126LoadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','pdfjsLib');
  pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  return pdfjs;
}
async function v126Mammoth(){
  if(window.mammoth)return window.mammoth;
  return v126LoadScript('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js','mammoth');
}
function v126SetImportStatus(msg){
  rosterImport.status=String(msg||'');
  const el=$('[data-v126-import-status]');if(el)el.textContent=rosterImport.status;
}
async function v157Bitmap(source){
  if(source instanceof HTMLCanvasElement)return source;
  if(typeof createImageBitmap==='function'){
    try{return await createImageBitmap(source)}catch(e){}
  }
  return new Promise((resolve,reject)=>{
    const img=new Image(),url=URL.createObjectURL(source);
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=e=>{URL.revokeObjectURL(url);reject(e)};
    img.src=url;
  });
}
function v177OtsuThreshold(hist,total){
  let sum=0;for(let i=0;i<256;i++)sum+=i*hist[i];
  let sumB=0,wB=0,best=0,max=-1;
  for(let i=0;i<256;i++){
    wB+=hist[i];if(!wB)continue;
    const wF=total-wB;if(!wF)break;
    sumB+=i*hist[i];
    const mB=sumB/wB,mF=(sum-sumB)/wF,d=mB-mF,between=wB*wF*d*d;
    if(between>max){max=between;best=i}
  }
  return best||170;
}
async function v177NativeText(source){
  if(typeof window.TextDetector!=='function')return '';
  try{
    const bmp=await v157Bitmap(source),detector=new window.TextDetector(),blocks=await detector.detect(bmp);
    return (blocks||[]).map(b=>String(b.rawValue||'').trim()).filter(Boolean).join('\n');
  }catch(_){return ''}
}
async function v177CropSource(source,x0,y0,w0,h0){
  const bmp=await v157Bitmap(source);
  const sw=bmp.width||bmp.videoWidth||bmp.naturalWidth||1,sh=bmp.height||bmp.videoHeight||bmp.naturalHeight||1;
  const sx=Math.max(0,Math.floor(sw*x0)),sy=Math.max(0,Math.floor(sh*y0));
  const cw=Math.max(1,Math.min(sw-sx,Math.floor(sw*w0))),ch=Math.max(1,Math.min(sh-sy,Math.floor(sh*h0)));
  /* V181 — no escalar por ancho solamente: en una hoja vertical eso disparaba
     la altura a miles de píxeles y agotaba memoria en Chrome Android. */
  const maxPixels=3200000,maxHeight=3000;
  const scale=Math.max(.75,Math.min(
    2.0,
    1850/Math.max(1,cw),
    maxHeight/Math.max(1,ch),
    Math.sqrt(maxPixels/Math.max(1,cw*ch))
  ));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(cw*scale));
  canvas.height=Math.max(1,Math.round(ch*scale));
  const ctx=canvas.getContext('2d',{alpha:false});
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(bmp,sx,sy,cw,ch,0,0,canvas.width,canvas.height);
  return canvas;
}
async function v157PreparedCanvas(source,mode='contrast'){
  const bmp=await v157Bitmap(source);
  const sw=bmp.width||bmp.videoWidth||bmp.naturalWidth||1;
  const sh=bmp.height||bmp.videoHeight||bmp.naturalHeight||1;
  /* V162: conserva más detalle de trazos finos de lápiz/pluma sin explotar memoria. */
  /* V181 — límite de memoria móvil.
     Una columna angosta y alta se estaba ampliando dos veces y podía terminar
     con canvases gigantes, por eso parecía quedarse congelada en “pasada 2”. */
  const fromCanvas=source instanceof HTMLCanvasElement;
  const target=mode==='pencil'||mode==='handwriting'?2100:1850;
  const maxDim=fromCanvas?3000:3400;
  const maxPixels=fromCanvas?3200000:4200000;
  const byWidth=target/Math.max(1,sw);
  const byHeight=maxDim/Math.max(1,sh);
  const byPixels=Math.sqrt(maxPixels/Math.max(1,sw*sh));
  const maxUpscale=fromCanvas?1.12:2.05;
  const scale=Math.max(.72,Math.min(maxUpscale,byWidth,byHeight,byPixels));
  const w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d',{willReadFrequently:true,alpha:false});
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(bmp,0,0,w,h);

  const img=ctx.getImageData(0,0,w,h),d=img.data;
  /* Histograma para adaptar el realce a papel blanco, foto sombreada o lápiz tenue. */
  const hist=new Uint32Array(256);
  for(let i=0;i<d.length;i+=4){
    const g=Math.max(0,Math.min(255,Math.round(.299*d[i]+.587*d[i+1]+.114*d[i+2])));
    hist[g]++;
  }
  const total=Math.max(1,w*h);
  const percentile=p=>{
    const targetCount=total*p;let acc=0;
    for(let i=0;i<256;i++){acc+=hist[i];if(acc>=targetCount)return i}
    return 255;
  };
  const lo=percentile(.03),hi=Math.max(lo+30,percentile(.97)),otsu=v177OtsuThreshold(hist,total);

  for(let i=0;i<d.length;i+=4){
    let g=.299*d[i]+.587*d[i+1]+.114*d[i+2];
    if(mode==='threshold'){
      g=g>174?255:(g<92?0:Math.max(0,Math.min(255,(g-92)*3.1)));
    }else if(mode==='otsu'){
      g=g<otsu?0:255;
    }else if(mode==='soft'){
      g=Math.max(0,Math.min(255,(g-lo)*255/(hi-lo)));
      g=Math.max(0,Math.min(255,(g-128)*1.28+128));
    }else if(mode==='pencil'){
      /* Normaliza el papel y multiplica la "tinta" para rescatar grafito tenue. */
      g=Math.max(0,Math.min(255,(g-lo)*255/(hi-lo)));
      const ink=255-g;
      g=255-Math.min(255,ink*3.05);
      if(g>238)g=255;
      else if(g<118)g=0;
      else g=Math.max(0,Math.min(255,(g-118)*1.35));
    }else if(mode==='handwriting'){
      /* Binarización más suave para letras unidas/cursivas escritas con pluma. */
      g=Math.max(0,Math.min(255,(g-lo)*255/(hi-lo)));
      const ink=255-g;
      g=ink<14?255:(ink>82?0:255-Math.min(245,ink*2.45));
    }else{
      g=Math.max(0,Math.min(255,(g-128)*1.58+128));
    }
    d[i]=d[i+1]=d[i+2]=g;
  }
  ctx.putImageData(img,0,0);
  return canvas;
}
function v157OcrTextQuality(text){
  let score=0;
  for(const line of String(text||'').split(/\r?\n/)){
    const letters=(line.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g)||[]).length;
    const digits=(line.match(/\d/g)||[]).length;
    if(letters>=4)score+=Math.min(24,letters);
    if(letters>=8&&digits<=5)score+=12;
    if(letters>=12&&/\s/.test(line))score+=8;
  }
  return score;
}
function v162MergeOcrTexts(parts){
  const lines=[],seen=[];
  for(const part of parts){
    for(let line of String(part?.text||'').split(/\r?\n/)){
      line=line.replace(/[|¦]+/g,' ').replace(/\s+/g,' ').trim();
      if(!line)continue;
      const n=norm(line);
      if(!n||seen.some(x=>x===n||v124TokenSim(x,n)>.94))continue;
      seen.push(n);lines.push(line);
    }
  }
  return lines.join('\n');
}
async function v157Recognize(source,label,pass,mode,psm,totalPasses){
  const T=await v126Tesseract(),canvas=await v157PreparedCanvas(source,mode);
  const handwritten=mode==='pencil'||mode==='handwriting';
  const nameColumn=/columna\s+jugador/i.test(String(label||''));
  const options={
    tessedit_pageseg_mode:String(psm||6),
    preserve_interword_spaces:'1',
    user_defined_dpi:'300',
    logger:m=>{
      if(m?.status==='recognizing text'){
        const pct=Math.round((m.progress||0)*100);
        v126SetImportStatus((handwritten?'Pluma/lápiz':'OCR impreso')+' · '+label+' · pasada '+pass+'/'+totalPasses+' · '+pct+'%');
      }else if(m?.status){
        v126SetImportStatus('Preparando '+(handwritten?'lectura de escritura manual':'OCR')+' · '+label+'…');
      }
    }
  };
  if(nameColumn){
    options.tessedit_char_whitelist=" ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑabcdefghijklmnopqrstuvwxyzáéíóúüñ'-";
  }
  const result=await T.recognize(canvas,'spa',options);
  return {text:result?.data?.text||'',mode,confidence:Number(result?.data?.confidence||0)};
}
function v178MergeSweepTexts(parts){
  const lines=[],seen=[];
  for(const part of parts){
    for(let line of String(part?.text||'').split(/\r?\n/)){
      line=line.replace(/[|¦]+/g,' ').replace(/\s+/g,' ').trim();
      if(!line)continue;
      const n=norm(line);
      if(!n)continue;
      /* Sólo elimina duplicados casi idénticos causados por el traslape entre
         franjas. Mantiene nombres distintos aunque compartan apellidos. */
      if(seen.some(x=>x===n||v124TokenSim(x,n)>.975))continue;
      seen.push(n);lines.push(line);
    }
  }
  return lines.join('\n');
}
async function v178TopToBottomSweep(source,label,startPass,totalPasses){
  const bands=[
    [0.00,.18],[0.10,.18],[0.20,.18],[0.30,.18],[0.40,.18],
    [0.50,.18],[0.60,.18],[0.70,.18],[0.80,.18],[0.88,.12]
  ];
  const reads=[];let pass=startPass;
  for(let i=0;i<bands.length;i++){
    pass++;
    const [y,h]=bands[i],crop=await v177CropSource(source,0,y,.999,h);
    v126SetImportStatus('OCR Pro · barrido arriba → abajo '+(i+1)+'/'+bands.length+' · buscando nombres completos');
    /* PSM 6 conserva cada franja como bloque de filas. Alternar contraste suave
       rescata letras finas sin perder apellidos. */
    reads.push(await v157Recognize(crop,label+' · franja '+(i+1),pass,i%3===1?'soft':'contrast',6,totalPasses));
  }
  return {text:v178MergeSweepTexts(reads),pass};
}

async function v179DetectImageKind(source){
  try{
    const bmp=await v157Bitmap(source);
    const sw=bmp.width||bmp.videoWidth||bmp.naturalWidth||1,sh=bmp.height||bmp.videoHeight||bmp.naturalHeight||1;
    const scale=Math.min(1,720/sw),w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{willReadFrequently:true,alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(bmp,0,0,w,h);
    const d=ctx.getImageData(0,0,w,h).data,rowInk=new Uint32Array(h);
    let dark=0,mid=0,total=w*h;
    for(let y=0;y<h;y++){
      let ri=0;
      for(let x=0;x<w;x++){
        const i=(y*w+x)*4,g=.299*d[i]+.587*d[i+1]+.114*d[i+2];
        if(g<150){dark++;ri++} else if(g<215)mid++;
      }
      rowInk[y]=ri;
    }
    const activeThreshold=Math.max(3,Math.round(w*.018));
    const bands=[];let start=-1;
    for(let y=0;y<h;y++){
      const on=rowInk[y]>=activeThreshold;
      if(on&&start<0)start=y;
      if((!on||y===h-1)&&start>=0){
        const end=on&&y===h-1?y:y-1,hh=end-start+1;
        if(hh>=2)bands.push(hh);
        start=-1;
      }
    }
    const usable=bands.filter(x=>x>=2&&x<=Math.max(40,h*.08));
    const mean=usable.length?usable.reduce((a,b)=>a+b,0)/usable.length:0;
    const variance=usable.length?usable.reduce((a,b)=>a+(b-mean)*(b-mean),0)/usable.length:0;
    const cv=mean?Math.sqrt(variance)/mean:9;
    const darkRatio=dark/Math.max(1,total),midRatio=mid/Math.max(1,total);
    let kind='mixed',label='Mixto / formato no identificado';
    if(usable.length>=8&&cv<.85&&darkRatio<.30){kind='printed';label='Texto impreso / Word / Arial o similar'}
    else if(usable.length<=7||cv>1.05||midRatio>darkRatio*2.5){kind='handwriting';label='Pluma / lápiz / escritura manual'}
    return {kind,label,confidence:Math.round(Math.max(55,Math.min(95,(kind==='printed'?(1-Math.min(1,cv))*55+40:(Math.min(1,cv)*40+45)))))};
  }catch(_){
    return {kind:'mixed',label:'Mixto / automático',confidence:50};
  }
}

async function v180DetectPrintedTable(source){
  try{
    const bmp=await v157Bitmap(source);
    const sw=bmp.width||bmp.videoWidth||bmp.naturalWidth||1,sh=bmp.height||bmp.videoHeight||bmp.naturalHeight||1;
    const scale=Math.min(1,900/sw),w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{willReadFrequently:true,alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(bmp,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h).data;
    const gray=(x,y)=>{const i=(y*w+x)*4;return .299*data[i]+.587*data[i+1]+.114*data[i+2]};

    /* Líneas verticales continuas: una tabla real las conserva cientos de píxeles;
       letras/números no. Esto evita confundir columnas por alineación de texto. */
    const y0=Math.floor(h*.10),y1=Math.max(y0+1,Math.floor(h*.995)),roiH=y1-y0;
    const rawX=[];
    for(let x=0;x<w;x++){
      let run=0,maxRun=0;
      for(let y=y0;y<y1;y++){
        if(gray(x,y)<178){run++;if(run>maxRun)maxRun=run}else run=0;
      }
      if(maxRun>=roiH*.62)rawX.push(x);
    }
    const xGroups=[];
    for(const x of rawX){
      if(!xGroups.length||x-xGroups[xGroups.length-1][xGroups[xGroups.length-1].length-1]>Math.max(2,Math.round(w*.012)))xGroups.push([x]);
      else xGroups[xGroups.length-1].push(x);
    }
    const xs=xGroups.map(g=>Math.round(g.reduce((a,b)=>a+b,0)/g.length)).sort((a,b)=>a-b);
    if(xs.length<4)return null;

    let best=null;
    for(let i=0;i<xs.length-1;i++){
      const left=xs[i],right=xs[i+1],gap=right-left;
      if(gap<w*.20||gap>w*.72)continue;
      if(!best||gap>best.gap)best={left,right,gap};
    }
    if(!best)return null;

    /* Estimación de filas a partir de líneas horizontales largas.
       En tablas como NO | Jugador | Equipo | G.Total, grupos-2 ≈ jugadores. */
    const rawY=[];
    for(let y=0;y<h;y++){
      let run=0,maxRun=0;
      for(let x=0;x<w;x++){
        if(gray(x,y)<178){run++;if(run>maxRun)maxRun=run}else run=0;
      }
      if(maxRun>=w*.54)rawY.push(y);
    }
    const yGroups=[];
    for(const y of rawY){
      if(!yGroups.length||y-yGroups[yGroups.length-1][yGroups[yGroups.length-1].length-1]>Math.max(2,Math.round(h*.006)))yGroups.push([y]);
      else yGroups[yGroups.length-1].push(y);
    }
    let rows=Math.max(0,yGroups.length-2);
    if(rows<5||rows>80)rows=0;

    const inset=Math.max(2,Math.round(w*.006));
    const x0=Math.max(0,(best.left+inset)/w),x1=Math.min(1,(best.right-inset)/w);
    if(x1-x0<.18)return null;
    return {x0,width:x1-x0,rows,columns:xs.length};
  }catch(_){return null}
}
function v180NameColumnLines(text){
  const out=[],known=v126KnownPeople();
  for(let line of String(text||'').split(/\r?\n/)){
    line=line.replace(/[|¦]+/g,' ').replace(/\s+/g,' ').trim();
    if(!line)continue;
    line=line.replace(/^\s*(?:NO\.?\s*)?[#Nº°]?\s*\d{1,3}\s*[.)\-:]?\s*/i,'').trim();
    if(!line)continue;
    const n=norm(line);
    if(!n||/^(jugador|nombre|nombres|equipo|g total|total)$/.test(n))continue;

    let clean=v182RepairLexiconName(line);
    const repaired=v182KnownNameRepair(clean,known);
    let candidate=repaired?.name||'';
    if(!candidate)candidate=v178PlausibleFullName(clean);
    if(!candidate){
      const best=v157BestNameWindow(clean);
      if(best.name&&best.score>=.34)candidate=best.name;
    }
    candidate=v182RepairLexiconName(candidate);
    if(!candidate||v126LooksLikeNonPlayerName(candidate))continue;
    const key=norm(candidate);
    if(!out.some(x=>{
      const xn=norm(x),sim=v124TokenSim(xn,key);
      const a=xn.split(' ').filter(w=>w.length>=3),b=key.split(' ').filter(w=>w.length>=3);
      const shared=a.filter(w=>b.includes(w)).length;
      return xn===key||sim>.94||(sim>.88&&shared>=2);
    }))out.push(candidate);
  }
  return out;
}
function v180NameQuality(name){
  const clean=v157CleanNameText(name),tokens=clean.split(/\s+/).filter(Boolean),up=tokens.map(v157Upper);
  let q=v157MexNameScore(clean)*3;
  q+=up.filter(t=>V157_MX_GIVEN.has(t)).length*.35;
  q+=up.filter(t=>V157_MX_SURNAME.has(t)).length*.28;
  q-=up.filter(t=>t.length<=1).length*1.4;
  q-=up.filter(t=>/^[BCDFGHJKLMNPQRSTVWXYZ]{4,}$/.test(t)).length*.6;
  return q;
}
function v182NameSetQuality(names,target=0){
  const list=Array.isArray(names)?names:[];
  if(!list.length)return {avg:0,bad:99,coverage:0,good:false};
  const qs=list.map(v180NameQuality),avg=qs.reduce((a,b)=>a+b,0)/qs.length,bad=qs.filter(x=>x<1.25).length;
  const coverage=target?list.length/Math.max(1,target):1;
  const countGood=target?list.length>=Math.max(6,Math.floor(target*.88)):list.length>=14;
  const good=countGood&&avg>=2.05&&bad<=Math.max(1,Math.floor(list.length*.12));
  return {avg,bad,coverage,good};
}
function v180BestNameColumnText(parts,target=0){
  const known=v126KnownPeople();
  const choices=(parts||[]).map(p=>{
    let names=v180NameColumnLines(p?.text||'');
    names=names.map(n=>v182KnownNameRepair(n,known)?.name||v182RepairLexiconName(n)).filter(Boolean);
    const quality=v182NameSetQuality(names,target);
    let score=names.reduce((s,n)=>s+v180NameQuality(n),0);
    if(target)score-=Math.abs(names.length-target)*3.8;
    score+=(Number(p?.confidence||0)/100)*1.5;
    score-=quality.bad*1.4;
    return {names,score,confidence:Number(p?.confidence||0),quality};
  }).filter(x=>x.names.length);
  if(!choices.length)return '';
  choices.sort((a,b)=>b.score-a.score);
  let best={...choices[0],names:[...choices[0].names]};

  for(const peer of choices.slice(1,4)){
    if(Math.abs(peer.names.length-best.names.length)>1)continue;
    const limit=Math.min(best.names.length,peer.names.length);
    for(let i=0;i<limit;i++){
      const a=best.names[i],b=peer.names[i],sim=v124TokenSim(norm(a),norm(b));
      if(sim>=.50){
        const ra=v182KnownNameRepair(a,known),rb=v182KnownNameRepair(b,known);
        if(rb&&!ra){best.names[i]=rb.name;continue}
        if(ra&&!rb){best.names[i]=ra.name;continue}
        const qa=v180NameQuality(a),qb=v180NameQuality(b);
        if(qb>qa+.10)best.names[i]=b;
      }
    }
  }

  const dedup=[];
  for(const n0 of best.names){
    const n=v182KnownNameRepair(n0,known)?.name||v182RepairLexiconName(n0);
    if(!n)continue;
    const nn=norm(n),tokens=nn.split(' ').filter(w=>w.length>=3);
    if(dedup.some(x=>{
      const xn=norm(x),sim=v124TokenSim(xn,nn),xt=xn.split(' ').filter(w=>w.length>=3);
      const shared=tokens.filter(w=>xt.includes(w)).length;
      return xn===nn||sim>.94||(sim>.89&&shared>=2);
    }))continue;
    dedup.push(n);
  }
  if(target&&dedup.length>target)dedup.length=target;
  return dedup.join('\n');
}
async function v180ReadPrintedNameColumn(source,label,layout){
  const xPad=Math.min(.01,layout.width*.02);
  const crop=await v177CropSource(source,layout.x0+xPad,.10,Math.max(.05,layout.width-xPad*2),.895);
  const target=layout.rows||0,parts=[];

  /* V182: si Android/Chrome ofrece TextDetector, úsalo como segunda opinión
     gratuita antes de gastar otra pasada Tesseract. */
  const nativeText=await v177NativeText(crop);
  if(nativeText)parts.push({text:nativeText,mode:'native-column',confidence:94});

  v126SetImportStatus('OCR Preciso · columna “Jugador” · lectura principal');
  const first=await v157Recognize(crop,label+' · columna Jugador',1,'contrast',6,3);
  parts.push(first);

  let bestText=v180BestNameColumnText(parts,target),bestNames=v180NameColumnLines(bestText),quality=v182NameSetQuality(bestNames,target);
  if(quality.good){
    v126SetImportStatus('OCR Preciso · '+bestNames.length+(target?' de ~'+target:'')+' nombres · calidad alta · revisión manual');
    return bestText;
  }

  /* Si la cantidad parece correcta pero hay nombres deformados, no nos detenemos:
     hacemos una segunda lectura con contraste suave y elegimos por consenso. */
  v126SetImportStatus('OCR Preciso · corrigiendo nombres dudosos · lectura 2/3');
  parts.push(await v157Recognize(crop,label+' · columna Jugador · verificación',2,'soft',6,3));
  await new Promise(resolve=>setTimeout(resolve,18));
  bestText=v180BestNameColumnText(parts,target);bestNames=v180NameColumnLines(bestText);quality=v182NameSetQuality(bestNames,target);
  if(quality.good){
    v126SetImportStatus('OCR Preciso · '+bestNames.length+(target?' de ~'+target:'')+' nombres · consenso verificado · revisión manual');
    return bestText;
  }

  /* Último rescate: dos mitades pequeñas. Evita el canvas gigante que antes
     congelaba Chrome Android y recupera apellidos o renglones tenues. */
  const halves=[['parte superior',0,.56],['parte inferior',.44,.56]];
  for(let i=0;i<halves.length;i++){
    const [name,y,h]=halves[i],half=await v177CropSource(crop,0,y,.999,h);
    v126SetImportStatus('OCR Preciso · '+name+' · rescate '+(i+1)+'/2');
    parts.push(await v157Recognize(half,label+' · columna Jugador · '+name,3+i,i?'soft':'contrast',6,4));
    await new Promise(resolve=>setTimeout(resolve,12));
  }

  bestText=v180BestNameColumnText(parts,target);
  bestNames=v180NameColumnLines(bestText);
  v126SetImportStatus('OCR Preciso terminado · '+bestNames.length+(target?' de ~'+target:'')+' nombres · revisa ✓/✕ antes de aplicar');
  return bestText;
}
async function v179TwoBandSweep(source,label,pass,total,kind){
  const parts=[];
  const zones=[['mitad superior',0,.56],['mitad inferior',.44,.56]];
  for(let i=0;i<zones.length;i++){
    pass++;
    const crop=await v177CropSource(source,0,zones[i][1],.999,zones[i][2]);
    v126SetImportStatus('OCR rápido · '+zones[i][0]+' · pasada '+pass+'/'+total);
    const mode=kind==='handwriting'?(i?'handwriting':'pencil'):(i?'soft':'contrast');
    parts.push(await v157Recognize(crop,label+' · '+zones[i][0],pass,mode,6,total));
    await new Promise(resolve=>setTimeout(resolve,25));
  }
  return {parts,pass};
}
async function v126OcrImage(source,label='imagen'){
  /* V182 — precisión de nombres: detecta tabla, aísla Jugador, combina TextDetector
     + Tesseract con consenso, corrige ruido de Equipo y contrasta contra jugadores
     ya registrados sin registrar nada automáticamente.
     Si hay tabla impresa, NO lee toda la
     hoja: aísla sólo la columna Jugador y hace 2 pasadas. Esto evita que Equipo,
     goles y encabezados terminen pegados al nombre y evita 25 filas -> 37 nombres. */
  const type=await v179DetectImageKind(source);
  rosterDetectedKind=type.kind;
  rosterExpectedRows=0;
  rosterHandwritingMode=type.kind==='handwriting';

  if(type.kind!=='handwriting'){
    const table=await v180DetectPrintedTable(source);
    if(table){
      rosterDetectedKind='printed-table';
      rosterExpectedRows=table.rows||0;
      const namesOnly=await v180ReadPrintedNameColumn(source,label,table);
      const count=v180NameColumnLines(namesOnly).length;
      if(count>=Math.max(3,Math.floor((table.rows||count)*.55))){
        v126SetImportStatus('Tabla impresa detectada · OCR Preciso de nombres · '+count+(table.rows?' de ~'+table.rows:'')+' nombres · NO se registró ninguno.');
        return namesOnly;
      }
      /* Si la tabla es atípica y la columna aislada no dio suficiente texto,
         continúa al OCR adaptativo general como respaldo. */
    }
  }

  const parts=[];
  v126SetImportStatus('Autodetección: '+type.label+' · '+type.confidence+'% · preparando OCR rápido…');
  const nativeText=await v177NativeText(source);
  if(nativeText)parts.push({text:nativeText,mode:'native',confidence:92});

  let foundCount=0,merged=nativeText||'';
  try{foundCount=v126ExtractCandidates(merged).length}catch(_){}
  if(foundCount>=20){
    v126SetImportStatus('Autodetección: '+type.label+' · '+foundCount+' nombres candidatos · revisión manual obligatoria.');
    return merged;
  }

  const plan=type.kind==='printed'
    ?[['contrast',6,'impreso principal'],['soft',4,'tabla / columnas']]
    :type.kind==='handwriting'
      ?[['pencil',11,'trazo de pluma/lápiz'],['handwriting',6,'escritura manual'],['contrast',6,'respaldo de contraste']]
      :[['contrast',6,'bloque principal'],['soft',4,'tabla / columnas'],['otsu',3,'respaldo automático']];

  const total=Math.min(5,plan.length+2);
  let pass=0;
  for(const [mode,psm,kind] of plan){
    pass++;
    v126SetImportStatus('OCR rápido · '+type.label+' · '+kind+' · pasada '+pass+'/'+total);
    parts.push(await v157Recognize(source,label,pass,mode,psm,total));
    merged=v162MergeOcrTexts(parts);
    try{foundCount=v126ExtractCandidates(merged).length}catch(_){}
    if(foundCount>=24)break;
    await new Promise(resolve=>setTimeout(resolve,25));
  }

  if(foundCount<24&&pass<5){
    const sweep=await v179TwoBandSweep(source,label,pass,5,type.kind);
    pass=sweep.pass;parts.push(...sweep.parts);
  }

  merged=v162MergeOcrTexts(parts);
  try{foundCount=v126ExtractCandidates(merged).length}catch(_){}
  v126SetImportStatus('OCR terminado · '+type.label+' · '+foundCount+' nombre(s) candidatos · NO se registró ninguno: revisa todos antes de aplicar.');
  return merged;
}
async function v126ReadPdf(file){
  v126SetImportStatus('Abriendo PDF…');
  const pdfjs=await v126PdfJs(),buf=await file.arrayBuffer(),doc=await pdfjs.getDocument({data:buf}).promise;
  const textParts=[],ocrPages=[],maxPages=Math.min(doc.numPages,20);
  for(let i=1;i<=maxPages;i++){
    v126SetImportStatus('Leyendo PDF · página '+i+' de '+maxPages);
    const page=await doc.getPage(i),content=await page.getTextContent();
    const txt=(content.items||[]).map(x=>x.str||'').join(' ').replace(/\s+/g,' ').trim();
    if(txt.length>=35)textParts.push(txt);
    else ocrPages.push(page);
  }
  if(ocrPages.length){
    const T=await v126Tesseract();
    for(let i=0;i<ocrPages.length;i++){
      const page=ocrPages[i],viewport=page.getViewport({scale:1.55});
      const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});
      canvas.width=Math.min(1800,Math.ceil(viewport.width));canvas.height=Math.min(2400,Math.ceil(viewport.height));
      const scale=Math.min(canvas.width/viewport.width,canvas.height/viewport.height);
      const renderViewport=page.getViewport({scale:1.55*scale});
      canvas.width=Math.ceil(renderViewport.width);canvas.height=Math.ceil(renderViewport.height);
      await page.render({canvasContext:ctx,viewport:renderViewport}).promise;
      v126SetImportStatus('OCR inteligente del PDF · página '+(i+1)+' de '+ocrPages.length);
      const pageText=await v126OcrImage(canvas,'PDF página '+(i+1));
      if(pageText)textParts.push(pageText);
    }
  }
  return textParts.join('\n');
}
async function v126ReadRosterFile(file){
  if(!file)throw new Error('Selecciona un archivo');
  const name=String(file.name||'').toLowerCase(),type=String(file.type||'').toLowerCase();
  if(type.startsWith('image/')||/\.(png|jpe?g|webp|bmp)$/i.test(name))return v126OcrImage(file,'imagen');
  if(type==='application/pdf'||/\.pdf$/i.test(name))return v126ReadPdf(file);
  if(/\.docx$/i.test(name)||type.includes('wordprocessingml')){
    v126SetImportStatus('Leyendo Word DOCX…');
    const mammoth=await v126Mammoth(),result=await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});
    return result?.value||'';
  }
  if(/\.(txt|csv)$/i.test(name)||type.startsWith('text/')){
    v126SetImportStatus('Leyendo archivo de texto…');return file.text();
  }
  if(/\.doc$/i.test(name))throw new Error('El formato .DOC antiguo no se puede leer de forma segura en el navegador. Guárdalo como .DOCX o PDF.');
  throw new Error('Formato no compatible. Usa imagen, PDF, DOCX, TXT o CSV.');
}
function v126AllRegistryRecords(){
  const x=store(),out=[];
  for(const [season,list] of Object.entries(x.seasons||{}))for(const r of (Array.isArray(list)?list:[]))out.push({...r,_season:season,_kind:'registry'});
  return out;
}
function v126KnownPeople(){
  const out=v126AllRegistryRecords();
  const keys=new Set(out.map(r=>norm(r.name)+'|'+norm(r.team)+'|'+String(r.catId||'')));
  for(const p of officialPlayers()){
    const k=norm(p.name)+'|'+norm(p.team)+'|'+String(p.catId||'');
    if(keys.has(k))continue;keys.add(k);
    out.push({id:'',name:p.name,team:p.team,category:p.category,catId:p.catId,season:selectedSeason(),_season:selectedSeason(),_kind:'official',source:'official'});
  }
  return out.filter(r=>r.name);
}
function v126LooksLikeNonPlayerName(value){
  const n=norm(value);
  if(!n)return true;
  if(/^(tabla|goleadores?|clasificacion|clasificación|posiciones|resultados?|jornada|estadisticas?|estadísticas?|categoria|categoría|plantilla|lista|equipo|liga|torneo|competicion|competición)\b/.test(n))return true;
  if(/\btabla\s+de\s+goleadores\b/.test(n))return true;
  if(/^(primera fuerza|fuerza intermedia|intermedia|segunda fuerza|veteranos? 35|veteranos? 50)(\b|\+)/.test(n))return true;
  if(/\b(goles|puntos|partidos|pj|pg|pe|pp|gf|gc|dif)\b/.test(n)&&n.split(' ').length<=6)return true;
  return false;
}
const V157_MX_GIVEN=new Set(('JOSE JUAN JESUS LUIS CARLOS MIGUEL ANGEL FRANCISCO JAVIER JORGE ROBERTO EDUARDO DANIEL DAVID ALEJANDRO MANUEL ANTONIO FERNANDO RICARDO SERGIO ALBERTO ARTURO RAUL MARIO OSCAR HECTOR RUBEN RAMON MARTIN ENRIQUE VICTOR GERARDO GUILLERMO MARCO MARCOS ADRIAN ALFREDO ARMANDO CESAR CRISTIAN CHRISTIAN DIEGO ERICK ERIK ESTEBAN FELIPE GABRIEL GUSTAVO IGNACIO IVAN JOAQUIN JONATHAN JULIO LEONARDO MAURICIO MAXIMILIANO OMAR PABLO PEDRO RAFAEL RODRIGO SALVADOR SAMUEL SANTIAGO SEBASTIAN TOMAS ULISES ISRAEL ABRAHAM ALAN AXEL BRYAN BRANDON EMILIANO GAEL HUGO ISAAC KEVIN MATEO MATIAS ALONSO ANDRES BENJAMIN EMANUEL EMMANUEL EVERARDO GENARO GERMAN GILBERTO GONZALO GUADALUPE HORACIO HONORIO CELSO ISMAEL JAIME JAIRO JERONIMO JOEL JOSUE LEONEL MARCELO NOE ORLANDO REYNALDO ROGELIO SAUL TELESFORO VALENTIN VICENTE URIEL').split(' '));
const V157_MX_SURNAME=new Set(('AGUILAR ALMANZA ALVAREZ ANDRADE ARIAS ARIZA AVILA ABOYTES BADILLO BAUTISTA BECERRA BENITEZ BRAVO CABALLERO CABRERA CALDERON CANO CAMPOS CARMONA CARRILLO CASTAÑEDA CASTILLO CASTRO CERVANTES CHAVEZ CISNEROS CONTRERAS CORDOVA CORONA CORTES CRUZ DELGADO DIAZ DOMINGUEZ DUARTE ESCOBAR ESPARZA ESPINOZA FLORES FRANCO FUENTES GALINDO GALLARDO GAMUSERA GARCIA GARDUÑO GOMEZ GONZALEZ GRANADOS GUERRERO GUTIERREZ GUZMAN HERNANDEZ HERRERA HORTELANO HUERTA IBARRA JIMENEZ JUAREZ LADINO LARA LEON LOPEZ LUNA MACIAS MALDONADO MARIN MARTINEZ MEDINA MENDOZA MIRANDA MOLINA MORALES MORENO MUNOZ MUÑOZ MURILLO NAVA NAVARRO NEGRETE NIETO NUNEZ NUÑEZ OCHOA OLVERA ORTEGA ORTIZ PACHECO PADILLA PALACIOS PEREZ PRESA RAMIREZ RAMOS RANGEL RAZO REYES RIVERA RODRIGUEZ ROJAS ROMERO ROSALES ROSAS RUIZ SALAZAR SANCHEZ SANDOVAL SANTIAGO SEGOVIANO SILVA SOLIS SOTO SUAREZ TAPIA TORRES VALADEZ VALENCIA VARGAS VAZQUEZ VEGA VELAZQUEZ VILLAFUERTE VILLALOBOS ZAMORA ZARATE ZAVALA').split(' '));
const V157_NAME_CONNECTORS=new Set(['DE','DEL','LA','LAS','LOS','Y']);
const V157_NAME_NOISE=new Set(('LIGA MUNICIPAL FUTBOL FÚTBOL EQUIPO PLANTILLA JUGADOR JUGADORES DELEGADO DELEGADOS TEMPORADA CATEGORIA CATEGORÍA REGISTRO NOMBRE NOMBRES APELLIDO APELLIDOS NUMERO NÚMERO TELEFONO TELÉFONO CURP EDAD FECHA FIRMA POSICION POSICIÓN DOMICILIO CLAVE SECCION SECCIÓN VIGENCIA MUNICIPIO LOCALIDAD COMUNIDAD GUANAJUATO JUVENTINO ROSAS TABLA GOLEADORES CLASIFICACION CLASIFICACIÓN PUNTOS JORNADA').split(' '));
function v157Upper(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()}
function v157CleanNameText(value){
  return String(value||'')
    .replace(/[|•·]+/g,' ')
    .replace(/[“”"´`]+/g,' ')
    .replace(/\b(?:TEL|TELEFONO|TELÉFONO|CURP|EDAD|FECHA|FIRMA|POSICION|POSICIÓN|CEL|CELULAR)\b.*$/i,'')
    .replace(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b.*$/,'')
    .replace(/^\s*(?:NO\.?|NÚM(?:ERO)?\.?|#)?\s*\d{1,3}\s*[\)\].:\-–—]?\s*/i,'')
    .replace(/\s+/g,' ').trim();
}
function v157MexNameScore(value){
  const clean=v157CleanNameText(value);
  if(!clean||clean.length<5||clean.length>80||/@/.test(clean)||v126LooksLikeNonPlayerName(clean))return 0;
  const tokens=clean.split(/\s+/).map(x=>v157Upper(x.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’-]/g,''))).filter(Boolean);
  const content=tokens.filter(t=>!V157_NAME_CONNECTORS.has(t));
  if(content.length<2||content.length>6||content.some(t=>V157_NAME_NOISE.has(t)))return 0;
  let score=.18;
  const given=content.filter(t=>V157_MX_GIVEN.has(t)).length;
  const surn=content.filter(t=>V157_MX_SURNAME.has(t)).length;
  if(given)score+=.25+Math.min(.10,(given-1)*.05);
  if(surn)score+=.25+Math.min(.12,(surn-1)*.06);
  if(given&&surn)score+=.18;
  if(content.length>=3&&content.length<=5)score+=.08;
  if((content.join('').match(/[AEIOU]/g)||[]).length>=3)score+=.05;
  return Math.max(0,Math.min(1,score));
}
function v157TitleName(value){
  return String(value||'').toLocaleLowerCase('es-MX').replace(/(^|[\s'-])([a-záéíóúüñ])/g,(m,p,a)=>p+a.toLocaleUpperCase('es-MX'));
}
function v157BestNameWindow(piece){
  const cleaned=v157CleanNameText(piece),tokens=cleaned.split(/\s+/).filter(Boolean);
  let best='',bestScore=0;
  for(let size=Math.min(6,tokens.length);size>=2;size--){
    for(let i=0;i+size<=tokens.length;i++){
      const c=tokens.slice(i,i+size).join(' ').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’\-\s]/g,' ').replace(/\s+/g,' ').trim();
      const sc=v157MexNameScore(c);
      if(sc>bestScore){best=c;bestScore=sc}
    }
  }
  return {name:best?v157TitleName(best):'',score:bestScore};
}

function v126Nameish(value){
  const cleaned=v157CleanNameText(value);
  if(!cleaned||v126LooksLikeNonPlayerName(cleaned)||/@/.test(cleaned))return '';
  const best=v157BestNameWindow(cleaned);
  return best.score>=.48?best.name:'';
}
function v172KnownTeamAliases(){
  const out=new Set();
  for(const t of registryTeams())if(t?.name)out.add(norm(t.name));
  [
    'A CENTENO','CENTENO','ATL GALEANA','REAL CERRITO','OKLAHOMA','POPULARES','TAVERA',
    'MAZACOTES','TERRICOLAS','OSASUNA','SAN JULIAN','BARZA','POZOS','ALDAMA'
  ].forEach(x=>out.add(norm(x)));
  return [...out].filter(Boolean).sort((a,b)=>b.length-a.length);
}
function v182Compact(value){return norm(value).replace(/\s+/g,'')}
function v182StripTeamSuffix(value){
  let s=String(value||'').replace(/[|¦]+/g,' ').replace(/\s+/g,' ').trim();
  if(!s)return '';
  let words=s.split(/\s+/).filter(Boolean);
  const teams=v172KnownTeamAliases();
  for(let round=0;round<2;round++){
    let removed=false;
    for(const team of teams){
      const tc=v182Compact(team);if(tc.length<4)continue;
      for(let k=Math.min(4,words.length-1);k>=1;k--){
        const tail=words.slice(-k).join(' '),compact=v182Compact(tail);
        if(!compact)continue;
        const maxLen=Math.max(compact.length,tc.length),dist=v124Levenshtein(compact,tc);
        const fuzzy=maxLen>=6&&dist<=1;
        if(compact===tc||fuzzy){
          words=words.slice(0,-k);removed=true;break;
        }
      }
      if(removed)break;
    }
    if(!removed)break;
  }
  return words.join(' ');
}
function v182ClosestLexiconToken(token,set){
  const raw=v157Upper(token).replace(/[^A-ZÑ]/g,'');
  if(!raw||raw.length<4||set.has(raw))return token;
  let best='',bestD=99,second=99;
  for(const w of set){
    if(Math.abs(w.length-raw.length)>2)continue;
    const d=v124Levenshtein(raw,w);
    if(d<bestD){second=bestD;bestD=d;best=w}
    else if(d<second)second=d;
  }
  const allowed=raw.length>=8?2:1;
  if(best&&bestD<=allowed&&second>bestD){
    return v157TitleName(best);
  }
  return token;
}
function v182RepairLexiconName(value){
  let clean=v157CleanNameText(v182StripTeamSuffix(value))
    .replace(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/,'')
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’\-\s]/g,' ')
    .replace(/\s+/g,' ').trim();
  if(!clean)return '';
  let tokens=clean.split(/\s+/).filter(Boolean);
  while(tokens.length>=3&&v157Upper(tokens[0]).replace(/[^A-ZÑ]/g,'').length<=1)tokens.shift();
  tokens=tokens.map((t,i)=>{
    const u=v157Upper(t);
    if(V157_NAME_CONNECTORS.has(u))return t.toLocaleLowerCase('es-MX');
    if(i===0){
      const g=v182ClosestLexiconToken(t,V157_MX_GIVEN);
      if(v157Upper(g)!==u)return g;
    }
    return v182ClosestLexiconToken(t,V157_MX_SURNAME);
  });
  return v157TitleName(tokens.join(' '));
}
function v182KnownNameRepair(value,known=v126KnownPeople()){
  const clean=v182RepairLexiconName(value),cn=norm(clean);
  if(!cn)return null;
  const ct=cn.split(' ').filter(w=>w.length>=2&&!['de','del','la','las','los','y'].includes(w));
  const unique=new Map();
  for(const p of (known||[])){
    const pn=norm(p?.name);if(pn&&!unique.has(pn))unique.set(pn,p);
  }
  let best=null,bestScore=-1,second=-1,bestExact=0,bestSim=0;
  for(const p of unique.values()){
    const pn=norm(p.name),pt=pn.split(' ').filter(w=>w.length>=2&&!['de','del','la','las','los','y'].includes(w));
    if(!pt.length)continue;
    const sim=v124TokenSim(cn,pn);
    const exact=ct.filter(w=>pt.includes(w)).length;
    const fuzzy=ct.length?ct.reduce((sum,w)=>sum+Math.max(0,...pt.map(t=>v124TokenSim(w,t))),0)/ct.length:0;
    const first=ct[0]&&pt[0]?v124TokenSim(ct[0],pt[0]):0;
    const last=ct.at(-1)&&pt.includes(ct.at(-1))?1:0;
    let score=sim*.58+fuzzy*.22+Math.min(3,exact)*.055+first*.06+last*.035;
    if(exact>=2)score+=.10;
    if(exact>=3)score+=.08;
    if(score>bestScore){second=bestScore;bestScore=score;best=p;bestExact=exact;bestSim=sim}
    else if(score>second)second=score;
  }
  if(!best)return null;
  const margin=bestScore-second;
  const safe=(bestExact>=3&&bestScore>=.67&&margin>=.025)||
             (bestExact>=2&&bestScore>=.72&&margin>=.04)||
             (bestSim>=.86&&bestScore>=.78&&margin>=.035);
  return safe?{name:best.name,record:best,score:Math.min(1,bestScore),raw:clean}:null;
}
function v172StripTableColumns(line){
  let s=String(line||'').replace(/[|¦]+/g,' ').replace(/\s+/g,' ').trim();
  s=s.replace(/^\s*(?:NO\.?\s*)?[#Nº°]?\s*\d{1,3}\s*[.)\-:]?\s*/i,'');
  s=s.replace(/\s+\d{1,3}\s*$/,'');
  s=v182StripTeamSuffix(s);
  return v157CleanNameText(s);
}
function v172BestKnownFromRow(line,known){
  const clean=v172StripTableColumns(line)||line,body=norm(clean);
  if(!body)return null;
  const repaired=v182KnownNameRepair(clean,known);
  if(repaired)return {name:repaired.name,score:repaired.score};
  let best=null,bestScore=0;
  for(const p of known){
    const pn=norm(p.name);if(!pn)continue;
    const pt=pn.split(' ').filter(w=>w.length>=3);
    const tokenHits=pt.filter(w=>body.includes(w)).length;
    let score=v124TokenSim(body,pn)+(tokenHits>=3?.28:tokenHits===2?.17:tokenHits===1?.05:0);
    if(body.includes(pn))score=1;
    if(score>bestScore){bestScore=score;best=p}
  }
  const minScore=(rosterDetectedKind==='printed-table'||rosterDetectedKind==='printed')?.86:.60;
  return best&&bestScore>=minScore?{name:best.name,score:Math.min(1,bestScore)}:null;
}
function v178PlausibleFullName(value){
  let clean=v172StripTableColumns(value);
  clean=String(clean||'')
    .replace(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/,'')
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’\-\s]/g,' ')
    .replace(/\s+/g,' ').trim();
  if(!clean||clean.length<5||clean.length>92||v126LooksLikeNonPlayerName(clean))return '';
  const tokens=clean.split(/\s+/).filter(Boolean);
  const content=tokens.map(v157Upper).filter(t=>!V157_NAME_CONNECTORS.has(t));
  if(content.length<2||content.length>7)return '';
  if(content.some(t=>V157_NAME_NOISE.has(t)))return '';
  if(content.filter(t=>t.length>=2).length<2)return '';
  const letters=content.join('').replace(/[^A-ZÑ]/g,'').length;
  if(letters<6)return '';
  /* En una lista de plantilla no todos los nombres/apellidos están en el
     diccionario. Si la fila tiene forma humana, consérvala para revisión manual
     en vez de descartarla y perder jugadores. */
  return v157TitleName(clean);
}
function v178OrderedLineCandidates(raw,known){
  const out=[],lines=String(raw||'').split(/\r?\n/);
  const push=(name,score=.42)=>{if(name&&!out.some(x=>v124TokenSim(x.name,name)>.96))out.push({name,score})};
  for(let i=0;i<lines.length;i++){
    const original=String(lines[i]||'').trim();
    if(!original)continue;
    const numbered=/^\s*(?:NO\.?\s*)?[#Nº°]?\s*\d{1,3}\b/i.test(original);
    const knownHit=v172BestKnownFromRow(original,known);
    if(knownHit){push(knownHit.name,knownHit.score);continue}
    const clean=v172StripTableColumns(original);
    const best=v157BestNameWindow(clean);
    if(best.name&&best.score>=.30){push(best.name,Math.max(numbered?.52:.44,best.score));continue}
    const fallback=v178PlausibleFullName(clean);
    if(fallback){push(fallback,numbered?.50:.40);continue}
    /* Une sólo fragmentos cortos consecutivos. Esto recupera nombres completos
       cuando el OCR parte una misma fila en dos líneas, sin pegar filas normales. */
    const a=v157CleanNameText(clean),b=v157CleanNameText(lines[i+1]||'');
    const at=a.split(/\s+/).filter(Boolean),bt=b.split(/\s+/).filter(Boolean);
    if(at.length>=1&&at.length<=2&&bt.length>=1&&bt.length<=3){
      const joined=v178PlausibleFullName(a+' '+b);
      if(joined){push(joined,.41);i++}
    }
  }
  return out;
}
function v172NumberedTableCandidates(raw,known){
  const out=[];
  for(const line of String(raw||'').split(/\r?\n/)){
    if(!/^\s*(?:NO\.?\s*)?[#Nº°]?\s*\d{1,3}\b/i.test(line))continue;
    const knownHit=v172BestKnownFromRow(line,known);
    if(knownHit){out.push(knownHit);continue}
    const clean=v172StripTableColumns(line),best=v157BestNameWindow(clean);
    if(best.name&&best.score>=.30){out.push({name:best.name,score:Math.max(.50,best.score)});continue}
    const fallback=v178PlausibleFullName(clean);
    if(fallback)out.push({name:fallback,score:.50});
  }
  return out;
}
function v126ExtractCandidates(text){
  const raw=String(text||'');
  if(rosterDetectedKind==='printed-table'){
    const direct=v180NameColumnLines(raw);
    if(direct.length){
      const limit=rosterExpectedRows>0?Math.min(80,rosterExpectedRows):80;
      return direct.slice(0,limit);
    }
  }
  const known=v126KnownPeople(),found=new Map(),order=[],flat=norm(raw);
  const add=(name,score=0)=>{
    if(v126LooksLikeNonPlayerName(name))return;
    const n=norm(name);if(!n||n.length<5)return;
    const prev=found.get(n);
    if(!prev){found.set(n,{name,score});order.push(n)}
    else if(score>prev.score)found.set(n,{name,score});
  };
  /* Prioridad a la lectura real de arriba hacia abajo. No ordenamos por
     "confianza" porque eso desacomodaba la lista y podía esconder filas. */
  for(const row of v178OrderedLineCandidates(raw,known))add(row.name,row.score);
  for(const row of v172NumberedTableCandidates(raw,known))add(row.name,row.score);
  for(const p of known){
    const n=norm(p.name);if(n.length>=5&&flat.includes(n))add(p.name,1);
  }
  for(const line of raw.split(/\r?\n/)){
    const pieces=line.split(/\t| {2,}|;|,/).map(x=>x.trim()).filter(Boolean);
    for(const piece0 of (pieces.length?pieces:[line])){
      const piece=v172StripTableColumns(piece0);
      const knownHit=v172BestKnownFromRow(piece,known);
      if(knownHit)add(knownHit.name,knownHit.score);
      const best=v157BestNameWindow(piece);
      if(best.name&&best.score>=.34)add(best.name,best.score);
      const np=norm(piece);
      if(np.length>=5){
        let hit=null,score=0;
        for(const p of known){
          const pn=norm(p.name),sim=v124TokenSim(np,pn);
          const tokenHits=pn.split(' ').filter(w=>w.length>=3&&np.includes(w)).length;
          const boosted=Math.min(1,sim+(tokenHits>=2?.18:tokenHits===1?.06:0));
          if(boosted>score){score=boosted;hit=p}
        }
        if(hit&&score>=.60)add(hit.name,score);
      }
    }
  }
  const candidates=order.map(k=>found.get(k)).filter(Boolean),out=[];
  for(const cand of candidates){
    if(out.length>=80)break;
    if(!out.some(o=>v124TokenSim(o.name,cand.name)>.96))out.push(cand);
  }
  return out.map(x=>x.name);
}
function v126BestKnown(name,team=''){
  const n=norm(name),target=norm(team),known=v126KnownPeople();
  const repaired=v182KnownNameRepair(name,known);
  if(repaired){
    const sameTeam=!target||norm(repaired.record?.team)===target;
    return {record:repaired.record,score:Math.min(1,repaired.score+(sameTeam?.025:0))};
  }
  let best=null,score=0;
  for(const r of known){
    let s=v124TokenSim(n,r.name);
    if(target&&norm(r.team)===target)s+=.035;
    if(s>score){score=s;best=r}
  }
  const minScore=rosterDetectedKind==='printed-table'?.88:(rosterDetectedKind==='printed'?.86:.80);
  return score>=minScore?{record:best,score}:null;
}
function v126AutoRegisterNewEntries(){
  /* V179 safety lock: OCR only proposes names. Never writes to registry automatically. */
  return 0;
}
function v126AnalyzeText(text){
  if(!rosterImportTeam)throw new Error('Primero elige el equipo de esta lista');
  const team=rosterImportTeam,season=selectedSeason(),current=seasonRecords(season),names=v126ExtractCandidates(text),entries=[];
  for(const rawName of names){
    const hit=v126BestKnown(rawName,team),known=hit?.record||null;
    const canonical=known?.name||rawName;
    const currentSame=current.find(r=>norm(r.name)===norm(canonical)&&norm(r.team)===norm(team));
    const currentOther=current.find(r=>norm(r.name)===norm(canonical)&&norm(r.team)!==norm(team));
    let status='new',source=null;
    if(currentSame){status='keep';source=currentSame}
    else if(currentOther){status='transfer';source=currentOther}
    else if(known){
      source=known;
      status=norm(known.team)===norm(team)?'return':'transfer';
    }
    const nameScore=known?Math.max(.85,hit?.score||0):v157MexNameScore(canonical);
    if(status==='new'&&nameScore<.46)status='review';
    entries.push({name:canonical,rawName,status,source,decision:'pending',include:false,score:hit?.score||0,nameScore});
  }
  const importedNorm=new Set(entries.map(e=>norm(e.name)));
  const missing=current.filter(r=>norm(r.team)===norm(team)&&!importedNorm.has(norm(r.name))).map(r=>({...r,remove:false}));
  rosterImport={...rosterImport,rawText:String(text||''),entries,missing,status:'Revisa cada nombre: ✓ aprobar o ✕ rechazar. Nada se registra automáticamente.',busy:false,autoAdded:0};
  return {detected:entries.length};
}
function v126CleanupNonPlayers(season=selectedSeason()){
  const x=store(),list=Array.isArray(x.seasons?.[season])?x.seasons[season]:[];
  const cleaned=list.filter(r=>{
    if(!v126LooksLikeNonPlayerName(r?.name))return true;
    const auto=!!r?.rosterAuto||/auto-registrado|importado de lista/i.test(String(r?.status||''));
    return !auto;
  });
  if(cleaned.length!==list.length){
    x.seasons[season]=cleaned;saveStore(x);
    for(const id of [...selectedIds])if(!cleaned.some(r=>r.id===id))selectedIds.delete(id);
    const editId=localStorage.getItem(EDIT_KEY);
    if(editId&&!cleaned.some(r=>r.id===editId))localStorage.removeItem(EDIT_KEY);
    return list.length-cleaned.length;
  }
  return 0;
}
function v126ImportSummary(){
  const e=Array.isArray(rosterImport.entries)?rosterImport.entries:[],count=k=>e.filter(x=>x.status===k).length;
  const approved=e.filter(x=>x.decision==='approved').length,rejected=e.filter(x=>x.decision==='rejected').length,pending=e.length-approved-rejected;
  const keep=count('keep'),returning=count('return'),fresh=count('new'),review=count('review');
  return {total:e.length,approved,rejected,pending,keep,registered:keep+returning,transfer:count('transfer'),returning,fresh,review,missing:(Array.isArray(rosterImport.missing)?rosterImport.missing:[]).length};
}
function v126RosterStatusLabel(e){
  if(e.status==='keep')return 'Ya registrado · ya está en este equipo';
  if(e.status==='transfer')return 'Ya registrado · posible cambio de equipo · requiere aprobación';
  if(e.status==='return')return 'Ya registrado · posible renovación · requiere aprobación';
  if(e.status==='review')return 'Nombre posible · revísalo antes de aprobar';
  return 'Jugador nuevo · no se registrará hasta que lo apruebes';
}
function v126RosterResultHtml(){
  const entries=Array.isArray(rosterImport.entries)?rosterImport.entries:[];
  if(!entries.length&&!rosterImport.rawText)return '';
  const s=v126ImportSummary();
  const personRows=entries.map((e,i)=>{
    const decision=e.decision||'pending';
    return '<article class="v126-person v172-review-person '+esc(e.status)+' '+esc(decision)+'" data-v172-review-row="'+i+'">'+
      '<span class="v172-review-state" aria-hidden="true">'+(decision==='approved'?'✓':decision==='rejected'?'✕':'?')+'</span>'+
      '<span class="v126-person-copy"><b>'+esc(e.name)+'</b><small>'+esc(v126RosterStatusLabel(e))+(e.source?.team&&e.status==='transfer'?' · antes: '+esc(e.source.team):'')+'</small><button type="button" class="v180-correct-name" data-v180-correct-name="'+i+'">✎ Corregir nombre</button></span>'+
      '<span class="v172-review-actions">'+
        '<button type="button" class="approve '+(decision==='approved'?'active':'')+'" data-v172-approve="'+i+'" aria-label="Aprobar '+esc(e.name)+'">✓ <em>Aprobar</em></button>'+
        '<button type="button" class="reject '+(decision==='rejected'?'active':'')+'" data-v172-reject="'+i+'" aria-label="Rechazar '+esc(e.name)+'">✕ <em>Rechazar</em></button>'+
      '</span>'+
    '</article>';
  }).join('');
  return '<div class="v126-result">'+
    '<div class="v126-summary v172-review-summary">'+
      '<div><b>'+s.total+'</b><span>Detectados</span></div>'+
      '<div><b data-v172-approved>'+s.approved+'</b><span>Aprobados ✓</span></div>'+
      '<div><b data-v172-rejected>'+s.rejected+'</b><span>Rechazados ✕</span></div>'+
      '<div><b data-v172-pending>'+s.pending+'</b><span>Por revisar</span></div>'+
    '</div>'+
    '<div class="v126-auto-info v172-manual-review"><b>Revisión manual obligatoria</b><span>La lectura sólo propone nombres. No registra, mueve ni renueva jugadores automáticamente. Revisa uno por uno y toca ✓ Aprobar o ✕ Rechazar.</span></div>'+
    (s.total<20?'<div class="v157-review-note"><b>Se detectaron '+s.total+' nombres</b><span>Si la imagen tiene más jugadores, abre “Ver / corregir texto detectado” o vuelve a escanear con una foto recta y nítida. OCR Pro vuelve a leer la hoja por bloques superpuestos, columnas y contraste adaptativo para recuperar nombres pequeños.</span></div>':'')+
    '<div class="v126-detected">'+personRows+'</div>'+
    ((Array.isArray(rosterImport.missing)?rosterImport.missing:[]).length?'<div class="v126-missing"><div class="v126-missing-head"><span><b>No aparecen en la lista</b><small>No se borran automáticamente; marca sólo los que realmente salen del equipo.</small></span><button type="button" data-v126-mark-missing>Marcar todos</button></div>'+
      rosterImport.missing.map((r,i)=>'<label><input type="checkbox" data-v126-remove="'+i+'" '+(r.remove?'checked':'')+'><span>'+esc(r.name)+'</span></label>').join('')+
    '</div>':'')+
    '<details class="v126-raw"><summary>Ver / corregir texto detectado</summary><textarea data-v126-raw-text>'+esc(rosterImport.rawText||'')+'</textarea><button type="button" data-v126-reanalyse>Volver a analizar este texto</button></details>'+
    '<button type="button" class="v126-apply" data-v126-apply '+(s.approved?'':'disabled')+'>Registrar / aplicar aprobados ('+s.approved+')</button>'+
  '</div>';
}

function v126RosterTeamPickerHtml(){
  const teams=registryTeams(),q=norm(rosterTeamQuery);
  const visible=teams.filter(t=>!q||norm(t.name).includes(q)||norm(t.category||'').includes(q));
  const selected=teams.find(t=>norm(t.name)===norm(rosterImportTeam));
  return '<div class="v126-team-custom">'+
    '<button type="button" class="v126-team-open" data-v126-team-open aria-expanded="'+(rosterTeamPickerOpen?'true':'false')+'">'+
      '<span><small>Equipo de esta lista</small><b>'+esc(selected?.name||'Selecciona el equipo de la lista')+'</b>'+
      '<em>'+esc(selected?.category||'Toca para elegir')+'</em></span><i>⌄</i>'+
    '</button>'+
    (rosterTeamPickerOpen?'<div class="v126-team-panel">'+
      '<div class="v126-team-panel-head"><b>Seleccionar equipo</b><button type="button" data-v126-team-close>×</button></div>'+
      '<input type="search" data-v126-team-search placeholder="Buscar equipo o categoría" value="'+esc(rosterTeamQuery)+'" autocomplete="off">'+
      '<div class="v126-team-list">'+
        (visible.length?visible.map(t=>
          '<button type="button" class="v126-team-choice '+(norm(t.name)===norm(rosterImportTeam)?'active':'')+'" data-v126-team-choice="'+esc(t.name)+'">'+
            '<span><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Categoría por confirmar')+'</small></span><i>✓</i>'+
          '</button>'
        ).join(''):'<div class="v126-team-empty">No encontré equipos con esa búsqueda.</div>')+
      '</div>'+
    '</div>':'')+
  '</div>';
}

function rosterImportHtml(){
  const teams=registryTeams(),groups=new Map();
  for(const t of teams){const cat=t.category||'Sin categoría';if(!groups.has(cat))groups.set(cat,[]);groups.get(cat).push(t)}
  let opts='<option value="">Selecciona el equipo de la lista</option>';
  for(const [cat,items] of groups)opts+='<optgroup label="'+esc(cat)+'">'+items.map(t=>'<option value="'+esc(t.name)+'" '+(rosterImportTeam===t.name?'selected':'')+'>'+esc(t.name)+'</option>').join('')+'</optgroup>';
  return '<section class="v126-import">'+
    '<header><small>LISTA DEL DELEGADO</small><h3>Importar jugadores desde foto, PDF o Word</h3><p>Lee la lista en este teléfono, compara quién sigue, quién ya existe, quién cambió de equipo y quién es nuevo. El archivo no se sube a GitHub.</p></header>'+
    v126RosterTeamPickerHtml()+
    '<button type="button" class="v126-file" data-v126-file-pick><span><b>Elegir lista del delegado</b><small>Foto · texto impreso · pluma · lápiz · PDF · Word · TXT · CSV</small></span></button>'+
    '<input class="v126-file-input" type="file" data-v126-file accept="image/*,.pdf,.docx,.txt,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" tabindex="-1" aria-hidden="true">'+
    '<div class="v126-file-name">'+esc(rosterImport.fileName||'Ningún archivo seleccionado')+'</div>'+
    '<div class="v162-handwriting v179-auto-detect"><span class="v162-handwriting-check">AI</span><span><b>Detección automática del documento</b><small>Reconoce si parece texto impreso/Word/Arial, pluma/lápiz o mixto y usa sólo las pasadas necesarias. Máximo 5 para evitar bloqueos en Android.</small></span></div>'+
    '<button type="button" class="v126-analyse" data-v126-analyse '+(rosterImport.busy?'disabled':'')+'>'+(rosterImport.busy?'Leyendo lista…':'Detectar y comparar jugadores')+'</button>'+
    '<p class="v126-status" data-v126-import-status>'+esc(rosterImport.status||'Autodetector activo: si encuentra una tabla impresa, aísla primero la columna Jugador para no mezclar Equipo/Goles; si no, distingue Word/impreso, pluma/lápiz o mixto. Nada se registra automáticamente; revisa TODOS los nombres con ✓ o ✕.')+'</p>'+
    v126RosterResultHtml()+
  '</section>';
}
function v126ApplyRoster(){
  if(!rosterImportTeam)return toast('Elige el equipo de la lista');
  const summary=v126ImportSummary();
  if(summary.pending>0)return toast('Revisa los '+summary.pending+' nombre(s) pendientes. No se registrará nada hasta comprobar toda la lista.');
  const entries=(Array.isArray(rosterImport.entries)?rosterImport.entries:[]).filter(e=>e.decision==='approved'),removals=(Array.isArray(rosterImport.missing)?rosterImport.missing:[]).filter(r=>r.remove);
  if(!entries.length&&!removals.length)return toast('No hay jugadores aprobados para aplicar');
  if(!confirm('Aplicar la lista de '+rosterImportTeam+' en '+selectedSeason()+'? Se conservarán los datos de jugadores ya registrados. Las bajas sólo serán las que marcaste.'))return;
  const season=selectedSeason(),list=seasonRecords(season).slice(),info=teamInfo(rosterImportTeam)||{},now=new Date().toISOString();
  let kept=0,moved=0,added=0,renewed=0,removed=0;
  for(const e of entries){
    if(e.status==='keep'){kept++;continue}
    const existingIdx=list.findIndex(r=>norm(r.name)===norm(e.name));
    if(existingIdx>=0){
      const r=list[existingIdx],min=v124VeteranMinimum(info.category),age=v124AgeFromDob(r.dob);
      if(min&&(age===null||age<min)){continue}
      list[existingIdx]={...r,previousTeam:r.team||'',team:rosterImportTeam,category:info.category||r.category||'',catId:String(info.cat||r.catId||''),
        source:'local',officialPresent:false,status:'Cambio de equipo · importado de lista',updatedAt:now};
      moved++;continue;
    }
    if(e.source){
      const base=e.source;
      const rec={...base,id:uid(),season,team:rosterImportTeam,category:info.category||base.category||'',catId:String(info.cat||base.catId||''),
        previousTeam:base.team||'',source:'local',officialPresent:false,status:(e.status==='transfer'?'Cambio de equipo':'Renovación')+' · importado de lista',createdAt:now,updatedAt:now};
      delete rec._season;delete rec._kind;
      if(duplicateIndex(list,rec)<0){list.push(rec);e.status==='transfer'?moved++:renewed++}
      continue;
    }
    const rec={id:uid(),name:e.name,team:rosterImportTeam,category:info.category||'',catId:String(info.cat||''),season,
      status:'Importado de lista · faltan datos/foto',source:'local',officialPresent:false,officialCheckedAt:'',
      curp:'',dob:'',city:'',position:'Sin definir',createdAt:now,updatedAt:now};
    if(duplicateIndex(list,rec)<0){list.push(rec);added++}
  }
  const removeIds=new Set(removals.map(r=>r.id));
  const finalList=list.filter(r=>{if(removeIds.has(r.id)){removed++;return false}return true});
  putSeason(season,finalList);
  rosterImport={fileName:'',rawText:'',entries:[],missing:[],status:'',busy:false};rosterImportFile=null;
  toast('Lista aplicada: '+kept+' ya estaban · '+moved+' cambios · '+renewed+' renovados · '+added+' nuevos · '+removed+' bajas');
  renderManager();
}
function bindRosterImport(root){
  $('[data-v126-team-open]',root)?.addEventListener('click',()=>{rosterTeamPickerOpen=!rosterTeamPickerOpen;renderManager()});
  $('[data-v126-team-close]',root)?.addEventListener('click',()=>{rosterTeamPickerOpen=false;rosterTeamQuery='';renderManager()});
  $('[data-v126-team-search]',root)?.addEventListener('input',e=>{
    rosterTeamQuery=e.target.value||'';
    const q=norm(rosterTeamQuery);
    $$('[data-v126-team-choice]',root).forEach(b=>{
      const txt=norm(b.textContent||'');b.hidden=!!q&&!txt.includes(q);
    });
  });
  $$('[data-v126-team-choice]',root).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    filePickerCooldownUntil=Date.now()+700;
    rosterImportTeam=b.dataset.v126TeamChoice||'';
    rosterTeamPickerOpen=false;rosterTeamQuery='';
    rosterImport={fileName:'',rawText:'',entries:[],missing:[],status:'',busy:false};
    rosterImportFile=null;
    renderManager(true);
    toast('Equipo seleccionado: '+rosterImportTeam);
  }));
  $('[data-v126-file-pick]',root)?.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    if(Date.now()<filePickerCooldownUntil)return;
    const input=$('[data-v126-file]',root);
    if(input)input.click();
  });
  $('[data-v126-file]',root)?.addEventListener('change',e=>{
    rosterImportFile=e.target.files?.[0]||null;
    rosterImport.fileName=rosterImportFile?.name||'';
    const n=$('.v126-file-name',root);if(n)n.textContent=rosterImport.fileName||'Ningún archivo seleccionado';
  });
  $('[data-v126-analyse]',root)?.addEventListener('click',async()=>{
    if(!rosterImportTeam)return toast('Primero selecciona el equipo de la lista');
    if(!rosterImportFile)return toast('Selecciona la foto, PDF, DOCX, TXT o CSV del delegado');
    rosterImport.busy=true;v126SetImportStatus('Preparando lectura…');
    const btn=$('[data-v126-analyse]',root);if(btn){btn.disabled=true;btn.textContent='Leyendo lista…'}
    try{
      const text=await v126ReadRosterFile(rosterImportFile);
      if(!String(text||'').trim())throw new Error('No encontré texto en el archivo');
      const analysis=v126AnalyzeText(text);rosterImport.fileName=rosterImportFile.name;
      toast('Lista detectada · '+analysis.detected+' nombre(s) · revisa ✓ aprobar / ✕ rechazar');
      renderManager();
    }catch(err){
      rosterImport.busy=false;v126SetImportStatus(err?.message||'No se pudo leer la lista');
      if(btn){btn.disabled=false;btn.textContent='Detectar y comparar jugadores'}
      toast(err?.message||'No se pudo leer la lista');
    }
  });
  const reviewDecision=(index,decision)=>{
    const entries=Array.isArray(rosterImport.entries)?rosterImport.entries:[];
    const item=entries[index];if(!item)return;
    item.decision=decision;item.include=decision==='approved';
    const row=$('[data-v172-review-row="'+index+'"]',root);
    if(row){row.classList.remove('pending','approved','rejected');row.classList.add(decision);const state=$('.v172-review-state',row);if(state)state.textContent=decision==='approved'?'✓':'✕';$$('.v172-review-actions button',row).forEach(b=>b.classList.toggle('active',(decision==='approved'&&b.classList.contains('approve'))||(decision==='rejected'&&b.classList.contains('reject'))))}
    const s=v126ImportSummary();
    const a=$('[data-v172-approved]',root),r=$('[data-v172-rejected]',root),p=$('[data-v172-pending]',root),apply=$('[data-v126-apply]',root);
    if(a)a.textContent=String(s.approved);if(r)r.textContent=String(s.rejected);if(p)p.textContent=String(s.pending);
    if(apply){apply.disabled=!s.approved||s.pending>0;apply.textContent=s.pending?'Revisa todos antes de registrar ('+s.pending+' pendientes)':'Registrar / aplicar aprobados ('+s.approved+')'}
  };
  $('[data-v180-correct-name]',root).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const i=Number(b.dataset.v180CorrectName),item=rosterImport.entries?.[i];
    if(!item)return;
    const value=prompt('Corrige el nombre completo exactamente como aparece en la lista:',item.name||'');
    if(value===null)return;
    const corrected=v178PlausibleFullName(value)||v157TitleName(v157CleanNameText(value));
    if(!corrected)return toast('Escribe al menos nombre y apellido');
    item.name=corrected;item.rawName=corrected;item.decision='pending';item.include=false;item.status='review';item.source=null;
    toast('Nombre corregido · revísalo y apruébalo');renderManager();
  }));
  $('[data-v172-approve]',root).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();reviewDecision(Number(b.dataset.v172Approve),'approved')}));
  $$('[data-v172-reject]',root).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();reviewDecision(Number(b.dataset.v172Reject),'rejected')}));
  $$('[data-v126-remove]',root).forEach(c=>c.onchange=()=>{const r=rosterImport.missing?.[Number(c.dataset.v126Remove)];if(r)r.remove=c.checked});
  $('[data-v126-mark-missing]',root)?.addEventListener('click',()=>{for(const r of rosterImport.missing||[])r.remove=true;renderManager()});
  $('[data-v126-reanalyse]',root)?.addEventListener('click',()=>{
    const text=$('[data-v126-raw-text]',root)?.value||'';
    try{const analysis=v126AnalyzeText(text);toast('Texto revisado · '+analysis.detected+' nombre(s) detectados · sin registrar automáticamente');renderManager()}catch(err){toast(err?.message||'No se pudo analizar el texto')}
  });
  $('[data-v126-apply]',root)?.addEventListener('click',v126ApplyRoster);
}

function v160FastTeamPickerHtml(){
  const teams=registryTeams();
  const categories=['Todas',...new Set(teams.map(t=>t.category||'Sin categoría'))];
  const letters=['Todas',...new Set(teams.map(t=>String(t.name||'').trim().charAt(0).toUpperCase()).filter(x=>/[A-ZÁÉÍÓÚÑ]/.test(x)))].sort((a,b)=>{
    if(a==='Todas')return -1;if(b==='Todas')return 1;return a.localeCompare(b,'es');
  });
  const q=norm(quickTeamQuery);
  const visible=teams.filter(t=>{
    if(quickTeamCategory!=='Todas'&&(t.category||'Sin categoría')!==quickTeamCategory)return false;
    if(quickTeamLetter!=='Todas'&&!norm(t.name).startsWith(norm(quickTeamLetter)))return false;
    if(q&&!norm(t.name+' '+(t.category||'')).includes(q))return false;
    return true;
  });
  const selected=teams.find(t=>norm(t.name)===norm(quickTeam));
  return '<div class="v160-fast-team-picker">'+
    '<button type="button" class="v160-fast-team-open" data-v160-fast-team-open aria-expanded="'+(quickTeamPickerOpen?'true':'false')+'">'+
      '<span><small>Equipo destino</small><b>'+esc(selected?.name||'Elige equipo destino')+'</b><em>'+esc(selected?.category||'Busca por nombre, categoría o letra')+'</em></span><i>⌄</i>'+
    '</button>'+
    (quickTeamPickerOpen?'<div class="v160-fast-team-panel">'+
      '<div class="v160-fast-team-head"><b>Buscar equipo destino</b><button type="button" data-v160-fast-team-close aria-label="Cerrar">×</button></div>'+
      '<label class="v160-fast-team-search"><span>Buscar por nombre</span><input type="search" data-v160-fast-team-search placeholder="Ej. Aldama, América, La Huerta…" value="'+esc(quickTeamQuery)+'" autocomplete="off"></label>'+
      '<div class="v160-fast-team-filter"><span>Categoría</span><div>'+categories.map(cat=>'<button type="button" class="'+(quickTeamCategory===cat?'active':'')+'" data-v160-fast-team-category="'+esc(cat)+'">'+esc(cat)+'</button>').join('')+'</div></div>'+
      '<div class="v160-fast-team-filter letters"><span>Letra</span><div>'+letters.map(letter=>'<button type="button" class="'+(quickTeamLetter===letter?'active':'')+'" data-v160-fast-team-letter="'+esc(letter)+'">'+esc(letter)+'</button>').join('')+'</div></div>'+
      '<div class="v160-fast-team-count"><b>'+visible.length+'</b><span> equipos encontrados</span></div>'+
      '<div class="v160-fast-team-list">'+
        (visible.length?visible.map(t=>'<button type="button" class="v160-fast-team-choice '+(norm(t.name)===norm(quickTeam)?'active':'')+'" data-v160-fast-team-choice="'+esc(t.name)+'"><span><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Categoría por confirmar')+'</small></span><i>✓</i></button>').join(''):'<div class="v160-fast-team-empty">No encontré equipos con esos filtros.</div>')+
      '</div>'+
    '</div>':'')+
  '</div>';
}

function v160FilterFastTeams(root){
  const q=norm(quickTeamQuery);
  let count=0;
  $$('[data-v160-fast-team-choice]',root).forEach(b=>{
    const name=b.dataset.v160FastTeamChoice||'';
    const cat=b.querySelector('small')?.textContent||'';
    const show=(quickTeamCategory==='Todas'||cat===quickTeamCategory)&&
      (quickTeamLetter==='Todas'||norm(name).startsWith(norm(quickTeamLetter)))&&
      (!q||norm(name+' '+cat).includes(q));
    b.hidden=!show;if(show)count++;
  });
  const n=$('.v160-fast-team-count b',root);if(n)n.textContent=String(count);
  const empty=$('.v160-fast-team-empty',root);
  if(empty)empty.hidden=count>0;
}

function fastToolsHtml(list){
  const previous=previousSeasonWithRecords(),count=[...selectedIds].filter(id=>list.some(r=>r.id===id)).length;
  return '<section class="v124-fast">'+
    '<header><small>REGISTRO RÁPIDO</small><h3>Acciones para muchos jugadores</h3><p>Renueva una temporada, cambia varios jugadores de equipo o pásalos a la siguiente temporada sin volver a capturar todo.</p></header>'+
    rosterImportHtml()+
    '<div class="v124-fast-top">'+
      '<button type="button" data-v124-renew '+(previous?'':'disabled')+'><b>↻ Renovar temporada</b><span>'+(previous?'Traer jugadores de '+esc(previous):'Sin temporada anterior guardada')+'</span></button>'+
      '<button type="button" data-v124-select-visible><b>☑ Seleccionar visibles</b><span>Marca rápidamente la lista filtrada</span></button>'+
    '</div>'+
    '<div class="v124-batch">'+
      '<div class="v124-selected"><b data-v124-selected-count>'+count+'</b><span>seleccionados</span><button type="button" data-v124-clear-selected>Limpiar</button></div>'+
      '<div class="v124-fast-team-field"><span>Cambiar de equipo</span>'+v160FastTeamPickerHtml()+'</div>'+
      '<button type="button" class="move" data-v124-move-selected>Mover seleccionados</button>'+
      '<label><span>Copiar a temporada</span><select data-v124-fast-season>'+targetSeasonOptions()+'</select></label>'+
      '<button type="button" data-v124-copy-season>Copiar seleccionados</button>'+
      '<button type="button" class="danger" data-v124-remove-selected>Dar de baja seleccionados</button>'+
    '</div>'+
  '</section>';
}
function updateSelectedUi(root=document){
  const count=selectedIds.size,n=$('[data-v124-selected-count]',root);if(n)n.textContent=String(count);
  $$('[data-v124-select]',root).forEach(c=>{c.checked=selectedIds.has(c.dataset.v124Select)});
}

function statusClass(r){
  if(r.source==='official'||r.officialPresent)return 'is-official';
  if(/habilitado|revisado/i.test(r.status||''))return 'is-ok';
  return 'is-pending';
}
function listHtml(list){
  if(!list.length)return '<div class="v124-empty"><b>Sin resultados con estos filtros</b><span>Cambia categoría, equipo, letra, origen o búsqueda.</span></div>';
  return list.map(r=>'<article class="v124-player-card" data-v124-id="'+esc(r.id)+'">'+
    '<div class="v124-card-main"><label class="v124-pick" aria-label="Seleccionar '+esc(r.name)+'"><input type="checkbox" data-v124-select="'+esc(r.id)+'" '+(selectedIds.has(r.id)?'checked':'')+'><span></span></label><span class="v124-avatar">'+esc(String(r.name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase())+'</span>'+
    '<span><b>'+esc(r.name)+'</b><small>'+esc(r.team)+' · '+esc(r.category||'Categoría por confirmar')+'</small>'+
    '<em class="'+statusClass(r)+'">'+esc(r.source==='official'?'Oficial en AdminFut':(r.officialPresent?'Coincide con AdminFut':r.status||'Pendiente'))+'</em></span></div>'+
    '<div class="v161-record-meta"><span><b>Origen</b>'+esc(recordOrigin(r))+'</span><span><b>Registró</b>'+esc(recordRegistrar(r))+'</span><span><b>Fecha de registro</b>'+esc(fmtRecordDate(r.createdAt||r.updatedAt))+'</span></div>'+
    '<div class="v124-card-actions"><button data-v124-edit="'+esc(r.id)+'">Revisar / corregir</button><button data-v124-card="'+esc(r.id)+'">Credencial</button><button class="danger" data-v124-delete="'+esc(r.id)+'">Borrar</button></div>'+
  '</article>').join('');
}
function managerHtml(){
  const season=selectedSeason(),list=seasonRecords(season),officialCount=list.filter(r=>r.source==='official'||r.officialPresent).length,pending=list.length-officialCount;
  return '<section class="v124-registry" id="v124-player-registry">'+
    '<header class="v124-head"><small>CONTROL POR TEMPORADA</small><h2>Registro de jugadores</h2><p>Revisa quién quedó guardado, corrige errores, genera la credencial y limpia registros cuando un jugador ya no corresponda a la temporada.</p></header>'+
    '<div class="v124-season-bar"><label><span>Temporada</span><select data-v124-season>'+allSeasons().map(s=>'<option '+(s===season?'selected':'')+'>'+esc(s)+'</option>').join('')+'</select></label>'+
      '<button data-v124-new-season>Nueva temporada</button></div>'+
    '<div class="v124-summary"><div><b>'+list.length+'</b><span>Registros</span></div><div><b>'+officialCount+'</b><span>Oficial / coincide</span></div><div><b>'+pending+'</b><span>Por revisar</span></div></div>'+
    fastToolsHtml(list)+
    '<div class="v124-primary-actions"><button class="primary" data-v124-save>Guardar / actualizar jugador</button><button data-v124-new>Nuevo registro</button><button data-v124-sync>Sincronizar con AdminFut</button></div>'+
    '<label class="v124-search"><span>Buscar en esta temporada</span><input type="search" data-v124-search placeholder="Nombre, equipo, origen o quién registró" value="'+esc(registryQuery)+'"></label>'+
    registryFilterHtml(list)+
    '<div class="v124-list" data-v124-list>'+listHtml(filterRegistry(list))+'</div>'+
    '<p class="v124-privacy">CURP, fecha de nacimiento y localidad capturadas aquí se conservan solo en este dispositivo; no se suben al repositorio público.</p>'+
  '</section>';
}
function bindManager(root){
  $('[data-v124-season]',root)?.addEventListener('change',e=>{selectedIds.clear();quickTeam='';quickSeason='';registryQuery='';registryCategory='Todas';registryTeam='Todos';registryLetter='Todas';registrySource='Todos';setSeason(e.target.value);localStorage.removeItem(EDIT_KEY);renderManager()});
  $('[data-v124-new-season]',root)?.addEventListener('click',()=>{selectedIds.clear();newSeason()});
  bindRosterImport(root);
  $('[data-v124-renew]',root)?.addEventListener('click',renewFromPrevious);
  $('[data-v124-select-visible]',root)?.addEventListener('click',()=>{
    const boxes=$$('[data-v124-select]',root),allSelected=boxes.length&&boxes.every(c=>selectedIds.has(c.dataset.v124Select));
    boxes.forEach(c=>{if(allSelected)selectedIds.delete(c.dataset.v124Select);else selectedIds.add(c.dataset.v124Select)});
    updateSelectedUi(root);
  });
  $('[data-v124-clear-selected]',root)?.addEventListener('click',()=>{selectedIds.clear();updateSelectedUi(root)});
  $('[data-v160-fast-team-open]',root)?.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    quickTeamPickerOpen=!quickTeamPickerOpen;
    filePickerCooldownUntil=Date.now()+900;
    renderManager(true);
  });
  $('[data-v160-fast-team-close]',root)?.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    quickTeamPickerOpen=false;quickTeamQuery='';quickTeamCategory='Todas';quickTeamLetter='Todas';
    renderManager(true);
  });
  $('[data-v160-fast-team-search]',root)?.addEventListener('input',e=>{
    quickTeamQuery=e.target.value||'';
    v160FilterFastTeams(root);
  });
  $$('[data-v160-fast-team-category]',root).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    quickTeamCategory=b.dataset.v160FastTeamCategory||'Todas';
    renderManager(true);
  }));
  $$('[data-v160-fast-team-letter]',root).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    quickTeamLetter=b.dataset.v160FastTeamLetter||'Todas';
    renderManager(true);
  }));
  $$('[data-v160-fast-team-choice]',root).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    quickTeam=b.dataset.v160FastTeamChoice||'';
    quickTeamPickerOpen=false;
    quickTeamQuery='';quickTeamCategory='Todas';quickTeamLetter='Todas';
    filePickerCooldownUntil=Date.now()+900;
    renderManager(true);
    toast('Equipo destino: '+quickTeam);
  }));
  $('[data-v124-fast-season]',root)?.addEventListener('pointerdown',()=>{filePickerCooldownUntil=Date.now()+900});
  $('[data-v124-fast-season]',root)?.addEventListener('change',e=>{quickSeason=e.target.value||'';filePickerCooldownUntil=Date.now()+900});
  $('[data-v124-move-selected]',root)?.addEventListener('click',moveSelectedTeam);
  $('[data-v124-copy-season]',root)?.addEventListener('click',copySelectedToSeason);
  $('[data-v124-remove-selected]',root)?.addEventListener('click',removeSelectedRecords);
  $('[data-v124-save]',root)?.addEventListener('click',saveForm);
  $('[data-v124-new]',root)?.addEventListener('click',clearForm);
  $('[data-v124-sync]',root)?.addEventListener('click',e=>{
    e.preventDefault();
    syncOfficialSeason(false);
    renderManager(true);
  });
  const search=$('[data-v124-search]',root);
  search?.addEventListener('input',()=>{registryQuery=search.value||'';applyRegistryFilters(root)});
  $('[data-v161-sort]',root)?.addEventListener('change',e=>{registrySort=e.target.value||'newest';applyRegistryFilters(root)});
  $('[data-v161-category]',root)?.addEventListener('change',e=>{registryCategory=e.target.value||'Todas';registryTeam='Todos';renderManager(true)});
  $('[data-v161-team]',root)?.addEventListener('change',e=>{registryTeam=e.target.value||'Todos';applyRegistryFilters(root)});
  $('[data-v161-source]',root)?.addEventListener('change',e=>{registrySource=e.target.value||'Todos';applyRegistryFilters(root)});
  $$('[data-v161-letter]',root).forEach(b=>b.addEventListener('click',()=>{
    registryLetter=b.dataset.v161Letter||'Todas';
    $$('[data-v161-letter]',root).forEach(x=>x.classList.toggle('active',x===b));
    applyRegistryFilters(root);
  }));
  bindList(root);
}
function bindList(root){
  $$('[data-v124-select]',root).forEach(c=>c.onchange=()=>{if(c.checked)selectedIds.add(c.dataset.v124Select);else selectedIds.delete(c.dataset.v124Select);updateSelectedUi(root)});
  $$('[data-v124-edit]',root).forEach(b=>b.onclick=()=>{const r=seasonRecords().find(x=>x.id===b.dataset.v124Edit);if(r)loadRecord(r)});
  $$('[data-v124-card]',root).forEach(b=>b.onclick=()=>{const r=seasonRecords().find(x=>x.id===b.dataset.v124Card);if(r)loadRecord(r)});
  $$('[data-v124-delete]',root).forEach(b=>b.onclick=()=>deleteRecord(b.dataset.v124Delete));
}
function renderManager(force=false){
  if(route()!=='credentialBuilder')return;
  const screen=$('#screen');if(!screen)return;
  const old=$('#v124-player-registry',screen),html=managerHtml();
  if(old&&html===lastManagerHtml&&!force){
    renderEligibility();
    return;
  }
  lastManagerHtml=html;
  if(old){old.outerHTML=html}else{
    const anchor=$('#v100-credential-extra',screen)||$('.v64-page',screen);
    if(anchor)anchor.insertAdjacentHTML('afterend',html);else screen.insertAdjacentHTML('beforeend',html);
  }
  const root=$('#v124-player-registry',screen);if(root)bindManager(root);
  renderEligibility();
}
function v124Dice(a,b){
  a=norm(a);b=norm(b);if(!a||!b)return 0;if(a===b)return 1;
  const grams=x=>{const z=' '+x+' ',m=[];for(let i=0;i<z.length-1;i++)m.push(z.slice(i,i+2));return m};
  const A=grams(a),B=grams(b),used=new Array(B.length).fill(false);let hit=0;
  for(const g of A){const j=B.findIndex((x,i)=>!used[i]&&x===g);if(j>=0){used[j]=true;hit++}}
  return (2*hit)/(A.length+B.length||1);
}
function v124NameParts(name){
  const p=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-ZÑ ]+/g,' ').split(/\s+/).filter(Boolean);
  if(p.length<3)return null;
  const maternal=p[p.length-1],paternal=p[p.length-2],given=p.slice(0,-2);
  const common=new Set(['JOSE','J','MARIA','MA','MA.']);
  const gi=(common.has(given[0])&&given[1]?given[1]:given[0])?.[0]||'X';
  const vowel=(paternal.slice(1).match(/[AEIOU]/)||['X'])[0];
  return {paternal,maternal,given,prefix:(paternal[0]||'X')+vowel+(maternal[0]||'X')+gi};
}
function v124Hamming(a,b){
  a=String(a||'');b=String(b||'');if(a.length!==b.length)return 99;
  let d=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++;return d;
}
function v124BadOcrName(name){
  const n=norm(name);if(!n||n.length<4||n.length>70)return true;
  if(/instituto|nacional|electoral|credencial|votar|mexico|mexicanos|fecha|nacim|domicilio|curp|clave|seccion|vigencia|emision|expedicion|municipio|localidad|poblacion|entidad|estado|sexo|dependencia|registro|calle|colonia|codigo|postal|cero|ano/.test(n))return true;
  const words=n.split(' ').filter(Boolean),connectors=new Set(['de','del','la','las','los','y']);
  const content=words.filter(w=>!connectors.has(w)),shorts=content.filter(w=>w.length<=2).length;
  const vowels=(n.match(/[aeiou]/g)||[]).length;
  if(content.length<2||content.length>5||shorts/Math.max(1,content.length)>.25||vowels<2)return true;
  return false;
}
function v124Levenshtein(a,b){
  a=norm(a);b=norm(b);
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=0;i<=m;i++)dp[i][0]=i;for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}
function v124TokenSim(a,b){
  a=norm(a);b=norm(b);if(!a||!b)return 0;if(a===b)return 1;
  const lev=1-v124Levenshtein(a,b)/Math.max(a.length,b.length,1);
  return Math.max(v124Dice(a,b),lev);
}
function bestOfficialFromOcr(text,curp='',selectedTeam=''){
  const raw=String(text||''),nraw=norm(raw);
  const lines=raw.split(/\r?\n/).map(norm).filter(x=>x.length>=3&&x.length<=120);
  const tokens=nraw.split(' ').filter(x=>x.length>=3);
  const curpPrefix=String(curp||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4);
  const teamNorm=norm(selectedTeam);
  if(!lines.length&&!tokens.length&&!curpPrefix)return null;
  const stop=new Set(['instituto','nacional','electoral','credencial','votar','mexico','mexicanos','domicilio','municipio','seccion','vigencia','nombre','fecha','nacimiento','emision']);
  let best=null,bestScore=-1,second=-1;
  for(const p of officialPlayers()){
    const n=norm(p.name),words=n.split(' ').filter(x=>x.length>=3&&!stop.has(x));
    let score=0,exactCount=0,fuzzyCount=0;
    for(const l of lines)score=Math.max(score,v124Dice(n,l)*.48);
    for(const w of words){
      const exact=tokens.includes(w);
      const fuzzy=Math.max(0,...tokens.map(t=>v124TokenSim(w,t)));
      if(exact){exactCount++;score+=w.length>=5?.17:.11}
      else if(fuzzy>=.58){fuzzyCount++;score+=(fuzzy>=.78?.12:.07)}
    }
    if(exactCount>=1&&fuzzyCount>=1)score+=.20;
    if(exactCount+fuzzyCount>=2)score+=.14;

    const np=v124NameParts(p.name);
    if(curpPrefix&&np){
      const dist=v124Hamming(curpPrefix,np.prefix);
      if(dist===0)score+=.62;
      else if(dist===1)score+=.48;
      else if(dist===2)score+=.12;
    }
    if(teamNorm&&norm(p.team)===teamNorm)score+=.08;

    if(score>bestScore){second=bestScore;bestScore=score;best=p}
    else if(score>second)second=score;
  }
  if(best&&bestScore>=.58&&(bestScore-second>=.09||bestScore>=.88))return {...best,matchScore:bestScore};
  return null;
}
function v124CurpValue(ch){
  const chars='0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  return chars.indexOf(ch);
}
function v124CurpCheckDigit(curp){
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9Ñ]/g,'');
  if(c.length!==18)return null;
  let sum=0;
  for(let i=0;i<17;i++){const v=v124CurpValue(c[i]);if(v<0)return null;sum+=v*(18-i)}
  return (10-(sum%10))%10;
}
function v124CurpValid(curp){
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(c))return false;
  const expected=v124CurpCheckDigit(c);return expected!==null&&String(expected)===c[17];
}
function v124RawCurpCandidate(text){
  const raw=String(text||'').toUpperCase(),lines=raw.split(/\r?\n/),out=[];
  for(const line of lines){
    const cleaned=line.replace(/CURP\s*[:\-]?/g,' ').replace(/[^A-Z0-9]/g,'');
    for(let i=0;i<=cleaned.length-18;i++)out.push(cleaned.slice(i,i+18));
    const tokens=line.replace(/[^A-Z0-9]+/g,' ').split(/\s+/).filter(Boolean);
    for(let a=0;a<tokens.length;a++){
      let joined='';
      for(let b=a;b<Math.min(tokens.length,a+5)&&joined.length<=18;b++){joined+=tokens[b];if(joined.length===18)out.push(joined)}
    }
  }
  return out;
}
function v124CurpEntityValid(curp){
  const code=String(curp||'').slice(11,13);
  return new Set(['AS','BC','BS','CC','CL','CM','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN','MS','NT','NL','OC','PL','QT','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS','NE']).has(code);
}
function v124CurpDateValid(curp){
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(c.length!==18)return false;
  const yy=Number(c.slice(4,6)),mm=Number(c.slice(6,8)),dd=Number(c.slice(8,10));
  if(!Number.isFinite(yy)||mm<1||mm>12||dd<1||dd>31)return false;
  const century=/\d/.test(c[16])?1900:2000,year=century+yy,d=new Date(Date.UTC(year,mm-1,dd));
  return d.getUTCFullYear()===year&&d.getUTCMonth()===mm-1&&d.getUTCDate()===dd;
}
function v124RecoverCurp(text,name,current=''){
  const parts=v124NameParts(name);
  const candidates=[String(current||'').toUpperCase().replace(/[^A-Z0-9]/g,''),...v124RawCurpCandidate(text)];
  const digitMap={O:'0',Q:'0',D:'0',I:'1',L:'1',Z:'2',S:'5',G:'6',B:'8'};
  const letterMap={'0':'O','1':'I','2':'Z','5':'S','6':'G','8':'B'};
  let fallback='';
  for(let raw of candidates){
    raw=String(raw||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(raw.length!==18)continue;
    let a=raw.split('');
    for(let i=0;i<18;i++){
      if((i>=4&&i<=9)||i===17)a[i]=/\d/.test(a[i])?a[i]:(digitMap[a[i]]||a[i]);
      else if((i<=3)||(i>=11&&i<=15))a[i]=/[A-Z]/.test(a[i])?a[i]:(letterMap[a[i]]||a[i]);
      else if(i===10&&a[i]!=='H'&&a[i]!=='M'&&a[i]==='N')a[i]='M';
    }
    let fixed=a.join('');
    if(parts)fixed=parts.prefix+fixed.slice(4);
    if(!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(fixed))continue;
    if(!v124CurpEntityValid(fixed)||!v124CurpDateValid(fixed))continue;
    if(v124CurpValid(fixed))return fixed;

    // Si todo salvo el último dígito es coherente, corrige sólo el verificador.
    const expected=v124CurpCheckDigit(fixed);
    if(expected!==null){
      const repaired=fixed.slice(0,17)+String(expected);
      if(v124CurpValid(repaired))fallback=repaired;
    }
  }
  if(fallback)return fallback;
  const cleanCurrent=String(current||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  return v124CurpValid(cleanCurrent)?cleanCurrent:'';
}
function v124IneNameGuess(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.replace(/[|]/g,'I').replace(/\s+/g,' ').trim()).filter(Boolean);
  const i=lines.findIndex(x=>/\bNOMBRE(?:S)?\b/i.test(x));if(i<0)return '';
  const clean=x=>String(x||'').replace(/NOMBRE(?:S)?/ig,' ').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]/g,' ').replace(/\s+/g,' ').trim();
  const parts=[],same=clean(lines[i]);
  if(same&&!v124BadOcrName(same)&&same.split(/\s+/).length<=5)parts.push(same);
  for(let j=i+1;j<Math.min(lines.length,i+6);j++){
    if(/^(DOMICILIO|CLAVE|CURP|FECHA|SEXO|ESTADO|MUNICIPIO|LOCALIDAD|CIUDAD|COMUNIDAD|ENTIDAD|SECCI[ÓO]N|VIGENCIA|A[NÑ]O)\b/i.test(lines[j]))break;
    const p=clean(lines[j]);if(p&&p.split(/\s+/).length<=4)parts.push(p);
    if(parts.length>=3)break;
  }
  if(parts.length>=3)return (parts.slice(2).join(' ')+' '+parts[0]+' '+parts[1]).replace(/\s+/g,' ').trim();
  if(parts.length===1){
    const w=parts[0].split(/\s+/);if(w.length>=3)return (w.slice(2).join(' ')+' '+w[0]+' '+w[1]).trim();
  }
  return '';
}
function v124RawNameGuess(text){
  const ine=v124IneNameGuess(text);if(ine&&!v124BadOcrName(ine))return ine;
  const bad=/instituto|nacional|electoral|credencial|votar|mexico|méxico|mexicanos|domicilio|municipio|seccion|vigencia|emision|emisión|expedicion|expedición|curp|clave|fecha|nacimiento|sexo|entidad|estado|localidad|poblacion|población|dependencia|registro|calle|colonia|codigo|código|postal|cero/i;
  const lines=String(text||'').split(/\r?\n/).map(x=>x
    .replace(/NOMBRE(?:S)?/ig,' ').replace(/APELLIDO(?:S)?/ig,' ')
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]/g,' ').replace(/\s+/g,' ').trim()
  ).filter(Boolean);
  const list=lines.map(x=>{
    const words=x.split(/\s+/).filter(w=>w.length>=2),shorts=words.filter(w=>w.length<=2).length;
    const letters=(x.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g)||[]).length,vowels=(x.match(/[AEIOUÁÉÍÓÚÜaeiouáéíóúü]/g)||[]).length;
    const score=(words.length>=2?30:0)+(words.length>=3?22:0)+(words.length<=5?12:0)+Math.min(35,letters);
    return {x,words,shorts,vowels,score};
  }).filter(o=>o.words.length>=2&&o.words.length<=5&&o.shorts/o.words.length<=.25&&o.vowels>=2&&o.x.length>=5&&o.x.length<=70&&!bad.test(o.x))
    .sort((a,b)=>b.score-a.score);
  return list[0]?.x||'';
}
function bindOcrAssist(){
  const btn=$('[data-v64-ocr]');if(!btn||btn.dataset.v124Bound)return;btn.dataset.v124Bound='1';
  btn.addEventListener('click',()=>{
    const timer=setInterval(()=>{
      if(btn.disabled)return;
      clearInterval(timer);
      const raw=$('[data-v64-ocr-text]')?.value||'',name=$('[data-v64-cred-name]')?.value||'',curp=$('[data-v64-cred-curp]')?.value||'',team=$('[data-v64-cred-team]')?.value||'';
      const exact=!v124BadOcrName(name)?officialPlayers().find(p=>norm(p.name)===norm(name)):null;
      const guess=exact||bestOfficialFromOcr(raw,curp,team);
      if(guess){
        if(v124BadOcrName(name)||guess.matchScore>=.72||v124Dice(name,guess.name)>=.45)setValue('[data-v64-cred-name]',guess.name);
        const fixedCurp=v124RecoverCurp(raw,guess.name,curp);
        if(fixedCurp)setValue('[data-v64-cred-curp]',fixedCurp);
        if(!team){
          setValue('[data-v64-cred-team]',guess.team);
          setValue('[data-v64-cred-cat]',guess.category);
        }
        toast('Nombre completo reconocido: '+guess.name);
      }else if(v124BadOcrName(name)){
        if(name)setValue('[data-v64-cred-name]','');
        const fallback=v124RawNameGuess(raw);
        if(fallback&&!v124BadOcrName(fallback)){
          setValue('[data-v64-cred-name]',fallback);
          const fixedCurp=v124RecoverCurp(raw,fallback,curp);
          if(fixedCurp)setValue('[data-v64-cred-curp]',fixedCurp);
          toast('Lectura recuperada. Revisa nombre y CURP antes de guardar');
        }else{
          const recovered=v124RecoverCurp(raw,'',curp);
          if(recovered)setValue('[data-v64-cred-curp]',recovered);
          else if(curp&&!v124CurpValid(curp))setValue('[data-v64-cred-curp]','');
          toast(recovered?'CURP recuperada; falta confirmar el nombre':'No encontré un nombre confiable todavía; intenta detectar de nuevo');
        }
      }else{
        const fixedCurp=v124RecoverCurp(raw,name,curp);
        if(fixedCurp&&fixedCurp!==curp)setValue('[data-v64-cred-curp]',fixedCurp);
        else if(curp&&!v124CurpValid(curp))setValue('[data-v64-cred-curp]','');
      }
      renderEligibility();
      renderManager();
    },300);
    setTimeout(()=>clearInterval(timer),45000);
  });
}
function autoOfficialSync(){
  const season=selectedSeason(),x=store(),official=officialPlayers();
  if(!official.length)return;
  const capture=String(window.LJR_OFFICIAL_DATA?.captured_at_utc||'');
  const syncKey='v124-last-official-capture:'+season;
  const last=localStorage.getItem(syncKey)||'';
  if(!x.seasons[season]){x.seasons[season]=[];saveStore(x)}
  if(season===currentSeason()&&capture&&capture!==last){
    syncOfficialSeason(true);localStorage.setItem(syncKey,capture);
  }else if(!seasonRecords(season).length&&season===currentSeason()){
    syncOfficialSeason(true);if(capture)localStorage.setItem(syncKey,capture);
  }
}
function bindCredentialAutoSave(){
  ['[data-v100-credential-png]','[data-v100-credential-pdf]','[data-v100-credential-share]','[data-v64-download-credential-png]','[data-v64-print-credential]'].forEach(sel=>{
    const b=$(sel);if(!b||b.dataset.v124AutoSave)return;b.dataset.v124AutoSave='1';
    b.addEventListener('click',e=>{
      const eligibility=v124Eligibility();
      if(!eligibility.ok){
        e.preventDefault();e.stopImmediatePropagation();renderEligibility();toast(eligibility.message);return;
      }
      const name=$('[data-v64-cred-name]')?.value.trim()||'',team=$('[data-v64-cred-team]')?.value||'';
      if(name&&team)saveForm(true);
    },{capture:true});
  });
}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(()=>{if(route()!=='credentialBuilder')return;v126CleanupNonPlayers();autoOfficialSync();renderManager();bindOcrAssist();bindCredentialAutoSave();bindEligibility()},140)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
window.addEventListener('load',schedule);schedule();setTimeout(schedule,1200);
window.LJR_PLAYER_REGISTRY={sync:syncOfficialSeason,records:seasonRecords,officialPlayers};
})();