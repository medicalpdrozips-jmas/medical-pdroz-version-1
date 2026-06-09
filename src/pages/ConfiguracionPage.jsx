import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

const configItems = [
  'Login futuro y autenticación segura.',
  'Permisos por rol con principio de minimo acceso.',
  'Trazabilidad de acciones y auditoría institucional.',
  'Separación entre datos clínicos y administrativos.',
  'Preparación para integración API REST por módulo.',
]

export function ConfiguracionPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Gobierno"
        title="Configuración"
        description="Lineamientos visibles para escalabilidad, seguridad y evoluciones controladas."
      />
      <SectionCard title="Preparacion tecnica" subtitle="Hoja base para la siguiente fase del producto">
        <div className="note-grid">
          {configItems.map((item) => (
            <article key={item} className="note-card">
              <span className="note-card__dot" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
