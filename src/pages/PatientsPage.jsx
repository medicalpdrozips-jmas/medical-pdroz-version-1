import { useEffect, useState } from 'react'
import {
  evaluatePatientCRHAssist,
  getContractById,
  getContracts,
  getPatientClinicalContext,
  getPatients,
  getRuleCatalog,
} from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

function riskTone(risk) {
  if (risk === 'Alto') return 'danger'
  if (risk === 'Medio') return 'warning'
  return 'success'
}

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

export function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [contracts, setContracts] = useState([])
  const [ruleCatalog, setRuleCatalog] = useState([])
  const [assistByPatientId, setAssistByPatientId] = useState({})
  const [contextByPatientId, setContextByPatientId] = useState({})
  const [contractById, setContractById] = useState({})
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPage() {
      try {
        setLoading(true)
        setError('')

        const [patientsData, contractsData, rulesData] = await Promise.all([
          getPatients(),
          getContracts(),
          getRuleCatalog(),
        ])

        const [assistEntries, contextEntries, contractEntries] = await Promise.all([
          Promise.all(
            patientsData.map(async (patient) => [
              patient.id,
              await evaluatePatientCRHAssist(patient.id),
            ]),
          ),
          Promise.all(
            patientsData.map(async (patient) => [
              patient.id,
              await getPatientClinicalContext(patient.id),
            ]),
          ),
          Promise.all(
            contractsData.map(async (contract) => [
              contract.id,
              await getContractById(contract.id),
            ]),
          ),
        ])

        if (!active) return

        setPatients(patientsData)
        setContracts(contractsData)
        setRuleCatalog(rulesData)
        setAssistByPatientId(Object.fromEntries(assistEntries))
        setContextByPatientId(Object.fromEntries(contextEntries))
        setContractById(Object.fromEntries(contractEntries))
        setSelectedId((currentId) => currentId ?? patientsData[0]?.id ?? null)
      } catch {
        if (!active) return
        setError('No fue posible cargar Paciente 360.')
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

  const filteredPatients = patients.filter((patient) => {
    const haystack = `${patient.nombres} ${patient.apellidos} ${patient.numeroDocumento} ${patient.diagnostico}`.toLowerCase()
    return haystack.includes(query.toLowerCase())
  })

  const activePatient = filteredPatients.find((patient) => patient.id === selectedId)
    ?? patients.find((patient) => patient.id === selectedId)
    ?? filteredPatients[0]
    ?? patients[0]
    ?? null
  const context = activePatient ? contextByPatientId[activePatient.id] : null
  const profile = context?.profile
  const assist = activePatient ? assistByPatientId[activePatient.id] : null
  const contract = profile?.contratoId ? contractById[profile.contratoId] : null
  const crhAssistRulesSummary = {
    categories: Array.from(new Set(ruleCatalog.map((rule) => rule.category))),
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Paciente 360"
        title="Paciente 360"
        description="Una sola vista para entender historia clinica, costo, contrato asociado, riesgo y proxima accion recomendada."
        action={<button className="primary-button">Abrir caso priorizado</button>}
      />

      <SectionCard title="Busqueda y priorizacion" subtitle="Preparado para futura conexion a filtros clinicos, contratos y riesgo">
        <div className="filters-grid filters-grid--crh">
          <input
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, documento o diagnostico"
          />
          <select className="field" defaultValue="all">
            <option value="all">Todos los riesgos</option>
            <option>Alto</option>
            <option>Medio</option>
            <option>Bajo</option>
          </select>
          <select className="field" defaultValue="all">
            <option value="all">Todos los contratos</option>
            {contracts.map((contractOption) => (
              <option key={contractOption.id}>{contractOption.codigo}</option>
            ))}
          </select>
          <select className="field" defaultValue="all">
            <option value="all">Todas las sedes</option>
            <option>Cali</option>
            <option>Popayan</option>
            <option>Pasto</option>
            <option>Pereira</option>
            <option>Florencia</option>
            <option>Neiva</option>
          </select>
        </div>
        {loading ? <p className="muted-note">Cargando lectura 360...</p> : null}
        {error ? <p className="muted-note">{error}</p> : null}
      </SectionCard>

      <section className="crh-360-layout">
        <SectionCard title="Pacientes priorizados" subtitle="Selecciona un caso para abrir su lectura 360">
          <div className="patient-selector">
            {filteredPatients.map((patient) => {
              const patientAssist = assistByPatientId[patient.id]

              return (
                <button
                  key={patient.id}
                  type="button"
                  className={`patient-selector__item ${patient.id === activePatient?.id ? 'patient-selector__item--active' : ''}`}
                  onClick={() => setSelectedId(patient.id)}
                >
                  <div>
                    <strong>{patient.nombres} {patient.apellidos}</strong>
                    <p>{patient.numeroDocumento} · {patient.eps}</p>
                  </div>
                  <div className="patient-selector__meta">
                    <Badge tone={levelTone(patientAssist?.level ?? 'bajo')}>{patientAssist?.score ?? 0}/100</Badge>
                    <span>{patient.costoAcumulado}</span>
                  </div>
                </button>
              )
            })}
          </div>
          {!loading && filteredPatients.length === 0 ? <p className="muted-note">No hay pacientes para ese filtro.</p> : null}
        </SectionCard>

        <SectionCard title="Paciente 360" subtitle="Vista integrada de clinica, contrato, costo y recomendacion">
          {activePatient && context && profile && assist ? (
            <div className="patient-360">
              <div className="patient-360__identity">
                <div className="avatar-chip">{activePatient.nombres?.[0]}{activePatient.apellidos?.[0]}</div>
                <div>
                  <strong>{activePatient.nombres} {activePatient.apellidos}</strong>
                  <p>{activePatient.tipoDocumento} {activePatient.numeroDocumento} · {activePatient.ciudad}</p>
                </div>
              </div>

              <div className="patient-360__chips">
                <Badge tone={riskTone(profile.riesgoClinico)}>Riesgo clinico {profile.riesgoClinico}</Badge>
                <Badge tone={riskTone(profile.riesgoFinanciero)}>Riesgo financiero {profile.riesgoFinanciero}</Badge>
                <Badge tone="primary">{profile.contratoNombre}</Badge>
                <Badge tone={levelTone(assist.level)}>CRH Assist {assist.score}/100</Badge>
              </div>

              <dl className="detail-grid detail-grid--triple">
                <div><dt>EPS</dt><dd>{profile.eps}</dd></div>
                <div><dt>Contrato asociado</dt><dd>{contract?.codigo}</dd></div>
                <div><dt>Programa</dt><dd>{activePatient.programa}</dd></div>
                <div><dt>Estado</dt><dd>{activePatient.estado}</dd></div>
                <div><dt>Costo acumulado</dt><dd>{profile.costoAcumulado}</dd></div>
                <div><dt>Costo del mes</dt><dd>{profile.costoMes}</dd></div>
              </dl>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>Score CRH Assist</span>
                  <strong>{assist.score}/100</strong>
                </article>
                <article className="metric-card">
                  <span>Nivel de riesgo</span>
                  <strong>{assist.level}</strong>
                </article>
                <article className="metric-card">
                  <span>Riesgo clinico</span>
                  <strong>{assist.clinicalRisk?.score ?? 0}/100</strong>
                </article>
                <article className="metric-card">
                  <span>Riesgo financiero</span>
                  <strong>{assist.financialRisk?.score ?? 0}/100</strong>
                </article>
              </div>

              <div className="risk-summary-grid">
                <article className="metric-card">
                  <span>Version del motor</span>
                  <strong>{assist.rulesVersion}</strong>
                </article>
                <article className="metric-card">
                  <span>Reglas activas</span>
                  <strong>{assist.enabledRules}</strong>
                </article>
                <article className="metric-card">
                  <span>Catalogo V2</span>
                  <strong>{crhAssistRulesSummary.categories.length} categorias</strong>
                </article>
                <article className="metric-card">
                  <span>Alertas activas</span>
                  <strong>{assist.alerts?.length ?? 0}</strong>
                </article>
              </div>

              <div className="insight-grid">
                <article className="insight-card">
                  <h3>Diagnosticos principales</h3>
                  <ul className="clean-list">
                    {(profile.diagnosticosPrincipales ?? []).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
                <article className="insight-card">
                  <h3>Medicamentos activos</h3>
                  <ul className="clean-list">
                    {(context.profile?.medicamentosActivos ?? []).map((item) => (
                      <li key={item.id ?? item.nombre}>
                        <strong>{item.nombre}</strong>
                        <span>{item.estado} · {item.costo ?? item.tipoCosto}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <article className="insight-card">
                <h3>Ultimas atenciones</h3>
                <div className="compact-stack">
                  {(profile.ultimasAtenciones ?? []).map((event) => (
                    <div key={`${event.fecha}-${event.servicio}`} className="compact-row">
                      <div>
                        <strong>{event.servicio}</strong>
                        <p>{event.resumen}</p>
                      </div>
                      <span>{event.fecha}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="recommendation-card">
                <span className="eyebrow">Explicacion del riesgo</span>
                <p>{assist.explanation}</p>
              </article>
            </div>
          ) : (
            <p className="muted-note">Selecciona un paciente para abrir la lectura 360.</p>
          )}
        </SectionCard>

        <SectionCard title="CRH Assist" subtitle="Alertas automaticas, explicacion y acciones recomendadas">
          {assist ? (
            <div className="assist-panel">
              {(assist.alerts ?? []).map((alert) => (
                <article key={alert.id} className={`assist-card assist-card--${levelTone(severityToLevel(alert.severity))}`}>
                  <div className="assist-card__head">
                    <Badge tone={levelTone(severityToLevel(alert.severity))}>
                      {alert.title}
                    </Badge>
                  </div>
                  <p>{alert.description}</p>
                  <small>{alert.source} · {alert.relatedModule}</small>
                </article>
              ))}

              <article className="assist-card assist-card--primary">
                <div className="assist-card__head">
                  <Badge tone="primary">Motor configurable</Badge>
                </div>
                <p>El score actual usa {assist.enabledRules} reglas ponderadas del catalogo V2. Cada regla puede persistirse luego en PostgreSQL y administrarse desde backend.</p>
              </article>

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
            <p className="muted-note">La lectura CRH Assist aparecera aqui cuando el caso este listo.</p>
          )}
        </SectionCard>
      </section>
    </div>
  )
}
