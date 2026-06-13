import { CrhShieldLogo } from '../components/CrhShieldLogo'
import { CRH_BRAND } from '../config/brand'

const valueCards = [
  {
    title: 'Paciente 360',
    description: 'Visión integral del paciente, consumo, riesgo y continuidad.',
  },
  {
    title: 'Contrato PGP 360',
    description: 'Control financiero y asistencial de contratos de riesgo.',
  },
  {
    title: 'Farmacia Inteligente',
    description: 'Identificación temprana de sobrecostos y desviaciones.',
  },
  {
    title: 'CRH Assist',
    description: 'Motor de recomendaciones para la toma de decisiones.',
  },
]

const executiveInsights = [
  'Un paciente de alto costo puede consumir el margen completo de un contrato PGP.',
  'La información sin análisis no genera decisiones.',
  'CRH Assist identifica riesgos antes de que impacten el resultado.',
  'La sostenibilidad institucional depende de decisiones oportunas.',
]

const stackTags = ['HIS', 'ERP', 'BI', 'AI']

export function LoginPage() {
  return (
    <div className="login-screen">
      <section className="login-experience">
        <article className="login-entry">
          <div className="login-entry__brand">
            <CrhShieldLogo className="login-entry__logo" title={CRH_BRAND.name} />
            <div className="login-entry__brand-copy">
              <span className="eyebrow">Acceso institucional</span>
              <h1>{CRH_BRAND.name}</h1>
              <p>{CRH_BRAND.slogan}</p>
            </div>
          </div>

          <div className="login-entry__form-block">
            <div className="login-entry__intro">
              <strong>{CRH_BRAND.category}</strong>
              <p>{CRH_BRAND.demoClient}. Plataforma lista para demostración ejecutiva en modo seguro.</p>
            </div>

            <div className="login-form login-form--executive">
              <label>
                <span>Usuario institucional</span>
                <input className="field" placeholder="usuario@ipsdemo.com" />
              </label>
              <label>
                <span>Contraseña</span>
                <input className="field" type="password" placeholder="**********" />
              </label>
              <button className="primary-button login-entry__submit" type="button">Ingresar</button>
              <button className="login-entry__link" type="button">¿Olvidó su contraseña?</button>
            </div>
          </div>

          <footer className="login-entry__footer">
            <span>CRH Health Intelligence V1.0</span>
            <small>© 2026 CRH Soluciones Integrales SAS</small>
          </footer>
        </article>

        <aside className="login-marketing">
          <div className="login-marketing__bg" aria-hidden="true">
            <span className="login-marketing__orb login-marketing__orb--primary" />
            <span className="login-marketing__orb login-marketing__orb--secondary" />
            <span className="login-marketing__orb login-marketing__orb--success" />
            <span className="login-marketing__grid" />
          </div>

          <div className="login-marketing__content">
            <div className="login-marketing__hero">
              <span className="eyebrow">HIS + ERP + BI + AI</span>
              <h2>Centro de Inteligencia Empresarial para IPS</h2>
              <p>
                Transformamos información clínica, financiera y operativa en decisiones que protegen la rentabilidad y
                sostenibilidad institucional.
              </p>
              <div className="login-marketing__tags">
                {stackTags.map((tag) => (
                  <span key={tag} className="login-marketing__tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="login-value-grid">
              {valueCards.map((card) => (
                <article key={card.title} className="login-value-card">
                  <strong>{card.title}</strong>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>

            <div className="login-insight-stack">
              {executiveInsights.map((item) => (
                <article key={item} className="login-insight-card">
                  <span className="login-insight-card__dot" />
                  <p>{item}</p>
                </article>
              ))}
            </div>

            <div className="login-cta">
              <p>¿Desea conocer cómo CRH Health Intelligence puede proteger la rentabilidad de su IPS?</p>
              <button className="secondary-button" type="button">Solicitar información</button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
