import type { InternshipApplication } from '../types/application'
import { StatusBadge } from './StatusBadge'

interface ApplicationsTableProps {
  applications: InternshipApplication[]
  hasStoredApplications: boolean
  onEdit: (application: InternshipApplication) => void
  onDelete: (application: InternshipApplication) => void
  actionsDisabled: boolean
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

export function ApplicationsTable({ applications, hasStoredApplications, onEdit, onDelete, actionsDisabled }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">{hasStoredApplications ? '⌕' : '+'}</div>
        <strong>{hasStoredApplications ? 'No applications found' : 'Your application list is empty'}</strong>
        <p>{hasStoredApplications ? 'Try changing your search or status filter.' : 'Add an application to start tracking your internship search.'}</p>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td><strong className="company-name">{application.company}</strong></td>
              <td>{application.role}</td>
              <td>
                <StatusBadge status={application.status} />
              </td>
              <td>{formatDate(application.applicationDate)}</td>
              <td>{formatDate(application.deadline)}</td>
              <td>{application.location}</td>
              <td>
                <div className="row-actions">
                  {application.jobLink && (
                    <a className="job-link" href={application.jobLink} target="_blank" rel="noreferrer" aria-label={`Open ${application.company} job listing`}>
                      View
                    </a>
                  )}
                  <button type="button" disabled={actionsDisabled} onClick={() => onEdit(application)}>Edit</button>
                  <button className="delete-action" type="button" disabled={actionsDisabled} onClick={() => onDelete(application)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
