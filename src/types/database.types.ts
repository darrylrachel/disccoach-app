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
