import { useEffect, useState } from 'react'
import { evaluateContractCRHAssist, getContracts, getRuleCatalog } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

function riskTone(risk) {
  if (risk === 'Rojo' || risk === 'critico' || risk === 'alto') return 'danger'
  if (risk === 'Amarillo' || risk === 'medio') return 'warning'
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

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Contrato PGP 360"
        title="Contrato PGP 360"
        description="Vision clinica y financiera del contrato: consumo, proyeccion, margen, concentracion de pacientes y peso farmaceutico."
        action={<button className="primary-button">Generar lectura contractual</button>}
      />

      {loading ? <p className="muted-note">Cargando lectura contractual...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="crh-360-layout crh-360-layout--contract">
        <SectionCard title="Contratos priorizados" subtitle="Selecciona el contrato para abrir su lectura 360">
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

        <SectionCard title={contract?.nombre ?? 'Contrato PGP'} subtitle="Modalidad PGP con lectura prospectiva de costo y margen">
          {contract && assist ? (
            <div className="patient-360">
              <div className="contract-header">
                <div>
                  <span className="eyebrow">EPS</span>
                  <strong>{contract.eps}</strong>
                </div>
                <div>
                  <span className="eyebrow">Codigo contrato</span>
                  <strong>{contract.codigo}</strong>
                </div>
                <div>
                  <span className="eyebrow">Modalidad</span>
                  <strong>{contract.modalidad}</strong>
                </div>
                <div>
                  <span className="eyebrow">Semaforo de riesgo</span>
                  <Badge tone={riskTone(contract.riesgo)}>{contract.riesgo}</Badge>
                </div>
              </div>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>CRH Assist Score</span>
                  <strong>{assist.score}/100</strong>
                </article>
                <article className="metric-card">
                  <span>Nivel de riesgo</span>
                  <strong>{assist.level}</strong>
                </article>
                <article className="metric-card">
                  <span>Alertas criticas</span>
                  <strong>{assist.criticalAlerts}</strong>
                </article>
                <article className="metric-card">
                  <span>Margen estimado</span>
                  <strong>{contract.margenEstimado}</strong>
                </article>
              </div>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>Reglas activas</span>
                  <strong>{crhAssistRulesSummary.enabled}</strong>
                </article>
                <article className="metric-card">
                  <span>Categorias activas</span>
                  <strong>{crhAssistRulesSummary.categories.length}</strong>
                </article>
                <article className="metric-card">
                  <span>Version del motor</span>
                  <strong>V2</strong>
                </article>
                <article className="metric-card">
                  <span>Catalogo</span>
                  <strong>Ponderado</strong>
                </article>
              </div>

              <div className="stats-grid stats-grid--compact">
                <article className="metric-card">
                  <span>Valor contrato</span>
                  <strong>{contract.valorContrato}</strong>
                </article>
                <article className="metric-card">
                  <span>Consumo actual</span>
                  <strong>{contract.consumoActual}</strong>
                </article>
                <article className="metric-card">
                  <span>Proyeccion cierre</span>
                  <strong>{contract.proyeccionCierre}</strong>
                </article>
                <article className="metric-card">
                  <span>Desviacion</span>
                  <strong>{contract.desviacion}</strong>
                </article>
              </div>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Pacientes que mas consumen</h3>
                  <div className="compact-stack">
                    {(contract.pacientesTop ?? []).map((item) => (
                      <div key={item.paciente} className="compact-row">
                        <div>
                          <strong>{item.paciente}</strong>
                          <p>{item.diagnostico}</p>
                        </div>
                        <span>{item.costo}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="insight-card">
                  <h3>Medicamentos que mas pesan</h3>
                  <div className="compact-stack">
                    {(contract.medicamentosTop ?? []).map((item) => (
                      <div key={item.medicamento} className="compact-row">
                        <div>
                          <strong>{item.medicamento}</strong>
                          <p>Impacto {item.impacto}</p>
                        </div>
                        <span>{item.costo}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="recommendation-card">
                <span className="eyebrow">Explicacion del riesgo</span>
                <p>{assist.explanation}</p>
              </article>
            </div>
          ) : (
            <p className="muted-note">Selecciona un contrato para abrir la lectura 360.</p>
          )}
        </SectionCard>

        <SectionCard title="CRH Assist" subtitle="Interpretacion automatica del contrato PGP">
          {contract && assist ? (
            <div className="assist-panel">
              <article className={`assist-card assist-card--${riskTone(assist.level)}`}>
                <div className="assist-card__head">
                  <Badge tone={riskTone(assist.level)}>Resultado del motor</Badge>
                </div>
                <p>Score {assist.score}/100 con nivel {assist.level}. {assist.explanation}</p>
              </article>

              <article className="assist-card assist-card--primary">
                <div className="assist-card__head">
                  <Badge tone="primary">Catalogo configurable</Badge>
                </div>
                <p>La lectura contractual ya usa un conjunto editable de {crhAssistRulesSummary.enabled} reglas ponderadas, listo para persistencia y administracion posterior.</p>
              </article>

              {(contract.alertas ?? []).map((alert) => (
                <article key={alert} className={`assist-card assist-card--${riskTone(contract.riesgo)}`}>
                  <div className="assist-card__head">
                    <Badge tone={riskTone(contract.riesgo)}>Alerta contractual</Badge>
                  </div>
                  <p>{alert}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-note">La interpretacion automatica aparecera aqui cuando el contrato este listo.</p>
          )}
        </SectionCard>
      </section>
    </div>
  )
}
