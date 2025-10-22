import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface CompanyInfoProps {
  assessment: any;
}

export const CompanyInfo = ({ assessment }: CompanyInfoProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Data Reviewer & Perusahaan</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Nama Reviewer</p>
          <p className="font-semibold">{assessment.reviewer_name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Jabatan</p>
          <p className="font-semibold">{assessment.reviewer_position}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-semibold">{assessment.reviewer_email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">WhatsApp</p>
          <p className="font-semibold">{assessment.reviewer_whatsapp}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Bidang Usaha</p>
          <p className="font-semibold capitalize">{assessment.business_field}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Domisili</p>
          <p className="font-semibold">{assessment.domicile}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-4">Informasi Perusahaan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">{assessment.num_branches}</p>
            <p className="text-sm text-muted-foreground">Cabang</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">{assessment.num_warehouses}</p>
            <p className="text-sm text-muted-foreground">Gudang</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">{assessment.num_office_staff}</p>
            <p className="text-sm text-muted-foreground">Staff Office</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">{assessment.num_operational_staff}</p>
            <p className="text-sm text-muted-foreground">Staff Operasional</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Software Keuangan</p>
            <p className="font-semibold">{assessment.accounting_software}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status Pajak</p>
            <p className="font-semibold">{assessment.tax_status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Omzet Bulanan</p>
            <p className="font-semibold">{assessment.monthly_revenue}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
