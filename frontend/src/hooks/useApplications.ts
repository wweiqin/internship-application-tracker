import { useCallback, useEffect, useState } from 'react'
import { ensureAnonymousSession } from '../services/auth'
import {
  createApplication,
  deleteApplication,
  initializeApplications,
  updateApplication,
} from '../services/applications'
import type { ApplicationFormValues, InternshipApplication } from '../types/application'

type LoadState = 'authenticating' | 'loading' | 'ready' | 'error'

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

export function useApplications() {
  const [applications, setApplications] = useState<InternshipApplication[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loadState, setLoadState] = useState<LoadState>('authenticating')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function load() {
      setLoadState('authenticating')
      setError(null)
      try {
        const user = await ensureAnonymousSession()
        if (!isCurrent) return
        setUserId(user.id)
        setLoadState('loading')
        const loadedApplications = await initializeApplications(user)
        if (!isCurrent) return
        setApplications(loadedApplications)
        setLoadState('ready')
      } catch (loadError: unknown) {
        if (!isCurrent) return
        setError(errorMessage(loadError))
        setLoadState('error')
      }
    }

    void load()
    return () => { isCurrent = false }
  }, [retryCount])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  async function add(values: ApplicationFormValues): Promise<boolean> {
    if (!userId) return false
    setIsSaving(true)
    setError(null)
    try {
      const created = await createApplication(values, userId)
      setApplications((current) => [created, ...current])
      return true
    } catch (operationError: unknown) {
      setError(errorMessage(operationError))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function update(id: number, values: ApplicationFormValues): Promise<boolean> {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await updateApplication(id, values)
      setApplications((current) => current.map((item) => item.id === id ? updated : item))
      return true
    } catch (operationError: unknown) {
      setError(errorMessage(operationError))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function remove(id: number): Promise<boolean> {
    setDeletingId(id)
    setError(null)
    try {
      await deleteApplication(id)
      setApplications((current) => current.filter((item) => item.id !== id))
      return true
    } catch (operationError: unknown) {
      setError(errorMessage(operationError))
      return false
    } finally {
      setDeletingId(null)
    }
  }

  return {
    applications,
    loadState,
    error,
    isSaving,
    deletingId,
    retry,
    clearError: () => setError(null),
    addApplication: add,
    updateApplication: update,
    deleteApplication: remove,
  }
}
