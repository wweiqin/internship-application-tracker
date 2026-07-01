import { useState } from 'react'
import { MatchResults } from './MatchResults'
import { analyseMatch, type MatchAnalysis } from './matcherUtils'
import './matcher.css'

const minimumLength = 20

function validationMessage(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} is required.`
  if (value.trim().length < minimumLength) return `Enter at least ${minimumLength} characters for a useful comparison.`
  return null
}

export function MatchAnalyser() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeTouched, setResumeTouched] = useState(false)
  const [jobTouched, setJobTouched] = useState(false)
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null)

  const resumeError = validationMessage(resumeText, 'Resume or profile text')
  const jobError = validationMessage(jobDescription, 'Job description')
  const canAnalyse = !resumeError && !jobError

  function handleAnalyse() {
    setResumeTouched(true)
    setJobTouched(true)
    if (!canAnalyse) return
    setAnalysis(analyseMatch(resumeText, jobDescription))
  }

  function handleReset() {
    setResumeText('')
    setJobDescription('')
    setResumeTouched(false)
    setJobTouched(false)
    setAnalysis(null)
  }

  return (
    <section className="matcher-panel" id="match-analyser" aria-labelledby="matcher-title">
      <header className="matcher-heading">
        <div>
          <p className="eyebrow">Local analysis</p>
          <h2 id="matcher-title">Job Description Match Analyser</h2>
          <p>Compare recognised job-description keywords with the skills and experience in your profile.</p>
        </div>
        <div className="privacy-notice">
          <span aria-hidden="true">⌁</span>
          <p>Your resume and job description are analysed locally in your browser and are not uploaded or stored.</p>
        </div>
      </header>

      <div className="matcher-inputs">
        <label className="matcher-field">
          <span>Resume or profile text</span>
          <small>Paste your resume, skills, or professional summary.</small>
          <textarea
            value={resumeText}
            onChange={(event) => { setResumeText(event.target.value); setAnalysis(null) }}
            onBlur={() => setResumeTouched(true)}
            placeholder="Example: Data analyst with experience in SQL, Power BI, dashboard reporting, and stakeholder communication…"
            rows={9}
            aria-invalid={resumeTouched && Boolean(resumeError)}
            aria-describedby={resumeTouched && resumeError ? 'resume-match-error' : undefined}
          />
          {resumeTouched && resumeError && <small className="matcher-error" id="resume-match-error">{resumeError}</small>}
        </label>

        <label className="matcher-field">
          <span>Job description</span>
          <small>Paste the complete internship job description.</small>
          <textarea
            value={jobDescription}
            onChange={(event) => { setJobDescription(event.target.value); setAnalysis(null) }}
            onBlur={() => setJobTouched(true)}
            placeholder="Paste responsibilities, requirements, qualifications, and preferred skills here…"
            rows={9}
            aria-invalid={jobTouched && Boolean(jobError)}
            aria-describedby={jobTouched && jobError ? 'job-match-error' : undefined}
          />
          {jobTouched && jobError && <small className="matcher-error" id="job-match-error">{jobError}</small>}
        </label>
      </div>

      <div className="matcher-actions">
        <p>Only recognised keywords present in the job description contribute to the score.</p>
        <div>
          <button className="button button--secondary" type="button" onClick={handleReset} disabled={!resumeText && !jobDescription && !analysis}>Reset</button>
          <button className="button button--primary" type="button" onClick={handleAnalyse} disabled={!canAnalyse}>Analyse match</button>
        </div>
      </div>

      {analysis && <MatchResults analysis={analysis} />}
    </section>
  )
}
