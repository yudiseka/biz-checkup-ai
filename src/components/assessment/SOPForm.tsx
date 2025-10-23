import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      statusField: "sop_purchasing_status",
      list: ["SOP pemilihan supplier", "SOP pengisian data supplier", "SOP permintaan pembelian", "SOP order pembelian", "SOP penerimaan barang", "SOP retur pembelian"]
    },
    { 
      label: "SOP Produksi", 
      statusField: "sop_production_status",
      list: ["SOP Pembuatan formula produk", "SOP Pengaturan schedule produksi", "SOP Surat perintah kerja produksi", "SOP Pengambilan bahan produksi", "SOP Proses produksi", "SOP Penambahan bahan produksi"]
    },
    { 
      label: "SOP Penjualan", 
      statusField: "sop_sales_status",
      list: ["SOP Penawaran barang/jasa kepada calon customer", "SOP Permintaan Penjualan", "SOP pengisian data pelanggan", "SOP pengecekan kepastian data pelanggan", "SOP pemberian nominal kredit dan jatuh tempo pelanggan", "SOP Pengiriman Barang", "SOP Retur penjualan", "SOP Diskon penjualan", "SOP Invoicing penjualan dan penagihan", "SOP Uang muka penjualan", "SOP Penerimaan pelunasan penjualan"]
    },
    { 
      label: "SOP Financial Management", 
      statusField: "sop_financial_status",
      list: ["SOP Pengisian Kas Besar/Kecil", "SOP Pengeluaran Kas/Bank", "SOP Penerimaan Kas/Bank", "SOP Kas Bon", "SOP Perijinan Piutang Karyawan", "SOP Pemindahan saldo bank ke bank lain", "SOP penyetoran kas kasir ke bank", "SOP Pembagian deviden/prive", "SOP pengeluaran tanpa bukti"]
    },
    { 
      label: "SOP Inventory Management", 
      statusField: "sop_inventory_status",
      list: ["SOP Pengkodean dan Penamaan Barang", "SOP Perhitungan dan update buffer stock", "SOP Penyimpanan barang", "SOP Penataan barang", "SOP Stock opname", "SOP Pemindahan barang", "SOP Pemusnahan barang", "SOP Penyesuaian persediaan", "SOP penggantian barang setelah opname"]
    },
    { 
      label: "SOP Human Development", 
      statusField: "sop_human_dev_status",
      list: ["SOP Pemasangan Lowongan Kerja", "SOP Pemanggilan kandidat", "SOP Interview Kerja", "SOP Deal dan Kontrak Kerja", "SOP Pelatihan SDM", "SOP Evaluasi dan Penilaian Kinerja", "SOP Ijin dan cuti karyawan", "SOP Permohonan lembur", "SOP Penggajian karyawan", "SOP Reward dan punishment", "SOP Pemutusan hubungan kerja"]
    },
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
            
            <div className="mb-4 p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium mb-2">Standar SOP yang perlu ada:</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                {item.list.map((sop, idx) => (
                  <li key={idx}>{sop}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={item.statusField}>Kondisi Bisnis Anda *</Label>
              <Textarea
                id={item.statusField}
                value={formData[item.statusField]}
                onChange={(e) => handleChange(item.statusField, e.target.value)}
                placeholder="Jelaskan kondisi SOP di bisnis Anda saat ini..."
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
