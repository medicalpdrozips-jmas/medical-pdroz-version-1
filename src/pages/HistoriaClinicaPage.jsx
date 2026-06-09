import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

const fields = [
  'Motivo de consulta',
  'Enfermedad actual',
  'Antecedentes',
  'Examen fisico',
  'Diagnóstico CIE-10',
  'Plan de manejo',
  'Formula medica',
  'Ordenes',
  'Evolucion',
  'Firma del profesional',
]

export function HistoriaClinicaPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Módulo clínico"
        title="Historia clínica"
        description="Estructura inicial de captura clínica. No reemplaza validación funcional ni normativa posterior."
      />

      <div className="confidential-banner">Información clínica confidencial</div>

      <SectionCard title="Plantilla inicial" subtitle="Campos organizados para futura autenticacion, firma y trazabilidad">
        <div className="clinical-grid">
          {fields.map((field) => (
            <label key={field} className="clinical-field">
              <span>{field}</span>
              <textarea rows={field === 'Firma del profesional' ? 2 : 5} placeholder={`Registrar ${field.toLowerCase()}`} />
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
