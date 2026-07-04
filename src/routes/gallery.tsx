import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Video, X, Tag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { listMedia, type CampaignMediaWithUrl } from "@/lib/campaign-media";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Campaign Gallery — Moha Delivers" },
      { name: "description", content: "Photos and videos from Moha's campaign trail across Mathare." },
      { property: "og:title", content: "Campaign Gallery — Moha Delivers" },
      { property: "og:description", content: "Photos and videos from Moha's campaign trail across Mathare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [items, setItems] = useState<CampaignMediaWithUrl[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [topic, setTopic] = useState<string>("all");
  const [active, setActive] = useState<CampaignMediaWithUrl | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMedia()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const topics = useMemo(() => {
    const s = new Set<string>();
    for (const i of items) if (i.topic) s.add(i.topic);
    return Array.from(s).sort();
  }, [items]);

  const shown = items.filter(
    (i) =>
      (filter === "all" || i.media_type === filter) &&
      (topic === "all" || (i.topic ?? "") === topic),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHero
        title="Campaign Gallery"
        subtitle="Photos and videos from the ground — rallies, meetings, community work."
      />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/70 border-border hover:border-primary/50"
              }`}
            >
              {f === "all" ? "All" : f === "image" ? "Photos" : "Videos"}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            {shown.length} item{shown.length === 1 ? "" : "s"}
          </span>
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => setTopic("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                topic === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/70 border-border hover:border-primary/50"
              }`}
            >
              All topics
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  topic === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground/70 border-border hover:border-primary/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading…</p>
        ) : shown.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No media uploaded yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {shown.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border hover:shadow-elegant transition"
              >
                {item.media_type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title ?? "Campaign photo"}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <>
                    <video src={item.url} className="h-full w-full object-cover" muted preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="h-10 w-10 text-white drop-shadow" />
                    </div>
                  </>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                  {item.topic && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white/90 bg-primary/80 rounded px-1.5 py-0.5 mb-1">
                      {item.topic}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {active.media_type === "image" ? (
              <img
                src={active.url}
                alt={active.title ?? ""}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={active.url}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-lg bg-black"
              />
            )}
            {(active.caption || active.topic) && (
              <div className="mt-3 text-white text-center">
                {active.topic && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-primary/80 rounded px-2 py-0.5 mb-1">
                    {active.topic}
                  </span>
                )}
                {active.caption && <p className="text-sm text-white/80">{active.caption}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
