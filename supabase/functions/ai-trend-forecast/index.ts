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
    const { industry, platform, targetAudience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing trends for:', industry, platform);

    const prompt = `You are a creative trend analyst specializing in digital advertising and brand design. Analyze current and emerging creative trends for:

Industry: ${industry || 'General retail/e-commerce'}
Platform: ${platform || 'Social media advertising'}
Target Audience: ${targetAudience || 'General consumers'}

Provide a comprehensive trend forecast with actionable insights. Return a JSON object with:

{
  "currentTrends": [
    {
      "name": "Trend name",
      "description": "2-3 sentence description",
      "popularity": 85,
      "growthRate": "rising/stable/declining",
      "examples": ["Example 1", "Example 2"],
      "colorPalette": ["#hex1", "#hex2", "#hex3"],
      "keyElements": ["element1", "element2", "element3"]
    }
  ],
  "emergingTrends": [
    {
      "name": "Emerging trend name",
      "description": "Description of the emerging trend",
      "predictedPeak": "Q1 2025",
      "earlyAdopters": ["Brand 1", "Brand 2"],
      "keyCharacteristics": ["char1", "char2"]
    }
  ],
  "decliningTrends": [
    {
      "name": "Declining trend",
      "reason": "Why it's declining"
    }
  ],
  "recommendations": [
    {
      "priority": "high/medium/low",
      "action": "Specific action to take",
      "expectedImpact": "Expected result"
    }
  ],
  "industryInsights": {
    "topPerformingFormats": ["Format 1", "Format 2"],
    "colorTrends": ["Color trend 1", "Color trend 2"],
    "typographyTrends": ["Font trend 1", "Font trend 2"],
    "contentThemes": ["Theme 1", "Theme 2"]
  }
}

Provide 4-6 current trends, 2-3 emerging trends, 2-3 declining trends, and 3-5 recommendations. Be specific and data-driven.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a creative trend analyst. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let trendForecast;

    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        trendForecast = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Fallback trends
      trendForecast = {
        currentTrends: [
          {
            name: "Bold Minimalism",
            description: "Clean designs with bold typography and limited color palettes. Focus on white space and impactful messaging.",
            popularity: 92,
            growthRate: "rising",
            examples: ["Apple campaigns", "Nike minimalist ads"],
            colorPalette: ["#000000", "#FFFFFF", "#FF0000"],
            keyElements: ["Large typography", "Negative space", "Single focal point"]
          },
          {
            name: "Gradient Renaissance",
            description: "Vibrant, multi-color gradients creating depth and visual interest. Popular in tech and lifestyle brands.",
            popularity: 87,
            growthRate: "stable",
            examples: ["Instagram branding", "Spotify campaigns"],
            colorPalette: ["#667EEA", "#764BA2", "#F093FB"],
            keyElements: ["Smooth transitions", "Vibrant colors", "Abstract backgrounds"]
          },
          {
            name: "Authentic Photography",
            description: "Unfiltered, genuine imagery replacing overly polished stock photos.",
            popularity: 85,
            growthRate: "rising",
            examples: ["Airbnb", "Patagonia"],
            colorPalette: ["#F4F4F4", "#333333", "#E8E8E8"],
            keyElements: ["Natural lighting", "Real people", "Candid moments"]
          }
        ],
        emergingTrends: [
          {
            name: "AI-Generated Art Integration",
            description: "Blending AI-generated visuals with traditional design elements",
            predictedPeak: "Q2 2025",
            earlyAdopters: ["Coca-Cola", "Heinz"],
            keyCharacteristics: ["Surreal imagery", "Unique textures", "Creative mashups"]
          }
        ],
        decliningTrends: [
          {
            name: "Flat Design",
            reason: "Being replaced by subtle 3D and depth elements"
          }
        ],
        recommendations: [
          {
            priority: "high",
            action: "Incorporate bold, oversized typography",
            expectedImpact: "15-20% increase in ad recall"
          },
          {
            priority: "medium",
            action: "Use authentic, candid photography",
            expectedImpact: "Higher engagement and trust"
          }
        ],
        industryInsights: {
          topPerformingFormats: ["Short-form video", "Carousel ads", "Interactive stories"],
          colorTrends: ["Deep purple", "Vibrant coral", "Electric blue"],
          typographyTrends: ["Variable fonts", "Serif revival", "Hand-drawn elements"],
          contentThemes: ["Sustainability", "Inclusivity", "Nostalgia"]
        }
      };
    }

    console.log('Generated trend forecast');

    return new Response(JSON.stringify({ trendForecast, industry, platform }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in ai-trend-forecast:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
