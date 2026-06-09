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

export const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'grid', section: 'Operación' },
  { path: '/pacientes', label: 'Pacientes', icon: 'patient', section: 'Asistencial' },
  { path: '/citas', label: 'Citas', icon: 'calendar', section: 'Asistencial' },
  { path: '/historia-clinica', label: 'Historia clínica', icon: 'document', section: 'Asistencial' },
  { path: '/medicamentos', label: 'Medicamentos', icon: 'capsule', section: 'Farmacia' },
  { path: '/laboratorios', label: 'Laboratorios', icon: 'lab', section: 'Diagnóstico' },
  { path: '/sedes', label: 'Sedes', icon: 'building', section: 'Red' },
  { path: '/especialidades', label: 'Especialidades', icon: 'stethoscope', section: 'Red' },
  { path: '/reportes', label: 'Reportes', icon: 'chart', section: 'Gestión' },
  { path: '/usuarios', label: 'Usuarios', icon: 'shield', section: 'Seguridad' },
  { path: '/configuracion', label: 'Configuración', icon: 'settings', section: 'Seguridad' },
]

export const appRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/pacientes', element: <PatientsPage /> },
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
