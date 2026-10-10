import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const base=read('src/v1310-admin-paleta-unificada.css');
const v1335=read('src/v1335-admin-app-colors.css');
const v1340=read('src/v1340-admin-mobile-visual-unified.css');
const studio=read('src/v1246-content-studio.css');
const html=read('index.html');

test('V1352: solo V1310 define los colores maestros, sin redefiniciones antiguas de V1335',()=>{
 for(const [token,color] of [
  ['bg','#071338'],['surface','#0a1b48'],['card','#0c2457'],
  ['input','#091a46'],['edge','#426bb0'],['muted','#b9cae7']
 ])assert.match(base,new RegExp('--ljr1310-'+token+':'+color+';'));
 assert.match(v1335,/--ljr-admin-night:var\(--ljr1310-bg,#071338\)/);
 assert.doesNotMatch(v1335,/--ljr1310-(?:bg|surface|card|input|edge|muted):#[0-9a-f]{6}/i);
 assert.doesNotMatch(v1335,/#1350a0|#174294|#0e2674|#060d58/i);
 assert.equal(base,read('demo/src/v1310-admin-paleta-unificada.css'));
});
test('V1352: V1340 mantiene geometría Android y respeta fondos maestros de Administración',()=>{
 const admin=v1340.split('/* Subir CSV')[0];
 assert.match(admin,/--ljr-v1340-night/);
 assert.match(admin,/background:linear-gradient\(180deg,var\(--ljr1310-surface,#0a1b48\)/);
 assert.match(admin,/border-color:var\(--ljr1310-edge,#426bb0\)/);
 assert.match(admin,/min-height:46px!important/);
 assert.match(admin,/width:21px!important;height:21px!important/);
 assert.doesNotMatch(admin,/#133d9c|#101f75|#132b7c|#183d94/i);
 for(const module of ['v1212-csv-modal','v1126-delegate-modal','v1125-officials-modal','v1111-incidents-modal']){
  assert.match(v1340,new RegExp('\\.'+module));
 }
 assert.match(v1340,/body\[data-app-route="historyLog"\]/);
 assert.match(v1340,/body\[data-app-route="publicationCenter"\]/);
});
test('V1352: el estudio de contenido comparte la paleta sin modificar elementos interactivos',()=>{
 assert.match(studio,/V1352 · Estudio de publicaciones/);
 assert.match(studio,/section\.ljr-content-studio/);
 assert.match(studio,/background:#071338!important/);
 assert.match(studio,/background:#091a46!important/);
 assert.match(studio,/\.cms-design-presets button/);
 assert.match(studio,/\.ljr-layout-gallery button/);
 assert.doesNotMatch(studio,/<script|javascript:/i);
});
test('V1352: CSS en la web refrescado sin añadir scripts ni controles',()=>{
 for(const n of ['v1310-admin-paleta-unificada','v1335-admin-app-colors','v1340-admin-mobile-visual-unified','v1246-content-studio']){
  const match=html.match(new RegExp('src/'+n+'\\.css\\?v=20261010-v1352-unified-navy','g'))||[];
  assert.equal(match.length,1,n+' must load once');
 }
 const refs=['v1310-admin-paleta-unificada','v1335-admin-app-colors','v1340-admin-mobile-visual-unified','v1246-content-studio'];
 const positions=refs.map(s=>html.indexOf('src/'+s+'.css'));
 assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
});
