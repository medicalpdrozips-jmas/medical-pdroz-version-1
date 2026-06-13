import { useEffect, useState } from 'react'
import { Badge } from '../components/Badge'
import { SectionCard } from '../components/SectionCard'
import { CRH_BRAND } from '../config/brand'
import {
  evaluateContractCRHAssist,
  evaluatePatientCRHAssist,
  getAppointments,
  getContracts,
  getPatients,
  getRuleCatalog,
} from '../api/crhApiClient'
import { getApiDbStatus, getRuntimeDiagnostics } from '../services/apiClient'
import {
  branches,
  crhDecisionPanels,
  crhFinancialSignals,
  crhStrategicAlerts,
  dashboardKpis,
  dashboardServiceLines,
  executiveIntelligenceSummary,
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
  const [railwayStatus, setRailwayStatus] = useState({
    connected: false,
    health: null,
    runtime: null,
  })
  const [railwayDatabase, setRailwayDatabase] = useState({
    enabled: false,
    connected: false,
    mode: 'unknown',
    message: '',
  })
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
      } catch {
        if (!active) return
        setError(`No fue posible cargar ${CRH_BRAND.modules.dashboard}.`)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    async function loadRailwayStatus() {
      try {
        const [runtimeStatus, databaseStatus] = await Promise.all([
          getRuntimeDiagnostics(),
          getApiDbStatus(),
        ])

        if (!active) return

        setRailwayStatus(runtimeStatus)
        setRailwayDatabase(databaseStatus)
      } catch {
        if (!active) return

        setRailwayStatus({
          connected: false,
          health: null,
          runtime: {
            environment: 'unknown',
            databaseMode: 'unknown',
            timestamp: new Date().toISOString(),
          },
        })
        setRailwayDatabase({
          enabled: false,
          connected: false,
          mode: 'unknown',
          message: 'Modo fallback',
        })
      }
    }

    loadDashboard()
    loadRailwayStatus()

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

  const railwayConnected = railwayStatus.connected
  const railwayEnvironment = railwayStatus.runtime?.environment ?? 'unknown'
  const railwayDatabaseMode = railwayStatus.runtime?.databaseMode ?? railwayDatabase.mode ?? 'unknown'

  return (
    <div className="page-stack page-stack--dashboard">
      <section className="command-hero">
        <article className="command-hero__main">
          <span className="eyebrow">CRH HEALTH INTELLIGENCE</span>
          <h1>{CRH_BRAND.modules.dashboard}</h1>
          <p className="command-hero__description">
            Visión integral del riesgo clínico, financiero y operativo de la organización.
          </p>
          <p className="command-hero__slogan">{CRH_BRAND.slogan}</p>
        </article>

        <aside className="command-hero__insight">
          <span className="eyebrow">CRH Assist</span>
          <h3>Prioridad ejecutiva actual</h3>
          <p>
            La lectura institucional concentra el mayor riesgo en contratos PGP con presión farmacéutica,
            autorizaciones pendientes y pacientes críticos de continuidad.
          </p>
          <div className="command-hero__insight-metrics">
            <div>
              <span>Score consolidado</span>
              <strong>{crhAssistCommandCenter.score}/100</strong>
            </div>
            <div>
              <span>Alertas críticas</span>
              <strong>{crhAssistCommandCenter.criticalAlerts}</strong>
            </div>
          </div>
        </aside>
      </section>

      {loading ? <p className="muted-note">Cargando {CRH_BRAND.modules.dashboard}...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="dashboard-priority-grid">
        <article className="recommendation-card recommendation-card--executive">
          <span className="eyebrow">Qué debe mirar gerencia</span>
          <h3>El riesgo principal hoy está en el margen PGP, la continuidad terapéutica y la velocidad operativa.</h3>
          <p>
            {executiveIntelligenceSummary.projectedOvercost} de sobrecosto proyectado, {executiveIntelligenceSummary.contractsAtRisk} contratos
            en seguimiento y {executiveIntelligenceSummary.pendingAuthorizations} autorizaciones pendientes que afectan continuidad y costo.
          </p>
        </article>

        <article className="organization-card">
          <span className="eyebrow">Organización</span>
          <dl className="organization-card__meta">
            <div>
              <dt>Cliente demo</dt>
              <dd>Medical P-DROZ</dd>
            </div>
            <div>
              <dt>Backend</dt>
              <dd>{railwayConnected ? 'Conectado' : 'Modo fallback'}</dd>
            </div>
            <div>
              <dt>Modo</dt>
              <dd>{railwayConnected ? 'Producción' : 'Fallback'}</dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>Tiempo real</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="institutional-hero crh-hero">
        <article className="institutional-hero__brand crh-hero__brand crh-hero__brand--assist">
          <div className="institutional-hero__copy">
            <span className="eyebrow">{CRH_BRAND.modules.assist}</span>
            <h3>Centro ejecutivo para proteger margen, continuidad y resultado asistencial</h3>
            <p>
              Paciente, diagnóstico, medicamento, historia clínica y contrato PGP se conectan en un solo flujo para
              anticipar riesgo, reducir desvíos y orientar acciones concretas de la gerencia.
            </p>
          </div>
          <div className="kpi-strip kpi-strip--4 kpi-strip--executive">
            <article className="kpi-strip__card kpi-strip__card--danger">
              <span>Pacientes críticos</span>
              <strong>{crhAssistCommandCenter.topPatients.length}</strong>
              <p>Casos con prioridad inmediata.</p>
            </article>
            <article className="kpi-strip__card kpi-strip__card--warning">
              <span>Contratos en riesgo</span>
              <strong>{executiveIntelligenceSummary.contractsAtRisk}</strong>
              <p>Frentes con presión de margen.</p>
            </article>
            <article className="kpi-strip__card kpi-strip__card--primary">
              <span>Prioridad gerencial</span>
              <strong>{executiveIntelligenceSummary.pendingAuthorizations}</strong>
              <p>Autorizaciones que afectan continuidad.</p>
            </article>
            <article className="kpi-strip__card kpi-strip__card--success">
              <span>Margen estimado</span>
              <strong>{dashboardKpis[2]?.value}</strong>
              <p>Lectura gerencial consolidada.</p>
            </article>
          </div>
        </article>

        <article className="institutional-hero__services institutional-hero__services--premium">
          <div className="panel-heading panel-heading--compact">
            <span className="eyebrow">Lectura ejecutiva</span>
            <p>Qué está pasando en la IPS, dónde está el riesgo y qué debe priorizar gerencia.</p>
          </div>
          <div className="service-pills service-pills--dashboard">
            {dashboardServiceLines.map((item) => (
              <span key={item} className="service-pill service-pill--filled">{item}</span>
            ))}
          </div>
          <div className="coverage-card coverage-card--assist">
            <span className="eyebrow">Score CRH Assist</span>
            <strong>{crhAssistCommandCenter.score}/100</strong>
            <p>{crhAssistCommandCenter.criticalAlerts} alertas críticas activas conectan paciente, contrato, farmacia e historia clínica.</p>
          </div>
          <div className="assist-panel assist-panel--compact">
            {crhAssistCommandCenter.topPatients.slice(0, 2).map((patient) => (
              <article key={patient.patientId} className={`assist-card assist-card--${levelTone(patient.level)}`}>
                <div className="assist-card__head">
                  <Badge tone={levelTone(patient.level)}>{patient.name}</Badge>
                </div>
                <p>Riesgo detectado: {patient.topAlert}</p>
                <small>Impacto financiero estimado según score {patient.score}/100.</small>
              </article>
            ))}
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
        title={`Pulso del ${CRH_BRAND.modules.rulesEngine}`}
        subtitle="Resumen ejecutivo del motor interpretable, ponderado y configurable"
      >
        <div className="insight-grid">
          <article className="insight-card">
            <h3>Riesgo detectado</h3>
            <p>El sobrecosto proyectado se concentra en crónicos de alto impacto, con continuidad terapéutica y adherencia inestables.</p>
          </article>
          <article className="insight-card">
            <h3>Acción recomendada</h3>
            <p>Priorizar cierre de autorizaciones, dispensación y control clínico antes del siguiente ciclo de medicamentos críticos.</p>
          </article>
          <article className="insight-card">
            <h3>Impacto financiero estimado</h3>
            <p>{executiveIntelligenceSummary.projectedOvercost} de sobrecosto proyectado si la tendencia actual no cambia.</p>
          </article>
        </div>

        <div className="executive-grid">
          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Score {CRH_BRAND.modules.assist}</h3>
              <Badge tone={levelTone(crhAssistCommandCenter.score > 80 ? 'critico' : crhAssistCommandCenter.score > 60 ? 'alto' : crhAssistCommandCenter.score > 30 ? 'medio' : 'bajo')}>
                {crhAssistCommandCenter.score}/100
              </Badge>
            </div>
            <strong className="executive-card__value">{crhAssistCommandCenter.score}</strong>
            <p>Promedio de riesgo consolidado sobre los pacientes priorizados en esta versión demo.</p>
          </article>

          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Catálogo activo</h3>
              <Badge tone="primary">V2 configurable</Badge>
            </div>
            <strong className="executive-card__value">{crhAssistRulesSummary.enabled}</strong>
            <p>{crhAssistRulesSummary.categories.length} categorías activas con score ponderado y trazabilidad interpretable.</p>
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

          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Infraestructura</h3>
              <Badge tone={railwayConnected ? 'success' : 'warning'}>
                {railwayConnected ? 'Conectado' : 'Fallback'}
              </Badge>
            </div>
            <strong className="executive-card__value">Backend Railway</strong>
            <p>
              Entorno {railwayEnvironment === 'production' ? 'producción' : railwayEnvironment} · Base de datos {railwayConnected ? railwayDatabaseMode : 'modo fallback'}
            </p>
          </article>
        </div>
      </SectionCard>

      <SectionCard
        title={CRH_BRAND.modules.executive}
        subtitle="Consolidado ejecutivo de riesgo clínico, financiero y operativo sobre los módulos inteligentes"
      >
        <div className="executive-grid">
          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Riesgo clínico</h3>
              <Badge tone="danger">{executiveIntelligenceSummary.clinicalRiskPatients} pacientes</Badge>
            </div>
            <strong className="executive-card__value">{executiveIntelligenceSummary.hospitalizationRiskCases}</strong>
            <p>
              Riesgo de hospitalización: {executiveIntelligenceSummary.hospitalizationRiskCases} casos · pendientes clínicos: {executiveIntelligenceSummary.pendingClinicalActions}
            </p>
          </article>

          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Riesgo financiero</h3>
              <Badge tone="warning">{executiveIntelligenceSummary.contractsAtRisk} contratos</Badge>
            </div>
            <strong className="executive-card__value">{executiveIntelligenceSummary.projectedOvercost}</strong>
            <p>
              Sobrecosto proyectado · {executiveIntelligenceSummary.highCostMedications} medicamentos de alto costo · {executiveIntelligenceSummary.financialRiskPatients} pacientes con presión económica
            </p>
          </article>

          <article className="executive-card">
            <div className="executive-card__head">
              <h3>Riesgo operativo</h3>
              <Badge tone="warning">{executiveIntelligenceSummary.pendingAuthorizations} autorizaciones</Badge>
            </div>
            <strong className="executive-card__value">{executiveIntelligenceSummary.adherenceGaps}</strong>
            <p>
              Brechas de adherencia activas · reclamos pendientes: {executiveIntelligenceSummary.pendingClaims}
            </p>
          </article>
        </div>

        <div className="dashboard-columns">
          <article className="panel">
            <div className="panel__header">
              <div>
                <h2>Alertas ejecutivas</h2>
                <p>Alertas accionables para proteger margen, continuidad y rentabilidad.</p>
              </div>
            </div>
            <div className="assist-panel">
              {executiveIntelligenceSummary.smartExecutiveAlerts.map((alert) => (
                <article key={alert} className="assist-card assist-card--warning">
                  <div className="assist-card__head">
                    <Badge tone="warning">Alerta ejecutiva</Badge>
                  </div>
                  <p>{alert}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel__header">
              <div>
                <h2>Acciones recomendadas</h2>
                <p>Intervenciones de gerencia para reducir pérdida contractual.</p>
              </div>
            </div>
            <div className="assist-panel">
              {executiveIntelligenceSummary.recommendedExecutiveActions.map((action) => (
                <article key={action} className="assist-card assist-card--primary">
                  <div className="assist-card__head">
                    <Badge tone="primary">Acción recomendada</Badge>
                  </div>
                  <p>{action}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </SectionCard>

      <section className="dashboard-columns">
        <SectionCard title="Alertas clínico-financieras" subtitle="Eventos donde CRH prioriza intervención clínica, contractual o farmacéutica">
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

        <SectionCard title="Pacientes críticos" subtitle="Casos que hoy empujan el riesgo institucional y requieren decisión inmediata">
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
        <SectionCard title="Contratos PGP en seguimiento" subtitle="Riesgo contractual, margen estimado y desviación esperada al cierre">
          <div className="crh-contract-list">
            {crhCommandCenterContracts.map((contract) => (
              <article key={contract.id} className="crh-contract-row">
                <div>
                  <strong>{contract.nombre}</strong>
                  <p>{contract.codigo} · {contract.eps}</p>
                </div>
                <div>
                  <strong>{contract.assistScore}/100</strong>
                  <p>{contract.criticalAlerts} alertas críticas · margen {contract.margenEstimado}</p>
                </div>
                <Badge tone={levelTone(contract.assistLevel)}>{contract.assistLevel}</Badge>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Agenda priorizada del día" subtitle="Atenciones visibles con lectura rápida de estado operativo">
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
        <SectionCard title="Costo ejecutado y margen estimado" subtitle="Contexto agregado del riesgo económico, consumo farmacéutico y presión contractual">
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

        <SectionCard title="Acciones recomendadas del día" subtitle="Intervenciones gerenciales para proteger margen, continuidad y resultado asistencial">
          <div className="assist-panel">
            <article className="assist-card assist-card--danger">
              <div className="assist-card__head">
                <Badge tone="danger">Prioridad alta</Badge>
              </div>
              <p>Escalar los casos con score superior a 80 a comité clínico-financiero.</p>
            </article>
            <article className="assist-card assist-card--warning">
              <div className="assist-card__head">
                <Badge tone="warning">Seguimiento</Badge>
              </div>
              <p>Cerrar brechas de control en pacientes crónicos con señales de evento evitable.</p>
            </article>
            <article className="assist-card assist-card--primary">
              <div className="assist-card__head">
                <Badge tone="primary">Optimización</Badge>
              </div>
              <p>Correlacionar terapias de alto costo con respuesta clínica para proteger margen PGP.</p>
            </article>
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Estado de la red" subtitle="La operación multisede se observa como un tablero de capacidad y presión asistencial">
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

      <SectionCard title="Principios de construcción segura" subtitle="Base funcional preparada para crecer sin tocar producción">
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
