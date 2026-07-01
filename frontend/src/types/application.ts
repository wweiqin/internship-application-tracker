export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Online Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'

export interface InternshipApplication {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  applicationDate: string | null
  deadline: string | null
  location: string
  jobLink: string
  contactName: string
  contactEmail: string
  notes: string
}

export type ApplicationFormValues = Omit<InternshipApplication, 'id'>

export const applicationStatuses: ApplicationStatus[] = [
  'Interested',
  'Applied',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
]
