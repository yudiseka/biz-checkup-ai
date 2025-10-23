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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // First, calculate scores from descriptive answers using AI
    const scoringPrompt = `Analisis jawaban berikut dan berikan score 0-100 untuk setiap kategori berdasarkan kualitas implementasi di perusahaan ini:

PROFIL PERUSAHAAN:
- Bidang Usaha: ${assessmentData.business_field}
- Omzet Bulanan: ${assessmentData.monthly_revenue}

JAWABAN ORGANISASI & MANAJEMEN:
- Visi Misi & Budaya: ${assessmentData.vision_mission_culture}
- Struktur Organisasi Tertulis: ${assessmentData.written_org_structure}
- Pembagian Departemen: ${assessmentData.department_division}
- Pemahaman Job Description: ${assessmentData.job_description_understanding}
- Kontrol & Update Pekerjaan: ${assessmentData.work_control_update}
- Tools Management: ${assessmentData.task_management_tools}

KONDISI SOP:
- SOP Pembelian: ${assessmentData.sop_purchasing_status}
- SOP Produksi: ${assessmentData.sop_production_status}
- SOP Penjualan: ${assessmentData.sop_sales_status}
- SOP Financial: ${assessmentData.sop_financial_status}
- SOP Inventory: ${assessmentData.sop_inventory_status}
- SOP Human Dev: ${assessmentData.sop_human_dev_status}

KONDISI DOKUMENTASI:
- Dokumen Pembelian: ${assessmentData.doc_purchasing_status}
- Dokumen Produksi: ${assessmentData.doc_production_status}
- Dokumen Penjualan: ${assessmentData.doc_sales_status}
- Dokumen Financial: ${assessmentData.doc_financial_status}
- Dokumen Inventory: ${assessmentData.doc_inventory_status}

KONDISI INVENTORY & ASET:
- Pengkodean & Kategori: ${assessmentData.inventory_code_category}
- Layout Gudang: ${assessmentData.warehouse_layout}
- Peralatan Gudang: ${assessmentData.warehouse_equipment}
- Kartu Stock: ${assessmentData.stock_card}
- Buffer Stock & Reorder: ${assessmentData.buffer_stock_reorder}
- Pencatatan Aset Tetap: ${assessmentData.fixed_asset_recording}

KONDISI KEUANGAN:
- Software Keuangan: ${assessmentData.financial_software}
- Laporan Keuangan: ${assessmentData.financial_reports}
- Chart of Account: ${assessmentData.coa}
- Klasifikasi Customer/Supplier: ${assessmentData.customer_supplier_classification}

Berikan response dalam format JSON berikut (HANYA JSON, tanpa teks lain):
{
  "org_structure_score": <number 0-100>,
  "job_description_score": <number 0-100>,
  "sop_score": <number 0-100>,
  "documentation_score": <number 0-100>,
  "inventory_mgmt_score": <number 0-100>,
  "asset_mgmt_score": <number 0-100>,
  "financial_recording_score": <number 0-100>,
  "financial_analysis_score": <number 0-100>
}

Kriteria penilaian:
- 80-100: Sangat baik, lengkap dan terstruktur dengan baik
- 60-79: Baik, sudah ada tapi perlu peningkatan
- 40-59: Cukup, ada tapi belum optimal
- 20-39: Kurang, masih sangat sederhana
- 0-19: Sangat kurang atau tidak ada`;

    const scoringResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: scoringPrompt
          }
        ]
      })
    });

    if (!scoringResponse.ok) {
      const errorText = await scoringResponse.text();
      console.error('Lovable AI scoring error:', scoringResponse.status, errorText);
      throw new Error(`Lovable AI scoring error: ${scoringResponse.status}`);
    }

    const scoringData = await scoringResponse.json();
    const scoresText = scoringData.choices[0].message.content;
    
    // Extract JSON from response
    let scores;
    try {
      const jsonMatch = scoresText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scores = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      console.error('Failed to parse scores:', scoresText);
      // Use default scores if parsing fails
      scores = {
        org_structure_score: 50,
        job_description_score: 50,
        sop_score: 50,
        documentation_score: 50,
        inventory_mgmt_score: 50,
        asset_mgmt_score: 50,
        financial_recording_score: 50,
        financial_analysis_score: 50
      };
    }

    console.log('Calculated scores:', scores);

    // Now generate recommendations based on scores
    const recommendationPrompt = `Sebagai konsultan bisnis profesional, analisis hasil Business Checkup berikut dan berikan rekomendasi yang spesifik dan actionable.

PROFIL PERUSAHAAN:
- Bidang Usaha: ${assessmentData.business_field}
- Domisili: ${assessmentData.domicile}
- Cabang: ${assessmentData.num_branches}
- Staff Office: ${assessmentData.num_office_staff}
- Staff Operasional: ${assessmentData.num_operational_staff}
- Omzet Bulanan: ${assessmentData.monthly_revenue}

HASIL ANALISIS SKOR:
- Struktur Organisasi: ${scores.org_structure_score}/100
- Job Description: ${scores.job_description_score}/100
- Standar Operasional Prosedur (SOP): ${scores.sop_score}/100
- Dokumentasi: ${scores.documentation_score}/100
- Inventory Management: ${scores.inventory_mgmt_score}/100
- Asset Management: ${scores.asset_mgmt_score}/100
- Sistem Pencatatan Keuangan: ${scores.financial_recording_score}/100
- Analisa Laporan Keuangan: ${scores.financial_analysis_score}/100

KONDISI DETAIL:
Organisasi: ${assessmentData.vision_mission_culture}
SOP: ${assessmentData.sop_purchasing_status}, ${assessmentData.sop_sales_status}
Dokumentasi: ${assessmentData.doc_purchasing_status}, ${assessmentData.doc_sales_status}
Inventory: ${assessmentData.inventory_code_category}
Financial: ${assessmentData.financial_software}

Berikan rekomendasi yang:
1. Spesifik untuk bidang usaha ${assessmentData.business_field}
2. Berdasarkan skor dan kondisi aktual perusahaan
3. Diprioritaskan dari yang paling urgent (mulai dari area dengan skor terendah)
4. Actionable dan praktis untuk diimplementasikan
5. Dalam format paragraf yang terstruktur dan mudah dipahami

Format rekomendasi dalam 3-5 paragraf, fokus pada area dengan skor rendah dan kebutuhan spesifik bisnis ini.`;

    const recommendationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: `Anda adalah konsultan bisnis profesional yang ahli dalam menganalisis kondisi perusahaan dan memberikan rekomendasi strategis yang actionable. Berikan rekomendasi dalam bahasa Indonesia yang profesional namun mudah dipahami.\n\n${recommendationPrompt}`
          }
        ]
      })
    });

    if (!recommendationResponse.ok) {
      const errorText = await recommendationResponse.text();
      console.error('Lovable AI recommendation error:', recommendationResponse.status, errorText);
      throw new Error(`Lovable AI recommendation error: ${recommendationResponse.status}`);
    }

    const recommendationData = await recommendationResponse.json();
    const recommendations = recommendationData.choices[0].message.content;

    console.log('Recommendations generated successfully');

    return new Response(
      JSON.stringify({ 
        recommendations,
        scores: {
          org_structure_score: scores.org_structure_score,
          job_description_score: scores.job_description_score,
          sop_score: scores.sop_score,
          documentation_score: scores.documentation_score,
          inventory_mgmt_score: scores.inventory_mgmt_score,
          asset_mgmt_score: scores.asset_mgmt_score,
          financial_recording_score: scores.financial_recording_score,
          financial_analysis_score: scores.financial_analysis_score
        }
      }),
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
