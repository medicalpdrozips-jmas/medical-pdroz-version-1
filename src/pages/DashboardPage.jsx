import { useEffect, useState } from 'react'
import { Badge } from '../components/Badge'
import {
  evaluateContractCRHAssist,
  evaluatePatientCRHAssist,
  getAppointments,
  getApiRuntimeStatus,
  getContracts,
  getPatients,
  getRuleCatalog,
} from '../api/crhApiClient'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import {
  branches,
  crhDecisionPanels,
  crhFinancialSignals,
  crhStrategicAlerts,
  dashboardKpis,
  dashboardServiceLines,
  headquartersNotes,
} from '../data/demoData'

function levelTone(level) {
  if (level === 'critico' || level === 'alto') return 'danger'
  if (level === 'medio') return 'warning'
  return 'success'
}

export function DashboardPage() {
  const [rulesCatalog, setRulesCatalog] = useState([])
  const [appointments, setAppointments] = useState([])
  const [patientEvaluations, setPatientEvaluations] = useState([])
  const [contractEvaluations, setContractEvaluations] = useState([])
  const [apiStatus, setApiStatus] = useState(getApiRuntimeStatus())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const [rulesData, patientsData, contractsData, appointmentsData] = await Promise.all([
          getRuleCatalog(),
          getPatients(),
          getContracts(),
          getAppointments(),
        ])
        const [patientEvaluationRows, contractEvaluationRows] = await Promise.all([
          Promise.all(
            patientsData.map(async (patient) => ({
              patient,
              evaluation: await evaluatePatientCRHAssist(patient.id),
            })),
          ),
          Promise.all(
            contractsData.map(async (contract) => ({
              contract,
              evaluation: await evaluateContractCRHAssist(contract.id),
            })),
          ),
        ])

        if (!active) return

        setRulesCatalog(rulesData)
        setAppointments(appointmentsData)
        setPatientEvaluations(patientEvaluationRows)
        setContractEvaluations(contractEvaluationRows)
        setApiStatus(getApiRuntimeStatus())
      } catch {
        if (!active) return
        setError('No fue posible cargar el Command Center.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const crhAssistCommandCenter = {
    score: Math.round(
      patientEvaluations.reduce((total, item) => total + (item.evaluation.score ?? 0), 0) /
      (patientEvaluations.length || 1),
    ),
    criticalAlerts: patientEvaluations
      .flatMap((item) => item.evaluation.alerts ?? [])
      .filter((alert) => alert.severity === 'critica').length,
    topPatients: patientEvaluations
      .slice()
      .sort((left, right) => (right.evaluation.score ?? 0) - (left.evaluation.score ?? 0))
      .slice(0, 3)
      .map((item) => ({
        patientId: item.patient.id,
        name: `${item.patient.nombres} ${item.patient.apellidos}`,
        score: item.evaluation.score ?? 0,
        level: item.evaluation.level ?? 'bajo',
        topAlert: item.evaluation.alerts?.[0]?.title ?? 'Sin alerta prioritaria',
      })),
  }
  const crhAssistRulesSummary = {
    enabled: rulesCatalog.filter((rule) => rule.enabled).length,
    categories: Array.from(new Set(rulesCatalog.map((rule) => rule.category))),
  }
  const crhCommandCenterContracts = contractEvaluations.map((item) => ({
    id: item.contract.id,
    codigo: item.contract.codigo,
    nombre: item.contract.nombre,
    eps: item.contract.eps,
    margenEstimado: item.contract.margenEstimado,
    assistScore: item.evaluation.score ?? 0,
    assistLevel: item.evaluation.level ?? 'bajo',
    criticalAlerts: item.evaluation.criticalAlerts ?? 0,
  }))

  return (
    <div className="page-stack page-stack--dashboard">
      <PageHeader
        eyebrow="CRH Health Intelligence Core V1"
        title="Command Center"
        description="CRH no solo registra. Interpreta riesgo clinico-financiero, proyecta consumo y recomienda acciones para proteger resultados asistenciales y contractuales."
        action={(
          <div className="toolbar-actions">
            <Badge tone={apiStatus.connected ? 'success' : 'warning'}>
              {apiStatus.connected ? 'Backend conectado' : 'Modo demo / fallback'}
            </Badge>
            <button className="primary-button">Activar lectura gerencial</button>
          </div>
        )}
      />

      {loading ? <p className="muted-note">Cargando Command Center...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}
      {!loading && !apiStatus.connected && apiStatus.lastError ? (
        <p className="muted-note">Fallback activo: {apiStatus.lastError}</p>
      ) : null}

      <section className="institutional-hero crh-hero">
        <article className="institutional-hero__brand crh-hero__brand">
          <div className="institutional-hero__copy">
            <span className="eyebrow">CRH Assist Rules Engine V2</span>
            <h3>El cerebro interpretable y configurable de la plataforma</h3>
            <p>
              Paciente → Diagnostico → Medicamento → Historia clinica → Contrato PGP → Costo → Riesgo → Accion recomendada.
              Ese flujo ahora corre sobre un catalogo editable de {crhAssistRulesSummary.enabled} reglas ponderadas y listas para futura persistencia en API/PostgreSQL.
            </p>
          </div>
          <div className="kpi-strip kpi-strip--4">
            {dashboardKpis.slice(0, 4).map((item) => (
              <article key={item.label} className={`kpi-strip__card kpi-strip__card--${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.meta}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="institutional-hero__services institutional-hero__services--premium">
          <div className="panel-heading">
            <span className="eyebrow">CRH Assist en produccion demo</span>
            <p>Resultados derivados del motor interpretable, listos para futura API y trazabilidad clinica-financiera.</p>
          </div>
          <div className="service-pills service-pills--dashboard">
            {dashboardServiceLines.map((item) => (
              <span key={item} className="service-pill service-pill--filled">{item}</span>
            ))}
          </div>
          <div className="coverage-card coverage-card--assist">
            <span className="eyebrow">Score promedio CRH Assist</span>
            <strong>{crhAssistCommandCenter.score}/100</strong>
            <p>{crhAssistCommandCenter.criticalAlerts} alertas criticas activas en la lectura actual.</p>
          </div>
        </article>
      </section>

      <section className="stats-grid crh-kpi-grid">
        {dashboardKpis.map((item) => (
          <article key={item.label} className={`executive-kpi executive-kpi--${item.tone}`}>
            <span className="executive-kpi__label">{item.label}</span>
            <strong className="executive-kpi__value">{item.value}</strong>
            <p className="executive-kpi__meta">{item.meta}</p>
          </article>
        ))}
      </section>

      <SectionCard
        title="Pulso del Rules Engine"
        subtitle="Resumen ejecutivo del motor interpretable, ponderado y configurable"
      >
        <div className="executive-grid">
          <article className="executive-card">
            <div className="executive-card__head">
              <h3>CRH Assist Score</h3>
              <Badge tone={levelTone(crhAssistCommandCenter.score > 80 ? 'critico' : crhAssistCommandCenter.score > 60 ? 'alto' : crhAssistCommandCenter.score > 30 ? 'medio' : 'bajo')}>
                {crhAssistCommandCenter.score}/100
              </Badge>
            </div>
            <strong className="executive-card__value">{crhAssistCommandCenter.score}</strong>
            <p>Promedio de riesgo consolidado sobre los pacientes priorizados en esta version demo.</p>
          </article>

          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Catalogo activo</h3>
              <Badge tone="primary">V2 configurable</Badge>
            </div>
            <strong className="executive-card__value">{crhAssistRulesSummary.enabled}</strong>
            <p>{crhAssistRulesSummary.categories.length} categorias activas con score ponderado y trazabilidad interpretable.</p>
          </article>

          {crhDecisionPanels.slice(0, 2).map((card) => (
            <article key={card.title} className="executive-card">
              <div className="executive-card__head">
                <h3>{card.title}</h3>
                <Badge tone="primary">{card.trend}</Badge>
              </div>
              <strong className="executive-card__value">{card.value}</strong>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <section className="dashboard-columns">
        <SectionCard title="Alertas criticas" subtitle="Eventos donde CRH prioriza intervencion clinica, contractual o farmaceutica">
          <div className="intelligence-grid">
            {crhStrategicAlerts.map((alert) => (
              <article key={alert.title} className={`intelligence-card intelligence-card--${alert.tone}`}>
                <div className="intelligence-card__head">
                  <Badge tone={alert.tone}>{alert.title}</Badge>
                </div>
                <p>{alert.message}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Explicacion del riesgo" subtitle="Que esta empujando hoy el score institucional">
          <div className="assist-panel">
            {crhAssistCommandCenter.topPatients.map((patient) => (
              <article key={patient.patientId} className={`assist-card assist-card--${levelTone(patient.level)}`}>
                <div className="assist-card__head">
                  <Badge tone={levelTone(patient.level)}>{patient.name}</Badge>
                </div>
                <p>Score {patient.score}/100. Hallazgo principal: {patient.topAlert}.</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="dashboard-columns">
        <SectionCard title="Contratos PGP priorizados" subtitle="Contrato, score del motor y lectura rapida de criticidad">
          <div className="crh-contract-list">
            {crhCommandCenterContracts.map((contract) => (
              <article key={contract.id} className="crh-contract-row">
                <div>
                  <strong>{contract.nombre}</strong>
                  <p>{contract.codigo} · {contract.eps}</p>
                </div>
                <div>
                  <strong>{contract.assistScore}/100</strong>
                  <p>{contract.criticalAlerts} alertas criticas · margen {contract.margenEstimado}</p>
                </div>
                <Badge tone={levelTone(contract.assistLevel)}>{contract.assistLevel}</Badge>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Agenda priorizada del dia" subtitle="Atenciones visibles con lectura rapida de estado operativo">
          <div className="timeline-list">
            {appointments.slice(0, 5).map((item) => (
              <article key={`${item.id}-${item.hora}`} className="timeline-item">
                <div>
                  <strong>{item.hora}</strong>
                  <p>{item.paciente}</p>
                </div>
                <div>
                  <strong>{item.especialidad}</strong>
                  <p>{item.sede}</p>
                </div>
                <Badge tone={item.estado === 'Atendida' ? 'success' : item.estado === 'Cancelada' ? 'danger' : 'primary'}>
                  {item.estado}
                </Badge>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="dashboard-columns">
        <SectionCard title="Senales financieras" subtitle="Contexto agregado del riesgo economico y contractual">
          <div className="finance-grid">
            {crhFinancialSignals.map((card) => (
              <article key={card.label} className="finance-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.meta}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Acciones recomendadas del dia" subtitle="Sugerencias del motor sobre los casos mas presionados">
          <div className="assist-panel">
            <article className="assist-card assist-card--danger">
              <div className="assist-card__head">
                <Badge tone="danger">Prioridad alta</Badge>
              </div>
              <p>Escalar los casos con score superior a 80 a comite clinico-financiero.</p>
            </article>
            <article className="assist-card assist-card--warning">
              <div className="assist-card__head">
                <Badge tone="warning">Seguimiento</Badge>
              </div>
              <p>Cerrar brechas de control en pacientes cronicos con senales de evento evitable.</p>
            </article>
            <article className="assist-card assist-card--primary">
              <div className="assist-card__head">
                <Badge tone="primary">Optimizacion</Badge>
              </div>
              <p>Correlacionar terapias de alto costo con respuesta clinica para proteger margen PGP.</p>
            </article>
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Estado de la red" subtitle="La operacion multisede se observa como un tablero de capacidad y presion asistencial">
        <div className="branch-list branch-list--grid">
          {branches.map((branch) => (
            <article key={branch.name} className="branch-row branch-row--card">
              <div>
                <strong>{branch.name}</strong>
                <p>{branch.estado}</p>
              </div>
              <div className="progress-block">
                <span>{branch.ocupacion}%</span>
                <div className="progress-bar">
                  <span style={{ width: `${branch.ocupacion}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Principios de construccion segura" subtitle="Base funcional preparada para crecer sin tocar produccion">
        <div className="note-grid">
          {headquartersNotes.map((note) => (
            <article key={note} className="note-card">
              <span className="note-card__dot" />
              <p>{note}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
