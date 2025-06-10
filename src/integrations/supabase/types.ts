export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          tags: string[] | null
          updated_at: string
          user_id: string
          verse: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
          verse: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          verse?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reading_plans: {
        Row: {
          created_at: string
          daily_time_min: number | null
          description: string | null
          difficulty: string | null
          duration_days: number
          id: string
          is_popular: boolean | null
          name: string
          testament: string | null
        }
        Insert: {
          created_at?: string
          daily_time_min?: number | null
          description?: string | null
          difficulty?: string | null
          duration_days: number
          id?: string
          is_popular?: boolean | null
          name: string
          testament?: string | null
        }
        Update: {
          created_at?: string
          daily_time_min?: number | null
          description?: string | null
          difficulty?: string | null
          duration_days?: number
          id?: string
          is_popular?: boolean | null
          name?: string
          testament?: string | null
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          books_read: string[] | null
          chapters_read: number | null
          completed: boolean | null
          created_at: string
          date: string
          id: string
          notes: string | null
          user_id: string
          user_reading_plan_id: string | null
        }
        Insert: {
          books_read?: string[] | null
          chapters_read?: number | null
          completed?: boolean | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          user_id: string
          user_reading_plan_id?: string | null
        }
        Update: {
          books_read?: string[] | null
          chapters_read?: number | null
          completed?: boolean | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          user_id?: string
          user_reading_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_user_reading_plan_id_fkey"
            columns: ["user_reading_plan_id"]
            isOneToOne: false
            referencedRelation: "user_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      site_previews: {
        Row: {
          created_at: string
          id: string
          modern_html: string | null
          original_html: string | null
          request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          modern_html?: string | null
          original_html?: string | null
          request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          modern_html?: string | null
          original_html?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_previews_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "site_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      site_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          target_url: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          target_url: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          target_url?: string
        }
        Relationships: []
      }
      user_reading_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          reading_plan_id: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reading_plan_id: string
          start_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reading_plan_id?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_plans_reading_plan_id_fkey"
            columns: ["reading_plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
