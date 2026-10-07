import {designMessages,readDraft} from './design-ai-core.mjs?v=20261007-v880';
let writer;
self.onmessage=async({data})=>{
 if(data?.type!=='generate')return;
 try {
  if(!writer){
   self.postMessage({type:'progress',text:'Descargando el modelo de redacción… La primera carga requiere conexión.'});
   const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
   env.allowLocalModels=false;
   env.backends.onnx.wasm.numThreads=1;
   writer=await pipeline('text-generation','onnx-community/Qwen2.5-0.5B-Instruct',{dtype:'q4',device:'wasm',progress_callback:p=>{
    if(p.status==='progress'&&Number.isFinite(p.progress))self.postMessage({type:'progress',text:'Descargando modelo · '+Math.round(p.progress)+' %'});
   }});
  }
  self.postMessage({type:'progress',text:'Redactando en este dispositivo…'});
  const result=await writer(designMessages(data.values),{max_new_tokens:230,do_sample:false});
  self.postMessage({type:'result',draft:readDraft(result)});
 }catch(error){self.postMessage({type:'error',text:error.message||'No se pudo iniciar la IA local. Puedes escribir el texto y generar el cartel.'})}
};
