import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { branches } from '../data/demoData'

export function SedesPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Red institucional"
        title="Sedes"
        description="Visibilidad operativa de Cali, Popayán, Pasto, Pereira, Florencia y Neiva."
      />
      <SectionCard title="Cobertura por sede" subtitle="Resumen de pacientes, agenda y estado operativo">
        <div className="branch-cards">
          {branches.map((branch) => (
            <article key={branch.name} className="branch-card">
              <div className="branch-card__header">
                <h3>{branch.name}</h3>
                <span>{branch.ocupacion}%</span>
              </div>
              <dl className="branch-card__metrics">
                <div><dt>Pacientes</dt><dd>{branch.pacientes}</dd></div>
                <div><dt>Citas del dia</dt><dd>{branch.citas}</dd></div>
                <div><dt>Profesionales</dt><dd>{branch.profesionales}</dd></div>
                <div><dt>Estado operativo</dt><dd>{branch.estado}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
