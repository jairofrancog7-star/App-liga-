/* V999 — Accesibilidad y pantalla libre para /simulator. No altera resultados ni clasificaciones. */
(function(){
  'use strict';
  if(window.__LJR_V999_SIMULATOR_UI__)return;
  window.__LJR_V999_SIMULATOR_UI__=true;
  const KEY='v999-simulator-sheet-hidden';
  function isSimulator(){return /^#\/?simulator(?:\?|$)/.test(location.hash||'');}
  function storageGet(key){try{return localStorage.getItem(key);}catch(_){return null;}}
  function storageSet(key,value){try{localStorage.setItem(key,value);}catch(_){}}
  let hidden=storageGet(KEY)!=='false';
  const abbreviationPairs=[
    [/\bDEPORTIVO\b/gi,'Dep.'],
    [/\bDEPORTIVA\b/gi,'Dep.'],
    [/\bSAN\b/gi,'S.'],
    [/\bSANTA\b/gi,'Sta.'],
    [/\bHERMANOS\b/gi,'Hnos.'],
    [/\bUNIVERSIDAD\b/gi,'Univ.'],
    [/\bATLETICO\b/gi,'Atl.'],
    [/\bFRACCIONAMIENTO\b/gi,'Fracc.'],
    [/\bFUTBOL CLUB\b/gi,'FC']
  ];
  function shortName(full){
    const original=String(full||'').trim();
    if(original.length<2||original==='—'||original==='¿?')return original;
    let short=original;
    for(const [regex,replacement] of abbreviationPairs)short=short.replace(regex,replacement);
    if(short.length<=16)return short;
    const terms=short.split(/\s+/);
    for(let i=1;i<terms.length-1&&terms.join(' ').length>16;i++){
      if(terms[i].length>4)terms[i]=terms[i].slice(0,3)+'.';
    }
    short=terms.join(' ');
    return short.length<=16?short:short.slice(0,15).trimEnd().replace(/[.\s]+$/,'')+'…';
  }
  function abbreviateNames(root){
    root.querySelectorAll('.v12-bracket-team strong,.v517-ko-team b,.v501-sim-team b').forEach(label=>{
      if(label.dataset.v999Shortened)return;
      const full=(label.textContent||'').trim();
      if(!full)return;
      label.dataset.v999Shortened='1';
      label.dataset.v999FullName=full;
      label.textContent=shortName(full);
      const card=label.closest('.v12-bracket-team,.v517-ko-team,.v501-sim-team');
      if(card){card.title=full;card.setAttribute('aria-label',full);}
    });
  }
  function syncPanel(sheet){
    sheet.classList.toggle('v999-sheet-hidden',hidden);
    const button=sheet.querySelector('[data-v999-panel-toggle]');
    if(!button)return;
    button.setAttribute('aria-expanded',String(!hidden));
    button.setAttribute('aria-label',hidden?'Abrir simulador de resultados':'Ocultar simulador de resultados');
    const caption=button.querySelector('.v999-toggle-caption');
    const chevron=button.querySelector('.v999-toggle-chevron');
    const nextCaption=hidden?'Abrir simulador':'Ocultar';
    const nextChevron=hidden?'⌃':'⌄';
    // Avoid a MutationObserver feedback loop: textContent creates child mutations.
    if(caption&&caption.textContent!==nextCaption)caption.textContent=nextCaption;
    if(chevron&&chevron.textContent!==nextChevron)chevron.textContent=nextChevron;
  }
  function enhance(){
    if(!isSimulator())return;
    const root=document.querySelector('#screen [data-v501-simulator]');
    if(!root)return;
    abbreviateNames(root);
    const sheet=root.querySelector('.v501-sheet');
    if(!sheet)return;
    if(!sheet.querySelector('[data-v999-panel-toggle]')){
      const toolbar=document.createElement('div');
      toolbar.className='v999-sheet-toolbar';
      toolbar.innerHTML='<button type="button" class="v999-sheet-toggle" data-v999-panel-toggle aria-expanded="false" aria-label="Abrir simulador de resultados"><span class="v999-toggle-chevron" aria-hidden="true">⌃</span><span class="v999-toggle-caption">Abrir simulador</span></button>';
      sheet.insertBefore(toolbar,sheet.firstChild);
    }
    syncPanel(sheet);
  }
  function setHidden(value){
    hidden=Boolean(value);
    storageSet(KEY,hidden?'true':'false');
    if(!hidden){
      /* La hoja original conserva sus gestos y tres alturas al reabrirse. */
      storageSet('v515-simulator-sheet-snap','mid');
    }
    const sheet=document.querySelector('#screen [data-v501-simulator] .v501-sheet');
    if(sheet)syncPanel(sheet);
    if(!hidden)window.dispatchEvent(new Event('resize'));
  }
  document.addEventListener('click',function(event){
    const button=event.target instanceof Element&&event.target.closest('[data-v999-panel-toggle]');
    if(!button||!isSimulator())return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setHidden(!hidden);
  },true);
  function init(){
    enhance();
    const screen=document.getElementById('screen');
    if(screen){
      const observer=new MutationObserver(enhance);
      observer.observe(screen,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('hashchange',enhance);
  window.addEventListener('ljr:official-data',enhance);
})();
