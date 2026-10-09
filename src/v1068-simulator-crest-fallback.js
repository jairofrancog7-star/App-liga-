/* V1068 — rescate de escudos ya registrados; sólo en #/simulator.
   No fabrica logos ni equipos y no interviene en otras pantallas. */
(function(){
 'use strict';
 if(window.__LJR_V1068_SIM_LOGOS__)return;
 window.__LJR_V1068_SIM_LOGOS__=true;
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
 function valid(url){
   if(typeof url!=='string')return '';
   const s=url.trim();
   return /^(?:https?:\/\/|data:image\/|\/|\.\.?\/)/i.test(s)?s:'';
 }
 function candidates(name,original){
   const list=[],add=x=>{
     const val=valid(typeof x==='string'?x:x?.app||x?.source||'');
     if(val&&!list.includes(val))list.push(val);
   };
   add(original);
   try{add(window.LJR_TEAM_LOGOS?.get?.(name))}catch(_){}
   try{add(window.LJR_SEASON_LOGOS?.get?.(name))}catch(_){}
   try{add(window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name))}catch(_){}
   try{add(window.LJR_OFFICIAL_API?.getLogo?.(name))}catch(_){}
   const logos=window.LJR_OFFICIAL_DATA?.team_logos||{};
   for(const [key,item] of Object.entries(logos)){
     if(norm(key)===norm(name)){add(item);break}
   }
   return list;
 }
 document.addEventListener('error',function(event){
   const img=event.target;
   if(!(img instanceof HTMLImageElement)||!img.closest('#screen [data-v501-simulator]'))return;
   const parent=img.parentElement;
   if(!parent?.matches('.v501-crest,.v1068-stage-crest,.v1068-final-crest')&&
      !parent?.closest('.v12-bracket-team'))return;
   const team=img.getAttribute('alt')||img.closest('[aria-label]')?.getAttribute('aria-label')||'';
   if(!team)return;
   let options;
   try{options=JSON.parse(img.dataset.v1068Sources||'null')}catch(_){}
   if(!Array.isArray(options)){
     options=candidates(team,img.getAttribute('src')||'');
     img.dataset.v1068Sources=JSON.stringify(options);
   }
   const current=img.getAttribute('src')||'';
   const index=options.findIndex(candidate=>candidate===current||candidate===img.src);
   const next=options[index+1];
   if(next){img.src=next;return}
   img.remove();
   if(parent.querySelector('.v1068-missing-crest'))return;
   const placeholder=document.createElement('span');
   placeholder.className='v1068-missing-crest';
   placeholder.textContent=String(team).trim().slice(0,1).toUpperCase()||'•';
   placeholder.setAttribute('aria-label','Sin escudo publicado');
   parent.append(placeholder);
 },true);
})();
