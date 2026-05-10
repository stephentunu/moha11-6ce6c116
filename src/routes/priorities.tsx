import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  HeartPulse,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";
import { useContent } from "@/lib/admin-store";
import educationImg from "@/assets/moha/moha25.jpeg";
import healthImg from "@/assets/moha/moha10.jpeg";
import businessImg from "@/assets/moha/foundation5.jpeg";
import securityImg from "@/assets/moha/moha16.jpeg";

export const Route = createFileRoute("/priorities")({
  head: () => ({
    meta: [
      { title: "Priorities — Moha Delivers | Mathare 2027" },
      {
        name: "description",
        content:
          "Education, Health & Environment, Businesses, Security & Safety — Moha's four-pillar manifesto for Mathare 2027.",
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

type Theme = {
  key: string;
  icon: typeof GraduationCap;
  title: string;
  tagline: string;
  img: string;
  color: string;
  challenges: string[];
  initiatives: string[];
  future: string[];
};

const themes: Theme[] = [
  {
    key: "education",
    icon: GraduationCap,
    title: "Education",
    tagline: "Every child reads. Every dream is funded.",
    img: educationImg,
    color: "from-blue-600/80 to-primary/90",
    challenges: [
      "Inadequate funding for needy learners",
      "Poor school infrastructure across Mathare",
      "Teachers' shortage in public schools",
      "High dropout rates due to poverty",
      "Limited access to digital learning tools",
      "Early pregnancies and gender-based barriers",
      "Insecurity around schools",
    ],
    initiatives: [
      "600+ bursaries issued to needy students",
      "60+ full sponsorships for KCSE & university candidates",
      "Distributed sanitary pads to school-going girls",
      "Donated books, stationery and uniforms",
      "Mentorship programs for boys and girls",
      "Legal education sessions for parents",
      "School feeding support during exam seasons",
      "Career guidance & counseling clinics",
      "Partnerships with local schools for remedial classes",
      "Recognition awards for top performers",
    ],
    future: [
      "Build digital learning centers in every ward",
      "Establish a TSC liaison desk for teacher deployment",
      "100% bursary coverage for KCSE candidates",
      "Modern community library & study hubs",
      "Adult literacy & second-chance schools",
      "TVET scholarship pipeline for school leavers",
    ],
  },
  {
    key: "health",
    icon: HeartPulse,
    title: "Health & Environment",
    tagline: "Clean Mathare. Healthy Mathare. Dignified care.",
    img: healthImg,
    color: "from-emerald-600/80 to-primary/90",
    challenges: [
      "Poor waste management & uncollected garbage",
      "Frequent flooding of estates and pathways",
      "Mental health crisis among youth",
      "Limited access to affordable healthcare",
      "High maternal & child mortality risk",
      "Drug and substance abuse",
      "Polluted Mathare River",
    ],
    initiatives: [
      "SHA (Social Health Authority) registration & payments for vulnerable families",
      "Wheelchair distribution to persons with disabilities",
      "Free medical camps in the wards",
      "Mama care & maternal health outreach",
      "Mental health awareness campaigns",
      "Community clean-up days across estates",
      "Sanitary pad & hygiene kit distribution",
      "Support for people living with chronic illness",
    ],
    future: [
      "Mathare River cleaning and reclamation program",
      "Establish drug rehabilitation centers",
      "24/7 ward-level community clinics",
      "Plant 100,000 indigenous trees by 2030",
      "Community-led waste recycling cooperatives",
      "Solar street lighting & proper drainage in every village",
      "Open green parks & playgrounds for children",
    ],
  },
  {
    key: "businesses",
    icon: Briefcase,
    title: "Businesses",
    tagline: "Hustle protected. Capital unlocked.",
    img: businessImg,
    color: "from-amber-600/80 to-primary/90",
    challenges: [
      "Limited access to credit and capital",
      "Poor market infrastructure & decent stalls",
      "Insecurity affecting traders, especially at night",
      "Harassment of mama mbogas and small hustlers",
      "High cost of licenses and county levies",
      "Lack of business skills and digital onboarding",
    ],
    initiatives: [
      "Mama Mboga capital revolving fund support",
      "Skills training for youth-led enterprises",
      "Networking platforms for Mathare hustlers",
      "Business listing & visibility on this platform",
      "Mentorship for young entrepreneurs",
    ],
    future: [
      "Modern markets with decent stalls — no harassment",
      "KSh 50M Mama Mboga capital fund",
      "Youth Hustler Hub: training + co-working space",
      "Cooperative SACCO support for chamas",
      "Digital onboarding & e-commerce for SMEs",
    ],
  },
  {
    key: "security",
    icon: ShieldCheck,
    title: "Security & Safety",
    tagline: "Safer streets. Lit estates. Protected families.",
    img: securityImg,
    color: "from-rose-600/80 to-primary/90",
    challenges: [
      "Insecurity at night across estates",
      "Dark, unlit pathways and alleys",
      "Gender-based violence in homes and public spaces",
      "Youth recruitment into crime",
      "Slow emergency response to incidents",
    ],
    initiatives: [
      "Community policing forums in every ward",
      "GBV awareness & survivor support sessions",
      "Engagement with Nyumba Kumi leaders",
      "Support for at-risk youth through mentorship",
    ],
    future: [
      "Solar street lighting in every village",
      "Ward-level safe spaces for women & children",
      "Rapid emergency response coordination network",
      "CCTV coverage at major hotspots",
      "Reformed-youth reintegration programs",
    ],
  },
];

function PrioritiesPage() {
  const [active, setActive] = useState(themes[0].key);
  const current = themes.find((t) => t.key === active)!;
  const [content] = useContent();

  return (
    <>
      <PageHero
        eyebrow="The Manifesto"
        title={content.prioritiesHeadline}
        subtitle={content.prioritiesSubtitle}
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

          {/* Hero card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="relative rounded-3xl overflow-hidden min-h-[320px] shadow-elegant">
                <img
                  src={current.img}
                  alt={current.title}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className={cn("absolute inset-0 bg-gradient-to-br", current.color)} />
                <div className="relative p-10 h-full flex flex-col justify-end text-white min-h-[320px]">
                  <current.icon className="h-14 w-14 text-gold mb-4" />
                  <h3 className="text-4xl md:text-5xl font-display font-black">{current.title}</h3>
                  <p className="mt-3 text-lg text-white/90 italic">{current.tagline}</p>
                </div>
              </div>

              {/* Three columns: Challenges / Initiatives / Future */}
              <div className="grid gap-6 lg:grid-cols-3">
                <PillarColumn
                  icon={AlertTriangle}
                  iconClass="text-rose-600 bg-rose-100 dark:bg-rose-900/30"
                  title="Challenges"
                  subtitle="What Mathare faces today"
                  items={current.challenges}
                />
                <PillarColumn
                  icon={CheckCircle2}
                  iconClass="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
                  title="Initiatives"
                  subtitle="What Moha is already delivering"
                  items={current.initiatives}
                />
                <PillarColumn
                  icon={Rocket}
                  iconClass="text-amber-600 bg-amber-100 dark:bg-amber-900/30"
                  title="Future Plans"
                  subtitle="What we will deliver next"
                  items={current.future}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

function PillarColumn({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  items,
}: {
  icon: typeof AlertTriangle;
  iconClass: string;
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="bg-card rounded-3xl p-7 border border-border shadow-elegant h-full">
      <div className="flex items-center gap-3 mb-5">
        <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconClass)}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h4 className="font-display font-bold text-lg leading-tight">{title}</h4>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
          >
            <span className="mt-2 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gold" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
