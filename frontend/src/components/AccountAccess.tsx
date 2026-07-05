import type { User } from '@supabase/supabase-js'
import { useState, type FormEvent } from 'react'
import { linkEmailToAnonymousUser, sendEmailSignInLink } from '../services/auth'

interface AccountAccessProps {
  user: User | null
}

type AccountMode = 'upgrade' | 'signin'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function AccountAccess({ user }: AccountAccessProps) {
  const [mode, setMode] = useState<AccountMode>('upgrade')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const isAnonymous = user?.is_anonymous !== false

  function changeMode(nextMode: AccountMode) {
    setMode(nextMode)
    setError(null)
    setMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    const normalisedEmail = email.trim().toLowerCase()
    if (!isValidEmail(normalisedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === 'upgrade' && isAnonymous) {
        await linkEmailToAnonymousUser(normalisedEmail)
        setMessage('Verification email sent. Open it on this device to protect your current tracker.')
      } else {
        await sendEmailSignInLink(normalisedEmail)
        setMessage('Sign-in link sent. Open it to access the applications linked to that email.')
      }
    } catch (submissionError: unknown) {
      setError(submissionError instanceof Error ? submissionError.message : 'Account request failed. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={`account-access ${isAnonymous ? '' : 'account-access--protected'}`} aria-labelledby="account-access-title">
      <div className="account-access-copy">
        <span className="account-access-icon" aria-hidden="true">{isAnonymous ? '◌' : '✓'}</span>
        <div>
          <h2 id="account-access-title">{isAnonymous ? 'Private browser session' : 'Email-protected tracker'}</h2>
          <p>
            {isAnonymous
              ? 'Your applications are private and saved in Supabase, but access is currently tied to this browser. Link an email to use the same tracker on another device.'
              : `Your applications are protected${user?.email ? ` with ${user.email}` : ''} and can be accessed using an email sign-in link.`}
          </p>
        </div>
      </div>

      <div className="account-tabs" role="group" aria-label="Account access options">
        {isAnonymous && (
          <button className={mode === 'upgrade' ? 'active' : ''} type="button" onClick={() => changeMode('upgrade')}>
            Protect this tracker
          </button>
        )}
        <button className={mode === 'signin' || !isAnonymous ? 'active' : ''} type="button" onClick={() => changeMode('signin')}>
          Sign in on this device
        </button>
      </div>

      <form className="account-form" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Email address</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" aria-invalid={Boolean(error)} />
        </label>
        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : mode === 'upgrade' && isAnonymous ? 'Send verification' : 'Email me a sign-in link'}
        </button>
      </form>
      {mode === 'signin' && isAnonymous && (
        <p className="account-caution">Signing into an existing account loads that account’s records; temporary browser records are not merged.</p>
      )}
      {error && <p className="account-feedback account-feedback--error" role="alert">{error}</p>}
      {message && <p className="account-feedback account-feedback--success" role="status">{message}</p>}
    </section>
  )
}
