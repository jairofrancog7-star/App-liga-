const PHOTO='./assets/history/archive-v232/universidad-campeon-veteranos-09-mar-2013.webp?v=20260923-universidad-bg-v262';

const norm=v=>String(v||'')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .toLowerCase()
  .replace(/\s+/g,' ')
  .trim();

function applyUniversidad2013Background(){
  if(!location.hash.toLowerCase().includes('history')) return;

  const cards=[...document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,article')];
  cards.forEach(card=>{
    const txt=norm(card.textContent);
    if(!txt.includes('universidad') || !txt.includes('09 mar 2013')) return;

    card.dataset.universidadBgV262='1';
    card.style.setProperty('position','relative','important');
    card.style.setProperty('overflow','hidden','important');
    card.style.setProperty('isolation','isolate','important');
    card.style.setProperty('background-color','#07106f','important');
    card.style.setProperty(
      'background-image',
      'linear-gradient(180deg,rgba(2,7,55,.10) 0%,rgba(2,7,55,.24) 34%,rgba(2,7,55,.76) 72%,rgba(2,7,55,.94) 100%),url("'+PHOTO+'")',
      'important'
    );
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 46%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    const oldBg=card.querySelector('.v35-history-bg-photo,.v35-bg-exact,.v227-manchester-bg');
    if(oldBg){
      oldBg.src=PHOTO;
      oldBg.style.setProperty('display','block','important');
      oldBg.style.setProperty('position','absolute','important');
      oldBg.style.setProperty('inset','0','important');
      oldBg.style.setProperty('width','100%','important');
      oldBg.style.setProperty('height','100%','important');
      oldBg.style.setProperty('object-fit','cover','important');
      oldBg.style.setProperty('object-position','center 46%','important');
      oldBg.style.setProperty('opacity','1','important');
      oldBg.style.setProperty('filter','none','important');
      oldBg.style.setProperty('transform','none','important');
      oldBg.style.setProperty('z-index','0','important');
    }

    const content=card.querySelector('.v35-history-moment-content');
    if(content){
      content.style.setProperty('position','relative','important');
      content.style.setProperty('z-index','3','important');
    }
    const shade=card.querySelector('.v35-history-moment-shade');
    if(shade){
      shade.style.setProperty('display','none','important');
    }
  });
}

let queued=false;
function queueApply(){
  if(queued) return;
  queued=true;
  requestAnimationFrame(()=>{
    queued=false;
    applyUniversidad2013Background();
  });
}

window.addEventListener('hashchange',queueApply);
window.addEventListener('popstate',queueApply);
document.addEventListener('click',()=>setTimeout(queueApply,60),true);

const observer=new MutationObserver(queueApply);
observer.observe(document.documentElement,{subtree:true,childList:true});

queueApply();
setTimeout(queueApply,250);
setTimeout(queueApply,900);
setTimeout(queueApply,1800);
