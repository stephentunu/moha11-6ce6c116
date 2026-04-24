import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import wanjikuImg from "@/assets/moha/foundation5.jpeg";
import brianImg from "@/assets/moha/moha30.jpeg";
import atienoImg from "@/assets/moha/donation3.jpeg";
import davidImg from "@/assets/moha/foundation10.jpeg";
import sarahImg from "@/assets/moha/moha40.jpeg";
import jumaImg from "@/assets/moha/foundation1.jpeg";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Featured Stories — Moha for Mathare" },
      {
        name: "description",
        content:
          "Real testimonials from Mathare residents whose lives have been touched by Moha's work.",
      },
      { property: "og:title", content: "Featured Stories — Moha for Mathare" },
      {
        property: "og:description",
        content: "Voices of Mathare — testimonials of impact.",
      },
    ],
  }),
  component: StoriesPage,
});

const stories = [
  {
    name: "Wanjiku M.",
    role: "Mama Mboga, Mathare 4A",
    quote:
      "Moha gave me KSh 20,000 to expand my stall. Today, I employ two of my neighbors. He didn't come for votes — he came for change.",
    img: wanjikuImg,
  },
  {
    name: "Brian O.",
    role: "KCSE 2023, A- Student",
    quote:
      "I had given up on Form Four because of fees. Moha's bursary brought me back. I'm now in university studying Engineering.",
    img: brianImg,
  },
  {
    name: "Mama Atieno",
    role: "Widow & Grandmother",
    quote:
      "Every month, the foundation sends food to my house. I take care of four grandchildren. Moha is family to us.",
    img: atienoImg,
  },
  {
    name: "David K.",
    role: "Youth Boda Rider",
    quote:
      "When the county wanted to chase us from the stage, Moha came and stood with us. He fights for the small man.",
    img: davidImg,
  },
  {
    name: "Sarah N.",
    role: "PWD Entrepreneur",
    quote:
      "Moha got me a wheelchair and capital to start a tailoring shop. Now I'm independent. Mungu ambariki.",
    img: sarahImg,
  },
  {
    name: "Coach Juma",
    role: "Mathare Youth Football",
    quote:
      "He bought us full kits and pays for transport to tournaments. Our boys are now scouted by national teams.",
    img: jumaImg,
  },
];

function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Voices of Mathare"
        title="Real people. Real impact."
        subtitle="These are the stories of mama mbogas, students, elders, and youth whose lives Moha has changed — long before any campaign poster went up."
        bgImage={wanjikuImg}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => (
              <motion.article
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-2xl p-7 shadow-elegant hover:shadow-glow hover:-translate-y-1 transition-all duration-500"
              >
                <Quote className="h-8 w-8 text-gold mb-4" />
                <p className="text-foreground leading-relaxed italic">"{s.quote}"</p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/40"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
