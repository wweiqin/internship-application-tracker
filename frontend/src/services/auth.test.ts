import type { User } from '@supabase/supabase-js'
import { afterEach, describe, expect, it, vi } from 'vitest'

const user = { id: 'anonymous-user-123' } as User

afterEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  vi.doUnmock('../lib/supabase')
})

function mockSupabaseAuth(options: {
  sessionUser?: User | null
  signInResults?: Array<{ data: { user: User | null }; error: Error | null }>
}) {
  const getSession = vi.fn().mockResolvedValue({
    data: { session: options.sessionUser ? { user: options.sessionUser } : null },
    error: null,
  })
  const signInAnonymously = vi.fn()
  const updateUser = vi.fn().mockResolvedValue({ error: null })
  const signInWithOtp = vi.fn().mockResolvedValue({ error: null })

  for (const result of options.signInResults ?? []) {
    signInAnonymously.mockResolvedValueOnce(result)
  }

  vi.doMock('../lib/supabase', () => ({
    supabase: { auth: { getSession, signInAnonymously, updateUser, signInWithOtp } },
  }))

  return { getSession, signInAnonymously, updateUser, signInWithOtp }
}

describe('ensureAnonymousSession', () => {
  it('reuses an existing Supabase session', async () => {
    const auth = mockSupabaseAuth({ sessionUser: user })
    const { ensureAnonymousSession } = await import('./auth')

    await expect(ensureAnonymousSession()).resolves.toBe(user)
    expect(auth.getSession).toHaveBeenCalledOnce()
    expect(auth.signInAnonymously).not.toHaveBeenCalled()
  })

  it('creates an anonymous session when none exists', async () => {
    const auth = mockSupabaseAuth({
      sessionUser: null,
      signInResults: [{ data: { user }, error: null }],
    })
    const { ensureAnonymousSession } = await import('./auth')

    await expect(ensureAnonymousSession()).resolves.toBe(user)
    expect(auth.signInAnonymously).toHaveBeenCalledOnce()
  })

  it('shares one in-flight sign-in across concurrent Strict Mode calls', async () => {
    const auth = mockSupabaseAuth({
      sessionUser: null,
      signInResults: [{ data: { user }, error: null }],
    })
    const { ensureAnonymousSession } = await import('./auth')

    const [first, second] = await Promise.all([
      ensureAnonymousSession(),
      ensureAnonymousSession(),
    ])

    expect(first).toBe(user)
    expect(second).toBe(user)
    expect(auth.getSession).toHaveBeenCalledOnce()
    expect(auth.signInAnonymously).toHaveBeenCalledOnce()
  })

  it('allows retrying after an authentication failure', async () => {
    const failure = new Error('Anonymous sign-in failed')
    const auth = mockSupabaseAuth({
      sessionUser: null,
      signInResults: [
        { data: { user: null }, error: failure },
        { data: { user }, error: null },
      ],
    })
    const { ensureAnonymousSession } = await import('./auth')

    await expect(ensureAnonymousSession()).rejects.toThrow('Anonymous sign-in failed')
    await expect(ensureAnonymousSession()).resolves.toBe(user)
    expect(auth.signInAnonymously).toHaveBeenCalledTimes(2)
  })

  it('links an email to the current anonymous user', async () => {
    const auth = mockSupabaseAuth({ sessionUser: user })
    const { linkEmailToAnonymousUser } = await import('./auth')

    await linkEmailToAnonymousUser('person@example.com')

    expect(auth.updateUser).toHaveBeenCalledWith(
      { email: 'person@example.com' },
      { emailRedirectTo: window.location.origin },
    )
  })

  it('requests a non-creating email sign-in link', async () => {
    const auth = mockSupabaseAuth({ sessionUser: user })
    const { sendEmailSignInLink } = await import('./auth')

    await sendEmailSignInLink('person@example.com')

    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'person@example.com',
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    })
  })
})
// @vitest-environment jsdom
