// Small runtime guards for actions that need to work across dynamically rendered screens.
(function(){
  const KEY='lj-store-v3';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
  function write(v){localStorage.setItem(KEY,JSON.stringify(v))}

  document.addEventListener('click',function(e){
    const cheer=e.target.closest('[data-action="cheer"][data-cheer]');
    if(cheer){
      e.preventDefault();e.stopImmediatePropagation();
      const data=read();data.cheers=data.cheers||{};
      const id=cheer.dataset.cheer;data.cheers[id]=(data.cheers[id]||0)+1;write(data);
      cheer.textContent=(cheer.textContent.includes('partido')?'Apoyar partido · ':'Apoyar · ')+data.cheers[id];
      return;
    }
    const theme=e.target.closest('[data-route="theme"]');
    if(theme){
      e.preventDefault();e.stopImmediatePropagation();
      const data=read();data.theme=data.theme==='light'?'dark':'light';write(data);
      document.documentElement.classList.toggle('lightmode',data.theme==='light');
      history.replaceState(null,'','#/more');
      const more=document.querySelector('[data-route="more"]');if(more)more.click();
    }
  },true);
})();
