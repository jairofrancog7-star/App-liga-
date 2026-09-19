const V15_TEAM_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V15_STORIES=[
  {label:'Atlético Galeana 📸',route:'teams',logo:'assets/official-logos/galeana.png'},
  {label:'Promesas FC 📸',route:'teams',logo:'assets/official-logos/promesas-fc.png'},
  {label:'Momentos<br>de la Liga ✨',route:'moments',logo:'assets/liga-logo.webp',type:'moments'},
  {label:'La Huerta 📸',route:'teams',logo:'assets/official-logos/la-huerta.png'},
  {label:'Franco FC 📸',route:'teams',logo:'assets/official-logos/franco-fc.png'}
];

function v15Route(){return location.hash.replace('#/','')||'home'}

function v15PatchHome(){
  if(v15Route()!=='home') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;

  const stories=[...screen.querySelectorAll(':scope > .stories .story')];
  stories.forEach((story,i)=>{
    const item=V15_STORIES[i];
    if(!item||story.dataset.v15Story==='1') return;
    story.dataset.v15Story='1';
    story.dataset.route=item.route;
    const ring=story.querySelector('.story-ring');
    const label=story.querySelector('small');
    if(ring){
      ring.innerHTML='<span class="story-inner v15-story-inner"><img src="'+V15_TEAM_BASE+item.logo+'" alt="'+item.label.replace(/<br>|📸|✨/g,'').trim()+'"></span>';
    }
    if(label) label.innerHTML=item.label;
  });


  // Tarjeta principal reconstruida en SVG vectorial para evitar pixelado/borrosidad.
  const hero=screen.querySelector(':scope > .section.hero');
  if(hero&&hero.dataset.v15HomeFeature!=='2'){
    hero.dataset.v15HomeFeature='2';
    hero.innerHTML=`
      <svg class="v15-home-feature-art" viewBox="0 0 860 1285" role="img" aria-label="Mira todos los goles de la Jornada 1">
        <defs>
          <linearGradient id="v15-card-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#06080f"/>
            <stop offset=".52" stop-color="#071028"/>
            <stop offset="1" stop-color="#020438"/>
          </linearGradient>
          <linearGradient id="v15-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#293429" stop-opacity=".88"/>
            <stop offset="1" stop-color="#071128" stop-opacity=".15"/>
          </linearGradient>
          <linearGradient id="v15-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#02043f" stop-opacity="0"/>
            <stop offset=".35" stop-color="#02043f" stop-opacity=".35"/>
            <stop offset="1" stop-color="#02043f" stop-opacity=".98"/>
          </linearGradient>
          <linearGradient id="v15-blue-shirt" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#07121a"/>
            <stop offset=".22" stop-color="#07121a"/>
            <stop offset=".23" stop-color="#0a8ba7"/>
            <stop offset=".40" stop-color="#0a8ba7"/>
            <stop offset=".41" stop-color="#06131b"/>
            <stop offset=".59" stop-color="#06131b"/>
            <stop offset=".60" stop-color="#0b7e99"/>
            <stop offset=".77" stop-color="#0b7e99"/>
            <stop offset=".78" stop-color="#07121a"/>
          </linearGradient>
          <filter id="v15-glow"><feGaussianBlur stdDeviation="18"/></filter>
          <filter id="v15-soft"><feGaussianBlur stdDeviation="8"/></filter>
          <clipPath id="v15-round"><rect width="860" height="1285" rx="72"/></clipPath>
        </defs>

        <g clip-path="url(#v15-round)">
          <rect width="860" height="1285" fill="url(#v15-card-bg)"/>
          <ellipse cx="115" cy="270" rx="105" ry="120" fill="#ffffff" opacity=".08" filter="url(#v15-glow)"/>
          <rect x="78" y="205" width="12" height="350" rx="6" fill="#777d88" opacity=".65"/>
          <g fill="#fff">
            <circle cx="62" cy="190" r="13"/><circle cx="91" cy="190" r="13"/><circle cx="120" cy="190" r="13"/><circle cx="149" cy="190" r="13"/>
            <circle cx="62" cy="221" r="13"/><circle cx="91" cy="221" r="13"/><circle cx="120" cy="221" r="13"/><circle cx="149" cy="221" r="13"/>
          </g>
          <g fill="#e8f3ff" opacity=".22" filter="url(#v15-soft)">
            <circle cx="690" cy="410" r="13"/><circle cx="742" cy="450" r="10"/><circle cx="648" cy="476" r="9"/>
            <circle cx="278" cy="450" r="10"/><circle cx="220" cy="470" r="8"/><circle cx="795" cy="495" r="8"/>
          </g>
          <rect y="515" width="860" height="325" fill="url(#v15-field)"/>
          <path d="M0 650 C170 590 320 600 430 625 C580 660 710 640 860 585 L860 865 L0 865Z" fill="#22311f" opacity=".42"/>

          <!-- Futbolista local ficticio 1 -->
          <g transform="translate(208 256)">
            <ellipse cx="185" cy="80" rx="46" ry="54" fill="#a96c4b"/>
            <path d="M144 130 Q184 105 229 128 L259 314 Q218 342 148 324 L118 185Z" fill="url(#v15-blue-shirt)"/>
            <path d="M135 155 Q88 192 62 282" fill="none" stroke="#a96c4b" stroke-width="31" stroke-linecap="round"/>
            <path d="M228 157 Q281 191 302 250" fill="none" stroke="#a96c4b" stroke-width="30" stroke-linecap="round"/>
            <path d="M162 322 L136 515" fill="none" stroke="#11192d" stroke-width="54" stroke-linecap="round"/>
            <path d="M222 323 L245 514" fill="none" stroke="#101728" stroke-width="54" stroke-linecap="round"/>
            <path d="M134 508 L100 598" fill="none" stroke="#16213a" stroke-width="32" stroke-linecap="round"/>
            <path d="M248 508 L285 585" fill="none" stroke="#16213a" stroke-width="32" stroke-linecap="round"/>
            <ellipse cx="97" cy="605" rx="45" ry="15" fill="#121b30" transform="rotate(-13 97 605)"/>
            <ellipse cx="293" cy="589" rx="44" ry="15" fill="#121b30" transform="rotate(14 293 589)"/>
            <path d="M149 52 Q185 15 224 50 Q205 23 180 24 Q153 26 149 52" fill="#0c1016"/>
            <path d="M168 75 Q186 88 204 75" fill="none" stroke="#4f3024" stroke-width="5" stroke-linecap="round"/>
          </g>

          <!-- Futbolista local ficticio 2 -->
          <g transform="translate(480 360) scale(.82)">
            <ellipse cx="170" cy="66" rx="43" ry="50" fill="#a86a49"/>
            <path d="M131 112 Q171 94 214 112 L239 279 Q199 307 136 292 L110 157Z" fill="#b7382f"/>
            <path d="M120 145 Q70 176 53 240" fill="none" stroke="#a86a49" stroke-width="29" stroke-linecap="round"/>
            <path d="M213 145 Q264 170 292 229" fill="none" stroke="#a86a49" stroke-width="29" stroke-linecap="round"/>
            <path d="M148 288 L128 465" fill="none" stroke="#792a29" stroke-width="49" stroke-linecap="round"/>
            <path d="M203 289 L231 459" fill="none" stroke="#792a29" stroke-width="49" stroke-linecap="round"/>
            <path d="M128 458 L100 535" fill="none" stroke="#4c2630" stroke-width="28" stroke-linecap="round"/>
            <path d="M231 454 L266 526" fill="none" stroke="#4c2630" stroke-width="28" stroke-linecap="round"/>
            <ellipse cx="96" cy="541" rx="39" ry="13" fill="#272331" transform="rotate(-10 96 541)"/>
            <ellipse cx="273" cy="531" rx="39" ry="13" fill="#272331" transform="rotate(12 273 531)"/>
            <path d="M135 39 Q169 7 207 38 Q191 16 167 17 Q143 20 135 39" fill="#111216"/>
          </g>

          <rect y="610" width="860" height="675" fill="url(#v15-fade)"/>

          <text x="72" y="972" fill="#fff" font-family="Inter,Roboto,Arial,sans-serif" font-size="67" font-weight="900">
            <tspan x="72" dy="0">Mira todos los goles de la</tspan>
            <tspan x="72" dy="82">Jornada 1</tspan>
          </text>
          <text x="72" y="1168" fill="#fff" opacity=".93" font-family="Inter,Roboto,Arial,sans-serif" font-size="41" font-weight="400">
            <tspan x="72" dy="0">La pasión del fútbol local en un solo</tspan>
            <tspan x="72" dy="58">lugar</tspan>
          </text>
        </g>
      </svg>
      <button class="v15-home-feature-hit" type="button" aria-label="Ver todos los goles de la Jornada 1"></button>
    `;
  }
}

function v15PatchVideo(){
  if(v15Route()!=='video') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  const hero=screen.querySelector(':scope > .hero.video-hero');
  if(hero&&hero.dataset.v15VideoFeature!=='1'){
    hero.dataset.v15VideoFeature='1';
    hero.innerHTML='<img class="v15-video-reference-image" src="./video-hero-reference.webp?v=parts14" alt="Repetición del partido - Liga Juventino TV"><button class="v15-video-hit v15-video-hit-primary" type="button" aria-label="Ver ahora"></button><button class="v15-video-hit v15-video-hit-secondary" type="button" aria-label="Partido de la semana"></button>';
  }
}

function v15Toast(text){
  let el=document.querySelector('.v15-toast');
  if(!el){el=document.createElement('div');el.className='v15-toast';document.body.appendChild(el)}
  el.textContent=text;el.classList.add('show');clearTimeout(v15Toast.t);v15Toast.t=setTimeout(()=>el.classList.remove('show'),1500);
}

function v15Patch(){
  v15PatchHome();
  v15PatchVideo();
}

document.addEventListener('click',e=>{
  if(e.target.closest('.v15-home-feature-hit')){
    const videoNav=document.querySelector('.bottom-nav [data-route="video"]');
    if(videoNav){videoNav.click();return}
  }
  if(e.target.closest('.v15-video-hit-primary')){v15Toast('Repetición del partido');return}
  if(e.target.closest('.v15-video-hit-secondary')){v15Toast('Partido de la semana');return}
},true);

window.addEventListener('hashchange',()=>requestAnimationFrame(v15Patch));
const v15Screen=document.querySelector('#screen');
if(v15Screen)new MutationObserver(()=>requestAnimationFrame(v15Patch)).observe(v15Screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(v15Patch),{once:true});
else requestAnimationFrame(v15Patch);
