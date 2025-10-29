import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface ScoreSectionProps {
  assessment: any;
}

export const ScoreSection = ({ assessment }: ScoreSectionProps) => {
  const calculateScore = (field: string, type: 'radio' | 'checkbox', totalItems?: number): number => {
    try {
      const value = assessment[field];
      if (!value) return 0;
      
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      
      if (type === 'radio') {
        // Radio options have predefined scores
        const optionScores: Record<string, number> = {
          'Sudah ada dan terdokumentasi dengan baik': 3,
          'Ada tapi belum terdokumentasi dengan baik': 2,
          'Belum ada': 1,
          'Sudah ada dan jelas': 3,
          'Ada tapi kurang jelas': 2,
          'Sudah terbagi dengan jelas': 3,
          'Sudah ada tapi belum optimal': 2,
          'Belum ada pembagian': 1,
          'Semua staff paham dan ada dokumen tertulis': 3,
          'Sebagian paham tapi belum terdokumentasi': 2,
          'Belum ada job description': 1,
          'Ada sistem kontrol yang jelas dan rutin': 3,
          'Ada tapi tidak konsisten': 2,
          'Belum ada sistem kontrol': 1,
          'Menggunakan tools digital yang terstruktur': 3,
          'Menggunakan tools sederhana (Excel, WhatsApp)': 2,
          'Belum menggunakan tools khusus': 1,
          'Sudah ada sistem kode yang terstruktur': 3,
          'Ada kode tapi belum sistematis': 2,
          'Belum ada sistem kode': 1,
          'Sudah tertata rapi dan ada penandaan lokasi': 3,
          'Ada pengaturan tapi belum optimal': 2,
          'Belum ada pengaturan khusus': 1,
          'Lengkap (rak, forklift/hand pallet, dll)': 3,
          'Sebagian ada tapi belum lengkap': 2,
          'Belum ada peralatan khusus': 1,
          'Menggunakan sistem digital yang terintegrasi': 3,
          'Ada pencatatan manual atau Excel': 2,
          'Belum ada pencatatan rutin': 1,
          'Sudah ada sistem perhitungan yang jelas': 3,
          'Ada tapi berdasarkan perkiraan saja': 2,
          'Belum ada sistem buffer stock': 1,
          'Tercatat lengkap dengan detail dan penyusutan': 3,
          'Tercatat tapi belum detail': 2,
          'Belum ada pencatatan khusus': 1,
          'Menggunakan software akuntansi profesional': 3,
          'Menggunakan Excel atau software sederhana': 2,
          'Belum menggunakan software khusus': 1,
          'Lengkap dan rutin (Laba Rugi, Neraca, Arus Kas)': 3,
          'Ada tapi belum lengkap atau tidak rutin': 2,
          'Belum ada laporan keuangan formal': 1,
          'Sudah ada dan terstruktur sesuai standar': 3,
          'Ada tapi belum terstruktur dengan baik': 2,
          'Belum ada COA': 1,
          'Sudah terklasifikasi dengan detail (kategori, TOP, limit)': 3,
          'Ada klasifikasi sederhana': 2,
          'Belum ada klasifikasi': 1
        };
        
        return optionScores[parsed.value] || 0;
      } else {
        // Checkbox: score based on percentage of items checked
        const checkedCount = parsed.checked?.length || 0;
        const total = totalItems || 5;
        const percentage = (checkedCount / total) * 100;
        
        // Convert to 1-3 scale
        if (percentage >= 75) return 3;
        if (percentage >= 40) return 2;
        return 1;
      }
    } catch {
      return 0;
    }
  };

  const scoreCategories = [
    {
      label: "Struktur Organisasi & Manajemen",
      fields: [
        'vision_mission_culture',
        'written_org_structure',
        'department_division',
        'job_description_understanding',
        'work_control_update',
        'task_management_tools'
      ],
      type: 'radio' as const
    },
    {
      label: "Standard Operating Procedure",
      fields: [
        { field: 'sop_purchasing_status', items: 5 },
        { field: 'sop_production_status', items: 5 },
        { field: 'sop_sales_status', items: 5 },
        { field: 'sop_financial_status', items: 5 },
        { field: 'sop_inventory_status', items: 5 },
        { field: 'sop_human_dev_status', items: 5 }
      ],
      type: 'checkbox' as const
    },
    {
      label: "Dokumen Bisnis",
      fields: [
        { field: 'doc_purchasing_status', items: 5 },
        { field: 'doc_production_status', items: 5 },
        { field: 'doc_sales_status', items: 5 },
        { field: 'doc_financial_status', items: 5 },
        { field: 'doc_inventory_status', items: 5 }
      ],
      type: 'checkbox' as const
    },
    {
      label: "Manajemen Persediaan & Aset",
      fields: [
        'inventory_code_category',
        'warehouse_layout',
        'warehouse_equipment',
        'stock_card',
        'buffer_stock_reorder',
        'fixed_asset_recording'
      ],
      type: 'radio' as const
    },
    {
      label: "Sistem Keuangan dan Analisis",
      fields: [
        'financial_software',
        'financial_reports',
        'coa',
        'customer_supplier_classification'
      ],
      type: 'radio' as const
    }
  ];

  const calculateCategoryScore = (category: typeof scoreCategories[0]): number => {
    let totalScore = 0;
    let count = 0;

    category.fields.forEach((field) => {
      if (typeof field === 'string') {
        totalScore += calculateScore(field, category.type);
        count++;
      } else {
        totalScore += calculateScore(field.field, category.type, field.items);
        count++;
      }
    });

    return count > 0 ? Math.round((totalScore / (count * 3)) * 100) : 0;
  };

  const categoryScores = scoreCategories.map(cat => ({
    label: cat.label,
    score: calculateCategoryScore(cat)
  }));

  const averageScore = Math.round(
    categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Skor Assessment</h2>
      </div>

      <div className="mb-8 text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Skor Keseluruhan</p>
        <p className={`text-5xl font-bold ${getScoreColor(averageScore)}`}>
          {averageScore}%
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {averageScore >= 75 ? "Sangat Baik" : averageScore >= 50 ? "Cukup Baik" : "Perlu Perbaikan"}
        </p>
      </div>

      <div className="space-y-4">
        {categoryScores.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{category.label}</p>
              <p className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                {category.score}%
              </p>
            </div>
            <Progress value={category.score} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
