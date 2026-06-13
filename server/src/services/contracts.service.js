import { query } from '../db/pool.js'
import { contracts, patients } from './mockData.js'
import {
  clone,
  formatCurrencyMillions,
  formatPercent,
  normalizeText,
  resolveWithFallback,
} from './dbFallback.js'

function mapContractRow(row) {
  return {
    id: row.id,
    eps: row.eps,
    codigo: row.code,
    nombre: row.name,
    modalidad: row.modality,
    valorContrato: formatCurrencyMillions(row.contract_value),
    consumoActual: formatCurrencyMillions(row.current_consumption),
    proyeccionCierre: formatCurrencyMillions(row.closing_projection),
    margenEstimado: formatPercent(row.estimated_margin),
    riesgo: row.risk,
    poblacion: row.population,
    desviacion: formatPercent(row.deviation, 1, true),
    pacientesTop: row.top_patients ?? [],
    medicamentosTop: row.top_medications ?? [],
    alertas: row.alerts ?? [],
  }
}

function mapPatientRow(row) {
  return {
    id: row.id,
    tipoDocumento: row.document_type,
    numeroDocumento: row.document_number,
    nombres: row.first_name,
    apellidos: row.last_name,
    fechaNacimiento: row.birth_date,
    edad: row.age,
    sexo: row.sex,
    telefono: row.phone,
    direccion: row.address,
    ciudad: row.city,
    eps: row.eps,
    sede: row.site,
    diagnostico: row.primary_diagnosis,
    estado: row.status,
    contratoId: row.contract_id,
    programa: row.program,
    riesgoClinico: row.risk_clinical,
    riesgoFinanciero: row.risk_financial,
    costoAcumulado: row.accumulated_cost_display,
    proximaAccionIa: row.next_ai_action,
  }
}

async function getContractsFromDatabase(filters = {}) {
  const conditions = []
  const params = []

  if (filters.risk) {
    params.push(filters.risk)
    conditions.push(`lower(c.risk) = lower($${params.length})`)
  }

  if (filters.eps) {
    params.push(`%${filters.eps}%`)
    conditions.push(`c.eps ilike $${params.length}`)
  }

  const whereClause = conditions.length ? `where ${conditions.join(' and ')}` : ''
  const result = await query(`
    select
      c.id,
      c.eps,
      c.code,
      c.name,
      c.modality,
      c.contract_value,
      c.current_consumption,
      c.closing_projection,
      c.estimated_margin,
      c.risk,
      c.population,
      c.deviation,
      c.top_patients,
      c.top_medications,
      c.alerts
    from crh.contracts_pgp c
    ${whereClause}
    order by c.name
  `, params)

  return result.rows.map(mapContractRow)
}

async function getContractByIdFromDatabase(contractId) {
  const result = await query(`
    select
      c.id,
      c.eps,
      c.code,
      c.name,
      c.modality,
      c.contract_value,
      c.current_consumption,
      c.closing_projection,
      c.estimated_margin,
      c.risk,
      c.population,
      c.deviation,
      c.top_patients,
      c.top_medications,
      c.alerts
    from crh.contracts_pgp c
    where c.id = $1
    limit 1
  `, [contractId])

  return result.rows[0] ? mapContractRow(result.rows[0]) : null
}

async function getContractPatientsFromDatabase(contractId) {
  const existsResult = await query('select id from crh.contracts_pgp where id = $1 limit 1', [contractId])

  if (!existsResult.rows[0]) {
    return null
  }

  const result = await query(`
    select
      p.id,
      p.document_type,
      p.document_number,
      p.first_name,
      p.last_name,
      p.birth_date,
      p.age,
      p.sex,
      p.phone,
      p.address,
      p.city,
      p.eps,
      p.site,
      p.primary_diagnosis,
      p.status,
      p.contract_id,
      p.program,
      p.risk_clinical,
      p.risk_financial,
      p.accumulated_cost_display,
      p.next_ai_action
    from crh.patients p
    where p.contract_id = $1
    order by p.first_name, p.last_name
  `, [contractId])

  return result.rows.map(mapPatientRow)
}

export async function getContracts(filters = {}) {
  return resolveWithFallback(
    () => getContractsFromDatabase(filters),
    () => clone(contracts.filter((contract) => {
      const matchesRisk = filters.risk ? normalizeText(contract.riesgo) === normalizeText(filters.risk) : true
      const matchesEps = filters.eps ? normalizeText(contract.eps).includes(normalizeText(filters.eps)) : true

      return matchesRisk && matchesEps
    })),
  )
}

export async function getContractById(contractId) {
  return resolveWithFallback(
    () => getContractByIdFromDatabase(contractId),
    () => {
      const contract = contracts.find((item) => item.id === contractId)
      return contract ? clone(contract) : null
    },
  )
}

export async function getContractPatients(contractId) {
  return resolveWithFallback(
    () => getContractPatientsFromDatabase(contractId),
    () => {
      const contract = contracts.find((item) => item.id === contractId)

      if (!contract) return null

      return clone(patients.filter((item) => item.contratoId === contractId))
    },
  )
}
