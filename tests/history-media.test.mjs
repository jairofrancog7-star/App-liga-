import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {historyPhotoHtml,largerHistoryPhotos} from '../src/history-media.js';

test('champion photos use larger copies of the same event, with local paths',()=>{
 const path='archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg';
 for(const prefix of ['./','/App-liga-/','https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/']){
  const html=historyPhotoHtml('<img src="'+prefix+'assets/history/'+path+'?v=old" alt="La Huerta">');
  assert.equal(html,'<img src="./assets/history/enhanced-v326/'+path+'?v=history-media-20261008" alt="La Huerta">');
 }
 for(const [path,size] of Object.entries(largerHistoryPhotos)){
  assert.ok(existsSync(new URL('../assets/history/enhanced-v326/'+path,import.meta.url)),path);
  assert.ok(size[0]>0&&size[1]>0,path);
 }
});
test('unknown photos, crests and embedded original photos are preserved',()=>{
 for(const html of ['<img src="./assets/history/not-in-archive.jpg">','<img src="./assets/history/team-logos/olimpicos-pozos-original.jpg">','<img src="data:image/webp;base64,unchanged">'])assert.equal(historyPhotoHtml(html),html);
});
