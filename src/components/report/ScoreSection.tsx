import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface ScoreSectionProps {
  assessment: any;
}

export const ScoreSection = ({ assessment }: ScoreSectionProps) => {
  const scoreCategories = [
    { label: "Struktur Organisasi", score: assessment.org_structure_score },
    { label: "Job Description", score: assessment.job_description_score },
    { label: "SOP Pembelian", score: assessment.sop_purchasing_score },
    { label: "SOP Produksi", score: assessment.sop_production_score },
    { label: "SOP Penjualan", score: assessment.sop_sales_score },
    { label: "SOP Financial", score: assessment.sop_financial_score },
    { label: "SOP Inventory", score: assessment.sop_inventory_score },
    { label: "SOP Human Dev", score: assessment.sop_human_dev_score },
    { label: "Dokumen Pembelian", score: assessment.doc_purchasing_score },
    { label: "Dokumen Produksi", score: assessment.doc_production_score },
    { label: "Dokumen Penjualan", score: assessment.doc_sales_score },
    { label: "Dokumen Financial", score: assessment.doc_financial_score },
    { label: "Dokumen Inventory", score: assessment.doc_inventory_score },
    { label: "Inventory Management", score: assessment.inventory_mgmt_score },
    { label: "Asset Management", score: assessment.asset_mgmt_score },
    { label: "Sistem Pencatatan Keuangan", score: assessment.financial_recording_score },
    { label: "Analisa Laporan Keuangan", score: assessment.financial_analysis_score },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-accent";
    if (score >= 40) return "text-yellow-600";
    return "text-destructive";
  };

  const averageScore = Math.round(
    scoreCategories.reduce((acc, cat) => acc + cat.score, 0) / scoreCategories.length
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Skor Penilaian</h2>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-2">Rata-rata Skor Keseluruhan</p>
        <p className={`text-5xl font-bold ${getScoreColor(averageScore)}`}>
          {averageScore}
        </p>
        <p className="text-sm text-muted-foreground mt-2">dari 100</p>
      </div>

      <div className="space-y-4">
        {scoreCategories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{category.label}</span>
              <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                {category.score}/100
              </span>
            </div>
            <Progress value={category.score} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
