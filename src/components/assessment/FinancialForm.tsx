import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FinancialFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FinancialForm = ({ formData, setFormData }: FinancialFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Sistem Keuangan & Analisis</h2>
        <p className="text-muted-foreground mb-6">Evaluasi sistem pencatatan dan analisis keuangan perusahaan</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="financial_software">Software Keuangan *</Label>
          <Input
            id="financial_software"
            value={formData.financial_software}
            onChange={(e) => handleChange('financial_software', e.target.value)}
            placeholder="contoh: Belum ada, Accurate, Zahir, dll"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="financial_reports">Laporan Keuangan *</Label>
          <Input
            id="financial_reports"
            value={formData.financial_reports}
            onChange={(e) => handleChange('financial_reports', e.target.value)}
            placeholder="contoh: Belum rutin diterbitkan, Diterbitkan bulanan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coa">Chart of Account (COA) *</Label>
          <Input
            id="coa"
            value={formData.coa}
            onChange={(e) => handleChange('coa', e.target.value)}
            placeholder="contoh: Belum distandardisasi, Sudah standar"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_supplier_classification">Customer & Supplier Classification *</Label>
          <Input
            id="customer_supplier_classification"
            value={formData.customer_supplier_classification}
            onChange={(e) => handleChange('customer_supplier_classification', e.target.value)}
            placeholder="contoh: Belum dilakukan, Sudah terklasifikasi"
            required
          />
        </div>

      </div>
    </div>
  );
};
