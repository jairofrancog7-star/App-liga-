/* V1011: funciones puras para padron LOCAL; sin endpoints ni telemetria. */
export const REGISTRY_KEY='v124-player-registry';
export const BACKUP_FORMAT='LJR_REGISTRO_PRIVADO';
export const BACKUP_VERSION=1;
const MAX_BACKUP_BYTES=32*1024*1024;
export const clean=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const goodObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function parseRegistry(raw){
  let value=raw;
  if(typeof raw==='string'){try{value=JSON.parse(raw)}catch{throw Error('El archivo no contiene un padron valido')}}
  if(!goodObject(value)||!goodObject(value.seasons))throw Error('Falta la estructura de temporadas');
  const seasons=Object.create(null);
  const entries=Object.entries(value.seasons);
  if(entries.length>120)throw Error('Demasiadas temporadas en el archivo');
  for(const [season,list] of entries){
    if(!/^\d{4}\D+\d{4}$/.test(season)||!Array.isArray(list)||list.length>30000)throw Error('Temporada no valida: '+season);
    seasons[season]=list.map((row,i)=>{
      if(!goodObject(row)||typeof row.name!=='string'||typeof row.team!=='string')throw Error('Jugador no valido en '+season+' ('+(i+1)+')');
      return row;
    });
  }
  return {seasons};
}
export function makeLocalIndex(raw){
  const {seasons}=parseRegistry(raw),out=[];
  for(const [season,rows] of Object.entries(seasons)){
    rows.forEach((r,i)=>{
      const name=String(r.name||''),team=String(r.team||''),category=String(r.category||'');
      const tokens=[...new Set((clean(name+' '+team)).split(' ').filter(x=>x.length>1))];
      out.push({
        key:season+'|'+String(r.id||'pos-'+i),
        id:String(r.id||''),season,name,team,category,
        status:String(r.status||''),nameKey:clean(name),teamKey:clean(team),
        tokens,updatedAt:String(r.updatedAt||'')
      });
    });
  }
  return out;
}
export function mergeRegistry(current,restored){
  const live=parseRegistry(current),incoming=parseRegistry(restored),seasons=Object.create(null);
  for(const [season,records] of Object.entries(live.seasons))seasons[season]=records.slice();
  let added=0,existing=0;
  for(const [season,records] of Object.entries(incoming.seasons)){
    const rows=seasons[season]||(seasons[season]=[]);
    const identities=new Set(rows.map(r=>identity(r)));
    for(const row of records){
      const key=identity(row);
      if(identities.has(key)){existing++;continue}
      rows.push({...row});identities.add(key);added++;
    }
  }
  return {registry:{seasons},added,existing};
}
function identity(r){
  const id=String(r.id||'').trim();
  if(id)return 'id:'+id;
  return 'p:'+clean(r.name)+'|'+clean(r.team)+'|'+clean(r.curp);
}
const base64=bytes=>{
 let out='';
 for(let i=0;i<bytes.length;i+=8192)out+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return btoa(out);
};
const unbase64=str=>{
 if(typeof str!=='string'||str.length>MAX_BACKUP_BYTES*2)throw Error('Respaldo demasiado grande');
 return Uint8Array.from(atob(str),c=>c.charCodeAt(0));
};
const derive=async(password,salt,subtle)=>{
 const key=await subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 return subtle.deriveKey({name:'PBKDF2',salt,iterations:220000,hash:'SHA-256'},key,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
};
export async function encryptRegistry(raw,password,webCrypto=globalThis.crypto){
 if(String(password||'').length<10)throw Error('Usa una clave de al menos 10 caracteres');
 const registry=parseRegistry(raw),payload=new TextEncoder().encode(JSON.stringify(registry));
 if(payload.byteLength>MAX_BACKUP_BYTES)throw Error('El padron excede el limite de respaldo local');
 if(!webCrypto?.subtle)throw Error('Este navegador no admite cifrado local');
 const salt=webCrypto.getRandomValues(new Uint8Array(16)),iv=webCrypto.getRandomValues(new Uint8Array(12));
 const key=await derive(password,salt,webCrypto.subtle);
 const encrypted=new Uint8Array(await webCrypto.subtle.encrypt({name:'AES-GCM',iv},key,payload));
 return {format:BACKUP_FORMAT,version:BACKUP_VERSION,cipher:'AES-256-GCM',kdf:'PBKDF2-SHA256',iterations:220000,salt:base64(salt),iv:base64(iv),data:base64(encrypted)};
}
export async function decryptRegistry(envelope,password,webCrypto=globalThis.crypto){
 if(!goodObject(envelope)||envelope.format!==BACKUP_FORMAT||envelope.version!==BACKUP_VERSION||envelope.cipher!=='AES-256-GCM'||envelope.iterations!==220000)throw Error('Formato de respaldo no compatible');
 if(!webCrypto?.subtle)throw Error('Este navegador no admite descifrado local');
 try{
  const salt=unbase64(envelope.salt),iv=unbase64(envelope.iv),data=unbase64(envelope.data);
  if(salt.length!==16||iv.length!==12||data.length>MAX_BACKUP_BYTES+32)throw Error('Datos no validos');
  const key=await derive(String(password||''),salt,webCrypto.subtle);
  const clear=await webCrypto.subtle.decrypt({name:'AES-GCM',iv},key,data);
  return parseRegistry(new TextDecoder().decode(clear));
 }catch(e){throw Error('No se pudo abrir el respaldo. Revisa la clave y el archivo.')}
}
