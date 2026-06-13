import { useEffect, useState } from 'react'
import { evaluatePatientCRHAssist, getPatientClinicalContext, getPatients } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { getClinicalHistoryIntelligence } from '../data/demoData'

function levelTone(level) {
  if (level === 'critico' || level === 'alto' || level === 'Alto') return 'danger'
  if (level === 'medio' || level === 'Medio') return 'warning'
  return 'success'
}

function severityToLevel(severity) {
  if (severity === 'critica') return 'critico'
  if (severity === 'alta') return 'alto'
  if (severity === 'media') return 'medio'
  return 'bajo'
}

export function HistoriaClinicaPage() {
  const [patient, setPatient] = useState(null)
  const [context, setContext] = useState(null)
  const [assist, setAssist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPage() {
      try {
        setLoading(true)
        setError('')

        const patients = await getPatients()
        const activePatient = patients[0] ?? null

        if (!activePatient) {
          if (active) {
            setPatient(null)
            setContext(null)
            setAssist(null)
          }
          return
        }

        const [contextData, assistData] = await Promise.all([
          getPatientClinicalContext(activePatient.id),
          evaluatePatientCRHAssist(activePatient.id),
        ])

        if (!active) return

        setPatient(activePatient)
        setContext(contextData)
        setAssist(assistData)
      } catch {
        if (!active) return
        setError('No fue posible cargar la Historia Clínica Inteligente.')
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

  const record = context?.clinicalRecord
  const intelligence = patient ? getClinicalHistoryIntelligence(patient.id) : null

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Historia Clínica"
        title="Historia Clínica"
        description="Historia clínica asistida por inteligencia con resumen, alertas, recomendaciones y trazabilidad legal y auditoría."
      />

      <div className="confidential-banner">Información clínica confidencial</div>
      {loading ? <p className="muted-note">Cargando historia clínica...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="crh-360-layout crh-360-layout--history">
        <SectionCard
          title={patient ? `Caso clínico demo · ${patient.nombres} ${patient.apellidos}` : 'Caso clínico demo'}
          subtitle="Módulo clínico-operativo con análisis asistido, alertas y trazabilidad"
        >
          {patient && record && assist && intelligence ? (
            <div className="patient-360">
              <div className="patient-360__chips">
                <Badge tone={levelTone(assist.level)}>CRH Assist {assist.score}/100</Badge>
                <Badge tone={levelTone(intelligence.clinicalRisk)}>Riesgo clínico {intelligence.clinicalRisk}</Badge>
                <Badge tone={levelTone(intelligence.financialImpactRisk)}>Impacto financiero {intelligence.financialImpactRisk}</Badge>
              </div>

              <article className="recommendation-card">
                <span className="eyebrow">Resumen clínico inteligente</span>
                <p>{intelligence.clinicalSummary}</p>
              </article>

              <article className="recommendation-card">
                <span className="eyebrow">Que interpreta CRH Assist</span>
                <p>
                  La historia muestra actividad inflamatoria persistente, continuidad operativa fragil y riesgo de
                  sobrecosto evitable. Por eso el caso de Laura Burbano se convierte en una prioridad clinica,
                  financiera y de auditoria.
                </p>
              </article>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Diagnóstico principal</h3>
                  <p>{intelligence.mainDiagnosis}</p>
                </article>
                <article className="insight-card">
                  <h3>Comorbilidades</h3>
                  <ul className="clean-list">
                    {intelligence.comorbidities.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              </div>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Plan terapéutico</h3>
                  <p>{intelligence.treatmentPlan}</p>
                </article>
                <article className="insight-card">
                  <h3>Riesgo clínico</h3>
                  <p>{intelligence.clinicalRisk}</p>
                </article>
              </div>

              <article className="insight-card">
                <h3>Notas de evolución</h3>
                <ul className="clean-list">
                  {intelligence.evolutionNotes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>Riesgo de falla terapéutica</span>
                  <strong>{intelligence.therapeuticFailureRisk}</strong>
                </article>
                <article className="metric-card">
                  <span>Riesgo de hospitalización</span>
                  <strong>{intelligence.hospitalizationRisk}</strong>
                </article>
                <article className="metric-card">
                  <span>Impacto financiero probable</span>
                  <strong>{intelligence.financialImpactRisk}</strong>
                </article>
                <article className="metric-card">
                  <span>Brechas de atención</span>
                  <strong>{intelligence.careGaps.length}</strong>
                </article>
              </div>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Acciones clínicas pendientes</h3>
                  <div className="compact-stack">
                    <div className="compact-row">
                      <div>
                        <strong>Laboratorios pendientes</strong>
                        <p>{intelligence.pendingLabs.join(', ')}</p>
                      </div>
                      <span>{intelligence.pendingLabs.length}</span>
                    </div>
                    <div className="compact-row">
                      <div>
                        <strong>Autorizaciones pendientes</strong>
                        <p>{intelligence.pendingAuthorizations.join(', ')}</p>
                      </div>
                      <span>{intelligence.pendingAuthorizations.length}</span>
                    </div>
                    <div className="compact-row">
                      <div>
                        <strong>Medicamentos pendientes</strong>
                        <p>{intelligence.pendingMedicationClaims.join(', ')}</p>
                      </div>
                      <span>{intelligence.pendingMedicationClaims.length}</span>
                    </div>
                    <div className="compact-row">
                      <div>
                        <strong>Controles pendientes</strong>
                        <p>{intelligence.careGaps.join(', ')}</p>
                      </div>
                      <span>{intelligence.careGaps.length}</span>
                    </div>
                  </div>
                </article>

                <article className="insight-card">
                  <h3>Análisis clínico CRH Assist</h3>
                  <p>{assist.explanation}</p>
                  <ul className="clean-list">
                    <li>Falla terapéutica: {intelligence.therapeuticFailureRisk}</li>
                    <li>Hospitalización: {intelligence.hospitalizationRisk}</li>
                    <li>Impacto financiero: {intelligence.financialImpactRisk}</li>
                    <li>Brechas activas: {intelligence.careGaps.length}</li>
                  </ul>
                </article>
              </div>

              <article className="insight-card">
                <h3>Sugerencias CRH Assist</h3>
                <ul className="clean-list">
                  {intelligence.crhAssistSuggestions.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>

              <article className="insight-card">
                <h3>Trazabilidad de auditoría</h3>
                <div className="compact-stack">
                  {intelligence.auditTrace.map((item) => (
                    <div key={`${item.date}-${item.user}-${item.action}`} className="compact-row">
                      <div>
                        <strong>{item.date} · {item.user}</strong>
                        <p>{item.action} · {item.module}</p>
                      </div>
                      <span>{item.impact}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="insight-card">
                <h3>Soporte clínico base</h3>
                <div className="compact-stack">
                  <div className="compact-row">
                    <div>
                      <strong>Anamnesis</strong>
                      <p>{record.anamnesis}</p>
                    </div>
                  </div>
                  <div className="compact-row">
                    <div>
                      <strong>Antecedentes</strong>
                      <p>{record.antecedentes}</p>
                    </div>
                  </div>
                  <div className="compact-row">
                    <div>
                      <strong>Diagnóstico CIE10</strong>
                      <p>{record.diagnosticoCie10}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            <p className="muted-note">No hay un caso clínico disponible para mostrar.</p>
          )}
        </SectionCard>

        <SectionCard title="Alertas inteligentes" subtitle="Alertas clínicas accionables">
          {assist && intelligence ? (
            <div className="assist-panel">
              {intelligence.smartAlerts.map((item) => (
                <article key={item} className={`assist-card assist-card--${levelTone(intelligence.clinicalRisk)}`}>
                  <div className="assist-card__head">
                    <Badge tone={levelTone(intelligence.clinicalRisk)}>Alerta clínica</Badge>
                  </div>
                  <p>{item}</p>
                </article>
              ))}

              {(assist.alerts ?? []).map((item) => {
                const level = severityToLevel(item.severity)

                return (
                  <article key={item.id} className={`assist-card assist-card--${levelTone(level)}`}>
                    <div className="assist-card__head">
                      <Badge tone={levelTone(level)}>
                        {item.title}
                      </Badge>
                    </div>
                    <p>{item.description}</p>
                    <small>{item.source}</small>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="muted-note">La interpretación CRH Assist aparecerá aquí cuando el caso esté listo.</p>
          )}
        </SectionCard>
      </section>
    </div>
  )
}
