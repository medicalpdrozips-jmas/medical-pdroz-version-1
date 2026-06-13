import { useEffect, useState } from 'react'
import { getRuleCatalog, updateRuleStatus } from '../api/crhApiClient'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'

function toneBySeverity(severity) {
  if (severity === 'critica' || severity === 'alta') return 'danger'
  if (severity === 'media') return 'warning'
  return 'success'
}

export function CrhAssistRulesPage() {
  const [rulesCatalog, setRulesCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingRuleId, setSavingRuleId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPage() {
      try {
        setLoading(true)
        setError('')
        const rulesData = await getRuleCatalog()

        if (!active) return
        setRulesCatalog(rulesData)
      } catch {
        if (!active) return
        setError('No fue posible cargar el catalogo de reglas.')
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

  async function handleToggleRule(rule) {
    try {
      setSavingRuleId(rule.id)
      setError('')
      const updatedRule = await updateRuleStatus(rule.id, !rule.enabled)

      setRulesCatalog((currentRules) => currentRules.map((item) => (
        item.id === rule.id ? { ...item, ...updatedRule } : item
      )))
    } catch {
      setError('No fue posible actualizar el estado de la regla.')
    } finally {
      setSavingRuleId('')
    }
  }

  const crhAssistRulesSummary = {
    total: rulesCatalog.length,
    enabled: rulesCatalog.filter((rule) => rule.enabled).length,
    categories: Array.from(new Set(rulesCatalog.map((rule) => rule.category))),
    totalWeight: rulesCatalog
      .filter((rule) => rule.enabled)
      .reduce((total, rule) => total + Math.max(0, rule.weight), 0),
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="CRH Assist Rules"
        title="Catalogo de reglas interpretable"
        description="Motor V2 con reglas configurables, pesos ponderados y estructura preparada para futura persistencia en PostgreSQL y administracion desde API."
        action={<button className="primary-button">Exportar catalogo</button>}
      />

      {loading ? <p className="muted-note">Cargando catalogo de reglas...</p> : null}
      {error ? <p className="muted-note">{error}</p> : null}

      <section className="stats-grid stats-grid--compact">
        <article className="metric-card">
          <span>Reglas catalogadas</span>
          <strong>{crhAssistRulesSummary.total}</strong>
        </article>
        <article className="metric-card">
          <span>Reglas activas</span>
          <strong>{crhAssistRulesSummary.enabled}</strong>
        </article>
        <article className="metric-card">
          <span>Categorias</span>
          <strong>{crhAssistRulesSummary.categories.length}</strong>
        </article>
        <article className="metric-card">
          <span>Peso acumulado</span>
          <strong>{crhAssistRulesSummary.totalWeight}</strong>
        </article>
      </section>

      <SectionCard
        title="Motor configurable V2"
        subtitle="Cada regla aporta al score segun su peso y puede ser administrada luego desde backend"
      >
        <p className="muted-note">Frontend ↔ Backend Bridge activo con fallback automatico al mock.</p>
        <div className="service-pills service-pills--dashboard">
          {crhAssistRulesSummary.categories.map((category) => (
            <span key={category} className="service-pill service-pill--filled">{category}</span>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Catalogo de reglas"
        subtitle="Vista editable conceptual para el futuro modulo de administracion CRH Assist"
      >
        <div className="rules-catalog">
          {rulesCatalog.map((rule) => (
            <article key={rule.id} className="rule-card">
              <div className="rule-card__head">
                <div>
                  <strong>{rule.name}</strong>
                  <p>{rule.description}</p>
                </div>
                <Badge tone={rule.enabled ? 'success' : 'warning'}>
                  {rule.enabled ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>

              <div className="rule-card__meta">
                <Badge tone="primary">{rule.category}</Badge>
                <Badge tone={toneBySeverity(rule.severity)}>{rule.severity}</Badge>
                <Badge tone="primary">Peso {rule.weight}</Badge>
              </div>

              <dl className="detail-grid detail-grid--triple">
                <div>
                  <dt>Modulo relacionado</dt>
                  <dd>{rule.relatedModule}</dd>
                </div>
                <div>
                  <dt>Aplica sobre</dt>
                  <dd>{(rule.appliesTo ?? []).join(', ')}</dd>
                </div>
                <div>
                  <dt>Condicion</dt>
                  <dd>{rule.condition?.metric} {rule.condition?.operator} {String(rule.condition?.threshold)}</dd>
                </div>
              </dl>

              <article className="recommendation-card recommendation-card--soft">
                <span className="eyebrow">Accion recomendada</span>
                <p>{rule.recommendedAction}</p>
              </article>

              <div className="toolbar-actions">
                <small>
                  Esta capa queda lista para API REST/Node/Express y futura persistencia.
                </small>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleToggleRule(rule)}
                  disabled={savingRuleId === rule.id}
                >
                  {savingRuleId === rule.id ? 'Guardando...' : rule.enabled ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
