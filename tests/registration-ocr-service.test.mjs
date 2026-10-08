import test from 'node:test';
import assert from 'node:assert/strict';
import {handleOcrRequest} from '../api/registration-ocr.js';
const env={REGISTRATION_ADMIN_TOKEN:'test-admin-access',REGISTRATION_ALLOWED_ORIGIN:'https://jairofrancog7-star.github.io',GOOGLE_VISION_API_KEY:'test-key'};
const request=(method='GET',body,token=env.REGISTRATION_ADMIN_TOKEN)=>new Request('https://ocr.example/api/registration-ocr',{method,headers:{origin:env.REGISTRATION_ALLOWED_ORIGIN,authorization:'Bearer '+token,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('service rejects unauthorized requests before contacting OCR',async()=>{
  let calls=0;const response=await handleOcrRequest(request('POST',{image:'abcd'},'wrong'),env,async()=>{calls++});
  assert.equal(response.status,401);assert.equal(calls,0);
});
test('missing provider never reports connected',async()=>{
  const response=await handleOcrRequest(request(),{...env,GOOGLE_VISION_API_KEY:''});
  assert.equal(response.status,503);
});
test('handwriting uses document OCR and returns text without logging images',async()=>{
  let submitted;
  const fake=async(url,options)=>{submitted=JSON.parse(options.body);return Response.json({responses:[{fullTextAnnotation:{text:'JUAN PEREZ\nJOSE ROSAS'}}]})};
  const response=await handleOcrRequest(request('POST',{image:'/9j/AA=='}),env,fake);
  assert.equal(response.status,200);assert.equal((await response.json()).text,'JUAN PEREZ\nJOSE ROSAS');
  assert.equal(submitted.requests[0].features[0].type,'DOCUMENT_TEXT_DETECTION');
  assert.equal(response.headers.get('cache-control'),'no-store');
});
