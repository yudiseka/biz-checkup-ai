-- Create assessments table to store all business checkup data
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Reviewer & Company Data
  reviewer_name TEXT NOT NULL,
  reviewer_position TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  reviewer_whatsapp TEXT NOT NULL,
  business_field TEXT NOT NULL,
  domicile TEXT NOT NULL,
  num_branches INTEGER NOT NULL,
  num_warehouses INTEGER NOT NULL,
  num_office_staff INTEGER NOT NULL,
  num_operational_staff INTEGER NOT NULL,
  accounting_software TEXT NOT NULL,
  tax_status TEXT NOT NULL,
  monthly_revenue TEXT NOT NULL,
  
  -- Organizational Structure & Management
  vision_mission_culture TEXT NOT NULL,
  written_org_structure TEXT NOT NULL,
  department_division TEXT NOT NULL,
  job_description_understanding TEXT NOT NULL,
  work_control_update TEXT NOT NULL,
  task_management_tools TEXT NOT NULL,
  org_structure_score INTEGER NOT NULL,
  job_description_score INTEGER NOT NULL,
  
  -- SOPs
  sop_purchasing_status TEXT NOT NULL,
  sop_purchasing_score INTEGER NOT NULL,
  sop_production_status TEXT NOT NULL,
  sop_production_score INTEGER NOT NULL,
  sop_sales_status TEXT NOT NULL,
  sop_sales_score INTEGER NOT NULL,
  sop_financial_status TEXT NOT NULL,
  sop_financial_score INTEGER NOT NULL,
  sop_inventory_status TEXT NOT NULL,
  sop_inventory_score INTEGER NOT NULL,
  sop_human_dev_status TEXT NOT NULL,
  sop_human_dev_score INTEGER NOT NULL,
  
  -- Documents
  doc_purchasing_status TEXT NOT NULL,
  doc_purchasing_score INTEGER NOT NULL,
  doc_production_status TEXT NOT NULL,
  doc_production_score INTEGER NOT NULL,
  doc_sales_status TEXT NOT NULL,
  doc_sales_score INTEGER NOT NULL,
  doc_financial_status TEXT NOT NULL,
  doc_financial_score INTEGER NOT NULL,
  doc_inventory_status TEXT NOT NULL,
  doc_inventory_score INTEGER NOT NULL,
  
  -- Inventory & Asset Management
  inventory_code_category TEXT NOT NULL,
  warehouse_layout TEXT NOT NULL,
  warehouse_equipment TEXT NOT NULL,
  stock_card TEXT NOT NULL,
  buffer_stock_reorder TEXT NOT NULL,
  fixed_asset_recording TEXT NOT NULL,
  inventory_mgmt_score INTEGER NOT NULL,
  asset_mgmt_score INTEGER NOT NULL,
  
  -- Financial System & Analysis
  financial_software TEXT NOT NULL,
  financial_reports TEXT NOT NULL,
  coa TEXT NOT NULL,
  customer_supplier_classification TEXT NOT NULL,
  financial_recording_score INTEGER NOT NULL,
  financial_analysis_score INTEGER NOT NULL,
  
  -- AI Generated Recommendations
  ai_recommendations TEXT
);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert assessments (public form)
CREATE POLICY "Anyone can insert assessments" 
ON public.assessments 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to read assessments (for viewing their own report)
CREATE POLICY "Anyone can view assessments" 
ON public.assessments 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();