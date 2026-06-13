import { BrandLogo } from '../components/BrandLogo'
import { CRH_BRAND } from '../config/brand'

const accessCards = [
  'Acceso seguro por roles y permisos',
  'Historia clínica electrónica preparada',
  'Operación centralizada por sedes',
]

const serviceItems = ['HIS', 'ERP', 'BI', 'AI']

export function LoginPage() {
  return (
    <div className="login-screen">
      <section className="login-screen__panel">
        <div className="login-screen__brand">
          <BrandLogo className="login-screen__logo" showTagline />
          <div className="brand-hero-note">
            <p>{CRH_BRAND.slogan}</p>
            <p>{CRH_BRAND.extendedValue}</p>
          </div>
        </div>

        <div className="login-screen__grid">
          <div className="login-card">
            <span className="eyebrow">{CRH_BRAND.category}</span>
            <h1>{CRH_BRAND.name}</h1>
            <p>{CRH_BRAND.demoClient}. Interfaz lista para autenticación posterior sin exponer datos reales.</p>
            <div className="login-form">
              <label>
                <span>Usuario institucional</span>
                <input className="field" placeholder="usuario@ipsdemo.com" />
              </label>
              <label>
                <span>Contraseña</span>
                <input className="field" type="password" placeholder="**********" />
              </label>
              <div className="login-form__actions">
                <button className="primary-button" type="button">Ingresar</button>
                <button className="secondary-button" type="button">Soporte de acceso</button>
              </div>
            </div>
          </div>

          <aside className="identity-card">
            <div className="identity-card__hero">
              <BrandLogo compact className="identity-card__hero-logo" />
              <strong>HIS + ERP + BI + AI</strong>
            </div>
            <div className="identity-card__list">
              {accessCards.map((item) => (
                <div key={item} className="identity-chip">
                  <span className="identity-chip__dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="service-pills">
              {serviceItems.map((item) => (
                <span key={item} className="service-pill">{item}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
