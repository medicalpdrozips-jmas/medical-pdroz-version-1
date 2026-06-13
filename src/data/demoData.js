import { crhAssistRuleCatalog } from '../engine/crhAssistRuleCatalog'
import { evaluateCRHAssist, getEnabledRules } from '../engine/crhAssistRulesEngine'

export const summaryCards = [
  { label: 'Pacientes activos', value: '12.580', delta: '+4,8%', tone: 'primary' },
  { label: 'Pacientes alto riesgo', value: '1.126', delta: 'Seguimiento intensivo', tone: 'warning' },
  { label: 'Contratos PGP activos', value: '14', delta: '6 críticos', tone: 'success' },
  { label: 'Consumo mensual estimado', value: '$3.480 M', delta: '+6,2%', tone: 'primary' },
  { label: 'Medicamentos alto costo', value: '82', delta: '17 priorizados', tone: 'warning' },
  { label: 'Riesgo financiero proyectado', value: '18%', delta: 'Cierre junio', tone: 'danger' },
  { label: 'Alertas críticas', value: '23', delta: '8 hoy', tone: 'danger' },
]

export const crhCommandCenterKpis = [
  { label: 'Pacientes activos', value: '12.580', meta: 'Base poblacional en seguimiento institucional', tone: 'primary' },
  { label: 'Pacientes alto riesgo', value: '1.126', meta: 'Riesgo clínico y de costo con prioridad de intervención', tone: 'warning' },
  { label: 'Contratos PGP activos', value: '14', meta: 'Acuerdos con seguimiento clínico-financiero continuo', tone: 'success' },
  { label: 'Consumo mensual estimado', value: '$3.480 M', meta: 'Proyección consolidada de gasto asistencial', tone: 'primary' },
  { label: 'Medicamentos alto costo', value: '82', meta: 'Pacientes y moléculas con mayor peso presupuestal', tone: 'warning' },
  { label: 'Riesgo financiero proyectado', value: '18%', meta: 'Presión esperada sobre margen y suficiencia PGP', tone: 'danger' },
  { label: 'Alertas críticas', value: '23', meta: 'Eventos que requieren decisión directiva o clínica', tone: 'danger' },
]

export const crhStrategicAlerts = [
  {
    title: 'Paciente 360',
    message: '146 usuarios concentran el 38% del costo acumulado del mes.',
    tone: 'warning',
  },
  {
    title: 'Contrato PGP 360',
    message: 'SUR-CAU-001 cerraría con desviación de +7,2% si no se interviene.',
    tone: 'danger',
  },
  {
    title: 'Farmacia inteligente',
    message: 'Tres biológicos explican el 41% del impacto farmacéutico total.',
    tone: 'primary',
  },
  {
    title: 'CRH Assist',
    message: '32 pacientes crónicos siguen sin control clínico en los últimos 90 días.',
    tone: 'warning',
  },
]

export const crhDecisionPanels = [
  {
    title: 'Paciente 360',
    value: '146',
    description: 'Pacientes con mayor combinación de riesgo clínico, costo y oportunidad perdida.',
    trend: 'Intervención priorizada',
  },
  {
    title: 'Contrato PGP 360',
    value: '$286 M',
    description: 'Desviación consolidada proyectada en contratos con mayor presión de consumo.',
    trend: 'Riesgo moderado alto',
  },
  {
    title: 'Farmacia inteligente',
    value: '41%',
    description: 'Participación del top 3 de medicamentos alto costo sobre gasto farmacéutico.',
    trend: 'Concentración elevada',
  },
  {
    title: 'Historia clínica inteligente',
    value: '78%',
    description: 'Historias con consistencia diagnóstica y recomendación de siguiente acción.',
    trend: '+11 pts',
  },
]

export const crhFinancialSignals = [
  { label: 'Margen PGP estimado', value: '9,4%', meta: 'Concentrado en 4 contratos saludables' },
  { label: 'Riesgo de sobreconsumo', value: '$286 M', meta: 'Desviación potencial acumulada al cierre' },
  { label: 'Ahorro recuperable', value: '$94 M', meta: 'Oportunidad por reconducción clínica y seguimiento' },
  { label: 'Pacientes sin control', value: '32', meta: 'Riesgo de consumo evitable y descompensación' },
]

export const patients = [
  {
    id: 'pac-001',
    tipoDocumento: 'CC',
    numeroDocumento: '1112458796',
    nombres: 'Laura',
    apellidos: 'Burbano',
    fechaNacimiento: '1988-02-19',
    edad: 38,
    sexo: 'F',
    telefono: '310 456 7788',
    direccion: 'Cra 18 #14-22',
    ciudad: 'Pasto',
    eps: 'Nueva EPS',
    sede: 'Pasto',
    diagnostico: 'M06.9 Artritis reumatoide seropositiva',
    estado: 'Activo',
    contratoId: 'ctr-001',
    programa: 'Pacientes crónicos',
    riesgoClinico: 'Alto',
    riesgoFinanciero: 'Alto',
    costoAcumulado: '$18,6 M',
    proximaAccionIa: 'Priorizar control reumatológico y adherencia a biológico.',
  },
  {
    id: 'pac-002',
    tipoDocumento: 'CC',
    numeroDocumento: '1032457712',
    nombres: 'Juan David',
    apellidos: 'Lasso',
    fechaNacimiento: '1975-11-03',
    edad: 50,
    sexo: 'M',
    telefono: '315 244 8890',
    direccion: 'Cl 7 #4-60',
    ciudad: 'Popayán',
    eps: 'Sanitas',
    sede: 'Popayán',
    diagnostico: 'L40.0 Psoriasis con terapia biológica',
    estado: 'Seguimiento',
    contratoId: 'ctr-002',
    programa: 'Dermatología',
    riesgoClinico: 'Medio',
    riesgoFinanciero: 'Alto',
    costoAcumulado: '$11,2 M',
    proximaAccionIa: 'Conciliar consumo biológico con respuesta terapéutica.',
  },
  {
    id: 'pac-003',
    tipoDocumento: 'TI',
    numeroDocumento: '1098337641',
    nombres: 'Mariana',
    apellidos: 'Córdoba',
    fechaNacimiento: '2006-05-28',
    edad: 20,
    sexo: 'F',
    telefono: '320 917 2201',
    direccion: 'Mz 3 Casa 18',
    ciudad: 'Cali',
    eps: 'Sura',
    sede: 'Cali',
    diagnostico: 'B20 Seguimiento VIH con carga viral inestable',
    estado: 'Activo',
    contratoId: 'ctr-003',
    programa: 'VIH / Pacientes Vida',
    riesgoClinico: 'Alto',
    riesgoFinanciero: 'Medio',
    costoAcumulado: '$7,4 M',
    proximaAccionIa: 'Activar control de adherencia y laboratorio en 7 días.',
  },
  {
    id: 'pac-004',
    tipoDocumento: 'CE',
    numeroDocumento: '52044119',
    nombres: 'Carlos',
    apellidos: 'Narváez',
    fechaNacimiento: '1963-09-12',
    edad: 62,
    sexo: 'M',
    telefono: '316 500 1455',
    direccion: 'Cl 22 #9-88',
    ciudad: 'Neiva',
    eps: 'Coosalud',
    sede: 'Neiva',
    diagnostico: 'I10 Hipertensión y ERC estadio 3',
    estado: 'Control',
    contratoId: 'ctr-001',
    programa: 'Pacientes crónicos',
    riesgoClinico: 'Medio',
    riesgoFinanciero: 'Medio',
    costoAcumulado: '$5,8 M',
    proximaAccionIa: 'Ajustar control renal y reducir inasistencia en laboratorio.',
  },
  {
    id: 'pac-005',
    tipoDocumento: 'CC',
    numeroDocumento: '1017745098',
    nombres: 'Sandra',
    apellidos: 'Muñoz',
    fechaNacimiento: '1992-01-16',
    edad: 34,
    sexo: 'F',
    telefono: '300 901 7710',
    direccion: 'Cr 14 #32-19',
    ciudad: 'Pereira',
    eps: 'Emssanar',
    sede: 'Pereira',
    diagnostico: 'M79.7 Fibromialgia y dolor crónico',
    estado: 'Activo',
    contratoId: 'ctr-004',
    programa: 'Reumatología',
    riesgoClinico: 'Medio',
    riesgoFinanciero: 'Bajo',
    costoAcumulado: '$3,1 M',
    proximaAccionIa: 'Fortalecer educación y racionalizar ayudas diagnósticas.',
  },
  {
    id: 'pac-006',
    tipoDocumento: 'CC',
    numeroDocumento: '1024458916',
    nombres: 'Fredy',
    apellidos: 'Cuéllar',
    fechaNacimiento: '1981-07-08',
    edad: 44,
    sexo: 'M',
    telefono: '312 776 4410',
    direccion: 'Br San Judas',
    ciudad: 'Florencia',
    eps: 'Asmet Salud',
    sede: 'Florencia',
    diagnostico: 'E11 Diabetes tipo 2 descompensada',
    estado: 'Pendiente',
    contratoId: 'ctr-001',
    programa: 'Pacientes crónicos',
    riesgoClinico: 'Alto',
    riesgoFinanciero: 'Medio',
    costoAcumulado: '$6,2 M',
    proximaAccionIa: 'Cerrar brecha de control y evitar urgencias por descompensación.',
  },
]

export const crhContracts = [
  {
    id: 'ctr-001',
    eps: 'Nueva EPS',
    codigo: 'PGP-NUE-2026-01',
    nombre: 'PGP Crónicos Sur Occidente',
    modalidad: 'PGP',
    valorContrato: '$2.480 M',
    consumoActual: '$2.214 M',
    proyeccionCierre: '$2.658 M',
    margenEstimado: '9,2%',
    riesgo: 'Rojo',
    poblacion: 4620,
    desviacion: '+7,2%',
    pacientesTop: [
      { paciente: 'Laura Burbano', costo: '$18,6 M', diagnostico: 'Artritis reumatoide' },
      { paciente: 'Carlos Narváez', costo: '$5,8 M', diagnostico: 'ERC + hipertensión' },
      { paciente: 'Fredy Cuéllar', costo: '$6,2 M', diagnostico: 'Diabetes descompensada' },
    ],
    medicamentosTop: [
      { medicamento: 'Adalimumab', costo: '$94 M', impacto: '4,2%' },
      { medicamento: 'Insulina Glargina', costo: '$38 M', impacto: '1,8%' },
      { medicamento: 'Metotrexato', costo: '$21 M', impacto: '1,0%' },
    ],
    alertas: [
      'Aumento de consumo por pacientes con terapias biológicas activas.',
      'Brecha de seguimiento en diabetes con potencial de urgencias evitables.',
      'Margen presionado por alta concentración de gasto en 26 pacientes.',
    ],
  },
  {
    id: 'ctr-002',
    eps: 'Sanitas',
    codigo: 'PGP-SAN-2026-03',
    nombre: 'PGP Dermatología Integral',
    modalidad: 'PGP',
    valorContrato: '$1.120 M',
    consumoActual: '$894 M',
    proyeccionCierre: '$1.018 M',
    margenEstimado: '14,1%',
    riesgo: 'Amarillo',
    poblacion: 1980,
    desviacion: '+2,1%',
    pacientesTop: [
      { paciente: 'Juan David Lasso', costo: '$11,2 M', diagnostico: 'Psoriasis' },
      { paciente: 'Natalia Rivera', costo: '$8,1 M', diagnostico: 'Dermatitis atópica severa' },
      { paciente: 'Sara Tovar', costo: '$7,8 M', diagnostico: 'Lupus cutáneo' },
    ],
    medicamentosTop: [
      { medicamento: 'Secukinumab', costo: '$56 M', impacto: '6,2%' },
      { medicamento: 'Tacrolimus tópico', costo: '$12 M', impacto: '1,3%' },
      { medicamento: 'Dupilumab', costo: '$44 M', impacto: '4,9%' },
    ],
    alertas: [
      'Dos terapias biológicas superan meta mensual de consumo.',
      'Contrato todavía dentro de rango, pero con presión farmacéutica.',
    ],
  },
  {
    id: 'ctr-003',
    eps: 'Sura',
    codigo: 'PGP-SUR-2026-02',
    nombre: 'PGP VIH Vida Integral',
    modalidad: 'PGP',
    valorContrato: '$980 M',
    consumoActual: '$712 M',
    proyeccionCierre: '$901 M',
    margenEstimado: '18,3%',
    riesgo: 'Verde',
    poblacion: 1240,
    desviacion: '-3,4%',
    pacientesTop: [
      { paciente: 'Mariana Córdoba', costo: '$7,4 M', diagnostico: 'VIH con adherencia variable' },
      { paciente: 'Diego Cortés', costo: '$6,8 M', diagnostico: 'VIH + coinfección' },
      { paciente: 'Paula Cerón', costo: '$6,2 M', diagnostico: 'VIH estable' },
    ],
    medicamentosTop: [
      { medicamento: 'Dolutegravir', costo: '$31 M', impacto: '4,3%' },
      { medicamento: 'Tenofovir', costo: '$19 M', impacto: '2,6%' },
      { medicamento: 'Lamivudina', costo: '$14 M', impacto: '2,0%' },
    ],
    alertas: [
      'Buen comportamiento financiero con oportunidad de mejorar adherencia.',
    ],
  },
  {
    id: 'ctr-004',
    eps: 'Emssanar',
    codigo: 'PGP-EMS-2026-07',
    nombre: 'PGP Reumatología Eje Cafetero',
    modalidad: 'PGP',
    valorContrato: '$860 M',
    consumoActual: '$648 M',
    proyeccionCierre: '$826 M',
    margenEstimado: '11,6%',
    riesgo: 'Amarillo',
    poblacion: 980,
    desviacion: '+1,4%',
    pacientesTop: [
      { paciente: 'Sandra Muñoz', costo: '$3,1 M', diagnostico: 'Fibromialgia' },
      { paciente: 'Paola Peña', costo: '$8,4 M', diagnostico: 'Lupus eritematoso' },
      { paciente: 'César Becerra', costo: '$7,9 M', diagnostico: 'Artritis psoriásica' },
    ],
    medicamentosTop: [
      { medicamento: 'Rituximab', costo: '$49 M', impacto: '7,6%' },
      { medicamento: 'Prednisolona', costo: '$3 M', impacto: '0,4%' },
      { medicamento: 'Hidroxicloroquina', costo: '$9 M', impacto: '1,3%' },
    ],
    alertas: [
      'Margen saludable con vigilancia sobre terapias inmunomoduladoras.',
    ],
  },
]

export const contractIntelligenceById = {
  'ctr-001': {
    expectedBudget: '$2.480 M',
    consumedBudget: '$2.214 M',
    projectedConsumption: '$2.658 M',
    deviationPercent: '+7,2%',
    riskLevel: 'critico',
    marginStatus: 'Margen comprometido',
    overrunRisk: 'Alto',
    concentrationRisk: 'Alto',
    highCostPatientsRisk: 'Alto',
    topCostPatients: [
      { name: 'Laura Burbano', cost: '$18,6 M', share: '18%', diagnosis: 'Artritis reumatoide' },
      { name: 'Fredy Cuellar', cost: '$6,2 M', share: '11%', diagnosis: 'Diabetes descompensada' },
      { name: 'Carlos Narvaez', cost: '$5,8 M', share: '9%', diagnosis: 'ERC + hipertension' },
    ],
    topCostMedications: [
      { name: 'Adalimumab', cost: '$94 M', share: '4,2%', type: 'Biologico' },
      { name: 'Insulina Glargina', cost: '$38 M', share: '1,8%', type: 'Cronico' },
      { name: 'Metotrexato', cost: '$21 M', share: '1,0%', type: 'Seguimiento' },
    ],
    topDiagnoses: [
      { name: 'Artritis reumatoide activa', cost: '$126 M', share: '28%' },
      { name: 'Diabetes descompensada', cost: '$74 M', share: '17%' },
      { name: 'ERC e hipertension', cost: '$49 M', share: '11%' },
    ],
    monthlyTrend: [
      { month: 'Ene', value: '$318 M' },
      { month: 'Feb', value: '$336 M' },
      { month: 'Mar', value: '$354 M' },
      { month: 'Abr', value: '$368 M' },
      { month: 'May', value: '$401 M' },
      { month: 'Jun', value: '$437 M' },
    ],
    recommendedActions: [
      'Escalar a comite clinico-financiero los tres pacientes con mayor desviacion acumulada.',
      'Renegociar continuidad de biologicos contra evidencia documentada de respuesta terapeutica.',
      'Cerrar brechas de seguimiento diabetologico para contener urgencias evitables en el cierre del trimestre.',
    ],
    smartAlerts: [
      'El contrato cerraria por encima del presupuesto si no se corrige la tendencia de biologicos.',
      'La concentracion del gasto en menos de 30 pacientes ya presiona el margen PGP.',
      'Los eventos evitables en cronicos siguen siendo el principal multiplicador de sobrecosto.',
    ],
  },
  'ctr-002': {
    expectedBudget: '$1.120 M',
    consumedBudget: '$894 M',
    projectedConsumption: '$1.018 M',
    deviationPercent: '+2,1%',
    riskLevel: 'medio',
    marginStatus: 'Margen vigilado',
    overrunRisk: 'Medio',
    concentrationRisk: 'Alto',
    highCostPatientsRisk: 'Medio',
    topCostPatients: [
      { name: 'Juan David Lasso', cost: '$11,2 M', share: '16%', diagnosis: 'Psoriasis' },
      { name: 'Natalia Rivera', cost: '$8,1 M', share: '12%', diagnosis: 'Dermatitis atopica severa' },
      { name: 'Sara Tovar', cost: '$7,8 M', share: '11%', diagnosis: 'Lupus cutaneo' },
    ],
    topCostMedications: [
      { name: 'Secukinumab', cost: '$56 M', share: '6,2%', type: 'Biologico' },
      { name: 'Dupilumab', cost: '$44 M', share: '4,9%', type: 'Biologico' },
      { name: 'Tacrolimus topico', cost: '$12 M', share: '1,3%', type: 'Seguimiento' },
    ],
    topDiagnoses: [
      { name: 'Psoriasis severa', cost: '$88 M', share: '25%' },
      { name: 'Dermatitis atopica', cost: '$61 M', share: '17%' },
      { name: 'Lupus cutaneo', cost: '$39 M', share: '11%' },
    ],
    monthlyTrend: [
      { month: 'Ene', value: '$126 M' },
      { month: 'Feb', value: '$131 M' },
      { month: 'Mar', value: '$142 M' },
      { month: 'Abr', value: '$154 M' },
      { month: 'May', value: '$166 M' },
      { month: 'Jun', value: '$175 M' },
    ],
    recommendedActions: [
      'Vincular respuesta clinica y costo antes de autorizar nuevos ciclos de biologicos.',
      'Negociar seguimiento mas estricto de los dos farmacos que concentran el gasto dermatologico.',
      'Auditar continuidad y cambio terapeutico en pacientes con beneficio parcial sostenido.',
    ],
    smartAlerts: [
      'Dos medicamentos concentran mas del 11% del consumo contractual acumulado.',
      'La desviacion sigue controlable, pero el peso farmacologico puede erosionar el margen.',
    ],
  },
  'ctr-003': {
    expectedBudget: '$980 M',
    consumedBudget: '$712 M',
    projectedConsumption: '$901 M',
    deviationPercent: '-3,4%',
    riskLevel: 'bajo',
    marginStatus: 'Margen saludable',
    overrunRisk: 'Bajo',
    concentrationRisk: 'Medio',
    highCostPatientsRisk: 'Medio',
    topCostPatients: [
      { name: 'Mariana Cordoba', cost: '$7,4 M', share: '13%', diagnosis: 'VIH con adherencia variable' },
      { name: 'Diego Cortes', cost: '$6,8 M', share: '11%', diagnosis: 'VIH + coinfeccion' },
      { name: 'Paula Ceron', cost: '$6,2 M', share: '10%', diagnosis: 'VIH estable' },
    ],
    topCostMedications: [
      { name: 'Dolutegravir', cost: '$31 M', share: '4,3%', type: 'Antirretroviral' },
      { name: 'Tenofovir', cost: '$19 M', share: '2,6%', type: 'Antirretroviral' },
      { name: 'Lamivudina', cost: '$14 M', share: '2,0%', type: 'Antirretroviral' },
    ],
    topDiagnoses: [
      { name: 'VIH con adherencia irregular', cost: '$64 M', share: '18%' },
      { name: 'VIH + coinfeccion', cost: '$41 M', share: '12%' },
      { name: 'Seguimiento virologico incompleto', cost: '$29 M', share: '8%' },
    ],
    monthlyTrend: [
      { month: 'Ene', value: '$108 M' },
      { month: 'Feb', value: '$114 M' },
      { month: 'Mar', value: '$119 M' },
      { month: 'Abr', value: '$116 M' },
      { month: 'May', value: '$124 M' },
      { month: 'Jun', value: '$131 M' },
    ],
    recommendedActions: [
      'Sostener intervenciones de adherencia para preservar el margen actual.',
      'Usar este contrato como referencia de control financiero con riesgo clinico contenido.',
    ],
    smartAlerts: [
      'El contrato mantiene comportamiento sano, pero la adherencia sigue siendo el gatillo principal de gasto futuro.',
    ],
  },
  'ctr-004': {
    expectedBudget: '$860 M',
    consumedBudget: '$648 M',
    projectedConsumption: '$826 M',
    deviationPercent: '+1,4%',
    riskLevel: 'medio',
    marginStatus: 'Margen estable con vigilancia',
    overrunRisk: 'Medio',
    concentrationRisk: 'Medio',
    highCostPatientsRisk: 'Medio',
    topCostPatients: [
      { name: 'Paola Pena', cost: '$8,4 M', share: '15%', diagnosis: 'Lupus eritematoso' },
      { name: 'Cesar Becerra', cost: '$7,9 M', share: '13%', diagnosis: 'Artritis psoriasica' },
      { name: 'Sandra Munoz', cost: '$3,1 M', share: '7%', diagnosis: 'Fibromialgia' },
    ],
    topCostMedications: [
      { name: 'Rituximab', cost: '$49 M', share: '7,6%', type: 'Biologico' },
      { name: 'Hidroxicloroquina', cost: '$9 M', share: '1,3%', type: 'Seguimiento' },
      { name: 'Prednisolona', cost: '$3 M', share: '0,4%', type: 'Soporte' },
    ],
    topDiagnoses: [
      { name: 'Lupus eritematoso', cost: '$52 M', share: '19%' },
      { name: 'Artritis psoriasica', cost: '$46 M', share: '16%' },
      { name: 'Fibromialgia cronica', cost: '$18 M', share: '6%' },
    ],
    monthlyTrend: [
      { month: 'Ene', value: '$96 M' },
      { month: 'Feb', value: '$101 M' },
      { month: 'Mar', value: '$109 M' },
      { month: 'Abr', value: '$112 M' },
      { month: 'May', value: '$114 M' },
      { month: 'Jun', value: '$116 M' },
    ],
    recommendedActions: [
      'Vigilar terapias inmunomoduladoras para evitar escalamiento innecesario del gasto.',
      'Priorizar auditoria clinica en pacientes con consumo creciente y documentacion limitada.',
    ],
    smartAlerts: [
      'El margen sigue sano, pero la concentracion en inmunomoduladores merece control preventivo.',
      'El contrato puede perder eficiencia si los casos reumatologicos severos crecen sin seguimiento oportuno.',
    ],
  },
}

export function getContractIntelligence(contractId) {
  return contractIntelligenceById[contractId] ?? contractIntelligenceById['ctr-001']
}

export const crhPatient360Profiles = [
  {
    patientId: 'pac-001',
    eps: 'Nueva EPS',
    contratoId: 'ctr-001',
    contratoNombre: 'PGP Crónicos Sur Occidente',
    categoriaRiesgo: 'Alto',
    riesgoClinico: 'Alto',
    riesgoFinanciero: 'Alto',
    costoAcumulado: '$18,6 M',
    costoMes: '$4,2 M',
    diagnosticosPrincipales: [
      'M06.9 Artritis reumatoide seropositiva',
      'Z79.6 Uso crónico de inmunomoduladores',
    ],
    ultimasAtenciones: [
      { fecha: '2026-06-10', servicio: 'Reumatología', resumen: 'Control con dolor articular persistente y ajuste terapéutico.' },
      { fecha: '2026-05-24', servicio: 'Laboratorio clínico', resumen: 'PCR elevada, pendiente lectura integral con reumatología.' },
      { fecha: '2026-05-11', servicio: 'Farmacia', resumen: 'Dispensación parcial de biológico por validación de cadena de frío.' },
    ],
    medicamentosActivos: [
      { nombre: 'Adalimumab', estado: 'Activo', costo: '$3,8 M/mes' },
      { nombre: 'Metotrexato', estado: 'Activo', costo: '$0,4 M/mes' },
      { nombre: 'Ácido fólico', estado: 'Activo', costo: '$0,02 M/mes' },
    ],
    proximaAccionIa: 'Priorizar control reumatológico en 72 horas y validar adherencia al biológico para mitigar sobreconsumo PGP.',
    assistAlerts: [
      { label: 'Diagnóstico inespecífico', detail: 'Se recomienda precisar actividad clínica y severidad de artritis en próxima evolución.', tone: 'warning' },
      { label: 'Paciente sin control reciente', detail: 'Han transcurrido 17 días desde el último control médico integral.', tone: 'warning' },
      { label: 'Medicamento de alto costo', detail: 'Adalimumab concentra 82% del costo farmacéutico mensual del caso.', tone: 'danger' },
      { label: 'Riesgo PGP alto', detail: 'El caso está entre el percentil 95 de consumo del contrato PGP-NUE-2026-01.', tone: 'danger' },
    ],
  },
  {
    patientId: 'pac-002',
    eps: 'Sanitas',
    contratoId: 'ctr-002',
    contratoNombre: 'PGP Dermatología Integral',
    categoriaRiesgo: 'Medio',
    riesgoClinico: 'Medio',
    riesgoFinanciero: 'Alto',
    costoAcumulado: '$11,2 M',
    costoMes: '$3,5 M',
    diagnosticosPrincipales: [
      'L40.0 Psoriasis vulgar severa',
      'Z79.899 Uso continuo de terapia biológica',
    ],
    ultimasAtenciones: [
      { fecha: '2026-06-08', servicio: 'Dermatología', resumen: 'Lesiones cutáneas controladas parcialmente.' },
      { fecha: '2026-05-29', servicio: 'Farmacia', resumen: 'Pendiente autorización complementaria de biológico.' },
    ],
    medicamentosActivos: [
      { nombre: 'Secukinumab', estado: 'Activo', costo: '$3,1 M/mes' },
      { nombre: 'Tacrolimus tópico', estado: 'Parcial', costo: '$0,3 M/mes' },
    ],
    proximaAccionIa: 'Revisar continuidad del biológico y correlacionar consumo con respuesta dermatológica.',
    assistAlerts: [
      { label: 'Diagnóstico inespecífico', detail: 'Falta escalamiento de severidad clínica en la evolución más reciente.', tone: 'warning' },
      { label: 'Medicamento de alto costo', detail: 'Secukinumab pesa 74% del costo total del paciente.', tone: 'danger' },
      { label: 'Riesgo PGP alto', detail: 'Paciente está entre los cinco de mayor consumo del contrato dermatológico.', tone: 'danger' },
    ],
  },
  {
    patientId: 'pac-003',
    eps: 'Sura',
    contratoId: 'ctr-003',
    contratoNombre: 'PGP VIH Vida Integral',
    categoriaRiesgo: 'Alto',
    riesgoClinico: 'Alto',
    riesgoFinanciero: 'Medio',
    costoAcumulado: '$7,4 M',
    costoMes: '$1,8 M',
    diagnosticosPrincipales: [
      'B20 VIH con compromiso inmunológico',
      'R75 Hallazgo de laboratorio en seguimiento',
    ],
    ultimasAtenciones: [
      { fecha: '2026-06-09', servicio: 'Infectología', resumen: 'Adherencia irregular y carga viral pendiente de confirmación.' },
      { fecha: '2026-06-03', servicio: 'Laboratorio clínico', resumen: 'Carga viral no validada por muestra insuficiente.' },
    ],
    medicamentosActivos: [
      { nombre: 'Dolutegravir', estado: 'Activo', costo: '$0,9 M/mes' },
      { nombre: 'Tenofovir/Lamivudina', estado: 'Activo', costo: '$0,6 M/mes' },
    ],
    proximaAccionIa: 'Cerrar brecha de adherencia en 7 días y validar laboratorio para evitar progresión clínica.',
    assistAlerts: [
      { label: 'Paciente sin control reciente', detail: 'No hay control integral cerrado con resultados de laboratorio vigentes.', tone: 'warning' },
      { label: 'Riesgo PGP alto', detail: 'Si se pierde adherencia, el costo evitable por complicación es alto.', tone: 'warning' },
    ],
  },
  {
    patientId: 'pac-004',
    eps: 'Coosalud',
    contratoId: 'ctr-001',
    contratoNombre: 'PGP Crónicos Sur Occidente',
    categoriaRiesgo: 'Medio',
    riesgoClinico: 'Medio',
    riesgoFinanciero: 'Medio',
    costoAcumulado: '$5,8 M',
    costoMes: '$1,1 M',
    diagnosticosPrincipales: [
      'I10 Hipertensión esencial',
      'N18.3 Enfermedad renal crónica estadio 3',
    ],
    ultimasAtenciones: [
      { fecha: '2026-06-07', servicio: 'Medicina interna', resumen: 'Control metabólico estable con seguimiento renal recomendado.' },
      { fecha: '2026-05-27', servicio: 'Laboratorio clínico', resumen: 'Microalbuminuria pendiente de repetición.' },
    ],
    medicamentosActivos: [
      { nombre: 'Losartán', estado: 'Activo', costo: '$0,08 M/mes' },
      { nombre: 'Amlodipino', estado: 'Activo', costo: '$0,04 M/mes' },
    ],
    proximaAccionIa: 'Asegurar control renal y laboratorio en próximos 15 días.',
    assistAlerts: [
      { label: 'Paciente sin control reciente', detail: 'Se recomienda confirmar laboratorio renal pendiente.', tone: 'warning' },
    ],
  },
  {
    patientId: 'pac-005',
    eps: 'Emssanar',
    contratoId: 'ctr-004',
    contratoNombre: 'PGP Reumatología Eje Cafetero',
    categoriaRiesgo: 'Medio',
    riesgoClinico: 'Medio',
    riesgoFinanciero: 'Bajo',
    costoAcumulado: '$3,1 M',
    costoMes: '$0,7 M',
    diagnosticosPrincipales: [
      'M79.7 Fibromialgia',
      'G89.4 Dolor crónico',
    ],
    ultimasAtenciones: [
      { fecha: '2026-06-04', servicio: 'Reumatología', resumen: 'Se fortalece educación y manejo no farmacológico.' },
    ],
    medicamentosActivos: [
      { nombre: 'Pregabalina', estado: 'Activo', costo: '$0,12 M/mes' },
    ],
    proximaAccionIa: 'Mantener seguimiento conservador y vigilar uso de ayudas diagnósticas.',
    assistAlerts: [
      { label: 'Diagnóstico inespecífico', detail: 'Documentar mejor respuesta funcional y escala de dolor.', tone: 'primary' },
    ],
  },
  {
    patientId: 'pac-006',
    eps: 'Asmet Salud',
    contratoId: 'ctr-001',
    contratoNombre: 'PGP Crónicos Sur Occidente',
    categoriaRiesgo: 'Alto',
    riesgoClinico: 'Alto',
    riesgoFinanciero: 'Medio',
    costoAcumulado: '$6,2 M',
    costoMes: '$1,6 M',
    diagnosticosPrincipales: [
      'E11 Diabetes mellitus tipo 2',
      'R73.9 Descontrol glucémico recurrente',
    ],
    ultimasAtenciones: [
      { fecha: '2026-05-18', servicio: 'Medicina interna', resumen: 'No asistió al control de ajuste terapéutico.' },
      { fecha: '2026-05-12', servicio: 'Laboratorio clínico', resumen: 'HbA1c pendiente de toma por reprogramación.' },
    ],
    medicamentosActivos: [
      { nombre: 'Insulina Glargina', estado: 'Pendiente', costo: '$0,7 M/mes' },
      { nombre: 'Metformina', estado: 'Activo', costo: '$0,03 M/mes' },
    ],
    proximaAccionIa: 'Cerrar brecha de control en menos de 5 días para evitar evento evitable.',
    assistAlerts: [
      { label: 'Paciente sin control reciente', detail: 'Sin control médico efectivo en 24 días.', tone: 'danger' },
      { label: 'Riesgo PGP alto', detail: 'La probabilidad de urgencia incrementa el costo proyectado del contrato.', tone: 'warning' },
    ],
  },
]

export const crhClinicalRecords = [
  {
    patientId: 'pac-001',
    anamnesis: 'Paciente con artralgias persistentes, rigidez matinal > 60 minutos y fatiga. Refiere dificultad para adherirse a ventana de aplicación del biológico.',
    antecedentes: 'Artritis reumatoide seropositiva de 6 años de evolución. Sin alergias conocidas. Uso previo de metotrexato y sulfasalazina.',
    signosVitales: [
      { label: 'TA', value: '118/72 mmHg' },
      { label: 'FC', value: '78 lpm' },
      { label: 'FR', value: '18 rpm' },
      { label: 'Temp', value: '36,7 °C' },
      { label: 'Peso', value: '63 kg' },
      { label: 'IMC', value: '24,3' },
    ],
    diagnosticoCie10: 'M06.9 Artritis reumatoide no especificada',
    planManejo: 'Mantener metotrexato, validar continuidad de adalimumab, solicitar PCR/VSG y priorizar control en 72 horas.',
    ordenes: [
      'PCR y VSG',
      'Control por reumatología',
      'Educación de adherencia farmacológica',
    ],
    assist: [
      { label: 'Alerta clínica', detail: 'Persisten signos de actividad inflamatoria sin cierre de control integral.', tone: 'warning' },
      { label: 'Alerta financiera', detail: 'El costo del biológico crece sin evidencia documentada de respuesta terapéutica completa.', tone: 'danger' },
      { label: 'Recomendación CRH', detail: 'Relacionar actividad clínica, resultados de laboratorio y costo del tratamiento antes de próxima autorización.', tone: 'primary' },
    ],
  },
]

export const clinicalHistoryIntelligenceById = {
  'pac-001': {
    clinicalSummary: 'Paciente con artritis reumatoide activa, adherencia irregular al biologico y evidencia de actividad inflamatoria persistente.',
    mainDiagnosis: 'M06.9 Artritis reumatoide seropositiva activa',
    comorbidities: ['Dolor cronico inflamatorio', 'Fatiga funcional', 'Uso cronico de inmunomoduladores'],
    treatmentPlan: 'Mantener metotrexato, validar continuidad de adalimumab, solicitar reactantes de fase aguda y priorizar control por reumatologia.',
    evolutionNotes: [
      'Persisten rigidez matinal y dolor articular con impacto funcional moderado.',
      'Se documenta dispensacion parcial reciente del biologico con barreras logisticas.',
      'Pendiente correlacion clinica-laboratorio para decidir continuidad plena del esquema.',
    ],
    clinicalRisk: 'Alto',
    therapeuticFailureRisk: 'Alto',
    hospitalizationRisk: 'Medio',
    financialImpactRisk: 'Alto',
    pendingLabs: ['PCR', 'VSG'],
    pendingAuthorizations: ['Validacion de continuidad de biologico'],
    pendingMedicationClaims: ['Adalimumab pendiente de cierre logistico'],
    careGaps: ['Control integral sin cierre en ultimos 17 dias', 'Brecha de adherencia farmacologica'],
    crhAssistSuggestions: [
      'Documentar actividad clinica con escala objetiva antes de la siguiente autorizacion.',
      'Escalar a gestion de adherencia si no se confirma aplicacion del biologico en 72 horas.',
      'Conciliar costo farmacologico con respuesta clinica para proteger margen PGP.',
    ],
    smartAlerts: [
      'Actividad inflamatoria persistente con soporte paraclinico incompleto.',
      'Biologico de alto costo con continuidad operativa en riesgo.',
      'Brecha de seguimiento puede traducirse en evento evitable y sobrecosto contractual.',
    ],
    auditTrace: [
      { date: '2026-06-10', user: 'Dra. Paula Gomez', action: 'Ajuste terapeutico preliminar', module: 'Historia clinica', impact: 'Riesgo clinico persistente' },
      { date: '2026-06-11', user: 'Auditoria CRH', action: 'Revision de adherencia y costo', module: 'Auditoria', impact: 'Caso priorizado para seguimiento' },
      { date: '2026-06-12', user: 'Farmacia central', action: 'Validacion de dispensacion parcial', module: 'Farmacia', impact: 'Continuidad en riesgo' },
    ],
  },
}

export function getClinicalHistoryIntelligence(patientId) {
  return clinicalHistoryIntelligenceById[patientId] ?? clinicalHistoryIntelligenceById['pac-001']
}

export const appointments = [
  { id: 'apt-001', fecha: '2026-06-13', hora: '07:30', paciente: 'Laura Burbano', profesional: 'Dra. Paula Gómez', especialidad: 'Reumatología', sede: 'Pasto', estado: 'Programada' },
  { id: 'apt-002', fecha: '2026-06-13', hora: '08:15', paciente: 'Juan David Lasso', profesional: 'Dr. Esteban Mina', especialidad: 'Dermatología', sede: 'Popayán', estado: 'Atendida' },
  { id: 'apt-003', fecha: '2026-06-13', hora: '09:00', paciente: 'Mariana Córdoba', profesional: 'Dra. Lina Rosero', especialidad: 'VIH / Pacientes Vida', sede: 'Cali', estado: 'Reprogramada' },
  { id: 'apt-004', fecha: '2026-06-13', hora: '10:20', paciente: 'Carlos Narváez', profesional: 'Dr. Felipe Perdomo', especialidad: 'Medicina interna', sede: 'Neiva', estado: 'No asistió' },
  { id: 'apt-005', fecha: '2026-06-13', hora: '11:10', paciente: 'Sandra Muñoz', profesional: 'Enf. Carolina Ruiz', especialidad: 'Enfermería', sede: 'Pereira', estado: 'Programada' },
  { id: 'apt-006', fecha: '2026-06-13', hora: '14:40', paciente: 'Fredy Cuéllar', profesional: 'Dr. Andrés Valencia', especialidad: 'Apoyo diagnóstico', sede: 'Florencia', estado: 'Cancelada' },
]

export const medications = [
  {
    id: 'med-001',
    medicamento: 'Adalimumab 40 mg',
    dosis: '40 mg',
    frecuencia: 'Quincenal',
    duracion: '6 meses',
    fecha: '2026-06-10',
    entrega: 'Pendiente',
    observaciones: 'Validar cadena de frío y adherencia clínica.',
    paciente: 'Laura Burbano',
    diagnostico: 'Artritis reumatoide',
    contrato: 'PGP-NUE-2026-01',
    costoMensual: '$3,8 M',
    stock: 12,
    vencimiento: '2026-08-30',
    consumoMensual: '$94 M',
    pacientesAsociados: 28,
    impactoContrato: '4,2%',
    tipoCosto: 'Alto costo',
  },
  {
    id: 'med-002',
    medicamento: 'Secukinumab 150 mg',
    dosis: '150 mg',
    frecuencia: 'Mensual',
    duracion: '12 meses',
    fecha: '2026-06-08',
    entrega: 'Entregado',
    observaciones: 'Continuidad supeditada a evaluación de respuesta.',
    paciente: 'Juan David Lasso',
    diagnostico: 'Psoriasis',
    contrato: 'PGP-SAN-2026-03',
    costoMensual: '$3,1 M',
    stock: 8,
    vencimiento: '2026-07-22',
    consumoMensual: '$56 M',
    pacientesAsociados: 17,
    impactoContrato: '6,2%',
    tipoCosto: 'Alto costo',
  },
  {
    id: 'med-003',
    medicamento: 'Dolutegravir 50 mg',
    dosis: '50 mg',
    frecuencia: 'Cada 24 horas',
    duracion: '12 meses',
    fecha: '2026-06-09',
    entrega: 'Entregado',
    observaciones: 'Monitorear adherencia y control virológico.',
    paciente: 'Mariana Córdoba',
    diagnostico: 'VIH',
    contrato: 'PGP-SUR-2026-02',
    costoMensual: '$0,9 M',
    stock: 65,
    vencimiento: '2027-01-18',
    consumoMensual: '$31 M',
    pacientesAsociados: 64,
    impactoContrato: '4,3%',
    tipoCosto: 'Crítico controlado',
  },
  {
    id: 'med-004',
    medicamento: 'Insulina Glargina',
    dosis: '20 UI',
    frecuencia: 'Diaria',
    duracion: '90 días',
    fecha: '2026-06-05',
    entrega: 'Pendiente',
    observaciones: 'Paciente con reprogramación de control y riesgo de descompensación.',
    paciente: 'Fredy Cuéllar',
    diagnostico: 'Diabetes tipo 2',
    contrato: 'PGP-NUE-2026-01',
    costoMensual: '$0,7 M',
    stock: 22,
    vencimiento: '2026-07-05',
    consumoMensual: '$38 M',
    pacientesAsociados: 49,
    impactoContrato: '1,8%',
    tipoCosto: 'Riesgo de continuidad',
  },
]

export const pharmacyIntelligenceById = {
  'med-001': {
    currentStock: 12,
    monthlyConsumption: '$94 M',
    daysOfCoverage: 18,
    shortageRisk: 'Alto',
    contractImpactPercent: '4,2%',
    monthlyCost: '$3,8 M',
    annualProjectedCost: '$45,6 M',
    highCostDrug: true,
    adherenceRisk: 'Alto',
    authorizationStatus: 'Pendiente validacion',
    patientsAssigned: 28,
    lastClaimGapDays: 11,
    recommendedAction: 'Asegurar reposicion inmediata y validar continuidad clinica del biologico antes del siguiente ciclo.',
    smartAlert: 'Cobertura menor a tres semanas en un medicamento que concentra alto impacto financiero del contrato.',
  },
  'med-002': {
    currentStock: 8,
    monthlyConsumption: '$56 M',
    daysOfCoverage: 21,
    shortageRisk: 'Medio',
    contractImpactPercent: '6,2%',
    monthlyCost: '$3,1 M',
    annualProjectedCost: '$37,2 M',
    highCostDrug: true,
    adherenceRisk: 'Medio',
    authorizationStatus: 'Autorizado con seguimiento',
    patientsAssigned: 17,
    lastClaimGapDays: 7,
    recommendedAction: 'Cruzar respuesta terapeutica con consumo acumulado y sostener seguimiento sobre continuidad del esquema.',
    smartAlert: 'Dosificacion de alto costo con presion creciente sobre el presupuesto dermatologico.',
  },
  'med-003': {
    currentStock: 65,
    monthlyConsumption: '$31 M',
    daysOfCoverage: 47,
    shortageRisk: 'Bajo',
    contractImpactPercent: '4,3%',
    monthlyCost: '$0,9 M',
    annualProjectedCost: '$10,8 M',
    highCostDrug: false,
    adherenceRisk: 'Medio',
    authorizationStatus: 'Activa',
    patientsAssigned: 64,
    lastClaimGapDays: 4,
    recommendedAction: 'Sostener control de adherencia y trazabilidad de reclamo para evitar caidas de continuidad virologica.',
    smartAlert: 'Buen nivel de cobertura, pero el riesgo principal sigue siendo la no reclamacion oportuna.',
  },
  'med-004': {
    currentStock: 22,
    monthlyConsumption: '$38 M',
    daysOfCoverage: 26,
    shortageRisk: 'Medio',
    contractImpactPercent: '1,8%',
    monthlyCost: '$0,7 M',
    annualProjectedCost: '$8,4 M',
    highCostDrug: false,
    adherenceRisk: 'Alto',
    authorizationStatus: 'Pendiente entrega',
    patientsAssigned: 49,
    lastClaimGapDays: 16,
    recommendedAction: 'Cerrar entrega y seguimiento de reclamacion en menos de 48 horas para evitar descompensaciones evitables.',
    smartAlert: 'Brecha de reclamo superior a dos semanas en un medicamento clave para cronicos de alto riesgo.',
  },
}

export function getPharmacyIntelligence(medicationId) {
  return pharmacyIntelligenceById[medicationId] ?? pharmacyIntelligenceById['med-001']
}

export const labs = [
  { orden: 'LAB-2041', fecha: '2026-06-13', paciente: 'Laura Burbano', examen: 'PCR y VSG', estado: 'Pendiente', resultado: 'En proceso', archivo: 'PCR-VSG-demo.pdf', alerta: 'Prioridad media' },
  { orden: 'LAB-2042', fecha: '2026-06-13', paciente: 'Mariana Córdoba', examen: 'Carga viral VIH', estado: 'Critico', resultado: 'Requiere revisión por infectología', archivo: 'carga-viral-demo.pdf', alerta: 'Alerta clínica' },
  { orden: 'LAB-2043', fecha: '2026-06-12', paciente: 'Carlos Narváez', examen: 'Perfil renal', estado: 'Completado', resultado: 'Valores estables', archivo: 'perfil-renal-demo.pdf', alerta: 'Sin alerta' },
  { orden: 'LAB-2044', fecha: '2026-06-12', paciente: 'Sandra Muñoz', examen: 'Biopsia cutánea', estado: 'Pendiente', resultado: 'Muestra en tránsito', archivo: 'biopsia-demo.jpg', alerta: 'Logística' },
]

export const branches = [
  { name: 'Cali', pacientes: 2180, citas: 63, profesionales: 28, estado: 'Operación estable con foco VIH', ocupacion: 94 },
  { name: 'Popayán', pacientes: 1684, citas: 46, profesionales: 19, estado: 'Seguimiento dermatológico de alta presión', ocupacion: 89 },
  { name: 'Pasto', pacientes: 1936, citas: 58, profesionales: 24, estado: 'Sobrecarga en reumatología y biológicos', ocupacion: 96 },
  { name: 'Pereira', pacientes: 1324, citas: 37, profesionales: 16, estado: 'Operación estable con margen conservado', ocupacion: 84 },
  { name: 'Florencia', pacientes: 1192, citas: 34, profesionales: 13, estado: 'Brechas de seguimiento en crónicos', ocupacion: 81 },
  { name: 'Neiva', pacientes: 2264, citas: 61, profesionales: 22, estado: 'Demanda creciente de medicina interna', ocupacion: 91 },
]

export const specialties = [
  { name: 'Reumatología', active: 632, team: 8, wait: '4 días', description: 'Seguimiento inmunológico, artritis y terapias de alto costo.' },
  { name: 'Dermatología', active: 488, team: 6, wait: '3 días', description: 'Control dermatológico con lectura de riesgo y peso farmacéutico.' },
  { name: 'VIH / Pacientes Vida', active: 274, team: 5, wait: '2 días', description: 'Programa integral con alertas de adherencia y oportunidad.' },
  { name: 'Medicina interna', active: 401, team: 7, wait: '5 días', description: 'Comorbilidades de alta complejidad y trazabilidad longitudinal.' },
  { name: 'Enfermería', active: 920, team: 12, wait: '1 día', description: 'Canal operativo para controles, educación y cierre de brechas.' },
  { name: 'Apoyo diagnóstico', active: 519, team: 10, wait: '2 días', description: 'Laboratorio e imágenes como gatillo de decisiones oportunas.' },
]

export const roleCards = [
  { role: 'Administrador', description: 'Gobierno del dato, parametrización y visibilidad institucional.', level: 'Alto' },
  { role: 'Médico', description: 'Lectura clínica con apoyo de riesgo y recomendación asistida.', level: 'Clínico' },
  { role: 'Enfermería', description: 'Seguimiento, continuidad y cierre operativo del paciente.', level: 'Clínico' },
  { role: 'Auxiliar administrativo', description: 'Agenda, autorizaciones y trazabilidad documental.', level: 'Operativo' },
  { role: 'Farmacia', description: 'Dispensación con lectura de costo, stock e impacto contractual.', level: 'Operativo' },
  { role: 'Laboratorio', description: 'Interpretación de resultados y alertas clínicas priorizadas.', level: 'Diagnóstico' },
  { role: 'Gerencia', description: 'Vista 360 de contratos, población, riesgo y margen.', level: 'Ejecutivo' },
  { role: 'Auditoría', description: 'Calidad documental, trazabilidad y consistencia de hallazgos.', level: 'Control' },
]

export const reportMetrics = [
  { label: 'Pacientes priorizados', value: 146, color: '#0d6efd' },
  { label: 'Contratos en riesgo', value: 6, color: '#1f7a35' },
  { label: 'Sobreconsumo proyectado', value: 286, color: '#f59e0b' },
  { label: 'Alertas farmacéuticas', value: 23, color: '#2563eb' },
  { label: 'Pacientes sin control', value: 32, color: '#e67e22' },
  { label: 'Margen promedio PGP', value: 11, color: '#16a34a' },
]

export const headquartersNotes = [
  'CRH no reemplaza el HIS: interpreta clínica, costo, riesgo y oportunidad sobre los datos transaccionales.',
  'La capa demo está preparada para futura conexión a PostgreSQL y API REST sin usar datos reales.',
  'La lectura 360 prioriza decisiones gerenciales, clínicas y farmacéuticas sobre población PGP.',
]

export const executiveIntelligenceSummary = {
  clinicalRiskPatients: 4,
  financialRiskPatients: 3,
  highCostMedications: 2,
  contractsAtRisk: 2,
  projectedOvercost: '$322 M',
  pendingClinicalActions: 7,
  pendingAuthorizations: 3,
  adherenceGaps: 4,
  hospitalizationRiskCases: 2,
  pendingClaims: 2,
  smartExecutiveAlerts: [
    'PGP-NUE-2026-01 concentra el mayor riesgo de perdida por Laura Burbano y Fredy Cuellar, ambos con brechas activas de continuidad.',
    'Adalimumab e insulina glargina ya explican el principal frente de sobrecosto evitable en cronicos priorizados.',
    'Las autorizaciones, reclamaciones y controles pendientes ya afectan continuidad terapeutica, margen y trazabilidad operativa.',
  ],
  recommendedExecutiveActions: [
    'Escalar hoy a comite clinico-financiero los casos Laura Burbano y Fredy Cuellar junto con el contrato PGP-NUE-2026-01.',
    'Priorizar cierre de autorizaciones y reclamos pendientes en adalimumab e insulina glargina antes del siguiente ciclo de dispensacion.',
    'Exigir seguimiento semanal sobre hospitalizacion prevenible, adherencia y continuidad terapeutica en cronicos de mayor costo.',
  ],
}

export const dashboardServiceLines = [
  'Paciente 360',
  'Contrato PGP 360',
  'Farmacia inteligente',
  'Historia clínica inteligente',
  'Riesgo financiero',
  'CRH Assist',
]

export const dashboardKpis = crhCommandCenterKpis

export const dashboardExecutiveCards = [
  {
    title: 'Paciente 360',
    value: '146',
    description: 'Casos de alto costo y alta complejidad priorizados con siguiente acción recomendada.',
    trend: 'Top prioridad',
  },
  {
    title: 'Contrato PGP 360',
    value: '$286 M',
    description: 'Desviación proyectada que combina presión clínica, farmacéutica y de seguimiento.',
    trend: 'Riesgo controlable',
  },
  {
    title: 'Farmacia inteligente',
    value: '82',
    description: 'Medicamentos alto costo vinculados a paciente, diagnóstico, contrato y stock.',
    trend: '17 críticos',
  },
  {
    title: 'Riesgo financiero',
    value: '18%',
    description: 'Indicador prospectivo de presión sobre suficiencia y margen institucional.',
    trend: '+2 pts vs meta',
  },
  {
    title: 'Predicción de consumo',
    value: '$3.480 M',
    description: 'Proyección de gasto mensual consolidado sobre contratos PGP activos.',
    trend: 'Modelo demo',
  },
  {
    title: 'Acción recomendada',
    value: '32',
    description: 'Pacientes sin control reciente con alto potencial de costo evitable.',
    trend: 'Intervenir hoy',
  },
]

export const dashboardOperationalAlerts = crhStrategicAlerts

export const dashboardFinanceCards = [
  { label: 'Consumo PGP total', value: '$4.468 M', meta: 'Acumulado actual en contratos priorizados' },
  { label: 'Margen estimado', value: '11,2%', meta: 'Promedio consolidado de rentabilidad contractual' },
  { label: 'Costo evitable', value: '$94 M', meta: 'Oportunidad de ahorro por intervención oportuna' },
  { label: 'Pacientes críticos', value: '146', meta: 'Concentración de gasto y riesgo clínico' },
]

export const dashboardBranchPerformance = [
  { sede: 'Cali', value: 92 },
  { sede: 'Popayán', value: 88 },
  { sede: 'Pasto', value: 95 },
  { sede: 'Pereira', value: 90 },
  { sede: 'Florencia', value: 84 },
  { sede: 'Neiva', value: 91 },
]

export const patientConsumptions = {
  'pac-001': {
    accumulatedCost: '$18,6 M',
    monthlyCost: '$4,2 M',
    expectedMonthlyCost: '$2,4 M',
    currentCost: '$4,2 M',
    costPercentile: 97,
    potentialAvoidableEvent: true,
  },
  'pac-002': {
    accumulatedCost: '$11,2 M',
    monthlyCost: '$3,5 M',
    expectedMonthlyCost: '$2,1 M',
    currentCost: '$3,5 M',
    costPercentile: 93,
    potentialAvoidableEvent: false,
  },
  'pac-003': {
    accumulatedCost: '$7,4 M',
    monthlyCost: '$1,8 M',
    expectedMonthlyCost: '$1,6 M',
    currentCost: '$1,8 M',
    costPercentile: 82,
    potentialAvoidableEvent: true,
  },
  'pac-004': {
    accumulatedCost: '$5,8 M',
    monthlyCost: '$1,1 M',
    expectedMonthlyCost: '$1,0 M',
    currentCost: '$1,1 M',
    costPercentile: 68,
    potentialAvoidableEvent: false,
  },
  'pac-005': {
    accumulatedCost: '$3,1 M',
    monthlyCost: '$0,7 M',
    expectedMonthlyCost: '$0,9 M',
    currentCost: '$0,7 M',
    costPercentile: 35,
    potentialAvoidableEvent: false,
  },
  'pac-006': {
    accumulatedCost: '$6,2 M',
    monthlyCost: '$1,6 M',
    expectedMonthlyCost: '$1,0 M',
    currentCost: '$1,6 M',
    costPercentile: 88,
    potentialAvoidableEvent: true,
  },
}

export const patientIntelligenceById = {
  'pac-001': {
    clinicalRiskScore: 91,
    financialRiskScore: 88,
    hospitalizationRisk: 76,
    adherenceScore: 58,
    expectedMonthlyCost: '$2,4 M',
    currentMonthlyCost: '$4,2 M',
    consumptionDeltaLabel: '+75%',
    consumptionNarrative: 'Caso principal de la demo: el consumo actual esta muy por encima de lo esperado por brecha de adherencia, continuidad irregular de adalimumab y presion directa sobre el contrato PGP-NUE-2026-01.',
    pendingActions: [
      { id: 'pac-001-action-1', owner: 'Reumatologia', due: '72 horas', label: 'Cerrar control integral y documentar respuesta clinica a adalimumab.' },
      { id: 'pac-001-action-2', owner: 'Farmacia', due: 'Hoy', label: 'Validar continuidad de dispensacion de adalimumab y cadena de frio.' },
      { id: 'pac-001-action-3', owner: 'Enfermeria', due: '48 horas', label: 'Llamada de adherencia y barreras de aplicacion antes del siguiente ciclo.' },
    ],
    smartAlerts: [
      { id: 'pac-001-alert-1', title: 'Sobreconsumo evitable', detail: 'El caso supera en 75% el costo mensual esperado y hoy es el principal detonante individual del contrato PGP-NUE-2026-01.', tone: 'danger' },
      { id: 'pac-001-alert-2', title: 'Adherencia vulnerable', detail: 'Persisten señales de uso irregular del biologico y control incompleto.', tone: 'warning' },
      { id: 'pac-001-alert-3', title: 'Hospitalizacion prevenible', detail: 'Si no se corrige la actividad inflamatoria, aumenta el riesgo de urgencia, estancia y perdida contractual.', tone: 'warning' },
    ],
  },
  'pac-002': {
    clinicalRiskScore: 67,
    financialRiskScore: 84,
    hospitalizationRisk: 42,
    adherenceScore: 71,
    expectedMonthlyCost: '$2,1 M',
    currentMonthlyCost: '$3,5 M',
    consumptionDeltaLabel: '+67%',
    consumptionNarrative: 'La respuesta clinica parcial no compensa aun el peso financiero de la terapia biologica.',
    pendingActions: [
      { id: 'pac-002-action-1', owner: 'Dermatologia', due: '5 dias', label: 'Correlacionar severidad clinica con continuidad de secukinumab.' },
      { id: 'pac-002-action-2', owner: 'Autorizaciones', due: 'Hoy', label: 'Cerrar autorizacion pendiente para evitar interrupciones o doble tramite.' },
    ],
    smartAlerts: [
      { id: 'pac-002-alert-1', title: 'Presion farmacoeconomica', detail: 'El costo mensual actual supera en 67% el esperado para el caso.', tone: 'danger' },
      { id: 'pac-002-alert-2', title: 'Beneficio clinico parcial', detail: 'La respuesta documentada sigue siendo incompleta para el costo comprometido.', tone: 'warning' },
    ],
  },
  'pac-003': {
    clinicalRiskScore: 86,
    financialRiskScore: 62,
    hospitalizationRisk: 64,
    adherenceScore: 61,
    expectedMonthlyCost: '$1,6 M',
    currentMonthlyCost: '$1,8 M',
    consumptionDeltaLabel: '+13%',
    consumptionNarrative: 'El costo esta cerca de lo esperado, pero una falla de adherencia puede disparar consumo evitable.',
    pendingActions: [
      { id: 'pac-003-action-1', owner: 'Infectologia', due: '7 dias', label: 'Confirmar carga viral y ajustar plan de seguimiento.' },
      { id: 'pac-003-action-2', owner: 'Enfermeria', due: '48 horas', label: 'Intervencion de adherencia y recordatorio de laboratorio.' },
    ],
    smartAlerts: [
      { id: 'pac-003-alert-1', title: 'Riesgo virologico', detail: 'La adherencia irregular puede deteriorar control clinico y elevar consumo futuro.', tone: 'warning' },
      { id: 'pac-003-alert-2', title: 'Brecha de laboratorio', detail: 'Sin validacion de carga viral vigente no se puede cerrar el ciclo de control.', tone: 'primary' },
    ],
  },
  'pac-004': {
    clinicalRiskScore: 59,
    financialRiskScore: 54,
    hospitalizationRisk: 37,
    adherenceScore: 82,
    expectedMonthlyCost: '$1,0 M',
    currentMonthlyCost: '$1,1 M',
    consumptionDeltaLabel: '+10%',
    consumptionNarrative: 'Caso estable, con ligera desviacion por seguimiento renal pendiente.',
    pendingActions: [
      { id: 'pac-004-action-1', owner: 'Medicina interna', due: '15 dias', label: 'Cerrar control renal y repetir microalbuminuria.' },
    ],
    smartAlerts: [
      { id: 'pac-004-alert-1', title: 'Seguimiento renal pendiente', detail: 'La principal oportunidad es sostener continuidad y evitar deterioro silencioso.', tone: 'primary' },
    ],
  },
  'pac-005': {
    clinicalRiskScore: 46,
    financialRiskScore: 33,
    hospitalizationRisk: 22,
    adherenceScore: 85,
    expectedMonthlyCost: '$0,9 M',
    currentMonthlyCost: '$0,7 M',
    consumptionDeltaLabel: '-22%',
    consumptionNarrative: 'Consumo por debajo de lo esperado, con comportamiento conservador y baja presion financiera.',
    pendingActions: [
      { id: 'pac-005-action-1', owner: 'Reumatologia', due: '10 dias', label: 'Documentar mejor funcionalidad y respuesta al manejo no farmacologico.' },
    ],
    smartAlerts: [
      { id: 'pac-005-alert-1', title: 'Oportunidad documental', detail: 'La principal mejora viene por calidad de registro y trazabilidad funcional.', tone: 'primary' },
    ],
  },
  'pac-006': {
    clinicalRiskScore: 84,
    financialRiskScore: 66,
    hospitalizationRisk: 81,
    adherenceScore: 49,
    expectedMonthlyCost: '$1,0 M',
    currentMonthlyCost: '$1,6 M',
    consumptionDeltaLabel: '+60%',
    consumptionNarrative: 'Caso secundario de la demo: la falta de control y continuidad de insulina glargina ya muestra una desviacion importante frente a lo esperado en el mismo contrato cronico.',
    pendingActions: [
      { id: 'pac-006-action-1', owner: 'Medicina interna', due: '5 dias', label: 'Cerrar consulta de ajuste terapeutico y HbA1c pendiente.' },
      { id: 'pac-006-action-2', owner: 'Farmacia', due: 'Hoy', label: 'Confirmar entrega de insulina glargina y educacion de uso.' },
      { id: 'pac-006-action-3', owner: 'Enfermeria', due: '24 horas', label: 'Seguimiento telefonico por riesgo de descompensacion.' },
    ],
    smartAlerts: [
      { id: 'pac-006-alert-1', title: 'Riesgo alto de hospitalizacion', detail: 'La combinacion de descontrol glucemico y baja adherencia eleva el riesgo inmediato.', tone: 'danger' },
      { id: 'pac-006-alert-2', title: 'Consumo creciente', detail: 'El costo actual supera en 60% el esperado y amenaza el margen del contrato PGP-NUE-2026-01.', tone: 'warning' },
      { id: 'pac-006-alert-3', title: 'Brecha operativa critica', detail: 'Consulta perdida y laboratorio pendiente mantienen el caso abierto y expuesto.', tone: 'danger' },
    ],
  },
}

export function getPatientIntelligence(patientId) {
  return patientIntelligenceById[patientId] ?? patientIntelligenceById['pac-001']
}

export function getPatient360Profile(patientId) {
  return crhPatient360Profiles.find((profile) => profile.patientId === patientId) ?? crhPatient360Profiles[0]
}

export function getContractById(contractId) {
  return crhContracts.find((contract) => contract.id === contractId) ?? crhContracts[0]
}

export function getClinicalRecordByPatientId(patientId) {
  return crhClinicalRecords.find((record) => record.patientId === patientId) ?? crhClinicalRecords[0]
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

function getPatientMedicationContext(patientId) {
  const patient = patients.find((item) => item.id === patientId)
  const profile = getPatient360Profile(patientId)
  const medicationRows = medications
    .filter((item) => item.paciente === `${patient?.nombres} ${patient?.apellidos}`)
    .map((item) => ({
      id: item.id,
      nombre: item.medicamento,
      estado: item.entrega,
      tipoCosto: item.tipoCosto,
    }))

  const profileRows = (profile?.medicamentosActivos ?? []).map((item, index) => ({
    id: `${patientId}-profile-med-${index}`,
    nombre: item.nombre,
    estado: item.estado,
    tipoCosto: /adalimumab|secukinumab|rituximab/i.test(item.nombre) ? 'Alto costo' : 'Seguimiento',
  }))

  return [...medicationRows, ...profileRows]
}

export const crhAssistByPatientId = Object.fromEntries(
  patients.map((patient) => {
    const profile = getPatient360Profile(patient.id)
    const contract = getContractById(profile.contratoId)
    const history = getPatientHistoryContext(patient.id)
    const diagnoses = profile.diagnosticosPrincipales
    const medicationsContext = getPatientMedicationContext(patient.id)
    const consumptions = patientConsumptions[patient.id]

    return [patient.id, evaluateCRHAssist(patient, {
      history,
      diagnoses,
      medications: medicationsContext,
      contract,
      consumptions,
    })]
  }),
)

export const crhAssistContractSummary = crhContracts.map((contract) => {
  const relatedPatients = patients.filter((patient) => patient.contratoId === contract.id)
  const relatedResults = relatedPatients.map((patient) => crhAssistByPatientId[patient.id]).filter(Boolean)
  const score = relatedResults.length
    ? Math.round(relatedResults.reduce((total, result) => total + result.score, 0) / relatedResults.length)
    : 0
  const criticalAlerts = relatedResults.flatMap((result) => result.alerts).filter((alert) => alert.severity === 'critica').length

  return {
    contractId: contract.id,
    score,
    level: score <= 30 ? 'bajo' : score <= 60 ? 'medio' : score <= 80 ? 'alto' : 'critico',
    criticalAlerts,
    explanation: `${relatedPatients.length} pacientes analizados con ${criticalAlerts} alertas críticas relacionadas con seguimiento, margen o consumo.`,
  }
})

export const crhAssistCommandCenter = {
  score: Math.round(
    Object.values(crhAssistByPatientId).reduce((total, result) => total + result.score, 0) /
    Object.values(crhAssistByPatientId).length,
  ),
  criticalAlerts: Object.values(crhAssistByPatientId)
    .flatMap((result) => result.alerts)
    .filter((alert) => alert.severity === 'critica').length,
  topPatients: Object.entries(crhAssistByPatientId)
    .sort(([, left], [, right]) => right.score - left.score)
    .slice(0, 3)
    .map(([patientId, result]) => {
      const patient = patients.find((item) => item.id === patientId)
      return {
        patientId,
        name: `${patient?.nombres} ${patient?.apellidos}`,
        score: result.score,
        level: result.level,
        topAlert: result.alerts[0]?.title ?? 'Sin alerta prioritaria',
      }
    }),
}

export const crhAssistRulesCatalog = crhAssistRuleCatalog

export const crhAssistRulesSummary = {
  total: crhAssistRuleCatalog.length,
  enabled: getEnabledRules().length,
  categories: Array.from(new Set(crhAssistRuleCatalog.map((rule) => rule.category))),
  totalWeight: getEnabledRules().reduce((total, rule) => total + Math.max(0, rule.weight), 0),
}

export const crhCommandCenterContracts = crhContracts.map((contract) => {
  const assist = crhAssistContractSummary.find((item) => item.contractId === contract.id)

  return {
    id: contract.id,
    codigo: contract.codigo,
    nombre: contract.nombre,
    eps: contract.eps,
    riesgo: contract.riesgo,
    consumoActual: contract.consumoActual,
    proyeccionCierre: contract.proyeccionCierre,
    margenEstimado: contract.margenEstimado,
    assistScore: assist?.score ?? 0,
    assistLevel: assist?.level ?? 'bajo',
    criticalAlerts: assist?.criticalAlerts ?? 0,
  }
})

export function getCrhAssistByPatientId(patientId) {
  return crhAssistByPatientId[patientId] ?? crhAssistByPatientId[patients[0].id]
}

export function getCrhAssistContractSummary(contractId) {
  return crhAssistContractSummary.find((item) => item.contractId === contractId) ?? crhAssistContractSummary[0]
}
