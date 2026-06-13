insert into crh.contracts_pgp (
  id, eps, code, name, modality, contract_value, current_consumption, closing_projection,
  estimated_margin, risk, population, deviation, top_patients, top_medications, alerts
) values
  (
    'ctr-001', 'Nueva EPS', 'PGP-NUE-2026-01', 'PGP Cronicos Sur Occidente', 'PGP',
    2480000000, 2214000000, 2658000000, 9.2, 'Rojo', 4620, 7.2,
    '[{"paciente":"Laura Burbano","costo":"$18,6 M","diagnostico":"Artritis reumatoide"}]'::jsonb,
    '[{"medicamento":"Adalimumab","costo":"$94 M","impacto":"4,2%"}]'::jsonb,
    '["Aumento de consumo por pacientes con terapias biologicas activas."]'::jsonb
  ),
  (
    'ctr-002', 'Sanitas', 'PGP-SAN-2026-03', 'PGP Dermatologia Integral', 'PGP',
    1120000000, 894000000, 1018000000, 14.1, 'Amarillo', 1980, 2.1,
    '[{"paciente":"Juan David Lasso","costo":"$11,2 M","diagnostico":"Psoriasis"}]'::jsonb,
    '[{"medicamento":"Secukinumab","costo":"$56 M","impacto":"6,2%"}]'::jsonb,
    '["Dos terapias biologicas superan meta mensual de consumo."]'::jsonb
  )
on conflict (id) do nothing;

insert into crh.patients (
  id, document_type, document_number, first_name, last_name, age, sex, city, eps, site,
  primary_diagnosis, status, contract_id, program, risk_clinical, risk_financial, accumulated_cost_display
) values
  (
    'pac-001', 'CC', '1112458796', 'Laura', 'Burbano', 38, 'F', 'Pasto', 'Nueva EPS', 'Pasto',
    'M06.9 Artritis reumatoide seropositiva', 'Activo', 'ctr-001', 'Pacientes cronicos', 'Alto', 'Alto', '$18,6 M'
  ),
  (
    'pac-002', 'CC', '1032457712', 'Juan David', 'Lasso', 50, 'M', 'Popayan', 'Sanitas', 'Popayan',
    'L40.0 Psoriasis con terapia biologica', 'Seguimiento', 'ctr-002', 'Dermatologia', 'Medio', 'Alto', '$11,2 M'
  )
on conflict (id) do nothing;

insert into crh.clinical_histories (
  id, patient_id, anamnesis, background, vital_signs, cie10_diagnosis, care_plan, orders,
  last_control_date, completeness_ratio, adherence_risk, high_risk_diagnosis
) values
  (
    'hist-pac-001', 'pac-001', 'Paciente con artralgias persistentes.', 'Artritis reumatoide seropositiva.',
    '[{"label":"TA","value":"118/72 mmHg"}]'::jsonb, 'M06.9 Artritis reumatoide seropositiva',
    'Mantener control reumatologico.', '["Control por reumatologia"]'::jsonb,
    '2026-06-10', 0.90, false, true
  ),
  (
    'hist-pac-002', 'pac-002', 'Paciente en seguimiento dermatologico.', 'Psoriasis con biologico.',
    '[{"label":"TA","value":"110/70 mmHg"}]'::jsonb, 'L40.0 Psoriasis vulgar severa',
    'Revisar continuidad terapeutica.', '["Control por dermatologia"]'::jsonb,
    '2026-06-08', 0.85, true, false
  )
on conflict (id) do nothing;

insert into crh.diagnoses (
  id, patient_id, clinical_history_id, cie10, description, high_risk, status
) values
  ('dx-pac-001', 'pac-001', 'hist-pac-001', 'M06.9', 'M06.9 Artritis reumatoide seropositiva', true, 'Activo'),
  ('dx-pac-002', 'pac-002', 'hist-pac-002', 'L40.0', 'L40.0 Psoriasis vulgar severa', false, 'Activo')
on conflict (id) do nothing;

insert into crh.medications (
  id, name, diagnosis, contract_id, monthly_cost, monthly_consumption, cost_type,
  stock, expiration_date, associated_patients, contract_impact, patient_name
) values
  (
    'med-001', 'Adalimumab 40 mg', 'Artritis reumatoide', 'ctr-001', 3800000, 94000000,
    'Alto costo', 12, '2026-08-30', 28, 4.2, 'Laura Burbano'
  ),
  (
    'med-002', 'Secukinumab 150 mg', 'Psoriasis', 'ctr-002', 3100000, 56000000,
    'Alto costo', 8, '2026-07-22', 17, 6.2, 'Juan David Lasso'
  )
on conflict (id) do nothing;

insert into crh.prescriptions (
  id, patient_id, medication_id, dose, frequency, duration, delivery_status, prescribed_at, observations
) values
  (
    'rx-pac-001-med-001', 'pac-001', 'med-001', '40 mg', 'Quincenal', '6 meses',
    'Activo', '2026-06-10', 'Validar adherencia clinica.'
  ),
  (
    'rx-pac-002-med-002', 'pac-002', 'med-002', '150 mg', 'Mensual', '12 meses',
    'Activo', '2026-06-08', 'Continuidad sujeta a respuesta.'
  )
on conflict (id) do nothing;

insert into crh.consumptions (
  id, patient_id, contract_id, period, accumulated_cost, monthly_cost, expected_monthly_cost, current_cost, cost_percentile, potential_avoidable_event
) values
  (
    'cons-pac-001', 'pac-001', 'ctr-001', '2026-06-01', 18600000, 4200000, 2400000, 4200000, 97, true
  ),
  (
    'cons-pac-002', 'pac-002', 'ctr-002', '2026-06-01', 11200000, 3500000, 2100000, 3500000, 93, false
  )
on conflict (id) do nothing;

insert into crh.appointments (
  id, patient_id, appointment_date, appointment_time, patient_name, professional, specialty, site, status
) values
  (
    'apt-001', 'pac-001', '2026-06-13', '07:30', 'Laura Burbano', 'Dra. Paula Gomez', 'Reumatologia', 'Pasto', 'Programada'
  ),
  (
    'apt-002', 'pac-002', '2026-06-13', '08:15', 'Juan David Lasso', 'Dr. Esteban Mina', 'Dermatologia', 'Popayan', 'Atendida'
  )
on conflict (id) do nothing;

insert into crh.lab_results (
  id, patient_id, order_code, result_date, exam, status, result, file_reference, alert
) values
  (
    'lab-001', 'pac-001', 'LAB-2041', '2026-06-13', 'PCR y VSG', 'Pendiente', 'En proceso', 'PCR-VSG-demo.pdf', 'Prioridad media'
  ),
  (
    'lab-002', 'pac-002', 'LAB-2042', '2026-06-13', 'Biopsia cutanea', 'Pendiente', 'En revision', 'biopsia-demo.pdf', 'Logistica'
  )
on conflict (id) do nothing;

insert into crh.crh_assist_rules (
  id, name, description, category, applies_to, condition, weight, severity, enabled, related_module, recommended_action, version
) values
  (
    'follow-up-gap', 'Paciente sin control reciente',
    'Detecta pacientes con brecha relevante desde su ultimo control clinico.',
    'clinical', '["patient","history"]'::jsonb,
    '{"metric":"daysSinceLastControl","operator":">","threshold":30}'::jsonb,
    14, 'alta', true, 'historia-clinica',
    'Programar control prioritario y verificar continuidad asistencial.', 'V2'
  ),
  (
    'pgp-margin-at-risk', 'Contrato PGP con margen en riesgo',
    'Marca casos donde el contrato asociado muestra presion de margen o desvio de consumo.',
    'pgp', '["patient","contract"]'::jsonb,
    '{"metric":"pgpMarginAtRisk","operator":"==","threshold":true}'::jsonb,
    18, 'critica', true, 'contratos-pgp',
    'Escalar el caso a seguimiento clinico-financiero.', 'V2'
  ),
  (
    'high-cost-medication', 'Medicamento de alto costo',
    'Identifica terapias con alto impacto farmacoeconomico.',
    'medication', '["patient","medications"]'::jsonb,
    '{"metric":"hasHighCostMedication","operator":"==","threshold":true}'::jsonb,
    12, 'alta', true, 'medicamentos',
    'Correlacionar respuesta clinica e impacto contractual.', 'V2'
  )
on conflict (id) do nothing;
