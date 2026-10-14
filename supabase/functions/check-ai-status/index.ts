import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable',
          message: 'API key tidak dikonfigurasi'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://business-checkup.app',
        'X-Title': 'Business Checkup'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4.1-flash',
        messages: [
          { role: 'user', content: 'test' }
        ],
        max_tokens: 5
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('OpenRouter status check response:', response.status);

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ 
          status: 'limited',
          message: 'AI sedang mengalami rate limit, coba lagi dalam beberapa saat'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (response.status === 401) {
      return new Response(
        JSON.stringify({ 
          status: 'unavailable',
          message: 'API key tidak valid'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          status: 'ready',
          message: 'AI siap digunakan'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const errorText = await response.text();
    console.error('OpenRouter error:', errorText);

    return new Response(
      JSON.stringify({ 
        status: 'unavailable',
        message: 'AI tidak tersedia saat ini'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error checking AI status:', error);
    return new Response(
      JSON.stringify({ 
        status: 'unavailable',
        message: 'Tidak dapat memeriksa status AI'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
