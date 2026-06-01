export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bulk_message_recipients: {
        Row: {
          bulk_message_id: string
          created_at: string
          id: string
          phone: string
          provider_response: string | null
          status: string
          supporter_id: string | null
        }
        Insert: {
          bulk_message_id: string
          created_at?: string
          id?: string
          phone: string
          provider_response?: string | null
          status?: string
          supporter_id?: string | null
        }
        Update: {
          bulk_message_id?: string
          created_at?: string
          id?: string
          phone?: string
          provider_response?: string | null
          status?: string
          supporter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_message_recipients_bulk_message_id_fkey"
            columns: ["bulk_message_id"]
            isOneToOne: false
            referencedRelation: "bulk_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_message_recipients_supporter_id_fkey"
            columns: ["supporter_id"]
            isOneToOne: false
            referencedRelation: "supporters"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_messages: {
        Row: {
          audience_ward: string | null
          created_at: string
          failed_count: number
          id: string
          message: string
          provider: string
          sent_count: number
          skipped_count: number
          status: string
          total_recipients: number
        }
        Insert: {
          audience_ward?: string | null
          created_at?: string
          failed_count?: number
          id?: string
          message: string
          provider?: string
          sent_count?: number
          skipped_count?: number
          status?: string
          total_recipients?: number
        }
        Update: {
          audience_ward?: string | null
          created_at?: string
          failed_count?: number
          id?: string
          message?: string
          provider?: string
          sent_count?: number
          skipped_count?: number
          status?: string
          total_recipients?: number
        }
        Relationships: []
      }
      bursary_applications: {
        Row: {
          admin_notes: string | null
          amount_requested: number | null
          created_at: string
          current_grade: string
          dob: string | null
          gender: string | null
          guardian_name: string
          guardian_phone: string
          household_income_band: string | null
          id: string
          id_or_birth_cert_number: string | null
          kcse_year: string | null
          phone: string | null
          reason: string | null
          reference: string
          residence_estate: string | null
          school_name: string
          siblings_in_school: number | null
          sms_last_message: string | null
          sms_last_sent_at: string | null
          status: string
          student_name: string
          supporting_doc_url: string | null
          updated_at: string
          ward: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount_requested?: number | null
          created_at?: string
          current_grade: string
          dob?: string | null
          gender?: string | null
          guardian_name: string
          guardian_phone: string
          household_income_band?: string | null
          id?: string
          id_or_birth_cert_number?: string | null
          kcse_year?: string | null
          phone?: string | null
          reason?: string | null
          reference?: string
          residence_estate?: string | null
          school_name: string
          siblings_in_school?: number | null
          sms_last_message?: string | null
          sms_last_sent_at?: string | null
          status?: string
          student_name: string
          supporting_doc_url?: string | null
          updated_at?: string
          ward?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount_requested?: number | null
          created_at?: string
          current_grade?: string
          dob?: string | null
          gender?: string | null
          guardian_name?: string
          guardian_phone?: string
          household_income_band?: string | null
          id?: string
          id_or_birth_cert_number?: string | null
          kcse_year?: string | null
          phone?: string | null
          reason?: string | null
          reference?: string
          residence_estate?: string | null
          school_name?: string
          siblings_in_school?: number | null
          sms_last_message?: string | null
          sms_last_sent_at?: string | null
          status?: string
          student_name?: string
          supporting_doc_url?: string | null
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          business_name: string
          category: string
          contacts: string | null
          created_at: string
          delivery_available: boolean
          description: string
          id: string
          image_url: string
          image_urls: string[]
          location: string
          nearest_transport: string | null
          owner_name: string
          payment_methods: string[]
          phone: string
          status: string
          street: string | null
          till_paybill_number: string | null
          updated_at: string
          ward: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          category: string
          contacts?: string | null
          created_at?: string
          delivery_available?: boolean
          description?: string
          id?: string
          image_url?: string
          image_urls?: string[]
          location: string
          nearest_transport?: string | null
          owner_name: string
          payment_methods?: string[]
          phone: string
          status?: string
          street?: string | null
          till_paybill_number?: string | null
          updated_at?: string
          ward: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          category?: string
          contacts?: string | null
          created_at?: string
          delivery_available?: boolean
          description?: string
          id?: string
          image_url?: string
          image_urls?: string[]
          location?: string
          nearest_transport?: string | null
          owner_name?: string
          payment_methods?: string[]
          phone?: string
          status?: string
          street?: string | null
          till_paybill_number?: string | null
          updated_at?: string
          ward?: string
          website_url?: string | null
        }
        Relationships: []
      }
      service_ratings: {
        Row: {
          created_at: string
          id: string
          rating: string
          service: string
          ward: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating: string
          service: string
          ward?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: string
          service?: string
          ward?: string | null
        }
        Relationships: []
      }
      supporters: {
        Row: {
          created_at: string
          id: string
          id_number: string
          name: string
          notes: string | null
          opt_out_token: string
          opted_out: boolean
          phone: string
          updated_at: string
          ward: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          id_number: string
          name: string
          notes?: string | null
          opt_out_token?: string
          opted_out?: boolean
          phone: string
          updated_at?: string
          ward?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          id_number?: string
          name?: string
          notes?: string | null
          opt_out_token?: string
          opted_out?: boolean
          phone?: string
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
