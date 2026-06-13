import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg

function createPool() {
  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  })
}

async function run() {
  if (!env.USE_DATABASE) {
    console.log('[db:check] USE_DATABASE=false. PostgreSQL is disabled and mock fallback remains active.')
    return
  }

  if (!env.DATABASE_URL) {
    console.log('[db:check] DATABASE_URL is missing. PostgreSQL check skipped and mock fallback remains active.')
    return
  }

  const pool = createPool()
  const client = await pool.connect()

  try {
    console.log('[db:check] Connected to PostgreSQL.')

    const versionResult = await client.query('select version() as version')
    console.log(`[db:check] PostgreSQL version: ${versionResult.rows[0]?.version ?? 'unknown'}`)

    const tablesResult = await client.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'crh'
        and table_name = any($1::text[])
      order by table_name asc
    `, [[
      'patients',
      'contracts_pgp',
      'clinical_histories',
      'crh_assist_rules',
    ]])

    const presentTables = new Set(tablesResult.rows.map((row) => row.table_name))
    const expectedTables = ['patients', 'contracts_pgp', 'clinical_histories', 'crh_assist_rules']

    for (const tableName of expectedTables) {
      console.log(`[db:check] Table ${tableName}: ${presentTables.has(tableName) ? 'OK' : 'MISSING'}`)
    }

    const countsResult = await client.query(`
      select
        (select count(*) from crh.patients) as patients_count,
        (select count(*) from crh.contracts_pgp) as contracts_count,
        (select count(*) from crh.crh_assist_rules) as rules_count
    `)

    const counts = countsResult.rows[0] ?? {}
    console.log(`[db:check] Patients: ${counts.patients_count ?? 0}`)
    console.log(`[db:check] Contracts: ${counts.contracts_count ?? 0}`)
    console.log(`[db:check] Rules: ${counts.rules_count ?? 0}`)
  } catch (error) {
    console.error(`[db:check] PostgreSQL check failed: ${error.message}`)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end().catch(() => {})
  }
}

run().catch((error) => {
  console.error(`[db:check] Unexpected error: ${error.message}`)
  process.exitCode = 1
})
