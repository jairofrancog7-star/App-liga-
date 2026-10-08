import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../src/v599-player-face-center-global.js',import.meta.url),'utf8');
const cropCode=source.slice(source.indexOf('function heroCrop('),source.indexOf('function prepareHeroFallback('));
const scope={};runInNewContext(cropCode,scope);

test('portrait hero includes the complete face with hair and chin margin at every aspect ratio',()=>{
  for(const [w,h]of [[380,214],[640,360],[240,240],[200,320]]){
    for(const box of [{x:30,y:200,width:410,height:500},{x:270,y:650,width:330,height:400},{x:0,y:0,width:180,height:220}]){
      const crop=scope.heroCrop({},w,h,{box});
      assert.ok(crop.sx<=box.x-box.width*.25,'left ear fits');
      assert.ok(crop.sx+crop.sw>=box.x+box.width*1.25,'right ear fits');
      assert.ok(crop.sy<=box.y-box.height*.35,'hair and forehead fit');
      assert.ok(crop.sy+crop.sh>=box.y+box.height*1.25,'mouth and chin fit');
      assert.ok(Math.abs(crop.sw/crop.sh-w/h)<1e-9,'photograph keeps its proportions');
    }
  }
});
test('no detected face means full original photograph rather than a guessed forehead crop',()=>{
  assert.equal(scope.heroCrop({},380,214,null),null);
  assert.equal(scope.heroCrop({},380,214,{box:{x:0,y:0,width:0,height:0}}),null);
  const fallback=source.slice(source.indexOf('function prepareHeroFallback('),source.indexOf('function applyHeroCrop('));
  assert.match(fallback,/'object-fit':'contain'/);
  assert.doesNotMatch(fallback,/\.src\s*=/,'display adjustment never replaces the original photograph');
});
