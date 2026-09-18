const V19_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts19';
let v19FantasyBgPromise=null;

function v19Route(){return location.hash.replace('#/','')||'home'}

async function v19FantasyBg(){
  if(v19FantasyBgPromise) return v19FantasyBgPromise;
  v19FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts19').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts19').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v19FantasyBgPromise;
}

function v19CardsSvg(){
  return `
  <svg class="v19-fantasy-art" viewBox="0 0 800 520" aria-hidden="true">
    <defs>
      <linearGradient id="v19card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2637b6" stop-opacity=".96"/>
        <stop offset=".55" stop-color="#122b9c" stop-opacity=".94"/>
        <stop offset="1" stop-color="#07156f" stop-opacity=".96"/>
      </linearGradient>
      <linearGradient id="v19neon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#b9ef42"/>
        <stop offset=".30" stop-color="#19e9ff"/>
        <stop offset=".67" stop-color="#ff4da2"/>
        <stop offset="1" stop-color="#ff8d4a"/>
      </linearGradient>
      <linearGradient id="v19shirt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#55cfff"/>
        <stop offset=".48" stop-color="#369cff"/>
        <stop offset="1" stop-color="#236fe8"/>
      </linearGradient>
      <linearGradient id="v19pitch" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#154ee0" stop-opacity=".58"/>
        <stop offset="1" stop-color="#032178" stop-opacity=".22"/>
      </linearGradient>
      <filter id="v19glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="v19soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16"/>
      </filter>
    </defs>

    <ellipse cx="400" cy="235" rx="315" ry="180" fill="#06136f" opacity=".80" filter="url(#v19soft)"/>

    <g filter="url(#v19glow)">
      <path d="M108 165 L692 165 L762 472 L38 472 Z" fill="url(#v19pitch)" stroke="#13cfff" stroke-width="3"/>
      <path d="M152 198 L648 198 L704 438 L96 438 Z" fill="none" stroke="#1bdcff" stroke-width="2.5" opacity=".78"/>
      <path d="M400 198 L400 438" stroke="#1bdcff" stroke-width="2.3" opacity=".68"/>
      <ellipse cx="400" cy="318" rx="80" ry="33" fill="none" stroke="#1bdcff" stroke-width="2.4" opacity=".78"/>
      <path d="M326 438 L326 392 L474 392 L474 438" fill="none" stroke="#1bdcff" stroke-width="2.4" opacity=".78"/>
      <path d="M362 438 L362 416 L438 416 L438 438" fill="none" stroke="#1bdcff" stroke-width="2.2" opacity=".72"/>
    </g>

    <g transform="translate(85 58) rotate(-4 135 135)">
      <rect x="0" y="0" width="230" height="270" rx="26" fill="url(#v19card)" stroke="url(#v19neon)" stroke-width="3"/>
      <rect x="24" y="26" width="182" height="214" rx="19" fill="none" stroke="#315bc7" stroke-width="2" opacity=".55"/>
      <g transform="translate(48 62)">
        <path d="M28 22 L53 10 C64 24 91 24 102 10 L127 22 L160 38 L145 78 L122 68 L122 145 L33 145 L33 68 L10 78 L-5 38 Z" fill="url(#v19shirt)"/>
        <path d="M73 67 h10 v22 h22 v10 h-22 v22 h-10 v-22 h-22 v-10 h22z" fill="#0b168d"/>
      </g>
    </g>

    <g transform="translate(285 22)">
      <rect x="0" y="0" width="230" height="304" rx="26" fill="url(#v19card)" stroke="url(#v19neon)" stroke-width="3.2"/>
      <rect x="25" y="26" width="180" height="245" rx="19" fill="none" stroke="#315bc7" stroke-width="2" opacity=".58"/>
      <g transform="translate(46 70)">
        <path d="M28 22 L53 10 C64 24 91 24 102 10 L127 22 L160 38 L145 78 L122 68 L122 145 L33 145 L33 68 L10 78 L-5 38 Z" fill="url(#v19shirt)"/>
        <path d="M73 67 h10 v22 h22 v10 h-22 v22 h-10 v-22 h-22 v-10 h22z" fill="#0b168d"/>
      </g>
      <ellipse cx="115" cy="300" rx="60" ry="16" fill="none" stroke="#16d8ff" stroke-width="2.5" opacity=".76"/>
    </g>

    <g transform="translate(485 58) rotate(4 135 135)">
      <rect x="0" y="0" width="230" height="270" rx="26" fill="url(#v19card)" stroke="url(#v19neon)" stroke-width="3"/>
      <rect x="24" y="26" width="182" height="214" rx="19" fill="none" stroke="#315bc7" stroke-width="2" opacity=".55"/>
      <g transform="translate(48 62)">
        <path d="M28 22 L53 10 C64 24 91 24 102 10 L127 22 L160 38 L145 78 L122 68 L122 145 L33 145 L33 68 L10 78 L-5 38 Z" fill="url(#v19shirt)"/>
        <path d="M73 67 h10 v22 h22 v10 h-22 v22 h-10 v-22 h-22 v-10 h22z" fill="#0b168d"/>
      </g>
    </g>
  </svg>`;
}

function v19Markup(){
  return '<section class="v19-fantasy-master" data-v19-fantasy>'+
    '<img class="v19-fantasy-bg" alt="" aria-hidden="true">'+
    '<div class="v19-lower-clean" aria-hidden="true"></div>'+
    '<img class="v19-title-art" src="./fantasy-title-master.webp?v=parts19" alt="Fantasy">'+
    '<div class="v19-title-fallback" aria-hidden="true">FANTASY</div>'+
    '<div class="v19-league"><strong>LIGA MUNICIPAL DE FÚTBOL</strong><strong>JUVENTINO ROSAS</strong><span>GUANAJUATO</span></div>'+
    '<div class="v19-sponsor"><span>Patrocinado por</span><img src="'+V19_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas"></div>'+
    v19CardsSvg()+
    '<button class="v19-card-hotspot" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal"></button>'+
  '</section>';
}

async function patchV19Fantasy(){
  if(v19Route()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('[data-v19-fantasy]')) screen.innerHTML=v19Markup();
  const bg=screen.querySelector('.v19-fantasy-bg');
  if(bg&&!bg.src){
    try{bg.src=await v19FantasyBg()}catch(e){console.warn('Fantasy background',e)}
  }
}

function scheduleV19Fantasy(){
  requestAnimationFrame(()=>{patchV19Fantasy();requestAnimationFrame(patchV19Fantasy)});
}
window.addEventListener('hashchange',scheduleV19Fantasy);
const v19Target=document.querySelector('#screen');
if(v19Target) new MutationObserver(scheduleV19Fantasy).observe(v19Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV19Fantasy,{once:true}); else scheduleV19Fantasy();
