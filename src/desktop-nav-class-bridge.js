/* Bridge for desktop navigation class names. Ensures dropdown enhancements bind to the rendered desktop shell. */
(function(){
'use strict';
function bridge(){
  document.querySelectorAll('.desk-menu').forEach(nav=>nav.classList.add('ds-menu'));
}
bridge();
const obs=new MutationObserver(()=>bridge());
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('hashchange',()=>setTimeout(bridge,0));
window.addEventListener('resize',()=>setTimeout(bridge,0));
})();
