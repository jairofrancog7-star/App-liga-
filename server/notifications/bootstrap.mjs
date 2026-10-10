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
  const c='cedulas-schema-v1181';
  const installed=await client.query('SELECT name FROM ljr_schema_migrations WHERE name=$1',[c]);
  if(!installed.rowCount){
    await client.query(await readFile(new URL('./cedula-schema.sql',import.meta.url),'utf8'));
    await client.query('INSERT INTO ljr_schema_migrations(name) VALUES($1)',[c]);
  }
  const principalsMigration='co-principals-v1208';
  const principalsDone=await client.query('SELECT name FROM ljr_schema_migrations WHERE name=$1',[principalsMigration]);
  if(!principalsDone.rowCount){
    await client.query(await readFile(new URL('./principals-schema.sql',import.meta.url),'utf8'));
    await client.query('INSERT INTO ljr_schema_migrations(name) VALUES($1)',[principalsMigration]);
  }
  const approvalMigration='notices-explicit-approval-v20261010';
  const approvalInstalled=await client.query('SELECT name FROM ljr_schema_migrations WHERE name=$1',[approvalMigration]);
  if(!approvalInstalled.rowCount){
    await client.query(await readFile(new URL('./approval-schema.sql',import.meta.url),'utf8'));
    await client.query('INSERT INTO ljr_schema_migrations(name) VALUES($1)',[approvalMigration]);
  }
  // V1224: cargo Delegado (solo avisos) y Árbitro (cédulas). Una sola vez,
  // dentro de esta misma transacción/advisory lock; nunca asigna cuentas.
  const rolesMigration='admin-roles-delegado-arbitro-v1224';
  const rolesDone=await client.query('SELECT name FROM ljr_schema_migrations WHERE name=$1',[rolesMigration]);
  if(!rolesDone.rowCount){
    const rolesDDL=await readFile(new URL('./migrations/20261010-delegado-arbitro-roles.sql',import.meta.url),'utf8');
    await client.query(rolesDDL);
    await client.query('INSERT INTO ljr_schema_migrations(name) VALUES($1)',[rolesMigration]);
  }
  await client.query('COMMIT');
  console.log('Esquema de avisos verificado.');
}catch(error){
  await client.query('ROLLBACK').catch(()=>{});
  console.error('Error de migración de avisos:',error?.code||error?.name||'unknown');
  process.exitCode=1;
}finally{client.release();await pool.end()}
