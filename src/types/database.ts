export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          phone: string | null
          email: string | null
          website: string | null
          tax_number: string | null
          tps_number: string | null
          tvq_number: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'owner' | 'admin' | 'member' | 'viewer'
          phone: string | null
          locale: string
<<<<<<< HEAD
=======
          subscription_status: 'trial' | 'active' | 'expired' | 'canceled'
          trial_started_at: string | null
          trial_ends_at: string | null
          subscription_started_at: string | null
>>>>>>> feat/ai-integration
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          organization_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          plan_name: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
<<<<<<< HEAD
=======
          trial_ends_at: string | null
          monthly_price: number
          ai_tokens_used: number
          ai_tokens_limit: number
>>>>>>> feat/ai-integration
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      clients: {
        Row: {
          id: string
          organization_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          client_id: string | null
          name: string
          description: string | null
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          start_date: string | null
          end_date: string | null
          budget: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          profile_id: string
          role: 'manager' | 'member' | 'viewer'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_members']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['project_members']['Insert']>
      }
      quotes: {
        Row: {
          id: string
          organization_id: string
          client_id: string | null
          project_id: string | null
          quote_number: string
          title: string
          description: string | null
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          issue_date: string
          valid_until: string | null
          subtotal: number
          tps: number
          tvq: number
          total: number
          notes: string | null
          terms: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quote_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quote_items']['Insert']>
      }
      invoices: {
        Row: {
          id: string
          organization_id: string
          client_id: string | null
          project_id: string | null
          quote_id: string | null
          invoice_number: string
          title: string
          description: string | null
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string | null
          paid_date: string | null
          subtotal: number
          tps: number
          tvq: number
          total: number
          amount_paid: number
          notes: string | null
          terms: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['invoice_items']['Insert']>
      }
      documents: {
        Row: {
          id: string
          organization_id: string
          project_id: string | null
          client_id: string | null
          invoice_id: string | null
          quote_id: string | null
          name: string
          description: string | null
          file_path: string
          file_size: number | null
          mime_type: string | null
          category: string | null
<<<<<<< HEAD
=======
          type_detecte: string | null
          contenu_textuel: string | null
          ai_summary: string | null
          ai_metadata: Json
          ai_confidence: number | null
          processing_status: 'pending' | 'processing' | 'completed' | 'failed'
          processing_error: string | null
          processed_at: string | null
>>>>>>> feat/ai-integration
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      activities: {
        Row: {
          id: string
          organization_id: string
          project_id: string | null
          invoice_id: string | null
          quote_id: string | null
          user_id: string | null
          action: string
          description: string
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['activities']['Insert']>
      }
<<<<<<< HEAD
=======
      upload_jobs: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          document_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          file_name: string
          file_size: number | null
          mime_type: string | null
          stage: string | null
          progress: number
          error_message: string | null
          metadata: Json
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['upload_jobs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['upload_jobs']['Insert']>
      }
      tender_responses: {
        Row: {
          id: string
          organization_id: string
          project_id: string | null
          source_document_id: string | null
          title: string
          tender_reference: string | null
          status: 'draft' | 'in_review' | 'submitted' | 'won' | 'lost'
          generated_content: string | null
          edited_content: string | null
          company_profile: Json
          ai_metadata: Json
          submitted_at: string | null
          result: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tender_responses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tender_responses']['Insert']>
      }
      export_jobs: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          export_type: string
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
          file_path: string | null
          file_size: number | null
          download_url: string | null
          expires_at: string | null
          error_message: string | null
          metadata: Json
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['export_jobs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['export_jobs']['Insert']>
      }
      account_deletions: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          user_email: string
          organization_name: string
          reason: string | null
          data_exported: boolean
          export_job_id: string | null
          deleted_by: string | null
          metadata: Json
          requested_at: string
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['account_deletions']['Row'], 'id' | 'requested_at'>
        Update: Partial<Database['public']['Tables']['account_deletions']['Insert']>
      }
      ai_usage_logs: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          operation: string
          model: string
          tokens_input: number
          tokens_output: number
          tokens_total: number
          cost_estimate: number | null
          success: boolean
          cached: boolean
          execution_time_ms: number | null
          error_message: string | null
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_usage_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_usage_logs']['Insert']>
      }
>>>>>>> feat/ai-integration
    }
  }
}

// Convenience types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type Quote = Database['public']['Tables']['quotes']['Row']
export type QuoteItem = Database['public']['Tables']['quote_items']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
<<<<<<< HEAD
=======
export type UploadJob = Database['public']['Tables']['upload_jobs']['Row']
export type TenderResponse = Database['public']['Tables']['tender_responses']['Row']
export type ExportJob = Database['public']['Tables']['export_jobs']['Row']
export type AccountDeletion = Database['public']['Tables']['account_deletions']['Row']
export type AIUsageLog = Database['public']['Tables']['ai_usage_logs']['Row']
>>>>>>> feat/ai-integration
