import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { specialties } from '../data/demoData'

export function EspecialidadesPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Oferta clínica"
        title="Especialidades"
        description="Mapa rapido de servicios priorizados y capacidad asistencial por linea."
      />
      <SectionCard title="Especialidades activas" subtitle="Cobertura funcional de la version inicial">
        <div className="specialty-grid">
          {specialties.map((item) => (
            <article key={item.name} className="specialty-card">
              <span className="eyebrow">{item.name}</span>
              <h3>{item.active} pacientes activos</h3>
              <p>{item.description}</p>
              <div className="specialty-card__meta">
                <span>{item.team} profesionales</span>
                <span>Espera promedio {item.wait}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
