/* V158 — Selector de campos para Generador de cédulas.
   Usa el catálogo de campos ya existente y suma sedes detectadas en partidos oficiales. */
(function(){
  'use strict';

  const FIELD_DATA='./data/fields-v38-22.json?v=20260922-cedula-field-picker-v158';
  const OFFICIAL_DATA='./data/official-live.json?v=20261001-v490-vet35-all-pages';

  const FRIENDLY_BY_ID={
    'sur-1':'Campo 1 · Unidad Deportiva Sur',
    'sur-2':'Campo 2 · Unidad Deportiva Sur',
    'sur-3':'Campo 3 · Unidad Deportiva Sur',
    'zapata-4':'Campo 4 · Emiliano Zapata',
    'cerrito':'Campo Cerrito de Gasca',
    'tavera':'Campo de Tavera',
    'san-juan':'Campo San Juan de la Cruz',
    'cuenda':'Unidad Deportiva Santiago de Cuenda',
    'romerillo':'Campo San Antonio de Romerillo',
    'fraccionamiento':'Campo Fraccionamiento Comontuoso',
    'pozos':'Campo de Fútbol de Pozos',
    'rincon':'Campo Rincón de Centeno',
    'san-jose':'Campo San José de la Montaña',
    'san-julian':'Campo San Julián Tierra Blanca'
  };

  const FALLBACK=[
    'Campo 1 · Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur','Campo 4 · Emiliano Zapata',
    'Campo Cerrito de Gasca','Campo de Tavera','Campo San Juan de la Cruz','Unidad Deportiva Santiago de Cuenda',
    'Campo San Antonio de Romerillo','Campo Fraccionamiento Comontuoso','Campo de Fútbol de Pozos',
    'Campo Rincón de Centeno','Campo San José de la Montaña','Campo San Julián Tierra Blanca'
  ];

  let cachedFields=null;
  let loading=null;

  function route(){
    return location.hash.replace(/^#\//,'').split('?')[0]||'home';
  }
  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  }
  function addUnique(list,value){
    const raw=String(value||'').trim();
    if(!raw||/^por confirmar$/i.test(raw)||/^campo por confirmar$/i.test(raw))return;
    const v=window.LJR_FIELDS?.canonical?.(raw)||raw;
    if(!list.some(x=>norm(x)===norm(v)))list.push(v);
  }
  async function loadFields(){
    if(cachedFields)return cachedFields;
    if(loading)return loading;
    loading=(async()=>{
      const out=[...FALLBACK];
      try{
        const r=await fetch(FIELD_DATA,{cache:'no-store'});
        if(r.ok){
          const d=await r.json();
          for(const f of d.fields||[]){
            addUnique(out,FRIENDLY_BY_ID[f.id]||f.name||f.community);
          }
        }
      }catch(_){}

      try{
        const live=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
        const d=live||await fetch(OFFICIAL_DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null);
        for(const c of Object.values(d?.categories||{})){
          for(const block of c?.fixtures||[]){
            for(const row of block?.rows||[]){
              addUnique(out,row?.[7]);
            }
          }
          for(const ced of c?.cedulas||[]){
            addUnique(out,ced?.field||ced?.campo);
          }
        }
      }catch(_){}

      cachedFields=out;
      return out;
    })();
    return loading;
  }
  function option(value,label,selected){
    const o=document.createElement('option');
    o.value=value;
    o.textContent=label||value;
    o.selected=!!selected;
    return o;
  }
  async function patchField(){
    if(route()!=='cedulaBuilder')return;
    const old=document.querySelector('[data-v64-ced-field]');
    if(!old || old.tagName==='SELECT' && old.dataset.v158FieldPicker==='1')return;

    const fields=await loadFields();
    if(route()!=='cedulaBuilder')return;

    const saved=String(old.value||localStorage.getItem('v66-cedula-field')||'').trim();
    const current=window.LJR_FIELDS?.canonical?.(saved)||saved;
    const select=document.createElement('select');
    select.setAttribute('data-v64-ced-field','');
    select.dataset.v158FieldPicker='1';
    select.setAttribute('aria-label','Campo');
    select.appendChild(option('','Por confirmar',!current));

    const groups={
      'Unidad Deportiva Sur':['Campo 1 · Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur','Campo 4 · Emiliano Zapata'],
      'Comunidades y otras sedes':[]
    };
    for(const f of fields){
      if(groups['Unidad Deportiva Sur'].some(x=>norm(x)===norm(f)))continue;
      groups['Comunidades y otras sedes'].push(f);
    }

    for(const [title,items] of Object.entries(groups)){
      const g=document.createElement('optgroup');
      g.label=title;
      for(const f of items)g.appendChild(option(f,f,norm(f)===norm(current)));
      select.appendChild(g);
    }

    if(current && !fields.some(f=>norm(f)===norm(current))){
      const g=document.createElement('optgroup');
      g.label='Campo guardado';
      g.appendChild(option(current,current,true));
      select.appendChild(g);
    }

    old.replaceWith(select);

    select.addEventListener('change',()=>{
      localStorage.setItem('v66-cedula-field',select.value);
      select.dispatchEvent(new Event('input',{bubbles:true}));
    });
  }
  function schedule(){
    requestAnimationFrame(()=>{patchField();setTimeout(patchField,80);setTimeout(patchField,260)});
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});

  const screen=document.querySelector('#screen');
  if(screen){
    new MutationObserver(()=>{if(route()==='cedulaBuilder')patchField()})
      .observe(screen,{childList:true,subtree:true});
  }
  schedule();
})();