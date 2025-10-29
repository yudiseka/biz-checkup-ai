import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface InventoryFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const InventoryForm = ({ formData, setFormData }: InventoryFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const inventoryItems = [
    {
      label: "Kode & Kategori Inventory",
      field: "inventory_code_category",
      options: [
        { value: "Sudah ada sistem kode yang terstruktur", score: 3 },
        { value: "Ada kode tapi belum sistematis", score: 2 },
        { value: "Belum ada sistem kode", score: 1 }
      ]
    },
    {
      label: "Layout Gudang",
      field: "warehouse_layout",
      options: [
        { value: "Sudah tertata rapi dan ada penandaan lokasi", score: 3 },
        { value: "Ada pengaturan tapi belum optimal", score: 2 },
        { value: "Belum ada pengaturan khusus", score: 1 }
      ]
    },
    {
      label: "Peralatan Gudang",
      field: "warehouse_equipment",
      options: [
        { value: "Lengkap (rak, forklift/hand pallet, dll)", score: 3 },
        { value: "Sebagian ada tapi belum lengkap", score: 2 },
        { value: "Belum ada peralatan khusus", score: 1 }
      ]
    },
    {
      label: "Kartu Stock / Sistem Pencatatan",
      field: "stock_card",
      options: [
        { value: "Menggunakan sistem digital yang terintegrasi", score: 3 },
        { value: "Ada pencatatan manual atau Excel", score: 2 },
        { value: "Belum ada pencatatan rutin", score: 1 }
      ]
    },
    {
      label: "Buffer Stock & Reorder Point",
      field: "buffer_stock_reorder",
      options: [
        { value: "Sudah ada sistem perhitungan yang jelas", score: 3 },
        { value: "Ada tapi berdasarkan perkiraan saja", score: 2 },
        { value: "Belum ada sistem buffer stock", score: 1 }
      ]
    },
    {
      label: "Pencatatan Aset Tetap",
      field: "fixed_asset_recording",
      options: [
        { value: "Tercatat lengkap dengan detail dan penyusutan", score: 3 },
        { value: "Tercatat tapi belum detail", score: 2 },
        { value: "Belum ada pencatatan khusus", score: 1 }
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
        <h2 className="text-2xl font-bold mb-4 text-primary">Manajemen Persediaan & Aset</h2>
        <p className="text-muted-foreground mb-6">Pilih kondisi yang paling sesuai dengan bisnis Anda</p>
      </div>

      {inventoryItems.map((item) => {
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
