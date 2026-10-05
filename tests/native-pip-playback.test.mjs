import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('Android PiP follows playing videos and stops when every player pauses or is removed',async()=>{
 const code=fs.readFileSync(new URL('../src/v560-stream-player-controls.js',import.meta.url),'utf8').split('const states=new WeakMap();')[0].replace(/^import[^\n]*\n/gm,'').replace(/^const nativePip[^\n]*\n/m,'').replace('export function','function');
 const calls=[],context=vm.createContext({Capacitor:{isNativePlatform:()=>true},nativePip:{arm:async value=>calls.push(value.enabled)},MutationObserver:class{observe(){}},document:{documentElement:{}}});vm.runInContext(code,context);
 const video=()=>({isConnected:true,paused:true,ended:false,events:{},addEventListener(type,handler){this.events[type]=handler}}),a=video(),b=video();context.a=a;context.b=b;
 vm.runInContext('trackNativePiP(a);trackNativePiP(b)',context);assert.deepEqual(calls,[]);
 a.paused=false;a.events.play();assert.deepEqual(calls,[true]);b.paused=false;b.events.play();a.paused=true;a.events.pause();assert.deepEqual(calls,[true],'second player keeps PiP armed');
 b.paused=true;b.events.pause();assert.deepEqual(calls,[true,false]);a.paused=false;a.events.play();a.isConnected=false;vm.runInContext('armPiP()',context);assert.deepEqual(calls,[true,false,true,false],'detached player cannot keep Android PiP armed');
});
