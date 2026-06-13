import { useEffect, useState } from 'react'
import { evaluatePatientCRHAssist, getMedicationRows, getPatients } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

function levelTone(level) {
  if (level === 'critico' || level === 'alto') return 'danger'
  if (level === 'medio') return 'warning'
  return 'success'
}

const columns = [
  { key: 'medicamento', label: 'Medicamento' },
  { key: 'paciente', label: 'Paciente' },
  { key: 'diagnostico', label: 'Diagnostico' },
  { key: 'contrato', label: 'Contrato' },
  { key: 'costoMensual', label: 'Costo mensual' },
  { key: 'stock', label: 'Stock' },
  { key: 'vencimiento', label: 'Vencimiento' },
  {
    key: 'tipoCosto',
    label: 'Tipo',
    render: (value) => <Badge tone={value === 'Alto costo' ? 'danger' : value === 'Riesgo de continuidad' ? 'warning' : 'primary'}>{value}</Badge>,
  },
  { key: 'impactoContrato', label: 'Impacto PGP' },
]

export function MedicamentosPage() {
  const [medications, setMedications] = useState([])
  const [prioritizedResults, setPrioritizedResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPage() {
      try {
        setLoading(true)
        setError('')

        const [patients, medicationRows] = await Promise.all([
          getPatients(),
          getMedicationRows(),
        ])
        const evaluationRows = await Promise.all(
          patients.map(async (patient) => ({
            patient,
            assist: await evaluatePatientCRHAssist(patient.id),
          })),
        )

        if (!active) return

        setMedications(medicationRows)
        setPrioritizedResults(
          evaluationRows
            .sort((left, right) => (right.assist.financialRisk?.score ?? 0) - (left.assist.financialRisk?.score ?? 0))
            .slice(0, 3),
        )
      } catch {
        if (!active) return
        setError('No fue posible cargar la vista de farmacia inteligente.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPage()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Farmacia inteligente"
        title="Farmacia inteligente"
        description="CRH conecta medicamento, paciente, diagnostico, contrato y costo para mostrar impacto real sobre el margen PGP."
        action={<button className="primary-button">Priorizar alto costo</button>}
      />

      {loading ? <p className="muted-note">Cargando lectura de farmacia...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="stats-grid stats-grid--compact">
        <article className="metric-card">
          <span>Medicamentos alto costo</span>
          <strong>82</strong>
        </article>
        <article className="metric-card">
          <span>Stock critico</span>
          <strong>14</strong>
        </article>
        <article className="metric-card">
          <span>Vencimientos proximos</span>
          <strong>9</strong>
        </article>
        <article className="metric-card">
          <span>Impacto contractual</span>
          <strong>41%</strong>
        </article>
      </section>

      <SectionCard title="Trazabilidad medicamento → paciente → contrato" subtitle="Base demo para futura integracion con farmacia, almacen y costos">
        <DataTable columns={columns} rows={medications} />
      </SectionCard>

      <section className="dashboard-columns">
        <SectionCard title="Medicamentos con mayor peso" subtitle="Moleculas con alto costo o riesgo de continuidad">
          <div className="insight-grid insight-grid--single">
            {medications.map((item) => (
              <article key={item.id} className="insight-card">
                <div className="executive-card__head">
                  <h3>{item.medicamento}</h3>
                  <Badge tone={item.tipoCosto === 'Alto costo' ? 'danger' : 'warning'}>{item.tipoCosto}</Badge>
                </div>
                <p>{item.paciente} · {item.diagnostico}</p>
                <div className="compact-stack">
                  <div className="compact-row">
                    <span>Consumo mensual</span>
                    <strong>{item.consumoMensual}</strong>
                  </div>
                  <div className="compact-row">
                    <span>Pacientes asociados</span>
                    <strong>{item.pacientesAsociados}</strong>
                  </div>
                  <div className="compact-row">
                    <span>Impacto en contrato PGP</span>
                    <strong>{item.impactoContrato}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="CRH Assist Rules Engine" subtitle="Riesgo financiero y acciones recomendadas desde farmacia">
          <div className="assist-panel">
            {prioritizedResults.map(({ patient, assist }) => (
              <article key={patient.id} className={`assist-card assist-card--${levelTone(assist.financialRisk?.level ?? 'bajo')}`}>
                <div className="assist-card__head">
                  <Badge tone={levelTone(assist.financialRisk?.level ?? 'bajo')}>{patient.nombres} {patient.apellidos}</Badge>
                </div>
                <p>Score financiero {assist.financialRisk?.score ?? 0}/100. {assist.financialRisk?.explanation}</p>
              </article>
            ))}

            <article className="assist-card assist-card--primary">
              <div className="assist-card__head">
                <Badge tone="primary">Accion recomendada</Badge>
              </div>
              <p>Priorizar revision de respuesta terapeutica en biologicos para proteger margen y evitar autorizaciones ineficientes.</p>
            </article>
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
