// Modelo de datos base para CRH Health Intelligence.
// Esta capa documenta la estructura esperada para la futura API REST/Node/Express
// conectada a PostgreSQL, sin reemplazar todavia los datos demo actuales.

/**
 * @typedef {Object} Patient
 * @property {string} id UUID del paciente. Futuro PostgreSQL: medical.pacientes.id
 * @property {string} tipoDocumento
 * @property {string} numeroDocumento
 * @property {string} nombres
 * @property {string} apellidos
 * @property {string} fechaNacimiento ISO date
 * @property {number} edad
 * @property {string} sexo
 * @property {string} telefono
 * @property {string} direccion
 * @property {string} ciudad
 * @property {string} eps
 * @property {string} sede
 * @property {string} diagnostico
 * @property {string} estado
 * @property {string} contratoId FK -> ContractPGP.id
 * @property {string} programa
 */

/**
 * @typedef {Object} ClinicalHistory
 * @property {string} patientId FK -> Patient.id
 * @property {string} anamnesis
 * @property {string} antecedentes
 * @property {Array<{label: string, value: string}>} signosVitales
 * @property {string} diagnosticoCie10
 * @property {string} planManejo
 * @property {string[]} ordenes
 * @property {string} [lastControlDate] ISO date derivada para seguimiento
 * PostgreSQL futuro: medical.historias_clinicas + medical.atenciones_medicas
 */

/**
 * @typedef {Object} Diagnosis
 * @property {string} id UUID del diagnostico
 * @property {string} patientId FK -> Patient.id
 * @property {string} cie10 Codigo CIE10
 * @property {string} descripcion
 * @property {boolean} altoRiesgo
 * PostgreSQL futuro: medical.diagnosticos_atencion
 */

/**
 * @typedef {Object} Medication
 * @property {string} id UUID del medicamento/registro
 * @property {string} medicamento
 * @property {string} paciente
 * @property {string} diagnostico
 * @property {string} contrato
 * @property {string} costoMensual
 * @property {string} consumoMensual
 * @property {string} tipoCosto
 * @property {string} stock
 * @property {string} vencimiento
 * @property {string} pacientesAsociados
 * @property {string} impactoContrato
 * PostgreSQL futuro: medical.medicamentos + medical.inventario_medicamentos
 */

/**
 * @typedef {Object} Prescription
 * @property {string} id UUID
 * @property {string} patientId FK -> Patient.id
 * @property {string} medicationId FK -> Medication.id
 * @property {string} dosis
 * @property {string} frecuencia
 * @property {string} duracion
 * @property {string} estadoEntrega
 * PostgreSQL futuro: medical.dispensaciones
 */

/**
 * @typedef {Object} ContractPGP
 * @property {string} id UUID
 * @property {string} eps
 * @property {string} codigo
 * @property {string} nombre
 * @property {string} modalidad
 * @property {string} valorContrato
 * @property {string} consumoActual
 * @property {string} proyeccionCierre
 * @property {string} margenEstimado
 * @property {string} riesgo
 * @property {number} poblacion
 * @property {string} desviacion
 * PostgreSQL futuro: tabla contractual y hechos financieros del backend
 */

/**
 * @typedef {Object} Consumption
 * @property {string} patientId FK -> Patient.id
 * @property {string} accumulatedCost
 * @property {string} monthlyCost
 * @property {string} expectedMonthlyCost
 * @property {string} currentCost
 * @property {number} costPercentile
 * @property {boolean} potentialAvoidableEvent
 * PostgreSQL futuro: hechos de costo/consumo consolidados por paciente
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id UUID
 * @property {string} fecha
 * @property {string} hora
 * @property {string} paciente
 * @property {string} profesional
 * @property {string} especialidad
 * @property {string} sede
 * @property {string} estado
 * PostgreSQL futuro: medical.citas
 */

/**
 * @typedef {Object} LabResult
 * @property {string} id UUID
 * @property {string} patientId FK -> Patient.id
 * @property {string} fecha
 * @property {string} examen
 * @property {string} estado
 * @property {string} resultado
 * PostgreSQL futuro: medical.ordenes_laboratorio + medical.resultados_laboratorio
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} type
 * @property {string} severity
 * @property {string} title
 * @property {string} description
 * @property {string} source
 * @property {string} recommendedAction
 * @property {string} relatedModule
 * PostgreSQL futuro: medical.alertas_clinicas y/o motor operacional
 */

/**
 * @typedef {Object} RecommendedAction
 * @property {string} id
 * @property {string} patientId FK -> Patient.id
 * @property {string} text
 * @property {string} module
 * @property {string} priority
 * PostgreSQL futuro: tabla de recomendaciones del motor o capa analitica
 */

/**
 * @typedef {Object} CRHAssistEvaluation
 * @property {number} score
 * @property {string} level
 * @property {{score: number, level: string, explanation: string, drivers: string[]}} clinicalRisk
 * @property {{score: number, level: string, explanation: string, drivers: string[]}} financialRisk
 * @property {{score: number, level: string, explanation: string, drivers: string[]}} pgpRisk
 * @property {Alert[]} alerts
 * @property {Record<string, Alert[]>} groupedAlerts
 * @property {string[]} recommendedActions
 * @property {string} explanation
 * @property {string} rulesVersion
 * @property {number} enabledRules
 * PostgreSQL futuro: resultado persistido o cacheado por evaluacion
 */

/**
 * @typedef {Object} RuleCatalogItem
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} category
 * @property {string[]} appliesTo
 * @property {{metric: string, operator: string, threshold: string|number|boolean}} condition
 * @property {number} weight
 * @property {string} severity
 * @property {boolean} enabled
 * @property {string} relatedModule
 * @property {string} recommendedAction
 * PostgreSQL futuro: medical.crh_rule_catalog o tabla equivalente en backend
 */

export const crhDataModel = {
  // Capa dominio/persona
  Patient: {
    futureTable: 'medical.pacientes',
    relationships: ['ContractPGP', 'ClinicalHistory', 'Consumption', 'Alert', 'CRHAssistEvaluation'],
  },
  ClinicalHistory: {
    futureTable: 'medical.historias_clinicas',
    relationships: ['Patient', 'Diagnosis', 'Prescription', 'LabResult'],
  },
  Diagnosis: {
    futureTable: 'medical.diagnosticos_atencion',
    relationships: ['Patient', 'ClinicalHistory'],
  },
  Medication: {
    futureTable: 'medical.medicamentos',
    relationships: ['Prescription', 'ContractPGP', 'Patient'],
  },
  Prescription: {
    futureTable: 'medical.dispensaciones',
    relationships: ['Patient', 'Medication'],
  },
  ContractPGP: {
    futureTable: 'medical.contracts_pgp_future',
    relationships: ['Patient', 'Consumption', 'CRHAssistEvaluation'],
  },
  Consumption: {
    futureTable: 'medical.patient_consumption_facts_future',
    relationships: ['Patient', 'ContractPGP'],
  },
  Appointment: {
    futureTable: 'medical.citas',
    relationships: ['Patient'],
  },
  LabResult: {
    futureTable: 'medical.resultados_laboratorio',
    relationships: ['Patient', 'ClinicalHistory'],
  },
  Alert: {
    futureTable: 'medical.alertas_clinicas',
    relationships: ['Patient', 'CRHAssistEvaluation'],
  },
  RecommendedAction: {
    futureTable: 'medical.crh_recommended_actions_future',
    relationships: ['Patient', 'CRHAssistEvaluation'],
  },
  CRHAssistEvaluation: {
    futureTable: 'medical.crh_assist_evaluations_future',
    relationships: ['Patient', 'ContractPGP', 'Alert', 'RecommendedAction'],
  },
  RuleCatalogItem: {
    futureTable: 'medical.crh_rule_catalog_future',
    relationships: ['CRHAssistEvaluation'],
  },
}

