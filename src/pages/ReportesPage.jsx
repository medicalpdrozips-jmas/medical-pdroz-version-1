import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { reportMetrics } from '../data/demoData'

export function ReportesPage() {
  const maxValue = Math.max(...reportMetrics.map((item) => item.value))

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Vista gerencial"
        title="Reportes"
        description="Indicadores resumidos para dirección y seguimiento de operación multisede."
      />
      <section className="split-grid">
        <SectionCard title="Indicadores clave" subtitle="Lectura rapida por categoria">
          <div className="stats-grid stats-grid--compact">
            {reportMetrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <span>{metric.label}</span>
                <strong>{metric.value}{metric.label === 'Productividad mensual' ? '%' : ''}</strong>
              </article>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Tendencia visual" subtitle="Grafico sencillo listo para reemplazo por datos reales">
          <div className="chart-list">
            {reportMetrics.map((metric) => (
              <div key={metric.label} className="chart-row">
                <span>{metric.label}</span>
                <div className="chart-row__track">
                  <span style={{ width: `${(metric.value / maxValue) * 100}%`, background: metric.color }} />
                </div>
                <strong>{metric.value}{metric.label === 'Productividad mensual' ? '%' : ''}</strong>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
