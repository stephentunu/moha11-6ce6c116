import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

// X (Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.85a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}

const socials = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://x.com", label: "X", icon: XIcon },
  { href: "https://youtube.com", label: "YouTube", icon: Youtube },
  { href: "https://tiktok.com", label: "TikTok", icon: TikTokIcon },
];

const values = [
  "Integrity",
  "Service",
  "Inclusion",
  "Accountability",
  "Hard Work",
  "Unity",
];

const partners = [
  "Mathare Youth Sports Association",
  "Mathare Foundation",
  "Ghetto Foundation",
  "Mathare Social Justice Centre",
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-[oklch(0.18_0.05_150)] text-primary-foreground mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gold flex items-center justify-center">
                <span className="font-display font-black text-xl text-gold-foreground">M</span>
              </div>
              <div>
                <div className="font-display font-bold text-xl">MOHA</div>
                <div className="text-xs text-gold font-semibold tracking-widest uppercase">
                  Mathare 2027
                </div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              <span className="font-bold text-gold">Moha Delivers.</span> A movement
              for Mathare — building a constituency where every youth, mama, and mzee
              has dignity, opportunity, and a voice.
            </p>
            <p className="font-display italic text-gold text-lg">"Kuna More na Moha!"</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-gold">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/priorities", label: "Our Priorities" },
                { to: "/foundations", label: "Foundations" },
                { to: "/stories", label: "Featured Stories" },
                { to: "/news", label: "Top Stories" },
                { to: "/polling", label: "Community Polls" },
                { to: "/ask", label: "Ask Moha" },
                { to: "/opinion", label: "Send a Message" },
                { to: "/donate", label: "Donate" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Values + Partners */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-gold">Core Values</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {values.map((v) => (
                <span
                  key={v}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-foreground/10 border border-gold/30 text-primary-foreground/90"
                >
                  {v}
                </span>
              ))}
            </div>
            <h4 className="font-display font-bold text-lg mb-4 text-gold">Partners</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/80">
              {partners.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-gold">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/90 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                Campaign HQ, Mathare North, Nairobi
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                +254 700 000 000
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                hello@mohadelivers.ke
              </li>
            </ul>

            <h4 className="font-display font-bold text-base mb-3 text-gold">Follow the Movement</h4>
            <div className="flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-gold-foreground transition-all flex items-center justify-center group"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Moha for Mathare. Paid for by friends of Moha.</p>
          <p className="italic">Built for the people of Mathare. 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
}
