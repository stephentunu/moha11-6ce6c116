import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HandHeart, GraduationCap, Accessibility, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import vulnerableImg from "@/assets/moha/donation3.jpeg";
import bursaryImg from "@/assets/moha/bursary1.jpeg";
import pwdImg from "@/assets/moha/moha30.jpeg";

export const Route = createFileRoute("/foundations")({
  head: () => ({
    meta: [
      { title: "Foundations — Moha for Mathare" },
      {
        name: "description",
        content:
          "Moha's foundations supporting vulnerable groups, bursaries, and people with disabilities in Mathare.",
      },
      { property: "og:title", content: "Foundations — Moha for Mathare" },
      {
        property: "og:description",
        content: "Vulnerable groups, bursaries, PWDs — service in action.",
      },
    ],
  }),
  component: FoundationsPage,
});

const foundations = [
  {
    icon: HandHeart,
    title: "Vulnerable Groups",
    pill: "Mama & Mzee Care",
    desc: "Monthly food parcels, dignity packs, and emergency support for widows, orphans, and elderly residents across all 5 wards of Mathare.",
    impact: "8,500+ households reached",
    img: vulnerableImg,
    points: [
      "Monthly food & sanitary support drives",
      "Emergency shelter for displaced families",
      "Mental health & trauma counseling",
      "Legal aid for GBV survivors",
    ],
  },
  {
    icon: GraduationCap,
    title: "Bursaries",
    pill: "Education Fund",
    desc: "From primary school fees to university tuition — Moha's bursary program ensures no Mathare child is locked out of class because of money.",
    impact: "12,000+ bursaries issued",
    img: bursaryImg,
    points: [
      "100% KCSE candidate fee coverage",
      "University & TVET tuition support",
      "School uniforms & textbooks",
      "Boarding & transport stipends",
    ],
  },
  {
    icon: Accessibility,
    title: "People with Disabilities",
    pill: "PWD Inclusion",
    desc: "Accessible Mathare is our promise — wheelchairs, sign-language services, ramps, and economic empowerment for our brothers and sisters living with disabilities.",
    impact: "1,200+ PWDs empowered",
    img: pwdImg,
    points: [
      "Free assistive devices (wheelchairs, white canes)",
      "PWD entrepreneur grants",
      "Accessible public spaces & ramps",
      "Sign-language interpreters at events",
    ],
  },
];

function FoundationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Service in Action"
        title="The Moha Foundations"
        subtitle="Long before politics, Moha has been on the ground — delivering for vulnerable groups, students, and people with disabilities. This is the work that doesn't wait for elections."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 space-y-16">
          {foundations.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-12 gap-8 items-center ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="lg:col-span-5">
                <div className="relative aspect-square max-w-md mx-auto rounded-3xl bg-gradient-primary p-10 shadow-glow flex flex-col justify-center items-center text-primary-foreground text-center">
                  <f.icon className="h-24 w-24 text-gold mb-6" strokeWidth={1.5} />
                  <div className="text-5xl font-display font-black text-gold">
                    {f.impact.split(" ")[0]}
                  </div>
                  <div className="mt-2 text-sm font-semibold tracking-wide uppercase text-primary-foreground/80">
                    {f.impact.split(" ").slice(1).join(" ")}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase text-accent bg-accent/10 rounded-full border border-accent/20">
                  {f.pill}
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground text-balance">
                  {f.title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

          <div className="text-center pt-8">
            <Button asChild variant="hero" size="lg">
              <Link to="/donate">
                Power the Foundations <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
