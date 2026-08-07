import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are Moha's official AI assistant for his 2027 Mathare MP campaign website in Nairobi, Kenya.

ABOUT MOHA:
- 2027 MP Aspirant for Mathare Constituency, Nairobi, Kenya.
- Slogans: "Moha Delivers" and "Kuna More na Moha!"
- Born, raised, and rooted in Mathare. A true son of the soil.
- Dedicated to transparent leadership, youth empowerment, community development, and economic growth.
- Contact: Phone +254 700 000 000 | Email hello@mohadelivers.ke | Campaign HQ: Mathare North, Nairobi.

FOUR PRIORITY PILLARS:
1. EDUCATION:
   - Bursary fund: KSh 3.6M+ disbursed in Term 1 2026 alone; over 12,000 total bursaries issued to primary, JSS, secondary (Form 1-4), TVET, and university students.
   - Digital learning hubs in every ward, mentorship programs, free sanitary towel distribution for schoolgirls, and adult literacy classes.
2. HEALTH:
   - 24/7 accessible ward clinics, maternal health care support, mental health counseling, SHA/NHIF registration drives, and mobile medical clinics.
3. BUSINESSES & ECONOMIC EMPOWERMENT:
   - Mama Mboga Capital Fund (Target KSh 50M, with KSh 25M already disbursed), Youth Hustler Hubs, modern market stalls, SACCO support, and local business promotion via our /advertise directory.
4. ENVIRONMENT & INFRASTRUCTURE:
   - Mathare River cleanup and greening initiative, 100,000 trees planted by 2030, recycling co-operatives, solar street lighting, and community parks.

FOUNDATIONS & COMMUNITY IMPACT:
- Vulnerable Groups: 8,500+ households supported with food parcels, dignity packs, and legal aid for GBV survivors.
- Bursaries: 12,000+ students supported. Applications are open online at /foundations.
- People with Disabilities (PWDs): 1,200+ empowered with wheelchairs, mobility aids, business grants, and accessible infrastructure.

SYSTEM & WEBSITE KNOWLEDGE (NAVIGATION & FEATURES):
- /foundations: Online Bursary Application Portal (Multi-step form for Primary, JSS, High School, TVET, & University students. Generates instant reference code BUR-XXXXXX). Wards covered: Mabatini, Hospital, Mlango Kubwa, Kiamaiko, Mathare 4A / Ngei.
- /advertise: Mathare Local Business Directory. Residents can search businesses, filter by ward/category/payment method (Till/Paybill, Pochi la Biashara, Cash, Send Money), and submit new listings with photos.
- /donate: Support the campaign. M-Pesa Paybill: 247247 | Account: MOHA2027. Card payments accepted online. Tiers: KSh 500, 1,000, 2,500, 5,000, 10,000 or custom.
- /polling: Community polls and Service Rating system (Rate Education, Health, Security, Business Support as Best, Fairly, or Worst).
- /priorities: Comprehensive 4 Manifesto Pillars.
- /stories: Real testimonials from Grade 10 students, Mama Mboga traders, and youth leaders.
- /news: Latest campaign news and project updates.
- /ask: Submit direct questions to Moha and the campaign team.
- /opinion: Send feedback, ideas, or community concerns.
- /admin: Admin portal for campaign managers to manage bursary applications (/admin/bursaries), supporters (/admin/supporters), bulk SMS broadcasts (/admin/sms), business listings (/admin/businesses), polling data (/admin/polls), inbox messages (/admin/inbox), and content (/admin/content).

TONE: Warm, professional, community-focused, and inspiring. Use Sheng/Swahili naturally ("asante", "karibu", "mzee", "mama", "hustler", "Kuna More na Moha"). Keep answers clear, concise (2-4 sentences), and always end with a clear call-to-action or next step guiding the user to the right page or action.`;

/**
 * Intelligent fallback generator in case external AI keys are unconfigured or fail.
 * Ensures 100% uptime and deep knowledge of the whole system.
 */
function generateFallbackResponse(userPrompt: string): string {
  const q = userPrompt.toLowerCase();

  if (q.includes("bursary") || q.includes("bursaries") || q.includes("school") || q.includes("fee") || q.includes("education") || q.includes("apply")) {
    return "Moha's Education Foundation has issued over 12,000 bursaries and disbursed KSh 3.6M+ in Term 1 2026 alone! You can apply for primary, high school, TVET, or university bursaries directly on our website. Head over to the /foundations page and click 'Apply for Bursary' to fill out the form and get your reference code! 🎓";
  }

  if (q.includes("donate") || q.includes("paybill") || q.includes("money") || q.includes("support") || q.includes("contribution") || q.includes("mpesa") || q.includes("m-pesa")) {
    return "Asante sana for wanting to support the movement! You can donate via M-Pesa Paybill 247247, Account: MOHA2027. We also accept card payments directly on our website. Visit the /donate page to select your contribution tier. Kuna More na Moha! 💚";
  }

  if (q.includes("business") || q.includes("mama mboga") || q.includes("advertise") || q.includes("market") || q.includes("pochi") || q.includes("hustler")) {
    return "Moha is championing local Mathare entrepreneurs with a KSh 50M target Mama Mboga & Youth Hustler Fund (KSh 25M already disbursed!). You can also list your business or explore local Mathare traders on our business directory. Check out the /advertise page to register your business for free! 🛒";
  }

  if (q.includes("priority") || q.includes("manifesto") || q.includes("pillars") || q.includes("plan") || q.includes("agenda")) {
    return "Moha's 2027 manifesto is built on four core priority pillars: 1) Education & Bursaries, 2) Healthcare for All Wards, 3) Business & Youth Hustler Funds, and 4) Environmental Greening & Infrastructure. Discover the full details on the /priorities page! 🚀";
  }

  if (q.includes("health") || q.includes("clinic") || q.includes("hospital") || q.includes("nhif") || q.includes("sha") || q.includes("maternal")) {
    return "Under our Health pillar, Moha is establishing 24/7 accessible ward clinics, maternal care, mental health support, and mobile medical drives across Mathare wards (Mabatini, Hospital, Mlango Kubwa, Kiamaiko, Mathare 4A/Ngei). Read more on the /priorities page! 🏥";
  }

  if (q.includes("environment") || q.includes("river") || q.includes("trees") || q.includes("solar") || q.includes("clean")) {
    return "Our Environmental Pillar focuses on cleaning up the Mathare River, planting 100,000 trees by 2030, establishing recycling co-ops, and installing solar street lighting across all wards. Learn more on the /priorities page! 🌿";
  }

  if (q.includes("contact") || q.includes("office") || q.includes("location") || q.includes("phone") || q.includes("email") || q.includes("hq")) {
    return "You can reach the Moha Campaign team directly! Campaign HQ is located in Mathare North, Nairobi. Call us at +254 700 000 000 or email hello@mohadelivers.ke. You can also submit a direct question on the /ask page! 📞";
  }

  if (q.includes("admin") || q.includes("dashboard") || q.includes("manage") || q.includes("sms")) {
    return "The Admin Portal (/admin) allows authorized campaign staff to manage bursary applications, register supporters, send targeted ward SMS broadcasts, approve business listings, and track polling stats. If you are an admin, log in at /signin! 🔑";
  }

  if (q.includes("poll") || q.includes("vote") || q.includes("rating") || q.includes("opinion")) {
    return "Your voice matters in Mathare! You can vote on key community priority issues and rate constituency services (Education, Health, Security, Business Support) on our /polling page, or leave direct feedback on the /opinion page. 🗳️";
  }

  if (q.includes("who is moha") || q.includes("about") || q.includes("aspirant") || q.includes("mathare")) {
    return "Moha is a born-and-raised son of Mathare running for MP in 2027. Through the Moha Foundation, he has supported over 12,000 students with bursaries, 8,500+ vulnerable households, and 1,200+ PWDs. Slogans: 'Moha Delivers' and 'Kuna More na Moha!' Explore our journey on the /stories page! 🌟";
  }

  return "Karibu! 👋 I'm Moha's AI assistant. Ask me anything about Moha's 2027 manifesto, bursaries, business grants, donation details, or how to get involved in Mathare. You can also visit /priorities or /foundations to explore more. Kuna More na Moha! 💚";
}

/**
 * Creates an Server-Sent Events stream from text string.
 */
function streamTextResponse(text: string): Response {
  const encoder = new TextEncoder();
  const chunks = text.match(/.{1,8}/g) || [text];

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const payload = JSON.stringify({
          choices: [{ delta: { content: chunk } }],
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        await new Promise((r) => setTimeout(r, 15));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

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

          const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";

          // Check available API keys in order of preference
          const groqKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
          const openAiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
          const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
          const lovableKey = process.env.LOVABLE_API_KEY;

          // 1. Try OpenAI if key is present
          if (openAiKey) {
            try {
              const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${openAiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  stream: true,
                  messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-12)],
                }),
              });
              if (res.ok && res.body) {
                return new Response(res.body, { headers: { "Content-Type": "text/event-stream" } });
              }
            } catch (err) {
              console.warn("OpenAI API call failed, falling back to System Knowledge engine:", err);
            }
          }

          // 2. Try Groq if key is present
          if (groqKey) {
            try {
              const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${groqKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "llama-3.3-70b-versatile",
                  stream: true,
                  messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-12)],
                }),
              });
              if (res.ok && res.body) {
                return new Response(res.body, { headers: { "Content-Type": "text/event-stream" } });
              }
            } catch (err) {
              console.warn("Groq API call failed, falling back to System Knowledge engine:", err);
            }
          }

          // 3. Try Gemini if key is present
          if (geminiKey) {
            try {
              const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    contents: [
                      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                      ...messages.slice(-12).map((m) => ({
                        role: m.role === "assistant" ? "model" : "user",
                        parts: [{ text: m.content }],
                      })),
                    ],
                  }),
                }
              );
              if (geminiRes.ok) {
                const data = await geminiRes.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) return streamTextResponse(text);
              }
            } catch (err) {
              console.warn("Gemini API call failed, falling back to System Knowledge engine:", err);
            }
          }

          // 4. Try Lovable gateway if key is present
          if (lovableKey) {
            try {
              const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${lovableKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "google/gemini-3-flash-preview",
                  stream: true,
                  messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-12)],
                }),
              });
              if (res.ok && res.body) {
                return new Response(res.body, { headers: { "Content-Type": "text/event-stream" } });
              }
            } catch (err) {
              console.warn("Lovable gateway failed, falling back to System Knowledge engine:", err);
            }
          }

          // 5. High-Quality Fallback Knowledge Engine (guarantees responses work 100% of the time)
          const fallbackText = generateFallbackResponse(lastUserMsg);
          return streamTextResponse(fallbackText);
        } catch (err) {
          console.error("chat error:", err);
          const fallbackText = generateFallbackResponse("");
          return streamTextResponse(fallbackText);
        }
      },
    },
  },
});

