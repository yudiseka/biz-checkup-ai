import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, MessageSquare } from "lucide-react";

export const CTASection = () => {
  const whatsappLink = "https://api.whatsapp.com/send?phone=6282229993586&text=Halo%20Regina%2C%20saya%20telah%20cek%20kondisi%20bisnis%20saya%2C%20ada%20masalah%20yang%20ingin%20saya%20tanyakan!";

  return (
    <Card className="p-8 bg-gradient-to-br from-destructive/10 via-background to-primary/10 border-2">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/20 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold">Merasa Kewalahan dengan Hasil Checkup?</h3>
          
          <p className="text-muted-foreground leading-relaxed">
            Memahami kondisi bisnis Anda adalah langkah pertama yang penting. Namun, 
            <span className="font-semibold text-foreground"> mengimplementasikan rekomendasi yang tepat</span> membutuhkan 
            keahlian dan pengalaman khusus.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Tanpa bimbingan yang tepat, Anda mungkin akan:
          </p>

          <ul className="text-left max-w-xl mx-auto space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-1">✗</span>
              <span>Kesulitan menentukan prioritas perbaikan yang paling urgent</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-1">✗</span>
              <span>Menghabiskan waktu dan biaya untuk solusi yang tidak tepat sasaran</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-1">✗</span>
              <span>Melakukan trial and error yang dapat mengganggu operasional bisnis</span>
            </li>
          </ul>

          <div className="pt-6">
            <p className="text-lg font-semibold mb-4">
              Biarkan Kami Membantu Anda Mewujudkan Bisnis yang Lebih Terstruktur dan Profitable!
            </p>
            
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-lg px-8 py-6 h-auto"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Konsultasi dengan Expert Sekarang
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Dapatkan solusi yang disesuaikan dengan kondisi spesifik bisnis Anda
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
