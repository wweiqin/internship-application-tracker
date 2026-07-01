import type { MatchAnalysis } from './matcherUtils'

interface MatchResultsProps {
  analysis: MatchAnalysis
}

export function MatchResults({ analysis }: MatchResultsProps) {
  if (analysis.percentage === null) {
    return (
      <section className="match-results match-results--empty" aria-live="polite">
        <div className="match-empty-icon" aria-hidden="true">?</div>
        <h3>No recognised keywords detected</h3>
        <p>{analysis.interpretation}</p>
      </section>
    )
  }

  return (
    <section className="match-results" aria-live="polite" aria-labelledby="match-results-title">
      <div className="results-overview">
        <div
          className="score-ring"
          role="progressbar"
          aria-label="Overall keyword match"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={analysis.percentage}
          style={{ '--score': `${analysis.percentage * 3.6}deg` } as React.CSSProperties}
        >
          <strong>{analysis.percentage}%</strong>
          <span>match</span>
        </div>
        <div className="results-summary">
          <p className="eyebrow">Analysis complete</p>
          <h3 id="match-results-title">Keyword match results</h3>
          <p>{analysis.interpretation}</p>
          <p className="score-explanation">
            Score = matched relevant keywords ÷ recognised job-description keywords × 100.
          </p>
        </div>
        <dl className="result-metrics">
          <div><dt>Matched</dt><dd>{analysis.matchedCount}</dd></div>
          <div><dt>Relevant detected</dt><dd>{analysis.relevantCount}</dd></div>
        </dl>
      </div>

      <div className="category-results">
        {analysis.categories.map((category) => (
          <article className="category-card" key={category.category}>
            <header>
              <h4>{category.category}</h4>
              <span>{category.matched.length} of {category.relevant} matched</span>
            </header>
            {category.matched.length > 0 && (
              <div className="keyword-group">
                <h5><span aria-hidden="true">✓</span> Matched keywords</h5>
                <ul>{category.matched.map((keyword) => <li className="keyword-chip keyword-chip--matched" key={keyword}>{keyword}</li>)}</ul>
              </div>
            )}
            {category.missing.length > 0 && (
              <div className="keyword-group">
                <h5><span aria-hidden="true">−</span> Missing keywords</h5>
                <ul>{category.missing.map((keyword) => <li className="keyword-chip keyword-chip--missing" key={keyword}>{keyword}</li>)}</ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
