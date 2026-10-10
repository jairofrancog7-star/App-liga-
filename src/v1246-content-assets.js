(()=>{'use strict';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const absolute=s=>new URL(s,document.baseURI).href;
let manifest;
async function list(){
 manifest||=fetch(new URL('./content-assets.json',document.baseURI)).then(r=>{if(!r.ok)throw Error('No se pudo cargar la biblioteca de imágenes.');return r.json()}).catch(e=>{manifest=null;throw e});
 const fixed=await manifest,db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{},items=[];
 for(const [name,entry]of Object.entries(db.team_logos||{})){const url=window.LJR_OFFICIAL_API?.getLogo?.(name)||entry.app||entry.local;if(url)items.push({name,kind:'logo',url})}
 for(const record of window.LJR_CMS?.records||[]){const p=record.payload||{};for(const key of ['image','photo','logo'])if(p[key])items.push({name:p.title||p.name||'Imagen guardada',kind:key==='logo'?'logo':'photo',url:p[key]})}
 for(const m of window.LJR_MEDIA?.items||[])if(String(m.mime||'').startsWith('image/'))items.push({name:m.title||'Imagen publicada',kind:'photo',url:window.LJR_MEDIA.base+'/api/file/'+m.id});
 const seen=new Set();return [...items,...fixed.assets].filter(x=>{x.url=absolute(x.url);if(seen.has(x.url))return false;seen.add(x.url);return true});
}
async function pick(onSelect,kind=''){
 if(!window.LJR_MEDIA?.admin)return window.LJR_MEDIA?.login(()=>pick(onSelect,kind));
 const esc=window.LJR_CMS.esc,n=window.LJR_MEDIA.modal('Imágenes de la Liga','<label>Buscar logo o foto<input data-asset-search type="search" placeholder="Nombre del equipo o categoría"></label><label>Tipo<select data-asset-kind><option value="">Todos</option><option value="logo">Escudos de equipos</option><option value="category">Categorías</option><option value="league">Liga</option><option value="photo">Fotos guardadas</option></select></label><div class="ljr-asset-grid"></div><button data-asset-more hidden>Mostrar más</button>');
 n.querySelector('section')?.classList.add('ljr-content-studio');n.querySelector('[data-asset-kind]').value=kind;
 try{const assets=await list();let limit=36;const render=()=>{const search=norm(n.querySelector('[data-asset-search]').value),type=n.querySelector('[data-asset-kind]').value,filtered=assets.filter(a=>(!type||a.kind===type)&&norm(a.name).includes(search));n.querySelector('.ljr-asset-grid').innerHTML=filtered.slice(0,limit).map((a,i)=>'<button type="button" data-asset="'+i+'"><img loading="lazy" src="'+esc(a.url)+'" alt=""><span>'+esc(a.name)+'</span></button>').join('');n.querySelector('[data-asset-more]').hidden=filtered.length<=limit;n.querySelectorAll('[data-asset]').forEach(b=>b.onclick=()=>{onSelect(filtered[Number(b.dataset.asset)]);n.querySelector('[data-close]').click()});n.querySelector('[data-status]').textContent=filtered.length+' archivos disponibles';};for(const sel of ['[data-asset-search]','[data-asset-kind]'])n.querySelector(sel).oninput=()=>{limit=36;render()};n.querySelector('[data-asset-more]').onclick=()=>{limit+=36;render()};render()}catch(e){n.querySelector('[data-status]').textContent=e.message}
}
async function file(a){const r=await fetch(a.url);if(!r.ok)throw Error('No se pudo abrir la imagen seleccionada.');const b=await r.blob();if(!b.type.startsWith('image/'))throw Error('Selecciona una imagen.');return new File([b],a.name+'.'+(b.type.split('/')[1]||'png'),{type:b.type})}
window.LJR_CONTENT_ASSETS={list,pick,file};
})();
