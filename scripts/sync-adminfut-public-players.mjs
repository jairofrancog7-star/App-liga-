/* Auditoría de datos deportivos públicos de AdminFut. Jamás persiste CURP ni documentos. */
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
const SITE='https://www.juventinorosasliga.com';
const CATS=[['1','2'],['2','6'],['3','3'],['4','5'],['5','4']];
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const decode=s=>String(s||'').replace(/&(?:amp|nbsp|quot|ntilde|Ntilde|aacute|eacute|iacute|oacute|uacute);/g,x=>({'&amp;':'&','&nbsp;':' ','&quot;':'"','&ntilde;':'ñ','&Ntilde;':'Ñ','&aacute;':'á','&eacute;':'é','&iacute;':'í','&oacute;':'ó','&uacute;':'ú'}[x]||x)).replace(/&#(\d+);/g,(_,x)=>String.fromCodePoint(Number(x)));
const clean=s=>decode(String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')).trim();
const pause=ms=>new Promise(f=>setTimeout(f,ms));
async function readPage(url){for(let i=0;i<3;i++){try{const r=await fetch(url,{headers:{accept:'text/html'},signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error('HTTP '+r.status);return await r.text()}catch(e){if(i===2)throw Error('Fallo de lectura '+new URL(url).pathname+': '+e.message);await pause(1400*(i+1))}}}
async function batch(list,count,action){let i=0;await Promise.all(Array.from({length:count},async()=>{while(i<list.length){const x=list[i++];await action(x);await pause(420)}}))}
function teamOptions(html){const sel=html.match(/<select\b(?=[^>]*name=["']equipo["'])[^>]*>([\s\S]*?)<\/select>/i)?.[1]||'';return [...sel.matchAll(/<option\b[^>]*value=["'](\d+)["'][^>]*>([\s\S]*?)<\/option>/gi)].map(x=>({id:x[1],team:clean(x[2])})).filter(x=>x.team)}
function parsePlayers(html){const table=html.match(/<table\b[^>]*>[\s\S]*?<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i)?.[1]||'';const players=[],seen=new Set();for(const tr of table.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)||[]){const cell=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>x[1]);if(cell.length<5)continue;
 // Se usa foto (0), nombre (1), dorsal (3) y posición (4); no se accede a los documentos (2).
 const name=clean(cell[1]),position=clean(cell[4]),dorsal=clean(cell[3]);if(!name||seen.has(norm(name))||/selecciona una categoria/i.test(norm(name)))continue;seen.add(norm(name));
 let photo='';const src=cell[0].match(/<img\b[^>]*src=["']([^"']+)/i)?.[1];if(src){try{const u=new URL(decode(src));if(u.protocol==='https:'&&u.hostname==='res.cloudinary.com'&&u.pathname.includes('/jugadores/'))photo=u.href}catch{}}
 players.push({name,...(position?{position}:{}),...(dorsal&&dorsal!=='—'&&dorsal!=='-'?{dorsal}:{}),...(photo?{photo}:{})})}return players}
function mergeTeam(c,team,players,counters){c.rosters||={};c.player_profiles||={};const rk=Object.keys(c.rosters).find(x=>norm(x)===norm(team))||team,pk=Object.keys(c.player_profiles).find(x=>norm(x)===norm(team))||team;const roster=c.rosters[rk]||[],profiles=c.player_profiles[pk]||[],known=new Map(roster.map((name,index)=>[norm(name),index])),byName=new Map(profiles.map(p=>[norm(p.name),p]));
 for(const p of players){const k=norm(p.name);if(!known.has(k)){known.set(k,roster.length);roster.push(p.name);counters.added++}else if(roster[known.get(k)]!==p.name){roster[known.get(k)]=p.name;counters.names=(counters.names||0)+1}let q=byName.get(k);if(!q){q={name:p.name,position:p.position||'No especificada',dorsal:p.dorsal||'—'};profiles.push(q);byName.set(k,q);counters.profiles++}else if(q.name!==p.name){q.name=p.name;counters.names=(counters.names||0)+1}for(const attr of ['photo','position','dorsal'])if(p[attr]&&q[attr]!==p[attr]){q[attr]=p[attr];counters[attr]++}}
 c.rosters[rk]=roster;c.player_profiles[pk]=profiles;}
function parseCedulaScore(html,home,away){const txt=clean(html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ')).slice(0,1700);const escape=s=>String(s).replace(/[\^$.*+?()[\]{}|\\]/g,'\\$&').replace(/\s+/g,'\\s+');const r=txt.match(new RegExp(escape(home)+'\\s+(\\d+)\\s*-\\s*(\\d+)\\s+'+escape(away),'i'));return r?[r[1],r[2]]:null}
async function main(){const a=resolve(ROOT,'data/official-live.json'),b=resolve(ROOT,'public/data/official-live.json'),sa=await readFile(a,'utf8'),sb=await readFile(b,'utf8');if(sa!==sb)throw Error('La fuente canónica difiere de la pública: se detiene para no sobrescribir cambios.');const d=JSON.parse(sa),tasks=[];
 for(const [category,season]of CATS){const url=SITE+'/reportes/registro/?categoria='+category+'&temporada='+season;const options=teamOptions(await readPage(url));if(options.length<3)throw Error('Registro de equipos incompleto: '+category);for(const x of options)tasks.push({...x,category,season})}
 const results=[];await batch(tasks,3,async item=>{const url=SITE+'/reportes/registro/?categoria='+item.category+'&temporada='+item.season+'&equipo='+item.id;results.push({...item,players:parsePlayers(await readPage(url))})});
 if(results.length!==tasks.length)throw Error('No se pudo verificar la totalidad de equipos');
 const counters={added:0,profiles:0,photo:0,position:0,dorsal:0,names:0},cats={};
 for(const r of results.sort((x,y)=>x.category.localeCompare(y.category)||x.team.localeCompare(y.team))){const c=d.categories[r.category];if(!c)throw Error('Categoría desconocida '+r.category);if(!cats[r.category])cats[r.category]={teams:0,players:0};cats[r.category].teams++;cats[r.category].players+=r.players.length;if(r.players.length)mergeTeam(c,r.team,r.players,counters)}
 const mismatches=[],cedulas=Object.entries(d.categories).flatMap(([category,c])=>(c.cedulas||[]).map(x=>({...x,category})));
 await batch(cedulas,3,async c=>{const html=await readPage(SITE+'/cedula-arbitral/'+c.id+'/');const score=parseCedulaScore(html,c.local,c.away);if(!score)return;const rows=d.categories[c.category].fixtures?.[0]?.rows||[];const found=rows.filter(r=>norm(r[2])===norm(c.local)&&norm(r[6])===norm(c.away));if(found.length===1&&(found[0][3]!==score[0]||found[0][5]!==score[1]))mismatches.push({category:c.category,id:c.id,home:c.local,away:c.away,score,previous:[found[0][3],found[0][5]]})});
 mismatches.sort((x,y)=>Number(x.category)-Number(y.category)||x.id-y.id);
 const report={source:SITE,categories:cats,cedulasChecked:cedulas.length,cedulaScoreDifferences:mismatches};const auditPath=resolve(ROOT,'data/adminfut-public-audit.json');let previous={};try{previous=JSON.parse(await readFile(auditPath,'utf8'))}catch{}const changed=Object.values(counters).some(x=>x>0),reportChanged=JSON.stringify(report)!==JSON.stringify(previous);
 if(changed){const text=JSON.stringify(d,null,2)+'\n';await writeFile(a,text);await writeFile(b,text)}
 if(reportChanged)await writeFile(auditPath,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({teams:tasks.length,cedulas:cedulas.length,updates:counters,cedulaDifferences:mismatches.length,changed:changed||reportChanged}));
}
export {teamOptions,parsePlayers,mergeTeam,parseCedulaScore};
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1});
