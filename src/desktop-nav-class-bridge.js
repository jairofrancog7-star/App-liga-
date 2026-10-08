/* Desktop navigation bridge. Loads the PC functionality adapter before desktop shells. */
(function(){
'use strict';
const mode=new URLSearchParams(location.search).get('mode');
if(mode==='mobile'||mode==='apk')return;
function bridge(){document.querySelectorAll('.desk-menu').forEach(nav=>nav.classList.add('ds-menu'))}
bridge();
const obs=new MutationObserver(bridge);
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('hashchange',()=>setTimeout(bridge,0));
window.addEventListener('resize',()=>setTimeout(bridge,0));
if(!window.__LJR_PC_PARITY_SCRIPT__){
 window.__LJR_PC_PARITY_SCRIPT__=true;
 const script=document.createElement('script');
 script.src='./src/desktop-parity-20261008.js?v=pc-parity-20261008';
 script.defer=true;
 document.head.appendChild(script);
}
})();
