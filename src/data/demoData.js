export const summaryCards = [
  { label: 'Citas de hoy', value: '148', delta: '+12%', tone: 'primary' },
  { label: 'Pacientes activos', value: '2.486', delta: '+8%', tone: 'success' },
  { label: 'Laboratorios pendientes', value: '37', delta: '9 críticos', tone: 'warning' },
  { label: 'Medicamentos pendientes', value: '54', delta: '11 priorizados', tone: 'warning' },
  { label: 'Atenciones del mes', value: '3.912', delta: '+15%', tone: 'primary' },
  { label: 'Alertas clínicas', value: '16', delta: '2 alta prioridad', tone: 'danger' },
  { label: 'Productividad por sede', value: '91%', delta: 'Meta institucional', tone: 'success' },
]

export const patients = [
  { id: 1, tipoDocumento: 'CC', numeroDocumento: '1112458796', nombres: 'Laura', apellidos: 'Burbano', fechaNacimiento: '1988-02-19', edad: 37, sexo: 'F', telefono: '310 456 7788', direccion: 'Cra 18 #14-22', ciudad: 'Pasto', eps: 'Nueva EPS', sede: 'Pasto', diagnostico: 'M06.9 Artritis reumatoide', estado: 'Activo' },
  { id: 2, tipoDocumento: 'CC', numeroDocumento: '1032457712', nombres: 'Juan David', apellidos: 'Lasso', fechaNacimiento: '1975-11-03', edad: 50, sexo: 'M', telefono: '315 244 8890', direccion: 'Cl 7 #4-60', ciudad: 'Popayán', eps: 'Sanitas', sede: 'Popayán', diagnostico: 'L40.0 Psoriasis vulgar', estado: 'Seguimiento' },
  { id: 3, tipoDocumento: 'TI', numeroDocumento: '1098337641', nombres: 'Mariana', apellidos: 'Córdoba', fechaNacimiento: '2006-05-28', edad: 20, sexo: 'F', telefono: '320 917 2201', direccion: 'Mz 3 Casa 18', ciudad: 'Cali', eps: 'Sura', sede: 'Cali', diagnostico: 'B20 Seguimiento VIH', estado: 'Activo' },
  { id: 4, tipoDocumento: 'CE', numeroDocumento: '52044119', nombres: 'Carlos', apellidos: 'Narváez', fechaNacimiento: '1963-09-12', edad: 62, sexo: 'M', telefono: '316 500 1455', direccion: 'Cl 22 #9-88', ciudad: 'Neiva', eps: 'Coosalud', sede: 'Neiva', diagnostico: 'I10 Hipertensión esencial', estado: 'Control' },
  { id: 5, tipoDocumento: 'CC', numeroDocumento: '1017745098', nombres: 'Sandra', apellidos: 'Muñoz', fechaNacimiento: '1992-01-16', edad: 34, sexo: 'F', telefono: '300 901 7710', direccion: 'Cr 14 #32-19', ciudad: 'Pereira', eps: 'Emssanar', sede: 'Pereira', diagnostico: 'M79.7 Fibromialgia', estado: 'Activo' },
  { id: 6, tipoDocumento: 'CC', numeroDocumento: '1024458916', nombres: 'Fredy', apellidos: 'Cuéllar', fechaNacimiento: '1981-07-08', edad: 44, sexo: 'M', telefono: '312 776 4410', direccion: 'Br San Judas', ciudad: 'Florencia', eps: 'Asmet Salud', sede: 'Florencia', diagnostico: 'E11 Diabetes tipo 2', estado: 'Pendiente' },
]

export const appointments = [
  { fecha: '2026-06-09', hora: '07:30', paciente: 'Laura Burbano', profesional: 'Dra. Paula Gómez', especialidad: 'Reumatología', sede: 'Pasto', estado: 'Programada' },
  { fecha: '2026-06-09', hora: '08:15', paciente: 'Juan David Lasso', profesional: 'Dr. Esteban Mina', especialidad: 'Dermatología', sede: 'Popayán', estado: 'Atendida' },
  { fecha: '2026-06-09', hora: '09:00', paciente: 'Mariana Córdoba', profesional: 'Dra. Lina Rosero', especialidad: 'VIH / Pacientes Vida', sede: 'Cali', estado: 'Reprogramada' },
  { fecha: '2026-06-09', hora: '10:20', paciente: 'Carlos Narváez', profesional: 'Dr. Felipe Perdomo', especialidad: 'Medicina interna', sede: 'Neiva', estado: 'No asistió' },
  { fecha: '2026-06-09', hora: '11:10', paciente: 'Sandra Muñoz', profesional: 'Enf. Carolina Ruiz', especialidad: 'Enfermería', sede: 'Pereira', estado: 'Programada' },
  { fecha: '2026-06-09', hora: '14:40', paciente: 'Fredy Cuéllar', profesional: 'Dr. Andrés Valencia', especialidad: 'Apoyo diagnóstico', sede: 'Florencia', estado: 'Cancelada' },
]

export const medications = [
  { medicamento: 'Metotrexato 2.5 mg', dosis: '10 mg', frecuencia: 'Semanal', duracion: '12 semanas', fecha: '2026-06-08', entrega: 'Pendiente', observaciones: 'Validar control hepático previo a despacho' },
  { medicamento: 'Adalimumab', dosis: '40 mg', frecuencia: 'Quincenal', duracion: '6 meses', fecha: '2026-06-06', entrega: 'Entregado', observaciones: 'Cadena de frío verificada' },
  { medicamento: 'Hidroxicloroquina', dosis: '200 mg', frecuencia: 'Cada 12 horas', duracion: '90 días', fecha: '2026-06-05', entrega: 'Parcial', observaciones: 'Faltante de 15 tabletas en bodega central' },
  { medicamento: 'Tacrolimus tópico', dosis: '0.1%', frecuencia: 'Cada 24 horas', duracion: '30 días', fecha: '2026-06-04', entrega: 'Pendiente', observaciones: 'Coordinar despacho sede Popayán' },
]

export const labs = [
  { orden: 'LAB-2041', fecha: '2026-06-09', paciente: 'Laura Burbano', examen: 'PCR y VSG', estado: 'Pendiente', resultado: 'En proceso', archivo: 'PCR-VSG-demo.pdf', alerta: 'Prioridad media' },
  { orden: 'LAB-2042', fecha: '2026-06-09', paciente: 'Mariana Córdoba', examen: 'Carga viral VIH', estado: 'Crítico', resultado: 'Requiere revisión infectología', archivo: 'carga-viral-demo.pdf', alerta: 'Alerta clínica' },
  { orden: 'LAB-2043', fecha: '2026-06-08', paciente: 'Carlos Narváez', examen: 'Perfil renal', estado: 'Completado', resultado: 'Valores estables', archivo: 'perfil-renal-demo.pdf', alerta: 'Sin alerta' },
  { orden: 'LAB-2044', fecha: '2026-06-08', paciente: 'Sandra Muñoz', examen: 'Biopsia cutánea', estado: 'Pendiente', resultado: 'Muestra en tránsito', archivo: 'biopsia-demo.jpg', alerta: 'Logística' },
]

export const branches = [
  { name: 'Cali', pacientes: 524, citas: 31, profesionales: 19, estado: 'Operando con alta demanda', ocupacion: 94 },
  { name: 'Popayán', pacientes: 381, citas: 24, profesionales: 14, estado: 'Operación estable', ocupacion: 82 },
  { name: 'Pasto', pacientes: 467, citas: 28, profesionales: 16, estado: 'Operación priorizada', ocupacion: 89 },
  { name: 'Pereira', pacientes: 322, citas: 18, profesionales: 11, estado: 'Operación estable', ocupacion: 77 },
  { name: 'Florencia', pacientes: 286, citas: 17, profesionales: 9, estado: 'Soporte logístico activo', ocupacion: 73 },
  { name: 'Neiva', pacientes: 506, citas: 30, profesionales: 18, estado: 'Operación estable', ocupacion: 88 },
]

export const specialties = [
  { name: 'Reumatología', active: 632, team: 8, wait: '4 días', description: 'Seguimiento inmunológico y enfermedades osteoarticulares.' },
  { name: 'Dermatología', active: 488, team: 6, wait: '3 días', description: 'Consulta especializada y control terapéutico dermatológico.' },
  { name: 'VIH / Pacientes Vida', active: 274, team: 5, wait: '2 días', description: 'Programa integral, adherencia y seguimiento infectológico.' },
  { name: 'Medicina interna', active: 401, team: 7, wait: '5 días', description: 'Comorbilidades y casos de alta complejidad clínica.' },
  { name: 'Enfermería', active: 920, team: 12, wait: '1 día', description: 'Canal operativo para controles, educación y seguimiento.' },
  { name: 'Apoyo diagnóstico', active: 519, team: 10, wait: '2 días', description: 'Imagenología, toma de muestras y soporte interdisciplinario.' },
]

export const roleCards = [
  { role: 'Administrador', description: 'Visión transversal, parametrización y control institucional.', level: 'Alto' },
  { role: 'Médico', description: 'Acceso asistencial según agenda, pacientes e historia clínica.', level: 'Clínico' },
  { role: 'Enfermería', description: 'Seguimiento operativo, notas de apoyo y validaciones.', level: 'Clínico' },
  { role: 'Auxiliar administrativo', description: 'Gestión de citas, admisiones y soporte documental.', level: 'Operativo' },
  { role: 'Farmacia', description: 'Dispensación, trazabilidad y pendientes de entrega.', level: 'Operativo' },
  { role: 'Laboratorio', description: 'Registro de órdenes, resultados y alertas diagnósticas.', level: 'Diagnóstico' },
  { role: 'Gerencia', description: 'Indicadores, productividad y control multisede.', level: 'Ejecutivo' },
  { role: 'Auditoría', description: 'Trazabilidad, calidad y seguimiento normativo.', level: 'Control' },
]

export const reportMetrics = [
  { label: 'Citas por sede', value: 148, color: '#0f5d8c' },
  { label: 'Pacientes por especialidad', value: 121, color: '#0f8f7a' },
  { label: 'Laboratorios pendientes', value: 37, color: '#e5a200' },
  { label: 'Medicamentos pendientes', value: 54, color: '#2f7fbd' },
  { label: 'Inasistencias', value: 11, color: '#d64545' },
  { label: 'Productividad mensual', value: 91, color: '#2f9d66' },
]

export const headquartersNotes = [
  'Separación visible entre módulos clínicos y administrativos.',
  'Trazabilidad futura preparada para login, auditoría y permisos por rol.',
  'Datos de demostración anonimizados y sin información sensible real.',
]
