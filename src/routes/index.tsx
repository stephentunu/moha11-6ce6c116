import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Briefcase,
  ShieldCheck,
  Users,
  Sparkles,
  Quote,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { useContent, useActivities, filterUpcoming, useBursaryWindow } from "@/lib/admin-store";
import { seoMeta, seoLinks, personJsonLd } from "@/lib/seo";
import { useState, useEffect, useMemo } from "react";
import { BursaryApplicationDialog } from "@/components/BursaryApplicationDialog";
import { Toaster } from "@/components/ui/sonner";
import heroImg from "@/assets/moha/moha-portrait.jpeg";
import rallyImg from "@/assets/moha/foundation1.jpeg";
import educationImg from "@/assets/moha/moha35.jpeg";
import healthImg from "@/assets/moha/moha10.jpeg";
import businessImg from "@/assets/moha/foundation5.jpeg";
import environmentImg from "@/assets/moha/moha16.jpeg";
import galleryImg1 from "@/assets/moha/moha1.jpeg";
import galleryImg2 from "@/assets/moha/donation3.jpeg";
import galleryImg3 from "@/assets/moha/moha40.jpeg";
import galleryImg4 from "@/assets/moha/bursary1.jpeg";
import galleryImg5 from "@/assets/moha/foundation10.jpeg";
import galleryImg6 from "@/assets/moha/moha20.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seoMeta({
      title: "Moha Delivers — Kuna More na Moha!",
      description:
        "Join the movement. Moha is the 2027 MP aspirant for Mathare delivering on education, health, business, and environment. Kuna More na Moha!",
      path: "/",
      bare: true,
    }),
    links: seoLinks("/"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(personJsonLd()) },
    ],
  }),
  component: HomePage,
});

const priorities = [
  { icon: GraduationCap, title: "Education", img: educationImg, desc: "Bursaries, sponsorships & digital learning for every Mathare child.", to: "/priorities" },
  { icon: HeartPulse, title: "Health & Environment", img: healthImg, desc: "SHA registration, clean rivers, dignified care close to home.", to: "/priorities" },
  { icon: Briefcase, title: "Businesses", img: businessImg, desc: "Capital, infrastructure & security for hustlers and mama mbogas.", to: "/priorities" },
  { icon: ShieldCheck, title: "Security & Safety", img: environmentImg, desc: "Safer streets, lit estates, and protection for every household.", to: "/priorities" },
];

const stats = [
  { value: "600+", label: "Bursaries Issued" },
  { value: "85+", label: "Community Projects" },
  { value: "30K+", label: "Lives Touched" },
  { value: "100%", label: "Mathare First" },
];

function HomePage() {
  const [content] = useContent();
  const [activitiesAll] = useActivities();
  const upcoming = filterUpcoming(activitiesAll).slice(0, 6);
  const hero = content.heroImageUrl || heroImg;
  const { language, t } = useLanguage();
  const { windowStart, windowDurationDays, loading: windowLoading } = useBursaryWindow();

  // Stable end-date timestamp — only recomputes when windowStart or the
  // configured duration changes
  const bursaryWindowEndMs = useMemo(() => {
    if (!windowStart) return null;
    const end = new Date(windowStart);
    end.setDate(end.getDate() + windowDurationDays);
    return end.getTime();
  }, [windowStart, windowDurationDays]);

  const bursaryWindowOpen = useMemo(() => {
    if (!bursaryWindowEndMs || !windowStart) return false;
    const now = Date.now();
    return now >= new Date(windowStart).getTime() && now <= bursaryWindowEndMs;
  }, [windowStart, bursaryWindowEndMs]);

  // Live countdown — interval only starts when window is open
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!bursaryWindowOpen || !bursaryWindowEndMs) return;
    const tick = () => {
      const diff = bursaryWindowEndMs - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [bursaryWindowOpen, bursaryWindowEndMs]);

  return (
    <>
      <Toaster />
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Moha standing tall in Mathare at golden hour"
            className="w-full h-full object-cover object-top md:object-[center_top]"
            width={1600}
            height={1200}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-16 pb-12">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest uppercase text-gold bg-gold/10 backdrop-blur-md rounded-full border border-gold/40"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("Mathare MP Aspirant • 2027")}
            </motion.span>
 
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[0.95] text-balance"
            >
              <span className="bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
                {t(content.homeHeadline)}
              </span>
            </motion.h1>
 
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 text-xl md:text-2xl font-display italic text-gold"
            >
              "{t(content.homeTagline)}"
            </motion.p>
 
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 text-base md:text-lg text-white/85 max-w-2xl leading-relaxed"
            >
              {t("A son of Mathare. A voice for the hustler, the student, the mama, and the mzee.")}
              {" "}
              {t("Building a constituency where every life matters and every dream has a runway.")}
            </motion.p>
 
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/donate">
                  {t("Support the Movement")} <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20"
              >
                <Link to="/priorities">{t("Read the Manifesto")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-semibold tracking-widest uppercase"
        >
          {t("Scroll")}
        </motion.div>
      </section>

      {/* BURSARY COUNTDOWN — only visible when window is open */}
      {!windowLoading && bursaryWindowOpen && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6 bg-gradient-to-r from-primary via-primary/95 to-gold/80 border-b border-gold/30"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  <span className="text-xs font-bold tracking-widest uppercase text-gold">
                    {t("Bursary Applications Open")}
                  </span>
                </div>
                <p className="text-white font-display font-bold text-xl">
                  {t("Window closes in")}:
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  {t("Closes")}{" "}
                  {bursaryWindowEndMs ? new Date(bursaryWindowEndMs).toLocaleDateString(language === "sw" ? "sw-KE" : "en-KE", {
                    weekday: "short", day: "numeric", month: "long", year: "numeric",
                  }) : null}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Countdown blocks */}
                {[
                  { value: countdown.days, label: t("Days") },
                  { value: countdown.hours, label: t("Hours") },
                  { value: countdown.minutes, label: t("Mins") },
                  { value: countdown.seconds, label: t("Secs") },
                ].map(({ value, label }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <span className="text-gold/60 font-bold text-xl hidden sm:block">:</span>}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 min-w-[60px] text-center shadow-lg">
                      <div className="text-2xl sm:text-3xl font-display font-black text-white leading-none tabular-nums">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gold mt-0.5">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <BursaryApplicationDialog
                trigger={
                  <Button
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/20 gap-2 font-bold shrink-0"
                    size="lg"
                  >
                    <GraduationCap className="h-5 w-5" />
                    {t("Apply Now")}
                  </Button>
                }
              />
            </div>
          </div>
        </motion.section>
      )}

      {/* DAILY ACTIVITIES — moved to top for easy visibility */}
      <section className="py-14 bg-gradient-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
                {t("Today & Tomorrow")}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-balance">
                {t("Daily Campaign Activities")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("Where Moha and the team will be on the ground. Activities disappear automatically after the event date.")}
              </p>
            </div>
            <div className="lg:col-span-8">
              {upcoming.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-display text-lg font-bold">{t("No public activities scheduled right now")}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {t("Check back soon — we update this calendar daily.")}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcoming.map((a, i) => (
                    <motion.article
                      key={a.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.date).toLocaleDateString(language === "sw" ? "sw-KE" : "en-KE", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                        {a.time && (
                          <>
                            <Clock className="h-3 w-3 ml-1" />
                            {a.time}
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold text-foreground">{a.title}</h3>
                      {a.description && (
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.description}</p>
                      )}
                      {(a.location || a.ward) && (
                        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-foreground/70">
                          <MapPin className="h-3 w-3 text-gold" />
                          {[a.location, a.ward].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-black text-gold">
                  {s.value}
                </div>
                <div className="mt-1 text-xs md:text-sm font-semibold tracking-wide uppercase text-primary-foreground/70">
                  {t(s.label)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIORITIES */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            eyebrow={t("Our Four Pillars")}
            title={t("What Moha is delivering")}
            subtitle={t("A focused, people-first plan grounded in the realities of Mathare — built with the community, for the community.")}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {priorities.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={p.to}
                  className="group block h-full rounded-2xl overflow-hidden bg-card border border-border shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.img}
                      alt={t(p.title)}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 h-12 w-12 rounded-xl bg-gold flex items-center justify-center shadow-gold">
                      <p.icon className="h-6 w-6 text-gold-foreground" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {t(p.title)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(p.desc)}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      {t("Explore")} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — ON THE GROUND */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            eyebrow={t("On the Ground")}
            title={t("Real work. Real Mathare.")}
            subtitle={t("Snapshots from bursary drives, water donations, school visits, and community days — the work that doesn't wait for elections.")}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[galleryImg1, galleryImg2, galleryImg3, galleryImg4, galleryImg5, galleryImg6].map(
              (img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`group relative overflow-hidden rounded-2xl shadow-elegant ${
                    i === 0 || i === 4 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"
                  }`}
                >
                  <img
                    src={img}
                    alt="Moha in the community"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* MOVEMENT BANNER */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={rallyImg}
            alt="Mathare supporters at a rally"
            loading="lazy"
            width={1600}
            height={900}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-primary-foreground"
          >
            <Quote className="h-12 w-12 text-gold mb-6" />
            <p className="text-3xl md:text-4xl font-display font-bold leading-tight text-balance">
              "{t(content.homeQuote)}"
            </p>
            <p className="mt-6 text-sm font-semibold tracking-widest uppercase text-gold">
              — {t(content.homeQuoteAuthor)}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg">
                <Link to="/foundations">
                  {t("Meet the Foundation")} <Users className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20"
              >
                <Link to="/polling">{t("Vote on the Issues")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link
              to="/ask"
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary shadow-elegant hover:shadow-glow transition-all"
            >
              <Sparkles className="h-10 w-10 text-gold mb-4" />
              <h3 className="text-2xl font-display font-bold">{t("Ask Moha")}</h3>
              <p className="mt-2 text-muted-foreground">
                {t("Your questions deserve answers. Send a question directly to Moha.")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-semibold text-primary group-hover:gap-2 transition-all">
                {t("Ask now")} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/opinion"
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary shadow-elegant hover:shadow-glow transition-all"
            >
              <Users className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-2xl font-display font-bold">{t("Share Your Opinion")}</h3>
              <p className="mt-2 text-muted-foreground">
                {t("Tell us what Mathare needs. Every voice shapes the manifesto.")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-semibold text-primary group-hover:gap-2 transition-all">
                {t("Send a message")} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}