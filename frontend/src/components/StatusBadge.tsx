import type { ApplicationStatus } from '../types/application'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const className = status.toLowerCase().replace(' ', '-')
  return <span className={`status-badge status-badge--${className}`}>{status}</span>
}
