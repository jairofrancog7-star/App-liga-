/* Ejecutar migración inicial de avisos en el servidor privado. Nunca imprime secretos.
   PostgreSQL advisory lock protege la primera instalación simultánea de la Liga. */
import pg from 'pg';
import {readFile} from 'node:fs/promises';
const url=process.env.DATABASE_URL;
if(!url)throw new Error('DATABASE_URL no configurada. Prepara PostgreSQL antes de desplegar avisos.');
const pool=new pg.Pool({connectionString:url,max:1,connectionTimeoutMillis:8000,
  ssl:url.includes('sslmode=require')?{rejectUnauthorized:true}:undefined});
const client=await pool.connect();
try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock($1)',[8117342026]);
  await client.query(`CREATE TABLE IF NOT EXISTS ljr_schema_migrations (
    name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const v='notifications-schema-v1150'; // migración idempotente: roles, filtros y archivo privado de juntas
  const done=await client.query('SELECT name FROM ljr_schema_migrations WHERE name=$1',[v]);
  if(!done.rowCount){
    const ddl=await readFile(new URL('./schema.sql',import.meta.url),'utf8');
    await client.query(ddl);
    await client.query('INSERT INTO ljr_schema_migrations(name) VALUES($1)',[v]);
  }
  await client.query('COMMIT');
  console.log('Esquema de avisos verificado.');
}catch(error){
  await client.query('ROLLBACK').catch(()=>{});
  console.error('Error de migración de avisos:',error?.code||error?.name||'unknown');
  process.exitCode=1;
}finally{client.release();await pool.end()}
