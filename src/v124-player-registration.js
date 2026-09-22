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
  toast('Formulario listo para un jugador nuevo');
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
  const n=norm(name);
  if(!n||n.length<4||n.length>70)return true;
  if(/instituto|electoral|credencial|votar|fecha|nacim|domicilio|curp|clave|seccion|vigencia/.test(n))return true;
  const words=n.split(' ').filter(Boolean);
  return words.length<2;
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
function v124RecoverCurp(text,name,current=''){
  const parts=v124NameParts(name);if(!parts)return current||'';
  const candidates=[String(current||'').toUpperCase().replace(/[^A-Z0-9]/g,''),...v124RawCurpCandidate(text)];
  const digitMap={O:'0',Q:'0',D:'0',I:'1',L:'1',Z:'2',S:'5',G:'6',B:'8'};
  const letterMap={'0':'O','1':'I','2':'Z','5':'S','6':'G','8':'B'};
  for(let raw of candidates){
    if(raw.length!==18)continue;
    let c=raw.split('');
    for(let i=0;i<18;i++){
      if((i>=4&&i<=9)||i===17)c[i]=/\d/.test(c[i])?c[i]:(digitMap[c[i]]||c[i]);
      else if((i<=3)||(i>=11&&i<=15))c[i]=/[A-Z]/.test(c[i])?c[i]:(letterMap[c[i]]||c[i]);
    }
    c=c.join('');
    c=parts.prefix+c.slice(4);
    if(v124CurpValid(c))return c;
  }
  return current&&v124CurpValid(current)?current:'';
}
function v124RawNameGuess(text){
  const bad=/instituto|nacional|electoral|credencial|votar|mexico|méxico|domicilio|municipio|seccion|vigencia|curp|clave|fecha|nacimiento|sexo|entidad|localidad/i;
  const lines=String(text||'').split(/\r?\n/).map(x=>x
    .replace(/NOMBRE(?:S)?/ig,' ')
    .replace(/APELLIDO(?:S)?/ig,' ')
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]/g,' ')
    .replace(/\s+/g,' ').trim()
  ).filter(Boolean);
  const list=lines.map(x=>{
    const words=x.split(/\s+/).filter(w=>w.length>=2);
    const letters=(x.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g)||[]).length;
    const score=(words.length>=2?30:0)+(words.length>=3?22:0)+(words.length<=5?12:0)+Math.min(35,letters);
    return {x,words,score};
  }).filter(o=>o.words.length>=2&&o.words.length<=6&&o.x.length>=5&&o.x.length<=70&&!bad.test(o.x))
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
        const fallback=v124RawNameGuess(raw);
        if(fallback&&!v124BadOcrName(fallback)){
          setValue('[data-v64-cred-name]',fallback);
          const fixedCurp=v124RecoverCurp(raw,fallback,curp);
          if(fixedCurp)setValue('[data-v64-cred-curp]',fixedCurp);
          toast('Encontré una lectura posible. Revisa nombre y CURP antes de guardar');
        }else{
          toast('No pude confirmar contra el padrón todavía; conservé la lectura para que pueda intentarse de nuevo');
        }
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