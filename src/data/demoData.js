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
