// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import type { User } from '@supabase/supabase-js'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { linkEmailToAnonymousUser, sendEmailSignInLink } from '../services/auth'
import { AccountAccess } from './AccountAccess'

vi.mock('../services/auth', () => ({
  linkEmailToAnonymousUser: vi.fn(),
  sendEmailSignInLink: vi.fn(),
}))

const anonymousUser = { id: 'anonymous-1', is_anonymous: true } as User

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('AccountAccess', () => {
  it('explains browser-bound access and validates the email', async () => {
    render(<AccountAccess user={anonymousUser} />)

    expect(screen.getByRole('heading', { name: 'Private browser session' })).toBeVisible()
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send verification' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeVisible()
    expect(linkEmailToAnonymousUser).not.toHaveBeenCalled()
  })

  it('normalises an email before requesting account protection', async () => {
    vi.mocked(linkEmailToAnonymousUser).mockResolvedValue(undefined)
    render(<AccountAccess user={anonymousUser} />)
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: '  Person@Example.COM  ' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Send verification' }))

    await waitFor(() => {
      expect(linkEmailToAnonymousUser).toHaveBeenCalledWith('person@example.com')
    })
    expect(screen.getByRole('status')).toHaveTextContent('Verification email sent')
  })

  it('supports requesting access to an existing email account', async () => {
    vi.mocked(sendEmailSignInLink).mockResolvedValue(undefined)
    render(<AccountAccess user={anonymousUser} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign in on this device' }))
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'person@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Email me a sign-in link' }))

    await waitFor(() => {
      expect(sendEmailSignInLink).toHaveBeenCalledWith('person@example.com')
    })
    expect(screen.getByText(/temporary browser records are not merged/i)).toBeVisible()
  })

  it('shows protected status for a permanent user', () => {
    const permanentUser = {
      id: 'permanent-1',
      is_anonymous: false,
      email: 'person@example.com',
    } as User
    render(<AccountAccess user={permanentUser} />)

    expect(screen.getByRole('heading', { name: 'Email-protected tracker' })).toBeVisible()
    expect(screen.getByText(/person@example.com/)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Protect this tracker' })).not.toBeInTheDocument()
  })
})
