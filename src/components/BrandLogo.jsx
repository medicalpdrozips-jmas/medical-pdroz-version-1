export function BrandLogo({ className = '', compact = false, monochrome = false }) {
  const modeClass = compact ? 'brand-logo--compact' : ''
  const toneClass = monochrome ? 'brand-logo--mono' : ''

  return (
    <img
      className={`brand-logo ${modeClass} ${toneClass} ${className}`.trim()}
      src="/crh-mark.svg"
      alt="CRH Health Intelligence"
    />
  )
}
