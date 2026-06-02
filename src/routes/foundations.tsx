import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  HandHeart,
  GraduationCap,
  Accessibility,
  ArrowRight,
  Trophy,
  Sparkles,
  BookOpen,
  Store,
  Baby,
  Users,
  Clock,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/admin-store";
import { BursaryApplicationDialog } from "@/components/BursaryApplicationDialog";
import vulnerableImg from "@/assets/moha/donation3.jpeg";
import bursaryImg from "@/assets/moha/bursary1.jpeg";
import pwdImg from "@/assets/moha/moha30.jpeg";
import pwd1 from "@/assets/moha/gallery/pwd1.jpeg";
import pwd2 from "@/assets/moha/gallery/pwd2.jpeg";
import pwd3 from "@/assets/moha/gallery/pwd3.jpeg";
import pwd4 from "@/assets/moha/gallery/pwd4.jpeg";

// Youth Empowerment
import youth from "@/assets/moha/gallery/youth.jpeg";
import youth1 from "@/assets/moha/gallery/youth1.jpeg";
import empowerment from "@/assets/moha/gallery/empowerment.jpeg";
import teamMoha from "@/assets/moha/gallery/team-moha.jpeg";
import teamMoha1 from "@/assets/moha/gallery/team-moha1.jpeg";
import teamMoha2 from "@/assets/moha/gallery/team-moha2.jpeg";
import teamMohah from "@/assets/moha/gallery/team-mohah.jpeg";
import teamMoh from "@/assets/moha/gallery/team-moh.jpeg";
import team1 from "@/assets/moha/gallery/team1.jpeg";
import activities from "@/assets/moha/gallery/activities.jpeg";
import gifts from "@/assets/moha/gallery/gifts.jpeg";
import five from "@/assets/moha/gallery/five.jpeg";
import five1 from "@/assets/moha/gallery/five1.jpeg";
import five2 from "@/assets/moha/gallery/five2.jpeg";

// Sports & Talent
import soccer from "@/assets/moha/gallery/soccer.jpeg";
import soccer1 from "@/assets/moha/gallery/soccer1.jpeg";
import soccer2 from "@/assets/moha/gallery/soccer2.jpeg";
import soccer3 from "@/assets/moha/gallery/soccer3.jpeg";
import football from "@/assets/moha/gallery/football.jpeg";
import football1 from "@/assets/moha/gallery/football1.jpeg";
import football2 from "@/assets/moha/gallery/football2.jpeg";
import match from "@/assets/moha/gallery/match.jpeg";
import medals from "@/assets/moha/gallery/medals.jpeg";
import prizes from "@/assets/moha/gallery/prizes.jpeg";
import fans from "@/assets/moha/gallery/fans.jpeg";
import fans1 from "@/assets/moha/gallery/fans1.jpeg";
import fans2 from "@/assets/moha/gallery/fans2.jpeg";
import fans3 from "@/assets/moha/gallery/fans3.jpeg";
import talent from "@/assets/moha/gallery/talent.jpeg";
import talents from "@/assets/moha/gallery/talents.jpeg";
import talents1 from "@/assets/moha/gallery/talents1.jpeg";
import talents2 from "@/assets/moha/gallery/talents2.jpeg";
import talentedKids from "@/assets/moha/gallery/talented-kids.jpeg";
import talentedKids1 from "@/assets/moha/gallery/talented-kids1.jpeg";

// Education supplies
import books from "@/assets/moha/gallery/books.jpeg";
import books1 from "@/assets/moha/gallery/books1.jpeg";
import books3 from "@/assets/moha/gallery/books3.jpeg";
import books4 from "@/assets/moha/gallery/books4.jpeg";
import books5 from "@/assets/moha/gallery/books5.jpeg";
import books7 from "@/assets/moha/gallery/books7.jpeg";
import books8 from "@/assets/moha/gallery/books8.jpeg";
import books9 from "@/assets/moha/gallery/books9.jpeg";
import book2 from "@/assets/moha/gallery/book2.jpeg";
import stationery from "@/assets/moha/gallery/stationery.jpeg";
import stationery1 from "@/assets/moha/gallery/stationery1.jpeg";
import stationery2 from "@/assets/moha/gallery/stationery2.jpeg";
import stationery3 from "@/assets/moha/gallery/stationery3.jpeg";
import stationery4 from "@/assets/moha/gallery/stationery4.jpeg";
import school1 from "@/assets/moha/gallery/school1.jpeg";
import students from "@/assets/moha/gallery/students.jpeg";
import students1 from "@/assets/moha/gallery/students1.jpeg";
import education3 from "@/assets/moha/gallery/education3.jpeg";

// Local business support
import businessesImg from "@/assets/moha/gallery/businesses.jpeg";

// ECD / children
import ecd from "@/assets/moha/gallery/ecd.jpeg";
import ecd1 from "@/assets/moha/gallery/ecd1.jpeg";
import ecd2 from "@/assets/moha/gallery/ecd2.jpeg";
import children from "@/assets/moha/gallery/children.jpeg";

export const Route = createFileRoute("/foundations")({
  head: () => ({
    meta: [
      { title: "Foundations — Moha for Mathare" },
      {
        name: "description",
        content:
          "Moha's foundations: vulnerable groups, bursaries, PWDs, youth empowerment, sports & talent, school supplies, business support, and early childhood care in Mathare.",
      },
      { property: "og:title", content: "Foundations — Moha for Mathare" },
      {
        property: "og:description",
        content: "Service in action across Mathare — youth, sports, education, business and care.",
      },
    ],
  }),
  component: FoundationsPage,
});

type Foundation = {
  icon: typeof HandHeart;
  title: string;
  pill: string;
  desc: string;
  impact: string;
  img: string;
  points: string[];
  gallery: string[];
  comingSoon: string[];
};

const foundations: Foundation[] = [
  {
    icon: HandHeart,
    title: "Vulnerable Groups",
    pill: "Mama & Mzee Care",
    desc: "Monthly food parcels, dignity packs, and emergency support for widows, orphans, and elderly residents across all 5 wards of Mathare.",
    impact: "500+ households reached",
    img: vulnerableImg,
    points: [
      "Monthly food & sanitary support drives",
      "Emergency shelter for displaced families",
      "Mental health & trauma counseling",
      "Legal aid for GBV survivors",
    ],
    gallery: [vulnerableImg, gifts, activities],
    comingSoon: [
      "Permanent Mama & Mzee resource centre",
      "Monthly stipend program for elderly residents",
      "24/7 GBV rescue & safe-house network",
    ],
  },
  {
    icon: GraduationCap,
    title: "Bursaries",
    pill: "Education Fund",
    desc: "From primary school fees to university tuition — Moha's bursary program ensures no Mathare child is locked out of class because of money.",
    impact: "600+ bursaries issued",
    img: bursaryImg,
    points: [
      "100% KCSE candidate fee coverage",
      "University & TVET tuition support",
      "School uniforms & textbooks",
      "Boarding & transport stipends",
    ],
    gallery: [bursaryImg, students, students1, school1, education3],
    comingSoon: [
      "Overseas & international scholarship pipeline",
      "Mathare alumni mentorship network",
      "Digital learning labs in every ward",
    ],
  },
  {
    icon: Accessibility,
    title: "People with Disabilities",
    pill: "PWD Inclusion",
    desc: "Accessible Mathare is our promise — wheelchairs, sign-language services, ramps, and economic empowerment for our brothers and sisters living with disabilities.",
    impact: "350+ PWDs empowered",
    img: pwdImg,
    points: [
      "Free assistive devices (wheelchairs, white canes)",
      "PWD entrepreneur grants",
      "Accessible public spaces & ramps",
      "Sign-language interpreters at events",
    ],
    gallery: [pwdImg, pwd1, pwd2, pwd3, pwd4],
    comingSoon: [
      "Free electronic assistive devices rollout",
      "PWD-friendly vocational training centre",
      "Inclusive sports league for PWDs",
    ],
  },
  {
    icon: Sparkles,
    title: "Youth Empowerment",
    pill: "Team Moha on the Ground",
    desc: "Mentorship circles, skills bootcamps, and community drives that put Mathare's youth at the centre of every action — because the future is already here.",
    impact: "5,000+ youth mobilised",
    img: empowerment,
    points: [
      "Door-to-door community mobilisation",
      "Leadership & mentorship circles",
      "Civic education and voter awareness",
      "Volunteer & internship pipeline",
    ],
    gallery: [
      youth, youth1, empowerment, teamMoha, teamMoha1, teamMoha2,
      teamMohah, teamMoh, team1, activities, five, five1, five2,
    ],
    comingSoon: [
      "Recruitment & industrial attachment opportunities",
      "Youth innovation hub with free Wi-Fi",
      "Annual Mathare youth leadership summit",
    ],
  },
  {
    icon: Trophy,
    title: "Sports & Talent",
    pill: "Mathare Plays",
    desc: "From dusty pitches to medal podiums — Moha sponsors tournaments, kits, prizes, and cheers loudest when Mathare's talented kids take the stage.",
    impact: "40+ tournaments backed",
    img: soccer,
    points: [
      "Back To school tournaments",
      "Ladies tournaments",
      "Trophies and medal",
      "Adults' fun day",
    ],
    gallery: [
      soccer, soccer1, soccer2, soccer3, football, football1, football2,
      match, medals, prizes, fans, fans1, fans2, fans3,
      talent, talents, talents1, talents2, talentedKids, talentedKids1,
    ],
    comingSoon: [
      "Mathare premier league with cash prizes",
      "Talent academy for music, dance & arts",
      "Modern community sports complex",
    ],
  },
  {
    icon: BookOpen,
    title: "School Supplies",
    pill: "Books, Pens & More",
    desc: "Textbooks, exercise books, pens, rulers and full stationery kits delivered straight to learners — so the only thing standing between a child and class is their dream.",
    impact: "1,000+ supplies distributed",
    img: books,
    points: [
      "Textbooks for primary & secondary learners",
      "Exercise books, pens, pencils & rulers",
      "Full back-to-school stationery kits",
      "School-wide library top-ups",
    ],
    gallery: [
      books, books1, books3, books4, books5, books7, books8, books9, book2,
      stationery, stationery1, stationery2, stationery3, stationery4,
    ],
    comingSoon: [
      "Free school laptops & tablets program",
      "Community library in every ward",
      "Termly stationery restock drives",
    ],
  },
  {
    icon: Store,
    title: "Local Business Support",
    pill: "Hustlers First",
    desc: "Moha's team walks the markets — from mama mbogas to boda riders — backing the small businesses that keep Mathare moving.",
    impact: "1,800+ hustlers supported",
    img: businessesImg,
    points: [
      "Capital boosts for mama mbogas & kiosks",
      "Equipment & stock support",
      "Visibility on the Mathare Business Hub",
      "Mentorship for youth-led startups",
    ],
    gallery: [businessesImg],
    comingSoon: [
      "Low-interest revolving credit fund",
      "Modern market stalls & cold storage",
      "Business skills bootcamps for hustlers",
    ],
  },
  {
    icon: Baby,
    title: "Early Childhood Care",
    pill: "ECD & Kids",
    desc: "Safe, nurturing learning spaces for our youngest — because the journey to a transformed Mathare begins in the ECD classroom.",
    impact: "30+ ECD centres reached",
    img: ecd,
    points: [
      "Mentorship programs",
      "Learning materials and play kits",
      "Caregiver & teacher support",
      "Nutrition support for young learners",
    ],
    gallery: [ecd, ecd1, ecd2, children],
    comingSoon: [
      "Free daily porridge program in ECD centres",
      "Upgraded ECD classrooms & playgrounds",
      "Caregiver training & certification",
    ],
  },
];

function FoundationsPage() {
  const [content] = useContent();
  return (
    <>
      <PageHero
        eyebrow="Service in Action"
        title={content.foundationsHeadline}
        subtitle={content.foundationsSubtitle}
        bgImage={vulnerableImg}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 space-y-24">
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
                <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-glow group">
                  <img
                    src={f.img}
                    alt={f.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-primary-foreground">
                    <f.icon className="h-12 w-12 text-gold mb-3" strokeWidth={1.5} />
                    <div className="text-4xl md:text-5xl font-display font-black text-gold leading-none">
                      {f.impact.split(" ")[0]}
                    </div>
                    <div className="mt-2 text-sm font-semibold tracking-wide uppercase text-primary-foreground/90">
                      {f.impact.split(" ").slice(1).join(" ")}
                    </div>
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
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{f.desc}</p>
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

                {f.title === "Bursaries" && (
                  <div className="mt-6">
                    <BursaryApplicationDialog
                      trigger={
                        <Button variant="hero" size="lg">
                          Apply for a Bursary <ArrowRight className="h-5 w-5" />
                        </Button>
                      }
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      4-step application · You'll receive an SMS update on your application status.
                    </p>
                  </div>
                )}

                {f.comingSoon.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-xs font-bold tracking-widest uppercase text-accent">
                        Coming Soon
                      </span>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {f.comingSoon.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Gallery strip — full width below the row */}
              {f.gallery.length > 1 && (
                <div className="lg:col-span-12 mt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {f.gallery.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className="group relative aspect-square overflow-hidden rounded-xl shadow-elegant"
                      >
                        <img
                          src={img}
                          alt={`${f.title} ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Team Moha mosaic */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
              <Users className="inline h-3.5 w-3.5 mr-1" /> Team Moha
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              The hands behind every delivery
            </h2>
            <p className="mt-4 text-muted-foreground">
              Volunteers, organisers and friends of Mathare — showing up week after week.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[teamMoha, teamMoha1, teamMoha2, teamMohah, teamMoh, team1, activities, gifts, five, five1, five2, empowerment].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-elegant"
              >
                <img src={img} alt={`Team Moha ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
