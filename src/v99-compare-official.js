/* V99 — Comparador: jugadores/equipos reales desde AdminFut.
   No rediseña la pantalla. Solo sustituye nombres demo, opciones, escudos y
   valores no publicados por datos oficiales ya sincronizados. */
(function(){
'use strict';

if(window.__LJR_V99_COMPARE_OFFICIAL__)return;
window.__LJR_V99_COMPARE_OFFICIAL__=true;

const ROUTES=new Set(['compare','comparar','compareTeams']);
const FAKE_NAMES=[
  'Juan Pérez','Juan Perez','Carlos Ramírez','Carlos Ramirez','Ángel Cruz','Angel Cruz',
  'Miguel Torres','Diego Lara','Luis Gómez','Luis Gomez','Iván Sánchez','Ivan Sanchez',
  'Jorge Medina','Mario Nieto','Óscar León','Oscar Leon','Edgar Ruiz','Sergio Luna'
];
const FAKE_CODES=new Set(['JUV','POZ','CUE','RIN','SPD','MOR']);
const ABBR={
  'TOROS DE CUENDA':'CUE','CUENDA':'CUE','PROMESAS FC':'PRO','ATL. GALEANA':'GAL',
  'ATLETICO GALEANA':'GAL','GALEANA':'GAL','FRANCO FC':'FRA','LOBOS CDG':'LOB',
  'POZOS FC':'POZ','POZOS':'POZ','DYNAMO':'DYN','MANCHESTER':'MAN',
  'LA ESPERANZA':'ESP','BOAVISTA':'BOA','SAN JOSE FC':'SJO','JUVENTUS':'JVS',
  'HERMANOS':'HER','LINCES':'LIN','NAPOLI':'NAP','HERRERAS FC':'HFC',
  'TERRICOLAS':'TER','GALACTICOS':'GAC','DEP. ZAPATA':'ZAP','DEP. NOPALERO':'NOP',
  'CELTICOS':'CEL','ALDAMA FC':'ALD','LA HUERTA':'HUE','SANTA CRUZ':'STC'
};

let busy=false;
let lastSignature='';

function route(){return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0]}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function isCompareScreen(){
  const root=document.querySelector('#screen');
  if(!root)return false;
  if(ROUTES.has(route()))return true;
  const txt=(root.innerText||root.textContent||'').replace(/\s+/g,' ').trim();
  return /\bComparador\b/i.test(txt)&&/Compara estad/i.test(txt);
}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function abbr(team){
  const k=String(team||'').trim().toUpperCase();
  if(ABBR[k])return ABBR[k];
  return k.replace(/[^A-ZÁÉÍÓÚÜÑ0-9 ]/g,' ').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3)||'EQ';
}
function keyOf(p){return norm(p.name)+'|'+norm(p.team)+'|'+String(p.cat||'')}
function goalKey(p){return norm(p.player)+'|'+norm(p.team)}
function leafs(root){
  return [...root.querySelectorAll('*')].filter(el=>el.children.length===0&&String(el.textContent||'').trim());
}
function exactLeaf(root,texts){
  const set=new Set(texts.map(norm));
  return leafs(root).filter(el=>set.has(norm(el.textContent)));
}
function teamLogo(api,team){
  return api?.logoFor?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||'';
}
function pickDefaults(list, scorers){
  const by=(team)=>scorers.find(s=>norm(s.team)===norm(team))||list.find(p=>norm(p.team)===norm(team));
  const a=by('TOROS DE CUENDA')||by('CUENDA')||scorers[0]||list[0];
  const b=by('PROMESAS FC')||scorers.find(s=>!a||goalKey(s)!==goalKey(a))||list.find(p=>!a||keyOf(p)!==keyOf(a));
  return [a,b||a].filter(Boolean);
}
function playerUnion(api){
  const base=(api.playerList?.()||[]).map(p=>({name:String(p.name||'').trim(),team:String(p.team||'').trim(),cat:String(p.cat||''),category:String(p.category||''),goals:null}));
  const scorers=(api.officialScorers?.()||[]).map(s=>({name:String(s.player||'').trim(),team:String(s.team||'').trim(),cat:String(s.cat||''),category:String(s.category||''),goals:Number.isFinite(Number(s.goals))?Number(s.goals):null}));
  const map=new Map();
  [...scorers,...base].forEach(p=>{
    if(!p.name||!p.team)return;
    const k=keyOf(p);
    if(!map.has(k))map.set(k,p);
    else if(map.get(k).goals==null&&p.goals!=null)map.get(k).goals=p.goals;
  });
  const scoreMap=new Map(scorers.map(s=>[goalKey({player:s.name,team:s.team}),s.goals]));
  const list=[...map.values()].sort((a,b)=>{
    const ag=scoreMap.get(norm(a.name)+'|'+norm(a.team));
    const bg=scoreMap.get(norm(b.name)+'|'+norm(b.team));
    const aa=ag==null?-1:ag,bb=bg==null?-1:bg;
    return bb-aa||a.team.localeCompare(b.team,'es')||a.name.localeCompare(b.name,'es');
  });
  return {list,scorers,scoreMap};
}
function findSelects(root){
  const all=[...root.querySelectorAll('select')];
  const likely=all.filter(s=>FAKE_NAMES.some(n=>norm(s.textContent).includes(norm(n)))||[...FAKE_CODES].some(c=>String(s.textContent||'').includes(c)));
  return (likely.length>=2?likely:all).slice(0,2);
}
function setSelectOptions(select,list,selected){
  const prior=select.dataset.v99Selected||'';
  const chosen=selected||list.find(p=>keyOf(p)===prior)||list[0];
  select.innerHTML='';
  list.forEach(p=>{
    const o=document.createElement('option');
    o.value=keyOf(p);
    o.textContent=p.name+' · '+abbr(p.team);
    select.appendChild(o);
  });
  if(chosen)select.value=keyOf(chosen);
  select.dataset.v99Selected=select.value;
}
function getPlayerForSelect(select,list){
  const k=select?.value||select?.dataset.v99Selected||'';
  return list.find(p=>keyOf(p)===k)||list[0]||null;
}
function findCardNameEls(root){
  let els=[...root.querySelectorAll('[data-v99-player-name]')];
  if(els.length>=2)return els.slice(0,2);
  els=exactLeaf(root,FAKE_NAMES);
  if(els.length<2){
    // Fallback: nombres visibles dentro de las dos tarjetas inmediatamente posteriores al VS.
    const vs=leafs(root).find(el=>String(el.textContent||'').trim().toUpperCase()==='VS');
    if(vs){
      let host=vs.parentElement;
      for(let i=0;i<4&&host;i++,host=host.parentElement){
        const cands=leafs(host).filter(el=>{
          const t=String(el.textContent||'').trim();
          return t.length>5&&!/^(VS|Goles|Asistencias|Minutos|Tarjetas|Fantasy pts)$/i.test(t)&&!/^(JUV|POZ|CUE|RIN|SPD|MOR)$/i.test(t);
        });
        if(cands.length>=2){els=cands.slice(-2);break}
      }
    }
  }
  els.slice(0,2).forEach((el,i)=>el.dataset.v99PlayerName=String(i));
  return els.slice(0,2);
}
function findBadgeEls(root){
  let els=[...root.querySelectorAll('[data-v99-team-badge]')];
  if(els.length>=2)return els.slice(0,2);
  els=leafs(root).filter(el=>FAKE_CODES.has(String(el.textContent||'').trim().toUpperCase()));
  els.slice(0,2).forEach((el,i)=>el.dataset.v99TeamBadge=String(i));
  return els.slice(0,2);
}
function patchBadge(el,p,api){
  if(!el||!p)return;
  const src=teamLogo(api,p.team);
  el.setAttribute('aria-label',p.team);
  el.title=p.team;
  el.textContent='';
  if(src){
    const img=document.createElement('img');
    img.src=src; img.alt=p.team; img.loading='eager'; img.decoding='async';
    img.style.width='82%';img.style.height='82%';img.style.objectFit='contain';img.style.objectPosition='center';img.style.display='block';img.style.margin='auto';
    el.appendChild(img);
  }else{
    el.textContent=abbr(p.team);
  }
}
function findStatRow(root,label){
  const labelEl=leafs(root).find(el=>norm(el.textContent)===norm(label));
  if(!labelEl)return null;
  let row=labelEl.parentElement;
  for(let i=0;i<4&&row;i++,row=row.parentElement){
    const txt=leafs(row).map(x=>String(x.textContent||'').trim());
    if(txt.some(t=>norm(t)===norm(label))&&txt.length>=3&&txt.length<=8)return {row,labelEl,txtEls:leafs(row)};
  }
  return null;
}
function patchStat(root,label,left,right){
  const hit=findStatRow(root,label);if(!hit)return;
  const vals=hit.txtEls.filter(el=>el!==hit.labelEl);
  const numeric=vals.filter(el=>/^[-+]?\d+(?:\.\d+)?$|^—$/.test(String(el.textContent||'').trim()));
  const targets=numeric.length>=2?[numeric[0],numeric[numeric.length-1]]:[vals[0],vals[vals.length-1]].filter(Boolean);
  if(targets[0])targets[0].textContent=String(left);
  if(targets[1])targets[1].textContent=String(right);
}
function patchCardsAndStats(root,selected,api,scoreMap){
  const names=findCardNameEls(root),badges=findBadgeEls(root);
  selected.forEach((p,i)=>{
    if(names[i])names[i].textContent=p.name;
    patchBadge(badges[i],p,api);
  });
  const goals=selected.map(p=>{
    const v=scoreMap.get(norm(p.name)+'|'+norm(p.team));
    return v==null?'—':String(v);
  });
  patchStat(root,'Goles',goals[0]??'—',goals[1]??'—');
  patchStat(root,'Asistencias','—','—');
  patchStat(root,'Minutos','—','—');
  patchStat(root,'Tarjetas','—','—');
  patchStat(root,'Fantasy pts','—','—');
}
async function getApi(){
  for(let i=0;i<30;i++){
    const api=window.V66_OFFICIAL_DIRECTORY;
    if(api?.load&&api?.playerList){await api.load();return api}
    await new Promise(r=>setTimeout(r,100));
  }
  return null;
}
async function apply(){
  if(busy||!isCompareScreen())return;
  busy=true;
  try{
    const root=document.querySelector('#screen'),api=await getApi();
    if(!root||!api)return;
    const {list,scorers,scoreMap}=playerUnion(api);
    if(list.length<2)return;
    const selects=findSelects(root);
    if(selects.length<2)return;

    const defaults=pickDefaults(list,scorers.map(s=>({name:s.name,team:s.team,cat:s.cat,category:s.category,goals:s.goals})));
    selects.forEach((s,i)=>{
      if(s.dataset.v99Bound!=='1'){
        setSelectOptions(s,list,defaults[i]);
        s.dataset.v99Bound='1';
        s.addEventListener('change',()=>{
          s.dataset.v99Selected=s.value;
          const chosen=selects.map(x=>getPlayerForSelect(x,list));
          patchCardsAndStats(root,chosen,api,scoreMap);
        });
      }else if(![...s.options].some(o=>list.some(p=>o.value===keyOf(p)))){
        setSelectOptions(s,list,defaults[i]);
      }
    });

    // Evita repetir el mismo jugador por defecto en ambos lados.
    if(selects[0].value===selects[1].value&&list[1])selects[1].value=keyOf(list[1]);

    const chosen=selects.map(s=>getPlayerForSelect(s,list));
    patchCardsAndStats(root,chosen,api,scoreMap);

    const sig=chosen.map(p=>p?keyOf(p):'').join('|');
    lastSignature=sig;
    root.dataset.v99OfficialCompare='1';
  }finally{busy=false}
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(isCompareScreen())schedule()}).observe(screen,{childList:true,subtree:true});
setTimeout(schedule,0);
setTimeout(schedule,500);
setTimeout(schedule,1400);
})();