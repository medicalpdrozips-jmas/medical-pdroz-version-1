import { BrandLogo } from '../components/BrandLogo'

const accessCards = [
  'Acceso seguro por roles y permisos',
  'Historia clínica electrónica preparada',
  'Operación centralizada por sedes',
]

const serviceItems = [
  'Medicina General',
  'Especialidades',
  'Odontología',
  'Laboratorio Clínico',
  'Enfermería',
  'Promoción y Prevención',
]

export function LoginPage() {
  return (
    <div className="login-screen">
      <section className="login-screen__panel">
        <div className="login-screen__brand">
          <BrandLogo className="login-screen__logo" />
          <p>CRH Health Intelligence para operaciones clínicas, administrativas y gerenciales.</p>
        </div>

        <div className="login-screen__grid">
          <div className="login-card">
            <span className="eyebrow">Acceso futuro</span>
            <h1>Ingreso seguro a CRH Health Intelligence</h1>
            <p>
              IPS Demo: Medical P-DROZ. Interfaz lista para autenticación posterior sin exponer datos reales.
            </p>
            <div className="login-form">
              <label>
                <span>Usuario institucional</span>
                <input className="field" placeholder="usuario@medicalpdrozips.com" />
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
              <strong>Plataforma Inteligente HIS + ERP + BI + AI para IPS</strong>
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
