import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { StatCard } from '../components/StatCard'
import { summaryCards, branches, appointments, headquartersNotes } from '../data/demoData'
import { Badge } from '../components/Badge'
import { BrandLogo } from '../components/BrandLogo'

const serviceLines = [
  'Medicina General',
  'Especialidades',
  'Odontologia',
  'Laboratorio Clinico',
  'Enfermeria',
  'Promocion y Prevencion',
]

export function DashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Resumen ejecutivo"
        title="Vista integral MEDICAL PDROZ IPS"
        description="Monitoreo rápido de operación asistencial, farmacia, laboratorio y productividad por sede."
        action={<button className="primary-button">Exportar resumen</button>}
      />

      <section className="institutional-hero">
        <article className="institutional-hero__brand">
          <BrandLogo className="institutional-hero__logo" />
          <div className="institutional-hero__copy">
            <span className="eyebrow">Identidad institucional</span>
            <h3>Atencion medica moderna, clara y confiable</h3>
            <p>
              Plataforma visual alineada con la marca oficial para experiencia profesional en escritorio, tablet y móvil.
            </p>
          </div>
        </article>
        <article className="institutional-hero__services">
          {serviceLines.map((item) => (
            <span key={item} className="service-pill service-pill--filled">{item}</span>
          ))}
        </article>
      </section>

      <section className="stats-grid">
        {summaryCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="split-grid">
        <SectionCard title="Agenda de hoy" subtitle="Atenciones priorizadas y estados visibles">
          <div className="timeline-list">
            {appointments.slice(0, 5).map((item) => (
              <article key={`${item.paciente}-${item.hora}`} className="timeline-item">
                <div>
                  <strong>{item.hora}</strong>
                  <p>{item.paciente}</p>
                </div>
                <div>
                  <strong>{item.especialidad}</strong>
                  <p>{item.sede}</p>
                </div>
                <Badge tone={item.estado === 'Atendida' ? 'success' : item.estado === 'Cancelada' ? 'danger' : 'primary'}>
                  {item.estado}
                </Badge>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Estado por sedes" subtitle="Capacidad instalada y ritmo operativo">
          <div className="branch-list">
            {branches.map((branch) => (
              <article key={branch.name} className="branch-row">
                <div>
                  <strong>{branch.name}</strong>
                  <p>{branch.estado}</p>
                </div>
                <div className="progress-block">
                  <span>{branch.ocupacion}%</span>
                  <div className="progress-bar">
                    <span style={{ width: `${branch.ocupacion}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Lineamientos de seguridad" subtitle="Base funcional preparada para evolucion controlada">
        <div className="note-grid">
          {headquartersNotes.map((note) => (
            <article key={note} className="note-card">
              <span className="note-card__dot" />
              <p>{note}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
