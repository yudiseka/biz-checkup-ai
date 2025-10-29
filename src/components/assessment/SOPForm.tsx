import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
    {
      label: "SOP Pembelian",
      field: "sop_purchasing_status",
      items: [
        "Prosedur permintaan pembelian",
        "Prosedur evaluasi supplier",
        "Prosedur persetujuan pembelian",
        "Prosedur penerimaan barang",
        "Prosedur pembayaran supplier"
      ]
    },
    {
      label: "SOP Produksi",
      field: "sop_production_status",
      items: [
        "Prosedur perencanaan produksi",
        "Prosedur quality control",
        "Prosedur maintenance mesin",
        "Prosedur penanganan limbah",
        "Prosedur keselamatan kerja"
      ]
    },
    {
      label: "SOP Penjualan",
      field: "sop_sales_status",
      items: [
        "Prosedur penawaran harga",
        "Prosedur penerimaan order",
        "Prosedur pengiriman barang",
        "Prosedur penagihan",
        "Prosedur komplain customer"
      ]
    },
    {
      label: "SOP Financial",
      field: "sop_financial_status",
      items: [
        "Prosedur pencatatan transaksi",
        "Prosedur persetujuan pengeluaran",
        "Prosedur rekonsiliasi bank",
        "Prosedur pelaporan keuangan",
        "Prosedur audit internal"
      ]
    },
    {
      label: "SOP Inventory",
      field: "sop_inventory_status",
      items: [
        "Prosedur stock opname",
        "Prosedur mutasi barang",
        "Prosedur pengaturan layout gudang",
        "Prosedur penanganan barang rusak",
        "Prosedur reorder point"
      ]
    },
    {
      label: "SOP Human Development",
      field: "sop_human_dev_status",
      items: [
        "Prosedur rekrutmen",
        "Prosedur onboarding karyawan",
        "Prosedur penilaian kinerja",
        "Prosedur training & development",
        "Prosedur terminasi karyawan"
      ]
    }
  ];

  const parseValue = (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return { checked: [], description: '' };
      }
    }
    return value || { checked: [], description: '' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Standard Operating Procedure (SOP)</h2>
        <p className="text-muted-foreground mb-6">Centang SOP yang sudah ada di bisnis Anda</p>
      </div>

      {sopItems.map((sopItem) => {
        const currentValue = parseValue(formData[sopItem.field]);
        
        return (
          <Card key={sopItem.field} className="p-4">
            <div className="space-y-4">
              <Label className="text-base font-semibold">{sopItem.label} *</Label>
              
              <div className="space-y-3">
                {sopItem.items.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${sopItem.field}-${item}`}
                      checked={currentValue.checked.includes(item)}
                      onCheckedChange={(checked) => {
                        const newChecked = checked
                          ? [...currentValue.checked, item]
                          : currentValue.checked.filter((i: string) => i !== item);
                        handleChange(sopItem.field, JSON.stringify({ ...currentValue, checked: newChecked }));
                      }}
                    />
                    <Label htmlFor={`${sopItem.field}-${item}`} className="font-normal cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${sopItem.field}-desc`} className="text-sm text-muted-foreground">
                  Keterangan Kondisi di Bisnis Anda (Opsional)
                </Label>
                <Textarea
                  id={`${sopItem.field}-desc`}
                  value={currentValue.description || ''}
                  onChange={(e) => 
                    handleChange(sopItem.field, JSON.stringify({ ...currentValue, description: e.target.value }))
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
