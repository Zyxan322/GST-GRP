import { ReactNode } from "react";

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/90">
      <span className="w-8 h-px bg-primary/50" />
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-metallic ${className}`}
    >
      {children}
    </h2>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 relative overflow-hidden">
      <div className="relative mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 xl:px-10 text-center space-y-5 animate-rise">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-metallic leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-foreground/70 max-w-2xl mx-auto text-base sm:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
