import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const program=fs.readFileSync(new URL('../src/v1221-notification-ai-local.js',import.meta.url),'utf8');
const styles=fs.readFileSync(new URL('../src/v1221-notification-ai-local.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

function engine(){
  const values=new Map();
  const window={};
  const document={readyState:'loading',addEventListener(){}};
  const localStorage={
    getItem(k){return values.get(k)??null;},
    setItem(k,v){values.set(k,v);}
  };
  vm.runInNewContext(program,{window,document,localStorage},{timeout:1000});
  return {ai:window.LJR_V1221_LOCAL_AI,values};
}

test('The offline classifier prioritizes emergencies over historical galleries',()=>{
  const {ai}=engine();
  const urgent=ai.classify('Partido suspendido y cambio urgente de cancha y horario');
  const ordinary=ai.classify('Galería de fotografías del archivo histórico');
  assert.ok(urgent.confidence>ordinary.confidence);
  assert.equal(urgent.important,true);
  assert.equal(ordinary.important,false);
});

test('The ranking keeps the chosen official category and relevant team',()=>{
  const {ai}=engine();
  const profile={cat:'1',team:'Boavista'};
  const result=ai.rank([
    {id:'urgent',category:'Veteranos 50+',title:'Se suspende el partido de Boavista y cambia la cancha'},
    {id:'news',category:'Todas',title:'Galería histórica de la Liga'},
    {id:'invalid',category:'Juveniles',title:'Partido suspendido'}
  ],profile);
  assert.equal(result.length,2);
  assert.equal(result[0].id,'urgent');
});

test('Suggested filters are only written to local storage on direct user action',()=>{
  const {ai,values}=engine();
  const profile={cat:'2',team:'América'};
  assert.equal(values.has('lj-store-v3'),false);
  const suggested=ai.recommended(profile);
  assert.equal(suggested.prefs.scheduleChanges,true);
  assert.equal(ai.applyRecommendation(profile),true);
  const settings=JSON.parse(values.get('lj-store-v3'));
  assert.equal(settings.notifications.venueChanges,true);
});

test('Actual UI is linked once and shares the global blue color variables',()=>{
  assert.equal(html.split('src/v1221-notification-ai-local.js?').length,2);
  assert.equal(html.split('src/v1221-notification-ai-local.css?').length,2);
  assert.ok(styles.includes('var(--v46-bg,#05045f)'));
  assert.ok(styles.includes('var(--v46-bg2,#090879)'));
});

test('No external AI API and no simulated official notices',()=>{
  assert.equal(program.includes('https://api.openai.com'),false);
  assert.equal(program.includes('transformers.js'),false);
  assert.ok(program.includes("const FEED='./data/active-notices.json'")||
            program.includes("FEED='./data/active-notices.json'"));
  assert.ok(program.includes('No se generaron avisos de ejemplo'));
});

test('Numeric official categories, unpublished drafts, future notices and stable IDs',()=>{
  const {ai}=engine();
  const future='2999-01-01T12:00:00';
  const rows=[
    {title:'Boavista partido suspendido',category:'1'},
    {title:'Recuerdo del campeonato',category:'Todas'},
    {title:'Partido futuro',category:'1',publishAt:future},
    {title:'Aviso interno',category:'1',published:false},
    {title:'Partido Veteranos 35+',category:'2'}
  ];
  const ranked=ai.rank(rows,{cat:'1',team:'Boavista'});
  assert.equal(ranked.length,2);
  assert.ok(ranked.every(x=>x.id.startsWith('local-feed-')));
  assert.ok(ranked.some(x=>x.title.includes('Boavista')));
  assert.equal(ranked.filter(x=>x.title==='Partido futuro').length,0);
  assert.deepEqual(
    Array.from(ai.rank(rows,{cat:'1'}).map(x=>x.id).sort()),
    Array.from(ai.rank([...rows].reverse(),{cat:'1'}).map(x=>x.id).sort())
  );
});

test('Reset-learning control and Push selector integration are included',()=>{
  const account=fs.readFileSync(new URL('../src/v105-green-app-bottom.js',import.meta.url),'utf8');
  const push=fs.readFileSync(new URL('../src/v1082-push-notifications.js',import.meta.url),'utf8');
  assert.ok(program.includes('Borrar aprendizaje local'));
  assert.ok(program.includes('saveOptions({feedback:[]})'));
  assert.ok(account.includes('syncPushSelection'));
  assert.ok(push.includes('syncSelection(host,profile={})'));
  assert.ok(styles.includes('.v1221-ai-reset'));
});
