/* Junta semanal · exportación PNG fiel a los datos y escudo sin fondo.
   Es independiente del diseño de la pantalla. */
(function(){
'use strict';
let logoPromise;
const get=(form,sel)=>String(form.querySelector(sel)?.value||'').trim();
function info(form){
 return {
  date:get(form,'[data-x="date"]'),time:get(form,'[data-meeting-field="time"]'),
  place:get(form,'[data-meeting-field="place"]'),owner:get(form,'[data-meeting-field="owner"]'),
  attendance:get(form,'[data-x="attendance"]'),deadline:get(form,'[data-meeting-field="deadline"]'),
  agenda:get(form,'[data-x="agenda"]'),agreements:get(form,'[data-x="agreements"]'),
  tasks:get(form,'[data-meeting-field="tasks"]')
 };
}
function dateMX(value){
 const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');
 if(!m)return value||'—';
 try{return new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
  .format(new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12));}
 catch(_){return value||'—';}
}
// The old WebP logo has a solid dark outer matte. Remove only its outer,
// connected dark area, leaving the black details of the emblem intact.
function transparentLogo(){
 if(logoPromise)return logoPromise;
 logoPromise=new Promise(resolve=>{
  const img=new Image();
  img.onload=()=>{
   try{
    const w=Math.max(1,Math.round(img.naturalWidth*Math.min(1,360/img.naturalWidth,360/img.naturalHeight)));
    const h=Math.max(1,Math.round(img.naturalHeight*w/img.naturalWidth));
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);
    const pixels=ctx.getImageData(0,0,w,h);
    const rgba=pixels.data,visited=new Uint8Array(w*h),queue=new Int32Array(w*h);
    let tail=0,head=0;
    function background(n){
     const i=n*4,r=rgba[i],g=rgba[i+1],b=rgba[i+2],a=rgba[i+3];
     return a<20 || (Math.max(r,g,b)<86 && Math.max(r,g,b)-Math.min(r,g,b)<42);
    }
    function push(n){if(n<0||n>=w*h||visited[n]||!background(n))return;visited[n]=1;queue[tail++]=n;}
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
    for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
    while(head<tail){
     const n=queue[head++],x=n%w,y=(n/w)|0;
     rgba[n*4+3]=0;
     if(x)push(n-1);if(x<w-1)push(n+1);
     if(y)push(n-w);if(y<h-1)push(n+w);
    }
    ctx.putImageData(pixels,0,0);
    resolve(c.toDataURL('image/png'));
   }catch(_){resolve(img.src);}
  };
  img.onerror=()=>resolve('');
  img.src=new URL('./assets/liga-logo.webp',document.baseURI).href;
 });
 return logoPromise;
}
function loadImage(url){
 return new Promise(resolve=>{
  if(!url){resolve(null);return;}
  const img=new Image();
  img.onload=()=>resolve(img);
  img.onerror=()=>resolve(null);
  img.src=url;
 });
}
function wrapped(ctx,value,width){
 const paragraphs=String(value||'—').replace(/\r/g,'').split('\n');
 const lines=[];
 paragraphs.forEach(paragraph=>{
  const words=(paragraph.trim()||'—').split(/\s+/);
  let line='';
  for(const word of words){
   const next=line?line+' '+word:word;
   if(ctx.measureText(next).width<=width){line=next;continue;}
   if(line){lines.push(line);line='';}
   if(ctx.measureText(word).width<=width){line=word;continue;}
   let chunk='';
   for(const letter of word){
    if(chunk&&ctx.measureText(chunk+letter).width>width){lines.push(chunk);chunk='';}
    chunk+=letter;
   }
   line=chunk;
  }
  lines.push(line||'—');
 });
 return lines;
}
async function renderPNG(form){
 const d=info(form),logo=await loadImage(await transparentLogo());
 const w=1200,margin=60,colGap=18,inner=w-2*margin,metaWidth=(inner-colGap)/2;
 const measurement=document.createElement('canvas').getContext('2d');
 measurement.font='25px Arial';
 const meta=[
  ['FECHA DE JUNTA',dateMX(d.date)],['HORA',d.time||'—'],
  ['LUGAR',d.place||'—'],['RESPONSABLE',d.owner||'—'],
  ['ASISTENCIA',d.attendance||'—'],['FECHA LÍMITE DE ACUERDOS',dateMX(d.deadline)]
 ];
 const section=[['Orden del día',d.agenda],['Acuerdos / minuta',d.agreements],['Pendientes y seguimiento',d.tasks]];
 const metaRows=[];
 for(let i=0;i<meta.length;i+=2){
  const a=wrapped(measurement,meta[i][1],metaWidth-42);
  const b=wrapped(measurement,meta[i+1][1],metaWidth-42);
  metaRows.push({left:a,right:b,height:Math.max(106,62+31*Math.max(a.length,b.length))});
 }
 const sections=section.map(([label,value])=>{
  measurement.font='26px Arial';
  const lines=wrapped(measurement,value,inner-56);
  return {label,lines,height:Math.max(88,42+34*lines.length)};
 });
 const overall=210+metaRows.reduce((n,r)=>n+r.height+14,0)+20+
   sections.reduce((n,s)=>n+s.height+112,0)+90;
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=Math.ceil(overall);
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,canvas.height);
 let y=54;
 if(logo){
  const area=118,ratio=Math.min(area/logo.width,area/logo.height);
  const iw=logo.width*ratio,ih=logo.height*ratio;
  ctx.drawImage(logo,margin+(area-iw)/2,y+(area-ih)/2,iw,ih);
 }
 ctx.textBaseline='top';ctx.fillStyle='#0d52ab';ctx.font='bold 17px Arial';
 ctx.fillText('LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS',205,y+10);
 ctx.fillStyle='#0b204d';ctx.font='bold 43px Arial';ctx.fillText('Minuta de junta semanal',205,y+43);
 ctx.fillStyle='#637083';ctx.font='22px Arial';
 ctx.fillText('Documento generado desde la aplicación oficial de la Liga.',205,y+99);
 y+=148;ctx.fillStyle='#1055b0';ctx.fillRect(margin,y,inner,4);y+=24;
 let offset=0;
 for(const row of metaRows){
  const pair=meta.slice(offset,offset+2),lines=[row.left,row.right];
  for(let c=0;c<2;c++){
   const x=margin+c*(metaWidth+colGap);
   ctx.fillStyle='#ffffff';ctx.strokeStyle='#d1d9e5';ctx.lineWidth=2;
   ctx.beginPath();ctx.roundRect(x,y,metaWidth,row.height,11);ctx.fill();ctx.stroke();
   ctx.fillStyle='#1055ab';ctx.font='bold 16px Arial';ctx.fillText(pair[c][0],x+20,y+14);
   ctx.fillStyle='#142137';ctx.font='25px Arial';
   lines[c].forEach((line,n)=>ctx.fillText(line,x+20,y+44+n*31));
  }
  y+=row.height+14;offset+=2;
 }
 y+=18;
 for(const section of sections){
  ctx.fillStyle='#1055ab';ctx.font='bold 27px Arial';ctx.fillText(section.label,y?margin:margin,y);
  y+=40;ctx.fillStyle='#dbe3ef';ctx.fillRect(margin,y,inner,2);y+=12;
  ctx.fillStyle='#ffffff';ctx.strokeStyle='#ccd6e4';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(margin,y,inner,section.height,10);ctx.fill();ctx.stroke();
  ctx.fillStyle='#1a2738';ctx.font='26px Arial';
  section.lines.forEach((line,n)=>ctx.fillText(line,margin+24,y+20+n*34));
  y+=section.height+54;
 }
 ctx.fillStyle='#cbd5e1';ctx.fillRect(margin,y,inner,2);y+=16;
 ctx.textAlign='center';ctx.fillStyle='#65758d';ctx.font='18px Arial';
 ctx.fillText('Liga Juventino Rosas · Minuta oficial · PNG',w/2,y);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('PNG no disponible')),'image/png'));
 return new File([blob],'Minuta-Liga-'+(d.date||'Junta')+'.png',{type:'image/png'});
}
function download(file){
 const url=URL.createObjectURL(file);
 const a=document.createElement('a');a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
async function exportPNG(form,share){
 const file=await renderPNG(form);
 if(share&&navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
  try{
   await navigator.share({title:'Minuta de junta semanal · Liga Juventino Rosas',files:[file]});
   return 'shared';
  }catch(error){
   if(error?.name==='AbortError')return 'cancelled';
  }
 }
 download(file);return 'downloaded';
}
window.LJR_MINUTA_MEDIA={transparentLogo,info,dateMX,renderPNG,exportPNG};
})();
