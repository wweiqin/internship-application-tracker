import { describe, expect, it } from 'vitest'
import { analyseMatch, normalizeText } from './matcherUtils'

describe('normalizeText', () => {
  it('normalises capitalisation, punctuation, and excess spacing', () => {
    expect(normalizeText('  POWER BI, SQL...  Data-Analysis! ')).toBe(
      'power bi sql data analysis',
    )
  })
})

describe('analyseMatch', () => {
  it('matches keywords regardless of capitalisation', () => {
    const result = analyseMatch(
      'Experienced with sql, EXCEL and Communication.',
      'The role requires SQL, Excel and communication skills.',
    )

    expect(result.percentage).toBe(100)
    expect(result.matchedCount).toBe(3)
    expect(result.relevantCount).toBe(3)
  })

  it('matches supported aliases to their canonical keyword', () => {
    const result = analyseMatch(
      'I use PowerBI, UIUX and customer relationship management tools.',
      'Experience with Power BI, user experience and CRM is preferred.',
    )

    expect(result.percentage).toBe(100)
    expect(result.categories.flatMap((category) => category.matched)).toEqual([
      'Power BI',
      'CRM',
      'user experience',
    ])
  })

  it('does not match a keyword inside a longer word', () => {
    const result = analyseMatch(
      'I am analytical and creditable.',
      'Credit experience and analytical thinking are required.',
    )

    expect(result.percentage).toBe(50)
    expect(result.categories.flatMap((category) => category.missing)).toContain('credit')
  })

  it('scores only recognised keywords found in the job description', () => {
    const result = analyseMatch(
      'SQL, Excel, Python, Tableau and communication.',
      'This internship requires SQL and presentation skills.',
    )

    expect(result.relevantCount).toBe(2)
    expect(result.matchedCount).toBe(1)
    expect(result.percentage).toBe(50)
  })

  it('groups matched and missing keywords in library category order', () => {
    const result = analyseMatch(
      'SQL and communication.',
      'Use SQL and Power BI while demonstrating communication and teamwork.',
    )

    expect(result.categories.map((category) => category.category)).toEqual([
      'Data and Analytics',
      'Professional Skills',
    ])
    expect(result.categories[0]).toMatchObject({
      matched: ['SQL'],
      missing: ['Power BI'],
    })
    expect(result.categories[1]).toMatchObject({
      matched: ['communication'],
      missing: ['teamwork'],
    })
  })

  it('returns no score when the job description has no recognised keywords', () => {
    const result = analyseMatch(
      'Experienced analyst with many technical skills.',
      'We are looking for a curious person who enjoys learning new things.',
    )

    expect(result.percentage).toBeNull()
    expect(result.relevantCount).toBe(0)
    expect(result.categories).toEqual([])
  })
})
