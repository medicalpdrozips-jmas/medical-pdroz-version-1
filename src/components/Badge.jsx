export function Badge({ children, tone = 'default' }) {
  return <span className={`badge status-badge badge--${tone}`}>{children}</span>
}
