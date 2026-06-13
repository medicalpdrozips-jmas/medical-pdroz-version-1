import { useEffect, useState } from 'react'
import { getApiUrl } from '../config/api'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { SectionCard } from '../components/SectionCard'
import { getSystemStatus } from '../services/apiClient'

export function SystemStatusPage() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadStatus() {
      try {
        setLoading(true)
        setError('')
        const nextStatus = await getSystemStatus()

        if (!active) return
        setStatus(nextStatus)
      } catch (loadError) {
        if (!active) return
        setError(loadError.message ?? 'No fue posible consultar Railway API.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadStatus()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Diagnostico del sistema"
        title="Estado del sistema"
        description="Lectura rapida del backend desplegado en Railway sin afectar el flujo funcional actual."
        action={<Badge tone={status?.connected ? 'success' : 'warning'}>{status?.connected ? 'conectado' : 'desconectado'}</Badge>}
      />

      <SectionCard title="Railway API" subtitle={getApiUrl()}>
        {loading ? <p className="muted-note">Consultando estado de Railway API...</p> : null}
        {error ? <p className="muted-note">{error}</p> : null}

        {status ? (
          <div className="stats-grid stats-grid--compact">
            <article className="metric-card">
              <span>Estado API</span>
              <strong>{status.health.status}</strong>
            </article>
            <article className="metric-card">
              <span>Entorno</span>
              <strong>{status.runtime.environment === 'production' ? 'produccion' : status.runtime.environment}</strong>
            </article>
            <article className="metric-card">
              <span>Modo de base de datos</span>
              <strong>{status.runtime.databaseMode}</strong>
            </article>
            <article className="metric-card">
              <span>Conectividad Railway</span>
              <strong>{status.connected ? 'conectado' : 'desconectado'}</strong>
            </article>
            <article className="metric-card">
              <span>Timestamp</span>
              <strong>{status.runtime.timestamp}</strong>
            </article>
          </div>
        ) : null}
      </SectionCard>

      {status ? (
        <SectionCard title="Detalles de ejecucion" subtitle="Estado publico expuesto por la API">
          <div className="detail-grid detail-grid--triple">
            <div><dt>Servicio</dt><dd>{status.runtime.service}</dd></div>
            <div><dt>Modo CORS</dt><dd>{status.runtime.corsMode}</dd></div>
            <div><dt>Version</dt><dd>{status.runtime.version}</dd></div>
            <div><dt>Base de datos habilitada</dt><dd>{String(status.database.enabled)}</dd></div>
            <div><dt>Base de datos conectada</dt><dd>{String(status.database.connected)}</dd></div>
            <div><dt>Mensaje de base de datos</dt><dd>{status.database.message}</dd></div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  )
}
