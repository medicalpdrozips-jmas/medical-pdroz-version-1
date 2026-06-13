import { useEffect, useState } from 'react'
import { evaluatePatientCRHAssist, getPatientClinicalContext, getPatients } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

function levelTone(level) {
  if (level === 'critico' || level === 'alto') return 'danger'
  if (level === 'medio') return 'warning'
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
        setError('No fue posible cargar la historia clinica inteligente.')
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

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Historia clinica inteligente"
        title="Historia clinica inteligente"
        description="Base clinica interpretada por CRH Assist para detectar alertas, consistencia diagnostica y presion financiera asociada."
      />

      <div className="confidential-banner">Informacion clinica confidencial</div>
      {loading ? <p className="muted-note">Cargando historia clinica...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="crh-360-layout crh-360-layout--history">
        <SectionCard
          title={patient ? `Caso clinico demo · ${patient.nombres} ${patient.apellidos}` : 'Caso clinico demo'}
          subtitle="Anamnesis, antecedentes, signos vitales, diagnostico CIE10, plan y ordenes"
        >
          {patient && record && assist ? (
            <div className="patient-360">
              <div className="patient-360__chips">
                <Badge tone={levelTone(assist.level)}>CRH Assist {assist.score}/100</Badge>
                <Badge tone={levelTone(assist.clinicalRisk?.level ?? 'bajo')}>Riesgo clinico {assist.clinicalRisk?.score ?? 0}/100</Badge>
                <Badge tone={levelTone(assist.financialRisk?.level ?? 'bajo')}>Riesgo financiero {assist.financialRisk?.score ?? 0}/100</Badge>
              </div>

              <article className="insight-card">
                <h3>Anamnesis</h3>
                <p>{record.anamnesis}</p>
              </article>

              <article className="insight-card">
                <h3>Antecedentes</h3>
                <p>{record.antecedentes}</p>
              </article>

              <article className="insight-card">
                <h3>Signos vitales</h3>
                <div className="vital-grid">
                  {(record.signosVitales ?? []).map((vital) => (
                    <div key={vital.label} className="vital-card">
                      <span>{vital.label}</span>
                      <strong>{vital.value}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Diagnostico CIE10</h3>
                  <p>{record.diagnosticoCie10}</p>
                </article>
                <article className="insight-card">
                  <h3>Plan de manejo</h3>
                  <p>{record.planManejo}</p>
                </article>
              </div>

              <article className="insight-card">
                <h3>Ordenes</h3>
                <ul className="clean-list">
                  {(record.ordenes ?? []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>

              <article className="recommendation-card">
                <span className="eyebrow">Explicacion del motor</span>
                <p>{assist.explanation}</p>
              </article>
            </div>
          ) : (
            <p className="muted-note">No hay un caso clinico disponible para mostrar.</p>
          )}
        </SectionCard>

        <SectionCard title="CRH Assist" subtitle="Interpretacion clinica y financiera del registro">
          {assist ? (
            <div className="assist-panel">
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

              <article className="assist-card assist-card--primary">
                <div className="assist-card__head">
                  <Badge tone="primary">Acciones recomendadas</Badge>
                </div>
                <ul className="clean-list">
                  {(assist.recommendedActions ?? []).map((action) => <li key={action}>{action}</li>)}
                </ul>
              </article>
            </div>
          ) : (
            <p className="muted-note">La interpretacion CRH Assist aparecera aqui cuando el caso este listo.</p>
          )}
        </SectionCard>
      </section>
    </div>
  )
}
