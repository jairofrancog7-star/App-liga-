/* One bracket geometry for Competition and the Simulator. No CSS cloning. */
(function(){
 'use strict';
 const stages=['playoff','octavos','cuartos','semifinal','final'];
 const labels=['Play-off','Octavos de final','Cuartos de final','Semifinales','Final'];
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shield='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg>';
 function code(name){
  const n=norm(name),known={ 'san jose':'SJO','san julian':'SJU',hermanos:'HNO',herreras:'HFC',galacticos:'GAL',terricolas:'TER',juventus:'JUV',linces:'LIN',napoli:'NAP',franco:'FRA',lobos:'LOB',tavera:'TAV',esperanza:'ESP',boavista:'BOA',manchester:'MAN',promesas:'PRO',abejas:'ABE'};
  for(const [key,value] of Object.entries(known))if(n.includes(key))return value;
  return n.replace(/ /g,'').slice(0,3).toUpperCase().padEnd(3,'-');
 }
 const score=x=>/^\d+$/.test(String(x??'').trim())?Number(x):null;
 function official(category){
  const out=Object.fromEntries(stages.map(s=>[s,[]])),seen=new Set();
  for(const block of category?.fixtures||[])for(const r of block.rows||[]){
   if(!Array.isArray(r))continue;
   const text=norm([r[1],block.title,block.name].join(' '));
   const stage=/play.?off|repechaje/.test(text)?'playoff':/octavos/.test(text)?'octavos':/cuartos/.test(text)?'cuartos':/semifinal/.test(text)?'semifinal':/(?:^| )final(?: |$)/.test(text)?'final':null;
   const a=String(r[2]||'').trim(),b=String(r[6]||'').trim();
   const pending=/^(?:por definir|pendiente|local|visitante|descansa|bye|\?+|—|-)$/i;
   if(!stage||!a||!b||pending.test(a)||pending.test(b)||norm(a)===norm(b))continue;
   const id=JSON.stringify([stage,norm(a),norm(b),r[8]||'',r[3],r[5]]);
   if(seen.has(id))continue;seen.add(id);
   out[stage].push({teams:[{name:a,score:score(r[3])},{name:b,score:score(r[5])}],date:String(r[8]||'').trim()});
  }
  return out;
 }
 function model(category,rows=[],simulate=false){
  const games=official(category),published=stages.some(s=>games[s].length);
  const all=[],seen=new Set();
  for(const r of rows){const key=norm(r.name);if(key&&!seen.has(key)){seen.add(key);all.push({...r,seed:all.length+1});}}
  const projection=simulate&&!published&&all.length>0;
  const seeds=projection?all.slice(0,8):[];
  const playoffs=[];
  if(projection){
   const rest=all.slice(8,24);
   for(let i=0;i<Math.ceil(rest.length/2);i++)playoffs.push({teams:[rest[i],rest.length-1-i===i?null:rest[rest.length-1-i]],bye:rest.length-1-i===i,date:''});
  }
  return {games,projection,published,seeds,playoffs};
 }
 function logo(team,logoFor){
  const src=team?.name?logoFor(team.name):'';
  return src?'<img src="'+esc(src)+'" alt="'+esc(team.name)+'" decoding="async" loading="eager">':'<span class="ljr-ko-shield">'+shield+'</span>';
 }
 function club(team,logoFor){
  return '<div class="ljr-ko-club"'+(team?.name?' title="'+esc(team.name)+'" aria-label="'+esc(team.name)+'"':' aria-label="Plaza por definir"')+'>'+
   (team?.seed?'<small>'+team.seed+'</small>':'')+logo(team,logoFor)+'<strong>'+esc(team?.name?code(team.name):'¿?')+'</strong>'+
   (team?.score!=null?'<b class="ljr-ko-score">'+team.score+'</b>':'')+'</div>';
 }
 function pair(match,y,logoFor){
  return '<div class="ljr-ko-pair" style="--ko-y:'+y+'px">'+club(match?.teams?.[0],logoFor)+'<i class="ljr-ko-versus" aria-hidden="true">o</i>'+club(match?.teams?.[1],logoFor)+'</div>';
 }
 function card(match,y,logoFor,kind='match'){
  return '<div class="ljr-ko-card '+(kind==='winner'?'ljr-ko-winner':'')+'" style="--ko-y:'+y+'px">'+
   (kind==='winner'?'<span class="ljr-ko-shield">'+shield+'</span><strong>Ganador del play-off</strong>':
    '<time>'+esc(match?.date||'Por confirmar')+'</time>'+[0,1].map(i=>'<div class="ljr-ko-opponent">'+logo(match?.teams?.[i],logoFor)+'<b title="'+esc(match?.teams?.[i]?.name||'Por definir')+'">'+esc(match?.teams?.[i]?.name?code(match.teams[i].name):'¿?')+'</b>'+(match?.teams?.[i]?.score!=null?'<strong>'+match.teams[i].score+'</strong>':'')+'</div>').join(''))+'</div>';
 }
 // Geometry is independent of club names/data; connector endpoints use card centres.
 const ys={playoff:[28,100,192,264,384,456,548,620],octavos:[64,136,228,300,420,492,584,656],cuartos:[100,264,456,620],semifinal:[182,538],final:[360]};
 function connectors(from){
  const input=ys[from],output=ys[stages[stages.indexOf(from)+1]];
  if(!output)return '';
  const branches=from==='playoff'?[[0,1,0],[2,3,2],[4,5,4],[6,7,6]]:output.map((_,i)=>[i*2,i*2+1,i]);
  return '<svg class="ljr-ko-connectors" viewBox="0 0 20 710" preserveAspectRatio="none" aria-hidden="true">'+branches.map(([a,b,c],i)=>{
   const y1=input[a],y2=input[b],y=output[c],tone=i>=branches.length/2?'blue':'silver';
   // Semifinals meet in the final with a silver upper and cyan lower branch.
   if(from==='semifinal')return '<path class="silver" d="M0 '+y1+' H4 Q10 '+y1+' 10 '+(y1+6)+' V'+(y-6)+' Q10 '+y+' 16 '+y+' H20"/><path class="blue" d="M0 '+y2+' H4 Q10 '+y2+' 10 '+(y2-6)+' V'+(y+6)+' Q10 '+y+' 16 '+y+' H20"/>';
   return '<path class="'+tone+'" d="M0 '+y1+' H4 Q10 '+y1+' 10 '+(y1+6)+' V'+(y2-6)+' Q10 '+y2+' 4 '+y2+' H0 M10 '+y+' H20"/>';
  }).join('')+'</svg>';
 }
 function rail(){return '<div class="ljr-ko-rail silver"><span>RUTA PLATEADA</span></div><div class="ljr-ko-rail blue"><span>RUTA AZUL</span></div>';}
 function render({category,rows=[],simulate=false,logoFor=()=>'',stage='playoff',categoryId='3',signature=''}){
  const m=model(category,rows,simulate),mode=simulate?'simulator':'competition';
  try{stage=localStorage.getItem('ljr-ko-stage:'+mode+':'+categoryId)||stage;}catch(_){}
  if(!stages.includes(stage))stage='playoff';
  const playoff=m.projection?m.playoffs:m.games.playoff;
  const projectedSeedPair=i=>({teams:[m.seeds[i*2],m.seeds[i*2+1]],date:''});
  const columns=stages.map((s,index)=>{
   let content='';
   if(s==='playoff')content=ys.playoff.map((y,i)=>pair(playoff[i],y,logoFor)).join('');
   if(s==='octavos')content=ys.octavos.map((y,i)=>{
    if(m.projection||!m.games.octavos.length)return i%2===0?card(null,y,logoFor,'winner'):pair(m.projection?projectedSeedPair(Math.floor(i/2)):null,y,logoFor);
    return pair(m.games.octavos[i],y,logoFor);
   }).join('');
   if(s==='cuartos'||s==='semifinal')content=ys[s].map((y,i)=>card(m.games[s][i],y,logoFor)).join('');
   if(s==='final')content=card(m.games.final[0],ys.final[0],logoFor)+'<div class="ljr-ko-trophy" role="img" aria-label="Trofeo de la final"></div>';
   return '<section class="ljr-ko-column '+(s==='final'?'ljr-ko-final':'')+'" data-ko-column="'+s+'" aria-label="'+labels[index]+'"><div class="ljr-ko-date">'+esc(m.games[s][0]?.date||'Por confirmar')+'</div><div class="ljr-ko-round">'+content+(s!=='final'?connectors(s):'')+'</div></section>';
  }).join('');
  return '<section class="ljr-knockout" data-v12-bracket'+(simulate?' data-v512-bracket':'')+' data-ko-mode="'+mode+'" data-ko-category="'+esc(categoryId)+'" data-ko-stage="'+stage+'" data-v1064-cat="'+esc(categoryId)+'" data-v1064-sig="'+esc(signature)+'">'+
   '<div class="ljr-ko-tabs" role="tablist" aria-label="Etapas del cuadro">'+stages.map((s,i)=>'<button type="button" role="tab" aria-selected="'+(s===stage)+'" class="'+(s===stage?'active':'')+'" data-ko-stage="'+s+'">'+labels[i]+'</button>').join('')+'</div>'+
   (simulate?'<p class="ljr-ko-note" role="note">'+(m.projection?'Proyección del simulador · No son cruces oficiales':'Cruces publicados por la liga · Otros por definir')+'</p>':!m.published?'<p class="ljr-ko-note" role="status">Cruces oficiales por definir</p>':'')+
   '<div class="ljr-ko-board"><div class="ljr-ko-routes">'+rail()+'</div><div class="ljr-ko-scroll" aria-label="Cuadro de eliminatorias"><div class="ljr-ko-track">'+columns+'</div></div></div></section>';
 }
 function select(root,stage,animate=true){
  if(!root||!stages.includes(stage))return;
  root.dataset.koStage=stage;
  root.querySelectorAll('.ljr-ko-tabs button').forEach(b=>{b.classList.toggle('active',b.dataset.koStage===stage);b.setAttribute('aria-selected',String(b.dataset.koStage===stage));});
  try{localStorage.setItem('ljr-ko-stage:'+root.dataset.koMode+':'+root.dataset.koCategory,stage);if(root.dataset.koMode==='simulator')localStorage.setItem('v511-simulator-stage',stage);}catch(_){}
  const col=root.querySelector('[data-ko-column="'+stage+'"]'),scroll=root.querySelector('.ljr-ko-scroll');
  if(col&&scroll){
   root.dataset.koScrollTarget=String(Math.min(col.offsetLeft,Math.max(0,scroll.scrollWidth-scroll.clientWidth)));
   scroll.scrollTo({left:Number(root.dataset.koScrollTarget),behavior:animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
  }
  const button=root.querySelector('.ljr-ko-tabs .active'),tabs=button?.parentElement;
  if(button&&tabs)tabs.scrollTo({left:Math.max(0,button.offsetLeft-(tabs.clientWidth-button.offsetWidth)/2),behavior:animate?'smooth':'instant'});
 }
 function init(root){
  if(!root||root.dataset.koReady)return;root.dataset.koReady='1';
  requestAnimationFrame(()=>select(root,root.dataset.koStage,false));
  let end;
  const scroller=root.querySelector('.ljr-ko-scroll');
  for(const event of ['pointerdown','touchstart','wheel'])scroller?.addEventListener(event,()=>{delete root.dataset.koScrollTarget;},{passive:true});
  scroller?.addEventListener('scroll',()=>{
   clearTimeout(end);end=setTimeout(()=>{
    const scroll=root.querySelector('.ljr-ko-scroll'),cols=[...root.querySelectorAll('[data-ko-column]')];
    if(root.dataset.koScrollTarget!=null){
     if(Math.abs(scroll.scrollLeft-Number(root.dataset.koScrollTarget))<2)delete root.dataset.koScrollTarget;
     return;
    }
    const nearest=cols.sort((a,b)=>Math.abs(a.offsetLeft-scroll.scrollLeft)-Math.abs(b.offsetLeft-scroll.scrollLeft))[0];
    if(nearest&&nearest.dataset.koColumn!==root.dataset.koStage)select(root,nearest.dataset.koColumn,false);
   },120);
  },{passive:true});
 }
 window.LJR_KNOCKOUT={render,model,official,init,select,code};
 if(typeof document!=='undefined'){
  document.addEventListener('click',e=>{const b=e.target.closest?.('.ljr-ko-tabs [data-ko-stage]');if(b){e.preventDefault();select(b.closest('.ljr-knockout'),b.dataset.koStage);}});
  document.addEventListener('keydown',e=>{const b=e.target.closest?.('.ljr-ko-tabs button');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=stages.indexOf(b.dataset.koStage),n=e.key==='Home'?0:e.key==='End'?4:(i+(e.key==='ArrowRight'?1:4))%5;const root=b.closest('.ljr-knockout');select(root,stages[n]);root.querySelector('[data-ko-stage="'+stages[n]+'"]').focus({preventScroll:true});});
  window.addEventListener('resize',()=>document.querySelectorAll('.ljr-knockout').forEach(root=>select(root,root.dataset.koStage,false)),{passive:true});
  document.addEventListener('error',e=>{const img=e.target;if(img?.matches?.('.ljr-knockout img')){img.outerHTML='<span class="ljr-ko-shield" aria-label="Escudo no disponible">'+shield+'</span>';}},true);
 }
})();
