// Deploy on a server runtime. GitHub Pages does not execute this endpoint.
import {timingSafeEqual} from 'node:crypto';
export const maxDuration=60;
export async function handleOcrRequest(request,env=process.env,fetcher=fetch){
  const origin=request.headers.get('origin'),allowed=env.REGISTRATION_ALLOWED_ORIGIN||'https://jairofrancog7-star.github.io';
  const headers={'Cache-Control':'no-store','Vary':'Origin','Content-Type':'application/json'};
  const reply=(body,status=200)=>Response.json(body,{status,headers});
  if(origin&&origin!==allowed)return reply({error:'Origen no permitido'},403);
  if(origin)headers['Access-Control-Allow-Origin']=allowed;
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type'}});
  const actual=Buffer.from(request.headers.get('authorization')||''),expected=Buffer.from('Bearer '+(env.REGISTRATION_ADMIN_TOKEN||''));
  if(!env.REGISTRATION_ADMIN_TOKEN||actual.length!==expected.length||!timingSafeEqual(actual,expected))return reply({error:'Acceso del administrador requerido'},401);
  if(!env.GOOGLE_VISION_API_KEY)return reply({ready:false,error:'Falta configurar Google Vision en el servidor'},503);
  if(request.method==='GET')return reply({ready:true,provider:'Google Cloud Vision',handwriting:true});
  if(request.method!=='POST')return reply({error:'Método no permitido'},405);
  const length=Number(request.headers.get('content-length')||0);if(length>4000000)return reply({error:'Imagen demasiado grande'},413);
  try{
    const raw=await request.text();if(raw.length>4000000)return reply({error:'Imagen demasiado grande'},413);
    const body=JSON.parse(raw),image=body.image;
    if(typeof image!=='string'||image.length<8||image.length>3900000||!/^[A-Za-z0-9+/]+={0,2}$/.test(image))return reply({error:'Imagen codificada no válida'},400);
    const signature=Buffer.from(image,'base64').subarray(0,12);
    const jpeg=signature[0]===255&&signature[1]===216&&signature[2]===255;
    const png=signature.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const webp=signature.toString('ascii',0,4)==='RIFF'&&signature.toString('ascii',8,12)==='WEBP';
    if(!jpeg&&!png&&!webp)return reply({error:'Usa una imagen JPG, PNG o WebP'},400);
    const provider=await fetcher('https://vision.googleapis.com/v1/images:annotate',{
      method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':env.GOOGLE_VISION_API_KEY},
      body:JSON.stringify({requests:[{image:{content:image},features:[{type:'DOCUMENT_TEXT_DETECTION'}],imageContext:{languageHints:['es']}}]}),signal:AbortSignal.timeout(30000)
    });
    if(!provider.ok)return reply({error:'El proveedor OCR no está disponible; comprueba su configuración'},502);
    const result=await provider.json(),page=result.responses?.[0];
    if(page?.error)return reply({error:'El proveedor no pudo interpretar esta imagen'},422);
    const text=page?.fullTextAnnotation?.text||page?.textAnnotations?.[0]?.description||'';
    return reply({text,provider:'Google Cloud Vision',reviewRequired:true});
  }catch(error){
    if(error instanceof SyntaxError)return reply({error:'Solicitud no válida'},400);
    console.error('registration-ocr failed:',error.name); // No names, CURPs, images, tokens or provider payloads in logs.
    return reply({error:'La lectura no se completó; intenta de nuevo'},502);
  }
}
export default {fetch(request){return handleOcrRequest(request)}};
