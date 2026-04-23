import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

// Official Facebook "f" logo
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.235 2.686.235v2.962h-1.514c-1.491 0-1.956.93-1.956 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

// Official X (Twitter) logo
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Official YouTube play logo
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Official TikTok logo
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const socials = [
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon, brand: "#1877F2", hoverText: "text-white" },
  { href: "https://x.com", label: "X", icon: XIcon, brand: "#000000", hoverText: "text-white" },
  { href: "https://youtube.com", label: "YouTube", icon: YouTubeIcon, brand: "#FF0000", hoverText: "text-white" },
  { href: "https://tiktok.com", label: "TikTok", icon: TikTokIcon, brand: "#000000", hoverText: "text-white" },
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
