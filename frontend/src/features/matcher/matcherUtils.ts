import {
  keywordCategories,
  keywordLibrary,
  type KeywordCategory,
  type KeywordDefinition,
} from './keywordLibrary'

export interface CategoryMatchResult {
  category: KeywordCategory
  relevant: number
  matched: string[]
  missing: string[]
}

export interface MatchAnalysis {
  percentage: number | null
  matchedCount: number
  relevantCount: number
  categories: CategoryMatchResult[]
  interpretation: string
}

export function normalizeText(text: string): string {
  return text
    .toLocaleLowerCase('en')
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function keywordAppears(normalizedText: string, definition: KeywordDefinition): boolean {
  const paddedText = ` ${normalizedText} `
  return [definition.keyword, ...(definition.aliases ?? [])].some((term) => {
    const normalizedTerm = normalizeText(term)
    return normalizedTerm.length > 0 && paddedText.includes(` ${normalizedTerm} `)
  })
}

function interpretationFor(percentage: number): string {
  if (percentage >= 75) {
    return 'Strong keyword alignment. Your profile mentions most of the recognised terms used in this job description.'
  }
  if (percentage >= 50) {
    return 'Moderate keyword alignment. Your profile covers several relevant terms, with some clear gaps to review.'
  }
  return 'Limited keyword alignment. Review the missing terms and only add skills or experience that genuinely apply to you.'
}

export function analyseMatch(resumeText: string, jobDescriptionText: string): MatchAnalysis {
  const normalizedResume = normalizeText(resumeText)
  const normalizedJobDescription = normalizeText(jobDescriptionText)
  const relevantKeywords = keywordLibrary.filter((definition) =>
    keywordAppears(normalizedJobDescription, definition),
  )

  const categories = keywordCategories.map((category) => {
    const relevantForCategory = relevantKeywords.filter((definition) => definition.category === category)
    const matched = relevantForCategory
      .filter((definition) => keywordAppears(normalizedResume, definition))
      .map((definition) => definition.keyword)
    const missing = relevantForCategory
      .filter((definition) => !keywordAppears(normalizedResume, definition))
      .map((definition) => definition.keyword)

    return { category, relevant: relevantForCategory.length, matched, missing }
  }).filter((result) => result.relevant > 0)

  const relevantCount = relevantKeywords.length
  const matchedCount = categories.reduce((total, category) => total + category.matched.length, 0)
  const percentage = relevantCount > 0 ? Math.round((matchedCount / relevantCount) * 100) : null

  return {
    percentage,
    matchedCount,
    relevantCount,
    categories,
    interpretation: percentage === null
      ? 'No recognised keywords were found in this job description. Try pasting a fuller description or review it manually.'
      : interpretationFor(percentage),
  }
}
