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
      careers: {
        Row: {
          created_at: string
          demand_outlook: string | null
          entry_roles: Json
          id: string
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          related_course_slugs: string[]
          related_skill_slugs: string[]
          salary_band_max: number | null
          salary_band_min: number | null
          salary_currency: string
          sector: string | null
          slug: string
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          summary: string | null
          timeline_steps: Json
          title: string
          typical_work: Json
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          demand_outlook?: string | null
          entry_roles?: Json
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          related_course_slugs?: string[]
          related_skill_slugs?: string[]
          salary_band_max?: number | null
          salary_band_min?: number | null
          salary_currency?: string
          sector?: string | null
          slug: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          summary?: string | null
          timeline_steps?: Json
          title: string
          typical_work?: Json
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          demand_outlook?: string | null
          entry_roles?: Json
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          related_course_slugs?: string[]
          related_skill_slugs?: string[]
          salary_band_max?: number | null
          salary_band_min?: number | null
          salary_currency?: string
          sector?: string | null
          slug?: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          summary?: string | null
          timeline_steps?: Json
          title?: string
          typical_work?: Json
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          consent_type: string
          consent_version: string
          context: Json | null
          created_at: string
          granted: boolean
          id: string
          user_id: string
        }
        Insert: {
          consent_type: string
          consent_version?: string
          context?: Json | null
          created_at?: string
          granted?: boolean
          id?: string
          user_id: string
        }
        Update: {
          consent_type?: string
          consent_version?: string
          context?: Json | null
          created_at?: string
          granted?: boolean
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          accreditation: string | null
          careers: string[] | null
          category: string | null
          city: string | null
          cost: string | null
          created_at: string
          delivery_mode: string | null
          duration: string | null
          funding: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          nqf: number | null
          province: string | null
          qualification: string | null
          qualification_id: string | null
          slug: string
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          accreditation?: string | null
          careers?: string[] | null
          category?: string | null
          city?: string | null
          cost?: string | null
          created_at?: string
          delivery_mode?: string | null
          duration?: string | null
          funding?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          nqf?: number | null
          province?: string | null
          qualification?: string | null
          qualification_id?: string | null
          slug: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          accreditation?: string | null
          careers?: string[] | null
          category?: string | null
          city?: string | null
          cost?: string | null
          created_at?: string
          delivery_mode?: string | null
          duration?: string | null
          funding?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          nqf?: number | null
          province?: string | null
          qualification?: string | null
          qualification_id?: string | null
          slug?: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "courses_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      deadline_reminders: {
        Row: {
          channel: string
          created_at: string
          id: string
          item_slug: string
          item_type: string
          remind_at: string
          sent_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel?: string
          created_at?: string
          id?: string
          item_slug: string
          item_type: string
          remind_at: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          item_slug?: string
          item_type?: string
          remind_at?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funding_windows: {
        Row: {
          best_for: string | null
          coverage: string | null
          created_at: string
          deadline: string | null
          eligibility: string | null
          id: string
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          name: string
          provider: string | null
          short: string | null
          slug: string
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          best_for?: string | null
          coverage?: string | null
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          name: string
          provider?: string | null
          short?: string | null
          slug: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          best_for?: string | null
          coverage?: string | null
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          name?: string
          provider?: string | null
          short?: string | null
          slug?: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      guides: {
        Row: {
          body_markdown: string | null
          category: string | null
          created_at: string
          editorial_state: Database["public"]["Enums"]["editorial_state"]
          glossary: Json
          id: string
          key_points: Json
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          related_terms: Json
          slug: string
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          steps: Json
          summary: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          body_markdown?: string | null
          category?: string | null
          created_at?: string
          editorial_state?: Database["public"]["Enums"]["editorial_state"]
          glossary?: Json
          id?: string
          key_points?: Json
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          related_terms?: Json
          slug: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          steps?: Json
          summary?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          body_markdown?: string | null
          category?: string | null
          created_at?: string
          editorial_state?: Database["public"]["Enums"]["editorial_state"]
          glossary?: Json
          id?: string
          key_points?: Json
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          related_terms?: Json
          slug?: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          steps?: Json
          summary?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      institutions: {
        Row: {
          accreditation_status: string | null
          application_windows: Json | null
          campuses: Json | null
          created_at: string
          funding_notes: string | null
          id: string
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          name: string
          province: string | null
          register_links: Json | null
          slug: string
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          type: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website: string | null
        }
        Insert: {
          accreditation_status?: string | null
          application_windows?: Json | null
          campuses?: Json | null
          created_at?: string
          funding_notes?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          name: string
          province?: string | null
          register_links?: Json | null
          slug: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          type?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
        }
        Update: {
          accreditation_status?: string | null
          application_windows?: Json | null
          campuses?: Json | null
          created_at?: string
          funding_notes?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          name?: string
          province?: string | null
          register_links?: Json | null
          slug?: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          type?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
        }
        Relationships: []
      }
      learner_details: {
        Row: {
          aps: number | null
          budget_max_per_year: number | null
          created_at: string
          english_mark: number | null
          interests: string[]
          life_sciences_mark: number | null
          maths_mark: number | null
          nbt_completed: boolean
          preferred_delivery_mode: string | null
          preferred_study_mode: string | null
          subjects: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          aps?: number | null
          budget_max_per_year?: number | null
          created_at?: string
          english_mark?: number | null
          interests?: string[]
          life_sciences_mark?: number | null
          maths_mark?: number | null
          nbt_completed?: boolean
          preferred_delivery_mode?: string | null
          preferred_study_mode?: string | null
          subjects?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          aps?: number | null
          budget_max_per_year?: number | null
          created_at?: string
          english_mark?: number | null
          interests?: string[]
          life_sciences_mark?: number | null
          maths_mark?: number | null
          nbt_completed?: boolean
          preferred_delivery_mode?: string | null
          preferred_study_mode?: string | null
          subjects?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          category: string | null
          closing_date: string | null
          created_at: string
          description: string | null
          id: string
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          paid: string | null
          provider: string | null
          province: string | null
          sector: string | null
          slug: string | null
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          title: string
          type: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          category?: string | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          paid?: string | null
          provider?: string | null
          province?: string | null
          sector?: string | null
          slug?: string | null
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          title: string
          type?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          category?: string | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          paid?: string | null
          provider?: string | null
          province?: string | null
          sector?: string | null
          slug?: string | null
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          title?: string
          type?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          province: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          province?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          province?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          last_verified_at: string | null
          name: string
          nqf_level: number | null
          slug: string
          source_url: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          nqf_level?: number | null
          slug: string
          source_url?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          nqf_level?: number | null
          slug?: string
          source_url?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          item_slug: string
          item_type: Database["public"]["Enums"]["saved_item_type"]
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_slug: string
          item_type: Database["public"]["Enums"]["saved_item_type"]
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_slug?: string
          item_type?: Database["public"]["Enums"]["saved_item_type"]
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      skill_progress: {
        Row: {
          completed_at: string | null
          completed_steps: number
          created_at: string
          id: string
          skill_slug: string
          status: string
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: number
          created_at?: string
          id?: string
          skill_slug: string
          status?: string
          total_steps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: number
          created_at?: string
          id?: string
          skill_slug?: string
          status?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          difficulty: string | null
          id: string
          last_verified_at: string | null
          moderation_state: Database["public"]["Enums"]["moderation_state"]
          practice_tasks: Json
          related_career_slugs: string[]
          related_course_slugs: string[]
          slug: string
          source_name: string | null
          source_url: string | null
          stale_after_days: number
          steps: Json
          summary: string | null
          time_estimate: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          practice_tasks?: Json
          related_career_slugs?: string[]
          related_course_slugs?: string[]
          slug: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          steps?: Json
          summary?: string | null
          time_estimate?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          id?: string
          last_verified_at?: string | null
          moderation_state?: Database["public"]["Enums"]["moderation_state"]
          practice_tasks?: Json
          related_career_slugs?: string[]
          related_course_slugs?: string[]
          slug?: string
          source_name?: string | null
          source_url?: string | null
          stale_after_days?: number
          steps?: Json
          summary?: string | null
          time_estimate?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          created_at: string
          id: string
          learner_name: string
          province: string | null
          quote: string
          role_or_school: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          id?: string
          learner_name: string
          province?: string | null
          quote: string
          role_or_school?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          id?: string
          learner_name?: string
          province?: string | null
          quote?: string
          role_or_school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_stale_catalogue_records: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "learner" | "counsellor" | "institution" | "admin"
      editorial_state: "draft" | "in_review" | "published" | "archived"
      moderation_state: "draft" | "submitted" | "approved" | "rejected"
      saved_item_type:
        | "course"
        | "career"
        | "institution"
        | "opportunity"
        | "funding"
        | "guide"
        | "skill"
      verification_status: "unverified" | "provisional" | "verified" | "stale"
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
      app_role: ["learner", "counsellor", "institution", "admin"],
      editorial_state: ["draft", "in_review", "published", "archived"],
      moderation_state: ["draft", "submitted", "approved", "rejected"],
      saved_item_type: [
        "course",
        "career",
        "institution",
        "opportunity",
        "funding",
        "guide",
        "skill",
      ],
      verification_status: ["unverified", "provisional", "verified", "stale"],
    },
  },
} as const
