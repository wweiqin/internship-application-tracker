import { useState, type FormEvent } from 'react'
import {
  applicationStatuses,
  type ApplicationFormValues,
  type InternshipApplication,
} from '../types/application'

interface ApplicationFormProps {
  application?: InternshipApplication
  onSubmit: (values: ApplicationFormValues) => Promise<void>
  onCancel: () => void
  isSaving: boolean
  submitError: string | null
}

type FormErrors = Partial<Record<keyof ApplicationFormValues, string>>

const emptyValues: ApplicationFormValues = {
  company: '',
  role: '',
  location: '',
  status: 'Interested',
  applicationDate: null,
  deadline: null,
  jobLink: '',
  contactName: '',
  contactEmail: '',
  notes: '',
}

function validate(values: ApplicationFormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.company.trim()) errors.company = 'Company name is required.'
  if (!values.role.trim()) errors.role = 'Role title is required.'
  if (values.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) {
    errors.contactEmail = 'Enter a valid email address.'
  }
  if (values.jobLink) {
    try {
      const url = new URL(values.jobLink)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol')
    } catch {
      errors.jobLink = 'Enter a valid URL beginning with http:// or https://.'
    }
  }
  return errors
}

export function ApplicationForm({ application, onSubmit, onCancel, isSaving, submitError }: ApplicationFormProps) {
  const [values, setValues] = useState<ApplicationFormValues>(() => application ? {
    company: application.company,
    role: application.role,
    location: application.location,
    status: application.status,
    applicationDate: application.applicationDate,
    deadline: application.deadline,
    jobLink: application.jobLink,
    contactName: application.contactName,
    contactEmail: application.contactEmail,
    notes: application.notes,
  } : emptyValues)
  const [errors, setErrors] = useState<FormErrors>({})

  function update<K extends keyof ApplicationFormValues>(field: K, value: ApplicationFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    await onSubmit({
      ...values,
      company: values.company.trim(),
      role: values.role.trim(),
      location: values.location.trim(),
      jobLink: values.jobLink.trim(),
      contactName: values.contactName.trim(),
      contactEmail: values.contactEmail.trim(),
      notes: values.notes.trim(),
    })
  }

  const fieldError = (field: keyof ApplicationFormValues) => errors[field] ? `${field}-error` : undefined

  return (
    <form className="application-form" onSubmit={handleSubmit} noValidate>
      {submitError && <div className="operation-error" role="alert">{submitError}</div>}
      <div className="form-grid">
        <label className="form-field">
          <span>Company name <b aria-hidden="true">*</b></span>
          <input value={values.company} onChange={(event) => update('company', event.target.value)} aria-invalid={Boolean(errors.company)} aria-describedby={fieldError('company')} />
          {errors.company && <small id="company-error" className="field-error">{errors.company}</small>}
        </label>
        <label className="form-field">
          <span>Role title <b aria-hidden="true">*</b></span>
          <input value={values.role} onChange={(event) => update('role', event.target.value)} aria-invalid={Boolean(errors.role)} aria-describedby={fieldError('role')} />
          {errors.role && <small id="role-error" className="field-error">{errors.role}</small>}
        </label>
        <label className="form-field">
          <span>Location</span>
          <input value={values.location} onChange={(event) => update('location', event.target.value)} placeholder="e.g. Singapore or Remote" />
        </label>
        <label className="form-field">
          <span>Status</span>
          <select value={values.status} onChange={(event) => update('status', event.target.value as ApplicationFormValues['status'])}>
            {applicationStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Application date</span>
          <input type="date" value={values.applicationDate ?? ''} onChange={(event) => update('applicationDate', event.target.value || null)} />
        </label>
        <label className="form-field">
          <span>Deadline</span>
          <input type="date" value={values.deadline ?? ''} onChange={(event) => update('deadline', event.target.value || null)} />
        </label>
        <label className="form-field form-field--wide">
          <span>Job listing URL</span>
          <input type="url" value={values.jobLink} onChange={(event) => update('jobLink', event.target.value)} placeholder="https://company.com/careers/role" aria-invalid={Boolean(errors.jobLink)} aria-describedby={fieldError('jobLink')} />
          {errors.jobLink && <small id="jobLink-error" className="field-error">{errors.jobLink}</small>}
        </label>
        <label className="form-field">
          <span>Recruiter / contact name</span>
          <input value={values.contactName} onChange={(event) => update('contactName', event.target.value)} />
        </label>
        <label className="form-field">
          <span>Recruiter / contact email</span>
          <input type="email" value={values.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} aria-invalid={Boolean(errors.contactEmail)} aria-describedby={fieldError('contactEmail')} />
          {errors.contactEmail && <small id="contactEmail-error" className="field-error">{errors.contactEmail}</small>}
        </label>
        <label className="form-field form-field--wide">
          <span>Notes</span>
          <textarea rows={4} value={values.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Add interview details, follow-up reminders, or useful context." />
        </label>
      </div>
      <footer className="form-actions">
        <button className="button button--secondary" type="button" onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button className="button button--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : application ? 'Save changes' : 'Add application'}
        </button>
      </footer>
    </form>
  )
}
