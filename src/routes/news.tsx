
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import rallyImg from "@/assets/moha/foundation1.jpeg";
import educationImg from "@/assets/moha/bursary1.jpeg";
import healthImg from "@/assets/moha/moha10.jpeg";
import environmentImg from "@/assets/moha/moha16.jpeg";
import businessImg from "@/assets/moha/foundation5.jpeg";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Top Stories — Moha Campaign News" },
      {
        name: "description",
        content: "The latest news, milestones, and updates from Moha's Mathare 2027 campaign.",
      },
      { property: "og:title", content: "Top Stories — Moha Campaign News" },
      {
        property: "og:description",
        content: "Campaign milestones, community wins, and movement updates.",
      },
    ],
  }),
  component: NewsPage,
});

const news = [
  {
    img: rallyImg,
    tag: "Movement",
    date: "Apr 18, 2026",
    title: "Moha Campaign: Mathare rallies behind Moha at Huruma Grounds",
    excerpt:
      "A historic turnout at the campaign launch as residents from all five wards came out to declare 'Kuna More na Moha!'",
    featured: true,
  },
  {
    img: educationImg,
    tag: "Education",
    date: "Apr 5, 2026",
    title: "Received 600+ students got bursary cheques",
    excerpt: "The Moha Foundation closes its biggest bursary cycle yet — KSh 3.6M disbursed.",
  },
  {
    img: healthImg,
    tag: "Health",
    date: "Mar 28, 2026",
    title: "Free legal and medical camps",
    excerpt: "BP screening, eye care, and pediatric services delivered for two days straight.",
  },
  {
    img: environmentImg,
    tag: "Environment",
    date: "Mar 15, 2026",
    title: "Mathare cleanup: Tons of waste removed",
    excerpt: "Volunteers, youth groups, and Moha's team take to the river — a new beginning.",
  },
  {
    img: businessImg,
    tag: "Business",
    date: "Mar 2, 2026",
    title: "Mama Mboga capital fund hits a milestone",
    excerpt: "Half-way to the target — 600+ mama mbogas already funded.",
  },
];

function NewsPage() {
  const [featured, ...rest] = news;
  return (
    <>
      <PageHero
        eyebrow="Top Stories"
        title="The latest from the movement"
        subtitle="Campaign milestones, community wins, and the work happening on the ground every single day."
        bgImage={rallyImg}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group rounded-3xl overflow-hidden bg-card border border-border shadow-elegant mb-12"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.title}
                  loading="lazy"
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase text-gold-foreground bg-gold rounded-full">
                    Featured • {featured.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {featured.date}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-balance">
                  {featured.title}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <button className="mt-6 inline-flex items-center gap-2 font-semibold text-primary self-start group-hover:gap-3 transition-all">
                  Read more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.article>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {rest.map((n, i) => (
              <motion.article
                key={n.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex flex-col md:flex-row gap-5 bg-card border border-border rounded-2xl overflow-hidden shadow-elegant hover:shadow-glow transition-all"
              >
                <div className="relative md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={n.img}
                    alt={n.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 md:py-6 md:pr-6 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full">
                      {n.tag}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {n.date}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors text-balance">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {n.excerpt}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
