import { Card } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";

interface RecommendationSectionProps {
  recommendations: string | null;
}

export const RecommendationSection = ({ recommendations }: RecommendationSectionProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold">Kesimpulan & Rekomendasi</h2>
      </div>

      {recommendations ? (
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {recommendations}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <p>Sedang menghasilkan rekomendasi...</p>
        </div>
      )}
    </Card>
  );
};
