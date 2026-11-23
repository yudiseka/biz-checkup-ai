import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { CompanyInfo } from "@/components/report/CompanyInfo";
import { ScoreSection } from "@/components/report/ScoreSection";
import { AnalysisSection } from "@/components/report/AnalysisSection";
import { CTASection } from "@/components/report/CTASection";

const Report = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const aiPending = searchParams.get('ai') === 'pending';
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiError, setAiError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const retryRef = useRef(0);

  useEffect(() => {
    let alive = true;
    let pollInterval: number | undefined;
    let timeoutId: number | undefined;

    const tryGenerate = async (row: any) => {
      if (retryRef.current >= 2) return;
      retryRef.current += 1;
      setRetrying(true);
      try {
        await supabase.functions.invoke('generate-recommendations', {
          body: { assessmentData: row }
        });
      } catch (e) {
        console.error('Retry AI gagal:', e);
      } finally {
        if (alive) setRetrying(false);
      }
    };

    const fetchAssessment = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!alive) return;
        setAssessment(data);

        if (!data.ai_analysis) {
          if (aiPending) await tryGenerate(data);

          // Ambil ulang setelah retry
          const { data: refreshed } = await supabase
            .from('assessments')
            .select('ai_analysis')
            .eq('id', id)
            .single();
          if (refreshed?.ai_analysis && alive) {
            setAssessment((prev: any) => ({ ...prev, ai_analysis: refreshed.ai_analysis }));
            return;
          }

          // Poll tiap 3 detik, maks 90 detik (lebih singkat dari 3 menit)
          pollInterval = window.setInterval(async () => {
            const { data: updated } = await supabase
              .from('assessments')
              .select('ai_analysis')
              .eq('id', id)
              .single();
            if (updated?.ai_analysis && alive) {
              setAssessment((prev: any) => ({ ...prev, ai_analysis: updated.ai_analysis }));
              if (pollInterval) clearInterval(pollInterval);
              if (timeoutId) clearTimeout(timeoutId);
            }
          }, 3000);

          timeoutId = window.setTimeout(() => {
            if (pollInterval) clearInterval(pollInterval);
            if (alive) setAiError(true);
          }, 90000);
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (id) fetchAssessment();
    return () => {
      alive = false;
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id, aiPending]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {retrying ? 'Membuat analisis AI...' : 'Memuat laporan...'}
        </p>
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

        {aiError && !assessment.ai_analysis && (
          <Card className="p-5 mb-6 border-amber-300 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">Analisis AI belum selesai</p>
                <p className="text-sm text-amber-800 mt-1">
                  Data assessment Anda sudah tersimpan aman. Analisis sedang antre dan biasanya
                  selesai dalam beberapa menit. Silakan refresh halaman ini nanti — laporan akan
                  otomatis lengkap dengan sendirinya.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Coba muat ulang
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          <CompanyInfo assessment={assessment} />
          <ScoreSection assessment={assessment} />
          <AnalysisSection analysis={assessment.ai_analysis} />
          <CTASection />
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => window.print()} variant="outline" size="lg">
            <FileText className="w-4 h-4 mr-2" />
            Cetak / Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
