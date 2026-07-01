export type ApplicationRow = {
  id: number
  user_id: string
  company_name: string
  role_title: string
  location: string | null
  application_status: string
  application_date: string | null
  deadline: string | null
  job_link: string | null
  contact_name: string | null
  contact_email: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ApplicationInsert = Omit<ApplicationRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: number
  created_at?: string
  updated_at?: string
}

export type ApplicationUpdate = Partial<Omit<ApplicationRow, 'id' | 'user_id' | 'created_at'>>

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: ApplicationRow
        Insert: ApplicationInsert
        Update: ApplicationUpdate
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
