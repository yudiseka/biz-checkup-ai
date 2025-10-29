import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, MessageSquare } from "lucide-react";
import { CompanyInfo } from "@/components/report/CompanyInfo";
import { ScoreSection } from "@/components/report/ScoreSection";
import { AnalysisSection } from "@/components/report/AnalysisSection";
import { CTASection } from "@/components/report/CTASection";

const Report = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setAssessment(data);

        // Poll for analysis if not yet available
        if (!data.ai_analysis) {
          const pollInterval = setInterval(async () => {
            const { data: updatedData } = await supabase
              .from('assessments')
              .select('ai_analysis')
              .eq('id', id)
              .single();

            if (updatedData?.ai_analysis) {
              setAssessment((prev: any) => ({ ...prev, ai_analysis: updatedData.ai_analysis }));
              clearInterval(pollInterval);
            }
          }, 3000);

          // Stop polling after 60 seconds
          setTimeout(() => clearInterval(pollInterval), 60000);
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Report Tidak Ditemukan</h2>
          <p className="text-muted-foreground">Assessment dengan ID tersebut tidak ditemukan.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Laporan Penilaian Perusahaan
          </h1>
          <p className="text-muted-foreground">Business Checkup Report</p>
        </div>

        <div className="space-y-6">
          <CompanyInfo assessment={assessment} />
          <ScoreSection assessment={assessment} />
          <AnalysisSection analysis={assessment.ai_analysis} />
          <CTASection />
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="lg"
          >
            <FileText className="w-4 h-4 mr-2" />
            Cetak / Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
