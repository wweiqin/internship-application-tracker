import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

let authenticationPromise: Promise<User> | null = null

export function ensureAnonymousSession(): Promise<User> {
  if (authenticationPromise) return authenticationPromise

  authenticationPromise = (async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (sessionData.session?.user) return sessionData.session.user

    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    if (!data.user) throw new Error('Supabase did not return a user after anonymous sign-in.')
    return data.user
  })().catch((error: unknown) => {
    authenticationPromise = null
    throw error
  })

  return authenticationPromise
}

export async function linkEmailToAnonymousUser(email: string): Promise<void> {
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: window.location.origin },
  )
  if (error) throw error
}

export async function sendEmailSignInLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: window.location.origin,
    },
  })
  if (error) throw error
}
