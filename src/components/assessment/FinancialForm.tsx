import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface FinancialFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FinancialForm = ({ formData, setFormData }: FinancialFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const financialItems = [
    {
      label: "Software Keuangan",
      field: "financial_software",
      options: [
        { value: "Menggunakan software akuntansi profesional", score: 3 },
        { value: "Menggunakan Excel atau software sederhana", score: 2 },
        { value: "Belum menggunakan software khusus", score: 1 }
      ]
    },
    {
      label: "Laporan Keuangan",
      field: "financial_reports",
      options: [
        { value: "Lengkap dan rutin (Laba Rugi, Neraca, Arus Kas)", score: 3 },
        { value: "Ada tapi belum lengkap atau tidak rutin", score: 2 },
        { value: "Belum ada laporan keuangan formal", score: 1 }
      ]
    },
    {
      label: "Chart of Account (COA)",
      field: "coa",
      options: [
        { value: "Sudah ada dan terstruktur sesuai standar", score: 3 },
        { value: "Ada tapi belum terstruktur dengan baik", score: 2 },
        { value: "Belum ada COA", score: 1 }
      ]
    },
    {
      label: "Klasifikasi Customer/Supplier",
      field: "customer_supplier_classification",
      options: [
        { value: "Sudah terklasifikasi dengan detail (kategori, TOP, limit)", score: 3 },
        { value: "Ada klasifikasi sederhana", score: 2 },
        { value: "Belum ada klasifikasi", score: 1 }
      ]
    }
  ];

  const parseValue = (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return { value: value, description: '' };
      }
    }
    return value || { value: '', description: '' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Sistem Keuangan dan Analisis</h2>
        <p className="text-muted-foreground mb-6">Pilih kondisi yang paling sesuai dengan bisnis Anda</p>
      </div>

      {financialItems.map((item) => {
        const currentValue = parseValue(formData[item.field]);
        
        return (
          <Card key={item.field} className="p-4">
            <div className="space-y-4">
              <Label className="text-base font-semibold">{item.label} *</Label>
              
              <RadioGroup
                value={currentValue.value}
                onValueChange={(value) => 
                  handleChange(item.field, JSON.stringify({ ...currentValue, value }))
                }
              >
                {item.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${item.field}-${option.value}`} />
                    <Label htmlFor={`${item.field}-${option.value}`} className="font-normal cursor-pointer">
                      {option.value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor={`${item.field}-desc`} className="text-sm text-muted-foreground">
                  Keterangan Kondisi di Bisnis Anda (Opsional)
                </Label>
                <Textarea
                  id={`${item.field}-desc`}
                  value={currentValue.description || ''}
                  onChange={(e) => 
                    handleChange(item.field, JSON.stringify({ ...currentValue, description: e.target.value }))
                  }
                  placeholder="Jelaskan kondisi lebih detail jika diperlukan..."
                  rows={2}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
