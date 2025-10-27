import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!analysis) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95; // Cap at 95% until actual completion
          return prev + 1;
        });
      }, 1000); // Increment every second

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [analysis]);
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
        <div className="space-y-4 py-8">
          <div className="flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <p>Sedang menghasilkan analisis...</p>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">{progress}%</p>
          </div>
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
