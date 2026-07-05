// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { InternshipApplication } from '../types/application'
import { ApplicationForm } from './ApplicationForm'

afterEach(cleanup)

function renderForm(options?: {
  application?: InternshipApplication
  isSaving?: boolean
  submitError?: string | null
}) {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  const onCancel = vi.fn()
  render(
    <ApplicationForm
      application={options?.application}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSaving={options?.isSaving ?? false}
      submitError={options?.submitError ?? null}
    />,
  )
  return { onSubmit, onCancel }
}

function companyInput() {
  return screen.getByLabelText('Company name', { exact: false })
}

function roleInput() {
  return screen.getByLabelText('Role title', { exact: false })
}

describe('ApplicationForm', () => {
  it('shows inline errors and does not submit without required fields', async () => {
    const { onSubmit } = renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Add application' }))

    expect(await screen.findByText('Company name is required.')).toBeVisible()
    expect(screen.getByText('Role title is required.')).toBeVisible()
    expect(companyInput()).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('validates optional email and URL fields when provided', async () => {
    const { onSubmit } = renderForm()
    fireEvent.change(companyInput(), { target: { value: 'Example Bank' } })
    fireEvent.change(roleInput(), { target: { value: 'Analyst Intern' } })
    fireEvent.change(screen.getByLabelText('Job listing URL'), {
      target: { value: 'not-a-url' },
    })
    fireEvent.change(screen.getByLabelText('Recruiter / contact email'), {
      target: { value: 'invalid-email' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add application' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeVisible()
    expect(
      screen.getByText('Enter a valid URL beginning with http:// or https://.'),
    ).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('trims text and submits the complete typed form values', async () => {
    const { onSubmit } = renderForm()
    fireEvent.change(companyInput(), { target: { value: '  Example Bank  ' } })
    fireEvent.change(roleInput(), { target: { value: '  Analyst Intern  ' } })
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: '  Singapore  ' },
    })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Applied' } })
    fireEvent.change(screen.getByLabelText('Job listing URL'), {
      target: { value: '  https://example.com/job  ' },
    })
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: '  Follow up next week.  ' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add application' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      company: 'Example Bank',
      role: 'Analyst Intern',
      location: 'Singapore',
      status: 'Applied',
      jobLink: 'https://example.com/job',
      notes: 'Follow up next week.',
    }))
  })

  it('pre-populates edit values and disables actions while saving', () => {
    const application: InternshipApplication = {
      id: 8,
      userId: 'user-123',
      company: 'Existing Company',
      role: 'Existing Role',
      location: 'Remote',
      status: 'Interview',
      applicationDate: '2026-07-01',
      deadline: '2026-07-20',
      jobLink: '',
      contactName: '',
      contactEmail: '',
      notes: 'Prepare questions.',
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    }
    renderForm({ application, isSaving: true })

    expect(companyInput()).toHaveValue('Existing Company')
    expect(roleInput()).toHaveValue('Existing Role')
    expect(screen.getByLabelText('Status')).toHaveValue('Interview')
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('shows database operation errors without losing form contents', () => {
    renderForm({ submitError: 'Could not create application: network unavailable' })
    fireEvent.change(companyInput(), { target: { value: 'Unsaved Company' } })

    expect(screen.getByRole('alert')).toHaveTextContent('network unavailable')
    expect(companyInput()).toHaveValue('Unsaved Company')
  })
})
