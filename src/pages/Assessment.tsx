import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CompanyDataForm } from "@/components/assessment/CompanyDataForm";
import { OrganizationForm } from "@/components/assessment/OrganizationForm";
import { SOPForm } from "@/components/assessment/SOPForm";
import { DocumentForm } from "@/components/assessment/DocumentForm";
import { InventoryForm } from "@/components/assessment/InventoryForm";
import { FinancialForm } from "@/components/assessment/FinancialForm";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const Assessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reviewer_name: "",
    reviewer_position: "",
    reviewer_email: "",
    reviewer_whatsapp: "",
    business_field: "",
    domicile: "",
    num_branches: 1,
    num_warehouses: 1,
    num_office_staff: 1,
    num_operational_staff: 1,
    accounting_software: "",
    tax_status: "",
    monthly_revenue: "",
    vision_mission_culture: "",
    written_org_structure: "",
    department_division: "",
    job_description_understanding: "",
    work_control_update: "",
    task_management_tools: "",
    org_structure_score: 30,
    job_description_score: 30,
    sop_purchasing_status: "",
    sop_purchasing_score: 30,
    sop_production_status: "",
    sop_production_score: 30,
    sop_sales_status: "",
    sop_sales_score: 30,
    sop_financial_status: "",
    sop_financial_score: 30,
    sop_inventory_status: "",
    sop_inventory_score: 30,
    sop_human_dev_status: "",
    sop_human_dev_score: 30,
    doc_purchasing_status: "",
    doc_purchasing_score: 30,
    doc_production_status: "",
    doc_production_score: 30,
    doc_sales_status: "",
    doc_sales_score: 30,
    doc_financial_status: "",
    doc_financial_score: 30,
    doc_inventory_status: "",
    doc_inventory_score: 30,
    inventory_code_category: "",
    warehouse_layout: "",
    warehouse_equipment: "",
    stock_card: "",
    buffer_stock_reorder: "",
    fixed_asset_recording: "",
    inventory_mgmt_score: 30,
    asset_mgmt_score: 30,
    financial_software: "",
    financial_reports: "",
    coa: "",
    customer_supplier_classification: "",
    financial_recording_score: 30,
    financial_analysis_score: 30,
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Assessment berhasil disimpan!");
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-recommendations',
        { body: { assessmentData: formData } }
      );

      if (functionError) {
        console.error('Error generating recommendations:', functionError);
      } else if (functionData?.recommendations) {
        await supabase
          .from('assessments')
          .update({ ai_recommendations: functionData.recommendations })
          .eq('id', data.id);
      }

      navigate(`/report/${data.id}`);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error("Gagal menyimpan assessment. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CompanyDataForm formData={formData} setFormData={setFormData} />;
      case 2:
        return <OrganizationForm formData={formData} setFormData={setFormData} />;
      case 3:
        return <SOPForm formData={formData} setFormData={setFormData} />;
      case 4:
        return <DocumentForm formData={formData} setFormData={setFormData} />;
      case 5:
        return <InventoryForm formData={formData} setFormData={setFormData} />;
      case 6:
        return <FinancialForm formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Business Checkup
          </h1>
          <p className="text-muted-foreground">
            Langkah {currentStep} dari {totalSteps}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-6 shadow-lg">
          {renderStepContent()}
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Sebelumnya
          </Button>
          
          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Submit & Generate Report"
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Selanjutnya
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
