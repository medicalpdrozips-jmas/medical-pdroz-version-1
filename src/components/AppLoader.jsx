import { BrandLogo } from './BrandLogo'

export function AppLoader() {
  return (
    <div className="app-loader" role="status" aria-live="polite">
      <div className="app-loader__card">
        <BrandLogo className="app-loader__logo" />
        <p className="app-loader__title">Preparando entorno clínico</p>
        <p className="app-loader__subtitle">Tu salud, nuestro compromiso</p>
        <div className="app-loader__pulse" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
