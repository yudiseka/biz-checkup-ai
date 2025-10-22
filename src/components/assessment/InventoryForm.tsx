import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface InventoryFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const InventoryForm = ({ formData, setFormData }: InventoryFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Manajemen Persediaan & Aset</h2>
        <p className="text-muted-foreground mb-6">Evaluasi sistem inventory dan asset management</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inventory_code_category">Kode & Kategori Inventory *</Label>
          <Input
            id="inventory_code_category"
            value={formData.inventory_code_category}
            onChange={(e) => handleChange('inventory_code_category', e.target.value)}
            placeholder="contoh: Belum ada sistem, Sudah ada tapi belum terstruktur"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warehouse_layout">Layout Gudang *</Label>
          <Input
            id="warehouse_layout"
            value={formData.warehouse_layout}
            onChange={(e) => handleChange('warehouse_layout', e.target.value)}
            placeholder="contoh: Belum optimal, Sudah teratur"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warehouse_equipment">Peralatan Gudang *</Label>
          <Input
            id="warehouse_equipment"
            value={formData.warehouse_equipment}
            onChange={(e) => handleChange('warehouse_equipment', e.target.value)}
            placeholder="contoh: Belum lengkap, Sudah lengkap"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_card">Kartu Stok *</Label>
          <Input
            id="stock_card"
            value={formData.stock_card}
            onChange={(e) => handleChange('stock_card', e.target.value)}
            placeholder="contoh: Tidak tersedia / tidak update, Update secara berkala"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buffer_stock_reorder">Buffer Stock & Reorder Point *</Label>
          <Input
            id="buffer_stock_reorder"
            value={formData.buffer_stock_reorder}
            onChange={(e) => handleChange('buffer_stock_reorder', e.target.value)}
            placeholder="contoh: Belum dihitung, Sudah dihitung dan diterapkan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fixed_asset_recording">Pencatatan Aset Tetap *</Label>
          <Input
            id="fixed_asset_recording"
            value={formData.fixed_asset_recording}
            onChange={(e) => handleChange('fixed_asset_recording', e.target.value)}
            placeholder="contoh: Belum ada, Sudah ada dan teratur"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Score Inventory Management: {formData.inventory_mgmt_score}</Label>
          <Slider
            value={[formData.inventory_mgmt_score]}
            onValueChange={([value]) => handleChange('inventory_mgmt_score', value)}
            min={0}
            max={100}
            step={10}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground">0 = Sangat buruk, 100 = Sangat baik</p>
        </div>

        <div className="space-y-2">
          <Label>Score Asset Management: {formData.asset_mgmt_score}</Label>
          <Slider
            value={[formData.asset_mgmt_score]}
            onValueChange={([value]) => handleChange('asset_mgmt_score', value)}
            min={0}
            max={100}
            step={10}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground">0 = Sangat buruk, 100 = Sangat baik</p>
        </div>
      </div>
    </div>
  );
};
