import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentData } = await req.json();
    console.log('Generating recommendations for:', assessmentData.business_field);

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // Helper function to parse JSON responses
    const parseField = (field: any) => {
      if (!field) return 'Tidak ada data';
      try {
        const parsed = typeof field === 'string' ? JSON.parse(field) : field;
        if (parsed.value) {
          return parsed.description 
            ? `${parsed.value} (${parsed.description})`
            : parsed.value;
        }
        if (parsed.checked) {
          const checkedItems = parsed.checked.join(', ') || 'Tidak ada yang dipilih';
          return parsed.description
            ? `Yang sudah ada: ${checkedItems}. Keterangan: ${parsed.description}`
            : `Yang sudah ada: ${checkedItems}`;
        }
        return field;
      } catch {
        return field;
      }
    };

    // Build comprehensive analysis prompt for each question
    const prompt = `Anda adalah konsultan bisnis profesional. Analisis setiap aspek bisnis berikut dan berikan penjelasan mengapa penting serta rekomendasi spesifik.

PROFIL PERUSAHAAN:
- Bidang Usaha: ${assessmentData.business_field}
- Domisili: ${assessmentData.domicile}
- Cabang: ${assessmentData.num_branches}
- Staff Office: ${assessmentData.num_office_staff}
- Staff Operasional: ${assessmentData.num_operational_staff}
- Omzet Bulanan: ${assessmentData.monthly_revenue}

ORGANISASI & MANAJEMEN:
- Visi Misi & Budaya: ${parseField(assessmentData.vision_mission_culture)}
- Struktur Organisasi Tertulis: ${parseField(assessmentData.written_org_structure)}
- Pembagian Departemen: ${parseField(assessmentData.department_division)}
- Pemahaman Job Description: ${parseField(assessmentData.job_description_understanding)}
- Kontrol & Update Pekerjaan: ${parseField(assessmentData.work_control_update)}
- Tools Management: ${parseField(assessmentData.task_management_tools)}

SOP:
- SOP Pembelian: ${parseField(assessmentData.sop_purchasing_status)}
- SOP Produksi: ${parseField(assessmentData.sop_production_status)}
- SOP Penjualan: ${parseField(assessmentData.sop_sales_status)}
- SOP Financial: ${parseField(assessmentData.sop_financial_status)}
- SOP Inventory: ${parseField(assessmentData.sop_inventory_status)}
- SOP Human Dev: ${parseField(assessmentData.sop_human_dev_status)}

DOKUMENTASI:
- Dokumen Pembelian: ${parseField(assessmentData.doc_purchasing_status)}
- Dokumen Produksi: ${parseField(assessmentData.doc_production_status)}
- Dokumen Penjualan: ${parseField(assessmentData.doc_sales_status)}
- Dokumen Financial: ${parseField(assessmentData.doc_financial_status)}
- Dokumen Inventory: ${parseField(assessmentData.doc_inventory_status)}

INVENTORY & ASET:
- Kode & Kategori Inventory: ${parseField(assessmentData.inventory_code_category)}
- Layout Gudang: ${parseField(assessmentData.warehouse_layout)}
- Peralatan Gudang: ${parseField(assessmentData.warehouse_equipment)}
- Kartu Stock: ${parseField(assessmentData.stock_card)}
- Buffer Stock & Reorder: ${parseField(assessmentData.buffer_stock_reorder)}
- Pencatatan Aset Tetap: ${parseField(assessmentData.fixed_asset_recording)}

KEUANGAN:
- Software Keuangan: ${parseField(assessmentData.financial_software)}
- Laporan Keuangan: ${parseField(assessmentData.financial_reports)}
- Chart of Account: ${parseField(assessmentData.coa)}
- Klasifikasi Customer/Supplier: ${parseField(assessmentData.customer_supplier_classification)}

Untuk SETIAP aspek di atas, berikan analisis dalam format JSON array dengan struktur:
[
  {
    "kategori": "Organisasi & Manajemen",
    "aspek": "Visi Misi & Budaya",
    "kondisi": "ringkasan jawaban pengguna",
    "pentingnya": "penjelasan mengapa aspek ini penting untuk bisnis ${assessmentData.business_field}",
    "rekomendasi": "rekomendasi spesifik dan actionable"
  }
]

Berikan analisis yang:
1. Spesifik untuk bidang usaha ${assessmentData.business_field}
2. Praktis dan mudah diimplementasikan
3. Fokus pada improvement yang paling berdampak
4. Menggunakan bahasa Indonesia yang profesional namun mudah dipahami

PENTING: Response harus berupa valid JSON array saja, tanpa teks tambahan.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gxqhgmwceuqhuvrpncao.supabase.co',
        'X-Title': 'Business Checkup AI'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a professional business consultant. Always respond with valid JSON array only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error('OpenRouter API error: ' + response.status);
    }

    const data = await response.json();
    const analysisContent = data.choices[0].message.content;
    
    console.log('Analysis generated successfully');

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI analysis response');
    }

    // Update the assessment in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('assessments')
      .update({ ai_analysis: JSON.stringify(analysis) })
      .eq('id', assessmentData.id);

    if (updateError) {
      console.error('Error updating assessment:', updateError);
      throw new Error('Failed to update assessment with analysis');
    }

    console.log('Assessment updated successfully with analysis');

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
