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
  toast('Formulario listo para un jugador nuevo');
  schedule();
}
function saveForm(silent=false){
  const data=captureForm();
  if(!data.name)return toast('Falta el nombre del jugador');
  if(!data.team)return toast('Selecciona el equipo; la categoría se asigna sola');
  if(!data.category)return toast('No se encontró la categoría oficial de ese equipo');
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
  toast('Temporada '+next+' creada. Sincroniza cuando AdminFut publique el nuevo padrón.');renderManager();
}

function statusClass(r){
  if(r.source==='official'||r.officialPresent)return 'is-official';
  if(/habilitado|revisado/i.test(r.status||''))return 'is-ok';
  return 'is-pending';
}
function listHtml(list){
  if(!list.length)return '<div class="v124-empty"><b>Sin registros en esta temporada</b><span>Guarda un jugador nuevo o sincroniza con AdminFut.</span></div>';
  return list.map(r=>'<article class="v124-player-card" data-v124-id="'+esc(r.id)+'">'+
    '<div class="v124-card-main"><span class="v124-avatar">'+esc(String(r.name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase())+'</span>'+
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
    '<div class="v124-primary-actions"><button class="primary" data-v124-save>Guardar / actualizar jugador</button><button data-v124-new>Nuevo registro</button><button data-v124-sync>Sincronizar con AdminFut</button></div>'+
    '<label class="v124-search"><span>Buscar en esta temporada</span><input type="search" data-v124-search placeholder="Nombre o equipo"></label>'+
    '<div class="v124-list" data-v124-list>'+listHtml(list)+'</div>'+
    '<p class="v124-privacy">CURP, fecha de nacimiento y localidad capturadas aquí se conservan solo en este dispositivo; no se suben al repositorio público.</p>'+
  '</section>';
}
function bindManager(root){
  $('[data-v124-season]',root)?.addEventListener('change',e=>{setSeason(e.target.value);localStorage.removeItem(EDIT_KEY);renderManager()});
  $('[data-v124-new-season]',root)?.addEventListener('click',newSeason);
  $('[data-v124-save]',root)?.addEventListener('click',saveForm);
  $('[data-v124-new]',root)?.addEventListener('click',clearForm);
  $('[data-v124-sync]',root)?.addEventListener('click',()=>{syncOfficialSeason(false);renderManager()});
  const search=$('[data-v124-search]',root);
  search?.addEventListener('input',()=>{const q=norm(search.value),list=seasonRecords().filter(r=>!q||norm(r.name).includes(q)||norm(r.team).includes(q));$('[data-v124-list]',root).innerHTML=listHtml(list);bindList(root)});
  bindList(root);
}
function bindList(root){
  $$('[data-v124-edit]',root).forEach(b=>b.onclick=()=>{const r=seasonRecords().find(x=>x.id===b.dataset.v124Edit);if(r)loadRecord(r)});
  $$('[data-v124-card]',root).forEach(b=>b.onclick=()=>{const r=seasonRecords().find(x=>x.id===b.dataset.v124Card);if(r)loadRecord(r)});
  $$('[data-v124-delete]',root).forEach(b=>b.onclick=()=>deleteRecord(b.dataset.v124Delete));
}
function renderManager(){
  if(route()!=='credentialBuilder')return;
  const screen=$('#screen');if(!screen)return;
  const old=$('#v124-player-registry',screen),html=managerHtml();
  if(old){old.outerHTML=html}else{
    const anchor=$('#v100-credential-extra',screen)||$('.v64-page',screen);
    if(anchor)anchor.insertAdjacentHTML('afterend',html);else screen.insertAdjacentHTML('beforeend',html);
  }
  const root=$('#v124-player-registry',screen);if(root)bindManager(root);
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
  const n=norm(name);
  if(!n||n.length<4||n.length>70)return true;
  if(/instituto|electoral|credencial|votar|fecha|nacim|domicilio|curp|clave|seccion|vigencia/.test(n))return true;
  const words=n.split(' ').filter(Boolean);
  return words.length<2;
}
function bestOfficialFromOcr(text,curp='',selectedTeam=''){
  const raw=String(text||''),nraw=norm(raw);
  const lines=raw.split(/\r?\n/).map(norm).filter(x=>x.length>=4&&x.length<=120);
  const tokens=nraw.split(' ').filter(x=>x.length>=3);
  const curpPrefix=String(curp||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4);
  const teamNorm=norm(selectedTeam);
  if(!lines.length&&!tokens.length&&!curpPrefix)return null;
  const stop=new Set(['instituto','nacional','electoral','credencial','votar','mexico','mexicanos','domicilio','municipio','seccion','vigencia','nombre','fecha','nacimiento']);
  let best=null,bestScore=-1,second=-1;
  for(const p of officialPlayers()){
    const n=norm(p.name),words=n.split(' ').filter(x=>x.length>=3);
    let score=0;
    for(const l of lines)score=Math.max(score,v124Dice(n,l)*.55);
    let matched=0;
    for(const w of words){
      if(stop.has(w))continue;
      const exact=tokens.includes(w),fuzzy=Math.max(0,...tokens.map(t=>v124Dice(w,t)));
      if(exact){matched++;score+=w.length>=5?.13:.08}
      else if(fuzzy>=.82){matched++;score+=w.length>=5?.09:.05}
    }
    if(matched>=2)score+=.18;
    const np=v124NameParts(p.name);
    if(curpPrefix&&np){
      const dist=v124Hamming(curpPrefix,np.prefix);
      if(dist===0)score+=.55;
      else if(dist===1)score+=.38;
      else if(dist===2)score+=.08;
    }
    if(teamNorm&&norm(p.team)===teamNorm)score+=.22;
    else if(teamNorm)score-=.05;
    if(score>bestScore){second=bestScore;bestScore=score;best=p}else if(score>second)second=score;
  }
  if(best&&bestScore>=.60&&(bestScore-second>=.10||bestScore>=.92))return {...best,matchScore:bestScore};
  return null;
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
        if(v124BadOcrName(name)||v124Dice(name,guess.name)>=.45)setValue('[data-v64-cred-name]',guess.name);
        if(!team||norm(team)===norm(guess.team))setValue('[data-v64-cred-team]',guess.team);
        setValue('[data-v64-cred-cat]',guess.category);
        toast('Nombre completo reconocido: '+guess.name);
      }else if(v124BadOcrName(name)){
        setValue('[data-v64-cred-name]','');
        toast('No pude confirmar el nombre completo; intenta otra foto más recta y cercana');
      }
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
  ['[data-v100-credential-png]','[data-v100-credential-share]','[data-v64-print-credential]'].forEach(sel=>{
    const b=$(sel);if(!b||b.dataset.v124AutoSave)return;b.dataset.v124AutoSave='1';
    b.addEventListener('click',()=>{
      const name=$('[data-v64-cred-name]')?.value.trim()||'',team=$('[data-v64-cred-team]')?.value||'';
      if(name&&team)saveForm(true);
    },{capture:true});
  });
}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(()=>{if(route()!=='credentialBuilder')return;autoOfficialSync();renderManager();bindOcrAssist();bindCredentialAutoSave()},140)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
window.addEventListener('load',schedule);schedule();setTimeout(schedule,1200);
window.LJR_PLAYER_REGISTRY={sync:syncOfficialSeason,records:seasonRecords,officialPlayers};
})();