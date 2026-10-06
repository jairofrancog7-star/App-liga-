/* V834 — Fantasy hard rebuild.
   Replaces every filled kit wrapper with ONE local transparent SVG shirt + ONE team crest.
   It also leaves a hidden v820 marker with the exact stamp so older observers stop rewriting it. */
(()=>{
'use strict';
if(window.__LJR_V834_FANTASY_HARD_REBUILD__)return;
window.__LJR_V834_FANTASY_HARD_REBUILD__=true;

const hash=value=>{let h=2166136261,s=String(value||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palettes=[
  ['#0a49dd','#32d8ef','#052376'],['#c51b28','#ef4652','#65030a'],
  ['#f7f9fc','#dbe7f2','#71839d'],['#151920','#4b5563','#050608'],
  ['#f2c11d','#ffe16a','#946900'],['#09894f','#42d980','#034823'],
  ['#7125c8','#b76aff','#351066'],['#f06a08','#ffad49','#8f3300'],
  ['#138aca','#68d9ff','#074f78'],['#e91f77','#ff78b6','#780b3d']
];

function squad(){
  try{const x=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');return Array.isArray(x)?x:[]}catch(_){return []}
}
function logoFor(team){
  let v='';
  try{v=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_OFFICIAL_API?.getLogo?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_TEAM_LOGOS?.get?.(team)||''}catch(_){}
  v=String(v||'');
  if(!v)return './assets/liga-logo.webp';
  if(/^(https?:|data:|blob:|\/)/i.test(v))return v;
  if(v.startsWith('assets/'))return './'+v;
  return v;
}
function shirtSvg(seed){
  const p=palettes[seed%palettes.length],mode=seed%6,id='v834'+seed;
  const design=mode===0
    ? '<path d="M62 55h22v156H62zm54 0h22v156h-22z" fill="'+p[1]+'" opacity=".9"/>'
    : mode===1
      ? '<path d="M45 92h110v27H45zm0 45h110v20H45z" fill="'+p[1]+'" opacity=".84"/>'
      : mode===2
        ? '<path d="M37 58l98 153h-34L25 91z" fill="'+p[1]+'" opacity=".82"/>'
        : mode===3
          ? '<path d="M90 54h20v159H90z" fill="'+p[1]+'" opacity=".92"/><path d="M56 54h16v159H56zm72 0h16v159h-16z" fill="'+p[1]+'" opacity=".34"/>'
          : mode===4
            ? '<path d="M44 78h112v30H44z" fill="'+p[1]+'" opacity=".87"/><path d="M83 54h34v159H83z" fill="'+p[1]+'" opacity=".30"/>'
            : '<path d="M31 63l138 83v32L31 95z" fill="'+p[1]+'" opacity=".75"/>';
  return '<svg class="v834-shirt-svg" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<defs>'+
      '<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+p[1]+'"/><stop offset=".38" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[2]+'"/></linearGradient>'+
      '<linearGradient id="'+id+'s" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".24"/><stop offset=".45" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>'+
      '<clipPath id="'+id+'c"><path d="M70 40c7 8 18 12 30 12s23-4 30-12l29 13 27 34-28 25-17-18v119H59V94l-17 18-28-25 27-34z"/></clipPath>'+
      '<filter id="'+id+'d" x="-35%" y="-35%" width="170%" height="175%"><feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#00102d" flood-opacity=".34"/></filter>'+
    '</defs>'+
    '<g filter="url(#'+id+'d)">'+
      '<path d="M70 40c7 8 18 12 30 12s23-4 30-12l29 13 27 34-28 25-17-18v119H59V94l-17 18-28-25 27-34z" fill="url(#'+id+'g)" stroke="'+p[2]+'" stroke-width="3"/>'+
      '<g clip-path="url(#'+id+'c)">'+design+
        '<path d="M30 49c30 22 51 30 70 30s40-8 70-30v35c-29 15-51 21-70 21S59 99 30 84z" fill="#fff" opacity=".055"/>'+
        '<path d="M13 39h174v176H13z" fill="url(#'+id+'s)"/>'+
      '</g>'+
      '<path d="M79 43c4 14 11 21 21 21s17-7 21-21" fill="none" stroke="'+p[1]+'" stroke-width="8" stroke-linecap="round"/>'+
      '<path d="M81 43c4 10 9 15 19 15s15-5 19-15" fill="none" stroke="'+p[2]+'" stroke-width="3" stroke-linecap="round"/>'+
      '<path d="M59 207h82M44 105L18 84m138 21 26-21" stroke="'+p[1]+'" stroke-width="3" opacity=".72"/>'+
    '</g>'+
  '</svg>';
}
function hardRebuild(){
  if(!/fantasyTeam/i.test(String(location.hash||''))&&!document.body.classList.contains('v587-fantasy-team-open'))return;
  const slots=[...document.querySelectorAll('.v576-slot.filled[data-v576-slot]')];
  if(!slots.length)return;
  const rows=squad(),bySlot=new Map(rows.map(p=>[String(p?.slot??''),p||{}]));

  slots.forEach((slot,index)=>{
    const wrap=slot.querySelector('.v590-kit-wrap');
    if(!wrap)return;
    const slotId=String(slot.dataset.v576Slot??index);
    const p=bySlot.get(slotId)||{};
    const player=String(p.name||slot.querySelector(':scope>b')?.textContent||('Jugador '+(index+1)));
    const team=String(p.team||'Liga Juventino Rosas');
    const seed=hash(team+'|'+player+'|'+slotId+'|v834')%10000;
    const logo=logoFor(team);
    const exactV820Stamp='clean-transparent-v831-'+index+'|'+player+'|'+team+'|transparent-v831';
    const ownStamp=seed+'|'+team+'|'+player;

    const cleanAlready=wrap.dataset.v834Stamp===ownStamp &&
      wrap.querySelector('.v834-shirt-shell') &&
      wrap.children.length<=2;
    if(cleanAlready){
      wrap.dataset.v820Stamp=exactV820Stamp;
      return;
    }

    const removeId=wrap.querySelector('[data-v576-remove]')?.getAttribute('data-v576-remove')||slotId;
    wrap.dataset.v820Stamp=exactV820Stamp;
    wrap.dataset.v829Generated='1';
    wrap.dataset.v834Stamp=ownStamp;
    wrap.style.setProperty('--v820-tilt',(index%2?-5:5)+'deg');

    wrap.innerHTML=
      '<span class="v834-shirt-shell" aria-hidden="true">'+
        shirtSvg(seed)+
        '<span class="v834-team-crest"><img src="'+esc(logo)+'" alt="" draggable="false" decoding="async"><b>'+esc((team.trim()[0]||'J').toUpperCase())+'</b></span>'+
        '<img class="v820-lineup-jersey v834-compat-marker" alt="" aria-hidden="true">'+
      '</span>'+
      '<i class="remove" data-v576-remove="'+esc(removeId)+'" aria-label="Quitar jugador">×</i>';

    const crest=wrap.querySelector('.v834-team-crest');
    const img=crest?.querySelector('img');
    const fallback=crest?.querySelector('b');
    if(img)img.onerror=()=>{img.style.display='none';if(fallback)fallback.style.display='grid'};
  });
  document.body.dataset.v834FantasyTransparent='hard-rebuild';
}

let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(hardRebuild))}
function boot(){
  const mo=new MutationObserver(schedule);
  mo.observe(document.body,{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(schedule,20));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-remove],[data-v576-pick]'))setTimeout(schedule,30)},true);
  schedule();setTimeout(schedule,70);setTimeout(schedule,220);setTimeout(schedule,700);setTimeout(schedule,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();