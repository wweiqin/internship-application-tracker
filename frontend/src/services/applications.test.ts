import { beforeEach, describe, expect, it, vi } from 'vitest'
import { supabase } from '../lib/supabase'
import type { ApplicationFormValues } from '../types/application'
import type { ApplicationRow } from '../types/database'
import {
  createApplication,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from './applications'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: { updateUser: vi.fn() },
  },
}))

const databaseRow: ApplicationRow = {
  id: 42,
  user_id: 'user-123',
  company_name: 'Example Bank',
  role_title: 'Data Analyst Intern',
  location: 'Singapore',
  application_status: 'Interview',
  application_date: '2026-07-01',
  deadline: '2026-07-15',
  job_link: 'https://example.com/job',
  contact_name: 'Alex Tan',
  contact_email: 'alex@example.com',
  notes: 'Interview scheduled.',
  created_at: '2026-07-01T08:00:00Z',
  updated_at: '2026-07-02T09:00:00Z',
}

const formValues: ApplicationFormValues = {
  company: 'Example Bank',
  role: 'Data Analyst Intern',
  location: 'Singapore',
  status: 'Interview',
  applicationDate: '2026-07-01',
  deadline: '2026-07-15',
  jobLink: 'https://example.com/job',
  contactName: 'Alex Tan',
  contactEmail: 'alex@example.com',
  notes: 'Interview scheduled.',
}

type ApplicationsQuery = ReturnType<typeof supabase.from>

function setQueryMock(query: object) {
  vi.mocked(supabase.from).mockReturnValue(query as unknown as ApplicationsQuery)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('application service', () => {
  it('fetches rows and maps every database field to the domain model', async () => {
    const order = vi.fn().mockResolvedValue({ data: [databaseRow], error: null })
    const select = vi.fn().mockReturnValue({ order })
    setQueryMock({ select })

    const applications = await fetchApplications()

    expect(supabase.from).toHaveBeenCalledWith('applications')
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(applications).toEqual([
      {
        id: 42,
        userId: 'user-123',
        company: 'Example Bank',
        role: 'Data Analyst Intern',
        location: 'Singapore',
        status: 'Interview',
        applicationDate: '2026-07-01',
        deadline: '2026-07-15',
        jobLink: 'https://example.com/job',
        contactName: 'Alex Tan',
        contactEmail: 'alex@example.com',
        notes: 'Interview scheduled.',
        createdAt: '2026-07-01T08:00:00Z',
        updatedAt: '2026-07-02T09:00:00Z',
      },
    ])
  })

  it('creates a snake_case row owned by the authenticated user', async () => {
    const single = vi.fn().mockResolvedValue({ data: databaseRow, error: null })
    const select = vi.fn().mockReturnValue({ single })
    const insert = vi.fn().mockReturnValue({ select })
    setQueryMock({ insert })

    const created = await createApplication(formValues, 'user-123')

    expect(insert).toHaveBeenCalledWith({
      user_id: 'user-123',
      company_name: 'Example Bank',
      role_title: 'Data Analyst Intern',
      location: 'Singapore',
      application_status: 'Interview',
      application_date: '2026-07-01',
      deadline: '2026-07-15',
      job_link: 'https://example.com/job',
      contact_name: 'Alex Tan',
      contact_email: 'alex@example.com',
      notes: 'Interview scheduled.',
    })
    expect(created.id).toBe(42)
  })

  it('updates the selected row without changing ownership fields', async () => {
    const single = vi.fn().mockResolvedValue({ data: databaseRow, error: null })
    const select = vi.fn().mockReturnValue({ single })
    const eq = vi.fn().mockReturnValue({ select })
    const update = vi.fn().mockReturnValue({ eq })
    setQueryMock({ update })

    await updateApplication(42, formValues)

    expect(eq).toHaveBeenCalledWith('id', 42)
    expect(update).toHaveBeenCalledWith(expect.not.objectContaining({
      id: expect.anything(),
      user_id: expect.anything(),
      created_at: expect.anything(),
    }))
    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      company_name: 'Example Bank',
      application_status: 'Interview',
    }))
  })

  it('deletes only the requested row', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null })
    const remove = vi.fn().mockReturnValue({ eq })
    setQueryMock({ delete: remove })

    await deleteApplication(42)

    expect(remove).toHaveBeenCalledOnce()
    expect(eq).toHaveBeenCalledWith('id', 42)
  })
})
