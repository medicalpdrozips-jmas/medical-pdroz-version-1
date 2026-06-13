import { useEffect, useState } from 'react'
import { navigationItems } from '../app/routes.jsx'
import { CRH_BRAND } from '../config/brand'
import { getRuntimeDiagnostics } from '../services/apiClient'
import { BrandLogo } from './BrandLogo'

const iconPaths = {
  grid: 'M5 5h6v6H5zm8 0h6v6h-6zM5 13h6v6H5zm8 0h6v6h-6z',
  spark: 'M12 2l1.8 4.7L19 8.5l-4 3.2 1.4 5-4.4-2.8-4.4 2.8 1.4-5-4-3.2 5.2-1.8z',
  patient: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2-8 4.5V20h16v-1.5C20 16 16.4 14 12 14z',
  calendar: 'M7 2v3M17 2v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  document: 'M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm5 1v5h5',
  contract: 'M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 4h6m-6 4h6m-6 4h4',
  capsule: 'M8.5 8.5l7 7m-9.5 2.5a4.95 4.95 0 0 1 0-7l3-3a4.95 4.95 0 0 1 7 7l-3 3a4.95 4.95 0 0 1-7 0z',
  lab: 'M10 3v5l-5 8a3 3 0 0 0 2.5 4.5h9A3 3 0 0 0 19 16l-5-8V3M8 13h8',
  building: 'M5 20V4h14v16M9 8h2m2 0h2m-6 4h2m2 0h2',
  stethoscope: 'M8 4v5a4 4 0 0 0 8 0V4m-4 9v3a4 4 0 1 0 4 4h-4',
  chart: 'M5 19V9m7 10V5m7 14v-7',
  shield: 'M12 3l7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6z',
  settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8 3.5l-2 1 .2 2.2-2 1.2-1.6-1.5-2 .8-.6 2.1h-2.3l-.6-2.1-2-.8-1.6 1.5-2-1.2.2-2.2-2-1 1-2 2.2-.2 1.2-2-1.5-1.6 1.2-2 2.2.2 1-2h2.3l1 2 2.2-.2 1.2 2-1.5 1.6 1.2 2 2.2.2z',
}

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  )
}

export function Shell({ currentPath, currentPage, onNavigate, children }) {
  const [runtimeStatus, setRuntimeStatus] = useState({
    connected: false,
    runtime: null,
  })

  useEffect(() => {
    let active = true

    async function loadRuntimeStatus() {
      try {
        const diagnostics = await getRuntimeDiagnostics()

        if (!active) return

        setRuntimeStatus(diagnostics)
      } catch {
        if (!active) return

        setRuntimeStatus({
          connected: false,
          runtime: null,
        })
      }
    }

    loadRuntimeStatus()

    return () => {
      active = false
    }
  }, [])

  const grouped = navigationItems.reduce((acc, item) => {
    acc[item.section] ??= []
    acc[item.section].push(item)
    return acc
  }, {})

  const railwayEnvironment = runtimeStatus.runtime?.environment ?? 'fallback'
  const productionLabel = runtimeStatus.connected ? 'Producción' : 'Fallback'
  const isDashboard = currentPath === '/dashboard'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <BrandLogo className="brand-card__logo" compact showTagline />
          <div className="brand-card__organization">
            <div className="brand-card__organization-head">
              <span className="brand-card__organization-badge">Organización</span>
              <strong>{CRH_BRAND.demoClient}</strong>
            </div>
            <dl className="brand-card__organization-meta">
              <div>
                <dt>Backend</dt>
                <dd>{runtimeStatus.connected ? 'Conectado' : 'Modo fallback'}</dd>
              </div>
              <div>
                <dt>Modo</dt>
                <dd>{productionLabel}</dd>
              </div>
              <div>
                <dt>Última actualización</dt>
                <dd>Tiempo real</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="sidebar__support">
          <span className="eyebrow">CRH Assist</span>
          <p>Centro ejecutivo para proteger margen, continuidad y resultado asistencial.</p>
          <small>{CRH_BRAND.demoClient}</small>
        </div>

        <nav className="sidebar__nav" aria-label="Principal">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="sidebar__group">
              <span className="sidebar__section">{section}</span>
              {items.map((item) => {
                const active = currentPath === item.path
                return (
                  <button
                    key={item.path}
                    type="button"
                    className={`nav-link ${active ? 'nav-link--active' : ''}`}
                    onClick={() => onNavigate(item.path)}
                  >
                    <NavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="content-area">
        <header className={`topbar ${isDashboard ? 'topbar--dashboard' : ''}`}>
          <div className="topbar__identity">
            {isDashboard ? (
              <div className="topbar__summary">
                <span className="eyebrow">Visión ejecutiva</span>
                <h2>Seguimiento institucional en tiempo real</h2>
              </div>
            ) : (
              <>
                <BrandLogo compact className="topbar__logo" />
                <div>
                  <span className="eyebrow">{CRH_BRAND.name}</span>
                  <h2>{currentPage.label}</h2>
                </div>
              </>
            )}
          </div>
          <div className="topbar__status">
            <span className="status-pill status-pill--primary">Demo ejecutiva</span>
            <span className="status-pill status-pill--soft">
              {runtimeStatus.connected ? 'Backend conectado' : 'Modo fallback'}
            </span>
            <span className="status-pill status-pill--soft">
              Entorno {railwayEnvironment === 'production' ? 'producción' : railwayEnvironment}
            </span>
          </div>
        </header>

        <main className="main-content">{children}</main>

        <nav className="mobile-nav" aria-label="Móvil">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`mobile-nav__item ${currentPath === item.path ? 'mobile-nav__item--active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
