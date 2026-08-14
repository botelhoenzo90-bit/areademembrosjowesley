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
      action_plans: {
        Row: {
          created_at: string
          id: string
          indicators: Json
          objective: string
          steps: Json
          timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          indicators?: Json
          objective: string
          steps?: Json
          timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          indicators?: Json
          objective?: string
          steps?: Json
          timeline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          completed: boolean
          content: string
          created_at: string
          id: string
          theme: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          content: string
          created_at?: string
          id?: string
          theme: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          content?: string
          created_at?: string
          id?: string
          theme?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      hero_journey_archetypes: {
        Row: {
          archetype: Database["public"]["Enums"]["hero_archetype_name"]
          completed_at: string | null
          id: string
          mission_completed: boolean | null
          progress: number
          protocol_steps_completed: Json | null
          reflection_text: string | null
          status: Database["public"]["Enums"]["hero_archetype_status"]
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          archetype: Database["public"]["Enums"]["hero_archetype_name"]
          completed_at?: string | null
          id?: string
          mission_completed?: boolean | null
          progress?: number
          protocol_steps_completed?: Json | null
          reflection_text?: string | null
          status?: Database["public"]["Enums"]["hero_archetype_status"]
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          archetype?: Database["public"]["Enums"]["hero_archetype_name"]
          completed_at?: string | null
          id?: string
          mission_completed?: boolean | null
          progress?: number
          protocol_steps_completed?: Json | null
          reflection_text?: string | null
          status?: Database["public"]["Enums"]["hero_archetype_status"]
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hero_journey_certificates: {
        Row: {
          id: string
          issue_date: string | null
          predominant: Database["public"]["Enums"]["hero_archetype_name"]
          secondary: Database["public"]["Enums"]["hero_archetype_name"] | null
          user_id: string
          verification_code: string | null
        }
        Insert: {
          id?: string
          issue_date?: string | null
          predominant: Database["public"]["Enums"]["hero_archetype_name"]
          secondary?: Database["public"]["Enums"]["hero_archetype_name"] | null
          user_id: string
          verification_code?: string | null
        }
        Update: {
          id?: string
          issue_date?: string | null
          predominant?: Database["public"]["Enums"]["hero_archetype_name"]
          secondary?: Database["public"]["Enums"]["hero_archetype_name"] | null
          user_id?: string
          verification_code?: string | null
        }
        Relationships: []
      }
      hero_journey_diagnosis: {
        Row: {
          created_at: string | null
          id: string
          predominant: Database["public"]["Enums"]["hero_archetype_name"]
          recommendation: string | null
          results: Json
          secondary: Database["public"]["Enums"]["hero_archetype_name"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          predominant: Database["public"]["Enums"]["hero_archetype_name"]
          recommendation?: string | null
          results: Json
          secondary?: Database["public"]["Enums"]["hero_archetype_name"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          predominant?: Database["public"]["Enums"]["hero_archetype_name"]
          recommendation?: string | null
          results?: Json
          secondary?: Database["public"]["Enums"]["hero_archetype_name"] | null
          user_id?: string
        }
        Relationships: []
      }
      hero_journey_quiz_responses: {
        Row: {
          answer_index: number
          archetype: Database["public"]["Enums"]["hero_archetype_name"]
          created_at: string | null
          id: string
          question_index: number
          score: number
          user_id: string
        }
        Insert: {
          answer_index: number
          archetype: Database["public"]["Enums"]["hero_archetype_name"]
          created_at?: string | null
          id?: string
          question_index: number
          score: number
          user_id: string
        }
        Update: {
          answer_index?: number
          archetype?: Database["public"]["Enums"]["hero_archetype_name"]
          created_at?: string | null
          id?: string
          question_index?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      hero_journey_stats: {
        Row: {
          archetypes_explored: number | null
          badges: Json | null
          consciousness_level: number | null
          current_archetype:
            | Database["public"]["Enums"]["hero_archetype_name"]
            | null
          last_interaction: string | null
          missions_completed: number | null
          protocols_realized: number | null
          secondary_archetype:
            | Database["public"]["Enums"]["hero_archetype_name"]
            | null
          total_progress: number | null
          user_id: string
        }
        Insert: {
          archetypes_explored?: number | null
          badges?: Json | null
          consciousness_level?: number | null
          current_archetype?:
            | Database["public"]["Enums"]["hero_archetype_name"]
            | null
          last_interaction?: string | null
          missions_completed?: number | null
          protocols_realized?: number | null
          secondary_archetype?:
            | Database["public"]["Enums"]["hero_archetype_name"]
            | null
          total_progress?: number | null
          user_id: string
        }
        Update: {
          archetypes_explored?: number | null
          badges?: Json | null
          consciousness_level?: number | null
          current_archetype?:
            | Database["public"]["Enums"]["hero_archetype_name"]
            | null
          last_interaction?: string | null
          missions_completed?: number | null
          protocols_realized?: number | null
          secondary_archetype?:
            | Database["public"]["Enums"]["hero_archetype_name"]
            | null
          total_progress?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          id: string
          module_id: string
          order_index: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes?: number
          id?: string
          module_id: string
          order_index: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          module_id?: string
          order_index?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          checklist: Json
          completed: boolean
          created_at: string
          deadline: string | null
          id: string
          objective: string
          period: string
          steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist?: Json
          completed?: boolean
          created_at?: string
          deadline?: string | null
          id?: string
          objective: string
          period: string
          steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist?: Json
          completed?: boolean
          created_at?: string
          deadline?: string | null
          id?: string
          objective?: string
          period?: string
          steps?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          accent_from: string | null
          accent_to: string | null
          cover_url: string | null
          created_at: string
          id: string
          lessons_count: number
          long_description: string | null
          name: string
          order_index: number
          short_description: string
          slug: string
        }
        Insert: {
          accent_from?: string | null
          accent_to?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          lessons_count?: number
          long_description?: string | null
          name: string
          order_index: number
          short_description: string
          slug: string
        }
        Update: {
          accent_from?: string | null
          accent_to?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          lessons_count?: number
          long_description?: string | null
          name?: string
          order_index?: number
          short_description?: string
          slug?: string
        }
        Relationships: []
      }
      passport_badges: {
        Row: {
          created_at: string
          description: string
          icon_name: string
          id: string
          name: string
          requirement_type: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_name: string
          id?: string
          name: string
          requirement_type: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          name?: string
          requirement_type?: string
        }
        Relationships: []
      }
      passport_layers: {
        Row: {
          created_at: string
          description: string
          essence: string
          id: string
          image_url: string | null
          layer_number: number
          name: string
          order_index: number
          subtitle: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          essence: string
          id?: string
          image_url?: string | null
          layer_number: number
          name: string
          order_index?: number
          subtitle: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          essence?: string
          id?: string
          image_url?: string | null
          layer_number?: number
          name?: string
          order_index?: number
          subtitle?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      premium_levels: {
        Row: {
          cover_key: string
          created_at: string
          final_message: string | null
          id: string
          name: string
          objective: string
          order_index: number
          slug: string
          theme: string
          updated_at: string
        }
        Insert: {
          cover_key: string
          created_at?: string
          final_message?: string | null
          id?: string
          name: string
          objective: string
          order_index: number
          slug: string
          theme: string
          updated_at?: string
        }
        Update: {
          cover_key?: string
          created_at?: string
          final_message?: string | null
          id?: string
          name?: string
          objective?: string
          order_index?: number
          slug?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      premium_workshops: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          id: string
          level_id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          level_id: string
          order_index: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          level_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_workshops_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "premium_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          onboarded: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          onboarded?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarded?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      psalm_studies: {
        Row: {
          affirmation: string
          application: string
          completed: boolean
          completed_at: string | null
          created_at: string
          cycle: number
          decoding: string
          exercises: Json
          exercises_done: Json
          favorite: boolean
          id: string
          mission: string
          notes: string
          prayer: string
          psalm_number: number
          psalm_text: string
          reflection: Json
          study_date: string
          subtitle: string
          theme: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          affirmation?: string
          application?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          cycle?: number
          decoding?: string
          exercises?: Json
          exercises_done?: Json
          favorite?: boolean
          id?: string
          mission?: string
          notes?: string
          prayer?: string
          psalm_number: number
          psalm_text?: string
          reflection?: Json
          study_date: string
          subtitle?: string
          theme?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          affirmation?: string
          application?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          cycle?: number
          decoding?: string
          exercises?: Json
          exercises_done?: Json
          favorite?: boolean
          id?: string
          mission?: string
          notes?: string
          prayer?: string
          psalm_number?: number
          psalm_text?: string
          reflection?: Json
          study_date?: string
          subtitle?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_layer_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          gamification_viewed: boolean
          id: string
          layer_id: string
          lesson_completed: boolean
          mission_completed: boolean
          points_earned: number
          protocol_completed: boolean
          reflection_content: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          gamification_viewed?: boolean
          id?: string
          layer_id: string
          lesson_completed?: boolean
          mission_completed?: boolean
          points_earned?: number
          protocol_completed?: boolean
          reflection_content?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          gamification_viewed?: boolean
          id?: string
          layer_id?: string
          lesson_completed?: boolean
          mission_completed?: boolean
          points_earned?: number
          protocol_completed?: boolean
          reflection_content?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_layer_progress_layer_id_fkey"
            columns: ["layer_id"]
            isOneToOne: false
            referencedRelation: "passport_layers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_level_progress: {
        Row: {
          created_at: string
          id: string
          last_accessed_at: string | null
          level_id: string
          percent: number
          updated_at: string
          user_id: string
          workshops_completed: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          level_id: string
          percent?: number
          updated_at?: string
          user_id: string
          workshops_completed?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          level_id?: string
          percent?: number
          updated_at?: string
          user_id?: string
          workshops_completed?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_level_progress_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "premium_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_progress: {
        Row: {
          id: string
          last_accessed_at: string
          lessons_completed: number
          module_id: string
          percent: number
          user_id: string
        }
        Insert: {
          id?: string
          last_accessed_at?: string
          lessons_completed?: number
          module_id: string
          percent?: number
          user_id: string
        }
        Update: {
          id?: string
          last_accessed_at?: string
          lessons_completed?: number
          module_id?: string
          percent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_passport_badges: {
        Row: {
          badge_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_passport_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "passport_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workshop_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
          workshop_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          workshop_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workshop_progress_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "premium_workshops"
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
      hero_archetype_name:
        | "inocente"
        | "orfao"
        | "guerreiro"
        | "altruista"
        | "nomade"
        | "mago"
      hero_archetype_status:
        | "locked"
        | "available"
        | "in_progress"
        | "completed"
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
    Enums: {
      hero_archetype_name: [
        "inocente",
        "orfao",
        "guerreiro",
        "altruista",
        "nomade",
        "mago",
      ],
      hero_archetype_status: [
        "locked",
        "available",
        "in_progress",
        "completed",
      ],
    },
  },
} as const
