import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questions, answers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context about what the employer is NOT doing
    const notImplemented = questions
      .filter((q: any) => answers[q.id] === 0)
      .map((q: any) => q.question);
    
    const workingOn = questions
      .filter((q: any) => answers[q.id] === 3)
      .map((q: any) => q.question);

    const systemPrompt = `You are an accessibility consultant helping employers create inclusive workplaces for employees with dyslexia. 

Based on their checklist responses, provide 3 SPECIFIC, TANGIBLE actions they can do RIGHT NOW - not "start a program" or "consider implementing", but concrete steps they can take in the next hour.

Examples of GOOD suggestions:
- "Send an email to your team: 'From now on, I'll share meeting agendas 24 hours in advance. Reply with any topics you'd like added.'"
- "Open your last company document. Add bullet points, break paragraphs into 2-3 sentences max, and add white space between sections."
- "Book a 15-minute 1-on-1 with one employee this week. Ask: 'What's one thing I could change about how we communicate that would help you work better?'"

Examples of BAD suggestions (too vague):
- "Implement a feedback system"
- "Consider offering flexible work options"
- "Train managers on accessibility"

Each action must include the EXACT words to say, specific tool to use, or precise step to take. Keep under 30 words.`;

    const userPrompt = `The employer is NOT doing these things yet: ${notImplemented.join(", ")}. They are working on: ${workingOn.join(", ")}. Give me the top 3 most impactful actions they can take RIGHT NOW with exact steps.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_actions",
              description: "Return 3 actionable suggestions for creating an inclusive workplace",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        action: { type: "string" },
                        impact: { type: "string" }
                      },
                      required: ["action", "impact"],
                      additionalProperties: false
                    },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                required: ["suggestions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_actions" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const suggestions = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(suggestions),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
