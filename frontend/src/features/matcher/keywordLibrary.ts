export const keywordCategories = [
  'Data and Analytics',
  'Finance and Banking',
  'Business and Product',
  'Compliance and Risk',
  'Professional Skills',
] as const

export type KeywordCategory = (typeof keywordCategories)[number]

export interface KeywordDefinition {
  keyword: string
  category: KeywordCategory
  aliases?: readonly string[]
}

export const keywordLibrary: readonly KeywordDefinition[] = [
  { keyword: 'SQL', category: 'Data and Analytics' },
  { keyword: 'Excel', category: 'Data and Analytics', aliases: ['Microsoft Excel'] },
  { keyword: 'Python', category: 'Data and Analytics' },
  { keyword: 'Tableau', category: 'Data and Analytics' },
  { keyword: 'Power BI', category: 'Data and Analytics', aliases: ['PowerBI'] },
  { keyword: 'data analysis', category: 'Data and Analytics', aliases: ['data analytics'] },
  { keyword: 'data preparation', category: 'Data and Analytics' },
  { keyword: 'dashboard', category: 'Data and Analytics', aliases: ['dashboards'] },
  { keyword: 'reporting', category: 'Data and Analytics' },
  { keyword: 'visualisation', category: 'Data and Analytics', aliases: ['visualization', 'data visualisation', 'data visualization'] },

  { keyword: 'financial analysis', category: 'Finance and Banking' },
  { keyword: 'banking', category: 'Finance and Banking' },
  { keyword: 'financial markets', category: 'Finance and Banking' },
  { keyword: 'accounting', category: 'Finance and Banking' },
  { keyword: 'risk assessment', category: 'Finance and Banking' },
  { keyword: 'payments', category: 'Finance and Banking', aliases: ['payment'] },
  { keyword: 'FinTech', category: 'Finance and Banking', aliases: ['financial technology'] },
  { keyword: 'credit', category: 'Finance and Banking' },
  { keyword: 'lending', category: 'Finance and Banking' },

  { keyword: 'business analysis', category: 'Business and Product', aliases: ['business analyst'] },
  { keyword: 'project management', category: 'Business and Product' },
  { keyword: 'stakeholder management', category: 'Business and Product', aliases: ['stakeholder engagement'] },
  { keyword: 'business development', category: 'Business and Product' },
  { keyword: 'product development', category: 'Business and Product' },
  { keyword: 'requirements gathering', category: 'Business and Product', aliases: ['requirement gathering'] },
  { keyword: 'process improvement', category: 'Business and Product' },
  { keyword: 'CRM', category: 'Business and Product', aliases: ['customer relationship management'] },
  { keyword: 'user experience', category: 'Business and Product', aliases: ['UI/UX', 'UIUX', 'UI UX'] },
  { keyword: 'research', category: 'Business and Product' },

  { keyword: 'compliance', category: 'Compliance and Risk' },
  { keyword: 'AML', category: 'Compliance and Risk', aliases: ['anti money laundering'] },
  { keyword: 'KYC', category: 'Compliance and Risk', aliases: ['know your customer'] },
  { keyword: 'due diligence', category: 'Compliance and Risk' },
  { keyword: 'transaction monitoring', category: 'Compliance and Risk' },
  { keyword: 'regulatory', category: 'Compliance and Risk', aliases: ['regulation', 'regulations'] },
  { keyword: 'internal controls', category: 'Compliance and Risk', aliases: ['internal control'] },
  { keyword: 'audit', category: 'Compliance and Risk', aliases: ['auditing'] },
  { keyword: 'financial crime', category: 'Compliance and Risk' },

  { keyword: 'communication', category: 'Professional Skills', aliases: ['communicating'] },
  { keyword: 'teamwork', category: 'Professional Skills', aliases: ['team work'] },
  { keyword: 'leadership', category: 'Professional Skills' },
  { keyword: 'analytical', category: 'Professional Skills' },
  { keyword: 'attention to detail', category: 'Professional Skills', aliases: ['detail oriented', 'detail orientated'] },
  { keyword: 'problem solving', category: 'Professional Skills', aliases: ['problem-solving'] },
  { keyword: 'time management', category: 'Professional Skills' },
  { keyword: 'presentation', category: 'Professional Skills', aliases: ['presentations', 'presenting'] },
]
