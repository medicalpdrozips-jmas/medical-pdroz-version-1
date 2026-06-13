import { DashboardPage } from '../pages/DashboardPage'
import { PatientsPage } from '../pages/PatientsPage'
import { CitasPage } from '../pages/CitasPage'
import { HistoriaClinicaPage } from '../pages/HistoriaClinicaPage'
import { MedicamentosPage } from '../pages/MedicamentosPage'
import { LaboratoriosPage } from '../pages/LaboratoriosPage'
import { SedesPage } from '../pages/SedesPage'
import { EspecialidadesPage } from '../pages/EspecialidadesPage'
import { ReportesPage } from '../pages/ReportesPage'
import { UsuariosPage } from '../pages/UsuariosPage'
import { ConfiguracionPage } from '../pages/ConfiguracionPage'
import { LoginPage } from '../pages/LoginPage'
import { ContratoPgpPage } from '../pages/ContratoPgpPage'
import { CrhAssistRulesPage } from '../pages/CrhAssistRulesPage'
import { SystemStatusPage } from '../pages/SystemStatusPage'

export const navigationItems = [
  { path: '/dashboard', label: 'Centro de Comando', icon: 'grid', section: 'INTELIGENCIA' },
  { path: '/crh-assist/rules', label: 'Motor de Reglas', icon: 'spark', section: 'INTELIGENCIA' },
  { path: '/pacientes', label: 'Pacientes 360', icon: 'patient', section: 'INTELIGENCIA CLÍNICA' },
  { path: '/historia-clinica', label: 'Historia Clínica', icon: 'document', section: 'INTELIGENCIA CLÍNICA' },
  { path: '/contratos-pgp', label: 'Contratos PGP 360', icon: 'contract', section: 'INTELIGENCIA FINANCIERA' },
  { path: '/medicamentos', label: 'Farmacia Inteligente', icon: 'capsule', section: 'INTELIGENCIA FINANCIERA' },
  { path: '/citas', label: 'Agenda', icon: 'calendar', section: 'OPERACIÓN' },
  { path: '/laboratorios', label: 'Laboratorios', icon: 'lab', section: 'OPERACIÓN' },
  { path: '/reportes', label: 'Reportes', icon: 'chart', section: 'PLATAFORMA' },
  { path: '/usuarios', label: 'Usuarios', icon: 'shield', section: 'PLATAFORMA' },
  { path: '/configuracion', label: 'Configuración', icon: 'settings', section: 'PLATAFORMA' },
  { path: '/system-status', label: 'Estado del sistema', icon: 'shield', section: 'PLATAFORMA' },
  { path: '/sedes', label: 'Sedes', icon: 'building', section: 'PLATAFORMA' },
  { path: '/especialidades', label: 'Especialidades', icon: 'stethoscope', section: 'PLATAFORMA' },
]

export const appRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/crh-assist/rules', element: <CrhAssistRulesPage /> },
  { path: '/pacientes', element: <PatientsPage /> },
  { path: '/contratos-pgp', element: <ContratoPgpPage /> },
  { path: '/citas', element: <CitasPage /> },
  { path: '/historia-clinica', element: <HistoriaClinicaPage /> },
  { path: '/medicamentos', element: <MedicamentosPage /> },
  { path: '/laboratorios', element: <LaboratoriosPage /> },
  { path: '/sedes', element: <SedesPage /> },
  { path: '/especialidades', element: <EspecialidadesPage /> },
  { path: '/reportes', element: <ReportesPage /> },
  { path: '/usuarios', element: <UsuariosPage /> },
  { path: '/configuracion', element: <ConfiguracionPage /> },
  { path: '/system-status', element: <SystemStatusPage /> },
]

export function getPageMeta(pathname) {
  if (pathname === '/login') {
    return { path: '/login', label: 'Acceso institucional' }
  }

  return navigationItems.find((item) => item.path === pathname) ?? navigationItems[0]
}
