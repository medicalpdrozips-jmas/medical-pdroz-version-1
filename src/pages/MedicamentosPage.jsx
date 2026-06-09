import { Badge } from '../components/Badge'
import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { medications } from '../data/demoData'

const columns = [
  { key: 'medicamento', label: 'Medicamento' },
  { key: 'dosis', label: 'Dosis' },
  { key: 'frecuencia', label: 'Frecuencia' },
  { key: 'duracion', label: 'Duracion' },
  { key: 'fecha', label: 'Fecha formulacion' },
  { key: 'entrega', label: 'Estado de entrega', render: (value) => <Badge tone={value === 'Entregado' ? 'success' : value === 'Parcial' ? 'warning' : 'primary'}>{value}</Badge> },
  { key: 'observaciones', label: 'Observaciones' },
]

export function MedicamentosPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Farmacia"
        title="Gestión de medicamentos"
        description="Seguimiento a fórmulas, dispensación y observaciones operativas con datos demo."
      />
      <SectionCard title="Pendientes de entrega" subtitle="Modulo base para integrarse luego con inventario y trazabilidad">
        <DataTable columns={columns} rows={medications} />
      </SectionCard>
    </div>
  )
}
