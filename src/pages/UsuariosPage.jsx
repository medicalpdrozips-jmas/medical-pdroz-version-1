import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { roleCards } from '../data/demoData'

export function UsuariosPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Accesos"
        title="Usuarios y roles"
        description="Base visual para futuro login, permisos, segregación funcional y auditoría."
      />
      <SectionCard title="Mapa de roles" subtitle="Separacion entre perfiles asistenciales, operativos y de control">
        <div className="role-grid">
          {roleCards.map((item) => (
            <article key={item.role} className="role-card">
              <div className="role-card__header">
                <h3>{item.role}</h3>
                <Badge tone="primary">{item.level}</Badge>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
