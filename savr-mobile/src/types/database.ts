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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      equipment: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_electric: boolean | null
          name: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_electric?: boolean | null
          name?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_electric?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      ingredient_units: {
        Row: {
          id: string
          ingredient_id: string
          is_default: boolean | null
          unit: string | null
        }
        Insert: {
          id?: string
          ingredient_id?: string
          is_default?: boolean | null
          unit?: string | null
        }
        Update: {
          id?: string
          ingredient_id?: string
          is_default?: boolean | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Ingredient_Units_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_perishable: boolean | null
          name: string
          shelf_life_days: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_perishable?: boolean | null
          name: string
          shelf_life_days?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_perishable?: boolean | null
          name?: string
          shelf_life_days?: number | null
        }
        Relationships: []
      }
      inventory_events: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          quantity_delta: number | null
          user_inventory: string
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          quantity_delta?: number | null
          user_inventory?: string
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          quantity_delta?: number | null
          user_inventory?: string
        }
        Relationships: [
          {
            foreignKeyName: "Inventory_Events_user_inventory_fkey"
            columns: ["user_inventory"]
            isOneToOne: false
            referencedRelation: "user_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_equipment: {
        Row: {
          equipment_id: string | null
          id: string
          is_optional: boolean | null
          notes: string | null
          quantity: number | null
          recipe_id: string
          size: string | null
        }
        Insert: {
          equipment_id?: string | null
          id?: string
          is_optional?: boolean | null
          notes?: string | null
          quantity?: number | null
          recipe_id?: string
          size?: string | null
        }
        Update: {
          equipment_id?: string | null
          id?: string
          is_optional?: boolean | null
          notes?: string | null
          quantity?: number | null
          recipe_id?: string
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Recipe_Equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Recipe_Equipment_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string | null
          is_optional: boolean | null
          quantity: number | null
          recipe_id: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          is_optional?: boolean | null
          quantity?: number | null
          recipe_id?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          is_optional?: boolean | null
          quantity?: number | null
          recipe_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Recipe_Ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Recipe_Ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_steps: {
        Row: {
          created_at: string | null
          estimated_duration_seconds: number | null
          id: string
          instruction_text: string | null
          overlay_text: string | null
          recipe_id: string
          step_number: number | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_duration_seconds?: number | null
          id?: string
          instruction_text?: string | null
          overlay_text?: string | null
          recipe_id?: string
          step_number?: number | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_duration_seconds?: number | null
          id?: string
          instruction_text?: string | null
          overlay_text?: string | null
          recipe_id?: string
          step_number?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Recipe_Steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag_id: string
        }
        Insert: {
          recipe_id?: string
          tag_id?: string
        }
        Update: {
          recipe_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Recipe_Tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Recipe_Tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_time_minutes: number | null
          created_at: string | null
          description: string | null
          id: string
          prep_time_minutes: number | null
          servings: number | null
          skill_level: number | null
          title: string
          total_time_minutes: number | null
        }
        Insert: {
          cook_time_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          prep_time_minutes?: number | null
          servings?: number | null
          skill_level?: number | null
          title: string
          total_time_minutes?: number | null
        }
        Update: {
          cook_time_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          prep_time_minutes?: number | null
          servings?: number | null
          skill_level?: number | null
          title?: string
          total_time_minutes?: number | null
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          created_at: string | null
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          recipe_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Saved_Recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Saved_Recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          type: string | null
        }
        Insert: {
          id?: string
          name?: string
          type?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      user_equipment: {
        Row: {
          created_at: string | null
          equipment_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Equipment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_inventory: {
        Row: {
          acquired_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          ingredient_id: string
          quantity: number | null
          source: string | null
          unit: string | null
          user_id: string
        }
        Insert: {
          acquired_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ingredient_id?: string
          quantity?: number | null
          source?: string | null
          unit?: string | null
          user_id?: string
        }
        Update: {
          acquired_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ingredient_id?: string
          quantity?: number | null
          source?: string | null
          unit?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Inventory_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          dietary_preferences: string | null
          dislikes: string | null
          id: string
          max_cook_time_minutes: number | null
          skill_level: number | null
          spice_tolerance: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dietary_preferences?: string | null
          dislikes?: string | null
          id?: string
          max_cook_time_minutes?: number | null
          skill_level?: number | null
          spice_tolerance?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dietary_preferences?: string | null
          dislikes?: string | null
          id?: string
          max_cook_time_minutes?: number | null
          skill_level?: number | null
          spice_tolerance?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipe_actions: {
        Row: {
          action_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          recipe_id: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipe_id?: string | null
          source?: string | null
          user_id?: string
        }
        Update: {
          action_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipe_id?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Recipe_Actions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Recipe_Actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_username: { Args: never; Returns: string }
      get_random_recipes: {
        Args: { recipe_limit: number }
        Returns: {
          cook_time_minutes: number | null
          created_at: string | null
          description: string | null
          id: string
          prep_time_minutes: number | null
          servings: number | null
          skill_level: number | null
          title: string
          total_time_minutes: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "recipes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      resolve_phone_email: { Args: { p_phone: string }; Returns: string }
      resolve_username_email: { Args: { p_username: string }; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
