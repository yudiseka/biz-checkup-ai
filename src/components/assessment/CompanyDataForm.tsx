import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CompanyDataFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const CompanyDataForm = ({ formData, setFormData }: CompanyDataFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Data Reviewer & Perusahaan</h2>
        <p className="text-muted-foreground mb-6">Informasi dasar tentang reviewer dan perusahaan Anda</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reviewer_name">Nama Reviewer *</Label>
          <Input
            id="reviewer_name"
            value={formData.reviewer_name}
            onChange={(e) => handleChange('reviewer_name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviewer_position">Jabatan Reviewer *</Label>
          <Input
            id="reviewer_position"
            value={formData.reviewer_position}
            onChange={(e) => handleChange('reviewer_position', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviewer_email">Email *</Label>
          <Input
            id="reviewer_email"
            type="email"
            value={formData.reviewer_email}
            onChange={(e) => handleChange('reviewer_email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviewer_whatsapp">No. WhatsApp *</Label>
          <Input
            id="reviewer_whatsapp"
            value={formData.reviewer_whatsapp}
            onChange={(e) => handleChange('reviewer_whatsapp', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_field">Bidang Usaha *</Label>
          <Input
            id="business_field"
            value={formData.business_field}
            onChange={(e) => handleChange('business_field', e.target.value)}
            placeholder="contoh: retail, manufaktur, jasa"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domicile">Domisili *</Label>
          <Input
            id="domicile"
            value={formData.domicile}
            onChange={(e) => handleChange('domicile', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_branches">Jumlah Cabang *</Label>
          <Input
            id="num_branches"
            type="number"
            min="1"
            value={formData.num_branches}
            onChange={(e) => handleChange('num_branches', parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_warehouses">Jumlah Gudang *</Label>
          <Input
            id="num_warehouses"
            type="number"
            min="0"
            value={formData.num_warehouses}
            onChange={(e) => handleChange('num_warehouses', parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_office_staff">Jumlah Staff Office *</Label>
          <Input
            id="num_office_staff"
            type="number"
            min="0"
            value={formData.num_office_staff}
            onChange={(e) => handleChange('num_office_staff', parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_operational_staff">Jumlah Staff Operasional *</Label>
          <Input
            id="num_operational_staff"
            type="number"
            min="0"
            value={formData.num_operational_staff}
            onChange={(e) => handleChange('num_operational_staff', parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accounting_software">Software Keuangan *</Label>
          <Input
            id="accounting_software"
            value={formData.accounting_software}
            onChange={(e) => handleChange('accounting_software', e.target.value)}
            placeholder="contoh: Belum pakai, Accurate, Zahir"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_status">Status Pajak Perusahaan *</Label>
          <Input
            id="tax_status"
            value={formData.tax_status}
            onChange={(e) => handleChange('tax_status', e.target.value)}
            placeholder="contoh: PKP, Non PKP"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="monthly_revenue">Omzet Bulanan *</Label>
          <Input
            id="monthly_revenue"
            value={formData.monthly_revenue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              const formatted = value ? `Rp ${parseInt(value).toLocaleString('id-ID')}` : '';
              handleChange('monthly_revenue', formatted);
            }}
            placeholder="contoh: Rp 100.000.000"
            required
          />
        </div>
      </div>
    </div>
  );
};
