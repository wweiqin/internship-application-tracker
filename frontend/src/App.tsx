import { useMemo, useState } from 'react'
import { ApplicationsTable } from './components/ApplicationsTable'
import { AccountAccess } from './components/AccountAccess'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationModal } from './components/ApplicationModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Sidebar } from './components/Sidebar'
import { SummaryCard } from './components/SummaryCard'
import { MatchAnalyser } from './features/matcher/MatchAnalyser'
import { useApplications } from './hooks/useApplications'
import type { ApplicationFormValues, ApplicationStatus, InternshipApplication } from './types/application'
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
  const {
    applications,
    user,
    loadState,
    error,
    isSaving,
    deletingId,
    retry,
    clearError,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useApplications()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All statuses'>(
    'All statuses',
  )
  const [isAdding, setIsAdding] = useState(false)
  const [editingApplication, setEditingApplication] = useState<InternshipApplication | null>(null)
  const [deletingApplication, setDeletingApplication] = useState<InternshipApplication | null>(null)

  async function handleFormSubmit(values: ApplicationFormValues) {
    if (editingApplication) {
      const saved = await updateApplication(editingApplication.id, values)
      if (saved) setEditingApplication(null)
    } else {
      const saved = await addApplication(values)
      if (saved) setIsAdding(false)
    }
  }

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
  }, [applications, searchTerm, statusFilter])

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

  if (loadState === 'authenticating' || loadState === 'loading') {
    return (
      <main className="connection-state" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <h1>{loadState === 'authenticating' ? 'Securing your workspace' : 'Loading applications'}</h1>
        <p>{loadState === 'authenticating' ? 'Creating a private anonymous session…' : 'Syncing your internship pipeline…'}</p>
      </main>
    )
  }

  if (loadState === 'error') {
    return (
      <main className="connection-state">
        <div className="connection-error-icon" aria-hidden="true">!</div>
        <h1>We couldn’t load your workspace</h1>
        <p>{error ?? 'Check your connection and try again.'}</p>
        <button className="button button--primary" type="button" onClick={retry}>Try again</button>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content" id="top">
        <header className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Application dashboard</h1>
            <p className="header-copy">
              Track opportunities, deadlines, and progress in one place.
            </p>
          </div>
          <div className="session-indicator" aria-label="Data protection status">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Private workspace</strong>
              <small>Protected by Supabase RLS</small>
            </div>
          </div>
        </header>

        <AccountAccess user={user} />

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
            <div className="panel-actions">
              <span className="record-count">{filteredApplications.length} records</span>
              <button className="button button--primary add-button" type="button" disabled={isSaving || deletingId !== null} onClick={() => { clearError(); setIsAdding(true) }}>
                <span aria-hidden="true">+</span> Add application
              </button>
            </div>
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

          <ApplicationsTable
            applications={filteredApplications}
            hasStoredApplications={applications.length > 0}
            onEdit={setEditingApplication}
            onDelete={(application) => { clearError(); setDeletingApplication(application) }}
            actionsDisabled={isSaving || deletingId !== null}
          />
        </section>

        <MatchAnalyser />
      </main>

      {(isAdding || editingApplication) && (
        <ApplicationModal
          title={editingApplication ? 'Edit application' : 'Add application'}
          description={editingApplication ? 'Update the details for this opportunity.' : 'Add an opportunity to your internship pipeline.'}
          onClose={() => { if (!isSaving) { clearError(); setIsAdding(false); setEditingApplication(null) } }}
        >
          <ApplicationForm
            application={editingApplication ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => { clearError(); setIsAdding(false); setEditingApplication(null) }}
            isSaving={isSaving}
            submitError={error}
          />
        </ApplicationModal>
      )}

      {deletingApplication && (
        <ConfirmDialog
          company={deletingApplication.company}
          isDeleting={deletingId === deletingApplication.id}
          error={error}
          onCancel={() => { clearError(); setDeletingApplication(null) }}
          onConfirm={async () => {
            const deleted = await deleteApplication(deletingApplication.id)
            if (deleted) setDeletingApplication(null)
          }}
        />
      )}
    </div>
  )
}

export default App
