/* V316 — Lobos CDG · Súper líder · 03 may 2026.
   Nueva tarjeta SOLO en Historia > Campeones, con la foto aportada por el usuario como fondo. */
import p1 from './v316-lobos-cdg-superlider-photo-01.b64?raw';
import p2 from './v316-lobos-cdg-superlider-photo-02.b64?raw';
import p3 from './v316-lobos-cdg-superlider-photo-03.b64?raw';

(function(){
  'use strict';
  if(window.__LJR_V316_LOBOS_CDG_SUPERLIDER__) return;
  window.__LJR_V316_LOBOS_CDG_SUPERLIDER__=true;

  const raw=[p1,p2,p3].join('').replace(/\s+/g,'');
  const PHOTO=(raw.length===20612 && raw.startsWith('UklGR'))
    ? 'data:image/webp;base64,'+raw
    : '';
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function onChampions(){
    const active=document.querySelector('.v35-tab.active');
    return !!active && norm(active.textContent).includes('campeones');
  }

  function isTarget(card){
    const t=norm(card&&card.textContent);
    return t.includes('lobos cdg') && t.includes('03 may 2026') && t.includes('super lider');
  }

  function ensureStyle(){
    if(document.getElementById('v316-lobos-cdg-superlider-style')) return;
    const s=document.createElement('style');
    s.id='v316-lobos-cdg-superlider-style';
    s.textContent=`
      .v316-lobos-cdg-superlider{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        display:flex!important;
        align-items:flex-end!important;
        visibility:visible!important;
        opacity:1!important;
        min-height:360px!important;
        padding:0!important;
        background-color:#07075d!important;
        background-size:cover!important;
        background-position:center 46%!important;
        background-repeat:no-repeat!important;
      }
      .v316-lobos-cdg-superlider>.v316-lobos-photo{
        position:absolute!important;
        inset:0!important;
        z-index:0!important;
        width:100%!important;
        height:100%!important;
        display:block!important;
        object-fit:cover!important;
        object-position:center 46%!important;
        opacity:1!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        pointer-events:none!important;
      }
      .v316-lobos-cdg-superlider>.v316-lobos-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:
          linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.08) 36%,rgba(2,5,45,.43) 70%,rgba(2,5,45,.90) 100%),
          linear-gradient(90deg,rgba(2,5,45,.12),rgba(2,5,45,.01) 70%)!important;
      }
      .v316-lobos-cdg-superlider>.v35-history-moment-content{
        position:relative!important;
        z-index:2!important;
        width:100%!important;
        background:transparent!important;
      }
      .v316-lobos-cdg-superlider .v35-history-kind,
      .v316-lobos-cdg-superlider .v35-history-date,
      .v316-lobos-cdg-superlider h3,
      .v316-lobos-cdg-superlider strong,
      .v316-lobos-cdg-superlider b,
      .v316-lobos-cdg-superlider p,
      .v316-lobos-cdg-superlider span,
      .v316-lobos-cdg-superlider time{
        text-shadow:0 2px 7px rgba(0,0,0,.88)!important;
      }
    `;
    document.head.appendChild(s);
  }

  function photo(){
    const img=document.createElement('img');
    img.className='v316-lobos-photo';
    img.src=PHOTO;
    img.alt='Lobos CDG · Súper líder · 03 may 2026';
    img.loading='eager';
    img.decoding='async';
    return img;
  }

  function shade(){
    const x=document.createElement('span');
    x.className='v316-lobos-shade';
    x.setAttribute('aria-hidden','true');
    return x;
  }

  function makeCard(){
    const a=document.createElement('article');
    a.className='v35-history-moment v35-history-moment-photo v316-lobos-cdg-superlider';
    a.dataset.v316LobosCdgSuperlider='1';
    if(PHOTO) a.appendChild(photo());
    a.appendChild(shade());

    const c=document.createElement('div');
    c.className='v35-history-moment-content';
    c.innerHTML=
      '<div class="v35-history-meta"><span class="v35-history-kind">SÚPER LÍDER</span><time class="v35-history-date">03 may 2026</time></div>'+
      '<h3>Lobos CDG</h3>'+
      '<strong>Súper líder · Temporada 2026</strong>'+
      '<div class="v35-history-status"><span><b>Reconocimiento</b>Súper líder</span><span><b>Fecha</b>03 may 2026</span><span><b>Temporada</b>2026</span></div>'+
      '<p>Lobos CDG · Súper líder · 03 de mayo de 2026.</p>';
    a.appendChild(c);
    return a;
  }

  function patchExisting(){
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
      if(!isTarget(card)) return;
      card.classList.add('v316-lobos-cdg-superlider','v35-history-moment-photo');
      if(PHOTO && !card.querySelector(':scope > .v316-lobos-photo')){
        card.prepend(photo());
        card.insertBefore(shade(),card.children[1]||null);
      }
    });
  }

  function parseDate(el){
    const t=norm(el&&el.textContent);
    const months={ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11};
    const m=t.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s+(20\d{2})/);
    return m?Date.UTC(Number(m[3]),months[m[2]],Number(m[1])):null;
  }

  function insertChronological(container,node){
    const targetTs=Date.UTC(2026,4,3);
    const before=[...container.children].find(el=>{
      const ts=parseDate(el);
      return ts!==null && ts<targetTs;
    });
    if(before) container.insertBefore(node,before);
    else container.appendChild(node);
  }

  function ensure(){
    if((location.hash||'').indexOf('history')<0) return;
    ensureStyle();
    patchExisting();
    if(!onChampions()) return;

    const content=document.querySelector('[data-v35-content]');
    const containers=[...(content?content.querySelectorAll('.v35-history-moments'):[])];
    containers.forEach(container=>{
      if([...container.children].some(isTarget)) return;
      insertChronological(container,makeCard());
    });
  }

  let timer=0;
  function schedule(ms=0){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      ensure();
      setTimeout(ensure,140);
      setTimeout(ensure,450);
      setTimeout(ensure,950);
    },ms);
  }

  window.addEventListener('hashchange',()=>schedule(30));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(70);
  },true);
  new MutationObserver(()=>schedule(40)).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(40),{once:true});
  else schedule(20);
})();