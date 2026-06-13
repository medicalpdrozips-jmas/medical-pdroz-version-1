import { crhAssistRuleCatalog } from './crhAssistRuleCatalog'

const TODAY = '2026-06-13'

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function daysBetween(from, to = TODAY) {
  if (!from) return 999
  const start = new Date(from)
  const end = new Date(to)
  const diff = end.getTime() - start.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function parseMoney(value) {
  if (typeof value === 'number') return value
  if (!value) return 0

  const normalized = String(value)
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/M/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')

  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function parsePercent(value) {
  if (typeof value === 'number') return value
  if (!value) return 0
  const parsed = Number.parseFloat(String(value).replace('%', '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeText(value) {
  return String(value ?? '').toLowerCase()
}

function getRiskLevel(score) {
  if (score <= 30) return 'bajo'
  if (score <= 60) return 'medio'
  if (score <= 80) return 'alto'
  return 'critico'
}

function buildExplanation(parts) {
  return parts.filter(Boolean).join(' ')
}

function severityRank(severity) {
  if (severity === 'critica') return 4
  if (severity === 'alta') return 3
  if (severity === 'media') return 2
  return 1
}

function severityFromLevel(level) {
  if (level === 'critico') return 'critica'
  if (level === 'alto') return 'alta'
  if (level === 'medio') return 'media'
  return 'baja'
}

function buildAlert({
  id,
  type,
  severity,
  title,
  description,
  source,
  recommendedAction,
  relatedModule,
}) {
  return {
    id,
    type,
    severity,
    title,
    description,
    source,
    recommendedAction,
    relatedModule,
  }
}

function getRuleTitle(rule) {
  return rule.name
}

function getRuleSource(rule) {
  const sources = {
    clinical: 'Historia clinica inteligente',
    financial: 'Contrato PGP 360',
    pgp: 'Contrato PGP 360',
    medication: 'Farmacia inteligente',
    adherence: 'Paciente 360',
    history: 'Historia clinica inteligente',
    operational: 'CRH Assist Rules Engine V2',
  }

  return sources[rule.category] ?? 'CRH Assist Rules Engine V2'
}

function getRuleType(rule) {
  const types = {
    'follow-up-gap': 'follow_up_gap',
    'high-cost-medication': 'high_cost_medication',
    'above-expected-consumption': 'cost_variance',
    'pgp-margin-at-risk': 'pgp_margin_risk',
    'chronic-non-adherence': 'adherence_risk',
    'high-risk-diagnosis': 'high_risk_diagnosis',
    'incomplete-history': 'documentation_gap',
    'deficit-patient': 'deficit_patient',
    'profitable-patient': 'profitable_patient',
    'avoidable-event': 'avoidable_event',
  }

  return types[rule.id] ?? rule.id
}

function buildDerivedContext(patient, context = {}) {
  const history = context.history ?? {}
  const diagnoses = context.diagnoses ?? []
  const medications = context.medications ?? []
  const contract = context.contract ?? {}
  const consumptions = context.consumptions ?? {}

  const diagnosisText = normalizeText([patient?.diagnostico, ...diagnoses].join(' '))
  const lastControlDays = daysBetween(history.lastControlDate)
  const highCostMedicationRows = medications.filter((item) => normalizeText(item.tipoCosto).includes('alto costo'))
  const monthlyCost = parseMoney(consumptions.monthlyCost ?? consumptions.currentCost)
  const expectedMonthlyCost = parseMoney(consumptions.expectedMonthlyCost)
  const accumulatedCost = parseMoney(consumptions.accumulatedCost ?? patient?.costoAcumulado)
  const contractMargin = parsePercent(contract.margenEstimado)
  const contractDeviation = parsePercent(contract.desviacion)
  const contractRisk = normalizeText(contract.riesgo)

  return {
    patient,
    history,
    diagnoses,
    medications,
    contract,
    consumptions,
    metrics: {
      daysSinceLastControl: lastControlDays,
      hasHighCostMedication: highCostMedicationRows.length > 0,
      highCostMedicationCount: highCostMedicationRows.length,
      consumptionVarianceRatio: expectedMonthlyCost > 0 ? monthlyCost / expectedMonthlyCost : 0,
      monthlyCost,
      expectedMonthlyCost,
      accumulatedCost,
      pgpMarginAtRisk: contractRisk === 'rojo' || contractDeviation > 5 || (contractMargin > 0 && contractMargin < 12),
      hasAdherenceRisk: Boolean(history.adherenceRisk),
      hasHighRiskDiagnosis:
        Boolean(history.highRiskDiagnosis) ||
        /vih|renal|descompensada|artritis|biologico|psoriasis|erc/i.test(diagnosisText),
      historyCompletenessRatio: Number(history.completenessRatio ?? 1),
      isDeficitPatient: accumulatedCost >= 10 && contractMargin < 12,
      isProfitablePatient: accumulatedCost <= 4 && contractMargin >= 12,
      hasPotentialAvoidableEvent: Boolean(consumptions.potentialAvoidableEvent),
      contractMargin,
      contractDeviation,
      contractRisk,
      diagnosisText,
      costPercentile: Number(consumptions.costPercentile ?? 0),
    },
  }
}

function describeRuleTrigger(rule, derivedContext) {
  const { metrics, consumptions, contract } = derivedContext

  switch (rule.id) {
    case 'follow-up-gap':
      return `Han pasado ${metrics.daysSinceLastControl} dias desde el ultimo control clinico relevante.`
    case 'high-cost-medication':
      return `El paciente tiene ${metrics.highCostMedicationCount} terapia(s) de alto costo con impacto directo sobre el caso.`
    case 'above-expected-consumption':
      return `El consumo mensual (${consumptions.monthlyCost ?? '$0 M'}) supera el esperado (${consumptions.expectedMonthlyCost ?? '$0 M'}).`
    case 'pgp-margin-at-risk':
      return `El contrato asociado muestra margen ${contract.margenEstimado ?? '0%'} y desviacion ${contract.desviacion ?? '0%'}, con presion sobre el cierre PGP.`
    case 'chronic-non-adherence':
      return 'Se detectan senales de brecha entre plan de manejo y continuidad terapeutica.'
    case 'high-risk-diagnosis':
      return 'El diagnostico principal implica mayor probabilidad de consumo acelerado o descompensacion.'
    case 'incomplete-history':
      return `La historia solo alcanza ${Math.round(metrics.historyCompletenessRatio * 100)}% de completitud en campos clave.`
    case 'deficit-patient':
      return 'El costo acumulado del caso presiona negativamente el margen contractual.'
    case 'profitable-patient':
      return 'El comportamiento clinico y economico del paciente es favorable para el contrato.'
    case 'avoidable-event':
      return 'La combinacion de brechas de control y riesgo operativo puede terminar en atencion evitable.'
    default:
      return rule.description
  }
}

// Reglas configurables V2.
// El catalogo queda listo para persistirse luego en PostgreSQL y administrarse desde backend/API.
export function getEnabledRules() {
  return crhAssistRuleCatalog.filter((rule) => rule.enabled)
}

export function evaluateRule(rule, context) {
  const derivedContext = context?.metrics ? context : buildDerivedContext(context.patient, context)
  const { metrics } = derivedContext
  let triggered

  switch (rule.id) {
    case 'follow-up-gap':
      triggered = metrics.daysSinceLastControl > 30
      break
    case 'high-cost-medication':
      triggered = metrics.hasHighCostMedication
      break
    case 'above-expected-consumption':
      triggered = metrics.expectedMonthlyCost > 0 && metrics.consumptionVarianceRatio > 1
      break
    case 'pgp-margin-at-risk':
      triggered = metrics.pgpMarginAtRisk
      break
    case 'chronic-non-adherence':
      triggered = metrics.hasAdherenceRisk
      break
    case 'high-risk-diagnosis':
      triggered = metrics.hasHighRiskDiagnosis
      break
    case 'incomplete-history':
      triggered = metrics.historyCompletenessRatio < 0.75
      break
    case 'deficit-patient':
      triggered = metrics.isDeficitPatient
      break
    case 'profitable-patient':
      triggered = metrics.isProfitablePatient
      break
    case 'avoidable-event':
      triggered = metrics.hasPotentialAvoidableEvent
      break
    default:
      triggered = false
  }

  return {
    ...rule,
    triggered,
    scoreImpact: triggered ? rule.weight : 0,
    descriptionText: triggered ? describeRuleTrigger(rule, derivedContext) : rule.description,
  }
}

export function evaluateRulesCatalog(context) {
  const rules = getEnabledRules().map((rule) => evaluateRule(rule, context))

  return {
    derivedContext: context?.metrics ? context : buildDerivedContext(context.patient, context),
    rules,
    triggeredRules: rules.filter((rule) => rule.triggered),
  }
}

export function calculateWeightedScore(triggeredRules = []) {
  const score = clamp(
    triggeredRules.reduce((total, rule) => total + Number(rule.scoreImpact ?? rule.weight ?? 0), 0),
  )

  return {
    score,
    level: getRiskLevel(score),
  }
}

export function groupAlertsBySeverity(alerts = []) {
  return alerts.reduce((acc, alert) => {
    acc[alert.severity] ??= []
    acc[alert.severity].push(alert)
    return acc
  }, {})
}

function filterRulesByCategory(triggeredRules, categories) {
  return triggeredRules.filter((rule) => categories.includes(rule.category))
}

function explainCategory(title, triggeredRules, fallback) {
  const drivers = triggeredRules.map((rule) => rule.name)

  return {
    score: calculateWeightedScore(triggeredRules).score,
    level: getRiskLevel(calculateWeightedScore(triggeredRules).score),
    explanation: buildExplanation([
      title,
      drivers.length ? `Factores detectados: ${drivers.join(', ')}.` : fallback,
    ]),
    drivers,
  }
}

export function calculateClinicalRisk(patient, history = {}, diagnoses = [], medications = []) {
  const derivedContext = buildDerivedContext(patient, { history, diagnoses, medications })
  const { triggeredRules } = evaluateRulesCatalog(derivedContext)

  return explainCategory(
    'Riesgo clinico calculado por reglas interpretables y configurables.',
    filterRulesByCategory(triggeredRules, ['clinical', 'adherence', 'history', 'medication']),
    'No se detectaron factores clinicos mayores.',
  )
}

export function calculateFinancialRisk(patient, contract = {}, consumptions = {}, medications = []) {
  const derivedContext = buildDerivedContext(patient, { contract, consumptions, medications })
  const { triggeredRules } = evaluateRulesCatalog(derivedContext)

  return explainCategory(
    'Riesgo financiero derivado de costo, margen, desviacion y presion farmacoeconomica.',
    filterRulesByCategory(triggeredRules, ['financial', 'medication', 'operational']),
    'Sin presion financiera relevante en el caso.',
  )
}

export function calculatePgpRisk(patient, contract = {}, consumptions = {}) {
  const derivedContext = buildDerivedContext(patient, { contract, consumptions })
  const { triggeredRules } = evaluateRulesCatalog(derivedContext)

  return explainCategory(
    'Riesgo PGP calculado sobre comportamiento individual dentro del contrato.',
    filterRulesByCategory(triggeredRules, ['pgp', 'financial', 'operational']),
    'Paciente con comportamiento PGP controlado.',
  )
}

export function calculateCRHAssistScore(context) {
  const { triggeredRules } = evaluateRulesCatalog(context)
  return calculateWeightedScore(triggeredRules)
}

export function generatePatientAlerts(patient, context) {
  const { triggeredRules, derivedContext } = evaluateRulesCatalog({ patient, ...context })

  return triggeredRules
    .slice()
    .sort((left, right) => severityRank(right.severity) - severityRank(left.severity))
    .map((rule) => buildAlert({
      id: `${patient.id}-${rule.id}`,
      type: getRuleType(rule),
      severity: rule.severity,
      title: getRuleTitle(rule),
      description: describeRuleTrigger(rule, derivedContext),
      source: getRuleSource(rule),
      recommendedAction: rule.recommendedAction,
      relatedModule: rule.relatedModule,
    }))
}

export function generateRecommendedActions(patient, riskResult) {
  const actions = new Set(riskResult.alerts.map((alert) => alert.recommendedAction))

  if (riskResult.level === 'critico') {
    actions.add('Escalar el caso a comite clinico-financiero en el mismo ciclo operativo.')
  }

  if (riskResult.clinicalRisk.score >= 61) {
    actions.add('Programar control clinico prioritario y cerrar brechas documentales.')
  }

  if (riskResult.financialRisk.score >= 61) {
    actions.add('Revisar costo esperado, autorizacion terapeutica y coherencia con respuesta clinica.')
  }

  if (riskResult.pgpRisk.score >= 61) {
    actions.add('Activar seguimiento especifico sobre contrato PGP y consumo evitable.')
  }

  return Array.from(actions)
}

export function evaluateCRHAssist(patient, context = {}) {
  const diagnoses = context.diagnoses ?? []
  const medications = context.medications ?? []
  const history = context.history ?? {}
  const contract = context.contract ?? {}
  const consumptions = context.consumptions ?? {}

  const derivedContext = buildDerivedContext(patient, {
    diagnoses,
    medications,
    history,
    contract,
    consumptions,
  })

  const clinicalRisk = calculateClinicalRisk(patient, history, diagnoses, medications)
  const financialRisk = calculateFinancialRisk(patient, contract, consumptions, medications)
  const pgpRisk = calculatePgpRisk(patient, contract, consumptions)
  const alerts = generatePatientAlerts(patient, {
    diagnoses,
    medications,
    history,
    contract,
    consumptions,
  })
  const groupedAlerts = groupAlertsBySeverity(alerts)
  const scoreResult = calculateWeightedScore(
    evaluateRulesCatalog(derivedContext).triggeredRules,
  )

  const result = {
    score: scoreResult.score,
    level: scoreResult.level,
    clinicalRisk,
    financialRisk,
    pgpRisk,
    alerts,
    groupedAlerts,
    recommendedActions: [],
    explanation: buildExplanation([
      `CRH Assist Score ${scoreResult.score}/100 con nivel ${scoreResult.level}.`,
      `Motor V2 basado en ${getEnabledRules().length} reglas configurables y ponderadas.`,
      clinicalRisk.explanation,
      financialRisk.explanation,
      pgpRisk.explanation,
    ]),
    rulesVersion: 'V2',
    enabledRules: getEnabledRules().length,
  }

  result.recommendedActions = generateRecommendedActions(patient, result)

  return result
}

export function getCatalogPreview() {
  return getEnabledRules().map((rule) => ({
    id: rule.id,
    name: rule.name,
    category: rule.category,
    weight: rule.weight,
    severity: rule.severity,
    relatedModule: rule.relatedModule,
  }))
}

export function summarizeTriggeredRules(patient, context = {}) {
  const { triggeredRules } = evaluateRulesCatalog({ patient, ...context })
  const score = calculateWeightedScore(triggeredRules)

  return {
    score: score.score,
    level: score.level,
    rules: triggeredRules,
    explanation: triggeredRules.length
      ? `El score se compone de ${triggeredRules.map((rule) => `${rule.name} (${rule.weight})`).join(', ')}.`
      : 'No hay reglas activadas para este contexto.',
    dominantSeverity: severityFromLevel(score.level),
  }
}
