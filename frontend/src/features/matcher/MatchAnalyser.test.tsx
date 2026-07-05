// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MatchAnalyser } from './MatchAnalyser'

const resumePlaceholder =
  'Example: Data analyst with experience in SQL, Power BI, dashboard reporting, and stakeholder communication…'
const jobPlaceholder =
  'Paste responsibilities, requirements, qualifications, and preferred skills here…'

afterEach(cleanup)

describe('MatchAnalyser', () => {
  it('starts with disabled actions and displays the privacy notice', () => {
    render(<MatchAnalyser />)

    expect(screen.getByRole('button', { name: 'Analyse match' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled()
    expect(
      screen.getByText(
        'Your resume and job description are analysed locally in your browser and are not uploaded or stored.',
      ),
    ).toBeVisible()
  })

  it('shows inline validation after an invalid field loses focus', () => {
    render(<MatchAnalyser />)
    const jobDescription = screen.getByPlaceholderText(jobPlaceholder)

    fireEvent.focus(jobDescription)
    fireEvent.blur(jobDescription)

    expect(screen.getByText('Job description is required.')).toBeVisible()
    expect(jobDescription).toHaveAttribute('aria-invalid', 'true')
  })

  it('analyses valid text and renders an accessible score and category results', () => {
    render(<MatchAnalyser />)
    const resume = screen.getByPlaceholderText(resumePlaceholder)
    const jobDescription = screen.getByPlaceholderText(jobPlaceholder)

    fireEvent.change(resume, {
      target: { value: 'Experienced with POWERBI, SQL and dashboard reporting.' },
    })
    fireEvent.change(jobDescription, {
      target: { value: 'This role requires Power BI, SQL and communication skills.' },
    })

    const analyseButton = screen.getByRole('button', { name: 'Analyse match' })
    expect(analyseButton).toBeEnabled()
    fireEvent.click(analyseButton)

    const score = screen.getByRole('progressbar', { name: 'Overall keyword match' })
    expect(score).toHaveAttribute('aria-valuenow', '67')
    expect(screen.getByText('2', { selector: 'dd' })).toBeVisible()
    expect(screen.getByText('3', { selector: 'dd' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Data and Analytics' })).toBeVisible()
    expect(screen.getByText('communication', { selector: 'li' })).toBeVisible()
  })

  it('clears both fields and previous results when reset', () => {
    render(<MatchAnalyser />)
    const resume = screen.getByPlaceholderText(resumePlaceholder)
    const jobDescription = screen.getByPlaceholderText(jobPlaceholder)

    fireEvent.change(resume, {
      target: { value: 'Experienced analyst with SQL and communication skills.' },
    })
    fireEvent.change(jobDescription, {
      target: { value: 'Seeking an analyst with SQL and communication skills.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Analyse match' }))
    expect(screen.getByRole('progressbar')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(resume).toHaveValue('')
    expect(jobDescription).toHaveValue('')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analyse match' })).toBeDisabled()
  })
})
