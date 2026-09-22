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
let rosterImportTeam='';
let rosterTeamPickerOpen=false;
let rosterTeamQuery='';
let rosterImportFile=null;
let rosterImport={fileName:'',rawText:'',entries:[],missing:[],status:'',busy:false};
let lastManagerHtml='';
let filePickerCooldownUntil=0;

function toast(msg){
  let n=$('.v124-toast');if(n)n.remove();
  n=document.createElement('div');n.className='v124-toast';n.textContent=msg;document.body.appendChild(n);
  setTimeout(()=>n.remove(),2400);
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
      if(old.source==='official')old.status='Oficial en AdminFut';
      kept++;continue;
    }
    const rec={id:uid(),name:p.name,team:p.team,category:p.category,catId:p.catId,season,
      status:'Oficial en AdminFut',source:'official',officialPresent:true,officialCheckedAt:now,
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
  const source=idx>=0?list[idx].source:'local';
  const rec={...(idx>=0?list[idx]:{}),...data,id:idx>=0?list[idx].id:uid(),source,
    officialPresent:!!hit,officialCheckedAt:now,createdAt:idx>=0?list[idx].createdAt||now:now,updatedAt:now};
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
    const copy={...r,id:uid(),season:to,source:'local',officialPresent:false,
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
async function v126OcrImage(source,label='imagen'){
  const T=await v126Tesseract();
  const result=await T.recognize(source,'spa',{
    logger:m=>{
      if(m?.status==='recognizing text'){
        const pct=Math.round((m.progress||0)*100);
        v126SetImportStatus('Leyendo '+label+' · '+pct+'%');
      }else if(m?.status)v126SetImportStatus('Procesando '+label+'…');
    }
  });
  return result?.data?.text||'';
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
      v126SetImportStatus('OCR local del PDF · página '+(i+1)+' de '+ocrPages.length);
      const res=await T.recognize(canvas,'spa');
      if(res?.data?.text)textParts.push(res.data.text);
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
function v126Nameish(value){
  let s=String(value||'')
    .replace(/[|•·]+/g,' ')
    .replace(/^\s*(?:NO\.?|NÚM(?:ERO)?\.?|#)?\s*\d{1,3}\s*[\)\].:\-–—]?\s*/i,'')
    .replace(/\b(?:TEL|TELEFONO|TELÉFONO|CURP|EDAD|FECHA|FIRMA|POSICION|POSICIÓN)\b.*$/i,'')
    .replace(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b.*$/,'')
    .replace(/\s+/g,' ').trim();
  const stop=/^(lista|jugadores?|plantilla|equipo|delegado|temporada|categoria|categoría|registro|nombre|nombres|apellidos?|numero|número|liga|municipal|futbol|fútbol|juventino|rosas|guanajuato|firma|credencial|telefono|teléfono|fecha|curp)\b/i;
  if(!s||stop.test(s)||/@/.test(s)||s.length<5||s.length>80)return '';
  const parts=s.split(/\s+/).filter(Boolean);
  const words=[];
  for(const p of parts){
    if(/\d/.test(p)){if(words.length>=2)break;continue}
    const clean=p.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’-]/g,'');
    if(clean.length>=2)words.push(clean);
    if(words.length>=6)break;
  }
  if(words.length<2)return '';
  const candidate=words.join(' ');
  if(stop.test(candidate))return '';
  return candidate.replace(/\b\w/g,m=>m.toUpperCase());
}
function v126ExtractCandidates(text){
  const known=v126KnownPeople(),found=new Map(),raw=String(text||''),flat=norm(raw);
  // Primero reconoce nombres ya conocidos aunque estén en una tabla o renglón ruidoso.
  for(const p of known){
    const n=norm(p.name);if(n.length>=5&&flat.includes(n))found.set(n,p.name);
  }
  // Después agrega nombres nuevos que aparezcan como renglones.
  for(const line of raw.split(/\r?\n/)){
    const pieces=line.split(/\t| {2,}|;/).map(x=>x.trim()).filter(Boolean);
    const pool=pieces.length>1?pieces:[line];
    let best='';
    for(const piece of pool){
      const c=v126Nameish(piece);
      if(c&&c.length>best.length)best=c;
    }
    if(!best)continue;
    const n=norm(best);
    if(!n||found.has(n))continue;
    const near=[...found.keys()].some(k=>v124TokenSim(k,n)>.92);
    if(!near)found.set(n,best);
  }
  return [...found.values()];
}
function v126BestKnown(name,team=''){
  const n=norm(name),target=norm(team),known=v126KnownPeople();
  let best=null,score=0;
  for(const r of known){
    let s=v124TokenSim(n,r.name);
    if(target&&norm(r.team)===target)s+=.035;
    if(s>score){score=s;best=r}
  }
  return score>=.80?{record:best,score}:null;
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
    entries.push({name:canonical,rawName,status,source,include:true,score:hit?.score||0});
  }
  const importedNorm=new Set(entries.map(e=>norm(e.name)));
  const missing=current.filter(r=>norm(r.team)===norm(team)&&!importedNorm.has(norm(r.name))).map(r=>({...r,remove:false}));
  rosterImport={...rosterImport,rawText:String(text||''),entries,missing,status:'',busy:false};
}
function v126ImportSummary(){
  const e=rosterImport.entries||[],count=k=>e.filter(x=>x.status===k).length;
  return {total:e.length,keep:count('keep'),transfer:count('transfer'),returning:count('return'),fresh:count('new'),missing:(rosterImport.missing||[]).length};
}
function v126RosterStatusLabel(e){
  if(e.status==='keep')return 'Ya está en este equipo';
  if(e.status==='transfer')return 'Ya registrado · cambio de equipo';
  if(e.status==='return')return 'Ya registrado · renovar temporada';
  return 'Nuevo · faltan datos/foto';
}
function v126RosterResultHtml(){
  if(!(rosterImport.entries||[]).length&&!rosterImport.rawText)return '';
  const s=v126ImportSummary();
  return '<div class="v126-result">'+
    '<div class="v126-summary"><div><b>'+s.total+'</b><span>Detectados</span></div><div><b>'+s.keep+'</b><span>Ya están</span></div><div><b>'+s.transfer+'</b><span>Cambios</span></div><div><b>'+s.fresh+'</b><span>Nuevos</span></div></div>'+
    '<div class="v126-detected">'+(rosterImport.entries||[]).map((e,i)=>
      '<label class="v126-person '+esc(e.status)+'"><input type="checkbox" data-v126-include="'+i+'" '+(e.include?'checked':'')+'><span class="v126-check"></span><span class="v126-person-copy"><b>'+esc(e.name)+'</b><small>'+esc(v126RosterStatusLabel(e))+(e.source?.team&&e.status==='transfer'?' · antes: '+esc(e.source.team):'')+'</small></span></label>'
    ).join('')+'</div>'+
    ((rosterImport.missing||[]).length?'<div class="v126-missing"><div class="v126-missing-head"><span><b>No aparecen en la lista</b><small>No se borran automáticamente; marca solo los que realmente salen del equipo.</small></span><button type="button" data-v126-mark-missing>Marcar todos</button></div>'+
      rosterImport.missing.map((r,i)=>'<label><input type="checkbox" data-v126-remove="'+i+'" '+(r.remove?'checked':'')+'><span>'+esc(r.name)+'</span></label>').join('')+
    '</div>':'')+
    '<details class="v126-raw"><summary>Ver / corregir texto detectado</summary><textarea data-v126-raw-text>'+esc(rosterImport.rawText||'')+'</textarea><button type="button" data-v126-reanalyse>Volver a analizar este texto</button></details>'+
    '<button type="button" class="v126-apply" data-v126-apply>Aplicar altas, cambios y bajas marcadas</button>'+
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
    '<button type="button" class="v126-file" data-v126-file-pick><span><b>Elegir lista del delegado</b><small>Imagen · PDF · Word DOCX · TXT · CSV</small></span></button>'+
    '<input class="v126-file-input" type="file" data-v126-file accept="image/*,.pdf,.docx,.txt,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" tabindex="-1" aria-hidden="true">'+
    '<div class="v126-file-name">'+esc(rosterImport.fileName||'Ningún archivo seleccionado')+'</div>'+
    '<button type="button" class="v126-analyse" data-v126-analyse '+(rosterImport.busy?'disabled':'')+'>'+(rosterImport.busy?'Leyendo lista…':'Detectar y comparar jugadores')+'</button>'+
    '<p class="v126-status" data-v126-import-status>'+esc(rosterImport.status||'OCR local: no usa Google Lens y no envía la lista a GitHub.')+'</p>'+
    v126RosterResultHtml()+
  '</section>';
}
function v126ApplyRoster(){
  if(!rosterImportTeam)return toast('Elige el equipo de la lista');
  const entries=(rosterImport.entries||[]).filter(e=>e.include),removals=(rosterImport.missing||[]).filter(r=>r.remove);
  if(!entries.length&&!removals.length)return toast('No hay cambios marcados para aplicar');
  const summary=v126ImportSummary();
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
    $('[data-v126-team-choice]',root).forEach(b=>{
      const txt=norm(b.textContent||'');b.hidden=!!q&&!txt.includes(q);
    });
  });
  $('[data-v126-team-choice]',root).forEach(b=>b.addEventListener('click',e=>{
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
      v126AnalyzeText(text);rosterImport.fileName=rosterImportFile.name;
      toast('Lista detectada. Revisa coincidencias antes de aplicar.');
      renderManager();
    }catch(err){
      rosterImport.busy=false;v126SetImportStatus(err?.message||'No se pudo leer la lista');
      if(btn){btn.disabled=false;btn.textContent='Detectar y comparar jugadores'}
      toast(err?.message||'No se pudo leer la lista');
    }
  });
  $$('[data-v126-include]',root).forEach(c=>c.onchange=()=>{const e=rosterImport.entries?.[Number(c.dataset.v126Include)];if(e)e.include=c.checked});
  $$('[data-v126-remove]',root).forEach(c=>c.onchange=()=>{const r=rosterImport.missing?.[Number(c.dataset.v126Remove)];if(r)r.remove=c.checked});
  $('[data-v126-mark-missing]',root)?.addEventListener('click',()=>{for(const r of rosterImport.missing||[])r.remove=true;renderManager()});
  $('[data-v126-reanalyse]',root)?.addEventListener('click',()=>{
    const text=$('[data-v126-raw-text]',root)?.value||'';
    try{v126AnalyzeText(text);renderManager()}catch(err){toast(err?.message||'No se pudo analizar el texto')}
  });
  $('[data-v126-apply]',root)?.addEventListener('click',v126ApplyRoster);
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
      '<label><span>Cambiar de equipo</span><select data-v124-fast-team>'+teamPickerOptions()+'</select></label>'+
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
  if(!list.length)return '<div class="v124-empty"><b>Sin registros en esta temporada</b><span>Guarda un jugador nuevo o sincroniza con AdminFut.</span></div>';
  return list.map(r=>'<article class="v124-player-card" data-v124-id="'+esc(r.id)+'">'+
    '<div class="v124-card-main"><label class="v124-pick" aria-label="Seleccionar '+esc(r.name)+'"><input type="checkbox" data-v124-select="'+esc(r.id)+'" '+(selectedIds.has(r.id)?'checked':'')+'><span></span></label><span class="v124-avatar">'+esc(String(r.name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase())+'</span>'+
    '<span><b>'+esc(r.name)+'</b><small>'+esc(r.team)+' · '+esc(r.category||'Categoría por confirmar')+'</small>'+
    '<em class="'+statusClass(r)+'">'+esc(r.source==='official'?'Oficial en AdminFut':(r.officialPresent?'Coincide con AdminFut':r.status||'Pendiente'))+'</em></span></div>'+
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
    '<label class="v124-search"><span>Buscar en esta temporada</span><input type="search" data-v124-search placeholder="Nombre o equipo"></label>'+
    '<div class="v124-list" data-v124-list>'+listHtml(list)+'</div>'+
    '<p class="v124-privacy">CURP, fecha de nacimiento y localidad capturadas aquí se conservan solo en este dispositivo; no se suben al repositorio público.</p>'+
  '</section>';
}
function bindManager(root){
  $('[data-v124-season]',root)?.addEventListener('change',e=>{selectedIds.clear();quickTeam='';quickSeason='';setSeason(e.target.value);localStorage.removeItem(EDIT_KEY);renderManager()});
  $('[data-v124-new-season]',root)?.addEventListener('click',()=>{selectedIds.clear();newSeason()});
  bindRosterImport(root);
  $('[data-v124-renew]',root)?.addEventListener('click',renewFromPrevious);
  $('[data-v124-select-visible]',root)?.addEventListener('click',()=>{
    const boxes=$$('[data-v124-select]',root),allSelected=boxes.length&&boxes.every(c=>selectedIds.has(c.dataset.v124Select));
    boxes.forEach(c=>{if(allSelected)selectedIds.delete(c.dataset.v124Select);else selectedIds.add(c.dataset.v124Select)});
    updateSelectedUi(root);
  });
  $('[data-v124-clear-selected]',root)?.addEventListener('click',()=>{selectedIds.clear();updateSelectedUi(root)});
  $('[data-v124-fast-team]',root)?.addEventListener('pointerdown',()=>{filePickerCooldownUntil=Date.now()+900});
  $('[data-v124-fast-team]',root)?.addEventListener('change',e=>{quickTeam=e.target.value||'';filePickerCooldownUntil=Date.now()+900});
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
  search?.addEventListener('input',()=>{const q=norm(search.value),list=seasonRecords().filter(r=>!q||norm(r.name).includes(q)||norm(r.team).includes(q));$('[data-v124-list]',root).innerHTML=listHtml(list);bindList(root)});
  bindList(root);
}
function bindList(root){
  $$('[data-v124-select]',root).forEach(c=>c.onchange=()=>{if(c.checked)selectedIds.add(c.dataset.v124Select);else selectedIds.delete(c.dataset.v124Select);updateSelectedUi(root)});
  $('[data-v124-edit]',root).forEach(b=>b.onclick=()=>{const r=seasonRecords().find(x=>x.id===b.dataset.v124Edit);if(r)loadRecord(r)});
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
let t=0;function schedule(){clearTimeout(t);t=setTimeout(()=>{if(route()!=='credentialBuilder')return;autoOfficialSync();renderManager();bindOcrAssist();bindCredentialAutoSave();bindEligibility()},140)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
window.addEventListener('load',schedule);schedule();setTimeout(schedule,1200);
window.LJR_PLAYER_REGISTRY={sync:syncOfficialSeason,records:seasonRecords,officialPlayers};
})();