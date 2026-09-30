/* V379 — Perfil individual de jugador inspirado en la referencia móvil enviada por el usuario.
   Abre una ficha real al tocar un jugador y conserva el comparador como acción explícita.
   Integridad: solo muestra datos publicados/sincronizados; lo no publicado aparece como “—”. */
(function(){
'use strict';
if(window.__LJR_V379_PLAYER_PROFILE__)return;
window.__LJR_V379_PLAYER_PROFILE__=true;

const KEY='v379-player-profile';
const TAB_KEY='v379-player-profile-tab';
let api=null,loading=null,rendering=false;

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function norm(v){try{return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}catch{return String(v??'').toLowerCase().trim()}}
function read(k,d=null){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??d}catch{return d}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function initials(v){return String(v||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'JG'}
function same(a,b){return norm(a)===norm(b)}
function fallbackKit(name){
  let h=0;for(const ch of String(name||''))h=(h*31+ch.charCodeAt(0))>>>0;
  const hue=h%360;
  return ['hsl('+hue+' 78% 43%)','hsl('+((hue+34)%360)+' 72% 23%)','#ffffff'];
}
function teamPalette(name){
  const n=norm(name);
  const palettes=[
    [/franco/,['#d71920','#0a0b10','#ffffff']],
    [/pozos/,['#22dc6e','#08110d','#eaffef']],
    [/juventus/,['#f4f4f4','#121212','#c8c8c8']],
    [/manchester/,['#e31d2b','#111111','#f3d24b']],
    [/boavista/,['#111111','#e2bd22','#ffffff']],
    [/esperanza/,['#18b76d','#08261b','#ffffff']],
    [/lobos/,['#1458d7','#071c4f','#ffffff']],
    [/san julian/,['#e52d36','#ffffff','#0a2348']],
    [/tavera/,['#1c67d5','#ffffff','#0b1f4c']],
    [/america/,['#f0d326','#173a8e','#d71d2b']],
    [/herreras/,['#111111','#d91c28','#ffffff']],
    [/galacticos/,['#642bd7','#17102a','#ffffff']],
    [/promesas/,['#2468d8','#ffffff','#11224a']],
    [/cuenda/,['#0b6a42','#efd94c','#ffffff']],
    [/aldama/,['#d52231','#111111','#ffffff']],
    [/linces/,['#0c2e77','#dfb72c','#ffffff']],
    [/psv/,['#e1222c','#ffffff','#111111']],
    [/napoli/,['#1b8bd1','#ffffff','#10325a']],
    [/dynamo|dinamo/,['#2456c7','#ffffff','#0d1b48']]
  ];
  for(const [re,c] of palettes)if(re.test(n))return c;
  return fallbackKit(name);
}
function paletteStyle(name){
  const c=teamPalette(name);
  return '--v379-kit1:'+c[0]+';--v379-kit2:'+c[1]+';--v379-kit3:'+c[2]+';';
}
function avatarHash(v){
  let h=2166136261;
  for(const ch of String(v||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
}
function simulatedAvatarStyle(p){
  const h=avatarHash((p?.name||'')+'|'+(p?.team||''));
  const skins=[
    ['#f1c6a7','#d89a78','#9a5c47'],
    ['#e8b58f','#c98564','#88503e'],
    ['#d99b73','#b76f50','#754332'],
    ['#c9845f','#a65d43','#693829'],
    ['#a96749','#874932','#573022'],
    ['#8a5038','#6d3b29','#43251b']
  ];
  const hairs=['#0c1018','#241a17','#3a241a','#161616','#4a2a1b','#080808'];
  const skin=skins[h%skins.length],hair=hairs[(h>>>3)%hairs.length];
  const eye=(h>>>7)%3===0?'#31251f':'#171719';
  const beard=(h>>>9)%4;
  const hairStyle=(h>>>12)%4;
  const face=(h>>>15)%3;
  const pose=(h>>>18)%3;
  const hairH=[30,36,42,33][hairStyle];
  const hairW=[88,94,84,91][hairStyle];
  const faceW=[82,88,85][face];
  const faceH=[100,106,103][face];
  const beardOpacity=[0,.18,.4,.62][beard];
  const shift=[-5,0,5][pose];
  return paletteStyle(p?.team||'')+
    '--v379-skin1:'+skin[0]+';--v379-skin2:'+skin[1]+';--v379-skin3:'+skin[2]+';'+
    '--v379-hair:'+hair+';--v379-eye:'+eye+';--v379-hair-h:'+hairH+'px;--v379-hair-w:'+hairW+'px;'+
    '--v379-face-w:'+faceW+'px;--v379-face-h:'+faceH+'px;--v379-beard-opacity:'+beardOpacity+';--v379-face-shift:'+shift+'px;';
}
function simulatedHeadMarkup(p,cls='v379-sim-head'){
  return '<span class="'+cls+'" style="'+simulatedAvatarStyle(p)+'" title="Avatar simulado">'+
    '<i class="v379-sim-neck"></i><i class="v379-sim-face"></i><i class="v379-sim-hair"></i>'+
    '<i class="v379-sim-ear left"></i><i class="v379-sim-ear right"></i>'+
    '<i class="v379-sim-eye left"></i><i class="v379-sim-eye right"></i>'+
    '<i class="v379-sim-nose"></i><i class="v379-sim-mouth"></i><i class="v379-sim-beard"></i>'+
  '</span>';
}
function dash(v){return v===undefined||v===null||String(v).trim()===''?'—':String(v)}
function attr(v){return esc(String(v??''))}
function isDataImage(v){return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(String(v||''))}
function getPhoto(p){
  const pub=window.LJR_PLAYER_PHOTOS;
  if(pub){
    try{
      if(typeof pub.get==='function'){const x=pub.get(p.name,p.team);if(x)return String(x)}
      const direct=pub[norm(p.name)+'|'+norm(p.team)]||pub[norm(p.name)]||pub[p.name];
      if(direct)return String(direct);
    }catch{}
  }
  return '';
}
async function getApi(){
  if(api?.playerList)return api;
  if(loading)return loading;
  loading=(async()=>{
    for(let i=0;i<60;i++){
      const a=window.V66_OFFICIAL_DIRECTORY;
      if(a?.load&&a?.playerList){
        try{await a.load()}catch{}
        api=a;return api;
      }
      await new Promise(r=>setTimeout(r,70));
    }
    return null;
  })();
  return loading;
}
function playerKey(p){return norm(p?.name)+'|'+norm(p?.team)+'|'+String(p?.cat||'')}
function resolve(raw,list){
  if(!raw||!list?.length)return null;
  const name=norm(raw.name||raw.player||''),team=norm(raw.team||''),cat=String(raw.cat||raw.catId||'');
  let hit=list.find(x=>norm(x.name)===name&&norm(x.team)===team&&(cat?String(x.cat)===cat:true));
  if(hit)return hit;
  hit=list.find(x=>norm(x.name)===name&&norm(x.team)===team);
  if(hit)return hit;
  const hits=list.filter(x=>norm(x.name)===name);
  if(cat){const c=hits.find(x=>String(x.cat)===cat);if(c)return c}
  return hits[0]||null;
}
function currentPlayer(list){
  const stored=read(KEY)||read('v123-compare-player');
  return resolve(stored,list)||list?.[0]||null;
}
function localRegistration(p){
  const reg=read('v124-player-registry',{seasons:{}});
  const seasons=Object.entries(reg?.seasons||{}).sort((a,b)=>String(b[0]).localeCompare(String(a[0])));
  for(const [,rows] of seasons){
    if(!Array.isArray(rows))continue;
    const hit=rows.find(r=>same(r?.name,p.name)&&(!r?.team||same(r.team,p.team)));
    if(hit)return hit;
  }
  return null;
}
function publishedGoal(p){
  const rows=api?.officialScorers?.()||[];
  const hit=rows.find(r=>same(r.player,p.name)&&same(r.team,p.team)&&(p.cat?String(r.cat)===String(p.cat):true));
  return hit&&Number.isFinite(Number(hit.goals))?Number(hit.goals):null;
}
function officialDiscipline(p){
  const raw=api?.data?.()||window.LJR_OFFICIAL_DATA||null;
  const cat=raw?.categories?.[String(p?.cat||'')];
  const rows=cat?.cards?.[0]?.rows||[];
  let yellow=0,red=0;
  for(const r of rows){
    if(!Array.isArray(r)||r.length<4)continue;
    if(!same(r[1],p.name)||!same(r[2],p.team))continue;
    const total=Number(r[3])||0,type=norm(r[0]);
    if(type.includes('amar'))yellow+=total;
    if(type.includes('roj'))red+=total;
  }
  const susp=(cat?.suspensions?.[0]?.rows||[]).find(r=>Array.isArray(r)&&r.length>=4&&same(r[0],p.name)&&same(r[1],p.team));
  return {yellow,red,suspension:susp?String(susp[2]||''):'' ,pending:susp?String(susp[3]||''):''};
}
function teamLogo(name){
  let src='';
  try{src=api?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||''}catch{}
  return src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async">':'<b>'+esc(String(name||'EQ').slice(0,3).toUpperCase())+'</b>';
}
function related(p,list){
  return list.filter(x=>same(x.team,p.team)&&playerKey(x)!==playerKey(p)).slice(0,8);
}
function fixtureDate(v){
  const s=String(v||'').trim();
  const m=s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return null;
  const d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]||0),Number(m[5]||0));
  return Number.isNaN(d.getTime())?null:d;
}
const V379_DAYS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const V379_MONTHS=['ene','feb','mar','abr','may','jun','jul','ago','sept','oct','nov','dic'];
function fixtureDayLabel(v){
  const d=fixtureDate(v);
  return d?V379_DAYS[d.getDay()]+' '+d.getDate()+' '+V379_MONTHS[d.getMonth()]:String(v||'Fecha por confirmar');
}
function fixtureLongDate(v){
  const d=fixtureDate(v);
  if(!d)return String(v||'Fecha por confirmar');
  return new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);
}
function fixtureTime(v){
  const d=fixtureDate(v);
  return d?String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'):'Por confirmar';
}
function fixtureScore(v){const s=String(v??'').trim();return /^-?\d+$/.test(s)?Number(s):null}
function fixturePlayed(m){return (m.homeScore!==null&&m.awayScore!==null)||/jugado|final|gana/i.test(String(m.status||''))}
function playerFixtures(p){
  const raw=window.LJR_OFFICIAL_DATA||null;
  const cat=raw?.categories?.[String(p?.cat||'')];
  const rawRows=cat?.fixtures?.[0]?.rows||[];
  if(rawRows.length){
    return rawRows.filter(r=>Array.isArray(r)&&(same(r[2],p.team)||same(r[6],p.team))).map(r=>({
      round:String(r[1]||''),
      home:String(r[2]||'Local'),
      homeScore:fixtureScore(r[3]),
      awayScore:fixtureScore(r[5]),
      away:String(r[6]||'Visitante'),
      field:String(r[7]||'Campo por confirmar'),
      date:String(r[8]||''),
      status:String(r[9]||''),
      category:String(cat?.name||p.category||'Liga Municipal')
    }));
  }
  return (api?.fixtureRows?.()||[])
    .filter(x=>same(x.home,p.team)||same(x.away,p.team))
    .map(x=>({...x,homeScore:null,awayScore:null,status:'',category:x.category||p.category||'Liga Municipal'}));
}
function fixtures(p){
  return playerFixtures(p).slice(0,24);
}
function matchDetailData(m,p){
  return {
    id:'player-'+String(m.round||'j')+'-'+norm(m.home).replace(/\s+/g,'-')+'-'+norm(m.away).replace(/\s+/g,'-'),
    home:String(m.home||'Local'),
    away:String(m.away||'Visitante'),
    time:fixtureTime(m.date),
    date:fixtureLongDate(m.date),
    venue:String(m.field||'Campo por confirmar'),
    category:String(m.category||p.category||'Liga Municipal'),
    jornada:String(m.round||''),
    from:'#/playerDetail'
  };
}
function matchDetailAttr(m,p){
  try{return encodeURIComponent(JSON.stringify(matchDetailData(m,p)))}catch{return ''}
}
function valueFrom(reg,keys){
  for(const k of keys){const v=reg?.[k];if(v!==undefined&&v!==null&&String(v).trim()!=='')return String(v)}
  return '';
}
function profileData(p){
  const reg=localRegistration(p)||{};
  return {
    position:valueFrom(reg,['position','pos','role','positionName']),
    number:valueFrom(reg,['number','dorsal','jersey','shirtNumber','jerseyNumber']),
    nationality:valueFrom(reg,['nationality','country','pais','país']),
    birth:valueFrom(reg,['birthDate','dob','dateOfBirth','fechaNacimiento','birth']),
    city:valueFrom(reg,['city','municipality','locality','community','ciudad','comunidad']),
    photo:getPhoto(p)
  };
}
function backButton(){
  return '<button type="button" class="v379-back" data-v379-back aria-label="Volver"><svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg></button>';
}
function shareButton(){
  return '<button type="button" class="v379-share" data-v379-share aria-label="Compartir jugador"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 8-5M8 13l8 5"/></svg></button>';
}
function tabs(active){
  return '<nav class="v379-tabs" aria-label="Secciones del jugador">'+
    ['Resumen','Estadísticas','Partidos','Noticias'].map(t=>'<button type="button" data-v379-tab="'+esc(t)+'" class="'+(active===t?'active':'')+'">'+esc(t)+'</button>').join('')+
  '</nav>';
}
function hero(p,d){
  const photo=d.photo;
  const visual=photo
    ? '<img class="v379-player-photo" src="'+esc(photo)+'" alt="'+esc(p.name)+'">'
    : '<div class="v379-player-silhouette v382-simulated-player" style="'+simulatedAvatarStyle(p)+'" aria-label="Avatar simulado de '+esc(p.name)+'">'+
        '<span class="v379-player-body"><i class="v379-kit-logo">'+teamLogo(p.team)+'</i></span>'+
        '<span class="v379-player-neck"></span>'+
        '<span class="v379-player-head"></span>'+
        '<span class="v379-player-ear left"></span><span class="v379-player-ear right"></span>'+
        '<span class="v379-player-eye left"></span><span class="v379-player-eye right"></span>'+
        '<span class="v379-player-nose"></span><span class="v379-player-mouth"></span>'+
        '<span class="v379-player-beard"></span><span class="v379-player-hair"></span>'+
      '</div>';
  const city=d.city||'Juventino Rosas';
  return '<section class="v379-hero v386-player-hero" style="'+paletteStyle(p.team)+'">'+backButton()+
    '<div class="v379-hero-pattern" aria-hidden="true"></div>'+visual+
    '<div class="v379-hero-copy"><h1>'+esc(p.name)+'</h1>'+
      '<div class="v386-player-meta">'+
        '<div class="v379-teamline"><span class="v379-team-logo">'+teamLogo(p.team)+'</span><b>'+esc(p.team)+'</b></div>'+
        '<div class="v379-location"><svg viewBox="0 0 24 24"><path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg><span>'+esc(city)+'</span></div>'+
      '</div>'+
    '</div>'+
    '<div class="v386-hero-actions">'+
      '<button type="button" class="v386-compare" data-v379-compare>Comparar</button>'+
      shareButton()+
    '</div>'+
  '</section>';
}
function infoGrid(p,d){
  return '<section class="v379-info-card">'+
   '<div><small>POSICIÓN</small><strong>'+esc(d.position||'—')+'</strong></div>'+
   '<div><small>DORSAL EN EL CLUB</small><strong>'+esc(d.number||'—')+'</strong></div>'+
   '<div><small>CATEGORÍA</small><strong>'+esc(p.category||'—')+'</strong></div>'+
   '<div><small>PAÍS</small><strong>'+esc(d.nationality||'—')+'</strong></div>'+
   (d.birth?'<div><small>FECHA DE NACIMIENTO</small><strong>'+esc(d.birth)+'</strong></div>':'')+
   (d.city?'<div><small>LOCALIDAD REGISTRADA</small><strong>'+esc(d.city)+'</strong></div>':'')+
  '</section>';
}
function sectionTitle(title,action,attrName){
  return '<div class="v379-section-title"><h2>'+esc(title)+'</h2>'+(action?'<button type="button" '+attrName+'>'+esc(action)+'</button>':'')+'</div>';
}
function relatedHtml(p,list){
  const rel=related(p,list);
  if(!rel.length)return '';
  return '<section class="v379-block">'+sectionTitle('Jugadores relacionados','','')+
    '<div class="v379-related">'+rel.map(x=>'<button type="button" class="v379-related-card" data-v379-related="'+attr(x.name)+'" data-v379-related-team="'+attr(x.team)+'" data-v379-related-cat="'+attr(x.cat)+'">'+
      simulatedHeadMarkup(x,'v379-related-avatar v382-related-sim')+
      '<span class="v379-related-logo">'+teamLogo(x.team)+'</span>'+
      '<strong>'+esc(x.name)+'</strong><small>'+esc(x.category||x.team)+'</small>'+
    '</button>').join('')+'</div></section>';
}
function nextMatchCard(p){
  const list=playerFixtures(p).filter(m=>!fixturePlayed(m)).sort((a,b)=>(fixtureDate(a.date)?.getTime()||0)-(fixtureDate(b.date)?.getTime()||0));
  if(!list.length)return '<div class="v379-empty">No hay próximos partidos sincronizados para este equipo.</div>';
  const m=list[0],encoded=matchDetailAttr(m,p);
  return '<article class="v383-next-match">'+
    '<div class="v383-next-meta"><b>'+esc(fixtureDayLabel(m.date))+'</b><span>'+esc(m.category||p.category||'')+(m.round?' · Jornada '+esc(m.round):'')+'</span></div>'+
    '<div class="v383-next-teams">'+
      '<span><i>'+teamLogo(m.home)+'</i><b>'+esc(m.home)+'</b></span>'+
      '<em>'+esc(fixtureTime(m.date))+'</em>'+
      '<span><i>'+teamLogo(m.away)+'</i><b>'+esc(m.away)+'</b></span>'+
    '</div>'+
    '<div class="v383-next-foot"><small>'+esc(m.field||'Campo por confirmar')+'</small><button type="button" data-v379-match-detail="'+encoded+'">Ver detalles</button></div>'+
  '</article>';
}
function newsEmpty(){
  return '<div class="v379-news-empty"><div class="v379-news-art" aria-hidden="true"></div><strong>Sin noticias oficiales del jugador</strong><p>Cuando la Liga publique una nota asociada a este jugador aparecerá aquí.</p><button type="button" data-v379-news>Ver noticias de la Liga</button></div>';
}
function summary(p,d,list){
  const goals=publishedGoal(p),matches=fixtures(p).length,discipline=officialDiscipline(p);
  return '<div class="v379-tab-panel">'+infoGrid(p,d)+
   '<section class="v379-block">'+sectionTitle('Datos oficiales','','')+
    '<div class="v379-key-grid v380-player-key-grid"><div><strong>'+(goals==null?'—':goals)+'</strong><small>Goles oficiales</small></div><div><strong>'+matches+'</strong><small>Partidos sincronizados</small></div><div><strong>'+discipline.yellow+'</strong><small>Tarjetas amarillas</small></div><div><strong>'+discipline.red+'</strong><small>Tarjetas rojas</small></div></div>'+
    (discipline.suspension?'<div class="v380-suspension"><b>Castigo oficial</b><span>'+esc(discipline.suspension)+(discipline.pending?' · '+esc(discipline.pending)+' pendiente(s)':'')+'</span></div>':'')+
   '</section>'+
   '<section class="v379-block">'+sectionTitle('Próximo partido','Ver todo','data-v379-tab-jump="Partidos"')+nextMatchCard(p)+'</section>'+
   '<section class="v379-block">'+sectionTitle('Noticias','Ver todo','data-v379-tab-jump="Noticias"')+newsEmpty()+'</section>'+
   relatedHtml(p,list)+'</div>';
}
function statRow(label,val,sub){
  return '<div class="v379-stat-row"><span><b>'+esc(label)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><strong>'+esc(val)+'</strong></div>';
}
function v385PlayerThumb(p,cls='v385-player-thumb'){
  const photo=getPhoto(p);
  if(photo)return '<span class="'+cls+' photo"><img src="'+esc(photo)+'" alt="'+esc(p.name)+'"></span>';
  return simulatedHeadMarkup(p,cls+' v382-related-sim');
}
function v385CompactHeader(p){
  return '<div class="v385-player-compact-head" data-v385-compact-head>'+
    '<button type="button" class="v385-head-back" data-v379-back aria-label="Volver">'+
      '<svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg>'+
    '</button>'+
    '<strong>'+esc(p.name)+'</strong>'+
    '<div class="v385-head-actions">'+
      '<button type="button" class="v385-head-compare" data-v379-compare aria-label="Comparar jugador">'+
        '<svg viewBox="0 0 28 24"><circle cx="9" cy="7" r="3.2"/><circle cx="19" cy="7" r="3.2"/><path d="M3 20c0-4 2.6-6.4 6-6.4s6 2.4 6 6.4M13 20c0-4 2.6-6.4 6-6.4s6 2.4 6 6.4"/></svg>'+
      '</button>'+
      '<button type="button" class="v385-head-share" data-v379-share aria-label="Compartir jugador">'+
        '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="m8 11 8-5M8 13l8 5"/></svg>'+
      '</button>'+
    '</div>'+
  '</div>';
}
function v385Accordion(title,rows,id){
  return '<section class="v385-stat-accordion" data-v385-accordion="'+esc(id)+'">'+
    '<button type="button" class="v385-accordion-head" data-v385-toggle="'+esc(id)+'">'+
      '<span>'+esc(title)+'</span><i></i>'+
    '</button>'+
    '<div class="v385-accordion-body">'+rows.join('')+'</div>'+
  '</section>';
}
function v385CompareStrip(p,list){
  let rel=related(p,list);
  if(!rel.length)rel=list.filter(x=>playerKey(x)!==playerKey(p)&&String(x.cat||'')===String(p.cat||'')).slice(0,8);
  if(!rel.length)return '';
  return '<section class="v385-compare-section">'+
    '<h2>Comparar jugador</h2>'+
    '<div class="v385-compare-strip">'+
      rel.map(x=>'<button type="button" class="v385-compare-pair" data-v385-compare-name="'+attr(x.name)+'" data-v385-compare-team="'+attr(x.team)+'" data-v385-compare-cat="'+attr(x.cat)+'">'+
        '<span class="v385-pair-player">'+v385PlayerThumb(p)+
          '<b>'+esc(p.name)+'</b><small>'+esc(profileData(p).position||p.category||'Jugador')+'</small>'+
          '<em>'+teamLogo(p.team)+'</em>'+
        '</span>'+
        '<span class="v385-versus">con<br>tra</span>'+
        '<span class="v385-pair-player">'+v385PlayerThumb(x)+
          '<b>'+esc(x.name)+'</b><small>'+esc(profileData(x).position||x.category||'Jugador')+'</small>'+
          '<em>'+teamLogo(x.team)+'</em>'+
        '</span>'+
      '</button>').join('')+
    '</div>'+
  '</section>';
}
function stats(p,list){
  const goals=publishedGoal(p),discipline=officialDiscipline(p);
  const attackRows=[
    statRow('Goles dentro del área','—','No publicado'),
    statRow('Goles fuera del área','—','No publicado'),
    statRow('Con la derecha','—','No publicado'),
    statRow('Con la izquierda','—','No publicado'),
    statRow('De cabeza','—','No publicado')
  ];
  const distributionRows=[
    statRow('Pases completados','—','No publicado'),
    statRow('Pases clave','—','No publicado'),
    statRow('Centros completados','—','No publicado'),
    statRow('Precisión de pase','—','No publicado')
  ];
  const defenseRows=[
    statRow('Duelos','—','No publicado'),
    statRow('Entradas con éxito','—','No publicado'),
    statRow('Balones recuperados','—','No publicado'),
    statRow('Despejes completados','—','No publicado')
  ];
  const disciplineRows=[
    statRow('Tarjetas amarillas',discipline.yellow,'Dato oficial'),
    statRow('Tarjetas rojas',discipline.red,'Dato oficial'),
    statRow('Castigo',discipline.suspension||'—',discipline.suspension?'Dato oficial':'No publicado'),
    statRow('Pendientes',discipline.pending||'—',discipline.pending?'Dato oficial':'No publicado')
  ];
  return '<div class="v379-tab-panel v385-stats-reference">'+
    '<section class="v379-stats-card v385-attack-card"><div class="v379-stats-head"><span>ATAQUE</span><i></i></div>'+
      '<div class="v379-big-stat"><strong>'+(goals==null?'—':goals)+'</strong><span>Goles oficiales</span></div>'+
      attackRows.join('')+
    '</section>'+
    v385Accordion('Distribución',distributionRows,'distribution')+
    v385Accordion('Defensa',defenseRows,'defense')+
    v385Accordion('Información disciplinaria',disciplineRows,'discipline')+
    v385CompareStrip(p,list)+
  '</div>';
}
function playerMatchCard(m,p,played){
  const encoded=matchDetailAttr(m,p);
  const scoreOrTime=played&&m.homeScore!==null&&m.awayScore!==null
    ? '<b class="v383-result-score">'+esc(m.homeScore+' - '+m.awayScore)+'</b>'
    : '<b class="v383-result-time">'+esc(fixtureTime(m.date))+'</b>';
  return '<article class="v383-player-match '+(played?'played':'future')+'">'+
    '<div class="v383-player-match-head">'+
      '<b>'+esc(fixtureDayLabel(m.date))+'</b>'+
      '<span>'+esc(m.category||p.category||'Liga Municipal')+(m.round?' · Jornada '+esc(m.round):'')+'</span>'+
    '</div>'+
    '<div class="v383-player-match-body">'+
      '<div class="v383-player-match-teams">'+
        '<span><i>'+teamLogo(m.home)+'</i><b>'+esc(m.home)+'</b>'+(played&&m.homeScore!==null?'<strong>'+esc(m.homeScore)+'</strong>':'')+'</span>'+
        '<span><i>'+teamLogo(m.away)+'</i><b>'+esc(m.away)+'</b>'+(played&&m.awayScore!==null?'<strong>'+esc(m.awayScore)+'</strong>':'')+'</span>'+
      '</div>'+
      '<div class="v383-player-match-side">'+scoreOrTime+
        '<button type="button" data-v379-match-detail="'+encoded+'">Ver detalles</button>'+
      '</div>'+
    '</div>'+
    '<div class="v383-player-match-field">'+esc(m.field||'Campo por confirmar')+'</div>'+
  '</article>';
}
function matchList(p){
  const rows=playerFixtures(p);
  if(!rows.length)return '<div class="v379-tab-panel"><div class="v379-empty large">No hay partidos sincronizados para '+esc(p.team)+'.</div></div>';
  const past=rows.filter(fixturePlayed).sort((a,b)=>(fixtureDate(b.date)?.getTime()||0)-(fixtureDate(a.date)?.getTime()||0));
  const future=rows.filter(m=>!fixturePlayed(m)).sort((a,b)=>(fixtureDate(a.date)?.getTime()||0)-(fixtureDate(b.date)?.getTime()||0));
  return '<div class="v379-tab-panel v383-player-matches">'+
    '<section class="v383-match-section"><h2>Partidos anteriores</h2>'+
      (past.length?past.map(m=>playerMatchCard(m,p,true)).join(''):'<div class="v379-empty">No hay partidos anteriores publicados.</div>')+
    '</section>'+
    '<section class="v383-match-section upcoming"><h2>Próximos partidos</h2>'+
      (future.length?future.map(m=>playerMatchCard(m,p,false)).join(''):'<div class="v379-empty">No hay próximos partidos publicados.</div>')+
    '</section>'+
  '</div>';
}
function newsTab(p,list){
  return '<div class="v379-tab-panel"><section class="v379-block">'+sectionTitle('Noticias de '+p.name,'','')+newsEmpty()+'</section>'+relatedHtml(p,list)+'</div>';
}
function content(active,p,d,list){
  if(active==='Estadísticas')return stats(p,list);
  if(active==='Partidos')return matchList(p);
  if(active==='Noticias')return newsTab(p,list);
  return summary(p,d,list);
}
function markup(active,p,list){
  const d=profileData(p);
  return '<section class="v379-profile" data-v379-profile>'+v385CompactHeader(p)+hero(p,d)+tabs(active)+'<div class="v379-content">'+content(active,p,d,list)+'</div></section>';
}
function syncPlayerBottomNav(active){
  if(!active)return;
  document.querySelectorAll('.bottom-nav .nav-item').forEach(b=>b.classList.toggle('active',b.dataset.route==='competition'));
}
function setTheme(active){
  document.body.classList.toggle('v379-player-profile-active',active);
  syncPlayerBottomNav(active);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta){
    if(active){
      if(!meta.dataset.v379Previous)meta.dataset.v379Previous=meta.getAttribute('content')||'#02065F';
      meta.setAttribute('content','#031f9e');
    }else if(meta.dataset.v379Previous){
      meta.setAttribute('content',meta.dataset.v379Previous);delete meta.dataset.v379Previous;
    }
  }
}
function bind(p,list){
  document.querySelectorAll('[data-v379-back]').forEach(b=>b.addEventListener('click',()=>{if(history.length>1)history.back();else location.hash='#/players'},{once:true}));
  document.querySelectorAll('[data-v379-share]').forEach(b=>b.addEventListener('click',async()=>{
    const payload={title:p.name+' · Liga Juventino Rosas',text:p.name+' · '+p.team+' · '+(p.category||'Jugador registrado'),url:location.href};
    try{if(navigator.share)await navigator.share(payload);else if(navigator.clipboard){await navigator.clipboard.writeText(location.href)}}catch{}
  },{once:true}));
  document.querySelectorAll('[data-v379-tab]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem(TAB_KEY,b.dataset.v379Tab||'Resumen');render(true)},{once:true}));
  document.querySelectorAll('[data-v379-tab-jump]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem(TAB_KEY,b.dataset.v379TabJump||'Resumen');render(true)},{once:true}));
  document.querySelectorAll('[data-v379-related]').forEach(b=>b.addEventListener('click',()=>{
    const x=resolve({name:b.dataset.v379Related,team:b.dataset.v379RelatedTeam,cat:b.dataset.v379RelatedCat},list);
    if(!x)return;write(KEY,x);localStorage.setItem(TAB_KEY,'Resumen');render(true);window.scrollTo({top:0,behavior:'smooth'});
  },{once:true}));
  document.querySelectorAll('[data-v379-compare]').forEach(b=>b.addEventListener('click',()=>{
    if(window.LJR_PLAYER_COMPARE_API?.open){window.LJR_PLAYER_COMPARE_API.open(p);return}
    write('v123-compare-player',p);localStorage.removeItem('v123-compare-player-2');location.hash='#/playerCompare';
  },{once:true}));
  document.querySelectorAll('[data-v385-toggle]').forEach(b=>b.addEventListener('click',()=>{
    const card=b.closest('[data-v385-accordion]');
    if(card)card.classList.toggle('open');
  },{once:true}));
  document.querySelectorAll('[data-v385-compare-name]').forEach(b=>b.addEventListener('click',()=>{
    const x=resolve({name:b.dataset.v385CompareName,team:b.dataset.v385CompareTeam,cat:b.dataset.v385CompareCat},list);
    if(!x)return;
    write('v123-compare-player',p);
    write('v123-compare-player-2',x);
    location.hash='#/playerCompare';
  },{once:true}));
  document.querySelectorAll('[data-v379-match-detail]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    let detail=null;
    try{detail=JSON.parse(decodeURIComponent(b.dataset.v379MatchDetail||''))}catch{}
    if(!detail)return;
    try{
      sessionStorage.setItem('lj-match-detail',JSON.stringify(detail));
      sessionStorage.removeItem('v69-match-center-entry');
    }catch{}
    location.hash='#/match';
  },{once:true}));
  document.querySelectorAll('[data-v379-competition]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/competition'},{once:true}));
  document.querySelectorAll('[data-v379-news]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/news'},{once:true}));
}
async function render(force=false){
  if(rendering)return;
  const active=route()==='playerDetail';
  setTheme(active);
  if(!active)return;
  rendering=true;
  try{
    const a=await getApi();if(!a)return;
    const list=a.playerList?.()||[];if(!list.length)return;
    const p=currentPlayer(list);if(!p)return;
    write(KEY,p);
    const screen=document.querySelector('#screen');if(!screen)return;
    if(!force&&screen.querySelector('[data-v379-profile]')?.dataset?.playerKey===playerKey(p))return;
    const tab=localStorage.getItem(TAB_KEY)||'Resumen';
    screen.innerHTML=markup(tab,p,list);
    const root=screen.querySelector('[data-v379-profile]');if(root)root.dataset.playerKey=playerKey(p);
    bind(p,list);
    window.scrollTo(0,0);
  }finally{rendering=false}
}
function open(player){
  getApi().then(a=>{
    if(!a)return;const p=resolve(player,a.playerList?.()||[]);if(!p)return;
    write(KEY,p);localStorage.setItem(TAB_KEY,'Resumen');location.hash='#/playerDetail';
  });
}
function v385SyncScrolledHeader(){
  const active=route()==='playerDetail';
  const y=window.scrollY||document.documentElement.scrollTop||0;
  const hero=document.querySelector('.v379-hero');
  const heroBottom=hero?.getBoundingClientRect?.().bottom??9999;
  const show=active&&(y>170||heroBottom<178);
  document.body.classList.toggle('v385-player-scrolled',show);
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(()=>{render(false);v385SyncScrolledHeader()}))}
window.LJR_PLAYER_PROFILE_API={open,render:()=>render(true)};
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('scroll',v385SyncScrolledHeader,{passive:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='playerDetail'&&!screen.querySelector('[data-v379-profile]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();