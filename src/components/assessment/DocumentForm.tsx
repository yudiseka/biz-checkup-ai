import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
    {
      label: "Dokumen Pembelian",
      field: "doc_purchasing_status",
      items: [
        "Purchase Request (PR)",
        "Purchase Order (PO)",
        "Surat Jalan Penerimaan",
        "Berita Acara Serah Terima",
        "Invoice Supplier"
      ]
    },
    {
      label: "Dokumen Produksi",
      field: "doc_production_status",
      items: [
        "Work Order",
        "Bill of Materials (BOM)",
        "Quality Control Report",
        "Production Daily Report",
        "Laporan Waste/Scrap"
      ]
    },
    {
      label: "Dokumen Penjualan",
      field: "doc_sales_status",
      items: [
        "Quotation/Penawaran Harga",
        "Sales Order (SO)",
        "Surat Jalan Pengiriman",
        "Invoice Customer",
        "Bukti Penerimaan Barang"
      ]
    },
    {
      label: "Dokumen Financial",
      field: "doc_financial_status",
      items: [
        "Bukti Kas Masuk/Keluar",
        "Bukti Bank In/Out",
        "Bukti Memorial",
        "Laporan Laba Rugi",
        "Neraca"
      ]
    },
    {
      label: "Dokumen Inventory",
      field: "doc_inventory_status",
      items: [
        "Kartu Stock",
        "Berita Acara Stock Opname",
        "Surat Mutasi Barang",
        "Laporan Persediaan",
        "Form Barang Rusak/Hilang"
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
        <h2 className="text-2xl font-bold mb-4 text-primary">Dokumen Bisnis</h2>
        <p className="text-muted-foreground mb-6">Centang dokumen yang sudah digunakan di bisnis Anda</p>
      </div>

      {documentItems.map((docItem) => {
        const currentValue = parseValue(formData[docItem.field]);
        
        return (
          <Card key={docItem.field} className="p-4">
            <div className="space-y-4">
              <Label className="text-base font-semibold">{docItem.label} *</Label>
              
              <div className="space-y-3">
                {docItem.items.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${docItem.field}-${item}`}
                      checked={currentValue.checked.includes(item)}
                      onCheckedChange={(checked) => {
                        const newChecked = checked
                          ? [...currentValue.checked, item]
                          : currentValue.checked.filter((i: string) => i !== item);
                        handleChange(docItem.field, JSON.stringify({ ...currentValue, checked: newChecked }));
                      }}
                    />
                    <Label htmlFor={`${docItem.field}-${item}`} className="font-normal cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${docItem.field}-desc`} className="text-sm text-muted-foreground">
                  Keterangan Kondisi di Bisnis Anda (Opsional)
                </Label>
                <Textarea
                  id={`${docItem.field}-desc`}
                  value={currentValue.description || ''}
                  onChange={(e) => 
                    handleChange(docItem.field, JSON.stringify({ ...currentValue, description: e.target.value }))
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
