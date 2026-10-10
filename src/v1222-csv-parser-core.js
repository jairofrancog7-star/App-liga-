/* CSV parser ligero compartido por interfaz y Web Worker: sin dependencias. */
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]+/g,' ').replace(/[^a-z0-9+]+/g,' ').trim();
const DELIMS=[',',';','\t','|'];
const CAP_ROWS=12000;
export function parseDelimited(input,separator=',',cap=CAP_ROWS){
 const source=String(input||'').replace(/^\uFEFF/,'');
 const rows=[],warnings=[];
 let row=[],cell='',quote=false;let started=false;
 for(let i=0;i<source.length;i++){
  const c=source[i];
  if(c==='"'){
   if(quote&&source[i+1]==='"'){cell+='"';i++;}
   else if(quote){quote=false;}
   else if(cell===''){quote=true;}
   else {cell+=c;warnings.push('Comillas inesperadas cerca del carácter '+(i+1));}
  }else if(c===separator&&!quote){row.push(cell);cell='';started=true;}
  else if((c==='\n'||c==='\r')&&!quote){
   if(c==='\r'&&source[i+1]==='\n')i++;
   row.push(cell);cell='';
   if(row.some(s=>s.trim()!=='')){rows.push(row);if(rows.length>cap+1)throw Error('El archivo supera '+cap+' registros. Divídelo antes de analizarlo.');}
   row=[];started=false;
  }else {cell+=c;started=true;}
 }
 if(quote)warnings.push('Hay comillas sin cerrar en el archivo.');
 if(started||cell!==''||row.length){
  row.push(cell);
  if(row.some(s=>s.trim()!=='')){
   rows.push(row);
   if(rows.length>cap+1)throw Error('El archivo supera '+cap+' registros. Divídelo antes de analizarlo.');
  }
 }
 const headers=rows.shift()||[];
 const length=headers.length;
 if(length===0)warnings.push('Archivo vacío o sin encabezados.');
 for(let i=0;i<rows.length;i++)if(rows[i].length!==length)warnings.push('Fila '+(i+2)+': '+rows[i].length+' columnas; se esperaban '+length+'.');
 if(new Set(headers.map(normalize)).size!==headers.length)warnings.push('Existen encabezados repetidos.');
 return {headers,rows,warnings,delimiter:separator};
}
export function detectDelimiter(input){
 let best=',',score=-1;
 for(const d of DELIMS){
  try{
   const p=parseDelimited(String(input||'').slice(0,50000),d,2000);
   const widths=[p.headers.length,...p.rows.slice(0,15).map(r=>r.length)];
   const good=widths.filter(x=>x>1).length;
   const same=widths.filter(x=>x===widths[0]).length;
   const s=(widths[0]>1?10:0)+good*4+same-p.warnings.length*3;
   if(s>score){score=s;best=d;}
  }catch(_){}
 }
 return best;
}
