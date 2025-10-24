-- Remove all score columns and update ai_recommendations to store structured analysis
ALTER TABLE assessments 
DROP COLUMN IF EXISTS org_structure_score,
DROP COLUMN IF EXISTS job_description_score,
DROP COLUMN IF EXISTS sop_purchasing_score,
DROP COLUMN IF EXISTS sop_production_score,
DROP COLUMN IF EXISTS sop_sales_score,
DROP COLUMN IF EXISTS sop_financial_score,
DROP COLUMN IF EXISTS sop_inventory_score,
DROP COLUMN IF EXISTS sop_human_dev_score,
DROP COLUMN IF EXISTS doc_purchasing_score,
DROP COLUMN IF EXISTS doc_production_score,
DROP COLUMN IF EXISTS doc_sales_score,
DROP COLUMN IF EXISTS doc_financial_score,
DROP COLUMN IF EXISTS doc_inventory_score,
DROP COLUMN IF EXISTS inventory_mgmt_score,
DROP COLUMN IF EXISTS asset_mgmt_score,
DROP COLUMN IF EXISTS financial_recording_score,
DROP COLUMN IF EXISTS financial_analysis_score;

-- Rename ai_recommendations to ai_analysis to better reflect structured content
ALTER TABLE assessments 
RENAME COLUMN ai_recommendations TO ai_analysis;