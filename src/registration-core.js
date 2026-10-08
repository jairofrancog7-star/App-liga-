// Identity data is always evidence from the document, never reconstructed.
const alphabet='0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
const states=new Set('AS BC BS CC CL CM CS CH DF DG GT GR HG JC MC MN MS NT NL OC PL QT QR SP SL SR TC TS TL VZ YN ZS NE'.split(' '));
export const normalizeName=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function validateCurp(value){
  const c=String(value||'').toUpperCase().replace(/\s/g,'');
  const fail=message=>({ok:false,dob:'',message});
  if(!/^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(c))return fail('Revisa los 18 caracteres de la CURP');
  if(!states.has(c.slice(11,13)))return fail('Revisa la entidad de nacimiento en la CURP');
  const y=(/\d/.test(c[16])?1900:2000)+Number(c.slice(4,6)),m=Number(c.slice(6,8)),d=Number(c.slice(8,10));
  const date=new Date(Date.UTC(y,m-1,d));
  if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d||date>Date.now())return fail('Revisa la fecha de nacimiento en la CURP');
  const sum=[...c.slice(0,17)].reduce((s,ch,i)=>s+alphabet.indexOf(ch)*(18-i),0);
  if(String((10-sum%10)%10)!==c[17])return fail('El dígito verificador no coincide; vuelve a leer el documento');
  return {ok:true,dob:`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,message:'Formato, fecha y dígito correctos · revisar contra el documento'};
}
export function extractCurp(text){
  const found=new Set();
  for(const line of String(text||'').toUpperCase().split(/\r?\n/)){
    const compact=line.replace(/[^A-Z0-9]/g,'');
    for(let i=0;i<=compact.length-18;i++){const c=compact.slice(i,i+18);if(validateCurp(c).ok)found.add(c)}
  }
  return found.size===1?[...found][0]:'';
}
export function parseIdentity(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim().replace(/\s+/g,' ')).filter(Boolean);
  const stop=/^(DOMICILIO|CLAVE|CURP|FECHA|SEXO|ESTADO|MUNICIPIO|SECCI[ÓO]N|VIGENCIA|ENTIDAD|APELLIDO|PRIMER|SEGUNDO)\b/i;
  const after=re=>{const i=lines.findIndex(l=>re.test(l));if(i<0)return '';const same=lines[i].replace(re,'').replace(/^\s*[:\-]\s*/,'').trim();return same||(!stop.test(lines[i+1]||'')?lines[i+1]||'':'')};
  const given=after(/^NOMBRES?\b/i),first=after(/^(PRIMER\s+APELLIDO|APELLIDO\s+PATERNO)\b/i),second=after(/^(SEGUNDO\s+APELLIDO|APELLIDO\s+MATERNO)\b/i);
  let name='';
  if(given&&(first||second))name=[given,first,second].filter(Boolean).join(' ');
  else{
    const i=lines.findIndex(l=>/^NOMBRES?\b/i.test(l));
    if(i>=0){
      const same=lines[i].replace(/^NOMBRES?\s*[:\-]?\s*/i,'').trim(),parts=same?[same]:[];
      for(let j=i+1;j<Math.min(lines.length,i+4)&&!stop.test(lines[j]);j++)if(!/\d/.test(lines[j]))parts.push(lines[j]);
      const ine=/INSTITUTO\s+NACIONAL\s+ELECTORAL|CREDENCIAL\s+PARA\s+VOTAR/i.test(text);
      name=(ine&&!same&&parts.length===3?[parts[2],parts[0],parts[1]]:parts).join(' ');
    }
  }
  if(!/^[\p{L} .'-]{3,100}$/u.test(name))name='';
  const curp=extractCurp(text),dob=curp?validateCurp(curp).dob:'';
  return {name,curp,dob};
}
export function completion(record,hasPhoto=false){
  const missing=[];
  if(!record?.name)missing.push('Nombre');
  if(!record?.team)missing.push('Equipo');
  const curp=validateCurp(record?.curp);
  if(!curp.ok)missing.push('CURP válida');
  if(!record?.dob)missing.push('Fecha de nacimiento');
  else if(curp.ok&&record.dob!==curp.dob)missing.push('Fecha coincide con CURP');
  if(!hasPhoto)missing.push('Foto del jugador');
  return {ready:missing.length===0,missing};
}
export function matchAttachment(filename,records){
  const key=normalizeName(String(filename||'').replace(/\.[^.]+$/,''));
  const hits=records.filter(r=>normalizeName(r.name)===key||(r.curp&&normalizeName(r.curp)===key));
  return hits.length===1?hits[0]:null;
}
export function rosterNames(text){
  const names=[],seen=new Set();
  for(const line of String(text||'').split(/\r?\n/)){
    const row=line.trim().replace(/^(?:NO\.?\s*)?[#Nº°]?\s*\d{1,3}\s*[.)\-:]?\s*/i,'');
    if(/^(lista|equipo|liga|jugadores?|delegados?|nombre(?:s)?(?:\s+completo)?|temporada|categor[ií]a|primera fuerza|intermedia|segunda fuerza|veteranos|total)\b/i.test(row))continue;
    const columns=row.split(/\t| {2,}|[;|]/);
    const name=columns.map(c=>c.replace(/\s+[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d.*$/i,'').replace(/\s+\d+.*$/,'').trim()).find(c=>/^[\p{L} .'-]{4,100}$/u.test(c)&&c.split(/\s+/).length>=2);
    if(!name)continue;
    const key=normalizeName(name);if(seen.has(key))continue;seen.add(key);names.push(name);
  }
  return names;
}
