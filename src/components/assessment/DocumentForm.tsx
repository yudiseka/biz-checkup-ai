import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface DocumentFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const DocumentForm = ({ formData, setFormData }: DocumentFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const documentItems = [
    { label: "Dokumen Pembelian", statusField: "doc_purchasing_status", scoreField: "doc_purchasing_score" },
    { label: "Dokumen Produksi", statusField: "doc_production_status", scoreField: "doc_production_score" },
    { label: "Dokumen Penjualan", statusField: "doc_sales_status", scoreField: "doc_sales_score" },
    { label: "Dokumen Financial Management", statusField: "doc_financial_status", scoreField: "doc_financial_score" },
    { label: "Dokumen Inventory Management", statusField: "doc_inventory_status", scoreField: "doc_inventory_score" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Dokumentasi Bisnis</h2>
        <p className="text-muted-foreground mb-6">Evaluasi kelengkapan dokumentasi di berbagai area bisnis</p>
      </div>

      <div className="space-y-6">
        {documentItems.map((item, index) => (
          <Card key={index} className="p-4 border-l-4 border-l-accent">
            <h3 className="font-semibold mb-4">{item.label}</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={item.statusField}>Status / Keterangan *</Label>
                <Input
                  id={item.statusField}
                  value={formData[item.statusField]}
                  onChange={(e) => handleChange(item.statusField, e.target.value)}
                  placeholder="contoh: Tidak ada, Sebagian ada, Lengkap dan tersimpan rapi"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Score: {formData[item.scoreField]}</Label>
                <Slider
                  value={[formData[item.scoreField]]}
                  onValueChange={([value]) => handleChange(item.scoreField, value)}
                  min={0}
                  max={100}
                  step={10}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground">0 = Tidak ada dokumentasi, 100 = Lengkap dan terarsip sempurna</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
