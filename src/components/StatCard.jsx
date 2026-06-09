export function StatCard({ label, value, delta, tone = 'primary' }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      <span className="stat-card__delta">{delta}</span>
    </article>
  )
}
