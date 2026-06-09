import { Badge } from '../components/Badge'
import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { labs } from '../data/demoData'

const columns = [
  { key: 'orden', label: 'Orden' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'paciente', label: 'Paciente' },
  { key: 'examen', label: 'Tipo de examen' },
  { key: 'estado', label: 'Estado', render: (value) => <Badge tone={value === 'Critico' ? 'danger' : value === 'Completado' ? 'success' : 'warning'}>{value}</Badge> },
  { key: 'resultado', label: 'Resultado' },
  { key: 'archivo', label: 'Archivo demo' },
  { key: 'alerta', label: 'Alertas' },
]

export function LaboratoriosPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Diagnóstico"
        title="Laboratorios"
        description="Seguimiento de ordenes, resultados, archivos demo y alertas asistenciales."
      />
      <SectionCard title="Ordenes de laboratorio" subtitle="Preparado para carga futura de adjuntos y estados automatizados">
        <DataTable columns={columns} rows={labs} />
      </SectionCard>
    </div>
  )
}
