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

    // Make a minimal test request with retry logic
    let response: Response | undefined;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://business-checkup.app',
          'X-Title': 'Business Checkup'
        },
        body: JSON.stringify({
          model: 'tngtech/deepseek-r1t2-chimera:free',
          messages: [
            { role: 'user', content: 'test' }
          ],
          max_tokens: 5
        })
      });

      console.log(`OpenRouter status check response (attempt ${retries + 1}):`, response.status);

      // If we get 429 and have retries left, wait and retry
      if (response.status === 429 && retries < maxRetries) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Wait 1s, then 2s
        continue;
      }
      
      break;
    }

    if (!response) {
      return new Response(
        JSON.stringify({ 
          status: 'unavailable',
          message: 'Tidak dapat menghubungi AI service'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ 
          status: 'limited',
          message: 'AI sedang mengalami rate limit, coba lagi dalam beberapa saat'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (response.status === 401) {
      return new Response(
        JSON.stringify({ 
          status: 'unavailable',
          message: 'API key tidak valid'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ 
          status: 'unavailable',
          message: 'Kredit AI tidak mencukupi'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          status: 'ready',
          message: 'AI siap digunakan'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const errorText = await response.text();
    console.error('OpenRouter error:', errorText);

    return new Response(
      JSON.stringify({ 
        status: 'unavailable',
        message: 'AI tidak tersedia saat ini'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error checking AI status:', error);
    return new Response(
      JSON.stringify({ 
        status: 'unavailable',
        message: 'Tidak dapat memeriksa status AI'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
