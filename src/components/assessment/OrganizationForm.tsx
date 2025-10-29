import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface OrganizationFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const OrganizationForm = ({ formData, setFormData }: OrganizationFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const organizationItems = [
    {
      label: "Visi Misi & Budaya Perusahaan",
      field: "vision_mission_culture",
      options: [
        { value: "Sudah ada dan terdokumentasi dengan baik", score: 3 },
        { value: "Ada tapi belum terdokumentasi dengan baik", score: 2 },
        { value: "Belum ada", score: 1 }
      ]
    },
    {
      label: "Struktur Organisasi Tertulis",
      field: "written_org_structure",
      options: [
        { value: "Sudah ada dan jelas", score: 3 },
        { value: "Ada tapi kurang jelas", score: 2 },
        { value: "Belum ada", score: 1 }
      ]
    },
    {
      label: "Pembagian Departemen/Divisi",
      field: "department_division",
      options: [
        { value: "Sudah terbagi dengan jelas", score: 3 },
        { value: "Sudah ada tapi belum optimal", score: 2 },
        { value: "Belum ada pembagian", score: 1 }
      ]
    },
    {
      label: "Pemahaman Job Description",
      field: "job_description_understanding",
      options: [
        { value: "Semua staff paham dan ada dokumen tertulis", score: 3 },
        { value: "Sebagian paham tapi belum terdokumentasi", score: 2 },
        { value: "Belum ada job description", score: 1 }
      ]
    },
    {
      label: "Kontrol & Update Pekerjaan",
      field: "work_control_update",
      options: [
        { value: "Ada sistem kontrol yang jelas dan rutin", score: 3 },
        { value: "Ada tapi tidak konsisten", score: 2 },
        { value: "Belum ada sistem kontrol", score: 1 }
      ]
    },
    {
      label: "Tools Management Pekerjaan",
      field: "task_management_tools",
      options: [
        { value: "Menggunakan tools digital yang terstruktur", score: 3 },
        { value: "Menggunakan tools sederhana (Excel, WhatsApp)", score: 2 },
        { value: "Belum menggunakan tools khusus", score: 1 }
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
        <h2 className="text-2xl font-bold mb-4 text-primary">Struktur Organisasi & Manajemen</h2>
        <p className="text-muted-foreground mb-6">Pilih kondisi yang paling sesuai dengan bisnis Anda</p>
      </div>

      {organizationItems.map((item) => {
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
