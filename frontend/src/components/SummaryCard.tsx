interface SummaryCardProps {
  label: string
  value: number
  tone: 'blue' | 'teal' | 'amber' | 'green'
}

export function SummaryCard({ label, value, tone }: SummaryCardProps) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <div className="summary-icon" aria-hidden="true">
        <span />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  )
}
