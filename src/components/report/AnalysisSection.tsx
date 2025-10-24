import { Card } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalysisItem {
  kategori: string;
  aspek: string;
  kondisi: string;
  pentingnya: string;
  rekomendasi: string;
}

interface AnalysisSectionProps {
  analysis: string | null;
}

export const AnalysisSection = ({ analysis }: AnalysisSectionProps) => {
  let parsedAnalysis: AnalysisItem[] = [];
  
  if (analysis) {
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (e) {
      console.error('Error parsing analysis:', e);
    }
  }

  // Group by category
  const groupedAnalysis = parsedAnalysis.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = [];
    }
    acc[item.kategori].push(item);
    return acc;
  }, {} as Record<string, AnalysisItem[]>);

  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold">Analisis & Rekomendasi</h2>
        </div>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <p>Sedang menghasilkan analisis...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold">Analisis & Rekomendasi</h2>
      </div>

      {Object.entries(groupedAnalysis).map(([kategori, items]) => (
        <Card key={kategori} className="p-6">
          <h3 className="text-xl font-bold mb-4 text-primary">{kategori}</h3>
          
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="space-y-3 pb-6 border-b last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-lg">{item.aspek}</h4>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Kondisi di Bisnis Anda:
                    </p>
                    <p className="text-foreground">{item.kondisi}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Mengapa Penting:
                    </p>
                    <p className="text-foreground">{item.pentingnya}</p>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <p className="text-sm font-medium mb-1">Rekomendasi:</p>
                      <p>{item.rekomendasi}</p>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
