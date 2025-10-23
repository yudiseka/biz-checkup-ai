import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OrganizationFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const OrganizationForm = ({ formData, setFormData }: OrganizationFormProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Struktur Organisasi & Manajemen</h2>
        <p className="text-muted-foreground mb-6">Evaluasi sistem organisasi dan manajemen perusahaan</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vision_mission_culture">Visi Misi dan Budaya Perusahaan *</Label>
          <Input
            id="vision_mission_culture"
            value={formData.vision_mission_culture}
            onChange={(e) => handleChange('vision_mission_culture', e.target.value)}
            placeholder="contoh: Belum ada, Sudah ada tapi belum ditempel, Sudah ada dan tertempel"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="written_org_structure">Struktur Organisasi Tertulis *</Label>
          <Input
            id="written_org_structure"
            value={formData.written_org_structure}
            onChange={(e) => handleChange('written_org_structure', e.target.value)}
            placeholder="contoh: Belum dibuat, Sebagian besar belum dibuat dan belum ditempel"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department_division">Pembagian Departemen *</Label>
          <Input
            id="department_division"
            value={formData.department_division}
            onChange={(e) => handleChange('department_division', e.target.value)}
            placeholder="contoh: Belum ada departemen yang terpisah dengan jelas"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_description_understanding">Pemahaman Job Description *</Label>
          <Input
            id="job_description_understanding"
            value={formData.job_description_understanding}
            onChange={(e) => handleChange('job_description_understanding', e.target.value)}
            placeholder="contoh: Masih rendah, belum terdefinisi dengan baik"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="work_control_update">Kontrol & Update Pekerjaan *</Label>
          <Input
            id="work_control_update"
            value={formData.work_control_update}
            onChange={(e) => handleChange('work_control_update', e.target.value)}
            placeholder="contoh: Belum rutin dilakukan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task_management_tools">Tools Task Management *</Label>
          <Input
            id="task_management_tools"
            value={formData.task_management_tools}
            onChange={(e) => handleChange('task_management_tools', e.target.value)}
            placeholder="contoh: Belum ada sistem atau aplikasi khusus"
            required
          />
        </div>

      </div>
    </div>
  );
};
