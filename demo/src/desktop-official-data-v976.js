/* Official desktop content: source-backed tables, no fabricated fixtures, draws or stats. */
(function(){
'use strict';
if(window.__LJR_PC_OFFICIAL_V976__)return;window.__LJR_PC_OFFICIAL_V976__=true;
const mode=()=>new URLSearchParams(location.search).get('mode')||'';
const desktop=()=>!['mobile','apk'].includes(mode())&&(mode()==='desktop'||document.body.classList.contains('lj-desktop')||innerWidth>=1024);
const route=()=>String(location.hash||'').replace('#/','').replace('#','').split('?')[0]||'home';
const go=r=>{location.hash='#/'+r};
const CAT=['3','5','4','2','1'];
const FALLBACK={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const TABS=[['standings','Clasificación'],['scorers','Goleadores'],['cards','Tarjetas'],['suspensions','Sanciones'],['fixtures','Partidos']];
const names=['news','history','video','teams','profile','club-store','safe-performance'];
names.forEach(name=>window.LJR_PC_NATIVE_ROUTES?.add(name));
const aliases={'safe-data':'pc-data','bracket':'pc-bracket','draws':'pc-draws'};
let db=null,loading=null,cat='3',tab='standings',search='',busy=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function official(){return window.LJR_OFFICIAL_DATA?.categories?window.LJR_OFFICIAL_DATA:(window.LJR_OFFICIAL_API?.getData?.()?.categories?window.LJR_OFFICIAL_API.getData():db)}
async function load(){
 const live=official();if(live?.categories){db=live;return live}
 if(loading)return loading;
 loading=fetch('./data/official-live.json?v=pc-official-20261008',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()})
 .then(x=>{if(!x?.categories)throw Error('Datos inválidos');db=x;return db})
 .finally(()=>{loading=null});
 return loading;
}
function setRoute(){const next=aliases[route()];if(!desktop()||!next)return false;go(next);return true}
function css(){
 if(document.getElementById('ljpc-v976-style'))return;
 const s=document.createElement('style');s.id='ljpc-v976-style';s.textContent=`
 body.lj-desktop .ljpc-data{font-family:system-ui,sans-serif;max-width:100%;color:#172e53}
 .ljpc-data .ljpc-data-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:13px}
 .ljpc-data .ljpc-data-head p{margin:0;font-size:12px;color:#6b7c92}
 .ljpc-data .ljpc-categories,.ljpc-data .ljpc-tabs,.ljpc-data .ljpc-data-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
 .ljpc-data button{cursor:pointer}
 .ljpc-data .ljpc-category,.ljpc-data .ljpc-tab,.ljpc-data .ljpc-utility{border:1px solid #bed2e9;border-radius:9px;background:#fff;color:#164875;font-size:12px;font-weight:750;padding:10px 12px;min-height:38px}
 .ljpc-data .ljpc-category.active,.ljpc-data .ljpc-tab.active{background:#0055a5;color:#fff;border-color:#0055a5}
 .ljpc-data .ljpc-tabs{margin:13px 0}
 .ljpc-data .ljpc-data-search{width:min(330px,100%);min-height:38px;border:1px solid #bed2e9;border-radius:9px;padding:9px 12px;background:#fff;color:#162e51;font-size:12px}
 .ljpc-data .ljpc-data-tablebox{overflow:auto;background:white;border:1px solid #dbe5ef;border-radius:12px;box-shadow:0 7px 22px #092f5414}
 .ljpc-data .ljpc-data-table{width:100%;border-collapse:collapse;min-width:640px}
 .ljpc-data .ljpc-data-table th{position:sticky;top:0;z-index:1;text-align:left;background:#eaf3ff;font-size:11px;padding:13px 12px;color:#13529a;white-space:nowrap}
 .ljpc-data .ljpc-data-table td{padding:10px 12px;font-size:12px;color:#142b47;border-top:1px solid #eaf1f8;white-space:nowrap}
 .ljpc-data .ljpc-data-table tr:hover td{background:#f4faff}
 .ljpc-data .ljpc-data-table td:nth-child(2){font-weight:750}
 .ljpc-data .ljpc-teamcell{display:inline-flex;align-items:center;gap:8px;max-width:350px}
 .ljpc-data .ljpc-teamcell img{width:29px;height:29px;object-fit:contain;flex:0 0 auto}
 .ljpc-data .ljpc-data-footer{font-size:11px;color:#64768f;margin:12px 0 0}
 .ljpc-data .ljpc-empty{padding:22px;background:#f4f8fd;border:1px dashed #b8cce2;border-radius:12px;color:#4e6483;font-size:13px}
 .ljpc-data .ljpc-panel-mini{background:linear-gradient(110deg,#081d49,#0055a5);border:1px solid #43a9ef55;border-radius:13px;color:white;padding:18px 21px}
 .ljpc-data .ljpc-panel-mini h2{color:white;font-size:17px;margin:0 0 8px}.ljpc-data .ljpc-panel-mini p{color:#d4eaff;font-size:12px;line-height:1.55;margin:0 0 14px}
 .ljpc-data .ljpc-panel-mini button{border:1px solid #72bdff;border-radius:9px;background:#166bd1;color:white;padding:10px 14px;font-size:12px;font-weight:800;margin-right:8px}
 .ljpc-data .ljpc-draw-group{margin:12px 0 0;border:1px solid #d7e5f4;border-radius:10px;background:#fff;padding:13px}
 .ljpc-data .ljpc-draw-group h3{font-size:13px;margin:0 0 7px;color:#15539a}
 @media(max-width:700px){.ljpc-data .ljpc-data-head{display:block}.ljpc-data .ljpc-data-actions{margin-top:10px}.ljpc-data .ljpc-categories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.ljpc-data .ljpc-category{padding:8px}.ljpc-data .ljpc-data-search{width:100%}}
 `;document.head.appendChild(s);
}
function host(){
 const page=document.querySelector('#screen > .ds-page');
 if(!page)return null;
 let root=page.querySelector('.ds-content > .ds-wrap');
 if(!root)return null;
 const h=page.querySelector('.ds-pagehead h1'),p=page.querySelector('.ds-pagehead p');
 if(h)h.textContent=route()==='pc-data'?'Centro de datos oficiales':route()==='pc-draws'?'Sorteos oficiales':'Cuadro final';
 if(p)p.textContent='Liga Juventino Rosas · Datos de las cinco categorías, sin resultados inventados';
 return root;
}
function getRows(){
 const c=(official()?.categories||{})[cat]||{};
 const g=c[tab];
 const groups=Array.isArray(g)?g:[];
 const headers=groups[0]?.headers;
 const rows=groups.flatMap(x=>Array.isArray(x.rows)?x.rows:[]);
 return {headers:Array.isArray(headers)?headers:[],rows:rows.filter(Array.isArray)};
}
function logo(name){
 const raw=official()?.team_logos||{};
 const key=Object.keys(raw).find(k=>k.toLowerCase()===String(name||'').trim().toLowerCase());
 const item=raw[key]||{};
 const url=typeof item==='string'?item:item.local||item.app||item.source||'';
 return /^(\.\/?|\/|https:\/\/)/.test(url)?url:'';
}
function decoratedCell(value,index,headers){
 const v=String(value??'');
 const h=String(headers[index]||'').toLowerCase();
 const looksTeam=/equipo|local|visitante|club/.test(h);
 if(!looksTeam)return esc(v);
 const url=logo(v);
 return '<span class="ljpc-teamcell">'+(url?'<img loading="lazy" alt="" src="'+esc(url)+'">':'')+'<span>'+esc(v)+'</span></span>';
}
function rowsFiltered(){
 const {headers,rows}=getRows();
 const needle=search.toLocaleLowerCase('es-MX').trim();
 return {headers,rows:needle?rows.filter(r=>r.some(v=>String(v??'').toLocaleLowerCase('es-MX').includes(needle))):rows};
}
function csvValue(v){
 let t=String(v??'');
 if(/^[=+@]/.test(t))t="'"+t;
 if(t.startsWith('-')&&!/^-?\d+(\.\d+)?$/.test(t))t="'"+t;
 return '"'+t.replace(/"/g,'""')+'"';
}
function exportCsv(){
 const {headers,rows}=rowsFiltered();
 if(!rows.length)return;
 const columns=headers.length?headers:rows[0].map((_,i)=>'Columna '+(i+1));
 const data='\ufeff'+[columns,...rows].map(line=>line.map(csvValue).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='liga-juventino-'+tab+'-categoria-'+cat+'.csv';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function renderTable(root){
 const snapshot=official();
 const category=snapshot?.categories?.[cat]?.name||FALLBACK[cat];
 const {headers,rows}=rowsFiltered();
 const columns=headers.length?headers:(rows[0]||[]).map((_,i)=>'Dato '+(i+1));
 const total=getRows().rows.length;
 root.innerHTML='<div class="ljpc-data" data-ljpc-v976="pc-data"><div class="ljpc-data-head"><p>Información oficial publicada: '+esc(snapshot?.captured_at_utc||'fecha no indicada')+'</p><div class="ljpc-data-actions"><input class="ljpc-data-search" type="search" value="'+esc(search)+'" placeholder="Buscar equipo o jugador…" aria-label="Buscar en la tabla"><button class="ljpc-utility" data-ljpc-csv '+(!rows.length?'disabled':'')+'>Descargar CSV</button></div></div>'+
 '<div class="ljpc-categories">'+CAT.map(id=>'<button class="ljpc-category '+(id===cat?'active':'')+'" data-ljpc-cat="'+id+'">'+esc(snapshot?.categories?.[id]?.name||FALLBACK[id])+'</button>').join('')+'</div>'+
 '<div class="ljpc-tabs">'+TABS.map(([id,label])=>'<button class="ljpc-tab '+(id===tab?'active':'')+'" data-ljpc-tab="'+id+'">'+label+'</button>').join('')+'</div>'+
 (rows.length?'<div class="ljpc-data-tablebox"><table class="ljpc-data-table"><thead><tr>'+columns.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+columns.map((_,i)=>'<td>'+decoratedCell(row[i],i,columns)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>':
 '<div class="ljpc-empty">'+(total?'No encontramos coincidencias.':'La fuente oficial no publicó registros para esta categoría y apartado.')+'</div>')+
 '<p class="ljpc-data-footer">'+rows.length+' de '+total+' registros · '+esc(category)+' · Fuente oficial de la liga. No se calculan ni inventan estadísticas.</p></div>';
 root.querySelector('[data-ljpc-csv]')?.addEventListener('click',exportCsv);
 root.querySelectorAll('[data-ljpc-cat]').forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.ljpcCat;search='';renderTable(root)}));
 root.querySelectorAll('[data-ljpc-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.ljpcTab;search='';renderTable(root)}));
 const q=root.querySelector('.ljpc-data-search');
 q?.addEventListener('input',()=>{
  const pos=q.selectionStart;search=q.value;
  const t=root.querySelector('table')?.parentElement;
  // Rebuild filtering without losing search focus or caret.
  renderTable(root);
  const next=root.querySelector('.ljpc-data-search');next?.focus();try{next?.setSelectionRange(pos,pos)}catch(_){}
 });
}
function renderDraws(root){
 const d=official();
 const isDraw=route()==='pc-draws';
 const label=isDraw?'Sorteos':'Cuadro final';
 root.innerHTML='<div class="ljpc-data" data-ljpc-v976="'+route()+'"><section class="ljpc-panel-mini"><h2>'+label+' de la Liga</h2><p>El archivo oficial disponible contiene tablas, partidos y resultados por categoría, pero no confirma un sorteo ni cruces completos del cuadro final. Aquí no mostraremos enfrentamientos ni campeones inventados.</p><button data-ljpc-go="pc-fixtures">Ver partidos oficiales</button><button data-ljpc-go="bracketBuilder">Abrir generador de cuadros</button></section><div class="ljpc-draw-group"><h3>Categorías oficiales disponibles</h3><div class="ljpc-categories">'+CAT.map(id=>'<button class="ljpc-category" data-ljpc-draw-cat="'+id+'">'+esc(d?.categories?.[id]?.name||FALLBACK[id])+'</button>').join('')+'</div><p style="font-size:11px;color:#64768f;margin:10px 0 0">El generador permite crear un cuadro independiente, sin alterar los datos oficiales.</p></div></div>';
 root.querySelectorAll('[data-ljpc-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.ljpcGo)));
 root.querySelectorAll('[data-ljpc-draw-cat]').forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.ljpcDrawCat;tab='fixtures';go('pc-data')}));
}
async function sync(){
 if(!desktop()||busy||setRoute())return;
 const r=route();if(!['pc-data','pc-bracket','pc-draws'].includes(r))return;
 const root=host();if(!root||root.querySelector('[data-ljpc-v976]'))return;
 busy=true;css();
 try{await load();if(!desktop()||route()!==r)return;const fresh=host();if(!fresh)return;
 if(r==='pc-data')renderTable(fresh);else renderDraws(fresh);
 }catch(error){const fresh=host();if(fresh)fresh.innerHTML='<div class="ljpc-data"><div class="ljpc-empty">No se pudo cargar el archivo oficial. Verifica tu conexión y vuelve a intentarlo.</div></div>';}
 finally{busy=false}
}
function onNavClick(e){
 if(!desktop()||!(e.target instanceof Element))return;
 const b=e.target.closest('[data-ds-route],[data-desk-route],[data-lj-route]');
 if(!b)return;
 const value=b.dataset.dsRoute||b.dataset.deskRoute||b.dataset.ljRoute;
 const next=aliases[value];if(!next)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();go(next);
}
document.addEventListener('click',onNavClick,true);
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync()})}
window.addEventListener('hashchange',schedule);window.addEventListener('ljr:official-data',()=>{db=null;document.querySelector('[data-ljpc-v976]')?.remove();schedule()});
function start(){css();sync();const screen=document.querySelector('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();