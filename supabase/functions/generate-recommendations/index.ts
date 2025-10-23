import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Build comprehensive context for AI
    const prompt = `Sebagai konsultan bisnis profesional, analisis hasil Business Checkup berikut dan berikan rekomendasi yang spesifik dan actionable.

PROFIL PERUSAHAAN:
- Bidang Usaha: ${assessmentData.business_field}
- Domisili: ${assessmentData.domicile}
- Cabang: ${assessmentData.num_branches}
- Staff Office: ${assessmentData.num_office_staff}
- Staff Operasional: ${assessmentData.num_operational_staff}
- Omzet Bulanan: ${assessmentData.monthly_revenue}

SKOR ORGANISASI & MANAJEMEN:
- Struktur Organisasi: ${assessmentData.org_structure_score}/100
- Job Description: ${assessmentData.job_description_score}/100
- Visi Misi: ${assessmentData.vision_mission_culture}
- Pembagian Departemen: ${assessmentData.department_division}
- Tools Management: ${assessmentData.task_management_tools}

SKOR SOP:
- Pembelian: ${assessmentData.sop_purchasing_score}/100
- Produksi: ${assessmentData.sop_production_score}/100
- Penjualan: ${assessmentData.sop_sales_score}/100
- Financial: ${assessmentData.sop_financial_score}/100
- Inventory: ${assessmentData.sop_inventory_score}/100
- Human Dev: ${assessmentData.sop_human_dev_score}/100

SKOR DOKUMENTASI:
- Dokumen Pembelian: ${assessmentData.doc_purchasing_score}/100
- Dokumen Produksi: ${assessmentData.doc_production_score}/100
- Dokumen Penjualan: ${assessmentData.doc_sales_score}/100
- Dokumen Financial: ${assessmentData.doc_financial_score}/100
- Dokumen Inventory: ${assessmentData.doc_inventory_score}/100

SKOR INVENTORY & ASET:
- Inventory Management: ${assessmentData.inventory_mgmt_score}/100
- Asset Management: ${assessmentData.asset_mgmt_score}/100

SKOR KEUANGAN:
- Sistem Pencatatan: ${assessmentData.financial_recording_score}/100
- Analisa Laporan: ${assessmentData.financial_analysis_score}/100
- Software: ${assessmentData.financial_software}

Berikan rekomendasi yang:
1. Spesifik untuk bidang usaha ${assessmentData.business_field}
2. Berdasarkan skor dan kondisi aktual perusahaan
3. Diprioritaskan dari yang paling urgent
4. Actionable dan praktis untuk diimplementasikan
5. Dalam format yang terstruktur dan mudah dipahami

Format rekomendasi dalam paragraf yang jelas, fokus pada area dengan skor rendah dan kebutuhan spesifik bisnis ini.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gxqhgmwceuqhuvrpncao.supabase.co',
        'X-Title': 'Business Checkup AI'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: `Anda adalah konsultan bisnis profesional yang ahli dalam menganalisis kondisi perusahaan dan memberikan rekomendasi strategis yang actionable. Berikan rekomendasi dalam bahasa Indonesia yang profesional namun mudah dipahami.\n\n${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const recommendations = data.choices[0].message.content;

    console.log('Recommendations generated successfully');

    return new Response(
      JSON.stringify({ recommendations }),
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
