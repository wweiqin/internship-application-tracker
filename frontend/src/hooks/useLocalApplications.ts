import { useEffect, useState } from 'react'
import { applications as sampleApplications } from '../data/applications'
import type { ApplicationFormValues, InternshipApplication } from '../types/application'

export const APPLICATIONS_STORAGE_KEY = 'interntrack.applications.v1'

function loadApplications(): InternshipApplication[] {
  try {
    const stored = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY)
    if (!stored) return sampleApplications

    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as InternshipApplication[]) : sampleApplications
  } catch {
    return sampleApplications
  }
}

export function useLocalApplications() {
  const [applications, setApplications] = useState<InternshipApplication[]>(loadApplications)

  useEffect(() => {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  function addApplication(values: ApplicationFormValues) {
    const application: InternshipApplication = { ...values, id: Date.now() }
    setApplications((current) => [application, ...current])
  }

  function updateApplication(id: number, values: ApplicationFormValues) {
    setApplications((current) =>
      current.map((application) => application.id === id ? { ...values, id } : application),
    )
  }

  function deleteApplication(id: number) {
    setApplications((current) => current.filter((application) => application.id !== id))
  }

  return { applications, addApplication, updateApplication, deleteApplication }
}
