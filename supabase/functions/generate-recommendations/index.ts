import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Model dicoba berurutan. v4.1-flash kadang menghasilkan JSON cacat saat reasoning;
// fallback v3.2 / gpt-4o-mini jauh lebih stabil untuk strict JSON.
const MODELS = [
  'deepseek/deepseek-v4.1-flash',
  'deepseek/deepseek-v3.2',
  'openai/gpt-4o-mini',
];

function cleanAndParse(content: string): any[] {
  let s = (content || '').trim();

  // Buang blok reasoning模型 reasoning
  s = s.replace(/<think>[\s\S]*?<\/think>/gi, '');
  s = s.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');

  // Buang markdown code fence
  s = s.replace(/```json/gi, '').replace(/```/g, '').trim();

  // Ambil array pertama saja (buang teks pembuka/penutup)
  const match = s.match(/\[[\s\S]*\]/);
  if (match) s = match[0];

  // Perbaiki trailing comma yang sering muncul dari model reasoning
  let normalized = s.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');

  const attempts = [
    normalized,
    normalized.replace(/\r?\n/g, '\\n'),
    normalized.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":'),
  ];

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (_) {
      // coba kandidat berikutnya
    }
  }
  throw new Error('Failed to parse AI response');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentData } = await req.json();
    if (!assessmentData || !assessmentData.id) {
      return new Response(
        JSON.stringify({ error: 'assessmentData.id wajib diisi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('Generating recommendations for:', assessmentData.business_field, assessmentData.id);

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const parseField = (field: any) => {
      if (!field) return 'N/A';
      try {
        const parsed = typeof field === 'string' ? JSON.parse(field) : field;
        if (parsed.value) return parsed.value;
        if (parsed.checked) return parsed.checked.join(', ') || 'Tidak ada';
        return field;
      } catch {
        return field;
      }
    };

    const prompt = `Anda konsultan bisnis. Analisis bisnis ini dan beri rekomendasi dalam JSON array.

Bisnis: ${assessmentData.business_field}, ${assessmentData.domicile}, ${assessmentData.num_branches} cabang, ${assessmentData.num_office_staff} staff office, ${assessmentData.num_operational_staff} staff ops, omzet ${assessmentData.monthly_revenue}

Data:
Visi/Misi: ${parseField(assessmentData.vision_mission_culture)}
Struktur Org: ${parseField(assessmentData.written_org_structure)}
Departemen: ${parseField(assessmentData.department_division)}
Job Desc: ${parseField(assessmentData.job_description_understanding)}
Kontrol Kerja: ${parseField(assessmentData.work_control_update)}
Tools: ${parseField(assessmentData.task_management_tools)}
SOP Pembelian: ${parseField(assessmentData.sop_purchasing_status)}
SOP Produksi: ${parseField(assessmentData.sop_production_status)}
SOP Penjualan: ${parseField(assessmentData.sop_sales_status)}
SOP Keuangan: ${parseField(assessmentData.sop_financial_status)}
SOP Inventory: ${parseField(assessmentData.sop_inventory_status)}
SOP HR: ${parseField(assessmentData.sop_human_dev_status)}
Dok Pembelian: ${parseField(assessmentData.doc_purchasing_status)}
Dok Produksi: ${parseField(assessmentData.doc_production_status)}
Dok Penjualan: ${parseField(assessmentData.doc_sales_status)}
Dok Keuangan: ${parseField(assessmentData.doc_financial_status)}
Dok Inventory: ${parseField(assessmentData.doc_inventory_status)}
Kode Inventory: ${parseField(assessmentData.inventory_code_category)}
Layout Gudang: ${parseField(assessmentData.warehouse_layout)}
Peralatan: ${parseField(assessmentData.warehouse_equipment)}
Kartu Stock: ${parseField(assessmentData.stock_card)}
Buffer/Reorder: ${parseField(assessmentData.buffer_stock_reorder)}
Aset Tetap: ${parseField(assessmentData.fixed_asset_recording)}
Software Keuangan: ${parseField(assessmentData.financial_software)}
Laporan Keuangan: ${parseField(assessmentData.financial_reports)}
COA: ${parseField(assessmentData.coa)}
Klasifikasi Customer/Supplier: ${parseField(assessmentData.customer_supplier_classification)}

Buat 10 item analisis terpenting.
Format JSON array valid, persis 5 kunci per item:
[{"kategori":"...","aspek":"...","kondisi":"...","pentingnya":"...","rekomendasi":"..."}]

ATURAN KETAT:
- HANYA JSON array. Tanpa markdown, tanpa ```json, tanpa penjelasan.
- Jangan pakai trailing comma.
- Semua tanda kutip di dalam nilai harus di-escape.
- Jangan pakai newline mentah di dalam nilai string.`;

    let analysis: any[] | null = null;
    let lastError = '';

    for (const model of MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 55000);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://gxqhgmwceuqhuvrpncao.supabase.co',
            'X-Title': 'Business Checkup AI'
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'Anda hanya menghasilkan JSON array yang valid. Tanpa markdown, tanpa teks tambahan, tanpa trailing comma.'
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 3000,
            temperature: 0.2
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          lastError = `OpenRouter ${response.status}: ${errText.substring(0, 200)}`;
          console.error('Model gagal:', model, lastError);
          continue;
        }

        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content;
        if (!raw) {
          lastError = `Respons kosong dari ${model}`;
          console.error(lastError);
          continue;
        }

        analysis = cleanAndParse(raw);
        console.log('Berhasil dengan model:', model, '| items:', analysis.length);
        break;
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        console.error('Exception model', model, lastError);
      }
    }

    if (!analysis) {
      throw new Error('Semua model gagal. Terakhir: ' + lastError);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('assessments')
      .update({ ai_analysis: JSON.stringify(analysis) })
      .eq('id', assessmentData.id);

    if (updateError) {
      console.error('DB update error:', updateError);
      throw new Error('Failed to update assessment');
    }

    console.log('Assessment updated successfully:', assessmentData.id);
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
