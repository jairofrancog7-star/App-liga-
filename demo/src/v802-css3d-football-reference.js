/* V802 — Táctica 3D inspirada en el concepto CSS 3D Football.
   Recreación propia adaptada a Liga Juventino: usa equipos, escudos, jugadores
   y fotos oficiales ya disponibles en V66; no inventa identidades ni plantillas. */
(function(){
'use strict';
if(window.__LJR_V802_CSS3D_FOOTBALL__)return;
window.__LJR_V802_CSS3D_FOOTBALL__=true;

const KEY='v802-css3d-team';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\bfuerza\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){return {}}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v||{}))}catch(_){}};
const token=t=>String(t?.cat||'')+'@@'+String(t?.name||'');
const parseToken=v=>{const i=String(v||'').indexOf('@@');return i<0?{cat:'',name:String(v||'')}:{cat:String(v).slice(0,i),name:String(v).slice(i+2)}};

let API=null;
let timer=0;
let applying=false;

async function official(){
  if(API?.playerList&&API?.teamList)return API;
  for(let i=0;i<55;i++){
    const a=window.V66_OFFICIAL_DIRECTORY;
    if(a?.load&&a?.playerList&&a?.teamList){
      try{await a.load()}catch(_){}
      API=a;return API;
    }
    await new Promise(r=>setTimeout(r,80));
  }
  return null;
}
function family(v){
  const n=norm(v);
  if(n.includes('50'))return 'v50';
  if(n.includes('35'))return 'v35';
  if(n.includes('intermedia'))return 'intermedia';
  if(n.includes('segunda'))return 'segunda';
  if(n.includes('primera'))return 'primera';
  return n||'general';
}
function teamsForCategory(list,label){
  const f=family(label);
  const exact=(list||[]).filter(t=>family(t.category)===f);
  return exact.length?exact:(list||[]);
}
function initials(v){
  const p=String(v||'').trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0]||'')+(p[1]?.[0]||p[0]?.[1]||'')).toUpperCase()||'JR';
}
function logoFor(api,name){
  try{return String(api?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||'')}catch(_){return ''}
}
function photoFor(p){
  try{return String(p?.photo||window.LJR_PLAYER_MEDIA?.photo?.(p?.name,p?.team,p?.cat)||'')}catch(_){return String(p?.photo||'')}
}
function posRank(p){
  const n=norm(p?.position);
  if(n.includes('portero')||n.includes('arquero')||n==='gk')return 0;
  if(n.includes('defensa')||n.includes('central')||n.includes('lateral')||n==='df')return 1;
  if(n.includes('medio')||n.includes('volante')||n.includes('centrocamp')||n==='mf'||n==='cm')return 2;
  if(n.includes('delanter')||n.includes('atac')||n.includes('extremo')||n==='fw'||n==='st')return 3;
  return 4;
}
function lineupFor(api,team){
  const all=api?.playerList?.()||[];
  return all.filter(p=>norm(p.team)===norm(team.name)&&(!team.cat||String(p.cat)===String(team.cat)))
    .sort((a,b)=>{
      const pa=posRank(a),pb=posRank(b);
      if(pa!==pb)return pa-pb;
      const da=parseInt(a.dorsal,10),db=parseInt(b.dorsal,10);
      const va=Number.isFinite(da)?da:999,vb=Number.isFinite(db)?db:999;
      return va-vb||String(a.name).localeCompare(String(b.name),'es');
    });
}
function mediaMarkup(p,cls){
  const src=photoFor(p);
  if(src)return '<span class="'+cls+' has-photo"><img src="'+esc(src)+'" alt="'+esc(p?.name||'Jugador')+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>';
  return '<span class="'+cls+'">'+esc(initials(p?.name||''))+'</span>';
}
function playerTokenMarkup(p,i){
  const dorsal=String(p?.dorsal||i+1);
  if(!p)return '<span class="v802-player-token is-empty"><span class="v802-player-photo">'+esc(String(i+1))+'</span><span class="v802-player-name">Sin asignar</span></span>';
  return '<span class="v802-player-token '+(posRank(p)===0?'is-gk':'')+'">'+
    mediaMarkup(p,'v802-player-photo')+
    '<span class="v802-player-number">'+esc(dorsal)+'</span>'+
    '<span class="v802-player-name">'+esc(p.name)+'</span>'+
  '</span>';
}
function ensureField(pitch,api,team){
  pitch.classList.add('v802-css3d-field');
  let marks=pitch.querySelector('.v802-field-markings');
  if(!marks){
    marks=document.createElement('div');
    marks.className='v802-field-markings';
    marks.innerHTML='<i class="half"></i><i class="center-ring"></i><i class="center-dot"></i>'+
      '<i class="box top"></i><i class="box bottom"></i><i class="six top"></i><i class="six bottom"></i>'+
      '<i class="arc top"></i><i class="arc bottom"></i><i class="goal top"></i><i class="goal bottom"></i>'+
      '<span class="v802-field-crest" data-v802-field-crest></span>';
    pitch.insertBefore(marks,pitch.firstChild);
  }
  const crest=$('[data-v802-field-crest]',marks);
  if(crest){
    const logo=logoFor(api,team.name);
    const key=team.name+'|'+logo;
    if(crest.dataset.v802Key!==key){
      crest.dataset.v802Key=key;
      crest.innerHTML=logo?'<img src="'+esc(logo)+'" alt="'+esc(team.name)+'">':'<b>'+esc(initials(team.name))+'</b>';
    }
  }
}
function setPlayerElement(el,p,i,kind='full'){
  const key=[p?.cat||'',p?.team||'',p?.name||'',p?.dorsal||'',photoFor(p),kind].join('|');
  if(el.dataset.v802PlayerKey===key)return;
  el.dataset.v802PlayerKey=key;
  el.dataset.v802RealPlayer=p?'1':'0';
  if(kind==='full'){
    el.innerHTML=playerTokenMarkup(p,i);
    el.setAttribute('aria-label',p?(p.name+' · '+p.team):('Jugador '+(i+1)+' sin asignar'));
    el.title=p?(p.name+(p.dorsal?' · #'+p.dorsal:'')+(p.position?' · '+p.position:'')):'Sin jugador oficial asignado';
    return;
  }
  if(p){
    el.innerHTML=mediaMarkup(p,kind==='source'?'v802-source-photo':'v802-mini-photo')+
      '<b class="'+(kind==='source'?'v802-source-number':'v802-mini-number')+'">'+esc(String(p.dorsal||i+1))+'</b>'+
      '<small class="'+(kind==='source'?'v802-source-name':'v802-mini-name')+'">'+esc(p.name)+'</small>';
    el.title=p.name+' · '+p.team;
  }else{
    el.textContent=String(i+1);
    el.title='Sin jugador oficial asignado';
  }
}
function renderTopTeam(api,team,lineup){
  const host=$('.v160-board-shell')||$('.v160-pitch-frame')?.parentElement;
  if(!host)return;
  let bar=host.querySelector('[data-v802-top-team]');
  if(!bar){
    bar=document.createElement('div');
    bar.className='v802-top-team';
    bar.dataset.v802TopTeam='';
    host.insertBefore(bar,host.firstChild);
  }
  const logo=logoFor(api,team.name);
  const key=team.name+'|'+logo+'|'+lineup.length;
  if(bar.dataset.v802Key===key)return;
  bar.dataset.v802Key=key;
  bar.innerHTML='<span class="v802-top-crest">'+(logo?'<img src="'+esc(logo)+'" alt="'+esc(team.name)+'">':'<b>'+esc(initials(team.name))+'</b>')+'</span>'+
    '<span><small>PLANTILLA OFICIAL · VISTA 3D</small><b>'+esc(team.name)+'</b><em>'+esc(team.category||'Liga Municipal')+' · '+lineup.length+' jugadores publicados</em></span>';
}
function renderLineupRail(adv,api,team,lineup){
  const pitch=$('[data-v100-pitch]',adv);
  if(!pitch)return;
  let rail=adv.querySelector('[data-v802-lineup]');
  if(!rail){
    rail=document.createElement('section');
    rail.className='v802-lineup';
    rail.dataset.v802Lineup='';
    pitch.insertAdjacentElement('afterend',rail);
  }
  const visible=lineup.slice(0,11);
  const key=team.name+'|'+team.cat+'|'+visible.map(p=>p.name+'#'+p.dorsal+'#'+photoFor(p)).join('~');
  if(rail.dataset.v802Key===key)return;
  rail.dataset.v802Key=key;
  rail.innerHTML='<div class="v802-lineup-head"><span><small>ONCE / PLANTILLA</small><b>'+esc(team.name)+'</b></span><em>Desliza para ver jugadores</em></div>'+
    '<div class="v802-lineup-rail">'+
      (visible.length?visible.map((p,i)=>'<button type="button" class="v802-lineup-card" data-v802-player-card="'+esc(p.name)+'" data-v802-player-team="'+esc(p.team)+'" data-v802-player-cat="'+esc(p.cat)+'">'+
        mediaMarkup(p,'v802-lineup-photo')+
        '<span><b>'+esc(p.name)+'</b><small>'+(p.dorsal?'#'+esc(p.dorsal)+' · ':'')+esc(p.position||'Jugador')+'</small></span>'+
      '</button>').join(''):'<div class="v802-lineup-empty">Este equipo todavía no tiene jugadores publicados en el directorio oficial.</div>')+
    '</div>';
}
function decorateMiniBoards(api,team,lineup){
  const dots=$$('.v60-player-dot');
  dots.forEach((el,i)=>setPlayerElement(el,lineup[i]||null,i,'mini'));
  const source=$$('.v160-source-player');
  source.forEach((el,i)=>{el.classList.remove('rival');setPlayerElement(el,lineup[i]||null,i,'source')});
  const sourcePitch=$('.v160-source-pitch');
  if(sourcePitch){
    sourcePitch.classList.add('v802-source-real');
    let crest=sourcePitch.querySelector('[data-v802-source-crest]');
    if(!crest){
      crest=document.createElement('span');crest.className='v802-source-crest';crest.dataset.v802SourceCrest='';
      sourcePitch.appendChild(crest);
    }
    const logo=logoFor(api,team.name);
    const key=team.name+'|'+logo;
    if(crest.dataset.v802Key!==key){
      crest.dataset.v802Key=key;
      crest.innerHTML=logo?'<img src="'+esc(logo)+'" alt="'+esc(team.name)+'"><b>'+esc(team.name)+'</b>':'<span>'+esc(initials(team.name))+'</span><b>'+esc(team.name)+'</b>';
    }
  }
}
function decorateAdvanced(adv,api,team,lineup){
  const pitch=$('[data-v100-pitch]',adv);if(!pitch)return;
  ensureField(pitch,api,team);
  $$('[data-v100-player]',adv).forEach((el,i)=>setPlayerElement(el,lineup[i]||null,i,'full'));
  renderLineupRail(adv,api,team,lineup);
}
function selectedTeamFromPicker(adv,teams){
  const sel=$('[data-v802-team-select]',adv);
  if(!sel)return null;
  const parsed=parseToken(sel.value);
  return teams.find(t=>String(t.cat)===parsed.cat&&t.name===parsed.name)||teams.find(t=>t.name===parsed.name)||null;
}
function updatePickerVisual(picker,api,team,lineup){
  const crest=$('[data-v802-picker-crest]',picker),name=$('[data-v802-picker-name]',picker),meta=$('[data-v802-picker-meta]',picker);
  const logo=logoFor(api,team.name);
  if(crest){
    const key=team.name+'|'+logo;
    if(crest.dataset.v802Key!==key){crest.dataset.v802Key=key;crest.innerHTML=logo?'<img src="'+esc(logo)+'" alt="'+esc(team.name)+'">':'<b>'+esc(initials(team.name))+'</b>'}
  }
  if(name&&name.textContent!==team.name)name.textContent=team.name;
  const metaText=(team.category||'Liga Municipal')+' · '+lineup.length+' jugadores oficiales';
  if(meta&&meta.textContent!==metaText)meta.textContent=metaText;
}
function ensurePicker(adv,api,allTeams,categoryLabel){
  const controls=$('.v100-tactic-controls',adv);if(!controls)return null;
  let picker=adv.querySelector('[data-v802-team-picker]');
  if(!picker){
    picker=document.createElement('div');
    picker.className='v802-team-picker';
    picker.dataset.v802TeamPicker='';
    picker.innerHTML='<span class="v802-team-picker-crest" data-v802-picker-crest></span>'+
      '<span class="v802-team-picker-copy"><small>CSS 3D · PLANTILLA REAL</small><b data-v802-picker-name>Equipo</b><em data-v802-picker-meta>Datos oficiales</em></span>'+
      '<label><span>Equipo</span><select data-v802-team-select aria-label="Elegir equipo para la táctica 3D"></select></label>';
    controls.insertAdjacentElement('beforebegin',picker);
    $('[data-v802-team-select]',picker).addEventListener('change',()=>{
      const cat=$('[data-v100-tactic-category]',adv)?.value||categoryLabel;
      const map=read();map[family(cat)]=$('[data-v802-team-select]',picker).value;write(map);
      schedule(20);
    });
  }
  const teams=teamsForCategory(allTeams,categoryLabel);
  const sel=$('[data-v802-team-select]',picker);
  const signature=family(categoryLabel)+'|'+teams.map(token).join('~');
  if(sel.dataset.v802Options!==signature){
    const previous=sel.value;
    sel.innerHTML=teams.map(t=>'<option value="'+esc(token(t))+'">'+esc(t.name)+'</option>').join('');
    const saved=read()[family(categoryLabel)]||previous;
    if(saved&&Array.from(sel.options).some(o=>o.value===saved))sel.value=saved;
    sel.dataset.v802Options=signature;
  }
  return {picker,teams};
}
function bindCategory(adv){
  const cat=$('[data-v100-tactic-category]',adv);
  if(cat&&!cat.dataset.v802Bound){
    cat.dataset.v802Bound='1';
    cat.addEventListener('change',()=>schedule(30));
  }
}
async function apply(){
  if(applying||route()!=='tactics')return;
  const adv=$('#v100-tactics-extra');
  if(!adv)return;
  applying=true;
  try{
    const api=await official();
    if(!api||route()!=='tactics'||!document.body.contains(adv))return;
    bindCategory(adv);
    const categoryLabel=$('[data-v100-tactic-category]',adv)?.value||'Primera';
    const allTeams=api.teamList?.()||[];
    if(!allTeams.length)return;
    const state=ensurePicker(adv,api,allTeams,categoryLabel);
    if(!state?.teams?.length)return;
    let team=selectedTeamFromPicker(adv,state.teams);
    if(!team)team=state.teams[0];
    const lineup=lineupFor(api,team);
    updatePickerVisual(state.picker,api,team,lineup);
    decorateAdvanced(adv,api,team,lineup);
    decorateMiniBoards(api,team,lineup);
    renderTopTeam(api,team,lineup);
    adv.dataset.v802Ready='1';
  }finally{applying=false}
}
function schedule(delay=90){clearTimeout(timer);timer=setTimeout(apply,delay)}

document.addEventListener('click',async e=>{
  const card=e.target.closest?.('[data-v802-player-card]');
  if(!card)return;
  const api=await official();if(!api)return;
  const p=(api.playerList?.()||[]).find(x=>norm(x.name)===norm(card.dataset.v802PlayerCard)&&norm(x.team)===norm(card.dataset.v802PlayerTeam)&&String(x.cat)===String(card.dataset.v802PlayerCat));
  if(p&&window.LJR_PLAYER_PROFILE_API?.open)window.LJR_PLAYER_PROFILE_API.open(p);
},false);

window.addEventListener('hashchange',()=>schedule(80));
const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(route()==='tactics')schedule(110)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(120),{once:true});else schedule(120);
setTimeout(()=>schedule(80),900);
})();