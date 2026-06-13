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

export const navigationItems = [
  { path: '/dashboard', label: 'Command Center', icon: 'grid', section: 'CRH Core' },
  { path: '/crh-assist/rules', label: 'CRH Assist Rules', icon: 'spark', section: 'CRH Core' },
  { path: '/pacientes', label: 'Paciente 360', icon: 'patient', section: 'Inteligencia clínica' },
  { path: '/contratos-pgp', label: 'Contrato PGP 360', icon: 'contract', section: 'Inteligencia financiera' },
  { path: '/historia-clinica', label: 'Historia inteligente', icon: 'document', section: 'Inteligencia clínica' },
  { path: '/medicamentos', label: 'Farmacia inteligente', icon: 'capsule', section: 'Inteligencia financiera' },
  { path: '/citas', label: 'Agenda', icon: 'calendar', section: 'Operación base' },
  { path: '/laboratorios', label: 'Laboratorios', icon: 'lab', section: 'Operación base' },
  { path: '/sedes', label: 'Sedes', icon: 'building', section: 'Red institucional' },
  { path: '/especialidades', label: 'Especialidades', icon: 'stethoscope', section: 'Red institucional' },
  { path: '/reportes', label: 'Reportes', icon: 'chart', section: 'Gerencia' },
  { path: '/usuarios', label: 'Usuarios', icon: 'shield', section: 'Seguridad' },
  { path: '/configuracion', label: 'Configuración', icon: 'settings', section: 'Seguridad' },
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
]

export function getPageMeta(pathname) {
  if (pathname === '/login') {
    return { path: '/login', label: 'Acceso institucional' }
  }

  return navigationItems.find((item) => item.path === pathname) ?? navigationItems[0]
}
