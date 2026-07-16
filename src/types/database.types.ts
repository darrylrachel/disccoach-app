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
      bag_discs: {
        Row: {
          added_at: string
          bag_id: string
          disc_id: string
          id: string
          slot: string
        }
        Insert: {
          added_at?: string
          bag_id: string
          disc_id: string
          id?: string
          slot: string
        }
        Update: {
          added_at?: string
          bag_id?: string
          disc_id?: string
          id?: string
          slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "bag_discs_bag_id_fkey"
            columns: ["bag_id"]
            isOneToOne: false
            referencedRelation: "bags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bag_discs_disc_id_fkey"
            columns: ["disc_id"]
            isOneToOne: false
            referencedRelation: "discs"
            referencedColumns: ["id"]
          },
        ]
      }
      bags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      disc_catalog: {
        Row: {
          category: string
          created_at: string
          fade: number
          glide: number
          id: string
          manufacturer: string
          mold_name: string
          plastic_types: string[]
          speed: number
          stability: string
          turn: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          fade: number
          glide: number
          id?: string
          manufacturer: string
          mold_name: string
          plastic_types?: string[]
          speed: number
          stability: string
          turn: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          fade?: number
          glide?: number
          id?: string
          manufacturer?: string
          mold_name?: string
          plastic_types?: string[]
          speed?: number
          stability?: string
          turn?: number
          updated_at?: string
        }
        Relationships: []
      }
      discs: {
        Row: {
          beat_in_level: number
          catalog_id: string | null
          color: string | null
          condition: string
          confidence_rating: number | null
          created_at: string
          custom_manufacturer: string | null
          custom_mold_name: string | null
          favorite_uses: string[] | null
          id: string
          nickname: string | null
          notes: string | null
          personal_fade: number | null
          personal_glide: number | null
          personal_speed: number | null
          personal_turn: number | null
          plastic: string | null
          status: string
          status_changed_at: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          beat_in_level?: number
          catalog_id?: string | null
          color?: string | null
          condition?: string
          confidence_rating?: number | null
          created_at?: string
          custom_manufacturer?: string | null
          custom_mold_name?: string | null
          favorite_uses?: string[] | null
          id?: string
          nickname?: string | null
          notes?: string | null
          personal_fade?: number | null
          personal_glide?: number | null
          personal_speed?: number | null
          personal_turn?: number | null
          plastic?: string | null
          status?: string
          status_changed_at?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          beat_in_level?: number
          catalog_id?: string | null
          color?: string | null
          condition?: string
          confidence_rating?: number | null
          created_at?: string
          custom_manufacturer?: string | null
          custom_mold_name?: string | null
          favorite_uses?: string[] | null
          id?: string
          nickname?: string | null
          notes?: string | null
          personal_fade?: number | null
          personal_glide?: number | null
          personal_speed?: number | null
          personal_turn?: number | null
          plastic?: string | null
          status?: string
          status_changed_at?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discs_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "disc_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          achieved_at: string
          created_at: string
          id: string
          record_type: string
          source_session_id: string | null
          user_id: string
          value: number
        }
        Insert: {
          achieved_at: string
          created_at?: string
          id?: string
          record_type: string
          source_session_id?: string | null
          user_id: string
          value: number
        }
        Update: {
          achieved_at?: string
          created_at?: string
          id?: string
          record_type?: string
          source_session_id?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_source_session_id_fkey"
            columns: ["source_session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_log_entries: {
        Row: {
          attempts: number | null
          distance_feet: number | null
          drill_label: string
          id: string
          logged_at: string
          makes: number | null
          metric_type: string
          notes: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          distance_feet?: number | null
          drill_label: string
          id?: string
          logged_at?: string
          makes?: number | null
          metric_type: string
          notes?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          distance_feet?: number | null
          drill_label?: string
          id?: string
          logged_at?: string
          makes?: number | null
          metric_type?: string
          notes?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_log_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_session_templates: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          duration_minutes: number
          id: string
          name: string
          structure: Json
        }
        Insert: {
          category: string
          created_at?: string
          difficulty: string
          duration_minutes: number
          id?: string
          name: string
          structure: Json
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          duration_minutes?: number
          id?: string
          name?: string
          structure?: Json
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          duration_minutes: number
          enrollment_id: string | null
          id: string
          program_day_id: string | null
          started_at: string
          status: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          duration_minutes: number
          enrollment_id?: string | null
          id?: string
          program_day_id?: string | null
          started_at?: string
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          enrollment_id?: string | null
          id?: string
          program_day_id?: string | null
          started_at?: string
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "practice_session_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_sessions_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_sessions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_program_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          forehand_distance: number | null
          id: string
          max_distance: number | null
          primary_goal: string | null
          primary_throw_style: string | null
          putting_style: string | null
          skill_level: string | null
          throwing_hand: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          forehand_distance?: number | null
          id: string
          max_distance?: number | null
          primary_goal?: string | null
          primary_throw_style?: string | null
          putting_style?: string | null
          skill_level?: string | null
          throwing_hand?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          forehand_distance?: number | null
          id?: string
          max_distance?: number | null
          primary_goal?: string | null
          primary_throw_style?: string | null
          putting_style?: string | null
          skill_level?: string | null
          throwing_hand?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      program_day_completions: {
        Row: {
          completed_at: string
          enrollment_id: string
          id: string
          program_day_id: string
          session_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          enrollment_id: string
          id?: string
          program_day_id: string
          session_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          enrollment_id?: string
          id?: string
          program_day_id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_day_completions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_program_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_day_completions_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_day_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      program_days: {
        Row: {
          created_at: string
          day_number: number
          description: string
          id: string
          program_id: string
          template_id: string
          title: string
          week_number: number
        }
        Insert: {
          created_at?: string
          day_number: number
          description: string
          id?: string
          program_id: string
          template_id: string
          title: string
          week_number: number
        }
        Update: {
          created_at?: string
          day_number?: number
          description?: string
          id?: string
          program_id?: string
          template_id?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_days_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "practice_session_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          duration_weeks: number
          estimated_minutes: number
          id: string
          name: string
          primary_goal: string | null
          sessions_per_week: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty: string
          duration_weeks: number
          estimated_minutes: number
          id?: string
          name: string
          primary_goal?: string | null
          sessions_per_week: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          duration_weeks?: number
          estimated_minutes?: number
          id?: string
          name?: string
          primary_goal?: string | null
          sessions_per_week?: number
        }
        Relationships: []
      }
      user_program_enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          program_id: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          program_id: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          program_id?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
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
