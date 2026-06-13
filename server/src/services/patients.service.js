import { query } from '../db/pool.js'
import { clinicalContexts, contracts, patients } from './mockData.js'
import {
  clone,
  formatCurrencyMillions,
  normalizeText,
  resolveWithFallback,
} from './dbFallback.js'

function filterByQuery(rows, filters = {}) {
  return rows.filter((patient) => {
    const matchesContract = filters.contractId ? patient.contratoId === filters.contractId : true
    const matchesStatus = filters.status ? normalizeText(patient.estado) === normalizeText(filters.status) : true
    const matchesSearch = filters.search
      ? normalizeText(`${patient.nombres} ${patient.apellidos} ${patient.numeroDocumento}`).includes(normalizeText(filters.search))
      : true

    return matchesContract && matchesStatus && matchesSearch
  })
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
    margenEstimado: `${String(row.estimated_margin ?? 0).replace('.', ',')}%`,
    riesgo: row.risk,
    poblacion: row.population,
    desviacion: `${row.deviation > 0 ? '+' : ''}${String(row.deviation ?? 0).replace('.', ',')}%`,
    pacientesTop: row.top_patients ?? [],
    medicamentosTop: row.top_medications ?? [],
    alertas: row.alerts ?? [],
  }
}

function buildMockPatientClinicalContext(patientId) {
  const patient = patients.find((item) => item.id === patientId)

  if (!patient) return null

  const context = clinicalContexts[patientId] ?? {}
  const contract = contracts.find((item) => item.id === patient.contratoId)

  return clone({
    patient,
    profile: {
      patientId,
      contratoId: patient.contratoId,
      categoriaRiesgo: patient.id === 'pac-001' ? 'Alto' : 'Medio',
    },
    contract,
    clinicalRecord: {
      patientId,
      diagnosticoCie10: patient.diagnostico,
      planManejo: 'Plan demo para API skeleton.',
    },
    diagnoses: context.diagnoses ?? [],
    medications: context.medications ?? [],
    history: context.history ?? {},
    consumptions: context.consumptions ?? {},
  })
}

async function getPatientsFromDatabase(filters = {}) {
  const conditions = []
  const params = []

  if (filters.contractId) {
    params.push(filters.contractId)
    conditions.push(`p.contract_id = $${params.length}`)
  }

  if (filters.status) {
    params.push(filters.status)
    conditions.push(`lower(p.status) = lower($${params.length})`)
  }

  if (filters.search) {
    params.push(`%${filters.search}%`)
    conditions.push(`concat_ws(' ', p.first_name, p.last_name, p.document_number) ilike $${params.length}`)
  }

  const whereClause = conditions.length ? `where ${conditions.join(' and ')}` : ''
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
    ${whereClause}
    order by p.first_name, p.last_name
  `, params)

  return result.rows.map(mapPatientRow)
}

async function getPatientByIdFromDatabase(patientId) {
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
    where p.id = $1
    limit 1
  `, [patientId])

  return result.rows[0] ? mapPatientRow(result.rows[0]) : null
}

async function getPatientClinicalContextFromDatabase(patientId) {
  const [patientResult, contractResult, historyResult, diagnosesResult, medicationsResult, consumptionsResult] = await Promise.all([
    query(`
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
      where p.id = $1
      limit 1
    `, [patientId]),
    query(`
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
      inner join crh.patients p on p.contract_id = c.id
      where p.id = $1
      limit 1
    `, [patientId]),
    query(`
      select
        h.patient_id,
        h.anamnesis,
        h.background,
        h.vital_signs,
        h.cie10_diagnosis,
        h.care_plan,
        h.orders,
        h.last_control_date,
        h.completeness_ratio,
        h.adherence_risk,
        h.high_risk_diagnosis
      from crh.clinical_histories h
      where h.patient_id = $1
      order by h.updated_at desc
      limit 1
    `, [patientId]),
    query(`
      select d.id, d.description
      from crh.diagnoses d
      where d.patient_id = $1
      order by d.created_at asc
    `, [patientId]),
    query(`
      select
        m.id,
        m.name,
        coalesce(pr.delivery_status, 'Activo') as status,
        m.cost_type,
        m.monthly_cost
      from crh.prescriptions pr
      inner join crh.medications m on m.id = pr.medication_id
      where pr.patient_id = $1
      order by pr.created_at asc
    `, [patientId]),
    query(`
      select
        c.accumulated_cost,
        c.monthly_cost,
        c.expected_monthly_cost,
        c.current_cost,
        c.cost_percentile,
        c.potential_avoidable_event
      from crh.consumptions c
      where c.patient_id = $1
      order by c.period desc
      limit 1
    `, [patientId]),
  ])

  if (!patientResult.rows[0]) {
    return null
  }

  const patient = mapPatientRow(patientResult.rows[0])
  const historyRow = historyResult.rows[0]
  const contractRow = contractResult.rows[0]
  const consumptionsRow = consumptionsResult.rows[0]
  const diagnoses = diagnosesResult.rows.map((item) => item.description)
  const medications = medicationsResult.rows.map((item) => ({
    id: item.id,
    nombre: item.name,
    estado: item.status,
    tipoCosto: item.cost_type,
    costo: formatCurrencyMillions(item.monthly_cost),
  }))

  return {
    patient,
    profile: {
      patientId,
      contratoId: patient.contratoId,
      categoriaRiesgo: patient.riesgoClinico ?? 'Medio',
      eps: patient.eps,
      contratoNombre: contractRow?.name,
      riesgoClinico: patient.riesgoClinico ?? 'Medio',
      riesgoFinanciero: patient.riesgoFinanciero ?? 'Medio',
      costoAcumulado: patient.costoAcumulado ?? formatCurrencyMillions(consumptionsRow?.accumulated_cost),
      costoMes: formatCurrencyMillions(consumptionsRow?.monthly_cost),
      diagnosticosPrincipales: diagnoses,
      medicamentosActivos: medications,
      ultimasAtenciones: [],
    },
    contract: contractRow ? mapContractRow(contractRow) : null,
    clinicalRecord: historyRow ? {
      patientId,
      anamnesis: historyRow.anamnesis,
      antecedentes: historyRow.background,
      signosVitales: historyRow.vital_signs ?? [],
      diagnosticoCie10: historyRow.cie10_diagnosis,
      planManejo: historyRow.care_plan,
      ordenes: historyRow.orders ?? [],
    } : {
      patientId,
      diagnosticoCie10: patient.diagnostico,
      planManejo: 'Plan demo desde PostgreSQL.',
    },
    diagnoses,
    medications,
    history: historyRow ? {
      lastControlDate: historyRow.last_control_date,
      completenessRatio: Number(historyRow.completeness_ratio ?? 0),
      adherenceRisk: historyRow.adherence_risk,
      highRiskDiagnosis: historyRow.high_risk_diagnosis,
    } : {},
    consumptions: consumptionsRow ? {
      accumulatedCost: formatCurrencyMillions(consumptionsRow.accumulated_cost),
      monthlyCost: formatCurrencyMillions(consumptionsRow.monthly_cost),
      expectedMonthlyCost: formatCurrencyMillions(consumptionsRow.expected_monthly_cost),
      currentCost: formatCurrencyMillions(consumptionsRow.current_cost),
      costPercentile: consumptionsRow.cost_percentile,
      potentialAvoidableEvent: consumptionsRow.potential_avoidable_event,
    } : {},
  }
}

export async function getPatients(filters) {
  return resolveWithFallback(
    () => getPatientsFromDatabase(filters),
    () => clone(filterByQuery(patients, filters)),
  )
}

export async function getPatientById(patientId) {
  return resolveWithFallback(
    () => getPatientByIdFromDatabase(patientId),
    () => {
      const patient = patients.find((item) => item.id === patientId)
      return patient ? clone(patient) : null
    },
  )
}

export async function getPatientClinicalContext(patientId) {
  return resolveWithFallback(
    () => getPatientClinicalContextFromDatabase(patientId),
    () => buildMockPatientClinicalContext(patientId),
  )
}
