import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface SOPFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const SOPForm = ({ formData, setFormData }: SOPFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const sopItems = [
    { label: "SOP Pembelian", statusField: "sop_purchasing_status", scoreField: "sop_purchasing_score" },
    { label: "SOP Produksi", statusField: "sop_production_status", scoreField: "sop_production_score" },
    { label: "SOP Penjualan", statusField: "sop_sales_status", scoreField: "sop_sales_score" },
    { label: "SOP Financial Management", statusField: "sop_financial_status", scoreField: "sop_financial_score" },
    { label: "SOP Inventory Management", statusField: "sop_inventory_status", scoreField: "sop_inventory_score" },
    { label: "SOP Human Development", statusField: "sop_human_dev_status", scoreField: "sop_human_dev_score" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Standard Operating Procedures (SOP)</h2>
        <p className="text-muted-foreground mb-6">Evaluasi ketersediaan dan kualitas SOP di berbagai area bisnis</p>
      </div>

      <div className="space-y-6">
        {sopItems.map((item, index) => (
          <Card key={index} className="p-4 border-l-4 border-l-primary">
            <h3 className="font-semibold mb-4">{item.label}</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={item.statusField}>Status / Keterangan *</Label>
                <Input
                  id={item.statusField}
                  value={formData[item.statusField]}
                  onChange={(e) => handleChange(item.statusField, e.target.value)}
                  placeholder="contoh: Tidak ada, Sebagian ada, Lengkap dan terupdate"
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
                <p className="text-sm text-muted-foreground">0 = Tidak ada, 100 = Lengkap dan terimplementasi sempurna</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
