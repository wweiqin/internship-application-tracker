import { useMemo, useState } from 'react'
import { ApplicationsTable } from './components/ApplicationsTable'
import { Sidebar } from './components/Sidebar'
import { SummaryCard } from './components/SummaryCard'
import { applications } from './data/applications'
import type { ApplicationStatus } from './types/application'
import './App.css'

const statusOptions: Array<ApplicationStatus | 'All statuses'> = [
  'All statuses',
  'Interested',
  'Applied',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
]

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All statuses'>(
    'All statuses',
  )

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesSearch =
        application.company.toLowerCase().includes(query) ||
        application.role.toLowerCase().includes(query)
      const matchesStatus =
        statusFilter === 'All statuses' || application.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const activeStatuses: ApplicationStatus[] = [
    'Interested',
    'Applied',
    'Online Assessment',
    'Interview',
  ]
  const activeCount = applications.filter((application) =>
    activeStatuses.includes(application.status),
  ).length
  const interviewCount = applications.filter(
    (application) => application.status === 'Interview',
  ).length
  const offerCount = applications.filter(
    (application) => application.status === 'Offer',
  ).length

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Application dashboard</h1>
            <p className="header-copy">
              Track opportunities, deadlines, and progress in one place.
            </p>
          </div>
          <div className="profile" aria-label="Signed in profile">
            <span className="profile-avatar" aria-hidden="true">WQ</span>
            <span>
              <strong>Wei Qin</strong>
              <small>Internship search</small>
            </span>
          </div>
        </header>

        <section className="summary-grid" aria-label="Application summary">
          <SummaryCard label="Total applications" value={applications.length} tone="blue" />
          <SummaryCard label="Active applications" value={activeCount} tone="teal" />
          <SummaryCard label="Interviews" value={interviewCount} tone="amber" />
          <SummaryCard label="Offers" value={offerCount} tone="green" />
        </section>

        <section className="applications-panel" id="applications">
          <div className="panel-heading">
            <div>
              <h2>Applications</h2>
              <p>Review and manage your internship pipeline.</p>
            </div>
            <span className="record-count">{filteredApplications.length} records</span>
          </div>

          <div className="toolbar">
            <label className="search-field">
              <span className="sr-only">Search applications</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by company or role"
              />
            </label>

            <label className="filter-field">
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ApplicationStatus | 'All statuses')
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>

          <ApplicationsTable applications={filteredApplications} />
        </section>
      </main>
    </div>
  )
}

export default App
