import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-display font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Moha Delivers — Mathare 2027" },
      {
        name: "description",
        content:
          "Moha for Mathare 2027 — a movement for education, health, business, and environment. Kuna More na Moha!",
      },
      { name: "author", content: "Moha for Mathare" },
      { property: "og:title", content: "Moha Delivers — Mathare 2027" },
      {
        property: "og:description",
        content: "A movement for Mathare. Kuna More na Moha!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Moha Delivers — Mathare 2027" },
      { name: "description", content: "Moha Mathare Connect is a campaign website for an MP aspirant, featuring AI, live polling, and donations." },
      { property: "og:description", content: "Moha Mathare Connect is a campaign website for an MP aspirant, featuring AI, live polling, and donations." },
      { name: "twitter:description", content: "Moha Mathare Connect is a campaign website for an MP aspirant, featuring AI, live polling, and donations." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/835fe492-3478-47bf-874f-fc8c7eb5c36c/id-preview-1d664b0c--09fabeb3-c879-4fa6-98a5-5780a2ba97cd.lovable.app-1777063077478.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/835fe492-3478-47bf-874f-fc8c7eb5c36c/id-preview-1d664b0c--09fabeb3-c879-4fa6-98a5-5780a2ba97cd.lovable.app-1777063077478.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
