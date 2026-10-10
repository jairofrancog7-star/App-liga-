/* Compositions use real images and bounded text boxes; no generated crests. */
(()=>{'use strict';
const sizes={portrait:[1080,1350],square:[1080,1080],story:[1080,1920],landscape:[1200,630]};
const group=t=>/Tabla|Calendario/.test(t)?'table':/Campeón|Ganadores|destacado|Goleador|cumpleaños|Navidad|Año Nuevo|Día del/.test(t)?'celebration':/final|jornada|Notificación de partido/i.test(t)?'match':'news';
const names={match:['Estadio · duelo central','Diagonal · dos bandos','Entrada de partido','Editorial · equipos en filas','Foto · marcador inferior'],news:['Comunicado oficial','Portada con fotografía','Revista · foto y texto','Titular protagonista','Tarjeta de notificación'],celebration:['Trofeo y laureles','Fotografía protagonista','Portada de campeón','Podio de honor','Bandera del equipo'],table:['Clasificación oficial','Tarjetas separadas','Dos columnas','Líderes y clasificación','Informe en blanco']};
function variants(t){if(/Bracket|Táctica/.test(t))return ['Cuadro completo'];if(t==='Logo del equipo')return ['Escudo clásico','Insignia circular','Emblema hexagonal','Escudo con iniciales','Insignia con corona'];return names[group(t)]}
function autoText(v,category=''){
 const score=String(v.scoreHome??'').trim()!==''&&String(v.scoreAway??'').trim()!==''?v.scoreHome+' – '+v.scoreAway:'Resultado por confirmar';
 let body=/Resultado|Notificación de partido/.test(v.type)?(v.home||'Equipo local')+' '+score+' '+(v.away||'Equipo visitante'):
 group(v.type)==='match'?(v.home||'Equipo local')+' vs '+(v.away||'Equipo visitante'):
 group(v.type)==='celebration'?'La Liga Juventino Rosas felicita a '+(v.person||v.home||'los participantes')+'.':
 /Tabla|Calendario/.test(v.type)?'Consulta la información oficial publicada por la Liga.':
 /Reclutamiento|Convocatoria|Registro/.test(v.type)?'Consulta los requisitos y fechas de '+v.type.toLowerCase()+' con la organización de la Liga.':'La Liga Juventino Rosas informa a equipos, jugadores y delegados.';
 return {title:v.type,body:[body,category,v.details].filter(Boolean).join('\n')};
}
function paginate(rows,format,layout){const H=(sizes[format]||sizes.portrait)[1]*1080/(sizes[format]||sizes.portrait)[0],cols=Number(layout)===2?2:1,rowHeight=cols===2?112:84,top=H<700?166:300,reserve=Number(layout)===3?104:0,count=Math.max(1,Math.floor((H-top-100-reserve)/rowHeight))*cols;const pages=[];for(let i=0;i<rows.length;i+=count)pages.push(rows.slice(i,i+count));return {pages:pages.length?pages:[[]],count,rowHeight,top,reserve,cols}}
function box(c,s,x,y,w,h,size=34,color='#fff',weight=700,align='left'){
 s=String(s??'');if(!s.trim()||w<=0||h<=0)return;
 let lines=[],font=size;
 for(;font>=12;font--){c.font=weight+' '+font+'px Arial';lines=[];for(const p of s.split('\n')){let line='';for(const word of p.split(/\s+/)){if(c.measureText(word).width>w){let part='';for(const ch of word){if(c.measureText(part+ch).width>w){if(line)lines.push(line);lines.push(part);line='';part=ch}else part+=ch}if(line)lines.push(line);line=part;continue}const next=(line?line+' ':'')+word;if(c.measureText(next).width>w&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line)}if(lines.length*font*1.22<=h)break}
 if(font<12)throw Error('El texto es demasiado largo para este diseño. Reduce el mensaje o usa Historia.');
 c.fillStyle=color;c.textAlign=align;c.textBaseline='top';for(let i=0;i<lines.length;i++)c.fillText(lines[i],align==='center'?x+w/2:align==='right'?x+w:x,y+i*font*1.22);c.textAlign='left';
}
function rect(c,x,y,w,h,color,r=18){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function photo(c,im,x,y,w,h){if(!im)return;const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,k=Math.min(w/iw,h/ih);c.drawImage(im,x+(w-iw*k)/2,y+(h-ih*k)/2,iw*k,ih*k)}
function trophy(c,x,y,size){c.save();c.translate(x,y);c.scale(size/200,size/200);c.fillStyle='#e8bf57';c.beginPath();c.moveTo(-60,-80);c.lineTo(60,-80);c.quadraticCurveTo(55,5,12,20);c.lineTo(12,65);c.lineTo(50,80);c.lineTo(50,100);c.lineTo(-50,100);c.lineTo(-50,80);c.lineTo(-12,65);c.lineTo(-12,20);c.quadraticCurveTo(-55,5,-60,-80);c.fill();c.strokeStyle='#e8bf57';c.lineWidth=10;c.beginPath();c.moveTo(-58,-60);c.bezierCurveTo(-125,-75,-100,10,-45,0);c.moveTo(58,-60);c.bezierCurveTo(125,-75,100,10,45,0);c.stroke();c.restore()}
async function draw(v,canvas,c,background,custom={},helpers){
 if(/Bracket|Táctica/.test(v.type))return false;
 const k=Math.max(0,Math.min(4,Number(v.layout)||0)),g=group(v.type),h=helpers;
 if(v.type==='Logo del equipo'){if(!window.LJR_LOCAL_DESIGN_ART?.draw)return false;return window.LJR_LOCAL_DESIGN_ART.draw({...v,logoShape:['shield','circle','hexagon','shield','circle'][k],logoSymbol:['ball','star','crown','monogram','crown'][k]},canvas,c,background,custom,h)}
 const [W,H0]=sizes[v.format]||sizes.portrait,H=H0*1080/W;canvas.width=W;canvas.height=H0;c.save();c.scale(W/1080,W/1080);
 const light=(g==='news'&&k===0)||(g==='table'&&k===4)||(g==='match'&&k===2),ink=light?'#102747':'#fff',muted=light?'#42597a':'#c6d3e6',accent=v.accent||'#2cdfed';
 const grad=c.createLinearGradient(0,0,1080,H);grad.addColorStop(0,light?'#f8f5ed':g==='celebration'||v.style==='gold'?'#231a0f':v.style==='red'?'#4c1322':'#122950');grad.addColorStop(1,light?'#dde6ef':g==='celebration'?'#060a14':'#060b1b');c.fillStyle=grad;c.fillRect(0,0,1080,H);
 if(background){photo(c,background,0,0,1080,H);rect(c,0,0,1080,H,light?'#f5f6efee':'#040b1bb8',0)}
 if(!light){c.strokeStyle=accent+'40';c.lineWidth=2;for(let i=0;i<8;i++){c.beginPath();c.ellipse(540,H*.78,680-i*45,190+i*18,0,Math.PI,Math.PI*2);c.stroke()}}
 const league=custom.league||await h.img('./assets/branding/escudo-liga-camisetas-unificado-v1122.png');photo(c,league,922,24,92,92);
 box(c,'LIGA JUVENTINO ROSAS',60,36,810,40,24,light?'#214875':accent,800);
 const top=H<700?166:300,bottom=H-100,space=bottom-top;
 box(c,(v.title||v.type).toUpperCase(),60,H<700?78:108,940,H<700?48:112,H<700?38:64,ink,900);
 const cat=v.categoryName||h.cats[v.category]||'',catIm=custom.category;
 if(catIm&&v.categoryDisplay!=='text')photo(c,catIm,60,top-72,52,52);
 box(c,cat,catIm&&v.categoryDisplay!=='text'?128:60,top-62,770,44,24,muted,800);
 const local=custom.home||await h.img(h.logo(v.home)),away=custom.away||await h.img(h.logo(v.away)),person=custom.person;
 const card=(im,label,x,y,w,hh,color=ink)=>{photo(c,im,x+20,y+10,w-40,hh*.68);box(c,label,x+14,y+hh*.74,w-28,hh*.23,30,color,800,'center')};
 const details=(y,hh)=>box(c,v.details||'Completa fecha, hora y campo',80,y,920,hh,30,muted,700,'center');
 const message=(x,y,w,hh)=>box(c,v.body||autoText(v,cat).body,x,y,w,hh,H<700?25:34,ink,500);
 if(g==='table'){
  const db=h.data(),key=v.type==='Tabla de goleo'?'scorers':'standings';
  let rows=v.type.startsWith('Calendario')?['3','5','4','2','1'].flatMap(id=>(db.categories?.[id]?.fixtures||[]).flatMap(s=>s.rows||[]).filter(r=>String(r[1])===String(v.round)).map(r=>({category:h.cats[id],kind:'fixtures',r}))):
   (db.categories?.[v.category]?.[key]||[]).flatMap(s=>s.rows||[]).filter(r=>!String(r[2]).includes('goles en temporada')).map((r,i)=>({kind:key,r,index:i+1}));
  const p=paginate(rows,v.format,k),page=Math.max(0,Math.min(p.pages.length-1,Number(v.tablePage)||0)),list=p.pages[page];canvas.dataset.pages=String(p.pages.length);canvas.dataset.page=String(page);
  if(k===3&&rows.length)box(c,'LÍDER · '+(rows[0].r[1]||rows[0].r[2]),60,top,960,80,38,accent,900);
  if(!list.length)box(c,'Sin información oficial publicada.',60,top+30,960,100,32,muted);
  for(let i=0;i<list.length;i++){const item=list[i],r=item.r,col=k===2?i%2:0,line=k===2?Math.floor(i/2):i,cw=k===2?470:960,x=60+col*490,y=top+p.reserve+line*p.rowHeight,rh=p.rowHeight-12;
   rect(c,x,y,cw,rh,light?(i%2?'#e3e9f0':'#fff'):k===1?'#203653':i%2?'#11254b':'#18335b',k===1?22:8);
   if(item.kind==='fixtures'){box(c,item.category+' · '+r[8]+' · '+r[7],x+14,y+8,cw-28,26,18,muted);box(c,r[2]+'  vs  '+r[6],x+14,y+36,cw-28,rh-40,24,ink,800)}
   else if(item.kind==='scorers'){box(c,String(item.index).padStart(2,'0'),x+14,y+18,45,36,24,accent);box(c,r[1],x+72,y+10,cw-230,36,25,ink);box(c,r[2],x+72,y+46,cw-230,26,18,muted);box(c,r[3]+' '+(Number(r[3])===1?'gol':'goles'),x+cw-142,y+22,126,40,25,ink,800,'right')}
   else {const im=await h.img(h.logo(r[1]));photo(c,im,x+48,y+12,48,48);box(c,item.index,x+10,y+23,32,34,22,accent);box(c,r[1],x+110,y+12,cw-(k===2?230:480),rh-22,30,ink);if(k!==2)box(c,'PJ '+r[2]+'   DG '+r[8],x+cw-345,y+23,170,40,23,muted);box(c,r[9]+' PTS',x+cw-155,y+23,139,40,24,ink,800,'right')}
  }
  box(c,'Página '+(page+1)+' de '+p.pages.length,60,H-85,960,30,20,muted,700,'right');
 }else if(g==='match'){
  const scored=/Resultado|Notificación de partido/.test(v.type),score=scored?(v.scoreHome!==''&&v.scoreHome!=null&&v.scoreAway!==''&&v.scoreAway!=null?v.scoreHome+' – '+v.scoreAway:'POR CONFIRMAR'):'VS',duelH=Math.min(space*.68,620);
  if(k===0){card(local,v.home||'EQUIPO LOCAL',60,top,370,duelH);card(away,v.away||'EQUIPO VISITANTE',650,top,370,duelH);box(c,score,420,top+duelH*.28,240,120,scored?56:80,accent,900,'center');details(top+duelH+20,Math.min(90,space-duelH-20))}
  if(k===1){c.fillStyle=light?'#214875':'#6b263f';c.beginPath();c.moveTo(0,top);c.lineTo(760,top);c.lineTo(330,bottom);c.lineTo(0,bottom);c.fill();card(local,v.home||'LOCAL',70,top,390,duelH*.77);card(away,v.away||'VISITANTE',620,top+space*.2,390,duelH*.77);box(c,score,400,top+space*.35,280,100,58,accent,900,'center');details(bottom-65,60)}
  if(k===2){rect(c,60,top,960,space,'#fff');rect(c,60,top,960,54,'#183960',0);box(c,'ENTRADA · '+v.type.toUpperCase(),80,top+12,920,36,24,'#fff');card(local,v.home||'LOCAL',100,top+70,350,duelH*.77);card(away,v.away||'VISITANTE',630,top+70,350,duelH*.77);box(c,score,440,top+duelH*.35,200,80,52,'#173c62',900,'center');details(bottom-64,56)}
  if(k===3){for(const [i,im,label]of [[0,local,v.home||'LOCAL'],[1,away,v.away||'VISITANTE']]){const yy=top+i*space*.34;rect(c,60,yy,960,space*.3,'#ffffff12');photo(c,im,86,yy+12,space*.26,space*.26);box(c,label,110+space*.26,yy+space*.08,850-space*.26,space*.18,44,ink,900)}box(c,score,60,top+space*.7,360,space*.22,60,accent,900);box(c,v.details||'Completa fecha y sede',450,top+space*.73,540,space*.2,28,muted)}
  if(k===4){rect(c,60,top,960,space*.65,'#ffffff10');photo(c,person||background,60,top,960,space*.65);card(local,v.home||'LOCAL',80,bottom-space*.32,300,space*.3);card(away,v.away||'VISITANTE',700,bottom-space*.32,300,space*.3);box(c,score,390,bottom-space*.25,300,80,60,accent,900,'center');box(c,v.details,390,bottom-space*.13,300,60,22,muted,600,'center')}
 }else if(g==='celebration'){
  if(k===0){trophy(c,540,top+space*.23,Math.min(220,space*.35));photo(c,local,420,top+space*.43,240,space*.28);box(c,v.person||v.home||v.type,60,bottom-space*.23,960,space*.18,48,accent,900,'center')}
  if(k===1){rect(c,60,top,960,space*.75,'#ffffff0b');photo(c,person||local,70,top+10,940,space*.72);photo(c,local,880,top+20,110,110);box(c,v.person||v.home||v.type,60,bottom-space*.2,960,space*.16,48,ink,900,'center')}
  if(k===2){photo(c,person||local,500,top,520,space*.82);box(c,'HONOR\nY GLORIA',60,top+20,410,space*.4,76,accent,900);box(c,v.person||v.home||v.type,60,top+space*.49,420,space*.32,42,ink,900)}
  if(k===3){rect(c,180,bottom-space*.3,720,space*.26,'#ddb657');rect(c,60,bottom-space*.22,120,space*.18,'#77879f');rect(c,900,bottom-space*.17,120,space*.13,'#a76942');photo(c,person||local,330,top,420,space*.58);box(c,v.person||v.home||v.type,200,bottom-space*.25,680,space*.17,42,'#081c37',900,'center')}
  if(k===4){rect(c,60,top,275,space,accent,0);photo(c,local,75,top+30,245,space*.38);photo(c,person,385,top+20,600,space*.53);box(c,v.person||v.home||v.type,385,bottom-space*.38,615,space*.3,60,ink,900)}
 }else{
  const im=person||background;
  if(k===0){rect(c,60,top,8,space,'#cf3042',0);message(100,top+20,900,space-40)}
  if(k===1){rect(c,60,top,960,space*.52,'#ffffff12');photo(c,im,70,top+10,940,space*.49);message(80,top+space*.57,920,space*.39)}
  if(k===2){photo(c,im,60,top,445,space);rect(c,530,top,490,space,'#ffffff0b');message(560,top+25,430,space-50)}
  if(k===3){rect(c,60,top,960,space,light?'#fff':'#113759');box(c,(v.person||v.home||'INFORMACIÓN\nDE LA LIGA').toUpperCase(),90,top+25,900,space*.35,72,accent,900);message(90,top+space*.43,900,space*.52)}
  if(k===4){rect(c,95,top,890,space,'#193e6b',36);photo(c,im||local,135,top+30,Math.min(240,space*.35),Math.min(240,space*.35));message(140,top+Math.min(280,space*.42),800,space-Math.min(310,space*.47))}
 }
 if(v.transmission||v.sponsor)box(c,[v.transmission&&'TRANSMITE: '+v.transmission,v.sponsor&&'PATROCINA: '+v.sponsor].filter(Boolean).join(' · '),60,H-58,960,22,16,muted);
 box(c,'LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS, GTO.',60,H-28,960,22,16,muted,700);c.restore();return true;
}
window.LJR_CONTENT_LAYOUTS={draw,variants,paginate,autoText,sizes,group};
})();
