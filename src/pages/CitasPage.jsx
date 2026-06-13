import { Badge } from '../components/Badge'
import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { appointments } from '../data/demoData'

const statusTone = {
  Programada: 'primary',
  Atendida: 'success',
  Cancelada: 'danger',
  'No asistió': 'warning',
  Reprogramada: 'warning',
}

const columns = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'hora', label: 'Hora' },
  { key: 'paciente', label: 'Paciente' },
  { key: 'profesional', label: 'Profesional' },
  { key: 'especialidad', label: 'Especialidad' },
  { key: 'sede', label: 'Sede' },
  { key: 'estado', label: 'Estado', render: (value) => <Badge tone={statusTone[value]}>{value}</Badge> },
]

export function CitasPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agenda"
        title="Agenda asistencial"
        description="Capa operacional base sobre la que CRH prioriza pacientes, riesgo y oportunidad."
        action={<button className="primary-button">Nueva cita</button>}
      />

      <SectionCard title="Agenda del día" subtitle="Control visual de citas por sede, especialidad y profesional">
        <DataTable columns={columns} rows={appointments} />
      </SectionCard>
    </div>
  )
}
