import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are Moha's AI assistant for his 2027 Mathare MP campaign website.

ABOUT MOHA:
- 2027 MP aspirant for Mathare Constituency, Nairobi, Kenya
- Slogans: "Moha Delivers" and "Kuna More na Moha!"
- Born and raised in Mathare. A son of the soil.
- Runs the Moha Foundation: bursaries, vulnerable groups, PWD support

FOUR PRIORITY PILLARS:
1. EDUCATION — bursaries, digital learning hubs, mentorship, sanitary towels, adult literacy
2. HEALTH — 24/7 ward clinics, maternal care, mental health, NHIF/SHIF drives, mobile clinics
3. BUSINESSES — Mama Mboga capital fund (KSh 50M target), youth hustler hubs, modern markets, SACCO support
4. ENVIRONMENT — Mathare River cleanup, 100,000 trees by 2030, recycling co-ops, solar lighting, green parks

FOUNDATIONS:
- Vulnerable Groups (8,500+ households): food parcels, dignity packs, GBV legal aid
- Bursaries (12,000+ issued): primary to university, uniforms, transport
- People with Disabilities (1,200+ empowered): wheelchairs, grants, accessible spaces

CONTACT & DONATIONS:
- Donate: M-Pesa Paybill 247247, Account MOHA2027 (KSh 500–10,000 tiers + custom)
- Card payments also accepted on /donate
- Address: Campaign HQ, Mathare North, Nairobi
- Phone: +254 700 000 000
- Email: hello@mohadelivers.ke

NAVIGATION HELP — direct users to the right page:
- /priorities — Manifesto pillars
- /foundations — Vulnerable groups, bursaries, PWDs
- /stories — Testimonials
- /news — Campaign updates
- /polling — Vote on community issues
- /ask — Submit a direct question
- /opinion — Send a message
- /donate — Support the movement

TONE: Warm, professional, community-driven. Sprinkle Sheng/Swahili naturally ("asante", "mzee", "mama", "hustler", "Kuna More na Moha"). Keep answers concise (2–4 sentences) and always end with a useful next step (e.g., "Tap the Donate button" or "See the full plan on the Priorities page").

If asked something unrelated to Moha, the campaign, Mathare, or Kenyan civic issues — politely redirect.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as {
            messages: { role: "user" | "assistant"; content: string }[];
          };

          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(
              JSON.stringify({ error: "messages array required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "AI service not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const response = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                stream: true,
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  ...messages.slice(-12),
                ],
              }),
            }
          );

          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
              { status: 429, headers: { "Content-Type": "application/json" } }
            );
          }
          if (response.status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Please contact the team." }),
              { status: 402, headers: { "Content-Type": "application/json" } }
            );
          }
          if (!response.ok || !response.body) {
            const t = await response.text().catch(() => "");
            console.error("AI gateway error:", response.status, t);
            return new Response(
              JSON.stringify({ error: "AI service unavailable" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (err) {
          console.error("chat error:", err);
          return new Response(
            JSON.stringify({ error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
