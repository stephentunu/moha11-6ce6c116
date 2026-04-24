import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, HeartPulse, Briefcase, Leaf, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";
import educationImg from "@/assets/moha/moha25.jpeg";
import healthImg from "@/assets/moha/moha10.jpeg";
import businessImg from "@/assets/moha/foundation5.jpeg";
import environmentImg from "@/assets/moha/moha16.jpeg";

export const Route = createFileRoute("/priorities")({
  head: () => ({
    meta: [
      { title: "Priorities — Moha Delivers | Mathare 2027" },
      {
        name: "description",
        content:
          "Education, health, businesses, environment — Moha's four-pillar manifesto for Mathare 2027.",
      },
      { property: "og:title", content: "Priorities — Moha Delivers" },
      {
        property: "og:description",
        content: "Four pillars. One Mathare. Moha's plan for 2027.",
      },
    ],
  }),
  component: PrioritiesPage,
});

const themes = [
  {
    key: "education",
    icon: GraduationCap,
    title: "Education",
    tagline: "Every child reads. Every dream is funded.",
    img: educationImg,
    color: "from-blue-600/80 to-primary/90",
    items: [
      "100% bursary coverage for needy KCSE candidates",
      "Modern digital learning hubs in every ward",
      "Mentorship for 5,000+ Mathare students yearly",
      "Sanitary towels & books distribution program",
      "Adult literacy & second-chance schools",
    ],
  },
  {
    key: "health",
    icon: HeartPulse,
    title: "Health",
    tagline: "Affordable, dignified care close to home.",
    img: healthImg,
    color: "from-rose-600/80 to-primary/90",
    items: [
      "24/7 ward-level community clinics",
      "Free maternal & child health programs",
      "Mental health & addiction support groups",
      "NHIF/SHIF registration drives for every household",
      "Mobile clinics for unreachable estates",
    ],
  },
  {
    key: "businesses",
    icon: Briefcase,
    title: "Businesses",
    tagline: "Hustle protected. Capital unlocked.",
    img: businessImg,
    color: "from-amber-600/80 to-primary/90",
    items: [
      "Mama Mboga capital revolving fund (KSh 50M target)",
      "Youth Hustler Hub with skills training & co-working",
      "Modern markets, decent stalls, no harassment",
      "Digital onboarding for small businesses",
      "Cooperative SACCO support for chamas",
    ],
  },
  {
    key: "environment",
    icon: Leaf,
    title: "Environment",
    tagline: "Clean rivers. Green Mathare. Healthy lungs.",
    img: environmentImg,
    color: "from-emerald-600/80 to-primary/90",
    items: [
      "Mathare River reclamation & cleanup",
      "Plant 100,000 indigenous trees by 2030",
      "Community-led waste recycling cooperatives",
      "Solar street lighting in every village",
      "Open green parks & playgrounds for kids",
    ],
  },
];

function PrioritiesPage() {
  const [active, setActive] = useState(themes[0].key);
  const current = themes.find((t) => t.key === active)!;

  return (
    <>
      <PageHero
        eyebrow="The Manifesto"
        title="Four pillars. One Mathare."
        subtitle="A focused, accountable plan grounded in the lived realities of our people. Click each pillar to see the deliverables."
        bgImage={educationImg}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {themes.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all border-2",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.title}
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-8 items-stretch"
            >
              <div className="relative rounded-3xl overflow-hidden min-h-[400px] shadow-elegant">
                <img
                  src={current.img}
                  alt={current.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div
                  className={cn("absolute inset-0 bg-gradient-to-br", current.color)}
                />
                <div className="relative p-10 h-full flex flex-col justify-end text-white">
                  <current.icon className="h-14 w-14 text-gold mb-4" />
                  <h3 className="text-4xl md:text-5xl font-display font-black">
                    {current.title}
                  </h3>
                  <p className="mt-3 text-lg text-white/90 italic">{current.tagline}</p>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-elegant">
                <h4 className="text-sm font-bold tracking-widest uppercase text-primary mb-6">
                  What Moha will deliver
                </h4>
                <ul className="space-y-4">
                  {current.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex-shrink-0 h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-gold-foreground" strokeWidth={3} />
                      </span>
                      <span className="text-foreground leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
