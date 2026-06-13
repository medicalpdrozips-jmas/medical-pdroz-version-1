create schema if not exists crh;

create table if not exists crh.contracts_pgp (
  id uuid primary key,
  eps varchar(160) not null,
  code varchar(80) not null unique,
  name varchar(220) not null,
  modality varchar(80) not null default 'PGP',
  contract_value numeric(16,2),
  current_consumption numeric(16,2),
  closing_projection numeric(16,2),
  estimated_margin numeric(5,2),
  risk varchar(40),
  population integer,
  deviation numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.patients (
  id uuid primary key,
  document_type varchar(10) not null,
  document_number varchar(30) not null,
  first_name varchar(120) not null,
  last_name varchar(120) not null,
  birth_date date,
  age integer,
  sex varchar(20),
  phone varchar(40),
  address text,
  city varchar(120),
  eps varchar(160),
  site varchar(160),
  primary_diagnosis text,
  status varchar(40),
  contract_id uuid references crh.contracts_pgp(id),
  program varchar(160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (document_type, document_number)
);

create table if not exists crh.clinical_histories (
  id uuid primary key,
  patient_id uuid not null references crh.patients(id),
  anamnesis text,
  background text,
  vital_signs jsonb,
  cie10_diagnosis text,
  care_plan text,
  orders jsonb,
  last_control_date date,
  completeness_ratio numeric(5,4),
  adherence_risk boolean default false,
  high_risk_diagnosis boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.diagnoses (
  id uuid primary key,
  patient_id uuid not null references crh.patients(id),
  clinical_history_id uuid references crh.clinical_histories(id),
  cie10 varchar(20),
  description text not null,
  high_risk boolean default false,
  diagnosed_at date,
  status varchar(40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.medications (
  id uuid primary key,
  name varchar(200) not null,
  active_ingredient varchar(200),
  diagnosis text,
  contract_id uuid references crh.contracts_pgp(id),
  monthly_cost numeric(14,2),
  monthly_consumption numeric(14,2),
  cost_type varchar(80),
  stock integer,
  expiration_date date,
  associated_patients integer,
  contract_impact numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.prescriptions (
  id uuid primary key,
  patient_id uuid not null references crh.patients(id),
  medication_id uuid not null references crh.medications(id),
  dose varchar(120),
  frequency varchar(120),
  duration varchar(120),
  delivery_status varchar(60),
  prescribed_at date,
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.consumptions (
  id uuid primary key,
  patient_id uuid not null references crh.patients(id),
  contract_id uuid not null references crh.contracts_pgp(id),
  period date not null,
  accumulated_cost numeric(14,2),
  monthly_cost numeric(14,2),
  expected_monthly_cost numeric(14,2),
  current_cost numeric(14,2),
  cost_percentile integer,
  potential_avoidable_event boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.appointments (
  id uuid primary key,
  patient_id uuid references crh.patients(id),
  appointment_date date not null,
  appointment_time time,
  patient_name varchar(240),
  professional varchar(180),
  specialty varchar(160),
  site varchar(160),
  status varchar(60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.lab_results (
  id uuid primary key,
  patient_id uuid not null references crh.patients(id),
  order_code varchar(80),
  result_date date,
  exam varchar(180),
  status varchar(60),
  result text,
  file_reference text,
  alert varchar(120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.crh_assist_rules (
  id varchar(120) primary key,
  name varchar(220) not null,
  description text,
  category varchar(80) not null,
  applies_to jsonb,
  condition jsonb,
  weight integer not null default 0,
  severity varchar(40) not null,
  enabled boolean not null default true,
  related_module varchar(120),
  recommended_action text,
  version varchar(40) not null default 'V2',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.crh_assist_evaluations (
  id uuid primary key,
  scope varchar(40) not null,
  patient_id uuid references crh.patients(id),
  contract_id uuid references crh.contracts_pgp(id),
  score integer not null,
  level varchar(40) not null,
  clinical_risk jsonb,
  financial_risk jsonb,
  pgp_risk jsonb,
  grouped_alerts jsonb,
  recommended_actions jsonb,
  explanation text,
  rules_version varchar(40),
  enabled_rules integer,
  evaluated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.crh_assist_alerts (
  id uuid primary key,
  evaluation_id uuid not null references crh.crh_assist_evaluations(id),
  patient_id uuid references crh.patients(id),
  contract_id uuid references crh.contracts_pgp(id),
  rule_id varchar(120) references crh.crh_assist_rules(id),
  type varchar(120),
  severity varchar(40) not null,
  title varchar(220) not null,
  description text,
  source varchar(160),
  recommended_action text,
  related_module varchar(120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists crh.recommended_actions (
  id uuid primary key,
  evaluation_id uuid not null references crh.crh_assist_evaluations(id),
  patient_id uuid references crh.patients(id),
  contract_id uuid references crh.contracts_pgp(id),
  text text not null,
  module varchar(120),
  priority varchar(40),
  status varchar(40) not null default 'pending',
  due_date date,
  assigned_to uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_patients_contract_id on crh.patients(contract_id);
create index if not exists idx_patients_status on crh.patients(status);
create index if not exists idx_clinical_histories_patient_id on crh.clinical_histories(patient_id);
create index if not exists idx_diagnoses_patient_id on crh.diagnoses(patient_id);
create index if not exists idx_medications_contract_id on crh.medications(contract_id);
create index if not exists idx_prescriptions_patient_id on crh.prescriptions(patient_id);
create index if not exists idx_consumptions_patient_period on crh.consumptions(patient_id, period);
create index if not exists idx_consumptions_contract_period on crh.consumptions(contract_id, period);
create index if not exists idx_appointments_patient_id on crh.appointments(patient_id);
create index if not exists idx_appointments_date on crh.appointments(appointment_date);
create index if not exists idx_lab_results_patient_id on crh.lab_results(patient_id);
create index if not exists idx_crh_assist_rules_enabled on crh.crh_assist_rules(enabled);
create index if not exists idx_crh_assist_rules_category on crh.crh_assist_rules(category);
create index if not exists idx_crh_assist_evaluations_patient_id on crh.crh_assist_evaluations(patient_id);
create index if not exists idx_crh_assist_evaluations_contract_id on crh.crh_assist_evaluations(contract_id);
create index if not exists idx_crh_assist_alerts_evaluation_id on crh.crh_assist_alerts(evaluation_id);
create index if not exists idx_crh_assist_alerts_severity on crh.crh_assist_alerts(severity);
create index if not exists idx_recommended_actions_evaluation_id on crh.recommended_actions(evaluation_id);
create index if not exists idx_recommended_actions_status on crh.recommended_actions(status);
