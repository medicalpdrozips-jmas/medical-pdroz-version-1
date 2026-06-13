// Esta capa simula la futura API REST/Node/Express conectada a PostgreSQL.
// Hoy consume demoData y CRH Assist Rules Engine V2 para mantener la interfaz estable
// mientras se prepara la migracion a backend real.

import {
  appointments,
  crhAssistRulesCatalog,
  crhContracts,
  crhPatient360Profiles,
  getClinicalRecordByPatientId,
  getContractById as getDemoContractById,
  getPatient360Profile,
  medications,
  patientConsumptions,
  patients,
} from '../data/demoData'
import { evaluateCRHAssist } from '../engine/crhAssistRulesEngine'

function normalizeText(value) {
  return String(value ?? '').toLowerCase()
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getPatientMedicationContext(patientId) {
  const patient = patients.find((item) => item.id === patientId)
  const profile = getPatient360Profile(patientId)

  const tableRows = medications
    .filter((item) => normalizeText(item.paciente) === normalizeText(`${patient?.nombres} ${patient?.apellidos}`))
    .map((item) => ({
      id: item.id,
      nombre: item.medicamento,
      estado: item.tipoCosto === 'Riesgo de continuidad' ? 'Pendiente' : 'Activo',
      tipoCosto: item.tipoCosto,
    }))

  const profileRows = (profile?.medicamentosActivos ?? []).map((item, index) => ({
    id: `${patientId}-profile-med-${index}`,
    nombre: item.nombre,
    estado: item.estado,
    tipoCosto: /adalimumab|secukinumab|rituximab|dolutegravir/i.test(item.nombre) ? 'Alto costo' : 'Seguimiento',
  }))

  return [...tableRows, ...profileRows]
}

function getPatientHistoryContext(patientId) {
  const profile = getPatient360Profile(patientId)
  const record = getClinicalRecordByPatientId(patientId)
  const baseFields = [
    record?.anamnesis,
    record?.antecedentes,
    record?.diagnosticoCie10,
    record?.planManejo,
  ]
  const filledFields = baseFields.filter(Boolean).length

  return {
    lastControlDate: profile?.ultimasAtenciones?.[0]?.fecha ?? null,
    completenessRatio: filledFields / baseFields.length,
    adherenceRisk: (profile?.medicamentosActivos ?? []).some((item) => ['Pendiente', 'Parcial'].includes(item.estado)),
    highRiskDiagnosis: /vih|renal|descompensada|artritis/i.test(
      `${patients.find((item) => item.id === patientId)?.diagnostico ?? ''} ${(profile?.diagnosticosPrincipales ?? []).join(' ')}`,
    ),
    record,
  }
}

function buildPatientClinicalContext(patientId) {
  const patient = getPatientById(patientId)
  const profile = getPatient360Profile(patientId)
  const contract = getDemoContractById(profile.contratoId)
  const clinicalRecord = getClinicalRecordByPatientId(patientId)
  const history = getPatientHistoryContext(patientId)
  const diagnoses = profile.diagnosticosPrincipales
  const medicationContext = getPatientMedicationContext(patientId)
  const consumptions = patientConsumptions[patientId] ?? {}

  return {
    patient,
    profile,
    contract,
    clinicalRecord,
    diagnoses,
    medications: medicationContext,
    history,
    consumptions,
  }
}

export function getPatients() {
  return clone(patients)
}

export function getPatientById(patientId) {
  return clone(patients.find((item) => item.id === patientId) ?? patients[0])
}

export function getPatientClinicalContext(patientId) {
  return clone(buildPatientClinicalContext(patientId))
}

export function getContracts() {
  return clone(crhContracts)
}

export function getContractById(contractId) {
  return clone(getDemoContractById(contractId))
}

export function getContractPatients(contractId) {
  return clone(patients.filter((item) => item.contratoId === contractId))
}

export function evaluatePatientCRHAssist(patientId) {
  const context = buildPatientClinicalContext(patientId)

  return evaluateCRHAssist(context.patient, {
    history: context.history,
    diagnoses: context.diagnoses,
    medications: context.medications,
    contract: context.contract,
    consumptions: context.consumptions,
  })
}

export function evaluateContractCRHAssist(contractId) {
  const contract = getDemoContractById(contractId)
  const relatedPatients = patients.filter((item) => item.contratoId === contractId)
  const evaluations = relatedPatients.map((patient) => ({
    patient,
    evaluation: evaluatePatientCRHAssist(patient.id),
  }))

  const score = evaluations.length
    ? Math.round(evaluations.reduce((total, item) => total + item.evaluation.score, 0) / evaluations.length)
    : 0

  const allAlerts = evaluations.flatMap((item) => item.evaluation.alerts)
  const criticalAlerts = allAlerts.filter((alert) => alert.severity === 'critica').length

  return {
    contractId: contract.id,
    score,
    level: score <= 30 ? 'bajo' : score <= 60 ? 'medio' : score <= 80 ? 'alto' : 'critico',
    criticalAlerts,
    explanation: `${relatedPatients.length} pacientes analizados con ${criticalAlerts} alertas criticas relacionadas con seguimiento, margen o consumo.`,
    evaluations,
  }
}

export function getRuleCatalog() {
  return clone(crhAssistRulesCatalog)
}

export function updateRuleStatus(ruleId, enabled) {
  const rule = crhAssistRulesCatalog.find((item) => item.id === ruleId)

  if (!rule) {
    return null
  }

  rule.enabled = Boolean(enabled)
  return clone(rule)
}

export function getAppointments() {
  return clone(appointments)
}

export function getPatientProfiles() {
  return clone(crhPatient360Profiles)
}

export function getMedicationRows() {
  return clone(medications)
}
