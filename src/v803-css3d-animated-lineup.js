/* V803 — Alineación CSS 3D animada con datos oficiales de Liga Juventino.
   Inspiración visual: campo en perspectiva y jugadores que entran al cargar.
   Implementación propia: CSS transforms + JavaScript nativo, sin dependencias externas. */
(function(){
'use strict';
if(window.__LJR_V803_ANIMATED_LINEUP__)return;
window.__LJR_V803_ANIMATED_LINEUP__=true;

const STORE='v803-css3d-lineup';
const POSITIONS=[
  [50,88],[16,72],[38,75],[62,75],[84,72],
  [24,49],[50,54],[76,49],[20,23],[50,18],[80,23]
];
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
const write=v=>{try{localStorage.setItem(STORE,JSON.stringify(v||{}))}catch(_){}};
const initials=v=>{
  const p=String(v||'').trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0]||'')+(p[1]?.[0]||p[0]?.[1]||'')).toUpperCase()||'JR';
};
let api=null,loading=null,timer=0,busy=false;

async function official(){
  if(api?.playerList&&api?.teamList)return api;
  if(loading)return loading;
  loading=(async()=>{
    for(let i=0;i<70;i++){
      const a=window.V66_OFFICIAL_DIRECTORY;
      if(a?.load&&a?.playerList&&a?.teamList){
        try{await a.load()}catch(_){}
        api=a;return api;
      }
      await new Promise(r=>setTimeout(r,70));
    }
    return null;
  })();
  return loading;
}
function photoFor(p){
  try{return String(p?.photo||window.LJR_PLAYER_MEDIA?.photo?.(p?.name,p?.team,p?.cat)||'')}catch(_){return String(p?.photo||'')}
}
function logoFor(a,name){
  try{return String(a?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||'')}catch(_){return ''}
}
function rankPosition(p){
  const n=norm(p?.position);
  if(n.includes('portero')||n.includes('arquero')||n==='gk')return 0;
  if(n.includes('defensa')||n.includes('central')||n.includes('lateral')||n==='df')return 1;
  if(n.includes('medio')||n.includes('volante')||n.includes('centrocamp')||n==='mf'||n==='cm')return 2;
  if(n.includes('delanter')||n.includes('atacante')||n.includes('extremo')||n==='fw'||n==='st')return 3;
  return 4;
}
function lineupFor(a,team){
  const all=a?.playerList?.()||[];
  return all.filter(p=>norm(p.team)===norm(team.name)&&(!team.cat||String(p.cat)===String(team.cat)))
    .sort((x,y)=>{
      const px=rankPosition(x),py=rankPosition(y);
      if(px!==py)return px-py;
      const dx=parseInt(x.dorsal,10),dy=parseInt(y.dorsal,10);
      const ax=Number.isFinite(dx)?dx:999,ay=Number.isFinite(dy)?dy:999;
      return ax-ay||String(x.name).localeCompare(String(y.name),'es');
    });
}
function teamKey(t){return String(t?.cat||'')+'@@'+String(t?.name||'')}
function parseTeamKey(v){
  const s=String(v||''),i=s.indexOf('@@');
  return i<0?{cat:'',name:s}:{cat:s.slice(0,i),name:s.slice(i+2)};
}
function uniqueCategories(teams){
  const seen=new Set(),out=[];
  (teams||[]).forEach(t=>{
    const id=String(t.cat||'');
    if(!id||seen.has(id))return;
    seen.add(id);out.push({id,label:String(t.category||'Categoría')});
  });
  return out;
}
function media(p,cls){
  const src=photoFor(p);
  if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(p?.name||'Jugador')+'" loading="eager" decoding="async" referrerpolicy="no-referrer"><b class="v803-fallback">'+esc(initials(p?.name))+'</b></span>';
  return '<span class="'+cls+' no-photo"><b>'+esc(initials(p?.name))+'</b></span>';
}
function stageMarkup(){
  return '<section class="v803-football3d" data-v803-stage aria-label="Alineación 3D animada">'+
    '<div class="v803-head">'+
      '<span class="v803-head-crest" data-v803-head-crest><b>JR</b></span>'+
      '<span class="v803-head-copy"><small>CSS 3D FOOTBALL · LIGA JUVENTINO</small><b data-v803-head-name>Alineación 3D</b><em data-v803-head-meta>Jugadores y escudos oficiales</em></span>'+
      '<button type="button" class="v803-replay" data-v803-replay aria-label="Reproducir animación">↻</button>'+
    '</div>'+
    '<div class="v803-selectors">'+
      '<label><span>Categoría</span><select data-v803-cat></select></label>'+
      '<label><span>Equipo</span><select data-v803-team></select></label>'+
    '</div>'+
    '<div class="v803-stage-note">Las fotos entran una por una al cargar. Toca un jugador para destacarlo.</div>'+
    '<div class="v803-viewport" data-v803-viewport>'+
      '<div class="v803-world" data-v803-world>'+
        '<div class="v803-field">'+
          '<div class="v803-field-lines" aria-hidden="true">'+
            '<i class="half"></i><i class="circle"></i><i class="dot"></i>'+
            '<i class="box top"></i><i class="box bottom"></i>'+
            '<i class="smallbox top"></i><i class="smallbox bottom"></i>'+
            '<i class="goal top"></i><i class="goal bottom"></i>'+
          '</div>'+
          '<span class="v803-field-crest" data-v803-field-crest></span>'+
          '<span class="v803-ball" aria-hidden="true"></span>'+
          '<div class="v803-players" data-v803-players></div>'+
        '</div>'+
      '</div>'+
      '<div class="v803-loading" data-v803-loading><i></i><span>Cargando plantilla real…</span></div>'+
    '</div>'+
    '<div class="v803-player-detail" data-v803-detail hidden></div>'+
  '</section>';
}
function ensureStage(){
  const page=$('[data-v160-tactics]');
  if(!page)return null;
  let stage=$('[data-v803-stage]',page);
  if(stage)return stage;
  const anchor=$('[data-v160-source-stage]',page)||$('[data-v160-main-board]',page);
  if(anchor)anchor.insertAdjacentHTML('beforebegin',stageMarkup());
  else page.insertAdjacentHTML('beforeend',stageMarkup());
  stage=$('[data-v803-stage]',page);
  bindStage(stage);
  return stage;
}
function bindStage(stage){
  if(!stage||stage.dataset.v803Bound)return;
  stage.dataset.v803Bound='1';
  $('[data-v803-cat]',stage)?.addEventListener('change',()=>{
    const state=read();state.cat=$('[data-v803-cat]',stage).value;delete state.team;write(state);render(true);
  });
  $('[data-v803-team]',stage)?.addEventListener('change',()=>{
    const state=read();state.team=$('[data-v803-team]',stage).value;write(state);render(true);
  });
  $('[data-v803-replay]',stage)?.addEventListener('click',()=>play(stage));
  $('[data-v803-players]',stage)?.addEventListener('click',e=>{
    const btn=e.target.closest('.v803-player');
    if(!btn)return;
    const was=btn.classList.contains('active');
    $$('.v803-player',stage).forEach(x=>x.classList.remove('active'));
    if(was){stage.classList.remove('has-focus');renderDetail(stage,null);return}
    btn.classList.add('active');stage.classList.add('has-focus');
    const cache=stage.__v803Lineup||[];
    renderDetail(stage,cache[Number(btn.dataset.v803Index)]||null);
  });
}
function renderDetail(stage,p){
  const box=$('[data-v803-detail]',stage);if(!box)return;
  if(!p){box.hidden=true;box.innerHTML='';return}
  const src=photoFor(p),logo=logoFor(api,p.team);
  box.hidden=false;
  box.innerHTML=
    '<div class="v803-detail-media">'+(src?'<img src="'+esc(src)+'" alt="'+esc(p.name)+'">':'<b>'+esc(initials(p.name))+'</b>')+'</div>'+
    '<span class="v803-detail-copy"><small>JUGADOR OFICIAL</small><b>'+esc(p.name)+'</b><em>'+(p.dorsal?'#'+esc(p.dorsal)+' · ':'')+esc(p.position||'Posición no publicada')+'</em></span>'+
    '<span class="v803-detail-club">'+(logo?'<img src="'+esc(logo)+'" alt="'+esc(p.team)+'">':'<b>'+esc(initials(p.team))+'</b>')+'<small>'+esc(p.team)+'</small></span>';
}
function play(stage){
  if(!stage)return;
  stage.classList.remove('is-ready');
  void stage.offsetWidth;
  requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.add('is-ready')));
}
function wireImages(stage){
  $$('img',stage).forEach(img=>{
    if(img.dataset.v803ImgBound)return;
    img.dataset.v803ImgBound='1';
    const mark=()=>img.closest('.v803-photo,.v803-head-crest,.v803-field-crest')?.classList.add('is-loaded');
    const fail=()=>{
      const holder=img.closest('.v803-photo');
      if(holder){holder.classList.add('no-photo');img.remove();}
    };
    if(img.complete&&img.naturalWidth>0)mark();
    else{img.addEventListener('load',mark,{once:true});img.addEventListener('error',fail,{once:true})}
  });
}
function setOptions(stage,teams){
  const catSel=$('[data-v803-cat]',stage),teamSel=$('[data-v803-team]',stage);
  if(!catSel||!teamSel)return null;
  const state=read(),cats=uniqueCategories(teams);
  if(!cats.length)return null;
  const desiredCat=String(state.cat||catSel.value||cats[0].id);
  const catId=cats.some(c=>c.id===desiredCat)?desiredCat:cats[0].id;
  const catSig=cats.map(c=>c.id+'|'+c.label).join('~');
  if(catSel.dataset.sig!==catSig){
    catSel.innerHTML=cats.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.label)+'</option>').join('');
    catSel.dataset.sig=catSig;
  }
  catSel.value=catId;
  const filtered=teams.filter(t=>String(t.cat)===catId);
  if(!filtered.length)return null;
  const teamSig=filtered.map(teamKey).join('~');
  if(teamSel.dataset.sig!==teamSig){
    teamSel.innerHTML=filtered.map(t=>'<option value="'+esc(teamKey(t))+'">'+esc(t.name)+'</option>').join('');
    teamSel.dataset.sig=teamSig;
  }
  const desiredTeam=String(state.team||teamSel.value||teamKey(filtered[0]));
  teamSel.value=Array.from(teamSel.options).some(o=>o.value===desiredTeam)?desiredTeam:teamKey(filtered[0]);
  const parsed=parseTeamKey(teamSel.value);
  return filtered.find(t=>String(t.cat)===parsed.cat&&t.name===parsed.name)||filtered[0];
}
function renderPlayers(stage,lineup){
  const host=$('[data-v803-players]',stage);if(!host)return;
  const rows=Array.from({length:11},(_,i)=>lineup[i]||null);
  host.innerHTML=rows.map((p,i)=>{
    const pos=POSITIONS[i],style='left:'+pos[0]+'%;top:'+pos[1]+'%;--v803-i:'+i;
    if(!p)return '<button type="button" class="v803-player empty" style="'+style+'" data-v803-index="'+i+'" aria-label="Posición sin jugador"><span class="v803-player-base"></span><span class="v803-player-face"><span class="v803-photo no-photo"><b>'+String(i+1)+'</b></span><span class="v803-label">SIN ASIGNAR</span></span></button>';
    return '<button type="button" class="v803-player '+(rankPosition(p)===0?'keeper':'')+'" style="'+style+'" data-v803-index="'+i+'" aria-label="'+esc(p.name)+'">'+
      '<span class="v803-player-base"></span>'+
      '<span class="v803-player-face">'+media(p,'v803-photo')+
        '<span class="v803-number">'+esc(String(p.dorsal||i+1))+'</span>'+
        '<span class="v803-label">'+esc(p.name)+'</span>'+
      '</span>'+
    '</button>';
  }).join('');
}
function updateIdentity(stage,a,team,lineup){
  const logo=logoFor(a,team.name),headCrest=$('[data-v803-head-crest]',stage),fieldCrest=$('[data-v803-field-crest]',stage);
  const crestHtml=logo?'<img src="'+esc(logo)+'" alt="'+esc(team.name)+'"><b class="v803-fallback">'+esc(initials(team.name))+'</b>':'<b>'+esc(initials(team.name))+'</b>';
  if(headCrest)headCrest.innerHTML=crestHtml;
  if(fieldCrest)fieldCrest.innerHTML=crestHtml;
  const name=$('[data-v803-head-name]',stage),meta=$('[data-v803-head-meta]',stage);
  if(name)name.textContent=team.name;
  if(meta)meta.textContent=(team.category||'Liga Municipal')+' · '+lineup.length+' jugadores publicados';
}
async function render(animate=false){
  if(busy||route()!=='tactics')return;
  busy=true;
  try{
    const stage=ensureStage();if(!stage)return;
    const loader=$('[data-v803-loading]',stage);if(loader)loader.hidden=false;
    const a=await official();if(!a||route()!=='tactics'||!document.body.contains(stage))return;
    const teams=a.teamList?.()||[];if(!teams.length)return;
    const team=setOptions(stage,teams);if(!team)return;
    const lineup=lineupFor(a,team);
    stage.__v803Lineup=lineup.slice(0,11);
    stage.classList.remove('has-focus');renderDetail(stage,null);
    renderPlayers(stage,lineup);
    updateIdentity(stage,a,team,lineup);
    wireImages(stage);
    if(loader)loader.hidden=true;
    if(animate||!stage.classList.contains('is-ready'))play(stage);
    else stage.classList.add('is-ready');

    document.querySelectorAll('.v802-player-photo,.v802-mini-photo,.v802-source-photo').forEach((el,i)=>{
      el.style.setProperty('--v803-i',String(i%11));
      el.classList.add('v803-legacy-motion');
    });
  }finally{busy=false}
}
function schedule(delay=80){clearTimeout(timer);timer=setTimeout(()=>render(false),delay)}

window.addEventListener('hashchange',()=>schedule(100));
const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(route()==='tactics')schedule(120)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(150),{once:true});else schedule(150);
setTimeout(()=>schedule(30),900);
})();