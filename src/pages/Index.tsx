import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, BarChart3, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Business Checkup
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Analisis Mendalam Kondisi Bisnis Anda dalam 6 Langkah Mudah
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/assessment')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
            >
              <ClipboardCheck className="w-5 h-5 mr-2" />
              Mulai Assessment Gratis
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Business Checkup?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analisis Komprehensif</h3>
              <p className="text-muted-foreground">
                Evaluasi mendalam struktur organisasi, SOP, dokumentasi, inventory, dan sistem keuangan bisnis Anda
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rekomendasi AI</h3>
              <p className="text-muted-foreground">
                Dapatkan rekomendasi yang disesuaikan dengan bidang usaha dan kondisi spesifik bisnis Anda
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Laporan Professional</h3>
              <p className="text-muted-foreground">
                Laporan lengkap dengan scoring dan rekomendasi actionable untuk pengembangan bisnis
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Mengecek Kesehatan Bisnis Anda?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Proses assessment hanya memakan waktu 10-15 menit
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/assessment')}
            className="text-lg px-8 py-6 h-auto"
          >
            Mulai Sekarang
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
