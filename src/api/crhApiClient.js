import * as mockApi from './crhAssistApiMock'

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api'
const API_BASE_URL = import.meta.env.VITE_CRH_API_URL ?? DEFAULT_API_BASE_URL
const DEFAULT_TIMEOUT_MS = 1500

let backendStatus = {
  mode: 'unknown',
  connected: false,
  baseUrl: API_BASE_URL,
  lastError: null,
}

function setBackendStatus(nextStatus) {
  backendStatus = nextStatus
}

function timeoutSignal(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  return { controller, timeoutId }
}

function formatCurrency(value, digits = 1) {
  if (typeof value === 'string') return value
  if (typeof value !== 'number' || Number.isNaN(value)) return '$0 M'

  return `$${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 1000000)} M`
}

function formatPercent(value, digits = 1) {
  if (typeof value === 'string') return value
  if (typeof value !== 'number' || Number.isNaN(value)) return '0%'

  return `${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`
}

function mergeById(remoteRows, fallbackRows) {
  if (!Array.isArray(remoteRows) || remoteRows.length === 0) return fallbackRows

  return remoteRows.map((remoteRow) => ({
    ...(fallbackRows.find((item) => item.id === remoteRow.id) ?? {}),
    ...remoteRow,
  }))
}

function mergeObjects(remoteRow, fallbackRow) {
  if (!remoteRow) return fallbackRow

  return {
    ...fallbackRow,
    ...remoteRow,
  }
}

function normalizePatient(remotePatient, fallbackPatient = {}) {
  if (!remotePatient) return fallbackPatient

  return mergeObjects({
    id: remotePatient.id,
    tipoDocumento: remotePatient.tipoDocumento ?? remotePatient.documentType,
    numeroDocumento: remotePatient.numeroDocumento ?? remotePatient.documentNumber,
    nombres: remotePatient.nombres ?? remotePatient.firstName,
    apellidos: remotePatient.apellidos ?? remotePatient.lastName,
    fechaNacimiento: remotePatient.fechaNacimiento ?? remotePatient.birthDate,
    edad: remotePatient.edad ?? remotePatient.age,
    sexo: remotePatient.sexo ?? remotePatient.sex,
    telefono: remotePatient.telefono ?? remotePatient.phone,
    direccion: remotePatient.direccion ?? remotePatient.address,
    ciudad: remotePatient.ciudad ?? remotePatient.city,
    eps: remotePatient.eps,
    sede: remotePatient.sede ?? remotePatient.site,
    diagnostico: remotePatient.diagnostico ?? remotePatient.primaryDiagnosis,
    estado: remotePatient.estado ?? remotePatient.status,
    contratoId: remotePatient.contratoId ?? remotePatient.contractId,
    programa: remotePatient.programa ?? remotePatient.program,
    riesgoClinico: remotePatient.riesgoClinico,
    riesgoFinanciero: remotePatient.riesgoFinanciero,
    costoAcumulado: remotePatient.costoAcumulado,
    proximaAccionIa: remotePatient.proximaAccionIa,
  }, fallbackPatient)
}

function normalizeContractPatient(remotePatient, fallbackPatient = {}) {
  return normalizePatient(remotePatient, fallbackPatient)
}

function normalizeContract(remoteContract, fallbackContract = {}) {
  if (!remoteContract) return fallbackContract

  return mergeObjects({
    id: remoteContract.id,
    eps: remoteContract.eps,
    codigo: remoteContract.codigo ?? remoteContract.code,
    nombre: remoteContract.nombre ?? remoteContract.name,
    modalidad: remoteContract.modalidad ?? remoteContract.modality,
    valorContrato: remoteContract.valorContrato ?? formatCurrency(remoteContract.contractValue),
    consumoActual: remoteContract.consumoActual ?? formatCurrency(remoteContract.currentConsumption),
    proyeccionCierre: remoteContract.proyeccionCierre ?? formatCurrency(remoteContract.closingProjection),
    margenEstimado: remoteContract.margenEstimado ?? formatPercent(remoteContract.estimatedMargin),
    riesgo: remoteContract.riesgo ?? remoteContract.risk,
    poblacion: remoteContract.poblacion ?? remoteContract.population,
    desviacion: remoteContract.desviacion ?? formatPercent(remoteContract.deviation),
    pacientesTop: remoteContract.pacientesTop ?? remoteContract.topPatients?.map((patient) => ({
      paciente: patient.paciente ?? patient.name,
      costo: patient.costo ?? formatCurrency(patient.cost),
      diagnostico: patient.diagnostico ?? patient.primaryDiagnosis ?? 'Sin diagnostico',
    })),
    medicamentosTop: remoteContract.medicamentosTop ?? remoteContract.topMedications?.map((item) => ({
      medicamento: item.medicamento ?? item.name,
      costo: item.costo ?? formatCurrency(item.cost),
      impacto: item.impacto ?? formatPercent(item.impact),
    })),
    alertas: remoteContract.alertas,
  }, fallbackContract)
}

function normalizeRule(remoteRule, fallbackRule = {}) {
  if (!remoteRule) return fallbackRule

  return mergeObjects({
    id: remoteRule.id,
    name: remoteRule.name,
    description: remoteRule.description,
    category: remoteRule.category,
    appliesTo: remoteRule.appliesTo ?? [],
    condition: remoteRule.condition ?? fallbackRule.condition,
    weight: remoteRule.weight,
    severity: remoteRule.severity,
    enabled: remoteRule.enabled,
    relatedModule: remoteRule.relatedModule,
    recommendedAction: remoteRule.recommendedAction,
    updatedAt: remoteRule.updatedAt,
    updatedBy: remoteRule.updatedBy,
  }, fallbackRule)
}

function normalizePatientEvaluation(remoteEvaluation, fallbackEvaluation = {}) {
  if (!remoteEvaluation) return fallbackEvaluation

  return mergeObjects({
    patientId: remoteEvaluation.patientId ?? fallbackEvaluation.patientId,
    score: remoteEvaluation.score ?? fallbackEvaluation.score ?? 0,
    level: remoteEvaluation.level ?? fallbackEvaluation.level ?? 'bajo',
    rulesVersion: remoteEvaluation.rulesVersion ?? fallbackEvaluation.rulesVersion ?? 'V2',
    enabledRules: remoteEvaluation.enabledRules ?? fallbackEvaluation.enabledRules ?? 0,
    clinicalRisk: mergeObjects(remoteEvaluation.clinicalRisk, fallbackEvaluation.clinicalRisk ?? {}),
    financialRisk: mergeObjects(remoteEvaluation.financialRisk, fallbackEvaluation.financialRisk ?? {}),
    pgpRisk: mergeObjects(remoteEvaluation.pgpRisk, fallbackEvaluation.pgpRisk ?? {}),
    alerts: Array.isArray(remoteEvaluation.alerts) ? remoteEvaluation.alerts : (fallbackEvaluation.alerts ?? []),
    recommendedActions: Array.isArray(remoteEvaluation.recommendedActions)
      ? remoteEvaluation.recommendedActions
      : (fallbackEvaluation.recommendedActions ?? []),
    explanation: remoteEvaluation.explanation ?? fallbackEvaluation.explanation ?? 'Sin explicacion disponible.',
  }, fallbackEvaluation)
}

function normalizeContractEvaluation(remoteEvaluation, fallbackEvaluation = {}) {
  if (!remoteEvaluation) return fallbackEvaluation

  return mergeObjects({
    contractId: remoteEvaluation.contractId ?? fallbackEvaluation.contractId,
    score: remoteEvaluation.score ?? fallbackEvaluation.score ?? 0,
    level: remoteEvaluation.level ?? fallbackEvaluation.level ?? 'bajo',
    criticalAlerts: remoteEvaluation.criticalAlerts ?? fallbackEvaluation.criticalAlerts ?? 0,
    explanation: remoteEvaluation.explanation ?? fallbackEvaluation.explanation ?? 'Sin explicacion disponible.',
    evaluations: Array.isArray(remoteEvaluation.evaluations) ? remoteEvaluation.evaluations : (fallbackEvaluation.evaluations ?? []),
  }, fallbackEvaluation)
}

function normalizeClinicalContext(remoteContext, fallbackContext) {
  if (!remoteContext) return fallbackContext

  const patient = normalizePatient(remoteContext.patient, fallbackContext.patient)
  const contract = normalizeContract(remoteContext.contract, fallbackContext.contract)
  const history = mergeObjects(remoteContext.history ?? remoteContext.clinicalHistory, fallbackContext.history)
  const medications = Array.isArray(remoteContext.medications)
    ? remoteContext.medications.map((item, index) => ({
      id: item.id ?? `${patient.id}-med-${index}`,
      nombre: item.nombre ?? item.name,
      estado: item.estado ?? item.status,
      tipoCosto: item.tipoCosto ?? item.costType,
      costo: item.costo,
    }))
    : fallbackContext.medications

  const diagnoses = Array.isArray(remoteContext.diagnoses)
    ? remoteContext.diagnoses.map((item) => item.description ?? item.cie10 ?? item)
    : fallbackContext.diagnoses

  const consumptions = mergeObjects({
    accumulatedCost: remoteContext.consumptions?.accumulatedCost,
    monthlyCost: remoteContext.consumptions?.monthlyCost ?? formatCurrency(remoteContext.consumptions?.monthlyCost),
    expectedMonthlyCost: remoteContext.consumptions?.expectedMonthlyCost ?? formatCurrency(remoteContext.consumptions?.expectedMonthlyCost),
    currentCost: remoteContext.consumptions?.currentCost ?? formatCurrency(remoteContext.consumptions?.currentConsumption),
    costPercentile: remoteContext.consumptions?.costPercentile,
    potentialAvoidableEvent: remoteContext.consumptions?.potentialAvoidableEvent,
  }, fallbackContext.consumptions)

  const clinicalRecord = mergeObjects({
    anamnesis: remoteContext.clinicalRecord?.anamnesis,
    antecedentes: remoteContext.clinicalRecord?.antecedentes,
    signosVitales: remoteContext.clinicalRecord?.signosVitales,
    diagnosticoCie10: remoteContext.clinicalRecord?.diagnosticoCie10,
    planManejo: remoteContext.clinicalRecord?.planManejo,
    ordenes: remoteContext.clinicalRecord?.ordenes,
  }, fallbackContext.clinicalRecord)

  const profile = mergeObjects({
    eps: patient.eps,
    contratoId: contract.id,
    contratoNombre: contract.nombre,
    riesgoClinico: patient.riesgoClinico ?? fallbackContext.profile.riesgoClinico,
    riesgoFinanciero: patient.riesgoFinanciero ?? fallbackContext.profile.riesgoFinanciero,
    costoAcumulado: consumptions.accumulatedCost ?? fallbackContext.profile.costoAcumulado,
    costoMes: consumptions.monthlyCost ?? fallbackContext.profile.costoMes,
    diagnosticosPrincipales: diagnoses,
    medicamentosActivos: medications,
    ultimasAtenciones: fallbackContext.profile.ultimasAtenciones,
  }, fallbackContext.profile)

  return {
    ...fallbackContext,
    ...remoteContext,
    patient,
    profile,
    contract,
    clinicalRecord,
    diagnoses,
    medications,
    history,
    consumptions,
  }
}

async function fetchJson(path, options = {}) {
  const { timeoutMs, ...fetchOptions } = options
  const { controller, timeoutId } = timeoutSignal(timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      const error = new Error(payload?.error?.message ?? `CRH API error ${response.status}`)
      error.status = response.status
      error.payload = payload
      throw error
    }

    const payload = await response.json().catch(() => ({}))

    setBackendStatus({
      mode: 'connected',
      connected: true,
      baseUrl: API_BASE_URL,
      lastError: null,
    })

    return payload.data ?? payload
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('CRH API timeout', { cause: error })
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function withFallback(path, fallbackFn, options = {}, normalize = (value) => value) {
  try {
    const data = await fetchJson(path, options)
    return normalize(data)
  } catch (error) {
    setBackendStatus({
      mode: 'fallback',
      connected: false,
      baseUrl: API_BASE_URL,
      lastError: error.message,
    })

    const fallbackData = await fallbackFn()
    return normalize(fallbackData)
  }
}

export function getApiRuntimeStatus() {
  return backendStatus
}

export async function getPatients() {
  const fallbackRows = mockApi.getPatients()

  return withFallback('/patients', () => fallbackRows, {}, (data) => (
    mergeById(
      Array.isArray(data) ? data.map((item) => normalizePatient(item)) : [],
      fallbackRows,
    )
  ))
}

export async function getPatientById(patientId) {
  const fallbackPatient = mockApi.getPatientById(patientId)

  return withFallback(
    `/patients/${patientId}`,
    () => fallbackPatient,
    {},
    (data) => normalizePatient(data, fallbackPatient),
  )
}

export async function getPatientClinicalContext(patientId) {
  const fallbackContext = mockApi.getPatientClinicalContext(patientId)

  return withFallback(
    `/patients/${patientId}/clinical-context`,
    () => fallbackContext,
    {},
    (data) => normalizeClinicalContext(data, fallbackContext),
  )
}

export async function getContracts() {
  const fallbackRows = mockApi.getContracts()

  return withFallback('/contracts', () => fallbackRows, {}, (data) => (
    mergeById(
      Array.isArray(data) ? data.map((item) => normalizeContract(item)) : [],
      fallbackRows,
    )
  ))
}

export async function getContractById(contractId) {
  const fallbackContract = mockApi.getContractById(contractId)

  return withFallback(
    `/contracts/${contractId}`,
    () => fallbackContract,
    {},
    (data) => normalizeContract(data, fallbackContract),
  )
}

export async function getContractPatients(contractId) {
  const fallbackRows = mockApi.getContractPatients(contractId)

  return withFallback(
    `/contracts/${contractId}/patients`,
    () => fallbackRows,
    {},
    (data) => mergeById(
      Array.isArray(data) ? data.map((item) => normalizeContractPatient(item)) : [],
      fallbackRows,
    ),
  )
}

export async function evaluatePatientCRHAssist(patientId) {
  const fallbackEvaluation = mockApi.evaluatePatientCRHAssist(patientId)

  return withFallback(
    `/crh-assist/patient/${patientId}`,
    () => fallbackEvaluation,
    {},
    (data) => normalizePatientEvaluation(data, fallbackEvaluation),
  )
}

export async function evaluateContractCRHAssist(contractId) {
  const fallbackEvaluation = mockApi.evaluateContractCRHAssist(contractId)

  return withFallback(
    `/crh-assist/contract/${contractId}`,
    () => fallbackEvaluation,
    {},
    (data) => normalizeContractEvaluation(data, fallbackEvaluation),
  )
}

export async function getRuleCatalog() {
  const fallbackRows = mockApi.getRuleCatalog()

  return withFallback('/crh-assist/rules', () => fallbackRows, {}, (data) => (
    mergeById(
      Array.isArray(data) ? data.map((item) => normalizeRule(item)) : [],
      fallbackRows,
    )
  ))
}

export async function updateRuleStatus(ruleId, enabled) {
  const fallbackRule = mockApi.updateRuleStatus(ruleId, enabled)

  return withFallback(
    `/crh-assist/rules/${ruleId}/status`,
    () => fallbackRule,
    {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    },
    (data) => normalizeRule(data, fallbackRule),
  )
}

export async function getAppointments() {
  return mockApi.getAppointments()
}

export async function getMedicationRows() {
  return mockApi.getMedicationRows()
}
