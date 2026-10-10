import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDelimited,detectDelimiter,guessMapping,analyzeCsv,csvExport} from '../src/v1212-csv-import-pro.js';

test('CSV: comillas, comas internas, saltos y BOM',()=>{
 const csv='\uFEFFnombre,categoria\n"Club, Unión",Primera\n"Equipo\nNuevo",Segunda\n';
 const p=parseDelimited(csv,detectDelimiter(csv));
 assert.equal(p.headers[0],'nombre');
 assert.deepEqual(p.rows[0],['Club, Unión','Primera']);
 assert.equal(p.rows[1][0],'Equipo\nNuevo');
});
test('CSV: ; y TSV detectados y columnas asignadas',()=>{
 const csv='nombre;equipo;numero\nJuan;Manchester;12';
 assert.equal(detectDelimiter(csv),';');
 const p=parseDelimited(csv,';');
 assert.equal(guessMapping(p.headers,'jugadores').numero,2);
 assert.equal(detectDelimiter('nombre\tcategoria\nA\tPrimera'),'\t');
});
test('CSV: detecta duplicados, goles inválidos y rivales iguales',()=>{
 const csv='fecha,local,visitante,goles_local,goles_visitante\n2026-10-11,A,B,2,1\n2026-10-11,A,B,1,0\n2026-10-11,A,A,abc,2';
 const p=parseDelimited(csv);
 const a=analyzeCsv(p,'resultados',guessMapping(p.headers,'resultados'));
 assert.equal(a.valid.length,1);
 assert.equal(a.invalid.length,2);
 assert.match(a.invalid[0].errors.join(' '),/duplicado/);
 assert.match(a.invalid[1].errors.join(' '),/iguales/);
 assert.match(a.invalid[1].errors.join(' '),/inválidos/);
});
test('CSV: protege exportación contra fórmulas y conserva las comillas',()=>{
 const csv=csvExport([['texto'],['=HYPERLINK("https://ejemplo")'],['Hola "liga"']]);
 assert.ok(csv.startsWith('\uFEFF'));
 assert.ok(csv.includes("'\u003dHYPERLINK"));
 assert.ok(csv.includes('Hola ""liga""'));
});
test('CSV: no autoriza escritura oficial y exige campos esenciales',()=>{
 const p=parseDelimited('otro,categoria\nJuve,Primera');
 const a=analyzeCsv(p,'equipos',guessMapping(p.headers,'equipos'));
 assert.deepEqual(a.missing,['Nombre del equipo']);
 assert.equal(a.valid.length,0);
});
