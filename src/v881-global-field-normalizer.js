/* V881 — Normalización global de campos/canchas.
   Unifica alias y evita sedes repetidas en selectores sin modificar el diseño. */
(function(){
'use strict';
if(window.__LJR_GLOBAL_FIELD_NORMALIZER_V881__)return;
window.__LJR_GLOBAL_FIELD_NORMALIZER_V881__=true;

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');

const CATALOG=[
  {name:'Campo 1 · Unidad Deportiva Sur',aliases:['Campo 1','Campo 1 Empastado','Campo 1 (Empastado)','Campo 1 Unidad Deportiva Sur','Campo 1 · Unidad Deportiva Sur']},
  {name:'Campo 2 · Unidad Deportiva Sur',aliases:['Campo 2','Campo 2 Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur']},
  {name:'Campo 3 · Unidad Deportiva Sur',aliases:['Campo 3','Campo 3 Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur']},
  {name:'Campo 4 · Emiliano Zapata',aliases:['Campo 4','Campo 4 Emiliano Zapata','Campo 4 · Emiliano Zapata']},
  {name:'Campo Cerrito de Gasca',aliases:['Cerrito de Gasca','C. de Gasca','Campo Cerrito de Gasca']},
  {name:'Campo de Tavera',aliases:['Tavera','Franco Tavera','Campo Tavera','Campo de Tavera']},
  {name:'Campo San Juan de la Cruz',aliases:['San Juan','S. Juan de la Cruz','San Juan de la Cruz','Campo San Juan de la Cruz']},
  {name:'Unidad Deportiva Santiago de Cuenda',aliases:['Cuenda','Santiago de Cuenda','Unidad Deportiva Santiago de Cuenda']},
  {name:'Campo San Antonio de Romerillo',aliases:['Romerillo','San Antonio de Romerillo','Campo San Antonio de Romerillo']},
  {name:'Campo Fraccionamiento Comontuoso',aliases:['Fraccionamiento','Comontuoso','Fraccionamiento Comontuoso','Campo Fraccionamiento Comontuoso']},
  {name:'Campo de Fútbol de Pozos',aliases:['Pozos','Campo Pozos','Campo de Futbol de Pozos','Campo de Fútbol de Pozos']},
  {name:'Campo Rincón de Centeno',aliases:['Rincón de Centeno','Rincon de Centeno','Rincón del Centeno','Campo Rincón de Centeno']},
  {name:'Campo San José de la Montaña',aliases:['San José','San Jose','San José de la Montaña','San Jose de la Montana','Campo San José de la Montaña']},
  {name:'Campo San Julián Tierra Blanca',aliases:['San Julián','San Julian','San Julián Tierra Blanca','San Julian Tierra Blanca','Campo San Julián Tierra Blanca']}
];

const aliasMap=new Map();
for(const f of CATALOG){
  aliasMap.set(norm(f.name),f.name);
  for(const a of f.aliases)aliasMap.set(norm(a),f.name);
}

function isKnown(v){return aliasMap.has(norm(v))}
function canonical(v){
  const raw=String(v??'').trim();
  return aliasMap.get(norm(raw))||raw;
}
function fieldHint(el){
  if(!el||!el.getAttribute)return false;
  const attrs=[
    el.id,el.className,el.getAttribute('name'),el.getAttribute('aria-label'),
    el.getAttribute('placeholder'),
    ...Array.from(el.attributes||[]).map(a=>a.name+' '+a.value)
  ].join(' ').toLowerCase();
  if(/(?:field|venue|campo|cancha|sede)/.test(attrs))return true;
  const label=el.closest?.('label');
  if(label&&/(?:campo|cancha|sede)/i.test(label.textContent||''))return true;
  if(el.tagName==='SELECT'||el.tagName==='DATALIST'){
    let hits=0;
    for(const o of el.options||[])if(isKnown(o.textContent)||isKnown(o.value))hits++;
    if(hits>=3)return true;
  }
  return false;
}
function patchChoiceList(el){
  if(!fieldHint(el))return;
  const options=Array.from(el.options||[]);
  const selected=options.find(o=>o.selected);
  // V1154: En Revisión de canchas los values son IDs estables ('pozos', 'cuenda', etc.).
  // Solo ajustar etiquetas visibles, NUNCA transformar el ID que usan reportes y avisos.
  const preserveFieldIds=el.hasAttribute('data-v668-stable-field');
  const selectedCanon=selected?(isKnown(selected.value)?canonical(selected.value):(isKnown(selected.textContent)?canonical(selected.textContent):'')):'';
  const seen=new Map();

  for(const o of options){
    const oldText=String(o.textContent||'').trim();
    const oldValue=String(o.value||'').trim();
    const labelCanon=isKnown(oldText)?canonical(oldText):'';
    const valueCanon=isKnown(oldValue)?canonical(oldValue):'';
    const canon=labelCanon||valueCanon;
    if(!canon)continue;

    if(labelCanon)o.textContent=labelCanon;
    if(!preserveFieldIds && (valueCanon || (labelCanon&&norm(oldValue)===norm(oldText))))o.value=valueCanon||labelCanon;

    const key=norm(canon);
    const keep=seen.get(key);
    if(keep){
      if(o.selected)keep.selected=true;
      o.remove();
    }else{
      seen.set(key,o);
    }
  }

  if(selectedCanon){
    const keep=Array.from(el.options||[]).find(o=>
      (isKnown(o.value)&&norm(canonical(o.value))===norm(selectedCanon))||
      (isKnown(o.textContent)&&norm(canonical(o.textContent))===norm(selectedCanon))
    );
    if(keep)keep.selected=true;
  }
}
function patchInput(el){
  if(!fieldHint(el)||!isKnown(el.value))return;
  el.value=canonical(el.value);
}
function patch(root=document){
  if(root instanceof HTMLSelectElement||root instanceof HTMLDataListElement)patchChoiceList(root);
  else if(root instanceof HTMLInputElement)patchInput(root);
  if(!root?.querySelectorAll)return;
  root.querySelectorAll('select,datalist').forEach(patchChoiceList);
  root.querySelectorAll('input').forEach(patchInput);
}

window.LJR_FIELDS=Object.assign(window.LJR_FIELDS||{},{
  catalog:CATALOG.map(x=>({name:x.name,aliases:[...x.aliases]})),
  canonical,
  isKnown,
  normalizeList(values=[]){
    const out=[],seen=new Set();
    for(const value of values){
      const v=canonical(value),k=norm(v);
      if(!v||seen.has(k))continue;
      seen.add(k);out.push(v);
    }
    return out;
  },
  patch
});

document.addEventListener('change',e=>{
  const el=e.target;
  if(el instanceof HTMLSelectElement)patchChoiceList(el);
  else if(el instanceof HTMLInputElement)patchInput(el);
},true);

const start=()=>{
  patch(document);
  const mo=new MutationObserver(records=>{
    for(const rec of records)for(const node of rec.addedNodes){
      if(node instanceof Element)patch(node);
    }
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('pageshow',()=>patch(document));
window.addEventListener('hashchange',()=>setTimeout(()=>patch(document),0));
})();