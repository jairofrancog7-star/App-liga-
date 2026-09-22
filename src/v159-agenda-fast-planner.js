/* V159 — Agenda rápida de jornada:
   - filtro de equipos por categoría + búsqueda por nombre/letra
   - selector de campos oficiales
   - formatos de 120/150 min
   - exportación PNG de la agenda
*/
(function(){
'use strict';
if(window.__LJR_V159_AGENDA_FAST__)return;
window.__LJR_V159_AGENDA_FAST__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9Ñ]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

const FALLBACK_TEAMS={
  'Primera Fuerza':['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas'],
  'Intermedia':['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta'],
  'Segunda Fuerza':['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'],
  'Veteranos 35+':['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán'],
  'Veteranos 50+':['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']
};
const CAT_ORDER=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];

const FALLBACK_FIELDS=[
 {id:'sur-1',name:'Campo 1 · Unidad Deportiva Sur',community:'Juventino Rosas'},
 {id:'sur-2',name:'Campo 2 · Unidad Deportiva Sur',community:'Juventino Rosas'},
 {id:'sur-3',name:'Campo 3 · Unidad Deportiva Sur',community:'Juventino Rosas'},
 {id:'zapata-4',name:'Campo 4 · Emiliano Zapata',community:'Juventino Rosas'},
 {id:'cerrito',name:'Campo Cerrito de Gasca',community:'Cerrito de Gasca'},
 {id:'tavera',name:'Campo de Tavera',community:'Franco Tavera'},
 {id:'san-juan',name:'Campo San Juan de la Cruz',community:'San Juan de la Cruz'},
 {id:'cuenda',name:'Unidad Deportiva Santiago de Cuenda',community:'Santiago de Cuenda'},
 {id:'romerillo',name:'Campo San Antonio de Romerillo',community:'San Antonio de Romerillo'},
 {id:'fraccionamiento',name:'Campo Fraccionamiento Comontuoso',community:'Comontuoso / Santiago de Cuenda'},
 {id:'pozos',name:'Campo de Fútbol de Pozos',community:'Pozos'},
 {id:'rincon',name:'Campo Rincón de Centeno',community:'Rincón de Centeno'},
 {id:'san-jose',name:'Campo San José de la Montaña',community:'San José de la Montaña'},
 {id:'san-julian',name:'Campo San Julián Tierra Blanca',community:'San Julián Tierra Blanca'}
];
let fieldCache=null;

function teamList(){
  const out=[],seen=new Set();
  try{
    const list=window.LJR_V100?.officialTeams?.()||[];
    list.forEach(x=>{
      if(!x?.name)return;
      const cat=x.category||'Por confirmar',k=norm(x.name)+'|'+cat;
      if(!seen.has(k)){seen.add(k);out.push({name:x.name,category:cat})}
    });
  }catch(_){}
  for(const cat of CAT_ORDER)for(const name of (FALLBACK_TEAMS[cat]||[])){
    const k=norm(name)+'|'+cat;if(seen.has(k))continue;seen.add(k);out.push({name,category:cat});
  }
  return out.sort((a,b)=>{
    const ca=CAT_ORDER.indexOf(a.category),cb=CAT_ORDER.indexOf(b.category);
    return (ca<0?99:ca)-(cb<0?99:cb)||a.name.localeCompare(b.name,'es',{sensitivity:'base'});
  });
}
async function fields(){
  if(fieldCache)return fieldCache;
  try{
    const r=await fetch('./public/data/fields-v38-22.json?v=20260922-agenda-v159',{cache:'no-store'});
    if(r.ok){
      const j=await r.json(),arr=Array.isArray(j)?j:(j.fields||[]);
      if(arr.length){fieldCache=arr.map(x=>({id:x.id||'',name:x.name||'',community:x.community||'',address:x.address||''}));return fieldCache}
    }
  }catch(_){}
  fieldCache=FALLBACK_FIELDS.slice();return fieldCache;
}
function teamLogo(name){
  try{return window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||''}catch(_){return ''}
}
function setNative(el,value){
  if(!el)return;
  let opt=[...el.options||[]].find(o=>norm(o.value||o.textContent)===norm(value));
  if(!opt&&el.tagName==='SELECT'){
    opt=document.createElement('option');opt.value=value;opt.textContent=value;el.appendChild(opt);
  }
  el.value=opt?opt.value:value;
  el.dispatchEvent(new Event('input',{bubbles:true}));
  el.dispatchEvent(new Event('change',{bubbles:true}));
}
function toast(msg){
  let t=$('.v159-toast');if(t)t.remove();
  t=document.createElement('div');t.className='v159-toast';t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}
function closeLayer(){
  $('[data-v159-layer]')?.remove();
  document.body.classList.remove('v159-open');
}
function teamPicker(target,button){
  closeLayer();document.body.classList.add('v159-open');
  let cat='all',q='';
  const layer=document.createElement('div');layer.className='v159-layer';layer.dataset.v159Layer='';
  layer.innerHTML='<button class="v159-backdrop" data-v159-close aria-label="Cerrar"></button>'+
    '<section class="v159-sheet" role="dialog" aria-modal="true">'+
      '<header><div><small>PREPARAR JORNADA</small><h2>Escoger equipo</h2></div><button data-v159-close>×</button></header>'+
      '<label class="v159-search"><span>⌕</span><input type="search" placeholder="Buscar: Ame, Fran, Her..." autocomplete="off"></label>'+
      '<div class="v159-filter-title">CATEGORÍA</div><div class="v159-cats"></div>'+
      '<div class="v159-result-count"></div><div class="v159-results"></div>'+
    '</section>';
  document.body.appendChild(layer);
  $$('[data-v159-close]',layer).forEach(b=>b.onclick=closeLayer);
  const input=$('input',layer),cats=$('.v159-cats',layer),results=$('.v159-results',layer),count=$('.v159-result-count',layer);
  const all=teamList();
  const render=()=>{
    cats.innerHTML='<button class="'+(cat==='all'?'active':'')+'" data-cat="all">Todas</button>'+
      CAT_ORDER.map(c=>'<button class="'+(cat===c?'active':'')+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>').join('');
    $$('[data-cat]',cats).forEach(b=>b.onclick=()=>{cat=b.dataset.cat;render()});
    const qq=norm(q),show=all.filter(x=>(cat==='all'||x.category===cat)&&(!qq||norm(x.name).includes(qq)));
    count.textContent=show.length+' equipos';
    results.innerHTML=show.length?show.map(x=>{
      const logo=teamLogo(x.name);
      return '<button class="v159-row" data-team="'+esc(x.name)+'" data-category="'+esc(x.category)+'">'+
        '<span class="v159-team-logo">'+(logo?'<img src="'+esc(logo)+'" alt="">':'<i>'+esc(x.name.slice(0,2).toUpperCase())+'</i>')+'</span>'+
        '<span><b>'+esc(x.name)+'</b><small>'+esc(x.category)+'</small></span><em>›</em></button>';
    }).join(''):'<div class="v159-empty">No hay coincidencias.</div>';
    $$('[data-team]',results).forEach(b=>b.onclick=()=>{
      setNative(target,b.dataset.team);
      button.querySelector('b').textContent=b.dataset.team;
      button.querySelector('small').textContent=b.dataset.category;
      closeLayer();
    });
  };
  input.oninput=()=>{q=input.value;render()};render();setTimeout(()=>input.focus({preventScroll:true}),80);
}
async function fieldPicker(target,button){
  closeLayer();document.body.classList.add('v159-open');
  let q='';const list=await fields();
  const layer=document.createElement('div');layer.className='v159-layer';layer.dataset.v159Layer='';
  layer.innerHTML='<button class="v159-backdrop" data-v159-close aria-label="Cerrar"></button>'+
    '<section class="v159-sheet" role="dialog" aria-modal="true">'+
      '<header><div><small>CAMPOS DE LA LIGA</small><h2>Escoger campo</h2></div><button data-v159-close>×</button></header>'+
      '<label class="v159-search"><span>⌕</span><input type="search" placeholder="Buscar campo o comunidad" autocomplete="off"></label>'+
      '<div class="v159-results"></div>'+
    '</section>';
  document.body.appendChild(layer);$$('[data-v159-close]',layer).forEach(b=>b.onclick=closeLayer);
  const input=$('input',layer),results=$('.v159-results',layer);
  const render=()=>{
    const qq=norm(q),show=list.filter(x=>!qq||norm(x.name+' '+x.community+' '+(x.address||'')).includes(qq));
    results.innerHTML='<button class="v159-row field" data-field=""><span class="v159-field-icon">?</span><span><b>Por confirmar</b><small>Sin sede definida</small></span><em>›</em></button>'+
      show.map(x=>'<button class="v159-row field" data-field="'+esc(x.name)+'"><span class="v159-field-icon">⌖</span><span><b>'+esc(x.name)+'</b><small>'+esc(x.community||'Juventino Rosas')+'</small></span><em>›</em></button>').join('');
    $$('[data-field]',results).forEach(b=>b.onclick=()=>{
      target.value=b.dataset.field||'';target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));
      button.querySelector('b').textContent=b.dataset.field||'Por confirmar';
      button.querySelector('small').textContent=b.dataset.field?'Campo seleccionado':'Sin sede definida';closeLayer();
    });
  };
  input.oninput=()=>{q=input.value;render()};render();setTimeout(()=>input.focus({preventScroll:true}),80);
}
function buildQuickButton(native,type,label){
  const b=document.createElement('button');b.type='button';b.className='v159-picker';b.dataset.v159Picker=type;
  const current=native.value||'Por confirmar';
  let sub=type==='field'?'Escoge uno de los campos registrados':'Filtra por categoría o escribe el nombre';
  if(type==='team'&&native.selectedOptions?.[0]?.dataset?.category)sub=native.selectedOptions[0].dataset.category;
  b.innerHTML='<span class="v159-picker-icon">'+(type==='field'?'⌖':'⌕')+'</span><span><b>'+esc(current)+'</b><small>'+esc(sub)+'</small></span><i>›</i>';
  b.onclick=e=>{e.preventDefault();e.stopPropagation();type==='field'?fieldPicker(native,b):teamPicker(native,b)};
  return b;
}
function enhancePickers(){
  const home=$('[data-v64-ag-home]'),away=$('[data-v64-ag-away]'),field=$('[data-v64-ag-field]');
  [home,away].forEach(sel=>{
    if(!sel||sel.dataset.v159Enhanced)return;sel.dataset.v159Enhanced='1';sel.classList.add('v159-native');
    const b=buildQuickButton(sel,'team');sel.parentNode.insertBefore(b,sel);
  });
  if(field&&!field.dataset.v159Enhanced){
    field.dataset.v159Enhanced='1';field.classList.add('v159-native');
    const b=buildQuickButton(field,'field');field.parentNode.insertBefore(b,field);
  }
}
function enhanceFormat(){
  const duration=$('[data-v64-ag-duration]');if(!duration||duration.dataset.v159Enhanced)return;
  duration.dataset.v159Enhanced='1';duration.value='120';duration.readOnly=true;duration.classList.add('v159-duration-native');
  const wrap=document.createElement('div');wrap.className='v159-format';
  wrap.innerHTML='<label><b>Formato del partido</b><select data-v159-format>'+
      '<option value="120">Normal · 120 min reservados</option>'+
      '<option value="150">Con tiempo extra · 150 min reservados</option>'+
    '</select></label>'+
    '<div class="v159-format-note" data-v159-format-note><b>90 min de juego</b><span>45 min + 15 min descanso + 45 min + 15 min de margen operativo.</span></div>';
  duration.closest('label')?.insertAdjacentElement('afterend',wrap);
  const sel=$('[data-v159-format]',wrap),note=$('[data-v159-format-note]',wrap);
  sel.onchange=()=>{
    duration.value=sel.value;duration.dispatchEvent(new Event('input',{bubbles:true}));
    note.innerHTML=sel.value==='150'
      ?'<b>Partido con tiempo extra</b><span>45 + 15 descanso + 45, pausa y hasta 15 + 15 de tiempo extra; se reservan 150 min.</span>'
      :'<b>90 min de juego</b><span>45 min + 15 min descanso + 45 min + 15 min de margen operativo.</span>';
  };
}
function agendaData(){
  try{
    const a=JSON.parse(localStorage.getItem('v64-agenda')||'[]');if(Array.isArray(a)&&a.length)return a;
  }catch(_){}
  const q=s=>$(s)?.value||'';
  const home=q('[data-v64-ag-home]'),away=q('[data-v64-ag-away]');
  if(home||away)return [{home:home||'Local',away:away||'Visitante',field:q('[data-v64-ag-field]')||'Campo por confirmar',start:q('[data-v64-ag-start]'),duration:Number(q('[data-v64-ag-duration]')||120)}];
  return [];
}
function formatStart(v){
  if(!v)return 'Fecha y hora por confirmar';
  const d=new Date(v);if(Number.isNaN(d.getTime()))return String(v).replace('T',' ');
  return d.toLocaleString('es-MX',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
}
async function img(src){
  if(!src)return null;
  return new Promise(resolve=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src});
}
async function exportPng(){
  const list=agendaData();if(!list.length)return toast('Agrega al menos un cruce antes de exportar');
  const W=1080,rowH=220,H=Math.max(920,260+list.length*rowH+100),c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#06136c');g.addColorStop(.58,'#0a1687');g.addColorStop(1,'#020746');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='#24dfe9';x.font='800 25px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',62,66);
  x.fillStyle='#fff';x.font='900 58px Arial';x.fillText('AGENDA DE JORNADA',62,135);
  x.fillStyle='#aeb8db';x.font='500 22px Arial';x.fillText('Cruces, horarios y campos · borrador operativo',62,175);
  let y=225;
  for(let i=0;i<list.length;i++){
    const m=list[i],top=y+i*rowH;
    x.fillStyle='rgba(28,43,158,.74)';x.beginPath();x.roundRect?.(48,top,W-96,rowH-24,30);if(x.roundRect)x.fill();else x.fillRect(48,top,W-96,rowH-24);
    const hl=teamLogo(m.home),al=teamLogo(m.away),[hi,ai]=await Promise.all([img(hl),img(al)]);
    if(hi)try{x.drawImage(hi,78,top+48,82,82)}catch(_){}
    if(ai)try{x.drawImage(ai,920,top+48,82,82)}catch(_){}
    x.fillStyle='#fff';x.font='800 30px Arial';x.fillText(String(m.home||'Local').slice(0,22),185,top+78);
    x.textAlign='right';x.fillText(String(m.away||'Visitante').slice(0,22),895,top+78);x.textAlign='left';
    x.fillStyle='#27e2ed';x.font='900 34px Arial';x.textAlign='center';x.fillText('VS',W/2,top+77);x.textAlign='left';
    x.fillStyle='#dce3fa';x.font='600 21px Arial';x.fillText(formatStart(m.start),185,top+126);
    x.fillStyle='#aeb8db';x.font='500 19px Arial';x.fillText(String(m.field||'Campo por confirmar').slice(0,55),185,top+158);
    x.textAlign='right';x.fillStyle='#78eff5';x.font='800 18px Arial';x.fillText(String(m.duration||120)+' min reservados',895,top+158);x.textAlign='left';
  }
  x.fillStyle='rgba(255,255,255,.56)';x.font='17px Arial';x.fillText('Formato normal: 45 + 15 descanso + 45 + margen. Tiempo extra: reserva ampliada cuando aplique.',62,H-48);
  c.toBlob(b=>{if(!b)return toast('No se pudo crear la imagen');const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='Agenda_Jornada_Liga_Juventino.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},700)},'image/png',.96);
}
async function sharePng(){
  const list=agendaData();if(!list.length)return toast('Agrega al menos un cruce antes de compartir');
  const W=1080,rowH=220,H=Math.max(920,260+list.length*rowH+100),c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#06136c');g.addColorStop(1,'#020746');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='#24dfe9';x.font='800 25px Arial';x.fillText('LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS',62,66);x.fillStyle='#fff';x.font='900 58px Arial';x.fillText('AGENDA DE JORNADA',62,135);
  let y=215;list.forEach((m,i)=>{const top=y+i*rowH;x.fillStyle='rgba(28,43,158,.74)';x.fillRect(48,top,W-96,rowH-24);x.fillStyle='#fff';x.font='800 31px Arial';x.fillText(String(m.home||'Local').slice(0,24),75,top+64);x.textAlign='right';x.fillText(String(m.away||'Visitante').slice(0,24),1005,top+64);x.textAlign='center';x.fillStyle='#28e2ec';x.fillText('VS',W/2,top+64);x.textAlign='left';x.fillStyle='#dce3fa';x.font='600 21px Arial';x.fillText(formatStart(m.start),75,top+112);x.fillStyle='#aeb8db';x.fillText(String(m.field||'Campo por confirmar').slice(0,60),75,top+150)});
  const blob=await new Promise(r=>c.toBlob(r,'image/png',.96));if(!blob)return;
  const file=new File([blob],'Agenda_Jornada_Liga_Juventino.png',{type:'image/png'});
  if(navigator.canShare?.({files:[file]})){try{await navigator.share({title:'Agenda de jornada',files:[file]});return}catch(_){}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),700);
}
function enhanceActions(){
  const stack=$('.v64-stack-actions');if(!stack||stack.dataset.v159Enhanced)return;
  stack.dataset.v159Enhanced='1';
  const png=document.createElement('button');png.type='button';png.className='v60-btn outline';png.dataset.v159Png='';png.textContent='Exportar agenda PNG';
  const share=document.createElement('button');share.type='button';share.className='v60-btn outline';share.dataset.v159Share='';share.textContent='Compartir imagen';
  const json=$('[data-v64-ag-json]',stack);json?.insertAdjacentElement('afterend',png);png.insertAdjacentElement('afterend',share);
  png.onclick=exportPng;share.onclick=sharePng;
}
function enhance(){
  if(route()!=='agendaBuilder')return;
  enhancePickers();enhanceFormat();enhanceActions();
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(enhance,80)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,700);
})();