# CRH Assist Backend Contract

Contrato tecnico futuro para reemplazar gradualmente `crhAssistApiMock` por una API REST Node/Express sin romper el frontend actual.

## Convenciones

- Base URL: `/api`
- Formato: JSON
- Fechas: ISO 8601 (`YYYY-MM-DD` o timestamp UTC)
- Errores: `{ "error": { "code": "string", "message": "string", "details": {} } }`
- Autenticacion futura: `Authorization: Bearer <token>`
- Version inicial sugerida: `v1`

## GET /api/patients

### Proposito
Listar pacientes disponibles para Paciente 360, Command Center y evaluaciones CRH Assist.

### Parametros
- Query opcional: `search`, `contractId`, `status`, `riskLevel`, `page`, `pageSize`.

### Request
```http
GET /api/patients?contractId=ctr-001&page=1&pageSize=20
```

### Response
```json
{
  "data": [
    {
      "id": "pac-001",
      "documentType": "CC",
      "documentNumber": "1112458796",
      "firstName": "Laura",
      "lastName": "Burbano",
      "age": 38,
      "sex": "F",
      "city": "Pasto",
      "eps": "Nueva EPS",
      "status": "Activo",
      "contractId": "ctr-001",
      "program": "Pacientes cronicos"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 1 }
}
```

### Errores Esperados
- `400 INVALID_QUERY`: filtros o paginacion invalidos.
- `401 UNAUTHORIZED`: token ausente o invalido.

### Tablas PostgreSQL Relacionadas
- `patients`
- `contracts_pgp`
- `crh_assist_evaluations`

## GET /api/patients/:id

### Proposito
Obtener la ficha base de un paciente.

### Parametros
- Path: `id` identificador del paciente.

### Request
```http
GET /api/patients/pac-001
```

### Response
```json
{
  "data": {
    "id": "pac-001",
    "documentType": "CC",
    "documentNumber": "1112458796",
    "firstName": "Laura",
    "lastName": "Burbano",
    "birthDate": "1988-02-19",
    "age": 38,
    "sex": "F",
    "phone": "3104567788",
    "address": "Cra 18 #14-22",
    "city": "Pasto",
    "eps": "Nueva EPS",
    "site": "Pasto",
    "primaryDiagnosis": "M06.9 Artritis reumatoide seropositiva",
    "status": "Activo",
    "contractId": "ctr-001",
    "program": "Pacientes cronicos"
  }
}
```

### Errores Esperados
- `404 PATIENT_NOT_FOUND`: paciente inexistente.
- `401 UNAUTHORIZED`: token ausente o invalido.

### Tablas PostgreSQL Relacionadas
- `patients`
- `contracts_pgp`

## GET /api/patients/:id/clinical-context

### Proposito
Entregar el contexto integral usado por CRH Assist para evaluar un paciente.

### Parametros
- Path: `id` identificador del paciente.
- Query opcional: `includeHistory`, `includeMedications`, `includeConsumptions`.

### Request
```http
GET /api/patients/pac-001/clinical-context
```

### Response
```json
{
  "data": {
    "patient": { "id": "pac-001", "firstName": "Laura", "lastName": "Burbano" },
    "clinicalHistory": {
      "patientId": "pac-001",
      "lastControlDate": "2026-06-10",
      "completenessRatio": 0.92,
      "adherenceRisk": false,
      "highRiskDiagnosis": true
    },
    "diagnoses": [
      { "id": "dx-001", "cie10": "M06.9", "description": "Artritis reumatoide", "highRisk": true }
    ],
    "medications": [
      { "id": "med-001", "name": "Adalimumab 40 mg", "status": "Activo", "costType": "Alto costo" }
    ],
    "contract": { "id": "ctr-001", "risk": "Rojo", "estimatedMargin": "9.2%" },
    "consumptions": {
      "patientId": "pac-001",
      "monthlyCost": 4200000,
      "expectedMonthlyCost": 2400000,
      "potentialAvoidableEvent": true
    }
  }
}
```

### Errores Esperados
- `404 PATIENT_NOT_FOUND`: paciente inexistente.
- `409 CONTEXT_INCOMPLETE`: faltan datos minimos para evaluacion.

### Tablas PostgreSQL Relacionadas
- `patients`
- `clinical_histories`
- `diagnoses`
- `medications`
- `prescriptions`
- `contracts_pgp`
- `consumptions`
- `lab_results`

## GET /api/contracts

### Proposito
Listar contratos PGP para Contrato PGP 360 y Command Center.

### Parametros
- Query opcional: `eps`, `risk`, `page`, `pageSize`.

### Request
```http
GET /api/contracts?risk=Rojo
```

### Response
```json
{
  "data": [
    {
      "id": "ctr-001",
      "eps": "Nueva EPS",
      "code": "PGP-NUE-2026-01",
      "name": "PGP Cronicos Sur Occidente",
      "modality": "PGP",
      "contractValue": 2480000000,
      "currentConsumption": 2214000000,
      "closingProjection": 2658000000,
      "estimatedMargin": 9.2,
      "risk": "Rojo",
      "population": 4620,
      "deviation": 7.2
    }
  ]
}
```

### Errores Esperados
- `400 INVALID_QUERY`: filtros invalidos.
- `401 UNAUTHORIZED`: token ausente o invalido.

### Tablas PostgreSQL Relacionadas
- `contracts_pgp`
- `patients`
- `consumptions`
- `crh_assist_evaluations`

## GET /api/contracts/:id

### Proposito
Obtener detalle de un contrato PGP.

### Parametros
- Path: `id` identificador del contrato.

### Request
```http
GET /api/contracts/ctr-001
```

### Response
```json
{
  "data": {
    "id": "ctr-001",
    "eps": "Nueva EPS",
    "code": "PGP-NUE-2026-01",
    "name": "PGP Cronicos Sur Occidente",
    "risk": "Rojo",
    "population": 4620,
    "topPatients": [
      { "patientId": "pac-001", "name": "Laura Burbano", "cost": 18600000 }
    ],
    "topMedications": [
      { "medicationId": "med-001", "name": "Adalimumab", "cost": 94000000 }
    ]
  }
}
```

### Errores Esperados
- `404 CONTRACT_NOT_FOUND`: contrato inexistente.
- `401 UNAUTHORIZED`: token ausente o invalido.

### Tablas PostgreSQL Relacionadas
- `contracts_pgp`
- `patients`
- `medications`
- `consumptions`

## GET /api/contracts/:id/patients

### Proposito
Listar pacientes asociados a un contrato PGP.

### Parametros
- Path: `id` identificador del contrato.
- Query opcional: `riskLevel`, `page`, `pageSize`.

### Request
```http
GET /api/contracts/ctr-001/patients?page=1&pageSize=20
```

### Response
```json
{
  "data": [
    {
      "id": "pac-001",
      "firstName": "Laura",
      "lastName": "Burbano",
      "contractId": "ctr-001",
      "primaryDiagnosis": "M06.9 Artritis reumatoide",
      "status": "Activo"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 1 }
}
```

### Errores Esperados
- `404 CONTRACT_NOT_FOUND`: contrato inexistente.
- `400 INVALID_QUERY`: filtros invalidos.

### Tablas PostgreSQL Relacionadas
- `contracts_pgp`
- `patients`
- `consumptions`

## GET /api/crh-assist/patient/:id

### Proposito
Evaluar o consultar la ultima evaluacion CRH Assist de un paciente.

### Parametros
- Path: `id` identificador del paciente.
- Query opcional: `refresh=true` para recalcular.

### Request
```http
GET /api/crh-assist/patient/pac-001?refresh=true
```

### Response
```json
{
  "data": {
    "patientId": "pac-001",
    "score": 71,
    "level": "alto",
    "rulesVersion": "V2",
    "enabledRules": 10,
    "clinicalRisk": { "score": 39, "level": "medio", "drivers": ["Medicamento de alto costo"] },
    "financialRisk": { "score": 59, "level": "medio", "drivers": ["Consumo superior al esperado"] },
    "pgpRisk": { "score": 47, "level": "medio", "drivers": ["Contrato PGP con margen en riesgo"] },
    "alerts": [
      {
        "id": "pac-001-pgp-margin-at-risk",
        "severity": "critica",
        "title": "Contrato PGP con margen en riesgo",
        "recommendedAction": "Escalar el caso a seguimiento clinico-financiero."
      }
    ],
    "recommendedActions": ["Programar control prioritario."],
    "explanation": "CRH Assist Score 71/100 con nivel alto."
  }
}
```

### Errores Esperados
- `404 PATIENT_NOT_FOUND`: paciente inexistente.
- `409 CONTEXT_INCOMPLETE`: datos insuficientes.
- `422 EVALUATION_FAILED`: error controlado durante evaluacion.

### Tablas PostgreSQL Relacionadas
- `patients`
- `clinical_histories`
- `diagnoses`
- `medications`
- `contracts_pgp`
- `consumptions`
- `crh_assist_rules`
- `crh_assist_evaluations`
- `crh_assist_alerts`
- `recommended_actions`

## GET /api/crh-assist/contract/:id

### Proposito
Evaluar o consultar el resumen CRH Assist de un contrato PGP.

### Parametros
- Path: `id` identificador del contrato.
- Query opcional: `refresh=true`.

### Request
```http
GET /api/crh-assist/contract/ctr-001
```

### Response
```json
{
  "data": {
    "contractId": "ctr-001",
    "score": 64,
    "level": "alto",
    "criticalAlerts": 2,
    "explanation": "3 pacientes analizados con 2 alertas criticas.",
    "evaluations": [
      {
        "patientId": "pac-001",
        "score": 71,
        "level": "alto",
        "topAlert": "Contrato PGP con margen en riesgo"
      }
    ]
  }
}
```

### Errores Esperados
- `404 CONTRACT_NOT_FOUND`: contrato inexistente.
- `409 CONTRACT_WITHOUT_PATIENTS`: contrato sin poblacion asociada.
- `422 EVALUATION_FAILED`: error controlado durante evaluacion.

### Tablas PostgreSQL Relacionadas
- `contracts_pgp`
- `patients`
- `consumptions`
- `crh_assist_evaluations`
- `crh_assist_alerts`

## GET /api/crh-assist/rules

### Proposito
Consultar el catalogo configurable de reglas CRH Assist V2.

### Parametros
- Query opcional: `enabled`, `category`, `severity`, `appliesTo`.

### Request
```http
GET /api/crh-assist/rules?enabled=true
```

### Response
```json
{
  "data": [
    {
      "id": "pgp-margin-at-risk",
      "name": "Contrato PGP con margen en riesgo",
      "description": "Marca casos con presion de margen o desvio de consumo.",
      "category": "pgp",
      "appliesTo": ["patient", "contract"],
      "condition": { "metric": "pgpMarginAtRisk", "operator": "==", "threshold": true },
      "weight": 18,
      "severity": "critica",
      "enabled": true,
      "relatedModule": "contratos-pgp",
      "recommendedAction": "Escalar el caso a seguimiento clinico-financiero."
    }
  ]
}
```

### Errores Esperados
- `400 INVALID_QUERY`: filtros invalidos.
- `401 UNAUTHORIZED`: token ausente o invalido.

### Tablas PostgreSQL Relacionadas
- `crh_assist_rules`

## PATCH /api/crh-assist/rules/:id/status

### Proposito
Activar o desactivar una regla sin desplegar frontend.

### Parametros
- Path: `id` identificador de regla.
- Body: `enabled` booleano.

### Request
```http
PATCH /api/crh-assist/rules/pgp-margin-at-risk/status
Content-Type: application/json

{ "enabled": false }
```

### Response
```json
{
  "data": {
    "id": "pgp-margin-at-risk",
    "enabled": false,
    "updatedAt": "2026-06-13T17:30:00.000Z",
    "updatedBy": "user-001"
  }
}
```

### Errores Esperados
- `404 RULE_NOT_FOUND`: regla inexistente.
- `400 INVALID_BODY`: `enabled` no es booleano.
- `403 FORBIDDEN`: usuario sin permiso de administracion.

### Tablas PostgreSQL Relacionadas
- `crh_assist_rules`

## POST /api/crh-assist/evaluate

### Proposito
Ejecutar una evaluacion ad hoc de CRH Assist con contexto persistido o payload temporal.

### Parametros
- Body: `patientId` o `contractId`; opcional `context`, `persist`, `rulesVersion`.

### Request
```http
POST /api/crh-assist/evaluate
Content-Type: application/json

{
  "patientId": "pac-001",
  "persist": true,
  "rulesVersion": "V2"
}
```

### Response
```json
{
  "data": {
    "evaluationId": "eval-001",
    "scope": "patient",
    "patientId": "pac-001",
    "score": 71,
    "level": "alto",
    "alertsCount": 4,
    "recommendedActionsCount": 5,
    "rulesVersion": "V2",
    "createdAt": "2026-06-13T17:30:00.000Z"
  }
}
```

### Errores Esperados
- `400 INVALID_BODY`: falta `patientId`, `contractId` o contexto evaluable.
- `404 PATIENT_NOT_FOUND`: paciente inexistente.
- `404 CONTRACT_NOT_FOUND`: contrato inexistente.
- `409 CONTEXT_INCOMPLETE`: contexto insuficiente.
- `422 EVALUATION_FAILED`: error controlado durante evaluacion.

### Tablas PostgreSQL Relacionadas
- `patients`
- `contracts_pgp`
- `clinical_histories`
- `diagnoses`
- `medications`
- `consumptions`
- `crh_assist_rules`
- `crh_assist_evaluations`
- `crh_assist_alerts`
- `recommended_actions`
