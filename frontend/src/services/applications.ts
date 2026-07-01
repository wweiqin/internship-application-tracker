import type { User } from '@supabase/supabase-js'
import { applications as sampleApplications } from '../data/applications'
import { supabase } from '../lib/supabase'
import { applicationStatuses, type ApplicationFormValues, type ApplicationStatus, type InternshipApplication } from '../types/application'
import type { ApplicationInsert, ApplicationRow, ApplicationUpdate } from '../types/database'

function isApplicationStatus(value: string): value is ApplicationStatus {
  return applicationStatuses.some((status) => status === value)
}

function mapRow(row: ApplicationRow): InternshipApplication {
  if (!isApplicationStatus(row.application_status)) {
    throw new Error(`Unsupported application status: ${row.application_status}`)
  }

  return {
    id: row.id,
    userId: row.user_id,
    company: row.company_name,
    role: row.role_title,
    location: row.location ?? '',
    status: row.application_status,
    applicationDate: row.application_date,
    deadline: row.deadline,
    jobLink: row.job_link ?? '',
    contactName: row.contact_name ?? '',
    contactEmail: row.contact_email ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toInsert(values: ApplicationFormValues, userId: string): ApplicationInsert {
  return {
    user_id: userId,
    company_name: values.company,
    role_title: values.role,
    location: values.location || null,
    application_status: values.status,
    application_date: values.applicationDate,
    deadline: values.deadline,
    job_link: values.jobLink || null,
    contact_name: values.contactName || null,
    contact_email: values.contactEmail || null,
    notes: values.notes || null,
  }
}

function toUpdate(values: ApplicationFormValues): ApplicationUpdate {
  return {
    company_name: values.company,
    role_title: values.role,
    location: values.location || null,
    application_status: values.status,
    application_date: values.applicationDate,
    deadline: values.deadline,
    job_link: values.jobLink || null,
    contact_name: values.contactName || null,
    contact_email: values.contactEmail || null,
    notes: values.notes || null,
  }
}

function databaseError(context: string, error: { message: string }): Error {
  return new Error(`${context}: ${error.message}`)
}

export async function fetchApplications(): Promise<InternshipApplication[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw databaseError('Could not load applications', error)
  return data.map(mapRow)
}

export async function createApplication(values: ApplicationFormValues, userId: string): Promise<InternshipApplication> {
  const { data, error } = await supabase
    .from('applications')
    .insert(toInsert(values, userId))
    .select()
    .single()
  if (error) throw databaseError('Could not create application', error)
  return mapRow(data)
}

export async function updateApplication(id: number, values: ApplicationFormValues): Promise<InternshipApplication> {
  const { data, error } = await supabase
    .from('applications')
    .update(toUpdate(values))
    .eq('id', id)
    .select()
    .single()
  if (error) throw databaseError('Could not update application', error)
  return mapRow(data)
}

export async function deleteApplication(id: number): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id)
  if (error) throw databaseError('Could not delete application', error)
}

const initializationPromises = new Map<string, Promise<InternshipApplication[]>>()

async function markStarterDataInitialized(user: User): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, starter_applications_initialized: true },
  })
  if (error) throw databaseError('Could not finish starter-data setup', error)
}

export function initializeApplications(user: User): Promise<InternshipApplication[]> {
  const existingPromise = initializationPromises.get(user.id)
  if (existingPromise) return existingPromise

  const promise = (async () => {
    const existing = await fetchApplications()
    const wasInitialized = user.user_metadata.starter_applications_initialized === true
    if (existing.length > 0) {
      if (!wasInitialized) await markStarterDataInitialized(user)
      return existing
    }
    if (wasInitialized) return []

    const rows = sampleApplications.map((application) => toInsert(application, user.id))
    const { data, error } = await supabase
      .from('applications')
      .insert(rows)
      .select()
    if (error) throw databaseError('Could not create starter applications', error)
    await markStarterDataInitialized(user)
    return data.map(mapRow)
  })().catch((error: unknown) => {
    initializationPromises.delete(user.id)
    throw error
  })

  initializationPromises.set(user.id, promise)
  return promise
}
