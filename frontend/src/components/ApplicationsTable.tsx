import type { InternshipApplication } from '../types/application'

interface ApplicationsTableProps {
  applications: InternshipApplication[]
}

const dateFormatter = new Intl.DateTimeFormat('en-SG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDate(date: string | null) {
  if (!date) return 'Not applied'
  return dateFormatter.format(new Date(`${date}T00:00:00`))
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <strong>No applications found</strong>
        <p>Try changing your search or status filter.</p>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Application date</th>
            <th>Deadline</th>
            <th>Location</th>
            <th><span className="sr-only">Job link</span></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td><strong className="company-name">{application.company}</strong></td>
              <td>{application.role}</td>
              <td>
                <span className={`status-badge status-badge--${application.status.toLowerCase().replace(' ', '-')}`}>
                  {application.status}
                </span>
              </td>
              <td>{formatDate(application.applicationDate)}</td>
              <td>{formatDate(application.deadline)}</td>
              <td>{application.location}</td>
              <td>
                <a
                  className="job-link"
                  href={application.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${application.company} job listing`}
                >
                  View
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 17 17 7m-7 0h7v7" />
                  </svg>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
