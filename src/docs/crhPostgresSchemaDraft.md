# CRH PostgreSQL Schema Draft

Borrador de esquema PostgreSQL para la futura persistencia de CRH Health Intelligence y CRH Assist. No reemplaza `demoData` ni cambia el frontend actual.

## Convenciones

- Esquema sugerido: `crh`
- PK sugerida: `uuid`
- Auditoria comun: `created_at timestamptz`, `updated_at timestamptz`, `deleted_at timestamptz null`
- Dinero: `numeric(14,2)` o `numeric(16,2)` segun volumen contractual
- Porcentajes: `numeric(5,2)`
- Texto catalogado: `varchar` mientras no exista catalogo maestro

## patients

### Columnas Principales
- `id uuid`
- `document_type varchar(10)`
- `document_number varchar(30)`
- `first_name varchar(120)`
- `last_name varchar(120)`
- `birth_date date`
- `age integer`
- `sex varchar(20)`
- `phone varchar(40)`
- `address text`
- `city varchar(120)`
- `eps varchar(160)`
- `site varchar(160)`
- `primary_diagnosis text`
- `status varchar(40)`
- `contract_id uuid`
- `program varchar(160)`

### Llave Primaria
- `id`

### Llaves Foraneas
- `contract_id -> contracts_pgp.id`

### Indices Sugeridos
- `idx_patients_document` sobre `(document_type, document_number)`
- `idx_patients_contract_id` sobre `contract_id`
- `idx_patients_status` sobre `status`
- `idx_patients_eps` sobre `eps`

### Observaciones
Tabla base para Paciente 360 y evaluaciones individuales CRH Assist.

## clinical_histories

### Columnas Principales
- `id uuid`
- `patient_id uuid`
- `anamnesis text`
- `background text`
- `vital_signs jsonb`
- `cie10_diagnosis text`
- `care_plan text`
- `orders jsonb`
- `last_control_date date`
- `completeness_ratio numeric(5,4)`
- `adherence_risk boolean`
- `high_risk_diagnosis boolean`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`

### Indices Sugeridos
- `idx_clinical_histories_patient_id` sobre `patient_id`
- `idx_clinical_histories_last_control_date` sobre `last_control_date`
- `idx_clinical_histories_risk_flags` sobre `(adherence_risk, high_risk_diagnosis)`

### Observaciones
Puede evolucionar a versionamiento por atencion si se requiere trazabilidad historica completa.

## diagnoses

### Columnas Principales
- `id uuid`
- `patient_id uuid`
- `clinical_history_id uuid null`
- `cie10 varchar(20)`
- `description text`
- `high_risk boolean`
- `diagnosed_at date`
- `status varchar(40)`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`
- `clinical_history_id -> clinical_histories.id`

### Indices Sugeridos
- `idx_diagnoses_patient_id` sobre `patient_id`
- `idx_diagnoses_cie10` sobre `cie10`
- `idx_diagnoses_high_risk` sobre `high_risk`

### Observaciones
Fuente clave para reglas clinicas y segmentacion poblacional.

## medications

### Columnas Principales
- `id uuid`
- `name varchar(200)`
- `active_ingredient varchar(200) null`
- `diagnosis text`
- `contract_id uuid null`
- `monthly_cost numeric(14,2)`
- `monthly_consumption numeric(14,2)`
- `cost_type varchar(80)`
- `stock integer`
- `expiration_date date`
- `associated_patients integer`
- `contract_impact numeric(5,2)`

### Llave Primaria
- `id`

### Llaves Foraneas
- `contract_id -> contracts_pgp.id`

### Indices Sugeridos
- `idx_medications_contract_id` sobre `contract_id`
- `idx_medications_cost_type` sobre `cost_type`
- `idx_medications_expiration_date` sobre `expiration_date`

### Observaciones
Soporta Farmacia Inteligente y reglas de alto costo.

## prescriptions

### Columnas Principales
- `id uuid`
- `patient_id uuid`
- `medication_id uuid`
- `dose varchar(120)`
- `frequency varchar(120)`
- `duration varchar(120)`
- `delivery_status varchar(60)`
- `prescribed_at date`
- `observations text`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`
- `medication_id -> medications.id`

### Indices Sugeridos
- `idx_prescriptions_patient_id` sobre `patient_id`
- `idx_prescriptions_medication_id` sobre `medication_id`
- `idx_prescriptions_delivery_status` sobre `delivery_status`

### Observaciones
Permite calcular adherencia, continuidad terapeutica y brechas de dispensacion.

## contracts_pgp

### Columnas Principales
- `id uuid`
- `eps varchar(160)`
- `code varchar(80)`
- `name varchar(220)`
- `modality varchar(80)`
- `contract_value numeric(16,2)`
- `current_consumption numeric(16,2)`
- `closing_projection numeric(16,2)`
- `estimated_margin numeric(5,2)`
- `risk varchar(40)`
- `population integer`
- `deviation numeric(5,2)`

### Llave Primaria
- `id`

### Llaves Foraneas
- Ninguna obligatoria.

### Indices Sugeridos
- `idx_contracts_pgp_code` unico sobre `code`
- `idx_contracts_pgp_eps` sobre `eps`
- `idx_contracts_pgp_risk` sobre `risk`

### Observaciones
Base de Contrato PGP 360 y evaluaciones agregadas por contrato.

## consumptions

### Columnas Principales
- `id uuid`
- `patient_id uuid`
- `contract_id uuid`
- `period date`
- `accumulated_cost numeric(14,2)`
- `monthly_cost numeric(14,2)`
- `expected_monthly_cost numeric(14,2)`
- `current_cost numeric(14,2)`
- `cost_percentile integer`
- `potential_avoidable_event boolean`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`
- `contract_id -> contracts_pgp.id`

### Indices Sugeridos
- `idx_consumptions_patient_period` sobre `(patient_id, period)`
- `idx_consumptions_contract_period` sobre `(contract_id, period)`
- `idx_consumptions_cost_percentile` sobre `cost_percentile`

### Observaciones
Tabla de hechos para riesgo financiero, desviacion y prediccion de consumo.

## appointments

### Columnas Principales
- `id uuid`
- `patient_id uuid null`
- `appointment_date date`
- `appointment_time time`
- `patient_name varchar(240)`
- `professional varchar(180)`
- `specialty varchar(160)`
- `site varchar(160)`
- `status varchar(60)`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`

### Indices Sugeridos
- `idx_appointments_patient_id` sobre `patient_id`
- `idx_appointments_date` sobre `appointment_date`
- `idx_appointments_status` sobre `status`
- `idx_appointments_site` sobre `site`

### Observaciones
Puede integrarse con HIS real para oportunidad, no asistencia y continuidad.

## lab_results

### Columnas Principales
- `id uuid`
- `patient_id uuid`
- `order_code varchar(80)`
- `result_date date`
- `exam varchar(180)`
- `status varchar(60)`
- `result text`
- `file_reference text`
- `alert varchar(120)`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`

### Indices Sugeridos
- `idx_lab_results_patient_id` sobre `patient_id`
- `idx_lab_results_order_code` sobre `order_code`
- `idx_lab_results_status` sobre `status`
- `idx_lab_results_result_date` sobre `result_date`

### Observaciones
Soporta Historia Clinica Inteligente y reglas clinicas futuras.

## crh_assist_rules

### Columnas Principales
- `id varchar(120)`
- `name varchar(220)`
- `description text`
- `category varchar(80)`
- `applies_to jsonb`
- `condition jsonb`
- `weight integer`
- `severity varchar(40)`
- `enabled boolean`
- `related_module varchar(120)`
- `recommended_action text`
- `version varchar(40)`

### Llave Primaria
- `id`

### Llaves Foraneas
- Ninguna obligatoria.

### Indices Sugeridos
- `idx_crh_assist_rules_enabled` sobre `enabled`
- `idx_crh_assist_rules_category` sobre `category`
- `idx_crh_assist_rules_severity` sobre `severity`

### Observaciones
Persistencia futura del catalogo V2 sin modificar el contrato del frontend.

## crh_assist_evaluations

### Columnas Principales
- `id uuid`
- `scope varchar(40)`
- `patient_id uuid null`
- `contract_id uuid null`
- `score integer`
- `level varchar(40)`
- `clinical_risk jsonb`
- `financial_risk jsonb`
- `pgp_risk jsonb`
- `grouped_alerts jsonb`
- `recommended_actions jsonb`
- `explanation text`
- `rules_version varchar(40)`
- `enabled_rules integer`
- `evaluated_at timestamptz`

### Llave Primaria
- `id`

### Llaves Foraneas
- `patient_id -> patients.id`
- `contract_id -> contracts_pgp.id`

### Indices Sugeridos
- `idx_crh_assist_evaluations_patient_id` sobre `patient_id`
- `idx_crh_assist_evaluations_contract_id` sobre `contract_id`
- `idx_crh_assist_evaluations_score` sobre `score`
- `idx_crh_assist_evaluations_evaluated_at` sobre `evaluated_at`

### Observaciones
Puede operar como cache auditable de evaluaciones calculadas por el Rules Engine.

## crh_assist_alerts

### Columnas Principales
- `id uuid`
- `evaluation_id uuid`
- `patient_id uuid null`
- `contract_id uuid null`
- `rule_id varchar(120) null`
- `type varchar(120)`
- `severity varchar(40)`
- `title varchar(220)`
- `description text`
- `source varchar(160)`
- `recommended_action text`
- `related_module varchar(120)`

### Llave Primaria
- `id`

### Llaves Foraneas
- `evaluation_id -> crh_assist_evaluations.id`
- `patient_id -> patients.id`
- `contract_id -> contracts_pgp.id`
- `rule_id -> crh_assist_rules.id`

### Indices Sugeridos
- `idx_crh_assist_alerts_evaluation_id` sobre `evaluation_id`
- `idx_crh_assist_alerts_patient_id` sobre `patient_id`
- `idx_crh_assist_alerts_contract_id` sobre `contract_id`
- `idx_crh_assist_alerts_severity` sobre `severity`

### Observaciones
Permite trazabilidad de alertas por paciente, contrato, severidad y regla.

## recommended_actions

### Columnas Principales
- `id uuid`
- `evaluation_id uuid`
- `patient_id uuid null`
- `contract_id uuid null`
- `text text`
- `module varchar(120)`
- `priority varchar(40)`
- `status varchar(40)`
- `due_date date null`
- `assigned_to uuid null`

### Llave Primaria
- `id`

### Llaves Foraneas
- `evaluation_id -> crh_assist_evaluations.id`
- `patient_id -> patients.id`
- `contract_id -> contracts_pgp.id`

### Indices Sugeridos
- `idx_recommended_actions_evaluation_id` sobre `evaluation_id`
- `idx_recommended_actions_patient_id` sobre `patient_id`
- `idx_recommended_actions_status` sobre `status`
- `idx_recommended_actions_priority` sobre `priority`

### Observaciones
Tabla candidata para flujo operativo: asignacion, seguimiento y cierre de recomendaciones.
