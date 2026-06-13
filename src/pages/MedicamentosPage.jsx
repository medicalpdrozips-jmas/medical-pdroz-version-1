import { useEffect, useState } from 'react'
import { evaluatePatientCRHAssist, getMedicationRows, getPatients } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { getPharmacyIntelligence } from '../data/demoData'

function levelTone(level) {
  if (level === 'critico' || level === 'alto' || level === 'Alto') return 'danger'
  if (level === 'medio' || level === 'Medio') return 'warning'
  return 'success'
}

const columns = [
  { key: 'medicamento', label: 'Medicamento' },
  { key: 'paciente', label: 'Paciente' },
  { key: 'diagnostico', label: 'Diagnóstico' },
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
        setError('No fue posible cargar la vista de Farmacia Inteligente.')
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

  const intelligenceRows = medications.map((item) => ({
    medication: item,
    intelligence: getPharmacyIntelligence(item.id),
  }))

  const totalCriticalMedications = intelligenceRows.filter((item) => item.intelligence.highCostDrug || item.intelligence.shortageRisk === 'Alto').length
  const highShortageCount = intelligenceRows.filter((item) => item.intelligence.shortageRisk === 'Alto').length
  const estimatedMonthlyCost = intelligenceRows.reduce((total, item) => total + Number.parseFloat(item.intelligence.monthlyCost.replace(/[^0-9,.-]/g, '').replace(',', '.')), 0)
  const annualProjectedCost = intelligenceRows.reduce((total, item) => total + Number.parseFloat(item.intelligence.annualProjectedCost.replace(/[^0-9,.-]/g, '').replace(',', '.')), 0)
  const pendingAuthorizations = intelligenceRows.filter((item) => /pendiente/i.test(item.intelligence.authorizationStatus)).length
  const claimGapPatients = intelligenceRows.filter((item) => item.intelligence.lastClaimGapDays >= 10).length

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Farmacia Inteligente"
        title="Farmacia Inteligente"
        description="Inteligencia farmacológica para controlar medicamentos críticos, consumo proyectado, riesgo de desabastecimiento y efecto sobre contratos PGP."
        action={<button className="primary-button">Priorizar alto costo</button>}
      />

      {loading ? <p className="muted-note">Cargando lectura de farmacia...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <article className="recommendation-card">
        <span className="eyebrow">Impacto financiero estimado</span>
        <p>
          Adalimumab e insulina glargina son hoy los frentes que mas debe vigilar la IPS: uno por alto costo y el otro
          por riesgo de continuidad en cronicos que ya afectan el margen del contrato PGP-NUE-2026-01.
        </p>
      </article>

      <section className="stats-grid stats-grid--compact">
        <article className="metric-card">
          <span>Comando de riesgo farmacéutico</span>
          <strong>{totalCriticalMedications}</strong>
          <p>Total de medicamentos críticos priorizados</p>
        </article>
        <article className="metric-card">
          <span>Riesgo de desabastecimiento</span>
          <strong>{highShortageCount}</strong>
          <p>Medicamentos con riesgo alto de ruptura</p>
        </article>
        <article className="metric-card">
          <span>Costo mensual estimado</span>
          <strong>${estimatedMonthlyCost.toFixed(1)} M</strong>
          <p>Carga mensual consolidada del portafolio priorizado</p>
        </article>
        <article className="metric-card">
          <span>Impacto sobre contrato PGP</span>
          <strong>16,5%</strong>
          <p>Participación agregada del portafolio farmacológico priorizado</p>
        </article>
      </section>

      <SectionCard title="Trazabilidad medicamento → paciente → contrato" subtitle="Relación entre inventario crítico, consumo, continuidad terapéutica y costo contractual">
        <DataTable columns={columns} rows={medications} />
      </SectionCard>

      <section className="dashboard-columns">
        <SectionCard title="Inventario inteligente" subtitle="Stock actual, consumo proyectado, cobertura y riesgo de ruptura">
          <div className="insight-grid insight-grid--single">
            {intelligenceRows.map(({ medication, intelligence }) => (
              <article key={medication.id} className="insight-card">
                <div className="executive-card__head">
                  <h3>{medication.medicamento}</h3>
                  <Badge tone={levelTone(intelligence.shortageRisk)}>{intelligence.shortageRisk}</Badge>
                </div>
                <p>{medication.paciente} · {medication.diagnostico}</p>
                <div className="compact-stack">
                  <div className="compact-row">
                    <span>Stock actual</span>
                    <strong>{intelligence.currentStock}</strong>
                  </div>
                  <div className="compact-row">
                    <span>Consumo mensual</span>
                    <strong>{intelligence.monthlyConsumption}</strong>
                  </div>
                  <div className="compact-row">
                    <span>Días de cobertura</span>
                    <strong>{intelligence.daysOfCoverage}</strong>
                  </div>
                  <div className="compact-row">
                    <span>Riesgo de ruptura</span>
                    <strong>{intelligence.shortageRisk}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Impacto contractual" subtitle="Medicamentos que más consumen presupuesto, biológicos y proyección anual">
          <div className="assist-panel">
            {intelligenceRows.map(({ medication, intelligence }) => (
              <article key={medication.id} className={`assist-card assist-card--${intelligence.highCostDrug ? 'danger' : 'warning'}`}>
                <div className="assist-card__head">
                  <Badge tone={intelligence.highCostDrug ? 'danger' : 'warning'}>
                    {intelligence.highCostDrug ? 'Biológico / alto costo' : 'Impacto contractual'}
                  </Badge>
                </div>
                <p>{medication.medicamento} impacta {intelligence.contractImpactPercent} del contrato y proyecta {intelligence.annualProjectedCost} al año.</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="dashboard-columns">
        <SectionCard title="Adherencia y riesgo de reclamos" subtitle="Pacientes sin reclamar, brechas de adherencia y autorizaciones pendientes">
          <div className="risk-summary-grid">
            <article className="metric-card">
              <span>Pacientes sin reclamar</span>
              <strong>{claimGapPatients}</strong>
              <p>Medicamentos con brecha de reclamo mayor o igual a 10 días</p>
            </article>
            <article className="metric-card">
              <span>Brechas de adherencia</span>
              <strong>{intelligenceRows.filter((item) => item.intelligence.adherenceRisk === 'Alto').length}</strong>
              <p>Casos con riesgo alto de continuidad terapéutica</p>
            </article>
            <article className="metric-card">
              <span>Autorizaciones pendientes</span>
              <strong>{pendingAuthorizations}</strong>
              <p>Requieren cierre operativo para evitar ruptura o retraso</p>
            </article>
            <article className="metric-card">
              <span>Proyección anual</span>
              <strong>${annualProjectedCost.toFixed(1)} M</strong>
              <p>Costo agregado anual estimado del portafolio priorizado</p>
            </article>
          </div>

          <div className="assist-panel">
            {intelligenceRows.map(({ medication, intelligence }) => (
              <article key={`${medication.id}-adherence`} className={`assist-card assist-card--${levelTone(intelligence.adherenceRisk)}`}>
                <div className="assist-card__head">
                  <Badge tone={levelTone(intelligence.adherenceRisk)}>
                    {medication.medicamento}
                  </Badge>
                </div>
                <p>Adherencia {intelligence.adherenceRisk}. Autorización: {intelligence.authorizationStatus}. Última brecha de reclamo: {intelligence.lastClaimGapDays} días.</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Motor de Reglas Inteligente" subtitle="Riesgo financiero y acciones recomendadas desde farmacia">
          <div className="assist-panel">
            {prioritizedResults.map(({ patient, assist }) => (
              <article key={patient.id} className={`assist-card assist-card--${levelTone(assist.financialRisk?.level ?? 'bajo')}`}>
                <div className="assist-card__head">
                  <Badge tone={levelTone(assist.financialRisk?.level ?? 'bajo')}>{patient.nombres} {patient.apellidos}</Badge>
                </div>
                <p>Score financiero {assist.financialRisk?.score ?? 0}/100. {assist.financialRisk?.explanation}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="dashboard-columns">
        <SectionCard title="Alertas inteligentes" subtitle="Alertas accionables por medicamento">
          <div className="assist-panel">
            {intelligenceRows.map(({ medication, intelligence }) => (
              <article key={`${medication.id}-alert`} className={`assist-card assist-card--${levelTone(intelligence.shortageRisk)}`}>
                <div className="assist-card__head">
                  <Badge tone={levelTone(intelligence.shortageRisk)}>Alerta</Badge>
                </div>
                <p>{intelligence.smartAlert}</p>
                <small>{medication.medicamento} · impacto {intelligence.contractImpactPercent}</small>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Acciones recomendadas" subtitle="Acciones recomendadas para farmacia, auditoría y gerencia">
          <div className="assist-panel">
            {intelligenceRows.map(({ medication, intelligence }) => (
              <article key={`${medication.id}-action`} className="assist-card assist-card--primary">
                <div className="assist-card__head">
                  <Badge tone="primary">Acción recomendada</Badge>
                </div>
                <p>{intelligence.recommendedAction}</p>
                <small>{medication.medicamento} · {intelligence.authorizationStatus}</small>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
