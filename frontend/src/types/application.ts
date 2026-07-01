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
  userId: string
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
  createdAt: string
  updatedAt: string
}

export type ApplicationFormValues = Omit<
  InternshipApplication,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>

export const applicationStatuses: ApplicationStatus[] = [
  'Interested',
  'Applied',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
]
