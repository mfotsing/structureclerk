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
