import { useEffect, useState } from 'react'
import { evaluateContractCRHAssist, getContracts, getRuleCatalog } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { getContractIntelligence } from '../data/demoData'

function riskTone(risk) {
  if (risk === 'Rojo' || risk === 'critico' || risk === 'alto' || risk === 'Alto') return 'danger'
  if (risk === 'Amarillo' || risk === 'medio' || risk === 'Medio') return 'warning'
  return 'success'
}

export function ContratoPgpPage() {
  const [contracts, setContracts] = useState([])
  const [rulesCatalog, setRulesCatalog] = useState([])
  const [assistByContractId, setAssistByContractId] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPage() {
      try {
        setLoading(true)
        setError('')

        const [contractsData, rulesData] = await Promise.all([
          getContracts(),
          getRuleCatalog(),
        ])
        const assistEntries = await Promise.all(
          contractsData.map(async (contract) => [
            contract.id,
            await evaluateContractCRHAssist(contract.id),
          ]),
        )

        if (!active) return

        setContracts(contractsData)
        setRulesCatalog(rulesData)
        setAssistByContractId(Object.fromEntries(assistEntries))
        setSelectedId((currentId) => currentId ?? contractsData[0]?.id ?? null)
      } catch {
        if (!active) return
        setError('No fue posible cargar la lectura contractual.')
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

  const crhAssistRulesSummary = {
    enabled: rulesCatalog.filter((rule) => rule.enabled).length,
    categories: Array.from(new Set(rulesCatalog.map((rule) => rule.category))),
  }
  const contract = contracts.find((item) => item.id === selectedId) ?? contracts[0] ?? null
  const assist = contract ? assistByContractId[contract.id] : null
  const intelligence = contract ? getContractIntelligence(contract.id) : null

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Contrato PGP 360"
        title="Contratos PGP"
        description="Lectura ejecutiva del contrato para entender valor contratado, costo ejecutado, desviación, riesgo de pérdida y oportunidades de intervención."
        action={<button className="primary-button">Generar lectura contractual</button>}
      />

      {loading ? <p className="muted-note">Cargando lectura contractual...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="crh-360-layout crh-360-layout--contract">
        <SectionCard title="Contratos priorizados" subtitle="Selecciona el contrato para abrir su ficha de riesgo contractual">
          <div className="patient-selector">
            {contracts.map((item) => {
              const itemAssist = assistByContractId[item.id]

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`patient-selector__item ${item.id === contract?.id ? 'patient-selector__item--active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div>
                    <strong>{item.nombre}</strong>
                    <p>{item.codigo} · {item.eps}</p>
                  </div>
                  <div className="patient-selector__meta">
                    <Badge tone={riskTone(itemAssist?.level ?? 'bajo')}>{itemAssist?.score ?? 0}/100</Badge>
                    <span>{item.margenEstimado}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard title={contract?.nombre ?? 'Contrato PGP'} subtitle="Módulo de inteligencia financiera, costo ejecutado y riesgo contractual">
          {contract && assist && intelligence ? (
            <div className="patient-360">
              <div className="contract-header">
                <div>
                  <span className="eyebrow">EPS</span>
                  <strong>{contract.eps}</strong>
                </div>
                <div>
                  <span className="eyebrow">Código contrato</span>
                  <strong>{contract.codigo}</strong>
                </div>
                <div>
                  <span className="eyebrow">Modalidad</span>
                  <strong>{contract.modalidad}</strong>
                </div>
                <div>
                  <span className="eyebrow">Semáforo de riesgo</span>
                  <Badge tone={riskTone(intelligence.riskLevel)}>{intelligence.marginStatus}</Badge>
                </div>
              </div>

              <div className="patient-360__chips">
                <Badge tone={riskTone(intelligence.riskLevel)}>Riesgo {intelligence.riskLevel}</Badge>
                <Badge tone={riskTone(contract.riesgo)}>Margen {intelligence.marginStatus}</Badge>
                <Badge tone={riskTone(assist.level)}>CRH Assist {assist.score}/100</Badge>
              </div>

              <article className="recommendation-card">
                <span className="eyebrow">Que debe mirar gerencia</span>
                <p>
                  {contract.codigo} concentra el mayor riesgo de perdida en cronicos de alto costo. Laura Burbano y
                  Fredy Cuellar lideran el desvio, mientras adalimumab e insulina glargina explican el principal
                  impacto farmacologico evitable.
                </p>
              </article>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>Presupuesto esperado</span>
                  <strong>{intelligence.expectedBudget}</strong>
                </article>
                <article className="metric-card">
                  <span>Consumido</span>
                  <strong>{intelligence.consumedBudget}</strong>
                </article>
                <article className="metric-card">
                  <span>Proyección de cierre</span>
                  <strong>{intelligence.projectedConsumption}</strong>
                </article>
                <article className="metric-card">
                  <span>Desviación</span>
                  <strong>{intelligence.deviationPercent}</strong>
                </article>
                <article className="metric-card">
                  <span>Estado de margen</span>
                  <strong>{intelligence.marginStatus}</strong>
                </article>
              </div>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>Nivel de riesgo</span>
                  <strong>{intelligence.riskLevel}</strong>
                </article>
                <article className="metric-card">
                  <span>Riesgo de sobrecosto</span>
                  <strong>{intelligence.overrunRisk}</strong>
                </article>
                <article className="metric-card">
                  <span>Riesgo de concentración</span>
                  <strong>{intelligence.concentrationRisk}</strong>
                </article>
                <article className="metric-card">
                  <span>Riesgo por pacientes de alto costo</span>
                  <strong>{intelligence.highCostPatientsRisk}</strong>
                </article>
                <article className="metric-card">
                  <span>Alertas críticas</span>
                  <strong>{assist.criticalAlerts}</strong>
                </article>
              </div>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Pacientes de mayor costo</h3>
                  <div className="compact-stack">
                    {intelligence.topCostPatients.map((item) => (
                      <div key={item.name} className="compact-row">
                        <div>
                          <strong>{item.name}</strong>
                          <p>{item.diagnosis} · participación {item.share}</p>
                        </div>
                        <span>{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="insight-card">
                  <h3>Medicamentos de mayor costo</h3>
                  <div className="compact-stack">
                    {intelligence.topCostMedications.map((item) => (
                      <div key={item.name} className="compact-row">
                        <div>
                          <strong>{item.name}</strong>
                          <p>{item.type} · impacto {item.share}</p>
                        </div>
                        <span>{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Diagnósticos de mayor costo</h3>
                  <div className="compact-stack">
                    {intelligence.topDiagnoses.map((item) => (
                      <div key={item.name} className="compact-row">
                        <div>
                          <strong>{item.name}</strong>
                          <p>Participación {item.share}</p>
                        </div>
                        <span>{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="insight-card">
                  <h3>Panel de proyección</h3>
                  <div className="compact-stack">
                    <div className="compact-row">
                      <div>
                        <strong>Si continúa la tendencia actual</strong>
                        <p>Consumo proyectado al cierre</p>
                      </div>
                      <span>{intelligence.projectedConsumption}</span>
                    </div>
                    <div className="compact-row">
                      <div>
                        <strong>Sobrecosto esperado</strong>
                        <p>Brecha frente al presupuesto esperado</p>
                      </div>
                      <span>{intelligence.deviationPercent}</span>
                    </div>
                    <div className="compact-row">
                      <div>
                        <strong>Margen estimado</strong>
                        <p>Lectura gerencial del cierre proyectado</p>
                      </div>
                      <span>{contract.margenEstimado}</span>
                    </div>
                  </div>
                </article>
              </div>

              <article className="recommendation-card">
                <span className="eyebrow">Resumen ejecutivo contractual</span>
                <p>{assist.explanation}</p>
              </article>

              <article className="insight-card">
                <h3>Tendencia mensual</h3>
                <div className="compact-stack">
                  {intelligence.monthlyTrend.map((item) => (
                    <div key={item.month} className="compact-row">
                      <div>
                        <strong>{item.month}</strong>
                        <p>Consumo observado del período</p>
                      </div>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : (
            <p className="muted-note">Selecciona un contrato para abrir la lectura 360.</p>
          )}
        </SectionCard>

        <SectionCard title="Alertas inteligentes" subtitle="Alertas accionables para gerencia">
          {contract && assist && intelligence ? (
            <div className="assist-panel">
              {intelligence.smartAlerts.map((alert) => (
                <article key={alert} className={`assist-card assist-card--${riskTone(intelligence.riskLevel)}`}>
                  <div className="assist-card__head">
                    <Badge tone={riskTone(intelligence.riskLevel)}>Alerta gerencial</Badge>
                  </div>
                  <p>{alert}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-note">Las alertas inteligentes aparecerán aquí cuando el contrato esté listo.</p>
          )}
        </SectionCard>

        <SectionCard title="Acciones recomendadas" subtitle="Acciones recomendadas para evitar pérdida contractual">
          {contract && assist && intelligence ? (
            <div className="assist-panel">
              <article className={`assist-card assist-card--${riskTone(assist.level)}`}>
                <div className="assist-card__head">
                  <Badge tone={riskTone(assist.level)}>Panel de riesgo contractual</Badge>
                </div>
                <p>Score {assist.score}/100 con nivel {assist.level}. {assist.explanation}</p>
              </article>

              <article className="assist-card assist-card--primary">
                <div className="assist-card__head">
                  <Badge tone="primary">Catálogo configurable</Badge>
                </div>
                <p>La lectura contractual ya usa un conjunto editable de {crhAssistRulesSummary.enabled} reglas ponderadas y {crhAssistRulesSummary.categories.length} categorías activas.</p>
              </article>

              {intelligence.recommendedActions.map((action) => (
                <article key={action} className="assist-card assist-card--primary">
                  <div className="assist-card__head">
                    <Badge tone="primary">Acción recomendada</Badge>
                  </div>
                  <p>{action}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-note">La interpretación automática aparecerá aquí cuando el contrato esté listo.</p>
          )}
        </SectionCard>
      </section>
    </div>
  )
}
