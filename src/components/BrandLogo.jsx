export function BrandLogo({ className = '', compact = false, monochrome = false, showTagline = false }) {
  const modeClass = compact ? 'brand-logo--compact' : ''
  const toneClass = monochrome ? 'brand-logo--mono' : ''
  const taglineClass = showTagline ? 'brand-logo--with-tagline' : ''

  return (
    <div className={`brand-logo ${modeClass} ${toneClass} ${taglineClass} ${className}`.trim()}>
      <img
        className="brand-logo__mark"
        src="/crh-mark.svg"
        alt="CRH Health Intelligence"
      />
      <div className="brand-logo__copy">
        <strong>CRH Health</strong>
        <span>Intelligence</span>
        {showTagline ? (
          <small>Plataforma Inteligente para IPS</small>
        ) : null}
      </div>
    </div>
  )
}
