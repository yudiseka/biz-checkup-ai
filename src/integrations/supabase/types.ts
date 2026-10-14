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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          accounting_software: string
          ai_analysis: string | null
          buffer_stock_reorder: string
          business_field: string
          coa: string
          created_at: string
          customer_supplier_classification: string
          department_division: string
          doc_financial_status: string
          doc_inventory_status: string
          doc_production_status: string
          doc_purchasing_status: string
          doc_sales_status: string
          domicile: string
          financial_reports: string
          financial_software: string
          fixed_asset_recording: string
          id: string
          inventory_code_category: string
          job_description_understanding: string
          monthly_revenue: string
          num_branches: number
          num_office_staff: number
          num_operational_staff: number
          num_warehouses: number
          reviewer_email: string
          reviewer_name: string
          reviewer_position: string
          reviewer_whatsapp: string
          sop_financial_status: string
          sop_human_dev_status: string
          sop_inventory_status: string
          sop_production_status: string
          sop_purchasing_status: string
          sop_sales_status: string
          stock_card: string
          task_management_tools: string
          tax_status: string
          updated_at: string
          vision_mission_culture: string
          warehouse_equipment: string
          warehouse_layout: string
          work_control_update: string
          written_org_structure: string
        }
        Insert: {
          accounting_software: string
          ai_analysis?: string | null
          buffer_stock_reorder: string
          business_field: string
          coa: string
          created_at?: string
          customer_supplier_classification: string
          department_division: string
          doc_financial_status: string
          doc_inventory_status: string
          doc_production_status: string
          doc_purchasing_status: string
          doc_sales_status: string
          domicile: string
          financial_reports: string
          financial_software: string
          fixed_asset_recording: string
          id?: string
          inventory_code_category: string
          job_description_understanding: string
          monthly_revenue: string
          num_branches: number
          num_office_staff: number
          num_operational_staff: number
          num_warehouses: number
          reviewer_email: string
          reviewer_name: string
          reviewer_position: string
          reviewer_whatsapp: string
          sop_financial_status: string
          sop_human_dev_status: string
          sop_inventory_status: string
          sop_production_status: string
          sop_purchasing_status: string
          sop_sales_status: string
          stock_card: string
          task_management_tools: string
          tax_status: string
          updated_at?: string
          vision_mission_culture: string
          warehouse_equipment: string
          warehouse_layout: string
          work_control_update: string
          written_org_structure: string
        }
        Update: {
          accounting_software?: string
          ai_analysis?: string | null
          buffer_stock_reorder?: string
          business_field?: string
          coa?: string
          created_at?: string
          customer_supplier_classification?: string
          department_division?: string
          doc_financial_status?: string
          doc_inventory_status?: string
          doc_production_status?: string
          doc_purchasing_status?: string
          doc_sales_status?: string
          domicile?: string
          financial_reports?: string
          financial_software?: string
          fixed_asset_recording?: string
          id?: string
          inventory_code_category?: string
          job_description_understanding?: string
          monthly_revenue?: string
          num_branches?: number
          num_office_staff?: number
          num_operational_staff?: number
          num_warehouses?: number
          reviewer_email?: string
          reviewer_name?: string
          reviewer_position?: string
          reviewer_whatsapp?: string
          sop_financial_status?: string
          sop_human_dev_status?: string
          sop_inventory_status?: string
          sop_production_status?: string
          sop_purchasing_status?: string
          sop_sales_status?: string
          stock_card?: string
          task_management_tools?: string
          tax_status?: string
          updated_at?: string
          vision_mission_culture?: string
          warehouse_equipment?: string
          warehouse_layout?: string
          work_control_update?: string
          written_org_structure?: string
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
