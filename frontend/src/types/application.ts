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
  deadline: string
  location: string
  jobLink: string
}
