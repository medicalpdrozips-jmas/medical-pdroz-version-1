import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.join(__dirname, 'migrations')

function createPool() {
  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  })
}

async function ensureMigrationsTable(client) {
  await client.query(`
    create table if not exists public.schema_migrations (
      id serial primary key,
      filename varchar(255) not null unique,
      applied_at timestamptz not null default now()
    )
  `)
}

async function getAppliedMigrations(client) {
  const result = await client.query('select filename from public.schema_migrations order by filename asc')
  return new Set(result.rows.map((row) => row.filename))
}

async function run() {
  if (!env.USE_DATABASE) {
    console.log('[db:migrate] USE_DATABASE=false. Skipping migrations and keeping mock fallback active.')
    return
  }

  if (!env.DATABASE_URL) {
    console.log('[db:migrate] DATABASE_URL is missing. Skipping migrations to avoid breaking mock fallback.')
    return
  }

  const pool = createPool()
  const client = await pool.connect()

  try {
    console.log('[db:migrate] Connected to PostgreSQL.')
    await ensureMigrationsTable(client)

    const appliedMigrations = await getAppliedMigrations(client)
    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      console.log('[db:migrate] No migration files found.')
      return
    }

    for (const file of files) {
      if (appliedMigrations.has(file)) {
        console.log(`[db:migrate] Skipping already applied migration: ${file}`)
        continue
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8')

      console.log(`[db:migrate] Applying ${file}...`)
      await client.query('begin')
      await client.query(sql)
      await client.query('insert into public.schema_migrations (filename) values ($1)', [file])
      await client.query('commit')
      console.log(`[db:migrate] Applied ${file}`)
    }

    console.log('[db:migrate] Migrations completed successfully.')
  } catch (error) {
    await client.query('rollback').catch(() => {})
    console.error(`[db:migrate] Migration failed: ${error.message}`)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end().catch(() => {})
  }
}

run().catch((error) => {
  console.error(`[db:migrate] Unexpected error: ${error.message}`)
  process.exitCode = 1
})
