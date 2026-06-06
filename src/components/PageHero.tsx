import { motion } from "framer-motion";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bgImage?: string;
}

export function PageHero({ eyebrow, title, subtitle, bgImage }: Props) {
  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 bg-gradient-to-br from-primary via-[oklch(0.22_0.06_150)] to-[oklch(0.3_0.1_30)] overflow-hidden">
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/40" />
        </>
      )}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary-glow blur-3xl" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          {eyebrow && (
            <span className="inline-block px-4 py-1.5 mb-3 text-xs font-bold tracking-widest uppercase text-gold bg-gold/10 rounded-full border border-gold/30">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground text-balance leading-[1.05]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base md:text-lg text-primary-foreground/80 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
