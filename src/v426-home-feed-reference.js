(function(){
'use strict';
if(window.__LJR_V426_HOME_FEED_REFERENCE__)return;
window.__LJR_V426_HOME_FEED_REFERENCE__=true;

const LEAGUE_LOGO='https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/720d1f82-1d59-4a7a-af69-9e7e8da0250a.png';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function sourceItems(){
  const news=$$('#screen .news-card').slice(0,3);
  const logos=$$('#screen .v65-table-logo img').map(img=>img.currentSrc||img.src).filter(Boolean);
  return news.map((card,i)=>{
    const title=$('h3',card)?.textContent?.trim()||'Noticias de la Liga Juventino';
    const category=$('.eyebrow',card)?.textContent?.trim()||'LIGA';
    const date=$('small',card)?.textContent?.trim()||'Actualización';
    return {title,category,date,image:logos[i%Math.max(logos.length,1)]||LEAGUE_LOGO};
  });
}

function fallbackItems(){
  const logos=$$('#screen .v65-table-logo img').map(img=>img.currentSrc||img.src).filter(Boolean);
  const base=[
    ['Actividad de la Liga Juventino','LIGA'],
    ['Consulta los próximos partidos y resultados','PARTIDOS'],
    ['Revisa noticias, avisos y movimientos de equipos','ACTUALIDAD']
  ];
  return base.map((x,i)=>({title:x[0],category:x[1],date:'Actualización',image:logos[i%Math.max(logos.length,1)]||LEAGUE_LOGO}));
}

function card(item){
  return '<button type="button" class="v426-feed-card" data-v426-open="news">'+
    '<span class="v426-copy"><strong>'+esc(item.title)+'</strong>'+
      '<span class="v426-meta"><img src="'+esc(LEAGUE_LOGO)+'" alt="" loading="lazy" decoding="async">'+
      '<span><b>'+esc(item.category)+'</b><small> · '+esc(item.date)+'</small></span></span>'+
    '</span>'+
    '<span class="v426-thumb"><img src="'+esc(item.image)+'" alt="" loading="lazy" decoding="async" onerror="this.src=\''+LEAGUE_LOGO+'\'"></span>'+
  '</button>';
}

function markup(items){
  return '<section class="v426-home-feed" aria-label="Noticias y actualidad de la Liga">'+
    '<div class="v426-feed-tabs" role="tablist" aria-label="Filtros de noticias">'+
      '<button type="button" class="v426-feed-tab is-active" data-v426-tab="all">Para ti</button>'+
      '<button type="button" class="v426-feed-tab" data-v426-tab="news">Top News</button>'+
      '<button type="button" class="v426-feed-tab" data-v426-tab="team">Mi equipo</button>'+
      '<button type="button" class="v426-feed-tab" data-v426-tab="market">Mercado</button>'+
    '</div>'+
    '<div class="v426-feed-list">'+items.map(card).join('')+'</div>'+
  '</section>';
}

function bind(host){
  host.addEventListener('click',e=>{
    const tab=e.target.closest('[data-v426-tab]');
    if(tab){
      const key=tab.dataset.v426Tab;
      if(key==='team'){ location.hash='#/following'; return; }
      if(key==='market'){ location.hash='#/transfers'; return; }
      $$('.v426-feed-tab',host).forEach(b=>b.classList.toggle('is-active',b===tab));
      if(key==='news'){ location.hash='#/news'; return; }
      return;
    }
    if(e.target.closest('[data-v426-open="news"]')) location.hash='#/news';
  });
}

function mount(){
  if(route()!=='home')return;
  const screen=$('#screen');
  if(!screen||screen.querySelector('.v426-home-feed'))return;
  const anchor=screen.querySelector('.v65-home-fields')||screen.querySelector('.v65-home-table')||screen.lastElementChild;
  if(!anchor)return;
  const items=sourceItems();
  const wrap=document.createElement('div');
  wrap.innerHTML=markup(items.length?items:fallbackItems());
  const host=wrap.firstElementChild;
  anchor.insertAdjacentElement('afterend',host);
  bind(host);
}

let timer=0;
function schedule(){
  clearTimeout(timer);
  timer=setTimeout(mount,70);
}
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=$('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();
setTimeout(mount,350);
setTimeout(mount,1000);
})();