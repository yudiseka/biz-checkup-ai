import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
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

    // Simplified prompt - shorter to avoid timeout
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

Format JSON array: [{"kategori":"nama kategori","aspek":"nama aspek","kondisi":"kondisi saat ini","pentingnya":"mengapa penting","rekomendasi":"saran spesifik"}]

Buat 10 item analisis terpenting. HANYA JSON array, tanpa teks lain.`;

    console.log('Prompt length:', prompt.length);

    // Use abort controller with 90s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gxqhgmwceuqhuvrpncao.supabase.co',
        'X-Title': 'Business Checkup AI'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          {
            role: 'system',
            content: 'Respond ONLY with a valid JSON array. No markdown, no extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        provider: {
          sort: 'throughput'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error('OpenRouter API error: ' + response.status);
    }

    const data = await response.json();
    let analysisContent = data.choices?.[0]?.message?.content;
    
    if (!analysisContent) {
      throw new Error('Empty response from AI');
    }

    console.log('Raw AI response length:', analysisContent.length);

    // Strip thinking blocks
    if (analysisContent.includes('<think>')) {
      analysisContent = analysisContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    // Strip markdown code blocks
    if (analysisContent.includes('```')) {
      analysisContent = analysisContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    // Try to extract JSON array if there's extra text
    const jsonMatch = analysisContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      analysisContent = jsonMatch[0];
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
      console.log('Analysis parsed, items:', analysis.length);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Content:', analysisContent.substring(0, 300));
      throw new Error('Failed to parse AI response');
    }

    // Update database
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

    console.log('Assessment updated successfully');

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
