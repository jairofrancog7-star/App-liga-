import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const backend=readFileSync(new URL('../server/notifications/index.mjs',import.meta.url),'utf8');
const client=readFileSync(new URL('../src/v1082-push-notifications.js',import.meta.url),'utf8');
const demo=readFileSync(new URL('../demo/src/v1082-push-notifications.js',import.meta.url),'utf8');
const sw=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
const start=backend.indexOf("const recentSelfTests=new Map()");
const end=backend.indexOf("async function unsubscribe(req,res)",start);
assert.ok(start!==-1&&end>start);
const fragment=backend.slice(start,end);

function harness({registered=true,vapidReady=true}={}){
 let handler=null;
 const sent=[],queries=[],timers=[];
 const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/device123',keys:{auth:'private-auth-example',p256dh:'device-public-key'}};
 const entry=registered?{subscription:structuredClone(subscription)}:null;
 const scope=new Function('app','throttle','vapidReady','isPush','pool','secretEquals','hash','setTimeout','webpush','apiError',
 fragment+';return {scheduled:recentSelfTests};')(
  {post(path,_limit,fn){if(path==='/api/push/self-test')handler=fn}},
  ()=>{},vapidReady,
  s=>Boolean(s?.endpoint?.startsWith('https://')&&s.keys?.auth&&s.keys?.p256dh),
  {query:async(sql,params)=>{queries.push({sql,params});return {rows:sql.startsWith('SELECT')&&entry?[entry]:[]}}},
  (a,b)=>typeof a==='string'&&typeof b==='string'&&a===b,
  v=>v,
  (fn,delay)=>{timers.push({fn,delay});return {unref(){}};},
  {sendNotification:async(sub,payload,config)=>{sent.push({sub,payload:JSON.parse(payload),config})}},
  (e,res)=>res.status(500).json({error:e.message})
 );
 assert.ok(handler);
 async function call(sub=subscription){
  const response={code:200,body:null,status(n){this.code=n;return this},json(x){this.body=x;return this}};
  await handler({body:{subscription:sub}},response);
  return response;
 }
 return {subscription,call,sent,queries,timers,scope};
}
test('Only a pre-registered phone with matching keys can schedule a private test',async()=>{
 const x=harness();
 const response=await x.call();
 assert.equal(response.code,202);
 assert.equal(response.body.scheduled,true);
 assert.equal(response.body.delaySeconds,15);
 assert.equal(x.sent.length,0);
 assert.equal(x.timers.length,1);
 assert.equal(x.timers[0].delay,15000);
 await x.timers[0].fn();
 assert.equal(x.sent.length,1);
 assert.match(x.sent[0].payload.title,/PRUEBA PERSONAL/);
 assert.equal(x.sent[0].payload.route,'notifications');
 assert.equal(x.sent[0].sub.endpoint,x.subscription.endpoint);
 assert.equal(x.queries.some(q=>q.sql.includes('ljr_scheduled_notices')),false);
});
test('An unknown or wrong-key subscription cannot trigger test delivery',async()=>{
 const unknown=harness({registered:false});
 assert.equal((await unknown.call()).code,404);
 assert.equal(unknown.timers.length,0);
 const mismatch=harness();
 assert.equal((await mismatch.call({...mismatch.subscription,keys:{auth:'wrong',p256dh:'device-public-key'}})).code,404);
 assert.equal(mismatch.timers.length,0);
});
test('Per-device cooldown prevents repeated push test requests',async()=>{
 const x=harness();
 assert.equal((await x.call()).code,202);
 assert.equal((await x.call()).code,429);
 assert.equal(x.timers.length,1);
});
test('The testing endpoint does not run without VAPID',async()=>{
 const x=harness({vapidReady:false});
 assert.equal((await x.call()).code,503);
 assert.equal(x.timers.length,0);
});
test('Only direct user click triggers self-test; no initial permission prompt',()=>{
 assert.equal(client,demo);
 assert.ok(client.includes("data-v1082-self-test"));
 assert.ok(client.includes("async function selfTest(root){"));
 assert.ok(client.includes("button.hasAttribute('data-v1082-self-test')"));
 assert.ok(client.includes("Notification.permission!=='granted'"));
 assert.ok(client.includes("server('self-test'"));
 assert.ok(sw.includes("self.addEventListener('push'"));
 assert.doesNotThrow(()=>new Function(client));
});
test('Test requests validate both browser keys and use a targeted DB lookup',()=>{
 assert.match(fragment,/secretEquals\(registered\.keys\?\.auth,subscription\.keys\?\.auth\)/);
 assert.match(fragment,/secretEquals\(registered\.keys\?\.p256dh,subscription\.keys\?\.p256dh\)/);
 assert.match(fragment,/SELECT subscription FROM ljr_push_subscriptions WHERE endpoint=\$1 LIMIT 1/);
 assert.match(fragment,/SELF_TEST_COOLDOWN_MS=300000/);
 assert.doesNotMatch(fragment,/sendNotification\([^,]+,\s*.*oficial/i);
});