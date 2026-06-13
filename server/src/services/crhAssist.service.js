import { query } from '../db/pool.js'
import { contracts, patients, ruleCatalog } from './mockData.js'
import { getContractPatients } from './contracts.service.js'
import { getPatientClinicalContext } from './patients.service.js'
import { clone, resolveWithFallback } from './dbFallback.js'

function scoreLevel(score) {
  if (score <= 30) return 'bajo'
  if (score <= 60) return 'medio'
  if (score <= 80) return 'alto'
  return 'critico'
}

function filterRules(rows, queryFilters = {}) {
  return rows.filter((rule) => {
    const matchesEnabled = queryFilters.enabled === undefined ? true : rule.enabled === (queryFilters.enabled === 'true')
    const matchesCategory = queryFilters.category ? rule.category === queryFilters.category : true
    const matchesSeverity = queryFilters.severity ? rule.severity === queryFilters.severity : true

    return matchesEnabled && matchesCategory && matchesSeverity
  })
}

function buildEvaluationFromContext(patientId, context, rules, sourceLabel) {
  const triggeredRules = rules.filter((rule) => {
    if (!rule.enabled) return false
    if (rule.id === 'high-cost-medication') {
      return (context.medications ?? []).some((item) => item.tipoCosto === 'Alto costo')
    }
    if (rule.id === 'pgp-margin-at-risk') {
      return context.contract?.riesgo === 'Rojo'
    }
    if (rule.id === 'follow-up-gap') {
      return context.history?.adherenceRisk === true
    }
    return false
  })
  const score = Math.max(0, Math.min(100, triggeredRules.reduce((total, rule) => total + rule.weight, 0)))
  const alerts = triggeredRules.map((rule) => ({
    id: `${patientId}-${rule.id}`,
    type: rule.id,
    severity: rule.severity,
    title: rule.name,
    description: rule.description,
    source: sourceLabel,
    recommendedAction: rule.recommendedAction,
    relatedModule: rule.relatedModule,
  }))

  return {
    patientId,
    score,
    level: scoreLevel(score),
    clinicalRisk: { score, level: scoreLevel(score), drivers: triggeredRules.map((rule) => rule.name) },
    financialRisk: { score, level: scoreLevel(score), drivers: triggeredRules.map((rule) => rule.name) },
    pgpRisk: { score, level: scoreLevel(score), drivers: triggeredRules.map((rule) => rule.name) },
    alerts,
    groupedAlerts: alerts.reduce((acc, alert) => {
      acc[alert.severity] ??= []
      acc[alert.severity].push(alert)
      return acc
    }, {}),
    recommendedActions: Array.from(new Set(alerts.map((alert) => alert.recommendedAction))),
    explanation: `${sourceLabel} score ${score}/100 usando reglas activas.`,
    rulesVersion: 'V2-skeleton',
    enabledRules: rules.filter((rule) => rule.enabled).length,
  }
}

function mapRuleRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    appliesTo: row.applies_to ?? [],
    condition: row.condition ?? {},
    weight: row.weight,
    severity: row.severity,
    enabled: row.enabled,
    relatedModule: row.related_module,
    recommendedAction: row.recommended_action,
    version: row.version,
    updatedAt: row.updated_at,
  }
}

async function getRuleCatalogFromDatabase(queryFilters = {}) {
  const conditions = []
  const params = []

  if (queryFilters.enabled !== undefined) {
    params.push(queryFilters.enabled === 'true')
    conditions.push(`r.enabled = $${params.length}`)
  }

  if (queryFilters.category) {
    params.push(queryFilters.category)
    conditions.push(`r.category = $${params.length}`)
  }

  if (queryFilters.severity) {
    params.push(queryFilters.severity)
    conditions.push(`r.severity = $${params.length}`)
  }

  const whereClause = conditions.length ? `where ${conditions.join(' and ')}` : ''
  const result = await query(`
    select
      r.id,
      r.name,
      r.description,
      r.category,
      r.applies_to,
      r.condition,
      r.weight,
      r.severity,
      r.enabled,
      r.related_module,
      r.recommended_action,
      r.version,
      r.updated_at
    from crh.crh_assist_rules r
    ${whereClause}
    order by r.category, r.name
  `, params)

  return result.rows.map(mapRuleRow)
}

async function updateRuleStatusInDatabase(ruleId, enabled) {
  const result = await query(`
    update crh.crh_assist_rules
    set enabled = $2, updated_at = now()
    where id = $1
    returning
      id,
      name,
      description,
      category,
      applies_to,
      condition,
      weight,
      severity,
      enabled,
      related_module,
      recommended_action,
      version,
      updated_at
  `, [ruleId, Boolean(enabled)])

  return result.rows[0] ? mapRuleRow(result.rows[0]) : null
}

async function evaluatePatientFromDatabase(patientId) {
  const [context, rules] = await Promise.all([
    getPatientClinicalContext(patientId),
    getRuleCatalog({}),
  ])

  if (!context) return null

  return buildEvaluationFromContext(patientId, context, rules, 'CRH Assist PostgreSQL')
}

async function evaluateContractFromDatabase(contractId) {
  const contract = contracts.find((item) => item.id === contractId)
  const contractPatients = await getContractPatients(contractId)

  if (!contractPatients) return null

  const evaluations = await Promise.all(
    contractPatients.map(async (patient) => ({
      patient,
      evaluation: await evaluatePatient(patient.id),
    })),
  )
  const score = evaluations.length
    ? Math.round(evaluations.reduce((total, item) => total + item.evaluation.score, 0) / evaluations.length)
    : 0
  const alerts = evaluations.flatMap((item) => item.evaluation.alerts)

  return {
    contractId: contract?.id ?? contractId,
    score,
    level: scoreLevel(score),
    criticalAlerts: alerts.filter((alert) => alert.severity === 'critica').length,
    explanation: `${evaluations.length} pacientes analizados con CRH Assist sobre PostgreSQL fallback-safe.`,
    evaluations,
  }
}

export async function getRuleCatalog(queryFilters = {}) {
  return resolveWithFallback(
    () => getRuleCatalogFromDatabase(queryFilters),
    () => clone(filterRules(ruleCatalog, queryFilters)),
  )
}

export async function updateRuleStatus(ruleId, enabled) {
  return resolveWithFallback(
    () => updateRuleStatusInDatabase(ruleId, enabled),
    () => {
      const rule = ruleCatalog.find((item) => item.id === ruleId)

      if (!rule) return null

      return clone({
        ...rule,
        enabled: Boolean(enabled),
        updatedAt: new Date().toISOString(),
      })
    },
  )
}

export async function evaluatePatient(patientId) {
  return resolveWithFallback(
    () => evaluatePatientFromDatabase(patientId),
    async () => {
      const context = await getPatientClinicalContext(patientId)

      if (!context) return null

      return buildEvaluationFromContext(patientId, context, ruleCatalog, 'CRH Assist API skeleton')
    },
  )
}

export async function evaluateContract(contractId) {
  return resolveWithFallback(
    () => evaluateContractFromDatabase(contractId),
    async () => {
      const contract = contracts.find((item) => item.id === contractId)
      const contractPatients = await getContractPatients(contractId)

      if (!contract || !contractPatients) return null

      const evaluations = await Promise.all(
        contractPatients.map(async (patient) => ({
          patient,
          evaluation: await evaluatePatient(patient.id),
        })),
      )
      const score = evaluations.length
        ? Math.round(evaluations.reduce((total, item) => total + item.evaluation.score, 0) / evaluations.length)
        : 0
      const alerts = evaluations.flatMap((item) => item.evaluation.alerts)

      return {
        contractId: contract.id,
        score,
        level: scoreLevel(score),
        criticalAlerts: alerts.filter((alert) => alert.severity === 'critica').length,
        explanation: `${evaluations.length} pacientes analizados con CRH Assist sobre API skeleton.`,
        evaluations,
      }
    },
  )
}

export async function evaluate(payload = {}) {
  if (payload.patientId) {
    const evaluation = await evaluatePatient(payload.patientId)
    return evaluation
      ? {
          evaluationId: `eval-${payload.patientId}-${Date.now()}`,
          scope: 'patient',
          patientId: payload.patientId,
          ...evaluation,
          createdAt: new Date().toISOString(),
        }
      : null
  }

  if (payload.contractId) {
    const evaluation = await evaluateContract(payload.contractId)
    return evaluation
      ? {
          evaluationId: `eval-${payload.contractId}-${Date.now()}`,
          scope: 'contract',
          contractId: payload.contractId,
          ...evaluation,
          createdAt: new Date().toISOString(),
        }
      : null
  }

  if (payload.context?.patient) {
    return {
      evaluationId: `eval-ad-hoc-${Date.now()}`,
      scope: 'ad-hoc',
      score: 0,
      level: 'bajo',
      alerts: [],
      recommendedActions: [],
      explanation: 'Evaluacion ad hoc recibida por API skeleton; motor real se conectara en una fase posterior.',
      createdAt: new Date().toISOString(),
    }
  }

  return null
}

export function getAvailablePatients() {
  return clone(patients)
}
