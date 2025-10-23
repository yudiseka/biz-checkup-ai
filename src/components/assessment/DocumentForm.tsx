import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      statusField: "doc_purchasing_status",
      list: ["Purchase Request", "Purchase Order", "Receiving", "Purchase Invoice", "Purchase Return", "Bank/Cash Disbursement"]
    },
    { 
      label: "Dokumen Produksi", 
      statusField: "doc_production_status",
      list: ["Formula product", "Work Order", "Material Release", "Product Result"]
    },
    { 
      label: "Dokumen Penjualan", 
      statusField: "doc_sales_status",
      list: ["Sales Quotation", "Sales Order", "Delivery Order", "Sales Invoice", "Sales Return", "Bank/Cash Disbursement"]
    },
    { 
      label: "Dokumen Financial Management", 
      statusField: "doc_financial_status",
      list: ["Pengeluaran Kas", "Penerimaan Kas", "Pengisian Kas (Kecil/Besar)", "Reimburse / Kas Bon"]
    },
    { 
      label: "Dokumen Inventory Management", 
      statusField: "doc_inventory_status",
      list: ["Inventory Transfer", "Inventory Adjustment", "Inventory Destroyed"]
    },
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
            
            <div className="mb-4 p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium mb-2">Standar dokumen yang perlu ada:</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                {item.list.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={item.statusField}>Kondisi Bisnis Anda *</Label>
              <Textarea
                id={item.statusField}
                value={formData[item.statusField]}
                onChange={(e) => handleChange(item.statusField, e.target.value)}
                placeholder="Jelaskan kondisi dokumentasi di bisnis Anda saat ini..."
                required
                rows={4}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
