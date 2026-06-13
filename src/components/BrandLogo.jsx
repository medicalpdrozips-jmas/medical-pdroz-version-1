import { CRH_BRAND } from '../config/brand'
import { CrhShieldLogo } from './CrhShieldLogo'

export function BrandLogo({ className = '', compact = false, monochrome = false, showTagline = false }) {
  const modeClass = compact ? 'brand-logo--compact' : ''
  const toneClass = monochrome ? 'brand-logo--mono' : ''
  const taglineClass = showTagline ? 'brand-logo--with-tagline' : ''

  return (
    <div className={`brand-logo ${modeClass} ${toneClass} ${taglineClass} ${className}`.trim()}>
      <CrhShieldLogo className="brand-logo__mark" title={CRH_BRAND.name} />
      <div className="brand-logo__copy">
        <strong>{CRH_BRAND.name}</strong>
        {showTagline ? (
          <small>{CRH_BRAND.slogan}</small>
        ) : (
          <span>{CRH_BRAND.category}</span>
        )}
      </div>
    </div>
  )
}
